import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../interfaces/controller.interface';
import { WeatherService } from '../modules/services/weather.service';
import { auth } from '../middleware/auth.middleware';

class WeatherController implements Controller {
    public path = '/api/weather';
    public router = Router();
    private service = new WeatherService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Publiczny endpoint (gość)
        this.router.get(`${this.path}/public`, this.publicCurrent);

        // Prywatne (JWT)
        this.router.get(`${this.path}/current`, auth, this.currentFull);
        this.router.get(`${this.path}/forecast`, auth, this.forecastFull);

        // NOWE: hourly 24h (Opcja A - z /forecast)
        this.router.get(`${this.path}/hourly`, auth, this.hourly24);
    }

    private publicCurrent = async (req: Request, res: Response, next: NextFunction) => {
        const city = (req.query.city as string) || 'Krakow';

        try {
            const data = await this.service.getCurrent(city);
            return res.status(200).json({
                city: data.name,
                temperature: data.main?.temp,
                description: data.weather?.[0]?.description,
                feelsLike: data.main?.feels_like,
            });
        } catch (err) {
            console.error('Error in /api/weather/public:', err);
            next(err);
        }
    };

    private currentFull = async (req: Request, res: Response, next: NextFunction) => {
        const city = (req.query.city as string) || 'Krakow';

        try {
            const data = await this.service.getCurrent(city);
            return res.status(200).json({
                city: data.name,
                temperature: data.main?.temp,
                description: data.weather?.[0]?.description,
                feelsLike: data.main?.feels_like,

                sunrise: data.sys?.sunrise,
                sunset: data.sys?.sunset,

                windSpeed: data.wind?.speed,
                windDirection: data.wind?.deg,

                cloudiness: data.clouds?.all,
                visibility: data.visibility,

                humidity: data.main?.humidity,
                pressure: data.main?.pressure,

                // Air pollution: osobny endpoint — na razie null
                airPollution: null,
            });
        } catch (err) {
            console.error('Error in /api/weather/current:', err);
            next(err);
        }
    };

    private forecastFull = async (req: Request, res: Response, next: NextFunction) => {
        const city = (req.query.city as string) || 'Krakow';

        try {
            const data = await this.service.getForecast(city);
            return res.status(200).json(data);
        } catch (err) {
            console.error('Error in /api/weather/forecast:', err);
            next(err);
        }
    };

    private hourly24 = async (req: Request, res: Response, next: NextFunction) => {
        const city = (req.query.city as string) || 'Warszawa';

        try {
            const data = await this.service.getHourly24(city);
            return res.status(200).json(data);
        } catch (err) {
            console.error('Error in /api/weather/hourly:', err);
            next(err);
        }
    };
}

export default WeatherController;
