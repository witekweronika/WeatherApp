import { config } from '../../config';

export class WeatherService {
    async getCurrent(
        city: string,
        units: 'metric' | 'imperial' = 'metric',
        lang = 'pl'
    ) {
        const url = new URL('https://api.openweathermap.org/data/2.5/weather');
        url.searchParams.set('q', city);
        url.searchParams.set('appid', config.openWeatherKey);
        url.searchParams.set('units', units);
        url.searchParams.set('lang', lang);

        const res = await fetch(url.toString());
        if (!res.ok) {
            throw new Error(`OpenWeather error (current): ${res.status} ${res.statusText}`);
        }

        return await res.json();
    }

    async getForecast(
        city: string,
        units: 'metric' | 'imperial' = 'metric',
        lang = 'pl'
    ) {
        const url = new URL('https://api.openweathermap.org/data/2.5/forecast');
        url.searchParams.set('q', city);
        url.searchParams.set('appid', config.openWeatherKey);
        url.searchParams.set('units', units);
        url.searchParams.set('lang', lang);

        const res = await fetch(url.toString());
        if (!res.ok) {
            throw new Error(`OpenWeather error (forecast): ${res.status} ${res.statusText}`);
        }

        return await res.json();
    }

    /**
     * Opcja A:
     * OpenWeather /forecast zwraca kroki co 3h.
     * My robimy 24 punkty godzinowe przez interpolację liniową (8 segmentów * 3h = 24h).
     * Zwracamy format pod wykres: [{ time:"HH:00", temperature:number }]
     */
    async getHourly24(
        city: string,
        units: 'metric' | 'imperial' = 'metric',
        lang = 'pl'
    ) {
        const forecast = await this.getForecast(city, units, lang);

        const tz = Number(forecast.city?.timezone ?? 0); // sekundy przesunięcia dla miasta
        const list: any[] = Array.isArray(forecast.list) ? forecast.list : [];

        // Potrzebujemy 9 punktów co 3h: 0h,3h,...,24h => 9 wpisów.
        // Z tego robimy 24 godziny: 0..23 (8 segmentów * 3 próbki na segment)
        const base = list.slice(0, 9);

        if (base.length < 2) {
            return { city: forecast.city?.name ?? city, hourly: [] as any[] };
        }

        const hourly: { dt: number; time: string; temperature: number }[] = [];

        const toTimeHH = (dtUnixSec: number) => {
            const localMs = (dtUnixSec + tz) * 1000;
            const d = new Date(localMs);
            const hh = String(d.getUTCHours()).padStart(2, '0'); // offset już dodany
            return `${hh}:00`;
        };

        const getTemp = (item: any) => Number(item?.main?.temp);

        // segmenty 0..7 (8 segmentów), każdy segment ma 3 godziny => 24 punkty
        const segments = Math.min(base.length - 1, 8);

        for (let i = 0; i < segments; i++) {
            const a = base[i];
            const b = base[i + 1];

            const t0 = Number(a.dt);          // unix sec
            const t1 = Number(b.dt);          // unix sec (t0 + 10800)
            const temp0 = getTemp(a);
            const temp1 = getTemp(b);

            // Jeśli coś jest NaN, pomiń segment
            if (!Number.isFinite(t0) || !Number.isFinite(t1) || !Number.isFinite(temp0) || !Number.isFinite(temp1)) {
                continue;
            }

            // generujemy 3 punkty: t0 + 0h, +1h, +2h
            for (let k = 0; k < 3; k++) {
                const dt = t0 + k * 3600;
                const alpha = k / 3; // 0, 0.333, 0.666
                const temperature = temp0 + (temp1 - temp0) * alpha;

                hourly.push({
                    dt,
                    time: toTimeHH(dt),
                    temperature: Number(temperature.toFixed(1)),
                });

                // tniemy do 24 punktów max
                if (hourly.length >= 24) break;
            }
            if (hourly.length >= 24) break;
        }

        return {
            city: forecast.city?.name ?? city,
            hourly,
        };
    }
}
