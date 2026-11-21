// src/api/axiosInstance.ts

// Konfiguruje współdzieloną instancję axios dla całej aplikacji.
// Ustawia baseURL do backendu oraz interceptor, który automatycznie dodaje nagłówek Authorization z tokenem JWT.

import axios, {                             // Import biblioteki axios oraz typów do poprawnego typowania konfiguracji.
    InternalAxiosRequestConfig,             // Typ konfiguracji requestu w interceptorze.
    AxiosRequestHeaders,                    // Typ nagłówków axios.
} from 'axios';

const axiosInstance = axios.create({        // Tworzy nową instancję axios z domyślną konfiguracją.
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3100/api', // Ustawia adres API z env lub fallback lokalny.
    withCredentials: true,                  // Pozwala wysyłać ciasteczka (jeśli backend ich używa).
});

axiosInstance.interceptors.request.use(     // Rejestruje interceptor wykonywany przed wysłaniem każdego requestu.
    (config: InternalAxiosRequestConfig) => { // Funkcja interceptorowa dostaje konfigurację requestu.
        const token = localStorage.getItem('token'); // Pobiera zapisany token JWT z localStorage.

        if (token) {                        // Jeśli token istnieje, dodaje go do nagłówka Authorization.
            const headers: AxiosRequestHeaders =     // Zapewnia poprawnie typowany obiekt headers.
                (config.headers as AxiosRequestHeaders) ||
                ({} as AxiosRequestHeaders);

            headers.Authorization = `Bearer ${token}`; // Ustawia nagłówek auth w formacie Bearer.
            config.headers = headers;       // Podmienia nagłówki w konfiguracji requestu.
        }

        return config;                      // Zwraca zmodyfikowaną konfigurację requestu.
    },
    error => {                              // Obsługa błędu, jeśli interceptor requestu się wywali.
        return Promise.reject(error);       // Przekazuje błąd dalej do wywołującego.
    }
);

export default axiosInstance;               // Eksportuje instancję do użycia w plikach api/*.ts.
