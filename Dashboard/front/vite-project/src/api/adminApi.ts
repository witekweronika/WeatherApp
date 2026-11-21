// src/api/adminApi.ts

// Warstwa dostępu do endpointów administracyjnych backendu.
// Eksportuje funkcje wywołujące żądania HTTP przez wspólną instancję axios (z tokenem auth)
// oraz typy opisujące oczekiwany kształt danych zwracanych przez API.

import axiosInstance from './axiosInstance'; // Import skonfigurowanej instancji axios (baseURL + interceptor Authorization).

export interface AppThemeConfig {            // Definicja typu danych dla konfiguracji motywu aplikacji.
  id: string;                                // Unikalny identyfikator motywu.
  name: string;                              // Nazwa motywu.
  primaryColor: string;                      // Główny kolor motywu (np. akcenty UI).
  backgroundColor: string;                   // Kolor tła motywu.
}

export const getUsers = async () => {         // Funkcja asynchroniczna pobierająca listę użytkowników.
  const res = await axiosInstance.get('/admin/users'); // Wysyła GET na endpoint /admin/users.
  return res.data;                            // Zwraca payload odpowiedzi (dane z serwera).
};

export const getThemes = async (): Promise<AppThemeConfig[]> => { // Pobiera listę motywów (z typowaniem zwracanych danych).
  const res = await axiosInstance.get<AppThemeConfig[]>('/admin/themes'); // Wysyła GET na /admin/themes i typuje odpowiedź.
  return res.data;                            // Zwraca tablicę motywów z odpowiedzi.
};

export const updateTheme = async (themeId: string): Promise<void> => { // Ustawia aktywny motyw na podstawie themeId.
  await axiosInstance.post('/admin/themes/use', { themeId });          // Wysyła POST na /admin/themes/use z body { themeId }.
};
