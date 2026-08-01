import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

export default function CartPage() {
    const navigate = useNavigate();
    const items = useCartStore(s => s.items);
    const total = useCartStore(s => s.getTotal());
    const { increment, decrement, clearCart } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 text-center px-4">
                <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center mb-4">
                    <ShoppingCart size={36} />
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">Keranjang Masih Kosong</h2>
                <p className="text-xs text-slate-500 mb-6">Pilih menu lezat dan tambahkan ke pesanan Anda</p>
                <button
                    type="button"
                    onClick={() => navigate('/order')}
                    className="px-6 py-3 bg-indigo-600 text-white text-xs font-bold rounded-2xl shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
                >
                    Lihat Daftar Menu
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => navigate('/order')}
                        className="p-2 hover:bg-slate-200/60 rounded-xl transition-colors text-slate-700"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Keranjang Pesanan</h1>
                        <p className="text-xs text-slate-500">{items.length} item terpilih</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={clearCart}
                    className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-bold rounded-xl transition-colors"
                >
                    Kosongkan
                </button>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 overflow-hidden shadow-2xs">
                {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3.5 sm:p-4">
                        {item.image ? (
                            <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0 bg-slate-100" />
                        ) : (
                            <div className="w-14 h-14 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center text-slate-300">
                                <ShoppingCart size={20} />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">{item.name}</p>
                            {item.category && (
                                <p className="text-[11px] text-slate-400 font-medium">{item.category}</p>
                            )}
                            <p className="text-xs sm:text-sm font-extrabold text-indigo-600 mt-1">
                                {formatPrice(item.price * item.qty)}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 bg-slate-100 p-1 rounded-xl border border-slate-200">
                            <button
                                type="button"
                                onClick={() => decrement(item.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-slate-200 active:scale-95 transition-all shadow-2xs"
                                aria-label="Kurangi"
                            >
                                {item.qty === 1 ? <Trash2 size={13} className="text-rose-500" /> : <Minus size={13} />}
                            </button>
                            <span className="w-6 text-center text-xs font-black text-slate-900">{item.qty}</span>
                            <button
                                type="button"
                                onClick={() => increment(item.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-2xs"
                                aria-label="Tambah"
                            >
                                <Plus size={13} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Subtotal Menu</span>
                    <span className="font-bold text-slate-800">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="font-extrabold text-sm text-slate-900">Total Pembayaran</span>
                    <span className="text-lg font-black text-indigo-600">{formatPrice(total)}</span>
                </div>
            </div>

            {/* Mobile Fixed Bottom Checkout Bar */}
            <div className="fixed bottom-14 left-0 right-0 z-30 p-3 bg-white/90 backdrop-blur-md border-t border-slate-200/80 max-w-xl mx-auto">
                <button
                    type="button"
                    onClick={() => navigate('/order/checkout')}
                    className="w-full py-3.5 bg-indigo-600 text-white font-black text-sm sm:text-base rounded-xl hover:bg-indigo-700 active:scale-98 transition-all shadow-md flex items-center justify-center gap-2"
                >
                    <span>Lanjut ke Pembayaran ({formatPrice(total)})</span>
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

