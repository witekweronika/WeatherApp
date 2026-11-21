import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config';

export interface AuthPayload extends JwtPayload {
    userId: string;
    email: string;
    role: 'user' | 'admin';
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || typeof header !== 'string' || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Brak tokenu autoryzacyjnego' });
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) {
        return res.status(401).json({ error: 'Brak tokenu autoryzacyjnego' });
    }

    try {
        const decoded = jwt.verify(token, config.JwtSecret) as AuthPayload;
        (req as any).user = decoded;
        return next();
    } catch {
        return res.status(401).json({ error: 'Nieprawidłowy lub wygasły token' });
    }
};

// alias żeby stare importy nie wywalały projektu
export const authMiddleware = auth;
