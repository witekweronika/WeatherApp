// lib/controllers/data.controller.ts
import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import { checkIdParam } from '../middleware/deviceIdParam.middleware';
import DataService from '../modules/services/data.service';
import {IData} from "../modules/models/data.model";
import Joi from 'joi';

let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    private dataService = new DataService();


    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevices);
        this.router.post(`${this.path}/:id`, checkIdParam, this.addData);
        this.router.get(`${this.path}/:id`, checkIdParam, this.getAllDeviceData);
        this.router.get(`${this.path}/:id/latest`, checkIdParam, this.getPeriodData);
        this.router.get(`${this.path}/:id/:num`, checkIdParam, this.getPeriodData);
        this.router.delete(`${this.path}/all`, this.cleanAllDevices);
        this.router.delete(`${this.path}/:id`, checkIdParam, this.cleanDeviceData);
    }

    // GET /api/data/latest
    private getLatestReadingsFromAllDevices = async (
        req: Request, res: Response, next: NextFunction
    ) => {
        return res.status(200).json(testArr);
    };

    private getAllDeviceData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const allData = await this.dataService.query(id);
        response.status(200).json(allData);
    };

    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { air } = request.body;
        const { id } = request.params;
        const deviceId = parseInt(id, 10);

        // 🔹 1. Definicja schematu Joi
        const schema = Joi.object({
            air: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.number().integer().positive().required(),
                        value: Joi.number().positive().required()
                    })
                )
                .unique((a, b) => a.id === b.id)
                .required(),
            deviceId: Joi.number().integer().positive().valid(deviceId).required()
        });

        // 🔹 2. Walidacja danych wejściowych
        const { error } = schema.validate({ air, deviceId });

        if (error) {
            console.error('Walidacja błędna:', error.details[0].message);
            return response.status(400).json({
                error: 'Błędne dane wejściowe',
                message: error.details[0].message
            });
        }

        // 🔹 3. Jeśli dane są poprawne – budujemy obiekt IData
        const data: IData = {
            temperature: air[0].value,
            pressure: air[1].value,
            humidity: air[2].value,
            deviceId,
            readingDate: new Date()
        };

        try {
            await this.dataService.createData(data);
            response.status(200).json(data);
        } catch (error) {
            console.error('Błąd przy zapisie danych:', error);
            response.status(500).json({ error: 'Błąd serwera przy zapisie danych' });
        }
    };

    // GET /api/data/:id/latest   oraz  GET /api/data/:id/:num
    // Dla uproszczenia labu: zwróć ostatnie num (domyślnie 1) wartości
    private getPeriodData = async (
        req: Request, res: Response, next: NextFunction
    ) => {
        const { num } = req.params;
        const n = num ? Number(num) : 1;
        if (num && (Number.isNaN(n) || n <= 0)) {
            return res.status(400).json({ error: 'num musi być dodatnią liczbą' });
        }
        const slice = testArr.slice(-n);
        return res.status(200).json(slice);
    };

    // DELETE /api/data/all
    private cleanAllDevices = async (
        req: Request, res: Response, next: NextFunction
    ) => {
        testArr = [];
        return res.status(200).json({ ok: true, message: 'Wyczyszczono wszystkie dane' });
    };

    // DELETE /api/data/:id  -> usuń element o indeksie id
    private cleanDeviceData = async (
        req: Request, res: Response, next: NextFunction
    ) => {
        const { id } = req.params;
        const idx = Number(id);
        if (Number.isNaN(idx) || idx < 0 || idx >= testArr.length) {
            return res.status(404).json({ error: 'Brak elementu o podanym id' });
        }
        testArr.splice(idx, 1);
        return res.status(200).json(testArr);
    };


}

export default DataController;
