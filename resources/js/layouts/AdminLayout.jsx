import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import {
    LayoutDashboard, UtensilsCrossed, Tags,
    Users, BarChart3, Shield, LogOut, ChevronRight
} from 'lucide-react';

const navItems = [
    { to: '/admin',           icon: LayoutDashboard, label: 'Dashboard',   end: true },
    { to: '/admin/menus',     icon: UtensilsCrossed, label: 'Menu'          },
    { to: '/admin/categories',icon: Tags,            label: 'Kategori'      },
    { to: '/admin/karyawan',  icon: Users,           label: 'Karyawan'      },
    { to: '/admin/laporan',   icon: BarChart3,       label: 'Laporan'       },
    { to: '/admin/audit-log', icon: Shield,          label: 'Audit Log'     },
];

export default function AdminLayout() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } finally {
            logout();
            navigate('/login');
            toast.success('Berhasil logout');
        }
    };

    return (
        <div className="flex min-h-screen bg-[var(--color-bg)]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-[var(--color-border)] flex flex-col shadow-sm">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
                    <span className="text-xl font-bold text-[var(--color-primary)] tracking-tight">
                        Casir<span className="text-[var(--color-text)]"> POS</span>
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                                ${isActive
                                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                                    : 'text-[var(--color-text-muted)] hover:bg-slate-50 hover:text-[var(--color-text)]'
                                }`
                            }
                        >
                            <Icon size={18} />
                            <span className="flex-1">{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User + Logout */}
                <div className="p-4 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-sm font-semibold">
                            {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name ?? 'Admin'}</p>
                            <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[var(--color-danger)] hover:bg-red-50 transition-colors duration-200"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
