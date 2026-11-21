import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Controller from '../interfaces/controller.interface';
import { config } from '../config';
import UserModel from '../modules/schemas/user.schema';
import { auth, AuthPayload } from '../middleware/auth.middleware';

class AuthController implements Controller {
    public path = '/api/auth';
    public router = Router();

    constructor() {
        console.log('*** AuthController initialized');
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.register);
        this.router.post(`${this.path}/login`, this.login);
        this.router.get(`${this.path}/me`, auth, this.me);
    }

    private login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body as { email?: string; password?: string };

            if (!email || !password) {
                return res.status(400).json({ error: 'Email i hasło są wymagane' });
            }

            const user = await UserModel.findOne({ email });
            if (!user) return res.status(401).json({ error: 'Zły email lub hasło' });

            const ok = await bcrypt.compare(password, user.passwordHash);
            if (!ok) return res.status(401).json({ error: 'Zły email lub hasło' });

            const payload: AuthPayload = {
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
            };

            const token = jwt.sign(payload, config.JwtSecret, { expiresIn: '2h' });

            return res.status(200).json({
                token,
                user: { id: user._id.toString(), email: user.email, role: user.role },
            });
        } catch (err) {
            next(err);
        }
    };

    private register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body as { email?: string; password?: string };
            if (!email || !password) return res.status(400).json({ error: 'Email i hasło są wymagane' });

            const existing = await UserModel.findOne({ email }).lean();
            if (existing) return res.status(400).json({ error: 'Użytkownik już istnieje' });

            const passwordHash = await bcrypt.hash(password, 10);

            await UserModel.create({
                email,
                name: email,
                role: 'user',
                isAdmin: false,
                active: true,
                passwordHash,
            });

            return res.status(201).json({ message: 'Utworzono użytkownika' });
        } catch (err) {
            next(err);
        }
    };

    private me = async (req: Request, res: Response) => {
        const user = (req as any).user as AuthPayload | undefined;
        console.log('*** /api/auth/me hit, user =', user);

        if (!user) return res.status(401).json({ error: 'Brak autoryzacji' });

        return res.status(200).json({
            id: user.userId,
            email: user.email,
            role: user.role,
        });
    };
}

export default AuthController;
