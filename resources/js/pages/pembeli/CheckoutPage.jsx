import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { selfOrderService } from '@/services/selfOrderService';
import { toast } from 'sonner';
import { ArrowLeft, Check, AlertCircle, CreditCard, Utensils, MessageSquare } from 'lucide-react';

const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

export default function CheckoutPage() {
    const navigate = useNavigate();
    const items = useCartStore(s => s.items);
    const total = useCartStore(s => s.getTotal());
    const getIdentifier = useCartStore(s => s.getIdentifier);
    const { setLastOrderId, clearCart } = useCartStore();

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loadingPM, setLoadingPM] = useState(true);

    useEffect(() => {
        if (items.length === 0) navigate('/order');
    }, [items, navigate]);

    useEffect(() => {
        selfOrderService.getPaymentMethods()
            .then(data => {
                const activePMs = Array.isArray(data) ? data : [];
                setPaymentMethods(activePMs);
                if (activePMs.length > 0) {
                    setPaymentMethodId(String(activePMs[0].id));
                }
            })
            .catch(() => toast.error('Gagal memuat metode pembayaran'))
            .finally(() => setLoadingPM(false));
    }, []);

    const handleOrder = async () => {
        if (!paymentMethodId) {
            toast.error('Pilih metode pembayaran terlebih dahulu');
            return;
        }

        const identifier = getIdentifier();

        setSubmitting(true);
        try {
            const order = await selfOrderService.placeOrder({
                customer_identifier: identifier,
                payment_method_id: Number(paymentMethodId),
                table_number: tableNumber || null,
                notes: notes || null,
                items: items.map(i => ({ menu_id: i.id, quantity: i.qty })),
            });

            setLastOrderId(order.id);
            clearCart();
            toast.success('Pesanan berhasil dikirim!');
            navigate('/order/status');
        } catch (err) {
            const msg = err.response?.data?.message ?? err.response?.data?.errors?.items?.[0];
            toast.error(msg || 'Gagal membuat pesanan');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/order/cart')}
                    className="p-2 hover:bg-slate-200/60 rounded-xl transition-colors text-slate-700"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-slate-900">Konfirmasi Pesanan</h1>
                    <p className="text-xs text-slate-500">Lengkapi informasi untuk memesan</p>
                </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Utensils size={14} className="text-indigo-600" />
                        <span>Ringkasan ({items.length} Menu)</span>
                    </h2>
                </div>
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm">
                            <span className="text-slate-800 font-medium truncate flex-1">{item.name}</span>
                            <span className="text-slate-500 font-bold mx-3">×{item.qty}</span>
                            <span className="font-bold text-slate-900">{formatPrice(item.price * item.qty)}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-indigo-50/50">
                    <span className="font-bold text-slate-800 text-sm">Total Bayar</span>
                    <span className="text-lg font-black text-indigo-600">{formatPrice(total)}</span>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-4 shadow-2xs">
                {/* Nomor meja */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Nomor Meja <span className="text-slate-400 font-normal text-[11px]">(opsional)</span>
                    </label>
                    <input
                        type="text"
                        value={tableNumber}
                        onChange={e => setTableNumber(e.target.value)}
                        placeholder="Contoh: Meja 05, A12"
                        className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
                    />
                </div>

                {/* Metode pembayaran */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <CreditCard size={14} className="text-indigo-600" />
                            <span>Metode Pembayaran</span>
                            <span className="text-rose-500">*</span>
                        </span>
                    </label>
                    {loadingPM ? (
                        <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                    ) : paymentMethods.length === 0 ? (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs">
                            <AlertCircle size={16} />
                            Tidak ada metode pembayaran tersedia. Silakan minta kasir.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {paymentMethods.map(pm => {
                                const isSelected = paymentMethodId === String(pm.id);
                                return (
                                    <button
                                        key={pm.id}
                                        type="button"
                                        onClick={() => setPaymentMethodId(String(pm.id))}
                                        className={`p-3.5 border-2 rounded-xl text-xs sm:text-sm font-semibold text-left transition-all flex items-center justify-between ${
                                            isSelected
                                                ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-2xs'
                                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="space-y-0.5">
                                            <p className="font-bold">{pm.name}</p>
                                            {pm.description && (
                                                <p className="text-[11px] text-slate-500 font-normal line-clamp-1">{pm.description}</p>
                                            )}
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                            isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                                        }`}>
                                            {isSelected && <Check size={12} strokeWidth={3} />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Catatan */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                        <MessageSquare size={14} className="text-slate-400" />
                        <span>Catatan Pesanan <span className="text-slate-400 font-normal text-[11px]">(opsional)</span></span>
                    </label>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Contoh: Es sedikit, tidak pedas, ekstra sendok..."
                        rows={2}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
                    />
                </div>
            </div>

            {/* Mobile Fixed Bottom Bar for Submit */}
            <div className="fixed bottom-14 left-0 right-0 z-30 p-3 bg-white/90 backdrop-blur-md border-t border-slate-200/80 max-w-xl mx-auto">
                <button
                    type="button"
                    onClick={handleOrder}
                    disabled={submitting || paymentMethods.length === 0}
                    className="w-full py-3.5 bg-indigo-600 text-white font-black text-sm sm:text-base rounded-xl hover:bg-indigo-700 active:scale-98 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Mengirim Pesanan...</span>
                        </>
                    ) : (
                        <>
                            <span>🍽 Konfirmasi & Pesan ({formatPrice(total)})</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

