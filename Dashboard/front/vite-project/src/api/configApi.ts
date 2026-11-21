// src/api/configApi.ts

// Warstwa dostępu do endpointów konfiguracji aplikacji.
// Udostępnia typy konfiguracji oraz funkcje do pobrania i aktualizacji konfiguracji po stronie backendu.

import axiosInstance from './axiosInstance'; // Import współdzielonej instancji axios (baseURL + Authorization z tokenu).

export type ThemeMode = 'light' | 'dark';    // Typ unii opisujący dozwolone tryby motywu.

export interface AppConfig {                 // Interfejs opisujący strukturę konfiguracji aplikacji.
    name: string;                            // Nazwa aplikacji/instancji (np. do wyświetlenia w UI).
    theme: ThemeMode;                        // Aktualny tryb motywu (light/dark).
    primaryColor?: string;                   // Opcjonalny kolor główny (np. akcenty).
    secondaryColor?: string;                 // Opcjonalny kolor dodatkowy.
    defaultCity?: string;                    // Opcjonalne domyślne miasto (np. startowe w dashboardzie).
}

export const getConfig = async (): Promise<AppConfig> => { // Funkcja asynchroniczna pobierająca konfigurację.
    const res = await axiosInstance.get<AppConfig>('/config'); // Wysyła GET na /config i typuje odpowiedź jako AppConfig.
    return res.data;                          // Zwraca obiekt konfiguracji z odpowiedzi.
};

export const updateConfig = async (          // Funkcja asynchroniczna aktualizująca konfigurację.
    patch: Partial<AppConfig>                // Parametr: fragment konfiguracji do zmiany (częściowa aktualizacja).
): Promise<AppConfig> => {                   // Zwraca pełną konfigurację po aktualizacji.
    const res = await axiosInstance.put<AppConfig>( // Wysyła PUT na /config z body zawierającym patch.
        '/config',                           // Ścieżka endpointu konfiguracji.
        patch                                // Body żądania: częściowa konfiguracja do nadpisania.
    );
    return res.data;                          // Zwraca konfigurację zwróconą przez backend po zapisie.
};
