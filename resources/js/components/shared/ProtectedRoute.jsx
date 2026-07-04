import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * ProtectedRoute — Casir POS
 *
 * Melindungi route yang memerlukan autentikasi.
 * Jika belum login → redirect ke /login
 * Jika sudah login tapi role tidak sesuai → redirect ke /unauthorized
 */
export default function ProtectedRoute({ allowedRoles }) {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
