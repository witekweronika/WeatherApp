// src/pages/Login.tsx
//
// Strona logowania użytkownika.
// Zbiera login (email) i hasło, wywołuje login() z AuthContext, a po sukcesie przekierowuje do /dashboard.

import React, { FormEvent, useState } from 'react';   // Import React + typ zdarzenia formularza + hook do stanu.
import { useNavigate } from 'react-router-dom';       // Hook do nawigacji programowej po trasach.
import useAuth from '../hooks/useAuth';               // Hook dostępu do kontekstu uwierzytelniania (login).

const Login: React.FC = () => {                       // Definicja komponentu strony logowania.
  const { login } = useAuth();                        // Pobiera funkcję login() z AuthContext.
  const navigate = useNavigate();                     // Inicjalizuje funkcję do przekierowań.

  const [loginValue, setLoginValue] = useState('');   // Stan dla pola loginu (w praktyce email).
  const [password, setPassword] = useState('');       // Stan dla pola hasła.

  const [error, setError] = useState<string | null>(null); // Stan komunikatu błędu logowania.
  const [loading, setLoading] = useState(false);      // Stan informujący o trwającym logowaniu.

  const handleSubmit = async (e: FormEvent) => {       // Handler wysłania formularza logowania.
    e.preventDefault();                                // Blokuje domyślne przeładowanie strony.
    setError(null);                                    // Czyści poprzedni błąd.
    setLoading(true);                                  // Ustawia loading na czas requestu.

    try {
      await login(loginValue, password);               // Wywołuje login() z danymi z formularza.
      navigate('/dashboard');                          // Po sukcesie przekierowuje użytkownika do panelu.
    } catch (err) {
      console.error(err);                              // Loguje błąd do konsoli.
      setError('Logowanie nie powiodło się. Sprawdź dane i spróbuj ponownie.'); // Ustawia komunikat błędu w UI.
    } finally {
      setLoading(false);                               // Kończy loading niezależnie od sukcesu/błędu.
    }
  };

  return (
      <section className="auth-page">                  {/* Kontener strony autoryzacji (CSS). */}
        <div className="auth-box">                     {/* Box z formularzem (CSS). */}
          <h1 className="auth-title">Logowanie</h1>    {/* Tytuł strony. */}

          <form className="auth-form" onSubmit={handleSubmit}> {/* Formularz logowania z handlerem submit. */}
            <input
                className="auth-input"                 // Klasa CSS inputa.
                type="text"                            // Pole tekstowe dla loginu/emaila.
                placeholder="Login"                    // Placeholder pola.
                value={loginValue}                     // Kontrolowany input: wartość ze stanu.
                onChange={e => setLoginValue(e.target.value)} // Aktualizuje stan po zmianie.
                autoComplete="username"                // Podpowiadanie przeglądarki dla loginu.
                required                               // Wymusza wypełnienie pola.
            />

            <input
                className="auth-input"                 // Klasa CSS inputa.
                type="password"                        // Pole hasła (maskowane).
                placeholder="Password"                 // Placeholder pola.
                value={password}                       // Kontrolowany input: wartość ze stanu.
                onChange={e => setPassword(e.target.value)} // Aktualizuje stan po zmianie.
                autoComplete="current-password"        // Podpowiadanie przeglądarki dla hasła.
                required                               // Wymusza wypełnienie pola.
            />

            <button
                className="auth-submit"                  // Klasa CSS przycisku submit.
                type="submit"                            // Typ submit wysyłający formularz.
                disabled={loading}                       // Blokuje przycisk, gdy trwa logowanie.
            >
              {loading ? '...' : 'Zaloguj'}            {/* Tekst przycisku zależny od stanu. */}
            </button>
          </form>

          {error && <p className="error">{error}</p>}  {/* Wyświetla błąd, jeśli error nie jest null. */}
        </div>
      </section>
  );
};

export default Login;                                   // Eksport strony do użycia w routingu.
