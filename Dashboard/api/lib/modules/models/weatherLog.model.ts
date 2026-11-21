export type WeatherLogType = 'public' | 'current' | 'forecast';

export interface IWeatherLog {
    _id?: string;
    userId?: string | null;  // null / brak -> guest
    city: string;
    type: WeatherLogType;
    createdAt: Date;
    temp?: number;
    description?: string;
    raw?: any;               // opcjonalnie fragment pełnej odpowiedzi
}
