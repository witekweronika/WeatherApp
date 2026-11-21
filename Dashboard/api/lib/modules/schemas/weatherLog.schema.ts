import { Schema, model } from 'mongoose';
import { IWeatherLog } from '../models/weatherLog.model';

const WeatherLogSchema = new Schema<IWeatherLog>(
    {
        userId: { type: String, required: false },
        city: { type: String, required: true },
        type: { type: String, enum: ['public', 'current', 'forecast'], required: true },
        createdAt: { type: Date, default: Date.now },
        temp: { type: Number },
        description: { type: String },
        raw: { type: Schema.Types.Mixed } // dowolny JSON
    },
    {
        collection: 'weatherLogs' // 👈 spina się z istniejącą kolekcją
    }
);

export default model<IWeatherLog>('WeatherLog', WeatherLogSchema);
