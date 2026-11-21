
import 'dotenv/config';

const requiredEnv = (name: string): string => {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Brak zmiennej: ${name}`);
    }

    return value;
};

export const config = {
    port: process.env.PORT || 3100,
    supportedDevicesNum: 17,
    databaseUrl: requiredEnv('MONGODB_URI'),
    JwtSecret: requiredEnv('JWT_SECRET'),
    openWeatherKey: requiredEnv('OPENWEATHER_API_KEY')
};
