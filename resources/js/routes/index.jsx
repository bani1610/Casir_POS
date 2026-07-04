import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

// ─── Lazy Imports ──────────────────────────────────────
import { lazy, Suspense } from 'react';

const LoginPage         = lazy(() => import('@/pages/auth/LoginPage'));
const AdminLayout       = lazy(() => import('@/layouts/AdminLayout'));
const KaryawanLayout    = lazy(() => import('@/layouts/KaryawanLayout'));
const GuestLayout       = lazy(() => import('@/layouts/GuestLayout'));

// Admin Pages
const AdminDashboard    = lazy(() => import('@/pages/admin/DashboardPage'));
const CategoryPage      = lazy(() => import('@/pages/admin/CategoryPage'));
const MenuPage          = lazy(() => import('@/pages/admin/MenuPage'));
const KaryawanPage      = lazy(() => import('@/pages/admin/KaryawanPage'));
const LaporanPage       = lazy(() => import('@/pages/admin/LaporanPage'));
const AuditLogPage      = lazy(() => import('@/pages/admin/AuditLogPage'));

// Karyawan Pages
const KaryawanDashboard = lazy(() => import('@/pages/karyawan/DashboardPage'));
const CreateOrderPage   = lazy(() => import('@/pages/karyawan/CreateOrderPage'));
const OrderListPage     = lazy(() => import('@/pages/karyawan/OrderListPage'));

// Pembeli (Self-Order) Pages
const MenuBrowserPage   = lazy(() => import('@/pages/pembeli/MenuBrowserPage'));
const CartPage          = lazy(() => import('@/pages/pembeli/CartPage'));
const CheckoutPage      = lazy(() => import('@/pages/pembeli/CheckoutPage'));
const OrderStatusPage   = lazy(() => import('@/pages/pembeli/OrderStatusPage'));

// Misc
const NotFoundPage      = lazy(() => import('@/pages/NotFoundPage'));
const UnauthorizedPage  = lazy(() => import('@/pages/UnauthorizedPage'));

// ─── Loading Fallback ──────────────────────────────────
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4d50f0] border-t-transparent rounded-full animate-spin" />
    </div>
);

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader />}>
        <Component />
    </Suspense>
);

// ─── Router ────────────────────────────────────────────
const router = createBrowserRouter([
    // Public
    {
        path: '/login',
        element: withSuspense(LoginPage),
    },

    // Pembeli Self-Order (no auth)
    {
        path: '/order',
        element: withSuspense(GuestLayout),
        children: [
            { index: true, element: withSuspense(MenuBrowserPage) },
            { path: 'cart', element: withSuspense(CartPage) },
            { path: 'checkout', element: withSuspense(CheckoutPage) },
            { path: 'status', element: withSuspense(OrderStatusPage) },
        ],
    },

    // Admin Routes
    {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
            {
                path: '/admin',
                element: withSuspense(AdminLayout),
                children: [
                    { index: true, element: withSuspense(AdminDashboard) },
                    { path: 'categories', element: withSuspense(CategoryPage) },
                    { path: 'menus', element: withSuspense(MenuPage) },
                    { path: 'karyawan', element: withSuspense(KaryawanPage) },
                    { path: 'laporan', element: withSuspense(LaporanPage) },
                    { path: 'audit-log', element: withSuspense(AuditLogPage) },
                ],
            },
        ],
    },

    // Karyawan Routes
    {
        element: <ProtectedRoute allowedRoles={['karyawan']} />,
        children: [
            {
                path: '/karyawan',
                element: withSuspense(KaryawanLayout),
                children: [
                    { index: true, element: withSuspense(KaryawanDashboard) },
                    { path: 'orders/create', element: withSuspense(CreateOrderPage) },
                    { path: 'orders', element: withSuspense(OrderListPage) },
                ],
            },
        ],
    },

    // Misc
    { path: '/unauthorized', element: withSuspense(UnauthorizedPage) },
    { path: '*', element: withSuspense(NotFoundPage) },
]);

export default router;
