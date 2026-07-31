import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { selfOrderService } from '@/services/selfOrderService';
import OrderStatusBadge from '@/components/ui/OrderStatusBadge';
import { RefreshCw, Plus, CheckCircle2, Clock, ChefHat } from 'lucide-react';

const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

const formatDate = (iso) =>
    iso ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)) : '-';

// ─── Status Icon ──────────────────────────────────────────────────────────────
function StatusIcon({ status }) {
    if (status === 'done') return <CheckCircle2 size={32} className="text-green-500" />;
    if (status === 'processing') return <ChefHat size={32} className="text-blue-500" />;
    if (status === 'cancelled') return <div className="text-3xl">✗</div>;
    return <Clock size={32} className="text-amber-500" />;
}

// ─── Auto-poll setiap 15 detik ────────────────────────────────────────────────
export default function OrderStatusPage() {
    const navigate = useNavigate();
    const customerIdentifier = useCartStore(s => s.customerIdentifier);
    const lastOrderId = useCartStore(s => s.lastOrderId);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const timerRef = useRef(null);

    const fetchStatus = async () => {
        if (!customerIdentifier) return;
        try {
            const data = await selfOrderService.getOrderStatus(customerIdentifier);
            setOrders(Array.isArray(data) ? data : []);
            setLastUpdated(new Date());
        } catch {
            // silent fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        // Poll setiap 15 detik untuk update status real-time
        timerRef.current = setInterval(fetchStatus, 15_000);
        return () => clearInterval(timerRef.current);
    }, [customerIdentifier]);

    if (!customerIdentifier) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <Clock size={48} className="text-slate-300 mb-4" />
                <h2 className="font-bold text-[var(--color-text)] text-lg mb-2">Tidak Ada Sesi Aktif</h2>
                <p className="text-sm text-[var(--color-text-muted)] mb-6">Silakan mulai order terlebih dahulu</p>
                <button
                    onClick={() => navigate('/order')}
                    className="px-5 py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl"
                >
                    Mulai Order
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[var(--color-text)]">Status Pesanan</h1>
                    {lastUpdated && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                            Diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
                        </p>
                    )}
                </div>
                <button
                    onClick={fetchStatus}
                    className="flex items-center gap-1.5 px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm hover:bg-slate-50 transition-colors"
                >
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
                    <Clock size={48} className="mb-3 opacity-30" />
                    <p className="font-medium">Belum ada pesanan</p>
                    <button
                        onClick={() => navigate('/order')}
                        className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl"
                    >
                        <Plus size={15} /> Pesan Sekarang
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div
                            key={order.id}
                            className={`bg-white rounded-2xl border overflow-hidden shadow-sm ${
                                order.id === lastOrderId ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-20' : 'border-[var(--color-border)]'
                            }`}
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 p-4 border-b border-[var(--color-border)]">
                                <StatusIcon status={order.status} />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="font-bold text-[var(--color-text)]">Order #{order.id}</p>
                                        {order.id === lastOrderId && (
                                            <span className="text-xs bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full">Terbaru</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-[var(--color-text-muted)]">{formatDate(order.created_at)}</p>
                                </div>
                                <div className="text-right">
                                    <OrderStatusBadge status={order.status} size="sm" />
                                    <p className="text-sm font-bold text-[var(--color-primary)] mt-1">{formatPrice(order.total_price)}</p>
                                </div>
                            </div>

                            {/* Status message */}
                            <div className="px-4 py-3 bg-slate-50 text-sm">
                                {order.status === 'pending' && (
                                    <p className="text-amber-700">⏳ Pesanan Anda sedang menunggu konfirmasi kasir...</p>
                                )}
                                {order.status === 'processing' && (
                                    <p className="text-blue-700">👨‍🍳 Pesanan sedang diproses di dapur. Harap tunggu!</p>
                                )}
                                {order.status === 'done' && (
                                    <p className="text-green-700">✅ Pesanan selesai! Silakan ambil di kasir.</p>
                                )}
                                {order.status === 'cancelled' && (
                                    <p className="text-red-600">❌ Pesanan dibatalkan. Silakan hubungi kasir.</p>
                                )}
                            </div>

                            {/* Items */}
                            {order.items && order.items.length > 0 && (
                                <div className="px-4 py-3 space-y-1.5">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-[var(--color-text)]">
                                                {item.menu_name} <span className="text-[var(--color-text-muted)]">×{item.quantity}</span>
                                            </span>
                                            <span className="font-medium">{formatPrice(item.subtotal)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Info */}
                            <div className="px-4 pb-4 flex gap-3 text-xs text-[var(--color-text-muted)]">
                                {order.table_number && <span>🪑 Meja {order.table_number}</span>}
                                {order.payment_method?.name && <span>💳 {order.payment_method.name}</span>}
                            </div>
                        </div>
                    ))}

                    {/* Tambah order lagi */}
                    <button
                        onClick={() => navigate('/order')}
                        className="w-full py-3 border-2 border-dashed border-[var(--color-border)] rounded-2xl text-sm font-medium text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        + Tambah Pesanan
                    </button>
                </div>
            )}
        </div>
    );
}
