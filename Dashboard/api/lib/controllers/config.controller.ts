import Controller from '../interfaces/controller.interface';
import { Request, Response, Router } from 'express';
import AppConfigModel from '../modules/schemas/appConfig.schema';
import { auth } from '../middleware/auth.middleware';
import { admin } from '../middleware/admin.middleware';
import UserModel from '../modules/schemas/user.schema';


class ConfigController implements Controller {
    public path = '/api/config';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // pobranie aktualnej konfiguracji – tylko zalogowany admin
        this.router.get(this.path, auth, admin, this.getConfig);
        // aktualizacja konfiguracji – tylko admin
        this.router.put(this.path, auth, admin, this.updateConfig);
    }

    private getConfig = async (req: Request, res: Response) => {
        try {
            let cfg = await AppConfigModel.findOne({ name: 'default' }).lean();
            if (!cfg) {
                // jeśli brak dokumentu, utwórz domyślny
                cfg = (await AppConfigModel.create({
                    name: 'default',
                    theme: 'dark',
                    primaryColor: '#4f46e5', // fiolet, np. pod Twój front
                    secondaryColor: '#1f2933',
                    defaultCity: 'Krakow'
                })).toObject();
            }
            return res.status(200).json(cfg);
        } catch (e: any) {
            console.error(e);
            return res.status(500).json({ error: 'Config fetch failed', message: e.message });
        }
    };

    private updateConfig = async (req: Request, res: Response) => {
        try {
            const { theme, primaryColor, secondaryColor, defaultCity } = req.body;

            // prosta walidacja – można tu kiedyś wrzucić Joi
            if (theme && !['light', 'dark'].includes(theme)) {
                return res.status(400).json({ error: 'Invalid theme value' });
            }

            const cfg = await AppConfigModel.findOneAndUpdate(
                { name: 'default' },
                { theme, primaryColor, secondaryColor, defaultCity },
                { new: true, upsert: true }
            ).lean();

            return res.status(200).json(cfg);
        } catch (e: any) {
            console.error(e);
            return res.status(500).json({ error: 'Config update failed', message: e.message });
        }
    };
}

export default ConfigController;
