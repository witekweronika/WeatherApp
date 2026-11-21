// src/components/Layout/AdminLayout.tsx
//
// Layout (układ) dla części administracyjnej aplikacji.
// Renderuje wspólny navbar dla panelu admina oraz <Outlet />, w którym pojawiają się podstrony admina z React Router.

import React from "react";                               // Import React do definiowania komponentu.
import { Link, Outlet } from "react-router-dom";         // Link: nawigacja bez przeładowania; Outlet: miejsce na zagnieżdżone trasy.
import useAuth from "../../hooks/useAuth";               // Hook dostarczający dane zalogowanego użytkownika i funkcję wylogowania.
import ThemeToggleButton from "../ThemeToggleButton";    // Komponent przycisku przełączania trybu (np. light/dark lub panoramy).

const AdminLayout: React.FC = () => {                    // Definicja komponentu funkcyjnego dla layoutu admina.
    const { user, logout } = useAuth();                  // Pobiera aktualnego użytkownika oraz funkcję wylogowania z kontekstu auth.

    return (
        <div className="app-root">                       {/* Główny wrapper aplikacji (stylowanie globalne). */}
            <header className="navbar">                  {/* Pasek nawigacyjny widoczny na wszystkich stronach admina. */}
                <Link to="/" className="navbar__logo">   {/* Link do strony głównej (public). */}
                    <span className="navbar__logoIcon">☀️</span>  {/* Ikona w logo. */}
                    <span className="navbar__logoText">WeatherApp</span> {/* Tekst logo. */}
                </Link>

                <div className="navbar__right">          {/* Prawa część navbaru (przyciski/akcje). */}
                    <Link to="/dashboard" className="navbar__pillBtn"> {/* Link do panelu użytkownika. */}
                        Panel użytkownika
                    </Link>
                    <Link to="/admin" className="navbar__pillBtn">     {/* Link do panelu admina. */}
                        Panel admina
                    </Link>

                    <span className="navbar__userName">  {/* Wyświetlenie emaila zalogowanego użytkownika. */}
                        {user?.email} (admin)            {/* Optional chaining: jeśli user jest undefined, nie rzuci błędem. */}
                    </span>

                    <ThemeToggleButton />                {/* Przycisk zmiany trybu (zależnie od implementacji komponentu). */}

                    <button className="navbar__pillBtn" onClick={logout}> {/* Przycisk wylogowania wywołujący logout(). */}
                        Wyloguj
                    </button>
                </div>
            </header>

            <main className="app-main">                  {/* Główna część strony pod navbar. */}
                <Outlet />                               {/* Renderuje komponent trasy zagnieżdżonej pod /admin. */}
            </main>
        </div>
    );
};

export default AdminLayout;                               // Eksport komponentu, aby mógł być użyty w konfiguracji routingu.
