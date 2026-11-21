// src/components/Layout/PublicLayout.tsx
//
// Layout (układ) dla publicznej części aplikacji.
// Renderuje navbar dla stron dostępnych bez logowania oraz <Outlet />, w którym pojawiają się podstrony publiczne (np. Home, Login, Register).

import React from 'react';                          // Import React do definiowania komponentu.
import { Link, Outlet } from 'react-router-dom';    // Link: nawigacja bez przeładowania; Outlet: miejsce na zagnieżdżone trasy.
import useAuth from '../../hooks/useAuth';          // Hook dostarczający stan logowania, dane użytkownika i funkcję wylogowania.

const PublicLayout: React.FC = () => {              // Definicja komponentu funkcyjnego layoutu publicznego.
    const { isAuthenticated, user, logout } = useAuth(); // Pobiera informację o zalogowaniu, użytkownika oraz funkcję wylogowania.

    return (
        <div className="app-root">                  {/* Główny wrapper aplikacji (stylowanie globalne). */}
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

                <div className="navbar__right">     {/* Prawa część navbaru (akcje/logowanie/panel). */}
                    {isAuthenticated ? (            // Warunek: jeśli użytkownik jest zalogowany.
                        <>
                            {user?.email && (       // Jeśli istnieje email, wyświetla go w navbarze.
                                <span className="navbar__userName">{user.email}</span>
                            )}

                            <Link
                                to={user?.role === 'admin' ? '/admin' : '/dashboard'} // Przekierowanie do panelu zależnie od roli.
                                className="navbar__pillBtn navbar__pillBtn--primary"  // Klasy CSS dla przycisku w stylu „primary”.
                            >
                                Panel
                            </Link>

                            <button
                                type="button"       // Typ button, aby nie zachowywał się jak submit w formularzach.
                                className="navbar__pillBtn navbar__pillBtn--ghost"   // Klasy CSS dla stylu „ghost”.
                                onClick={logout}    // Kliknięcie wywołuje funkcję wylogowania z kontekstu auth.
                            >
                                Wyloguj
                            </button>
                        </>
                    ) : (                            // Gałąź dla niezalogowanego użytkownika.
                        <>
                            <Link to="/login" className="navbar__pillBtn navbar__pillBtn--ghost"> {/* Link do logowania. */}
                                Logowanie
                            </Link>

                            <Link to="/register" className="navbar__pillBtn navbar__pillBtn--primary"> {/* Link do rejestracji. */}
                                Rejestracja
                            </Link>
                        </>
                    )}
                </div>
            </header>

            <main className="app-main">             {/* Główna część strony pod navbar. */}
                <Outlet />                          {/* Renderuje komponent trasy zagnieżdżonej pod layoutem publicznym. */}
            </main>
        </div>
    );
};

export default PublicLayout;                         // Eksport komponentu, aby mógł być użyty w konfiguracji routingu.
