import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';

const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

export default function CartPage() {
    const navigate = useNavigate();
    const items = useCartStore(s => s.items);
    const total = useCartStore(s => s.getTotal());
    const { increment, decrement, removeItem, clearCart } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-[var(--color-text-muted)]">
                <ShoppingCart size={56} className="mb-4 opacity-20" />
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-1">Keranjang Kosong</h2>
                <p className="text-sm mb-6">Belum ada item yang ditambahkan</p>
                <button
                    onClick={() => navigate('/order')}
                    className="px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl"
                >
                    Lihat Menu
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/order')}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-[var(--color-text)]">Keranjang</h1>
                    <p className="text-xs text-[var(--color-text-muted)]">{items.length} jenis item</p>
                </div>
                <button
                    onClick={clearCart}
                    className="ml-auto text-xs text-red-500 hover:text-red-700 font-medium"
                >
                    Kosongkan
                </button>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
                {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-4">
                        {item.image ? (
                            <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                        ) : (
                            <div className="w-14 h-14 bg-slate-100 rounded-lg flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-[var(--color-text)] truncate">{item.name}</p>
                            {item.category && (
                                <p className="text-xs text-[var(--color-text-muted)]">{item.category}</p>
                            )}
                            <p className="text-sm font-bold text-[var(--color-primary)] mt-1">
                                {formatPrice(item.price * item.qty)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={() => decrement(item.id)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                {item.qty === 1 ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} />}
                            </button>
                            <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
                            <button
                                onClick={() => increment(item.id)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--color-text-muted)]">Subtotal</span>
                    <span className="text-sm font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] mt-2">
                    <span className="font-bold text-[var(--color-text)]">Total</span>
                    <span className="text-xl font-bold text-[var(--color-primary)]">{formatPrice(total)}</span>
                </div>
            </div>

            {/* Checkout button */}
            <button
                onClick={() => navigate('/order/checkout')}
                className="w-full py-3.5 bg-[var(--color-primary)] text-white font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all text-base"
            >
                Lanjut ke Pembayaran →
            </button>
        </div>
    );
}
