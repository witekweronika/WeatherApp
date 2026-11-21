// lib/middlewares/deviceIdParam.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export const checkIdParam = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const parsed = parseInt(id, 10);
    if (Number.isNaN(parsed) || parsed >= (config.supportedDevicesNum ?? 17) || parsed < 0) {
        return res.status(400).send('Brak lub niepoprawny parametr ID urządzenia!');
    }
    next();
};
