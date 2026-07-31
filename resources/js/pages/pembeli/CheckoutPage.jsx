import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { selfOrderService } from '@/services/selfOrderService';
import { paymentMethodService } from '@/services/paymentMethodService';
import { toast } from 'sonner';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';

const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

export default function CheckoutPage() {
    const navigate = useNavigate();
    const items = useCartStore(s => s.items);
    const total = useCartStore(s => s.getTotal());
    const customerIdentifier = useCartStore(s => s.customerIdentifier);
    const { setLastOrderId, clearCart } = useCartStore();

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loadingPM, setLoadingPM] = useState(true);

    useEffect(() => {
        if (items.length === 0) navigate('/order');
    }, [items]);

    useEffect(() => {
        paymentMethodService.getAll()
            .then(data => {
                setPaymentMethods(Array.isArray(data) ? data : []);
                if (data.length === 1) setPaymentMethodId(String(data[0].id));
            })
            .catch(() => toast.error('Gagal memuat metode pembayaran'))
            .finally(() => setLoadingPM(false));
    }, []);

    const handleOrder = async () => {
        if (!paymentMethodId) {
            toast.error('Pilih metode pembayaran terlebih dahulu');
            return;
        }

        setSubmitting(true);
        try {
            const order = await selfOrderService.placeOrder({
                customer_identifier: customerIdentifier,
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
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/order/cart')}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-[var(--color-text)]">Konfirmasi Pesanan</h1>
                    <p className="text-xs text-[var(--color-text-muted)]">Lengkapi detail pembayaran</p>
                </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-[var(--color-border)]">
                    <h2 className="text-sm font-semibold text-[var(--color-text)]">Ringkasan Pesanan</h2>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                    {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                            <span className="text-[var(--color-text)] truncate flex-1">{item.name}</span>
                            <span className="text-[var(--color-text-muted)] mx-3">×{item.qty}</span>
                            <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)] bg-slate-50">
                    <span className="font-bold text-[var(--color-text)]">Total</span>
                    <span className="text-lg font-bold text-[var(--color-primary)]">{formatPrice(total)}</span>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 space-y-4">
                {/* Nomor meja */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Nomor Meja</label>
                    <input
                        type="text"
                        value={tableNumber}
                        onChange={e => setTableNumber(e.target.value)}
                        placeholder="Misal: A1, B2 (opsional)"
                        className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                </div>

                {/* Metode pembayaran */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                        Metode Pembayaran <span className="text-red-500">*</span>
                    </label>
                    {loadingPM ? (
                        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                    ) : paymentMethods.length === 0 ? (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                            <AlertCircle size={16} />
                            Tidak ada metode pembayaran tersedia
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {paymentMethods.map(pm => (
                                <button
                                    key={pm.id}
                                    type="button"
                                    onClick={() => setPaymentMethodId(String(pm.id))}
                                    className={`p-3 border-2 rounded-xl text-sm font-medium text-left transition-colors ${
                                        paymentMethodId === String(pm.id)
                                            ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]'
                                            : 'border-[var(--color-border)] text-[var(--color-text)] hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        {pm.name}
                                        {paymentMethodId === String(pm.id) && (
                                            <Check size={14} className="text-[var(--color-primary)]" />
                                        )}
                                    </div>
                                    {pm.description && (
                                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 font-normal">{pm.description}</p>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Catatan */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Catatan</label>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Alergi makanan, permintaan khusus, dll. (opsional)"
                        rows={3}
                        className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                </div>
            </div>

            {/* Submit */}
            <button
                onClick={handleOrder}
                disabled={submitting || paymentMethods.length === 0}
                className="w-full py-4 bg-[var(--color-primary)] text-white font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 text-base"
            >
                {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Memproses...
                    </span>
                ) : (
                    '🍽 Pesan Sekarang'
                )}
            </button>
        </div>
    );
}
