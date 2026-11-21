// src/pages/AdminPanel.tsx
//
// Widok panelu administratora do podglądu i zmiany konfiguracji aplikacji (motyw light/dark).
// Pobiera konfigurację z backendu (/config), pozwala ją zaktualizować i ustawia atrybut data-theme na <html>.

import React, { useEffect, useState } from 'react';          // Import React + hooków do efektów i stanu.
import useAuth from '../hooks/useAuth';                      // Import hooka do pobrania informacji o zalogowanym użytkowniku.
import { getConfig, updateConfig, ThemeMode } from '../api/configApi'; // Import funkcji API do konfiguracji i typu ThemeMode.

const AdminPanel: React.FC = () => {                         // Definicja komponentu strony panelu admina.
  const { user } = useAuth();                                // Pobiera obiekt użytkownika z kontekstu auth.

  const [theme, setTheme] = useState<ThemeMode>('dark');      // Stan aktualnego motywu w UI (domyślnie "dark").
  const [loading, setLoading] = useState(false);              // Stan informujący o trwającym requestcie.
  const [error, setError] = useState<string | null>(null);    // Stan przechowujący komunikat błędu lub null.
  const [success, setSuccess] = useState<string | null>(null);// Stan przechowujący komunikat sukcesu lub null.

  const applyThemeToDom = (t: ThemeMode) => {                 // Funkcja ustawiająca atrybut data-theme na elemencie <html>.
    document.documentElement.setAttribute('data-theme', t);   // Ustawia data-theme="light" lub data-theme="dark".
  };

  useEffect(() => {                                           // Efekt uruchamiany raz po wejściu na stronę.
    const load = async () => {                                // Funkcja ładująca konfigurację z backendu.
      setLoading(true);                                       // Ustawia loading na czas pobierania.
      setError(null);                                         // Czyści ewentualny poprzedni błąd.
      setSuccess(null);                                       // Czyści ewentualny poprzedni komunikat sukcesu.

      try {
        const cfg = await getConfig();                        // Wysyła GET /config i pobiera konfigurację.
        const t = (cfg.theme ?? 'dark') as ThemeMode;         // Wybiera theme z configu lub używa "dark" jako domyślnego.
        setTheme(t);                                          // Zapisuje motyw w stanie komponentu.
        applyThemeToDom(t);                                   // Aplikuje motyw do DOM (CSS bazuje na data-theme).
      } catch (e) {
        console.error(e);                                     // Loguje błąd do konsoli dla debugowania.
        setError('Nie udało się pobrać konfiguracji (sprawdź czy jesteś adminem).'); // Ustawia komunikat błędu w UI.
      } finally {
        setLoading(false);                                    // Kończy stan ładowania niezależnie od sukcesu/błędu.
      }
    };

    load();                                                   // Wywołuje pobranie konfiguracji po zamontowaniu.
  }, []);                                                     // Pusta lista zależności -> uruchamia się tylko raz.

  const handleToggleTheme = async () => {                     // Handler kliknięcia przycisku przełączania motywu.
    setLoading(true);                                         // Ustawia loading na czas zapisu.
    setError(null);                                           // Czyści błąd przed próbą zapisu.
    setSuccess(null);                                         // Czyści komunikat sukcesu przed próbą zapisu.

    try {
      const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark'; // Wylicza następny motyw na podstawie obecnego.
      const cfg = await updateConfig({ theme: nextTheme });    // Wysyła PUT /config z nowym theme i odbiera aktualną konfigurację.

      setTheme(cfg.theme);                                    // Ustawia theme w stanie na wartość zwróconą przez backend.
      applyThemeToDom(cfg.theme);                              // Aplikuje theme do DOM.

      setSuccess(`Zmieniono motyw na: ${cfg.theme}`);          // Ustawia komunikat sukcesu do wyświetlenia w UI.
    } catch (e) {
      console.error(e);                                       // Loguje błąd do konsoli.
      setError('Nie udało się zmienić motywu (sprawdź uprawnienia admina).'); // Ustawia komunikat błędu.
    } finally {
      setLoading(false);                                      // Kończy stan ładowania.
    }
  };

  return (
      <section>                                               {/* Sekcja zawartości panelu admina. */}
        <h1>Panel administratora</h1>                         {/* Nagłówek strony. */}
        <p>                                                   {/* Informacja o zalogowanym użytkowniku. */}
          Zalogowano jako <strong>{user?.email}</strong> (rola: {user?.role}).
        </p>

        <h2>Tryb aplikacji (Light/Dark)</h2>                  {/* Sekcja zarządzania motywem. */}

        {loading && <p>Ładowanie...</p>}                      {/* Komunikat ładowania, gdy trwa request. */}
        {error && <p className="error">{error}</p>}           {/* Komunikat błędu, jeśli error nie jest null. */}
        {success && <p className="success">{success}</p>}     {/* Komunikat sukcesu, jeśli success nie jest null. */}

        <p>Aktualny tryb: <strong>{theme}</strong></p>        {/* Wyświetla aktualny tryb z local state. */}

        <button
            className="btn btn--outline"                        // Klasy CSS przycisku.
            onClick={handleToggleTheme}                         // Podpina handler przełączania motywu.
            disabled={loading}                                  // Blokuje przycisk podczas requestu.
        >
          {loading ? 'Zapisuję...' : `Przełącz na ${theme === 'dark' ? 'light' : 'dark'}`} {/* Tekst zależny od stanu. */}
        </button>
      </section>
  );
};

export default AdminPanel;                                    // Eksport strony do użycia w routingu.
