import { Router, Request, Response } from 'express';
import Controller from '../interfaces/controller.interface';

class IndexController implements Controller {
    public path = '/';
    public router = Router();

    constructor() {
        this.router.get('/', this.index);
    }

    private index = (_req: Request, res: Response) => {
        return res.status(200).json({ ok: true, service: 'iot-api' });
    };
}

export default IndexController;
