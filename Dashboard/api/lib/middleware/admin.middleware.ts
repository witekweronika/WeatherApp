import { Request, Response, NextFunction } from 'express';
import { AuthPayload } from './auth.middleware';

export const admin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthPayload | undefined;

    if (!user) {
        return res.status(401).json({ error: 'Brak autoryzacji' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Brak uprawnień (admin)' });
    }

    return next();
};
