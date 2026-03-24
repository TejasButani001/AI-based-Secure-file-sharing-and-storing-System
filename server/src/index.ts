import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import { authMiddleware, adminOnly, AuthRequest } from './middleware';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import { detectAnomalyOnLogin, getUserBehaviorProfile } from './anomalyDetection';

dotenv.config();

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Email Transporter Configuration
console.log('[EMAIL CONFIG] Initializing email transporter...');
console.log('[EMAIL CONFIG] Service:', process.env.EMAIL_SERVICE);
console.log('[EMAIL CONFIG] User:', process.env.EMAIL_USER);
console.log('[EMAIL CONFIG] Password exists:', !!process.env.EMAIL_PASSWORD);
console.log('[EMAIL CONFIG] App Name:', process.env.APP_NAME);
console.log('[EMAIL CONFIG] App Domain:', process.env.APP_DOMAIN);

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Test transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error('[EMAIL ERROR] Transporter verification failed:', error.message);
        console.error('[EMAIL ERROR] Details:', error);
    } else {
        console.log('[EMAIL SUCCESS] Mail server is ready to take messages');
        console.log('[EMAIL SUCCESS] Sender email:', process.env.EMAIL_USER);
    }
});

// Function to send registration email
const sendRegistrationEmail = async (email: string, username: string, appName: string) => {
    try {
        console.log(`[EMAIL] ===== SENDING EMAIL =====`);
        console.log(`[EMAIL] To: ${email}`);
        console.log(`[EMAIL] From: ${process.env.EMAIL_USER}`);
        console.log(`[EMAIL] Username: ${username}`);
        console.log(`[EMAIL] App Name: ${appName}`);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Welcome to ${appName}!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0;">Welcome to ${appName}!</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <p style="color: #333; font-size: 16px;">Hello <strong>${username}</strong>,</p>
                        <p style="color: #555; font-size: 15px; line-height: 1.6;">
                            Thank you for registering with us! Your account has been successfully created.
                        </p>
                        <p style="color: #555; font-size: 15px; line-height: 1.6;">
                            You can now log in with your email and password to access all features of our secure file sharing system.
                        </p>
                        <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
                            <p style="color: #333; margin-top: 0;"><strong>Registration Details:</strong></p>
                            <p style="color: #666; margin: 5px 0;">Email: <strong>${email}</strong></p>
                            <p style="color: #666; margin: 5px 0;">Date: <strong>${new Date().toLocaleDateString()}</strong></p>
                        </div>
                        <p style="color: #555; font-size: 15px; line-height: 1.6;">
                            If you have any questions or need help, feel free to contact our support team.
                        </p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
                            Best regards,<br>
                            <strong>${appName}</strong> Team
                        </p>
                    </div>
                </div>
            `
        };

        console.log(`[EMAIL] Calling transporter.sendMail()...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] ✓ EMAIL SENT SUCCESSFULLY`);
        console.log(`[EMAIL] Response ID: ${info.response}`);
        return true;
    } catch (error: any) {
        console.error(`[EMAIL] ✗ EMAIL SEND FAILED`);
        console.error(`[EMAIL ERROR] To: ${email}`);
        console.error(`[EMAIL ERROR] Message: ${error?.message}`);
        console.error(`[EMAIL ERROR] Code: ${error?.code}`);
        console.error(`[EMAIL ERROR] Response: ${error?.response}`);
        console.error(`[EMAIL ERROR] Full error:`, error);
        return false;
    }
};

const sendPasswordResetEmail = async (email: string, resetLink: string, appName: string) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Password Reset for ${appName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0;">Password Reset</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <p style="color: #333; font-size: 16px;">Hello,</p>
                        <p style="color: #555; font-size: 15px; line-height: 1.6;">
                            We received a request to reset the password for your ${appName} account.
                        </p>
                        <p style="color: #555; font-size: 15px; line-height: 1.6;">
                            Click the button below to reset your password. This link will expire in 15 minutes.
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetLink}" style="background-color: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
                        </div>
                        <p style="color: #555; font-size: 15px; line-height: 1.6;">
                            If you did not request a password reset, you can safely ignore this email.
                        </p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
                            Best regards,<br>
                            <strong>${appName}</strong> Team
                        </p>
                    </div>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Password reset email error:', error);
        return false;
    }
};

// Multer config: keep files in memory, then persist file bytes in database.
const storage = multer.memoryStorage();
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

// Test Email Endpoint
app.post('/api/test-email', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    try {
        const success = await sendRegistrationEmail(email, 'Test User', 'SecureVault');
        if (success) {
            res.json({ message: 'Test email sent successfully!', email });
        } else {
            res.status(500).json({ error: 'Failed to send test email. Check server logs.' });
        }
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ error: 'Test email failed', details: String(error) });
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
        let fileSizeQuery = supabase.from('files').select('file_id, size, encrypted_path, owner_id');
        
        if (!isAdmin) {
            fileCountQuery = fileCountQuery.eq('owner_id', req.user.userId);
            fileSizeQuery = fileSizeQuery.eq('owner_id', req.user.userId);
        }
        
        const { count: userFileCount, error: fileError } = await fileCountQuery;
        const finalFileCount = fileError ? 0 : (userFileCount || 0);
        
        // Calculate total file size
        const { data: fileSizeData, error: sizeError } = await fileSizeQuery;
        let totalFileSize = 0;
        if (!sizeError && fileSizeData && Array.isArray(fileSizeData)) {
            console.log(`[STATS] Found ${fileSizeData.length} files for user ${req.user.userId}`);
            for (const file of fileSizeData) {
                console.log(`[STATS] File ${file.file_id}: name in DB, size in DB: ${file.size}, path: ${file.encrypted_path}`);
                if (file.size && file.size > 0) {
                    // If size is already stored in DB, use that
                    totalFileSize += file.size;
                    console.log(`[STATS] Using DB size: ${file.size}, total now: ${totalFileSize}`);
                } else if (file.encrypted_path) {
                    // Legacy rows may miss size; skip filesystem fallback because files are DB-backed.
                    console.log(`[STATS] Missing size for file_id=${file.file_id}, path marker=${file.encrypted_path}`);
                }
            }
        } else {
            console.log(`[STATS] sizeError: ${sizeError}, data: ${fileSizeData}`);
        }

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

        console.log(`[STATS] User: ${req.user.userId}, Files: ${finalFileCount}, Storage: ${totalFileSize} bytes (${(totalFileSize / (1024*1024*1024)).toFixed(2)} GB)`);

        res.json({
            health: "Connected",
            users: finalUserCount,
            files: finalFileCount,
            alerts: finalThreatsCount,
            logs: finalLogsCount, // legacy mapping
            table_counts: counts,
            uptime: process.uptime(),
            storage: {
                used: totalFileSize,
                total: 2 * 1024 * 1024 * 1024 // 2GB in bytes
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// Google OAuth API
app.post('/api/auth/google', async (req, res): Promise<any> => {
    const { credential } = req.body;
    if (!credential) {
        return res.status(400).json({ error: 'Google access token is required' });
    }
    try {
        // Verify access token via Google's UserInfo endpoint
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${credential}` }
        });
        if (!googleRes.ok) {
            return res.status(401).json({ error: 'Invalid or expired Google token' });
        }
        const googleUser: any = await googleRes.json();
        const { email, name, sub: googleId } = googleUser;
        if (!email) return res.status(401).json({ error: 'Could not get email from Google' });
        const username = name || email.split('@')[0];

        // Check if user already exists
        let { data: user, error: findError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user) {
            // Create new user — no password (Google-only account)
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                    email,
                    username,
                    password_hash: await bcrypt.hash(googleId + 'google_oauth', 10), // placeholder hash
                    role: 'user',
                    status: 'active',
                    created_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (createError || !newUser) {
                return res.status(500).json({ error: 'Failed to create Google user' });
            }
            user = newUser;
        }

        // Update last login
        await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('user_id', user.user_id);

        // Record login log
        await supabase.from('login_logs').insert({
            user_id: user.user_id,
            ip_address: req.ip || '0.0.0.0',
            success: true,
            login_time: new Date().toISOString(),
        });

        const token = jwt.sign(
            { userId: user.user_id, role: user.role, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { email: user.email, role: user.role, username: user.username } });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(401).json({ error: 'Google authentication failed' });
    }
});

// Login API
// Login API with anomaly detection
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

        // Run anomaly detection on successful login
        try {
            const anomalyScore = await detectAnomalyOnLogin(
                user.user_id,
                String(ip_address),
                req.get('user-agent')
            );
            console.log('[LOGIN] Anomaly detection result:', anomalyScore);
        } catch (anomalyError) {
            console.error('[LOGIN] Anomaly detection failed (non-critical):', anomalyError);
            // Continue with login even if anomaly detection fails
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
        console.log(`[REGISTER] New registration attempt for email: ${email}, username: ${username}`);
        
        // Check existing
        const { data: existingUser } = await supabase.from('users').select('user_id').eq('email', email).single();
        if (existingUser) {
            console.log(`[REGISTER] User already exists: ${email}`);
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

        if (error) {
            console.error(`[REGISTER] Database insert error for ${email}:`, error);
            throw error;
        }

        console.log(`[REGISTER] User created successfully: ${email} with ID: ${user.user_id}`);

        // Send registration email
        const appName = process.env.APP_NAME || 'SecureVault';
        console.log(`[REGISTER] Attempting to send registration email to: ${email}`);
        const emailResult = await sendRegistrationEmail(email, user.username || email.split('@')[0], appName);
        console.log(`[REGISTER] Email send result: ${emailResult ? 'SUCCESS' : 'FAILED'}`);

        const token = jwt.sign({ userId: user.user_id, role: user.role, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        console.log(`[REGISTER] Registration completed successfully for: ${email}`);
        res.json({ token, user: { email: user.email, role: user.role, username: user.username } });
    } catch (error: any) {
        console.error("[REGISTER] Registration error:", error?.message || error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Forgot Password API
app.post('/api/auth/forgot-password', async (req, res): Promise<any> => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        const { data: user, error } = await supabase.from('users').select('user_id, email').eq('email', email).single();
        if (error || !user) {
            // Return success even if not found to prevent email enumeration
            return res.json({ message: 'If an account exists, a reset link was sent.' });
        }

        const resetToken = jwt.sign({ email: user.email, userId: user.user_id, purpose: 'password_reset' }, JWT_SECRET, { expiresIn: '15m' });
        
        // Ensure frontend domain is correct (can be configured in env)
        const origin = req.headers.origin || req.headers.referer;
        const appDomain = origin ? (origin.endsWith('/') ? origin.slice(0, -1) : origin) : 'http://localhost:8080';
            
        const resetLink = `${appDomain}/reset-password?token=${resetToken}`;
        const appName = process.env.APP_NAME || 'SecureVault';
        
        await sendPasswordResetEmail(email, resetLink, appName);
        res.json({ message: 'If an account exists, a reset link was sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

// Reset Password API
app.post('/api/auth/reset-password', async (req, res): Promise<any> => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token and newPassword are required' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (decoded.purpose !== 'password_reset') {
            return res.status(400).json({ error: 'Invalid token purpose' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const { error } = await supabase.from('users').update({ password_hash: hashedPassword }).eq('email', decoded.email);

        if (error) throw error;

        // Log the event securely
        await supabase.from('audit_trail').insert({
            user_id: decoded.userId,
            event: 'password_reset',
            details: 'User successfully reset their password via email link',
            event_time: new Date().toISOString()
        });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({ error: 'Invalid or expired reset token' });
    }
});

// Delete User by Email (for testing/cleanup)
app.delete('/api/admin/user/:email', async (req, res): Promise<any> => {
    const { email } = req.params;
    try {
        console.log(`[ADMIN] Attempting to delete user: ${email}`);
        const { error } = await supabase.from('users').delete().eq('email', email);
        
        if (error) {
            console.error(`[ADMIN] Failed to delete user: ${email}`, error);
            return res.status(500).json({ error: 'Failed to delete user' });
        }
        
        console.log(`[ADMIN] User deleted successfully: ${email}`);
        res.json({ message: `User ${email} deleted successfully` });
    } catch (error: any) {
        console.error("[ADMIN] Delete user error:", error?.message || error);
        res.status(500).json({ error: 'Failed to delete user' });
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

        const fileSize = req.file.size;
        const mimeType = req.file.mimetype;
        const fileDataBase64 = req.file.buffer.toString('base64');

        const insertData: Record<string, unknown> = {
            file_name: req.file.originalname,
            encrypted_path: 'db://inline',
            size: fileSize,
            checksum: "checksum_placeholder",
            owner_id: ownerId,
            upload_time: new Date().toISOString(),
            mime_type: mimeType,
            file_data: fileDataBase64
        };

        // If description column exists, save it; otherwise continue without it.
        try {
            insertData.description = description;
            const { data: file, error } = await supabase.from('files').insert(insertData).select().single();
            if (error) throw error;
            return res.json({ message: 'File uploaded successfully', file });
        } catch {
            // Fallback if description column does not exist.
            delete insertData.description;
            try {
                const { data: file, error } = await supabase.from('files').insert(insertData).select().single();
                if (error) throw error;
                return res.json({ message: 'File uploaded successfully', file });
            } catch {
                // Legacy schema fallback: persist base64 payload in encrypted_path when mime/file_data columns are absent.
                const legacyInsertData: Record<string, unknown> = {
                    file_name: req.file.originalname,
                    encrypted_path: `db64:${fileDataBase64}`,
                    size: fileSize,
                    checksum: `mime:${mimeType}`,
                    owner_id: ownerId,
                    upload_time: new Date().toISOString()
                };

                const { data: legacyFile, error: legacyError } = await supabase
                    .from('files')
                    .insert(legacyInsertData)
                    .select()
                    .single();

                if (legacyError) throw legacyError;
                return res.json({ message: 'File uploaded successfully', file: legacyFile });
            }
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

// GET /api/files/:fileId/download - Legacy endpoint (password is required via POST)
app.get('/api/files/:fileId/download', authMiddleware, async (_req: AuthRequest, res) => {
    return res.status(405).json({ error: 'Use POST /api/files/:fileId/download with password' });
});

// POST /api/files/:fileId/download - Password-protected download
app.post('/api/files/:fileId/download', authMiddleware, async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const fileId = req.params.fileId;
        const { password } = req.body as { password?: string };

        if (!password || typeof password !== 'string') {
            return res.status(400).json({ error: 'Password is required for download' });
        }

        // Validate current user's password before allowing download.
        const { data: currentUser, error: currentUserError } = await supabase
            .from('users')
            .select('user_id, password_hash, role')
            .eq('user_id', req.user.userId)
            .single();

        if (currentUserError || !currentUser) {
            return res.status(401).json({ error: 'Invalid user session' });
        }

        const isPasswordValid = await bcrypt.compare(password, currentUser.password_hash);
        if (!isPasswordValid) {
            try {
                await supabase.from('access_logs').insert({
                    user_id: req.user.userId,
                    file_id: fileId,
                    action: 'download_denied_password',
                    timestamp: new Date().toISOString()
                });
            } catch (logError) {
                console.error('Failed to log denied download:', logError);
            }
            return res.status(403).json({ error: 'Incorrect password. Download denied.' });
        }

        // Get file from database
        const { data: file, error } = await supabase
            .from('files')
            .select('*')
            .eq('file_id', fileId)
            .single();

        if (error || !file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Verify ownership (user can only download their own files, admins can download all)
        if (req.user.userId !== file.owner_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Persist file permission for this user if it does not exist yet.
        const { data: existingPermission, error: permissionFetchError } = await supabase
            .from('file_access_permission')
            .select('permission_id, access_type')
            .eq('file_id', fileId)
            .eq('user_id', req.user.userId)
            .maybeSingle();

        if (permissionFetchError) {
            console.error('Failed to fetch file permission:', permissionFetchError);
            return res.status(500).json({ error: 'Failed to verify file permission' });
        }

        const desiredAccessType = req.user.role === 'admin' ? 'admin' : 'read';
        if (!existingPermission) {
            const { error: permissionInsertError } = await supabase
                .from('file_access_permission')
                .insert({
                    file_id: fileId,
                    user_id: req.user.userId,
                    access_type: desiredAccessType,
                });

            if (permissionInsertError) {
                console.error('Failed to store file permission:', permissionInsertError);
                return res.status(500).json({ error: 'Failed to store file permission' });
            }
        }

        // Record download in access logs
        try {
            await supabase.from('access_logs').insert({
                user_id: req.user.userId,
                file_id: fileId,
                action: 'download',
                timestamp: new Date().toISOString()
            });
        } catch (logError) {
            console.error("Failed to log access:", logError);
        }

        // Primary path: DB-backed file storage.
        if (file.file_data) {
            const fileBuffer = Buffer.from(file.file_data, 'base64');
            const safeFileName = encodeURIComponent(file.file_name || 'download.bin');
            res.setHeader('Content-Type', file.mime_type || 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${safeFileName}`);
            return res.send(fileBuffer);
        }

        // Legacy DB-inline fallback: file payload stored inside encrypted_path with db64 prefix.
        if (typeof file.encrypted_path === 'string' && file.encrypted_path.startsWith('db64:')) {
            const legacyBase64 = file.encrypted_path.slice(5);
            const fileBuffer = Buffer.from(legacyBase64, 'base64');
            const safeFileName = encodeURIComponent(file.file_name || 'download.bin');
            const legacyMime = typeof file.checksum === 'string' && file.checksum.startsWith('mime:')
                ? file.checksum.slice(5)
                : 'application/octet-stream';
            res.setHeader('Content-Type', legacyMime);
            res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${safeFileName}`);
            return res.send(fileBuffer);
        }

        // Backward compatibility path: legacy rows that stored a filesystem path.
        if (file.encrypted_path && !String(file.encrypted_path).startsWith('db://inline') && fs.existsSync(file.encrypted_path)) {
            return res.download(file.encrypted_path, file.file_name);
        }

        return res.status(404).json({ error: 'File data is not available for download' });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Download failed' });
    }
});

// DELETE /api/files/:fileId - Delete a file
app.delete('/api/files/:fileId', authMiddleware, async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const fileId = req.params.fileId;

        // Get file from database
        const { data: file, error: fetchError } = await supabase
            .from('files')
            .select('*')
            .eq('file_id', fileId)
            .single();

        if (fetchError || !file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Verify ownership (user can only delete their own files, admins can delete all)
        if (req.user.userId !== file.owner_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Delete from database
        const { error: deleteError } = await supabase
            .from('files')
            .delete()
            .eq('file_id', fileId);

        if (deleteError) {
            return res.status(500).json({ error: 'Failed to delete file from database' });
        }

        // Record deletion in audit trail
        try {
            await supabase.from('audit_trail').insert({
                user_id: req.user.userId,
                event: 'file_deleted',
                details: `Deleted file: ${file.file_name}`,
                event_time: new Date().toISOString(),
            });
        } catch (auditError) {
            console.error("Failed to log audit:", auditError);
        }

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Deletion failed' });
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

// GET /api/admin/access-control - Get all users with file access info (admin only)
app.get('/api/admin/access-control', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
        console.log('[ACCESS_CONTROL] Starting data fetch...');
        
        // Get all users
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('user_id, username, email, role, status, created_at');

        if (usersError) {
            console.error('[ACCESS_CONTROL] Users error:', usersError);
            throw usersError;
        }
        console.log(`[ACCESS_CONTROL] Fetched ${users?.length || 0} users`);

        // Get all files with access permissions
        const { data: fileAccess, error: accessError } = await supabase
            .from('file_access_permission')
            .select('permission_id, file_id, user_id, access_type');

        if (accessError) {
            console.error('[ACCESS_CONTROL] File access error:', accessError);
            throw accessError;
        }
        console.log(`[ACCESS_CONTROL] Fetched ${fileAccess?.length || 0} file permissions`);

        // Get all files with owner info
        const { data: files, error: filesError } = await supabase
            .from('files')
            .select('file_id, file_name, owner_id, size, upload_time');

        if (filesError) {
            console.error('[ACCESS_CONTROL] Files error:', filesError);
            throw filesError;
        }
        console.log(`[ACCESS_CONTROL] Fetched ${files?.length || 0} files`);

        const response = {
            users: users || [],
            files: files || [],
            fileAccess: fileAccess || []
        };

        console.log('[ACCESS_CONTROL] Sending response:', {
            userCount: response.users.length,
            fileCount: response.files.length,
            accessCount: response.fileAccess.length
        });

        res.json(response);
    } catch (error) {
        console.error('[ACCESS_CONTROL] Error:', error);
        res.status(500).json({ 
            error: "Failed to fetch access control data",
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

// PUT /api/admin/user/:userId/role - Update user role (admin only)
app.put('/api/admin/user/:userId/role', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
        const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
        const { role } = req.body;

        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        const { data, error } = await supabase
            .from('users')
            .update({ role })
            .eq('user_id', userId)
            .select();

        if (error) throw error;

        // Log admin action
        await supabase.from('admin_actions').insert({
            admin_id: req.user?.userId,
            action: `Changed user role to ${role}`,
            target_user: parseInt(userId),
            timestamp: new Date().toISOString()
        });

        res.json({ message: "User role updated", data: data[0] });
    } catch (error) {
        res.status(500).json({ error: "Failed to update user role" });
    }
});

// PUT /api/admin/user/:userId/activate - Activate a user (admin only)
app.put('/api/admin/user/:userId/activate', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
        const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
        
        console.log('[ACTIVATE] Attempting to activate user:', userId);

        const { data, error } = await supabase
            .from('users')
            .update({ status: 'active' })
            .eq('user_id', userId)
            .select();

        if (error) {
            console.error('[ACTIVATE] Database error:', error);
            throw error;
        }

        console.log('[ACTIVATE] User activated successfully:', data);

        // Log admin action
        await supabase.from('admin_actions').insert({
            admin_id: req.user?.userId,
            action: `Activated user`,
            target_user: parseInt(userId),
            timestamp: new Date().toISOString()
        });

        res.json({ message: "User activated", data: data[0] });
    } catch (error) {
        console.error('[ACTIVATE] Error:', error);
        res.status(500).json({ 
            error: "Failed to activate user",
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

// PUT /api/admin/user/:userId/suspend - Suspend a user (admin only)
app.put('/api/admin/user/:userId/suspend', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
        const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
        
        console.log('[SUSPEND] Attempting to suspend user:', userId);

        const { data, error } = await supabase
            .from('users')
            .update({ status: 'suspended' })
            .eq('user_id', userId)
            .select();

        if (error) {
            console.error('[SUSPEND] Database error:', error);
            throw error;
        }

        console.log('[SUSPEND] User suspended successfully:', data);

        // Log admin action
        await supabase.from('admin_actions').insert({
            admin_id: req.user?.userId,
            action: `Suspended user`,
            target_user: parseInt(userId),
            timestamp: new Date().toISOString()
        });

        res.json({ message: "User suspended", data: data[0] });
    } catch (error) {
        console.error('[SUSPEND] Error:', error);
        res.status(500).json({ 
            error: "Failed to suspend user",
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

// POST /api/admin/file-access - Grant file access (admin only)
app.post('/api/admin/file-access', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
        const { fileId, userId, accessType } = req.body;

        if (!['read', 'write', 'admin'].includes(accessType)) {
            return res.status(400).json({ error: "Invalid access type" });
        }

        // Check if permission already exists
        const { data: existing } = await supabase
            .from('file_access_permission')
            .select('permission_id')
            .eq('file_id', fileId)
            .eq('user_id', userId)
            .single();

        if (existing) {
            // Update existing
            const { data, error } = await supabase
                .from('file_access_permission')
                .update({ access_type: accessType })
                .eq('permission_id', existing.permission_id)
                .select();

            if (error) throw error;
            return res.json({ message: "Access updated", data: data[0] });
        }

        // Create new permission
        const { data, error } = await supabase
            .from('file_access_permission')
            .insert({
                file_id: fileId,
                user_id: userId,
                access_type: accessType
            })
            .select();

        if (error) throw error;

        // Log admin action
        await supabase.from('admin_actions').insert({
            admin_id: req.user?.userId,
            action: `Granted ${accessType} access to file ${fileId}`,
            target_user: userId,
            timestamp: new Date().toISOString()
        });

        res.json({ message: "File access granted", data: data[0] });
    } catch (error) {
        res.status(500).json({ error: "Failed to grant file access" });
    }
});

// DELETE /api/admin/file-access/:permissionId - Revoke file access (admin only)
app.delete('/api/admin/file-access/:permissionId', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
        const permissionId = Array.isArray(req.params.permissionId) ? req.params.permissionId[0] : req.params.permissionId;

        const { data: permission, error: fetchError } = await supabase
            .from('file_access_permission')
            .select('*')
            .eq('permission_id', permissionId)
            .single();

        if (fetchError) throw fetchError;

        const { error: deleteError } = await supabase
            .from('file_access_permission')
            .delete()
            .eq('permission_id', permissionId);

        if (deleteError) throw deleteError;

        // Log admin action
        await supabase.from('admin_actions').insert({
            admin_id: req.user?.userId,
            action: `Revoked file access`,
            target_user: permission.user_id,
            timestamp: new Date().toISOString()
        });

        res.json({ message: "File access revoked" });
    } catch (error) {
        res.status(500).json({ error: "Failed to revoke file access" });
    }
});

// ===== ANOMALY DETECTION ENDPOINTS =====

// GET /api/ml/user-behavior/:userId - Get user behavior profile
app.get('/api/ml/user-behavior/:userId', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = Array.isArray(req.params.userId) ? parseInt(req.params.userId[0]) : parseInt(req.params.userId);
        const days = req.query.days ? parseInt(req.query.days as string) : 30;

        // Only allow users to view their own data, or admins
        if (req.user?.userId !== userId && req.user?.role !== 'admin') {
            return res.status(403).json({ error: "Access denied" });
        }

        const profile = await getUserBehaviorProfile(userId, days);
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user behavior profile" });
    }
});

// POST /api/ml/test-anomaly - Test anomaly detection
app.post('/api/ml/test-anomaly', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
        const { userId, ipAddress } = req.body;

        if (!userId || !ipAddress) {
            return res.status(400).json({ error: "userId and ipAddress are required" });
        }

        console.log(`[TEST] Testing anomaly detection for user ${userId} from IP ${ipAddress}`);
        const anomalyScore = await detectAnomalyOnLogin(userId, ipAddress);

        res.json({
            message: "Anomaly detection test completed",
            result: anomalyScore
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to test anomaly detection" });
    }
});

// GET /api/ml/alerts - Get security alerts (admin only)
app.get('/api/ml/alerts', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
        const status = req.query.status as string || 'all';

        let query = supabase
            .from('alerts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (status !== 'all') {
            query = query.eq('status', status);
        }

        const { data: alerts, error } = await query;

        if (error) throw error;

        res.json({
            count: alerts?.length || 0,
            alerts: alerts || []
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch alerts" });
    }
});

// GET /api/alerts - Get user's own alerts (authenticated users)
app.get('/api/alerts', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;
        console.log('GET /api/alerts - userId:', userId);
        
        if (!userId) {
            console.log('GET /api/alerts - No userId found');
            return res.status(401).json({ error: "Unauthorized - no user ID" });
        }

        const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
        const status = req.query.status as string | undefined;

        console.log('GET /api/alerts - Fetching alerts for userId:', userId, 'limit:', limit, 'status:', status);

        let query = supabase
            .from('alerts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            console.log('GET /api/alerts - Database error:', error);
            throw error;
        }

        console.log('GET /api/alerts - Success! Returning', (data || []).length, 'alerts');
        res.json({ alerts: data || [] });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ error: "Failed to fetch alerts", details: error instanceof Error ? error.message : String(error) });
    }
});

// PUT /api/alerts/:alertId - Update own alert status (authenticated users)
app.put('/api/alerts/:alertId', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const alertId = Array.isArray(req.params.alertId) ? req.params.alertId[0] : req.params.alertId;
        const { status } = req.body;

        if (!['open', 'investigating', 'resolved', 'dismissed'].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        // Verify alert belongs to user
        const { data: alert, error: checkError } = await supabase
            .from('alerts')
            .select('*')
            .eq('alert_id', alertId)
            .eq('user_id', userId)
            .single();

        if (checkError || !alert) {
            return res.status(403).json({ error: "Alert not found or unauthorized" });
        }

        const { data, error } = await supabase
            .from('alerts')
            .update({ status })
            .eq('alert_id', alertId)
            .select();

        if (error) throw error;

        res.json({ message: "Alert updated", data: data[0] });
    } catch (error) {
        console.error('Error updating alert:', error);
        res.status(500).json({ error: "Failed to update alert" });
    }
});

// PUT /api/ml/alerts/:alertId - Update alert status (admin only)
app.put('/api/ml/alerts/:alertId', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
        const alertId = Array.isArray(req.params.alertId) ? req.params.alertId[0] : req.params.alertId;
        const { status } = req.body;

        if (!['open', 'investigating', 'resolved', 'false_alarm'].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const { data, error } = await supabase
            .from('alerts')
            .update({ status })
            .eq('alert_id', alertId)
            .select();

        if (error) throw error;

        res.json({ message: "Alert updated", data: data[0] });
    } catch (error) {
        res.status(500).json({ error: "Failed to update alert" });
    }
});

// GET /api/ml/dashboard - ML Dashboard data (admin only)
app.get('/api/ml/dashboard', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
        // Get recent alerts with user info
        const { data: recentAlerts, error: alertsError } = await supabase
            .from('alerts')
            .select('alert_id, user_id, alert_type, risk_score, description, created_at, status')
            .order('created_at', { ascending: false })
            .limit(10);

        if (alertsError) {
            console.error('[ML_DASHBOARD] Alerts fetch error:', alertsError);
            throw alertsError;
        }

        // Get alert statistics
        const { data: allAlerts, error: statsError } = await supabase
            .from('alerts')
            .select('status, risk_score')
            .order('created_at', { ascending: false });

        if (statsError) {
            console.error('[ML_DASHBOARD] Stats fetch error:', statsError);
            throw statsError;
        }

        // Get failed logins in last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: failedLogins, error: failedError } = await supabase
            .from('login_logs')
            .select('log_id, user_id, ip_address, login_time, success')
            .eq('success', false)
            .gte('login_time', twentyFourHoursAgo)
            .limit(10);

        if (failedError) {
            console.error('[ML_DASHBOARD] Failed logins fetch error:', failedError);
            throw failedError;
        }

        // Calculate statistics
        const stats = {
            total_alerts: allAlerts?.length || 0,
            open_alerts: allAlerts?.filter((a: any) => a.status === 'open').length || 0,
            critical_alerts: allAlerts?.filter((a: any) => a.risk_score > 0.75).length || 0,
            failed_logins_24h: failedLogins?.length || 0,
            avg_risk_score: allAlerts?.length ? 
                ((allAlerts as any[]).reduce((sum, a) => sum + (a.risk_score || 0), 0) / allAlerts.length).toFixed(2) : 
                '0'
        };

        console.log('[ML_DASHBOARD] Data fetched successfully:', stats);

        res.json({
            stats,
            recent_alerts: recentAlerts || [],
            suspicious_logins: failedLogins || []
        });
    } catch (error) {
        console.error('[ML_DASHBOARD] Error:', error);
        res.status(500).json({ 
            error: "Failed to fetch ML dashboard data",
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
