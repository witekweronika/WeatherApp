// src/App.tsx
//
// Routing aplikacji + ochrona tras (RequireAuth) na podstawie logowania i roli.

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePublic from './pages/HomePublic';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardUser from './pages/DashboardUser';
import AdminPanel from './pages/AdminPanel';

import PublicLayout from './components/layout/PublicLayout';
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

import useAuth from './hooks/useAuth';

/**
 * RequireAuth:
 * - czeka aż AuthContext skończy inicjalizację (loading)
 * - jeśli brak logowania -> przekierowuje na /login
 * - jeśli rola nie jest dozwolona -> przekierowuje na /
 * - jeśli OK -> renderuje dokładnie JEDNO dziecko (ReactElement)
 */
const RequireAuth: React.FC<{
    children: React.ReactElement;
    allowedRoles?: ('user' | 'admin')[];
}> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    // Auth jeszcze się inicjalizuje (np. odpytywanie /auth/me po tokenie)
    if (loading) return <p>Ładowanie...</p>;

    // Brak zalogowania -> przejście do logowania
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Jest zalogowany, ale nie ma wymaganej roli
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // Dostęp OK
    return children;
};

const App: React.FC = () => {
    return (
        <Routes>
            {/* PUBLIC: strony dostępne bez logowania */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePublic />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* USER: dashboard dla user + admin, w layoucie użytkownika */}
            <Route
                element={
                    <RequireAuth allowedRoles={['user', 'admin']}>
                        <UserLayout />
                    </RequireAuth>
                }
            >
                <Route path="/dashboard" element={<DashboardUser />} />
            </Route>

            {/* ADMIN: panel admina tylko dla roli admin, w layoucie admina */}
            <Route
                element={
                    <RequireAuth allowedRoles={['admin']}>
                        <AdminLayout />
                    </RequireAuth>
                }
            >
                <Route path="/admin" element={<AdminPanel />} />
            </Route>

            {/* Fallback: nieznane ścieżki lecą na / */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;
