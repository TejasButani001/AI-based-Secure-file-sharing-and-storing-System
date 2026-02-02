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


// Middleware to authenticate token
const authenticateToken = (req: any, res: Response, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', database: 'disconnected', error: String(error) });
    }
});

// Stats API - Global (Admin)
app.get('/api/stats', authenticateToken, async (req, res) => {
    try {
        const userCount = await prisma.user.count();
        const fileCount = await prisma.file.count();
        const logCount = await prisma.systemLog.count();
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

// Stats API - User Specific
app.get('/api/stats/me', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.userId;
        const fileCount = await prisma.file.count({ where: { ownerId: userId } });
        // Calculate total size
        const files = await prisma.file.findMany({ where: { ownerId: userId }, select: { size: true } });
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);

        // Mock active users count (global) for now, or just send user's own session data if we had it
        // For dashboard purposes, let's return some context

        res.json({
            files: fileCount,
            storageUsed: totalSize,
            activeUsers: 1, // Mock for now or real if we track sessions in DB
            alerts: 0 // Mock alerts
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user stats" });
    }
});

// Recent Activity API
app.get('/api/activity/recent', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.userId;
        // Fetch recent uploaded files as activity
        const recentFiles = await prisma.file.findMany({
            where: { ownerId: userId },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        const activities = recentFiles.map(file => ({
            id: String(file.id),
            type: 'upload',
            message: `Uploaded ${file.filename}`,
            user: 'You', // In a real shared activity log we'd show names
            time: file.createdAt
        }));

        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activity' });
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

        const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { email: user.email, role: user.role } });

    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Me API - Get current user info
app.get('/api/auth/me', authenticateToken, async (req: any, res: any) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, email: true, role: true, createdAt: true } // Don't return password
        });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Update Profile API
app.put('/api/auth/me', authenticateToken, async (req: any, res: any) => {
    const { email } = req.body; // Add name if schema supports it, currently schema only has email/password/role
    try {
        // Check if email is taken by another user
        if (email) {
            const existing = await prisma.user.findFirst({
                where: {
                    email: email,
                    NOT: { id: req.user.userId }
                }
            });
            if (existing) return res.status(400).json({ error: "Email already in use" });
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: { email },
            select: { id: true, email: true, role: true }
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Register API
app.post('/api/auth/register', async (req, res): Promise<any> => {
    const { email, password } = req.body;
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
                role: 'user', // Default role
            }
        });

        const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
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

// Get My Files API
app.get('/api/files/my', authenticateToken, async (req: any, res) => {
    try {
        const files = await prisma.file.findMany({
            where: { ownerId: req.user.userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

// Upload API
app.post('/api/files/upload', authenticateToken, upload.single('file'), async (req: any, res: any) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const ownerId = req.user.userId;

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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
