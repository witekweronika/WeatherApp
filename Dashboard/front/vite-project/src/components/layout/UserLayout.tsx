// src/components/Layout/UserLayout.tsx
//
// Layout (układ) dla części użytkownika (panel użytkownika).
// Renderuje navbar dla zalogowanych użytkowników oraz <Outlet />, w którym pojawiają się podstrony użytkownika (np. /dashboard).

import React from 'react';                          // Import React do definiowania komponentu.
import { Link, Outlet } from 'react-router-dom';    // Link: nawigacja bez przeładowania; Outlet: miejsce na zagnieżdżone trasy.
import useAuth from '../../hooks/useAuth';          // Hook dostarczający stan logowania, dane użytkownika i funkcję wylogowania.
import ThemeToggleButton from '../ThemeToggleButton'; // Import przycisku przełączania trybu (np. light/dark lub panoramy).

const UserLayout: React.FC = () => {                // Definicja komponentu funkcyjnego layoutu użytkownika.
    const { isAuthenticated, user, logout } = useAuth(); // Pobiera informację o zalogowaniu, obiekt użytkownika i funkcję wylogowania.

    return (
        <div className="app-root">                     {/* Główny wrapper aplikacji (stylowanie globalne). */}
            <header className="navbar">             {/* Pasek nawigacyjny widoczny na wszystkich stronach publicznych. */}
                <Link
                    to="/"                          /* Link do strony głównej (public). */
                    className="navbar__logo"        /* Klasa CSS dla logo w navbarze. */
                    aria-label="WeatherApp — strona główna" // Tekst dla czytników ekranu.
                >
                    <span
                        className="navbar__logoIcon">☀️</span>
                    <span className="navbar__logoText">WeatherApp</span> {/* Tekst logo. */}
                </Link>

                <ThemeToggleButton />                      {/* Przycisk zmiany trybu (logika zależy od implementacji komponentu). */}

                <div className="navbar__right">            {/* Prawa część navbaru (akcje użytkownika). */}
                    {isAuthenticated && user && (            // Warunek: elementy widoczne tylko dla zalogowanego użytkownika.
                        <>
                            <span className="navbar__userName">{user.email}</span> {/* Wyświetla email użytkownika. */}
                            <button
                                className="navbar__pillBtn"      // Klasa CSS przycisku w stylu „pill”.
                                onClick={logout}                 // Kliknięcie wywołuje funkcję wylogowania z kontekstu auth.
                            >
                                Wyloguj
                            </button>
                        </>
                    )}
                </div>
            </header>

            <main className="app-main">                  {/* Główna część strony pod navbar. */}
                <Outlet />                                 {/* Renderuje komponent trasy zagnieżdżonej pod layoutem użytkownika. */}
            </main>
        </div>
    );
};

export default UserLayout;                           // Eksport komponentu, aby mógł być użyty w konfiguracji routingu.
