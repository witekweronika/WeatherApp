// src/pages/HomePublic.tsx
//
// Publiczna strona główna dla niezalogowanych użytkowników.
// Pobiera publiczne dane pogodowe (domyślnie dla Warszawy) i wyświetla je w komponencie WeatherCard.

import React, { useEffect, useState } from 'react';          // Import React + hooków do efektów i stanu.
import WeatherCard from '../components/WeatherCard';          // Import komponentu prezentacyjnego karty pogodowej.
import { getPublicWeather, WeatherResponse } from '../api/weatherApi'; // Import funkcji API publicznej pogody i typu odpowiedzi.

const HomePublic: React.FC = () => {                         // Definicja komponentu strony publicznej.
  const [weather, setWeather] = useState<WeatherResponse | null>(null); // Stan przechowujący dane pogody lub null.
  const [loading, setLoading] = useState(false);              // Stan informujący o trwającym pobieraniu danych.
  const [error, setError] = useState<string | null>(null);    // Stan komunikatu błędu lub null.

  const loadWeather = async (city: string = 'Warszawa') => {   // Funkcja pobierająca pogodę publiczną dla podanego miasta (domyślnie Warszawa).
    setLoading(true);                                         // Ustawia loading na czas requestu.
    setError(null);                                           // Czyści poprzedni błąd.

    try {
      const data = await getPublicWeather(city);              // Wysyła GET /weather/public?city=... i odbiera dane pogody.
      setWeather(data);                                       // Zapisuje dane w stanie.
    } catch (e) {
      console.error(e);                                       // Loguje błąd do konsoli.
      setError('Nie udało się pobrać danych pogodowych. Spróbuj ponownie.'); // Ustawia komunikat błędu.
    } finally {
      setLoading(false);                                      // Kończy loading niezależnie od sukcesu/błędu.
    }
  };

  useEffect(() => {                                           // Efekt uruchamiany raz po wejściu na stronę.
    loadWeather();                                            // Pobiera dane dla domyślnego miasta (Warszawa).
  }, []);                                                     // Pusta lista zależności -> uruchamia się tylko raz.

  return (
      <section className="home-public home-public-scope">     {/* Kontener sekcji strony publicznej. */}
        <div className="home-container">                      {/* Kontener layoutu strony. */}
          <p className="home-public__lead">                   {/* Tekst informacyjny dla niezalogowanego użytkownika. */}
            Jako niezalogowany użytkownik widzisz tylko dane pogodowe dla Warszawy.
          </p>

          {loading && <p>Ładowanie...</p>}                    {/* Komunikat ładowania podczas requestu. */}
          {error && <p className="error">{error}</p>}         {/* Komunikat błędu jeśli wystąpił. */}

          {weather && (                                       // Renderuje kartę pogody tylko gdy dane zostały pobrane.
              <div className="weather-container-home">
                <div className="weather-card-container-home">
                  <WeatherCard
                      city={weather.city}                     // Przekazuje miasto do karty.
                      temperature={weather.temperature}       // Przekazuje temperaturę.
                      feelsLike={weather.feelsLike}           // Przekazuje temperaturę odczuwalną (opcjonalnie).
                      description={weather.description}       // Przekazuje opis pogody.
                  />
                </div>
              </div>
          )}
        </div>
      </section>
  );
};

export default HomePublic;                                    // Eksport strony do użycia w routingu.
