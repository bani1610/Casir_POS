import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboardService';
import StatCard from '@/components/ui/StatCard';
import { DollarSign, ShoppingBag, Clock, XCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getAdminStats();
            setStats(data);
        } catch (error) {
            toast.error('Gagal memuat data dashboard');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const statusChartData = [
        { name: 'Pending', value: stats?.orders_by_status?.pending || 0, fill: '#f59e0b' },
        { name: 'Processing', value: stats?.orders_by_status?.processing || 0, fill: '#3b82f6' },
        { name: 'Done', value: stats?.orders_by_status?.done || 0, fill: '#22c55e' },
        { name: 'Cancelled', value: stats?.orders_by_status?.cancelled || 0, fill: '#ef4444' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard Admin</h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    Statistik penjualan hari ini — {dayjs().format('DD MMMM YYYY')}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={DollarSign}
                    label="Total Pendapatan"
                    value={formatRupiah(stats?.total_revenue_today || 0)}
                    iconBgColor="bg-green-50"
                    iconColor="text-green-600"
                />
                <StatCard
                    icon={ShoppingBag}
                    label="Total Order"
                    value={stats?.total_orders_today || 0}
                    iconBgColor="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <StatCard
                    icon={Clock}
                    label="Order Pending"
                    value={stats?.orders_by_status?.pending || 0}
                    iconBgColor="bg-amber-50"
                    iconColor="text-amber-600"
                />
                <StatCard
                    icon={XCircle}
                    label="Order Dibatalkan"
                    value={stats?.orders_by_status?.cancelled || 0}
                    iconBgColor="bg-red-50"
                    iconColor="text-red-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Chart */}
                <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Order per Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={statusChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Selling Menus */}
                <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-[var(--color-primary)]" />
                        Menu Terlaris
                    </h2>
                    <div className="space-y-3">
                        {stats?.top_selling_menus?.length > 0 ? (
                            stats.top_selling_menus.map((menu, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 flex items-center justify-center bg-[var(--color-primary)] text-white text-xs font-bold rounded-full">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-sm text-[var(--color-text)]">{menu.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-[var(--color-text)]">{menu.total_quantity}x</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">{formatRupiah(menu.total_revenue)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-[var(--color-text-muted)] text-center py-8">Belum ada data penjualan</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)]">Order Terbaru</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-[var(--color-border)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Meja/Antrian
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Waktu
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {stats?.recent_orders?.length > 0 ? (
                                stats.recent_orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text)]">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                                            {order.table_number || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[var(--color-text)]">
                                            {formatRupiah(order.total_price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                    order.status === 'done'
                                                        ? 'bg-green-100 text-green-700'
                                                        : order.status === 'processing'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : order.status === 'pending'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                                            {dayjs(order.created_at).format('HH:mm')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-[var(--color-text-muted)]">
                                        Belum ada order
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
