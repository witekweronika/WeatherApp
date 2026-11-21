import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { config } from './config';
import Controller from './interfaces/controller.interface';
import { auth } from './middleware/auth.middleware';
import cors from 'cors';
import { WeatherService } from './modules/services/weather.service';

class App {
    public app: express.Application;
// 🔹 serwis pogodowy
    private weatherService = new WeatherService();

    // 🔹 handler dla /api/weather/public – NA PEWNO zadziała
    private publicWeather = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const city = (req.query.city as string) || 'Krakow';
        console.log('*** APP public weather handler, city =', city);

        try {
            const data = await this.weatherService.getCurrent(city);

            return res.status(200).json({
                city: data.name,
                temperature: data.main?.temp,
                description: data.weather?.[0]?.description,
                feelsLike: data.main?.feels_like,
            });
        } catch (err) {
            console.error('APP /api/weather/public error:', err);
            next(err);
        }
    };


    private windDirName(deg?: number): string | undefined {
        if (deg === undefined) return undefined;
        const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const idx = Math.round(deg / 45) % 8;
        return dirs[idx];
    }

    private currentWeather = async (req: Request, res: Response, next: NextFunction) => {
        const city = (req.query.city as string) || 'Warszawa';
        console.log('*** APP PRIVATE /api/weather/current HIT, city =', city);

        try {
            const data = await this.weatherService.getCurrent(city);

            // UWAGA: "zanieczyszczenie powietrza" wymaga osobnego endpointu OWM (air_pollution)
            // Na razie zwracamy null, a w kolejnym kroku dopniemy Air API.
            return res.status(200).json({
                city: data.name,
                temperature: data.main?.temp,
                description: data.weather?.[0]?.description,
                feelsLike: data.main?.feels_like,

                sunrise: data.sys?.sunrise,
                sunset: data.sys?.sunset,

                windSpeed: data.wind?.speed,
                windDirection: data.wind?.deg,
                windType: this.windDirName(data.wind?.deg), // np. N/NE/E...

                cloudiness: data.clouds?.all,
                cloudsName: data.weather?.[0]?.main, // np. "Clouds" (lub opis po PL masz w description)

                visibility: data.visibility,

                humidity: data.main?.humidity,
                pressure: data.main?.pressure,

                airPollution: null
            });
        } catch (err) {
            console.error('APP /api/weather/current error:', err);
            next(err);
        }
    };


    constructor(controllers: Controller[]) {
        this.app = express();

        this.initializeMiddlewares();
        // 🔹 PUBLICZNA POGODA TU – to na pewno działa
        this.app.get('/api/weather/public', this.publicWeather);
        this.app.get('/api/weather/current', auth, this.currentWeather);

        this.initializeControllers(controllers);
        this.initializeNotFoundHandler();
        this.connectToDatabase();
        this.initializeErrorHandler();
    }

    private initializeMiddlewares(): void {
        this.app.use(cors({ origin: true, credentials: true }));
        this.app.use(bodyParser.json());
        this.app.use(morgan('dev'));

        // prosty logger wszystkich żądań – zostaw, przydaje się
        this.app.use((req, _res, next) => {
            console.log('REQ:', req.method, req.url);
            next();
        });
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((c) => this.app.use('/', c.router));
    }

    private async connectToDatabase(): Promise<void> {
        try {
            await mongoose.connect(config.databaseUrl);
            console.log('Połączono z bazą danych MongoDB');
        } catch (error) {
            console.error('Błąd połączenia z MongoDB:', error);
        }

        mongoose.connection.on('error', (error) => {
            console.error('Błąd połączenia MongoDB:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Połączenie z MongoDB zostało rozłączone');
        });
    }

    private initializeErrorHandler(): void {
        this.app.use((err: any, _req: any, res: any, _next: any) => {
            console.error('GLOBAL ERROR HANDLER:', err);
            res.status(err.status || 500).json({ error: 'Server error' });
        });
    }
    private initializeNotFoundHandler(): void {
        this.app.use((req, res) => {
            return res.status(404).json({ error: 'Not found', path: req.url });
        });
    }
    public listen(): void {
        this.app.listen(config.port, () => {
            console.log(`Serwer działa na porcie ${config.port}`);
        });
    }
}

export default App;
