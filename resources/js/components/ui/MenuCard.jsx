import { useState } from 'react';
import { Image as ImageIcon, Plus, Minus, ShoppingCart } from 'lucide-react';

/**
 * MenuCard — Kartu menu untuk halaman self-order pembeli (MenuBrowserPage)
 *
 * Props:
 *  - menu         : object  — data menu dari API
 *  - quantity     : number  — jumlah item di keranjang (0 jika belum ada)
 *  - onAddToCart  : fn(menu) — callback saat klik tambah
 *  - onIncrement  : fn(menu) — callback saat klik + di badge
 *  - onDecrement  : fn(menu) — callback saat klik -
 */
export default function MenuCard({ menu, quantity = 0, onAddToCart, onIncrement, onDecrement }) {
    const [imgError, setImgError] = useState(false);

    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    const isUnavailable = !menu.is_available;

    return (
        <div
            className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col shadow-2xs ${
                isUnavailable
                    ? 'border-slate-200 opacity-60'
                    : 'border-slate-200/90 hover:shadow-md hover:-translate-y-0.5'
            }`}
        >
            {/* Image */}
            <div className="aspect-[4/3] bg-slate-100 relative flex-shrink-0">
                {menu.image && !imgError ? (
                    <img
                        src={menu.image}
                        alt={menu.name}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <ImageIcon size={36} />
                    </div>
                )}

                {/* Category badge */}
                {menu.category?.name && (
                    <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 text-[11px] font-semibold bg-white/90 backdrop-blur-md text-indigo-600 rounded-full shadow-xs">
                            {menu.category.name}
                        </span>
                    </div>
                )}

                {/* Unavailable overlay */}
                {isUnavailable && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center">
                        <span className="px-3 py-1 bg-white text-slate-800 text-xs font-bold rounded-full shadow-md">
                            Stok Habis
                        </span>
                    </div>
                )}

                {/* Cart quantity indicator */}
                {quantity > 0 && !isUnavailable && (
                    <div className="absolute top-2 right-2">
                        <span className="w-6 h-6 flex items-center justify-center bg-indigo-600 text-white text-xs font-black rounded-full shadow-md">
                            {quantity}
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                        {menu.name}
                    </h3>
                    {menu.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {menu.description}
                        </p>
                    )}
                </div>

                {/* Price + Action */}
                <div className="flex items-center justify-between pt-1 mt-auto">
                    <p className="text-sm sm:text-base font-extrabold text-indigo-600">
                        {formatPrice(menu.price)}
                    </p>

                    {isUnavailable ? null : quantity === 0 ? (
                        /* Tombol Tambah */
                        <button
                            type="button"
                            onClick={() => onAddToCart?.(menu)}
                            className="flex items-center justify-center gap-1 min-h-[36px] px-3.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-xs"
                        >
                            <Plus size={14} />
                            <span>Tambah</span>
                        </button>
                    ) : (
                        /* Stepper */
                        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                            <button
                                type="button"
                                onClick={() => onDecrement?.(menu)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-slate-200 active:scale-95 transition-all shadow-2xs"
                                aria-label="Kurangi"
                            >
                                {quantity === 1 ? (
                                    <ShoppingCart size={13} className="text-rose-500" />
                                ) : (
                                    <Minus size={13} />
                                )}
                            </button>
                            <span className="w-6 text-center text-xs font-black text-slate-900">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() => onIncrement?.(menu)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-2xs"
                                aria-label="Tambah"
                            >
                                <Plus size={13} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
