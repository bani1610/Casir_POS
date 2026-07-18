import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * RootRedirect — Smart redirect untuk root path
 *
 * Cek status autentikasi dan redirect sesuai role:
 * - Belum login → /login
 * - Admin → /admin
 * - Karyawan → /karyawan
 */
export default function RootRedirect() {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const dashboardPath = user?.role === 'admin' ? '/admin' : '/karyawan';
    return <Navigate to={dashboardPath} replace />;
}
