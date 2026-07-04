import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { ClipboardList, Plus, LogOut } from 'lucide-react';

const navItems = [
    { to: '/karyawan',              icon: ClipboardList, label: 'Order Aktif', end: true },
    { to: '/karyawan/orders/create', icon: Plus,          label: 'Buat Order'  },
    { to: '/karyawan/orders',        icon: ClipboardList, label: 'Riwayat Order' },
];

export default function KaryawanLayout() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try { await authService.logout(); } finally {
            logout();
            navigate('/login');
            toast.success('Berhasil logout');
        }
    };

    return (
        <div className="flex min-h-screen bg-[var(--color-bg)]">
            <aside className="w-60 bg-white border-r border-[var(--color-border)] flex flex-col shadow-sm">
                <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
                    <span className="text-xl font-bold text-[var(--color-primary)]">Casir<span className="text-[var(--color-text)]"> POS</span></span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(({ to, icon: Icon, label, end }) => (
                        <NavLink key={to} to={to} end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                                ${isActive ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:bg-slate-50'}`
                            }>
                            <Icon size={18} />{label}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-[var(--color-border)]">
                    <p className="text-sm font-medium px-2 mb-2">{user?.name}</p>
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--color-danger)] hover:bg-red-50 transition-colors">
                        <LogOut size={16} />Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8"><Outlet /></main>
        </div>
    );
}
