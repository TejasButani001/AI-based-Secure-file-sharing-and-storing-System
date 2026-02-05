import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
// import { db as prisma } from './mockDb'; // REMOVED
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { PrismaMssql } from '@prisma/adapter-mssql';
import sql from 'mssql';

dotenv.config();

const app = express();

// Parse connection string for mssql driver
const connectionString = process.env.DATABASE_URL || "";
// Format: sqlserver://localhost:1433;database=SecureVault;user=Tejas;password=...
const url = connectionString.replace('sqlserver://', '');
const parts = url.split(';');
const [serverPart, ...rest] = parts;
const [server, portStr] = serverPart.split(':');

const config = {
    server,
    port: portStr ? parseInt(portStr) : 1433,
    user: '',
    password: '',
    database: '',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

rest.forEach(part => {
    if (!part) return;
    const [key, value] = part.split('=');
    if (key === 'user') config.user = value;
    if (key === 'password') config.password = value;
    if (key === 'database') config.database = value;
    if (key === 'trustServerCertificate') config.options.trustServerCertificate = value === 'true';
    if (key === 'encrypt') config.options.encrypt = value === 'true';
});

console.log("Connection String:", connectionString);
console.log("Parsed Config:", config);

const adapter = new PrismaMssql(config);
const prisma = new PrismaClient({ adapter });
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
        const userCount = await prisma.users.count();
        const fileCount = await prisma.files.count();
        // const logCount = await prisma.systemLog.count(); // systemLog table removed/renamed
        const logCount = await prisma.auditTrail.count(); // Using AuditTrail as logs for now
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
    let user = null;
    try {
        user = await prisma.users.findUnique({ where: { email } });

        // Log login attempt
        const ip_address = req.ip || '0.0.0.0';

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);

        // Record log
        await prisma.loginLogs.create({
            data: {
                user_id: user.user_id,
                ip_address: String(ip_address),
                success: isValid
            }
        });

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await prisma.users.update({
            where: { user_id: user.user_id },
            data: { last_login: new Date() }
        });

        const token = jwt.sign({ userId: user.user_id, role: user.role, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { email: user.email, role: user.role, username: user.username } });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Register API
app.post('/api/auth/register', async (req, res): Promise<any> => {
    const { email, password, role, username } = req.body;
    try {
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: {
                email,
                username: username || email.split('@')[0], // Fallback if no username
                password_hash: hashedPassword,
                role: role || 'user',
                status: 'active'
            }
        });

        const token = jwt.sign({ userId: user.user_id, role: user.role, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { email: user.email, role: user.role, username: user.username } });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: 'Registration failed' });
    }
    // Get Current User API
    app.get('/api/auth/me', async (req, res): Promise<any> => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const user = await prisma.users.findUnique({
                where: { user_id: decoded.userId },
                select: {
                    user_id: true,
                    username: true,
                    email: true,
                    role: true,
                    created_at: true,
                    last_login: true,
                    status: true
                }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    });

    // Upload API
    app.post('/api/files/upload', upload.single('file'), async (req: any, res: any) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // In real app, extract user from info. Here defaulting to ID 1 or first found
            const firstUser = await prisma.users.findFirst();
            const ownerId = firstUser ? firstUser.user_id : 1;

            const file = await prisma.files.create({
                data: {
                    file_name: req.file.originalname,
                    encrypted_path: req.file.path,
                    size: req.file.size,
                    checksum: "checksum_placeholder", // Implement actual checksum if needed
                    owner_id: ownerId
                }
            });

            res.json({ message: 'File uploaded successfully', file });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Upload failed' });
        }
    });

    // GET /api/files - List files
    app.get('/api/files', async (req, res) => {
        try {
            const files = await prisma.files.findMany({
                orderBy: { upload_time: 'desc' },
                include: { owner: { select: { email: true, role: true, username: true } } }
            });
            res.json(files);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch files" });
        }
    });

    // GET /api/users - List users
    app.get('/api/users', async (req, res) => {
        try {
            const users = await prisma.users.findMany({
                select: {
                    user_id: true,
                    username: true,
                    email: true,
                    role: true,
                    created_at: true,
                    status: true,
                    _count: { select: { files: true } }
                }
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch users" });
        }
    });

    // GET /api/logs - List audit logs
    app.get('/api/logs', async (req, res) => {
        try {
            const logs = await prisma.auditTrail.findMany({
                orderBy: { event_time: 'desc' },
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
