// src/api/authApi.ts

// Warstwa dostępu do endpointów autoryzacji (logowanie, rejestracja, pobranie profilu).
// Udostępnia typy danych zwracanych przez API oraz funkcje wysyłające żądania HTTP.

import axiosInstance from './axiosInstance'; // Import skonfigurowanej instancji axios (baseURL + interceptor Authorization).

export type ApiUserRole = 'user' | 'admin'; // Typ unii opisujący dopuszczalne role użytkownika zwracane przez API.

export interface ApiUser {                  // Interfejs opisujący obiekt użytkownika zwracany przez API.
  id: string;                               // Id użytkownika.
  email: string;                            // Email użytkownika.
  role: ApiUserRole;                        // Rola użytkownika (user/admin).
}

export interface LoginResponse {            // Interfejs opisujący odpowiedź API po poprawnym logowaniu.
  token: string;                            // JWT zwracany przez backend.
  user: ApiUser;                            // Obiekt użytkownika powiązany z tokenem.
}

// logowanie – zwraca token i dane użytkownika
export const loginRequest = async (         // Funkcja asynchroniczna realizująca logowanie.
    email: string,                            // Parametr: email użytkownika.
    password: string                          // Parametr: hasło użytkownika.
): Promise<LoginResponse> => {              // Zwraca Promise z obiektem LoginResponse.
  const res = await axiosInstance.post<LoginResponse>( // Wysyła POST na endpoint logowania i typuje odpowiedź.
      '/auth/login',                          // Ścieżka endpointu logowania.
      {                                       // Body żądania.
        email,                                // Pole email.
        password,                             // Pole password.
      }
  );
  return res.data;                          // Zwraca dane odpowiedzi (token + user).
};

// rejestracja – na razie nic nie zwraca, tylko HTTP 201/200
export const registerRequest = async (      // Funkcja asynchroniczna realizująca rejestrację.
    email: string,                            // Parametr: email użytkownika.
    password: string                          // Parametr: hasło użytkownika.
): Promise<void> => {                       // Zwraca Promise<void> (brak danych w odpowiedzi).
  await axiosInstance.post(                 // Wysyła POST na endpoint rejestracji.
      '/auth/register',                       // Ścieżka endpointu rejestracji.
      { email, password }                     // Body żądania: email i password.
  );
};

// sprawdzenie aktualnie zalogowanego użytkownika (na podstawie tokenu)
export const getMe = async (): Promise<ApiUser> => { // Funkcja pobierająca profil aktualnie zalogowanego użytkownika.
  const res = await axiosInstance.get<ApiUser>('/auth/me'); // Wysyła GET na /auth/me i typuje odpowiedź jako ApiUser.
  return res.data;                          // Zwraca obiekt użytkownika z odpowiedzi.
};
