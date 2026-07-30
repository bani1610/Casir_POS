import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { ClipboardList, Plus, LogOut, Menu, X } from 'lucide-react';

const navItems = [
    { to: '/karyawan',              icon: ClipboardList, label: 'Order Aktif', end: true },
    { to: '/karyawan/orders/create', icon: Plus,          label: 'Buat Order'  },
    { to: '/karyawan/orders',        icon: ClipboardList, label: 'Riwayat Order' },
];

export default function KaryawanLayout() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try { await authService.logout(); } finally {
            logout();
            navigate('/login');
            toast.success('Berhasil logout');
        }
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-[var(--color-bg)]">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-60 bg-white border-r border-[var(--color-border)] flex flex-col shadow-sm
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo + Close Button */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)]">
                    <span className="text-xl font-bold text-[var(--color-primary)]">
                        Casir<span className="text-[var(--color-text)]"> POS</span>
                    </span>
                    <button
                        onClick={closeSidebar}
                        className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                                ${isActive ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:bg-slate-50'}`
                            }>
                            <Icon size={18} />{label}
                        </NavLink>
                    ))}
                </nav>

                {/* User + Logout */}
                <div className="p-4 border-t border-[var(--color-border)]">
                    <p className="text-sm font-medium px-2 mb-2 truncate">{user?.name}</p>
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--color-danger)] hover:bg-red-50 transition-colors">
                        <LogOut size={16} />Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="text-lg font-bold text-[var(--color-primary)]">
                        Casir<span className="text-[var(--color-text)]"> POS</span>
                    </span>
                    <div className="w-10" /> {/* Spacer */}
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
