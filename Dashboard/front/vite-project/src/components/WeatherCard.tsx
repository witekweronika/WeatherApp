// src/components/WeatherCard.tsx

// Komponent prezentacyjny wyświetlający kartę z danymi pogodowymi dla jednego miasta.
// Przyjmuje dane w propsach i renderuje je warunkowo (np. szczegóły tylko jeśli są dostępne).

import React from 'react';                               // Import React do definiowania komponentu.

interface WeatherCardProps {                             // Interfejs opisujący propsy przekazywane do komponentu.
    city: string;                                          // Nazwa miasta do wyświetlenia.
    temperature: number;                                   // Temperatura aktualna.
    description: string;                                   // Opis pogody (tekst).
    feelsLike?: number;                                    // Opcjonalna temperatura odczuwalna.
    humidity?: number;                                     // Opcjonalna wilgotność.
    windSpeed?: number;                                    // Opcjonalna prędkość wiatru.
    isFullData?: boolean;                                  // Flaga informująca, że pokazujemy “pełne dane” (np. dla zalogowanego).
}

const WeatherCard: React.FC<WeatherCardProps> = ({       // Definicja komponentu funkcyjnego z destrukturyzacją propsów.
                                                     city,                                                  // Nazwa miasta.
                                                     temperature,                                           // Temperatura.
                                                     description,                                           // Opis pogody.
                                                     feelsLike,                                             // Odczuwalna (opcjonalnie).
                                                     humidity,                                              // Wilgotność (opcjonalnie).
                                                     windSpeed,                                             // Wiatr (opcjonalnie).
                                                     isFullData,                                            // Flaga pełnych danych (opcjonalnie).
                                                 }) => {
    return (
        <article className="weather-card">               {/* Główny kontener karty pogodowej. */}
            <header className="weather-card__header">    {/* Nagłówek karty (miasto + opcjonalna etykieta). */}
                <h2>{city}</h2>                          {/* Wyświetla nazwę miasta. */}
                {isFullData && <span className="badge">Pełne dane</span>} {/* Renderuje badge tylko gdy isFullData = true. */}
            </header>

            <p className="weather-card__temp">Temperatura: {temperature}°C</p> {/* Wiersz z temperaturą. */}
            <p className="weather-card__desc">Pogoda: {description}</p>         {/* Wiersz z opisem pogody. */}

            <div className="weather-card__details">      {/* Sekcja szczegółów, renderowana warunkowo per pole. */}
                {feelsLike !== undefined && (            // Sprawdza czy feelsLike zostało przekazane (może być 0).
                    <span>Odczuwalna temperatura: {feelsLike}°C</span> // Wyświetla temperaturę odczuwalną.
                )}
                {humidity !== undefined && (             // Sprawdza czy humidity zostało przekazane.
                    <span>Wilgotność: {humidity}%</span> // Wyświetla wilgotność.
                )}
                {windSpeed !== undefined && (            // Sprawdza czy windSpeed zostało przekazane.
                    <span>Wiatr: {windSpeed} m/s</span>  // Wyświetla prędkość wiatru.
                )}
            </div>
        </article>
    );
};

export default WeatherCard;                               // Eksport komponentu do użycia w stronach (np. HomePublic, DashboardUser).
