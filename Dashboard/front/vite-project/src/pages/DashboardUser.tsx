// src/pages/DashboardUser.tsx
//
// Widok panelu użytkownika.
// Pozwala wyszukać miasto, pobiera aktualną pogodę oraz dane godzinowe (24h) i prezentuje je w panelach oraz na wykresie.
// Dodatkowo ustawia tło aplikacji (panorama) zależnie od miasta i trybu bgMode przechowywanego w localStorage.

import React, { useEffect, useMemo, useState } from "react";  // Import React + hooków do stanu, efektów i memoizacji.
import CitySearch from "../components/CitySearch";            // Import komponentu formularza wyszukiwania miasta.
import WeatherCard from "../components/WeatherCard";          // Import komponentu karty pogodowej (w tym pliku nieużywany).

import {                                                     // Import funkcji API i typów do pobierania danych pogodowych.
  getUserWeather,                                            // Funkcja pobierająca aktualną pogodę dla zalogowanego użytkownika.
  getUserHourly24,                                           // Funkcja pobierająca dane godzinowe (24h).
  WeatherResponse,                                           // Typ odpowiedzi dla aktualnej pogody.
  Hourly24Response                                           // Typ odpowiedzi dla danych godzinowych.
} from "../api/weatherApi";
import useAuth from "../hooks/useAuth";                      // Import hooka auth do pobrania danych zalogowanego użytkownika.

import {                                                     // Import konfiguracji panoram i helpera wyboru tła.
  DEFAULT_PANORAMA,                                          // Domyślne tło dla trybu light.
  DEFAULT_PANORAMA_DARK,                                     // Domyślne tło dla trybu dark.
  getPanorama,                                               // Funkcja wybierająca panoramę na podstawie miasta i trybu.
  BgMode                                                     // Typ unii (light/dark) dla trybu tła.
} from "../config/panoramas";
import { normalizeCity } from "../utils/normalizeCity";      // Import funkcji normalizującej nazwę miasta do klucza panoramy.

import {                                                     // Import komponentów biblioteki Recharts do rysowania wykresu.
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const STORAGE_KEY = "bgMode";                                // Klucz localStorage dla trybu tła.
const EVENT_NAME = "bgmode:changed";                         // Nazwa eventu informującego o zmianie trybu tła.

function readBgMode(): BgMode {                              // Funkcja odczytująca aktualny tryb tła z localStorage.
  const v = localStorage.getItem(STORAGE_KEY);               // Pobiera zapisany string z localStorage.
  return v === "dark" || v === "light" ? v : "light";        // Waliduje wartość i ustawia "light" jako domyślną.
}

const formatUnixTime = (unix?: number) => {                  // Funkcja formatująca czas UNIX na "HH:MM" w locale pl-PL.
  if (!unix) return "Brak danych";                           // Jeśli brak wartości, zwraca tekst zastępczy.
  return new Intl.DateTimeFormat("pl-PL", {                  // Tworzy formatter czasu dla języka polskiego.
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(unix * 1000));                          // Konwertuje sekundy UNIX na milisekundy i formatuje.
};

const DashboardUser: React.FC = () => {                      // Definicja komponentu strony dashboardu użytkownika.
  const { user } = useAuth();                                // Pobiera użytkownika z kontekstu auth.

  const [city, setCity] = useState("Warszawa");              // Stan przechowujący aktualnie wybrane miasto.

  const [weather, setWeather] = useState<WeatherResponse | null>(null); // Stan aktualnych danych pogodowych.
  const [loading, setLoading] = useState(false);             // Stan ładowania dla pobierania aktualnej pogody.
  const [error, setError] = useState<string | null>(null);   // Stan komunikatu błędu dla aktualnej pogody.

  const [hourly, setHourly] = useState<Hourly24Response | null>(null); // Stan danych godzinowych (24h).
  const [hourlyLoading, setHourlyLoading] = useState(false); // Stan ładowania dla danych godzinowych.
  const [hourlyError, setHourlyError] = useState<string | null>(null); // Stan błędu dla danych godzinowych.

  const [bgMode, setBgMode] = useState<BgMode>(() => readBgMode()); // Stan trybu tła (init z localStorage).

  const loadWeather = async (targetCity: string) => {        // Funkcja pobierająca aktualną pogodę dla podanego miasta.
    setLoading(true);                                        // Ustawia stan ładowania.
    setError(null);                                          // Czyści poprzedni błąd.

    try {
      const data = await getUserWeather(targetCity);         // Wywołuje endpoint /weather/current z parametrem city.
      setWeather(data);                                      // Zapisuje dane pogodowe w stanie.
    } catch (e) {
      console.error(e);                                      // Loguje błąd.
      setError("Nie udało się pobrać pełnych danych pogodowych."); // Ustawia komunikat błędu.
      setWeather(null);                                      // Czyści dane pogodowe.
    } finally {
      setLoading(false);                                     // Kończy ładowanie niezależnie od wyniku.
    }
  };

  const loadHourly = async (targetCity: string) => {         // Funkcja pobierająca dane godzinowe (24h) dla miasta.
    setHourlyLoading(true);                                  // Ustawia stan ładowania wykresu.
    setHourlyError(null);                                    // Czyści poprzedni błąd wykresu.

    try {
      const data = await getUserHourly24(targetCity);        // Wywołuje endpoint /weather/hourly z parametrem city.
      setHourly(data);                                       // Zapisuje dane godzinowe w stanie.
    } catch (e) {
      console.error(e);                                      // Loguje błąd.
      setHourlyError("Nie udało się pobrać prognozy godzinowej (24h)."); // Ustawia komunikat błędu.
      setHourly(null);                                       // Czyści dane godzinowe.
    } finally {
      setHourlyLoading(false);                               // Kończy ładowanie wykresu niezależnie od wyniku.
    }
  };

  useEffect(() => {                                          // Efekt uruchamiany przy każdej zmianie city.
    loadWeather(city);                                       // Pobiera aktualną pogodę dla city.
    loadHourly(city);                                        // Pobiera dane godzinowe dla city.
  }, [city]);                                                // Zależność: city.

  useEffect(() => {                                          // Efekt podpinający nasłuch na event zmiany bgMode.
    const handler = (e: Event) => {                          // Handler eventu.
      const mode = (e as CustomEvent<BgMode>).detail;        // Wyciąga tryb z CustomEvent.detail.
      setBgMode(mode);                                       // Aktualizuje stan bgMode.
    };

    window.addEventListener(EVENT_NAME, handler as EventListener); // Rejestruje handler na window.

    setBgMode(readBgMode());                                 // Synchronizuje stan z aktualną wartością w localStorage.

    return () => window.removeEventListener(EVENT_NAME, handler as EventListener); // Czyści listener przy unmount.
  }, []);                                                    // Uruchamia się tylko raz.

  useEffect(() => {                                          // Efekt aktualizujący obraz tła na podstawie miasta i trybu.
    const key = normalizeCity(city);                         // Normalizuje nazwę miasta do klucza w mapach panoram.
    const bg = getPanorama(key, bgMode);                     // Wybiera ścieżkę panoramy dla danego miasta i trybu.
    document.documentElement.style.setProperty(              // Ustawia CSS variable wykorzystywaną przez style tła aplikacji.
        "--app-bg-image",
        `url("${bg}")`
    );
  }, [city, bgMode]);                                        // Zależności: city i bgMode.

  useEffect(() => {                                          // Efekt sprzątający: przy unmount przywraca domyślne tło.
    return () => {
      const fallback = bgMode === "dark"                     // Wybiera domyślną panoramę zależnie od aktualnego trybu.
          ? DEFAULT_PANORAMA_DARK
          : DEFAULT_PANORAMA;

      document.documentElement.style.setProperty(            // Ustawia domyślne tło w CSS variable.
          "--app-bg-image",
          `url("${fallback}")`
      );
    };
  }, [bgMode]);                                              // Zależność: bgMode.

  const handleSearch = (targetCity: string) => setCity(targetCity); // Handler wyszukiwania miasta (ustawia city).

  const tempNow = weather?.temperature;                      // Odczytuje temperaturę z aktualnej pogody (może być undefined).
  const feels = weather?.feelsLike;                          // Odczytuje temperaturę odczuwalną (może być undefined).

  const stats24h = useMemo(() => {                           // Memoizacja statystyk 24h obliczanych z hourly.hourly.
    const temps = hourly?.hourly?.map((p) => p.temperature) ?? []; // Buduje tablicę temperatur z danych godzinowych.
    if (!temps.length) {                                     // Jeśli brak temperatur, zwraca wartości null.
      return { min: null, max: null, avg: null, range: null };
    }
    const min = Math.min(...temps);                          // Liczy minimalną temperaturę.
    const max = Math.max(...temps);                          // Liczy maksymalną temperaturę.
    const avg = temps.reduce((a, b) => a + b, 0) / temps.length; // Liczy średnią temperaturę.
    const range = max - min;                                 // Liczy rozstęp temperatur.
    return { min, max, avg, range };                         // Zwraca obiekt statystyk.
  }, [hourly]);                                              // Przelicza tylko gdy zmieni się hourly.

  const visibilityKm =                                       // Wylicza widoczność w km, jeśli visibility jest liczbą.
      typeof weather?.visibility === "number" ? weather.visibility / 1000 : null;

  return (
      <section className="dashboard">                        {/* Główny kontener dashboardu. */}
        <header className="dashboard__header">               {/* Nagłówek dashboardu. */}
          <div className="dashboard__title">                 {/* Sekcja tytułu. */}
            <h1 className="dashboard__h1">Witaj, {user?.email ?? "Użytkowniku"}</h1> {/* Powitanie z emailem lub fallbackiem. */}
          </div>

          <div className="dashboard__search">                {/* Sekcja wyszukiwania miasta. */}
            <CitySearch onSearch={handleSearch} defaultCity={city} /> {/* Formularz wyszukiwania miasta. */}
          </div>
        </header>

        {(loading || error) && (                             // Sekcja statusu dla pobierania aktualnej pogody.
            <div className="dashboard__status">
              {loading && <p className="muted">Ładowanie danych…</p>} {/* Informacja o ładowaniu. */}
              {error && <p className="error">{error}</p>}     {/* Informacja o błędzie. */}
            </div>
        )}

        <div className="dashboard__grid">                    {/* Główny grid z panelami. */}
          <div className="panel">                            {/* Panel z podsumowaniem aktualnej pogody. */}
            {weather ? (                                     // Jeśli dane istnieją, renderuje szczegóły.
                <>
                  <div className="summaryTop">
                    <h1 className="summaryCity">{weather.city}</h1> {/* Nazwa miasta z odpowiedzi API. */}
                  </div>

                  <div className="kv kv--summary">           {/* Sekcja key-value z podsumowaniem. */}
                    <div className="kv__row">
                      <span>Temperatura</span>
                      <b>{weather.temperature.toFixed(1)}°C</b> {/* Zaokrąglenie temperatury do 1 miejsca. */}
                    </div>

                    <div className="kv__row kv__row--wrap">
                      <span>Odczuwalna</span>
                      <b>{typeof weather.feelsLike === "number" ? `${weather.feelsLike.toFixed(1)}°C` : "Brak danych"}</b>
                    </div>

                    <div className="kv__row">
                      <span>Pogoda</span>
                      <span className="kv__value">{weather.description}</span> {/* Opis pogody z API. */}
                    </div>

                    <div className="kv__row">
                      <span>Wschód słońca</span>
                      <b>{formatUnixTime(weather.sunrise)}</b> {/* Formatowanie timestampu wschodu. */}
                    </div>

                    <div className="kv__row">
                      <span>Zachód słońca</span>
                      <b>{formatUnixTime(weather.sunset)}</b> {/* Formatowanie timestampu zachodu. */}
                    </div>

                    <div className="kv__row">
                      <span>Zachmurzenie</span>
                      <b>{typeof weather.cloudiness === "number" ? `${weather.cloudiness}%` : "Brak danych"}</b>
                    </div>

                    <div className="kv__row">
                      <span>Widoczność</span>
                      <b>{visibilityKm !== null ? `${visibilityKm.toFixed(1)} km` : "Brak danych"}</b>
                    </div>
                  </div>
                </>
            ) : (                                             // Jeśli brak danych, pokazuje instrukcję.
                <p className="muted">Wpisz miasto i kliknij „Szukaj”, aby zobaczyć dane.</p>
            )}
          </div>

          <div className="panel panel--chart">               {/* Panel z wykresem temperatury 24h. */}
            <div className="panel__head panel__head--chart"> {/* Nagłówek panelu wykresu. */}
              <h2 className="panel__title">Temperatura (24h)</h2>

              <div className="metrics">                      {/* Sekcja metryk “Teraz” i “Odczuwalna”. */}
                <div className="metric">
                  <div className="metric__value">
                    {tempNow !== undefined ? `${tempNow.toFixed(1)}°C` : "—"}
                  </div>
                  <div className="metric__label">Teraz</div>
                </div>
                <div className="metric">
                  <div className="metric__value">
                    {feels !== undefined ? `${feels.toFixed(1)}°C` : "—"}
                  </div>
                  <div className="metric__label">Odczuwalna</div>
                </div>
              </div>
            </div>

            {hourlyLoading && <p className="muted">Ładowanie wykresu…</p>} {/* Komunikat ładowania wykresu. */}
            {hourlyError && <p className="error">{hourlyError}</p>}       {/* Komunikat błędu wykresu. */}

            {!hourlyLoading && !hourlyError && (!hourly?.hourly?.length) && ( // Komunikat braku danych do wykresu.
                <p className="muted">Brak danych do wykresu dla tego miasta.</p>
            )}

            {!hourlyLoading && !hourlyError && hourly?.hourly?.length ? (    // Renderuje wykres tylko gdy są dane.
                <div className="chartBox">
                  <ResponsiveContainer width="100%" height="100%">           {/* Kontener responsywny dopasowujący wykres do panelu. */}
                    <LineChart
                        data={hourly.hourly}                                 // Dane wejściowe wykresu.
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}  // Marginesy wewnętrzne wykresu.
                    >
                      <CartesianGrid strokeDasharray="3 3" />               {/* Siatka pomocnicza wykresu. */}
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} />      {/* Oś X oparta o pole time. */}
                      <YAxis tickFormatter={(v) => `${v}°`} width={40} tick={{ fontSize: 12 }} /> {/* Oś Y z formatowaniem stopni. */}
                      <Tooltip
                          formatter={(value: any) => [`${value} °C`, "Temp"]} // Format wartości w tooltipie.
                          labelFormatter={(label) => `Godzina: ${label}`}    // Format etykiety tooltipa.
                      />
                      <Line
                          type="monotone"                                   // Sposób interpolacji linii.
                          dataKey="temperature"                              // Pole danych dla wartości linii.
                          dot={false}                                        // Wyłącza kropki na każdym punkcie.
                          stroke="var(--accent)"                              // Kolor linii z CSS variable.
                          strokeWidth={3}                                    // Grubość linii.
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
            ) : null}
          </div>

          <div className="dashboard__right">                 {/* Prawa kolumna z dodatkowymi parametrami. */}
            <div className="panel">
              <h2 className="panel__title">Parametry</h2>
              <div className="kv">
                <div className="kv__row">
                  <span>Ciśnienie</span>
                  <b>{weather?.pressure ?? "Brak danych"} hPa</b>
                </div>
                <div className="kv__row">
                  <span>Wilgotność</span>
                  <b>{weather?.humidity ?? "Brak danych"} %</b>
                </div>
              </div>
            </div>

            <div className="panel">
              <h2 className="panel__title">Wiatr</h2>
              <div className="kv">
                <div className="kv__row">
                  <span>Prędkość</span>
                  <b>{weather?.windSpeed ?? "Brak danych"} m/s</b>
                </div>
                <div className="kv__row">
                  <span>Kierunek</span>
                  <b>{weather?.windDirection ?? "Brak danych"}°</b>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="kv">
                <div className="kv__row">
                  <span>Max temp (24h)</span>
                  <b>{stats24h.max !== null ? `${stats24h.max.toFixed(1)}°C` : "—"}</b>
                </div>
                <div className="kv__row">
                  <span>Min temp (24h)</span>
                  <b>{stats24h.min !== null ? `${stats24h.min.toFixed(1)}°C` : "—"}</b>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
  );
};

export default DashboardUser;                               // Eksport strony do użycia w routingu.
