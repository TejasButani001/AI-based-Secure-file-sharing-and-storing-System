import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// Extend Express Request to include user info
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        role: 'admin' | 'user';
        email: string;
        username: string;
    };
}

/**
 * authMiddleware — Verifies JWT token from Authorization header.
 * Attaches decoded user info to req.user.
 * Returns 401 if token is missing or invalid.
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            email: decoded.email,
            username: decoded.username,
        };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

/**
 * adminOnly — Must be used AFTER authMiddleware.
 * Returns 403 if the authenticated user is not an admin.
 */
export function adminOnly(req: AuthRequest, res: Response, next: NextFunction): void {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        return;
    }
    next();
}
