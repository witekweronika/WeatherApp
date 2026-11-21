import { Schema, model } from 'mongoose';
import { IAppConfig } from '../models/appConfig.model';

const AppConfigSchema = new Schema<IAppConfig>(
    {
        name: { type: String, required: true, unique: true },
        theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
        primaryColor: { type: String },
        secondaryColor: { type: String },
        defaultCity: { type: String }
    },
    {
        collection: 'appConfigs' // 👈 istniejąca kolekcja
    }
);

export default model<IAppConfig>('AppConfig', AppConfigSchema);
