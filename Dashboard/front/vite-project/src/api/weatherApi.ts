// src/api/weatherApi.ts

// Warstwa dostępu do endpointów pogodowych.
// Udostępnia typy danych pogodowych oraz funkcje pobierające pogodę publiczną, pogodę dla zalogowanego użytkownika i dane godzinowe (24h).

import axiosInstance from './axiosInstance'; // Import współdzielonej instancji axios (baseURL + Authorization z tokenu).

export interface WeatherResponse {           // Interfejs opisujący strukturę danych pogodowych zwracanych przez API.
  city: string;                              // Nazwa miasta.
  temperature: number;                       // Aktualna temperatura.
  description: string;                       // Opis pogody.
  feelsLike: number;                         // Temperatura odczuwalna.
  sunrise?: number;                          // Czas wschodu słońca (timestamp).
  sunset?: number;                           // Czas zachodu słońca (timestamp).
  windSpeed?: number;                        // Prędkość wiatru.
  windDirection?: number;                    // Kierunek wiatru (stopnie).
  cloudiness?: number;                       // Zachmurzenie (%) – opcjonalne.
  visibility?: number;                       // Widoczność (np. w metrach).
  airPollution?: number;                     // Wskaźnik zanieczyszczeń.
  humidity?: number;                         // Wilgotność (%).
  pressure?: number;                         // Ciśnienie (hPa).
}

export const getPublicWeather = async (      // Funkcja pobierająca pogodę w trybie publicznym (bez wymaganego logowania).
    city: string                               // Parametr: miasto, dla którego pobieramy dane.
): Promise<WeatherResponse> => {             // Zwraca dane pogodowe jako WeatherResponse.
  const res = await axiosInstance.get<WeatherResponse>( // Wysyła GET na endpoint publiczny i typuje odpowiedź.
      '/weather/public',                       // Ścieżka endpointu publicznego.
      { params: { city } }                     // Query params: ?city=...
  );
  return res.data;                           // Zwraca payload odpowiedzi.
};

export const getUserWeather = async (        // Funkcja pobierająca pogodę w trybie użytkownika (z tokenem).
    city: string                               // Parametr: miasto, dla którego pobieramy dane.
): Promise<WeatherResponse> => {             // Zwraca dane pogodowe jako WeatherResponse.
  const res = await axiosInstance.get<WeatherResponse>( // Wysyła GET na endpoint chroniony i typuje odpowiedź.
      '/weather/current',                      // Ścieżka endpointu dla zalogowanych.
      { params: { city } }                     // Query params: ?city=...
  );
  return res.data;                           // Zwraca payload odpowiedzi.
};

export interface HourlyPoint {               // Interfejs opisujący pojedynczy punkt danych godzinowych.
  dt: number;                                // Timestamp punktu (np. UNIX time).
  time: string;                              // Godzina w formacie tekstowym, np. "HH:00".
  temperature: number;                       // Temperatura dla danej godziny.
}

export interface Hourly24Response {          // Interfejs opisujący odpowiedź z 24-godzinnymi danymi.
  city: string;                              // Nazwa miasta.
  hourly: HourlyPoint[];                     // Tablica punktów godzinowych.
}

export const getUserHourly24 = async (       // Funkcja pobierająca dane godzinowe (24h) dla zalogowanego użytkownika.
    city: string                               // Parametr: miasto, dla którego pobieramy dane.
): Promise<Hourly24Response> => {            // Zwraca dane jako Hourly24Response.
  const res = await axiosInstance.get<Hourly24Response>( // Wysyła GET na endpoint godzinowy i typuje odpowiedź.
      '/weather/hourly',                       // Ścieżka endpointu godzinowego.
      { params: { city } }                     // Query params: ?city=...
  );
  return res.data;                           // Zwraca payload odpowiedzi.
};
