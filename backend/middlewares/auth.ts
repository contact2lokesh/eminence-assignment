import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

export const requireOwnerOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'OWNER') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Requires elevated permissions.' });
    }
};
