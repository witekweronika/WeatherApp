// src/hooks/useAuth.ts
//
// Hook pomocniczy do wygodnego korzystania z AuthContext.
// Zwraca wartość kontekstu (user, isAuthenticated, loading, login, register, logout) i wymusza użycie wewnątrz AuthProvider.

import { useContext } from 'react';                 // Import hooka do odczytu wartości kontekstu.
import { AuthContext } from '../context/AuthContext'; // Import utworzonego kontekstu uwierzytelniania.

const useAuth = () => {                             // Definicja własnego hooka.
  const ctx = useContext(AuthContext);              // Pobiera bieżącą wartość AuthContext z najbliższego providera.

  if (!ctx) {                                       // Jeśli context jest undefined, oznacza to brak AuthProvider w drzewie.
    throw new Error('useAuth musi być użyty wewnątrz <AuthProvider>'); // Rzuca błąd, żeby szybko wykryć złą konfigurację.
  }

  return ctx;                                       // Zwraca obiekt kontekstu (AuthContextValue).
};

export default useAuth;                              // Eksport hooka do użycia w komponentach.
