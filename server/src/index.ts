import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { authMiddleware, adminOnly, AuthRequest } from './middleware';

dotenv.config();

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const PORT = process.env.PORT || 3001; // Changed to 3001 to avoid conflicts if 3000 is taken, or keep logic
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
// Allowed File Types
const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // xlsx
];

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 30 * 1024 * 1024 // 30 MB limit
    },
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type: ${file.mimetype}. Only images, PDFs, and standard documents are allowed.`));
        }
    }
});

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('user_id').limit(1);
        if (error) throw error;
        res.json({ status: 'ok', database: 'connected (supabase)' });
    } catch (error) {
        res.status(500).json({ status: 'error', database: 'disconnected', error: String(error) });
    }
});

// Stats API (accessible by any logged-in user, but data is scoped)
app.get('/api/stats', authMiddleware, async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const isAdmin = req.user.role === 'admin';

        // For non-admins, we only care about their own files
        let fileCountQuery = supabase.from('files').select('*', { count: 'exact', head: true });
        if (!isAdmin) {
            fileCountQuery = fileCountQuery.eq('owner_id', req.user.userId);
        }
        
        const { count: userFileCount, error: fileError } = await fileCountQuery;
        const finalFileCount = fileError ? 0 : (userFileCount || 0);

        let alertsCountQuery = supabase.from('alerts').select('*', { count: 'exact', head: true });
        if (!isAdmin) {
            alertsCountQuery = alertsCountQuery.eq('user_id', req.user.userId);
        }
        const { count: userAlertsCount, error: alertError } = await alertsCountQuery;
        const finalAlertsCount = alertError ? 0 : (userAlertsCount || 0);

        // If admin, we count everything. If user, we just show their file count and maybe 1 for 'users' (themselves)
        let finalUserCount = 1;
        let finalLogsCount = 0;
        let finalThreatsCount = finalAlertsCount; // Use their alerts as "threats blocked" or alerts logic 
        const counts: Record<string, number> = { files: finalFileCount, alerts: finalAlertsCount };

        if (isAdmin) {
            const tables = [
                'users', 'file_access_permission', 'login_logs', 
                'access_logs', 'alerts', 'ml_activity_data', 'sessions', 
                'audit_trail', 'admin_actions'
            ];
            
            for (const table of tables) {
                const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
                if (error) {
                    console.error(`Error fetching count for ${table}:`, error);
                    counts[table] = 0;
                } else {
                    counts[table] = count || 0;
                }
            }
            finalUserCount = counts['users'] || 1;
            finalLogsCount = counts['audit_trail'] || 0;
        }

        res.json({
            health: "Connected",
            users: finalUserCount,
            files: finalFileCount,
            alerts: finalThreatsCount,
            logs: finalLogsCount, // legacy mapping
            table_counts: counts,
            uptime: process.uptime()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// Login API
app.post('/api/auth/login', async (req, res): Promise<any> => {
    const { email, password } = req.body;
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        const ip_address = req.ip || '0.0.0.0';

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);

        // Record log
        await supabase.from('login_logs').insert({
            user_id: user.user_id,
            ip_address: String(ip_address),
            success: isValid,
            login_time: new Date().toISOString()
        });

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('user_id', user.user_id);

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
        // Check existing
        const { data: existingUser } = await supabase.from('users').select('user_id').eq('email', email).single();
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: user, error } = await supabase.from('users').insert({
            email,
            username: username || email.split('@')[0],
            password_hash: hashedPassword,
            role: role || 'user',
            status: 'active',
            created_at: new Date().toISOString()
        }).select().single();

        if (error) throw error;

        const token = jwt.sign({ userId: user.user_id, role: user.role, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { email: user.email, role: user.role, username: user.username } });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Get Current User API
app.get('/api/auth/me', async (req, res): Promise<any> => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { data: user, error } = await supabase.from('users').select('user_id, username, email, role, created_at, last_login, status').eq('user_id', decoded.userId).single();

        if (error || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});

// Upload API (any logged-in user)
app.post('/api/files/upload', authMiddleware, upload.single('file'), async (req: AuthRequest, res: any) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const description = req.body.description || '';

        // Extract user ID securely from the decoded JWT token provided by authMiddleware
        const ownerId = req.user?.userId;

        if (!ownerId) {
            return res.status(401).json({ error: 'Unauthorized: No user ID attached to session' });
        }

        // We attempt to insert description. If it fails due to missing column, we fallback to without it.
        // It's better to ensure the schema has description: `ALTER TABLE files ADD COLUMN description TEXT;`
        let insertData: any = {
            file_name: req.file.originalname,
            encrypted_path: req.file.path,
            size: req.file.size,
            checksum: "checksum_placeholder",
            owner_id: ownerId,
            upload_time: new Date().toISOString()
        };

        // Try to add description if column was successfully created by admin
        try {
            insertData.description = description;
            const { data: file, error } = await supabase.from('files').insert(insertData).select().single();
            if (error) throw error;
            return res.json({ message: 'File uploaded successfully', file });
        } catch (e: any) {
            // Fallback if description column doesn't exist yet
            delete insertData.description;
            const { data: file, error } = await supabase.from('files').insert(insertData).select().single();
            if (error) throw error;
            return res.json({ message: 'File uploaded successfully (without description)', file });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// GET /api/files - List files (scoped to logged-in user, or all if admin)
app.get('/api/files', authMiddleware, async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let query = supabase
            .from('files')
            .select('*, owner:users(email, role, username)')
            .eq('owner_id', req.user.userId)
            .order('upload_time', { ascending: false });

        const { data: files, error } = await query;

        if (error) throw error;
        res.json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch files" });
    }
});

// GET /api/users - List users (admin only)
app.get('/api/users', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
        // Manual count of files per user could be expensive or complex with Supabase directly in one query if not using views/functions.
        // Simple approach: Get users, then maybe get file counts or just ignore count for now if tricky.
        // Supabase doesn't support deep nested aggregate count easily in client logic without foreign tables.
        // We will fetch users first.
        const { data: users, error } = await supabase
            .from('users')
            .select('user_id, username, email, role, created_at, status');

        if (error) throw error;

        // For file counts, we might need a separate query or View. 
        // Keeping it simple: returning users without file count for now to verify basic integration, 
        // or we can do a secondary query if strictly needed.

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// GET /api/logs - List audit logs (admin only)
app.get('/api/logs', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
        const { data: logs, error } = await supabase
            .from('audit_trail')
            .select('*')
            .order('event_time', { ascending: false })
            .limit(100);

        if (error) throw error;
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
