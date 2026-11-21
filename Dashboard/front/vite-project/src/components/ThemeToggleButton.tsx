// src/components/ThemeToggleButton.tsx
//
// Przycisk przełączania trybu (light/dark) dostępny tylko dla admina.
// Odczytuje i zapisuje tryb w localStorage oraz synchronizuje go z backendowym /config.
// Dodatkowo emituje zdarzenie window, żeby inne komponenty mogły zareagować na zmianę.

import React, { useEffect, useState } from "react";          // Import React oraz hooków do stanu i efektów.
import useAuth from "../hooks/useAuth";                      // Import hooka do pobrania aktualnego użytkownika.
import { getConfig, updateConfig, ThemeMode } from "../api/configApi"; // Import funkcji API do konfiguracji i typu ThemeMode.

const STORAGE_KEY = "bgMode";                                // Klucz localStorage, pod którym zapisany jest aktualny tryb.
const EVENT_NAME = "bgmode:changed";                         // Nazwa custom eventu emitowanego po zmianie trybu.

function setBgMode(mode: ThemeMode) {                        // Funkcja ustawiająca tryb lokalnie i informująca resztę aplikacji.
    localStorage.setItem(STORAGE_KEY, mode);                 // Zapisuje tryb (light/dark) do localStorage.
    window.dispatchEvent(                                    // Emituje zdarzenie globalne do nasłuchu w innych komponentach.
        new CustomEvent<ThemeMode>(EVENT_NAME, { detail: mode }) // CustomEvent niesie nowy tryb w polu detail.
    );
}

function readBgMode(): ThemeMode {                           // Funkcja odczytująca tryb z localStorage.
    const v = localStorage.getItem(STORAGE_KEY);             // Pobiera zapisany string z localStorage.
    return v === "dark" || v === "light" ? v : "light";      // Waliduje wartość i zwraca light jako domyślną.
}

const ThemeToggleButton: React.FC = () => {                  // Definicja komponentu funkcyjnego.
    const { user } = useAuth();                              // Pobiera obiekt użytkownika z kontekstu auth.
    const isAdmin = user?.role === "admin" || (user as any)?.isAdmin === true; // Sprawdza, czy użytkownik jest adminem.
    if (!isAdmin) return null;                               // Jeśli nie admin, komponent nic nie renderuje.

    const [theme, setTheme] = useState<ThemeMode>(() => readBgMode()); // Stan przechowujący aktualny tryb (init z localStorage).
    const [loading, setLoading] = useState(false);           // Stan kontrolujący blokadę przycisku podczas zapisu do backendu.

    useEffect(() => {                                        // Efekt uruchamiany raz po zamontowaniu komponentu.
        (async () => {                                       // IIFE async, żeby móc użyć await w useEffect.
            try {
                const cfg = await getConfig();               // Pobiera konfigurację z backendu (/config).
                const t = (cfg.theme ?? "light") as ThemeMode; // Wyciąga theme z configu lub używa light jako domyślnego.
                setTheme(t);                                 // Aktualizuje stan komponentu nowym trybem.
                setBgMode(t);                                // Zapisuje tryb do localStorage i emituje event.
            } catch (e) {                                    // Obsługa błędu, gdy /config nie działa lub zwróci błąd.
                const t = readBgMode();                      // Odczytuje tryb lokalnie jako fallback.
                setTheme(t);                                 // Ustawia stan na tryb z localStorage.
                setBgMode(t);                                // Synchronizuje event i localStorage na podstawie fallbacku.
                console.error(e);                            // Loguje błąd do konsoli.
            }
        })();                                                // Wywołuje funkcję natychmiast.
    }, []);                                                  // Pusta lista zależności = uruchamia się tylko raz.

    const toggle = async () => {                              // Funkcja obsługująca kliknięcie przycisku.
        const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark"; // Wylicza kolejny tryb na podstawie obecnego.
        setLoading(true);                                     // Ustawia stan ładowania, żeby zablokować przycisk.

        try {
            const cfg = await updateConfig({ theme: nextTheme }); // Wysyła PUT /config z nowym trybem.
            const saved = (cfg.theme ?? nextTheme) as ThemeMode;  // Ustala tryb na podstawie odpowiedzi backendu.
            setTheme(saved);                                  // Aktualizuje stan komponentu.
            setBgMode(saved);                                 // Zapisuje tryb do localStorage i emituje event.
        } catch (e) {
            console.error(e);                                 // Loguje błąd, jeśli zapis do backendu się nie udał.
            setTheme(nextTheme);                              // Awaryjnie aktualizuje stan lokalnie.
            setBgMode(nextTheme);                             // Awaryjnie zapisuje lokalnie i emituje event.
        } finally {
            setLoading(false);                                // Zdejmuje stan ładowania niezależnie od sukcesu/błędu.
        }
    };

    return (
        <button
            className="navbar__pillBtn themeBtn"              // Klasy CSS odpowiadające za wygląd przycisku.
            onClick={toggle}                                  // Podpina handler kliknięcia.
            disabled={loading}                                // Blokuje kliknięcie podczas trwającego requestu.
            title="Admin: przełącz wariant panoramy (normalna / przyciemniona)" // Tooltip po najechaniu.
        >
            {loading ? "..." : theme === "dark" ? "Light mode" : "Dark mode"} {/* Tekst przycisku zależny od stanu. */}
        </button>
    );
};

export default ThemeToggleButton;                             // Eksport komponentu do użycia w layoutach.
