// src/context/AuthContext.tsx
//
// Globalny kontekst uwierzytelniania aplikacji.
// Przechowuje stan zalogowanego użytkownika, informację o zalogowaniu i ładowaniu oraz udostępnia funkcje login/register/logout.

import React, {                                      // Import React oraz narzędzi do tworzenia kontekstu i pracy ze stanem.
  createContext,                                     // Funkcja tworząca obiekt kontekstu.
  useEffect,                                         // Hook do uruchamiania logiki przy starcie/zmianach zależności.
  useState,                                          // Hook do przechowywania stanu.
  ReactNode,                                         // Typ dla children przekazywanego do Providera.
} from 'react';

import {                                             // Import funkcji do komunikacji z backendem auth oraz typu ApiUser.
  loginRequest,                                      // Funkcja wysyłająca POST /auth/login.
  registerRequest,                                   // Funkcja wysyłająca POST /auth/register.
  getMe,                                             // Funkcja wysyłająca GET /auth/me.
  ApiUser,                                           // Typ użytkownika zwracany przez backend.
} from '../api/authApi';

export type UserRole = 'user' | 'admin';              // Typ unii dla ról użytkownika używanych po stronie frontu.

export interface User {                               // Interfejs opisujący użytkownika trzymanego w stanie frontu.
  id: string;                                         // Id użytkownika.
  email: string;                                      // Email użytkownika.
  role: UserRole;                                     // Rola użytkownika.
}

interface AuthContextValue {                          // Interfejs opisujący wartości udostępniane przez AuthContext.
  user: User | null;                                  // Aktualny użytkownik lub null, gdy niezalogowany.
  isAuthenticated: boolean;                            // Flaga informująca, czy użytkownik jest zalogowany.
  loading: boolean;                                   // Flaga informująca, czy trwa inicjalizacja/logowanie/rejestracja.
  login: (email: string, password: string) => Promise<void>;    // Funkcja logowania.
  register: (email: string, password: string) => Promise<void>; // Funkcja rejestracji.
  logout: () => void;                                 // Funkcja wylogowania.
}

export const AuthContext = createContext<AuthContextValue | undefined>( // Tworzy kontekst z wartością początkową undefined.
    undefined
);

interface AuthProviderProps {                         // Interfejs propsów dla AuthProvider.
  children: ReactNode;                                // Zagnieżdżone komponenty aplikacji owinięte providerem.
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ // Definicja komponentu providera.
                                                            children,                                           // Destrukturyzacja children.
                                                          }) => {
  const [user, setUser] = useState<User | null>(null); // Stan przechowujący użytkownika (null = niezalogowany).
  const [loading, setLoading] = useState(true);        // Stan informujący o trwającym ładowaniu/operacjach auth.

  useEffect(() => {                                   // Efekt uruchamiany raz po starcie aplikacji.
    const initAuth = async () => {                     // Funkcja inicjalizująca stan auth na podstawie tokenu.
      const token = localStorage.getItem('token');     // Odczytuje token JWT z localStorage.
      if (!token) {                                    // Jeśli tokena nie ma, kończy inicjalizację.
        setLoading(false);                             // Ustawia loading na false (aplikacja może renderować normalnie).
        return;                                        // Przerywa dalsze wykonywanie.
      }

      try {
        const me: ApiUser = await getMe();             // Pobiera dane użytkownika z backendu na podstawie tokenu.
        setUser({                                      // Zapisuje użytkownika w stanie aplikacji.
          id: me.id,                                   // Mapuje id z ApiUser na User.
          email: me.email,                             // Mapuje email z ApiUser na User.
          role: me.role,                               // Mapuje rolę z ApiUser na User.
        });
      } catch (err) {
        console.error('Nie udało się pobrać /auth/me', err); // Loguje błąd inicjalizacji auth.
        localStorage.removeItem('token');              // Usuwa niepoprawny/nieaktualny token z localStorage.
        setUser(null);                                 // Czyści użytkownika w stanie (wymusza stan niezalogowany).
      } finally {
        setLoading(false);                             // Zawsze kończy inicjalizację ustawiając loading na false.
      }
    };

    initAuth();                                        // Wywołuje inicjalizację po starcie.
  }, []);                                              // Pusta lista zależności -> uruchamia się tylko raz.

  const login = async (email: string, password: string) => { // Funkcja logowania wywoływana przez UI.
    setLoading(true);                                  // Ustawia loading, aby UI mogło pokazać stan oczekiwania.
    try {
      const res = await loginRequest(email, password); // Wysyła żądanie logowania do backendu.
      localStorage.setItem('token', res.token);        // Zapisuje token w localStorage (axiosInstance użyje go w nagłówkach).
      setUser({                                        // Ustawia użytkownika w stanie na podstawie odpowiedzi.
        id: res.user.id,                               // Id użytkownika.
        email: res.user.email,                         // Email użytkownika.
        role: res.user.role,                           // Rola użytkownika.
      });
    } catch (err) {
      throw err;                                       // Przekazuje błąd do komponentu logowania (np. do wyświetlenia komunikatu).
    } finally {
      setLoading(false);                               // Kończy operację logowania niezależnie od sukcesu/błędu.
    }
  };

  const register = async (email: string, password: string) => { // Funkcja rejestracji wywoływana przez UI.
    setLoading(true);                                  // Ustawia loading na czas rejestracji.
    try {
      await registerRequest(email, password);          // Wysyła żądanie rejestracji do backendu.
      const res = await loginRequest(email, password); // Po rejestracji wykonuje logowanie, aby uzyskać token i usera.
      localStorage.setItem('token', res.token);        // Zapisuje token w localStorage.
      setUser({                                        // Ustawia użytkownika w stanie po automatycznym logowaniu.
        id: res.user.id,                               // Id użytkownika.
        email: res.user.email,                         // Email użytkownika.
        role: res.user.role,                           // Rola użytkownika.
      });
    } catch (err) {
      throw err;                                       // Przekazuje błąd do komponentu rejestracji.
    } finally {
      setLoading(false);                               // Kończy operację rejestracji niezależnie od sukcesu/błędu.
    }
  };

  const logout = () => {                               // Funkcja wylogowania wywoływana przez UI.
    localStorage.removeItem('token');                  // Usuwa token z localStorage.
    setUser(null);                                     // Czyści użytkownika w stanie (przechodzi w stan niezalogowany).
  };

  const value: AuthContextValue = {                    // Składa obiekt wartości udostępniany przez context.
    user,                                              // Aktualny użytkownik.
    isAuthenticated: !!user,                            // True jeśli user nie jest null.
    loading,                                           // Aktualny stan ładowania.
    login,                                             // Funkcja logowania.
    register,                                          // Funkcja rejestracji.
    logout,                                            // Funkcja wylogowania.
  };

  return (                                             // Renderuje provider kontekstu dla całej aplikacji.
      <AuthContext.Provider value={value}>               {/* Udostępnia value wszystkim potomkom. */}
        {children}                                       {/* Renderuje zagnieżdżone komponenty aplikacji. */}
      </AuthContext.Provider>
  );
};
