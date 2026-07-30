import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '@/services/dashboardService';
import { Clock, CheckCircle, Plus, Package } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export default function KaryawanDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getKaryawanStats();
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-100 text-amber-700';
            case 'processing':
                return 'bg-blue-100 text-blue-700';
            case 'done':
                return 'bg-green-100 text-green-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard Karyawan</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Order aktif yang perlu diproses
                    </p>
                </div>
                <button
                    onClick={() => navigate('/karyawan/orders/create')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm"
                >
                    <Plus size={18} />
                    Buat Order Baru
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-[var(--color-text-muted)] font-medium mb-1">Total Aktif</p>
                            <p className="text-3xl font-bold text-[var(--color-text)]">{stats?.total_active || 0}</p>
                        </div>
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                            <Package size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-[var(--color-text-muted)] font-medium mb-1">Pending</p>
                            <p className="text-3xl font-bold text-amber-600">{stats?.pending_count || 0}</p>
                        </div>
                        <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
                            <Clock size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-[var(--color-text-muted)] font-medium mb-1">Processing</p>
                            <p className="text-3xl font-bold text-blue-600">{stats?.processing_count || 0}</p>
                        </div>
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Orders */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)]">Daftar Order Aktif</h2>
                </div>

                {stats?.active_orders?.length > 0 ? (
                    <div className="divide-y divide-[var(--color-border)]">
                        {stats.active_orders.map((order) => (
                            <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-[var(--color-text)]">
                                                Order #{order.id}
                                            </h3>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--color-text-muted)]">
                                            Meja: {order.table_number || '-'} • {dayjs(order.created_at).format('HH:mm')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-[var(--color-text)]">
                                            {formatRupiah(order.total_price)}
                                        </p>
                                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                            {order.payment_method?.name || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="bg-slate-50 rounded-lg p-4 mb-3">
                                    <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">
                                        Item Pesanan
                                    </p>
                                    <div className="space-y-2">
                                        {order.order_items?.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between text-sm">
                                                <span className="text-[var(--color-text)]">
                                                    {item.quantity}x {item.menu?.name || 'N/A'}
                                                </span>
                                                <span className="font-medium text-[var(--color-text)]">
                                                    {formatRupiah(item.subtotal)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                {order.notes && (
                                    <div className="mb-3">
                                        <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                                            Catatan:
                                        </p>
                                        <p className="text-sm text-[var(--color-text)] bg-amber-50 px-3 py-2 rounded-lg">
                                            {order.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {order.status === 'pending' && (
                                        <button
                                            onClick={() => navigate(`/karyawan/orders`)}
                                            className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                        >
                                            Proses Order
                                        </button>
                                    )}
                                    {order.status === 'processing' && (
                                        <button
                                            onClick={() => navigate(`/karyawan/orders`)}
                                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                        >
                                            Selesaikan Order
                                        </button>
                                    )}
                                    <button
                                        onClick={() => navigate(`/karyawan/orders`)}
                                        className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        Detail
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package size={32} className="text-slate-400" />
                        </div>
                        <p className="text-[var(--color-text-muted)] mb-4">Tidak ada order aktif</p>
                        <button
                            onClick={() => navigate('/karyawan/orders/create')}
                            className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Buat Order Baru
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
