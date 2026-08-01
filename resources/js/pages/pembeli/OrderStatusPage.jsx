import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { selfOrderService } from '@/services/selfOrderService';
import OrderStatusBadge from '@/components/ui/OrderStatusBadge';
import { toast } from 'sonner';
import { RefreshCw, Plus, CheckCircle2, Clock, ChefHat, Check, AlertCircle, CreditCard, Sparkles } from 'lucide-react';

const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

const formatDate = (iso) =>
    iso ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)) : '-';

// ─── Status Icon ──────────────────────────────────────────────────────────────
function StatusIcon({ status }) {
    if (status === 'done') return <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-2xs"><CheckCircle2 size={24} /></div>;
    if (status === 'processing') return <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-2xs"><ChefHat size={24} /></div>;
    if (status === 'cancelled') return <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">✕</div>;
    return <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-2xs"><Clock size={24} /></div>;
}

// ─── Step Progress Tracker ───────────────────────────────────────────────────
function ProgressTracker({ status, paidAt }) {
    const isDone = status === 'done';
    const isProcessing = status === 'processing' || isDone;
    const isPaid = !!paidAt || isDone;

    if (status === 'cancelled') return null;

    return (
        <div className="py-3 px-4 bg-slate-50/80 border-y border-slate-100">
            <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                <div
                    className="absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-500 z-0"
                    style={{
                        width: isDone ? 'calc(100% - 48px)' : isProcessing ? '50%' : '0%'
                    }}
                />

                {/* Step 1: Pesanan Dibuat */}
                <div className="flex flex-col items-center gap-1 z-10">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                        <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">Diterima</span>
                </div>

                {/* Step 2: Diproses */}
                <div className="flex flex-col items-center gap-1 z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        isProcessing ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-500'
                    }`}>
                        {isProcessing ? <Check size={14} strokeWidth={3} /> : '2'}
                    </div>
                    <span className={`text-[10px] font-bold ${isProcessing ? 'text-slate-700' : 'text-slate-400'}`}>
                        Diproses
                    </span>
                </div>

                {/* Step 3: Selesai */}
                <div className="flex flex-col items-center gap-1 z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        isDone ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-500'
                    }`}>
                        {isDone ? <Check size={14} strokeWidth={3} /> : '3'}
                    </div>
                    <span className={`text-[10px] font-bold ${isDone ? 'text-emerald-700' : 'text-slate-400'}`}>
                        Selesai
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function OrderStatusPage() {
    const navigate = useNavigate();
    const getIdentifier = useCartStore(s => s.getIdentifier);
    const customerIdentifier = getIdentifier();
    const lastOrderId = useCartStore(s => s.lastOrderId);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const prevOrdersRef = useRef([]);
    const timerRef = useRef(null);

    const fetchStatus = async () => {
        if (!customerIdentifier) return;
        try {
            const data = await selfOrderService.getOrderStatus(customerIdentifier);
            const newOrders = Array.isArray(data) ? data : [];

            // Detect status / payment changes for Toast Notifications
            if (prevOrdersRef.current.length > 0) {
                newOrders.forEach(newOrd => {
                    const oldOrd = prevOrdersRef.current.find(o => o.id === newOrd.id);
                    if (oldOrd) {
                        // Payment detection
                        if (!oldOrd.paid_at && newOrd.paid_at) {
                            toast.success(`🎉 Payment Confirmed! Order #${newOrd.id} telah LUNAS!`, { duration: 5000 });
                        }
                        // Status detection
                        if (oldOrd.status !== newOrd.status) {
                            if (newOrd.status === 'processing') {
                                toast.info(`👨‍🍳 Order #${newOrd.id} sedang DIPROSES di dapur!`);
                            } else if (newOrd.status === 'done') {
                                toast.success(`✅ Order #${newOrd.id} telah SELESAI! Silakan ambil di kasir.`, { duration: 6000 });
                            } else if (newOrd.status === 'cancelled') {
                                toast.error(`❌ Order #${newOrd.id} dibatalkan oleh kasir.`);
                            }
                        }
                    }
                });
            }

            prevOrdersRef.current = newOrders;
            setOrders(newOrders);
            setLastUpdated(new Date());
        } catch {
            // silent fail on poll
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        timerRef.current = setInterval(fetchStatus, 10_000);
        return () => clearInterval(timerRef.current);
    }, [customerIdentifier]);

    if (!customerIdentifier) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <Clock size={32} />
                </div>
                <h2 className="font-bold text-slate-800 text-base mb-1">Tidak Ada Pesanan Aktif</h2>
                <p className="text-xs text-slate-500 mb-6">Mulai pesan makanan favorit Anda sekarang</p>
                <button
                    type="button"
                    onClick={() => navigate('/order')}
                    className="px-6 py-3 bg-indigo-600 text-white font-bold text-xs rounded-2xl shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
                >
                    Mulai Pesan
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight">Status Pesanan Saya</h1>
                    {lastUpdated && (
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            Update otomatis • {lastUpdated.toLocaleTimeString('id-ID')}
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={fetchStatus}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs">
                    <Clock size={40} className="mb-2 opacity-30" />
                    <p className="font-bold text-slate-700 text-sm">Belum Ada Pesanan</p>
                    <p className="text-xs text-slate-400 mt-1 mb-4">Pesanan Anda akan muncul secara real-time di sini</p>
                    <button
                        type="button"
                        onClick={() => navigate('/order')}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        <Plus size={15} /> <span>Pesan Sekarang</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => {
                        const isLatest = order.id === lastOrderId;
                        const isPaid = !!order.paid_at || order.status === 'done';

                        return (
                            <div
                                key={order.id}
                                className={`bg-white rounded-2xl border overflow-hidden transition-all shadow-xs ${
                                    isLatest
                                        ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                                        : 'border-slate-200/90'
                                }`}
                            >
                                {/* Top Header */}
                                <div className="flex items-center gap-3 p-3.5 sm:p-4 border-b border-slate-100">
                                    <StatusIcon status={order.status} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className="font-extrabold text-slate-900 text-sm">Order #{order.id}</p>
                                            {isLatest && (
                                                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 font-bold rounded-full shadow-2xs">
                                                    Terbaru
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-400 font-medium">{formatDate(order.created_at)}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <OrderStatusBadge status={order.status} size="sm" />
                                        <p className="text-sm font-black text-indigo-600 mt-1">{formatPrice(order.total_price)}</p>
                                    </div>
                                </div>

                                {/* Step Progress Indicator */}
                                <ProgressTracker status={order.status} paidAt={order.paid_at} />

                                {/* PAYMENT STATUS BANNER NOTIFICATION */}
                                <div className={`px-4 py-2.5 border-b text-xs flex items-center justify-between font-medium ${
                                    isPaid
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                                        : 'bg-amber-50 text-amber-800 border-amber-100'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        {isPaid ? (
                                            <>
                                                <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full uppercase flex items-center gap-1 shadow-2xs">
                                                    <Check size={10} strokeWidth={3} /> LUNAS
                                                </span>
                                                <span className="text-[11px] font-semibold">
                                                    Sudah dibayar {order.paid_at ? `(${formatDate(order.paid_at)})` : 'di kasir'}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full uppercase flex items-center gap-1">
                                                    <AlertCircle size={10} /> Belum Bayar
                                                </span>
                                                <span className="text-[11px] font-semibold">
                                                    Silakan bayar di kasir ({order.payment_method?.name || 'Tunai/QRIS'})
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Contextual Status Message */}
                                <div className="px-4 py-3 bg-slate-50/50 text-xs font-semibold border-b border-slate-100">
                                    {order.status === 'pending' && (
                                        <p className="text-amber-700 flex items-center gap-1.5">
                                            <span>⏳</span>
                                            <span>Pesanan telah dikirim! Menunggu konfirmasi & pembayaran di kasir.</span>
                                        </p>
                                    )}
                                    {order.status === 'processing' && (
                                        <p className="text-indigo-700 flex items-center gap-1.5">
                                            <ChefHat size={15} />
                                            <span>Pesanan sedang dimasak di dapur! Mohon menunggu giliran Anda.</span>
                                        </p>
                                    )}
                                    {order.status === 'done' && (
                                        <p className="text-emerald-700 flex items-center gap-1.5 font-bold">
                                            <Sparkles size={15} />
                                            <span>Pesanan sudah SELESAI! Silakan ambil hidangan Anda di kasir. Selamat menikmati!</span>
                                        </p>
                                    )}
                                    {order.status === 'cancelled' && (
                                        <p className="text-rose-600 flex items-center gap-1.5">
                                            <span>❌</span>
                                            <span>Pesanan dibatalkan. Silakan hubungi kasir untuk info lebih lanjut.</span>
                                        </p>
                                    )}
                                </div>

                                {/* Items List */}
                                {order.items && order.items.length > 0 && (
                                    <div className="px-4 py-3 space-y-1.5 border-b border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rincian Item</p>
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex justify-between text-xs sm:text-sm">
                                                <span className="text-slate-800 font-medium">
                                                    {item.menu_name} <span className="text-slate-400 font-bold">×{item.quantity}</span>
                                                </span>
                                                <span className="font-bold text-slate-900">{formatPrice(item.subtotal)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Meta Info */}
                                <div className="px-4 py-2.5 bg-slate-50/50 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                                    {order.table_number && <span className="flex items-center gap-1">🪑 Meja: <strong className="text-slate-800">{order.table_number}</strong></span>}
                                    {order.payment_method?.name && <span className="flex items-center gap-1">💳 Pembayaran: <strong className="text-slate-800">{order.payment_method.name}</strong></span>}
                                </div>
                            </div>
                        );
                    })}

                    {/* Add More Order Button */}
                    <button
                        type="button"
                        onClick={() => navigate('/order')}
                        className="w-full py-3.5 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} />
                        <span>Tambah Pesanan Baru</span>
                    </button>
                </div>
            )}
        </div>
    );
}

