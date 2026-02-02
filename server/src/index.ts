import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', database: 'disconnected', error: String(error) });
    }
});

// Stats API
app.get('/api/stats', async (req, res) => {
    try {
        const userCount = await prisma.user.count();
        const fileCount = await prisma.file.count();
        const logCount = await prisma.systemLog.count();
        // Mock connection health for now since we are running inside the app
        res.json({
            health: "Connected",
            users: userCount,
            files: fileCount,
            logs: logCount,
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// Login API
app.post('/api/auth/login', async (req, res): Promise<any> => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { email: user.email, role: user.role } });

    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Register API
app.post('/api/auth/register', async (req, res): Promise<any> => {
    const { email, password, role } = req.body; // Extract role
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'user', // Use provided role or default
            }
        });

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Seed endpoint (For demo purposes only - REMOVE IN PRODUCTION)
app.post('/api/seed', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {},
            create: {
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin'
            }
        });
        res.json({ message: "Seeded admin user" });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Upload API
// Note: In a real app, you'd use a middleware to verify the JWT token and get userId.
// For this demo, we'll assume a dummy userId (e.g., 1) or pass it in body (insecure but simple for demo)
app.post('/api/files/upload', upload.single('file'), async (req: any, res: any) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // In real app, extract user from token. Here we mock or get from body if possible.
        // For simplicity in this "connect database" task, we assign to the first user or admin (ID 1)
        // You can improve this by rewriting the AuthContext/Login to send Authorization header
        const ownerId = 1; // Default to Admin/First User

        const file = await prisma.file.create({
            data: {
                filename: req.file.originalname,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype,
                ownerId: ownerId
            }
        });

        res.json({ message: 'File uploaded successfully', file });
        // ... existing upload code ...
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// GET /api/files - List files
app.get('/api/files', async (req, res) => {
    try {
        // In real app, filter by ownerId unless admin
        const files = await prisma.file.findMany({
            orderBy: { createdAt: 'desc' },
            include: { owner: { select: { email: true, role: true } } }
        });
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch files" });
    }
});

// GET /api/users - List users (Admin only in real app)
app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                _count: { select: { files: true } }
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// GET /api/logs - List system logs (Admin only in real app)
app.get('/api/logs', async (req, res) => {
    try {
        const logs = await prisma.systemLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 100
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
