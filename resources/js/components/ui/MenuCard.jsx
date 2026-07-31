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
            className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col ${
                isUnavailable
                    ? 'border-[var(--color-border)] opacity-60'
                    : 'border-[var(--color-border)] hover:shadow-md hover:-translate-y-0.5'
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
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="text-slate-300" size={40} />
                    </div>
                )}

                {/* Category badge */}
                {menu.category?.name && (
                    <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 text-xs font-medium bg-white/90 backdrop-blur-sm text-[var(--color-primary)] rounded-full shadow-sm">
                            {menu.category.name}
                        </span>
                    </div>
                )}

                {/* Unavailable overlay */}
                {isUnavailable && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                        <span className="px-3 py-1 bg-white text-slate-700 text-sm font-semibold rounded-full">
                            Habis
                        </span>
                    </div>
                )}

                {/* Cart quantity indicator (top-right) */}
                {quantity > 0 && !isUnavailable && (
                    <div className="absolute top-2 right-2">
                        <span className="w-6 h-6 flex items-center justify-center bg-[var(--color-primary)] text-white text-xs font-bold rounded-full shadow">
                            {quantity}
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-3 flex flex-col flex-1">
                <h3 className="font-semibold text-[var(--color-text)] text-sm leading-snug mb-1 line-clamp-2">
                    {menu.name}
                </h3>
                {menu.description && (
                    <p className="text-xs text-[var(--color-text-muted)] mb-2 line-clamp-2 flex-1">
                        {menu.description}
                    </p>
                )}

                {/* Price + Action */}
                <div className="flex items-center justify-between mt-auto pt-2">
                    <p className="text-base font-bold text-[var(--color-primary)]">
                        {formatPrice(menu.price)}
                    </p>

                    {isUnavailable ? null : quantity === 0 ? (
                        /* Tombol Tambah pertama kali */
                        <button
                            onClick={() => onAddToCart?.(menu)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                        >
                            <Plus size={13} />
                            Tambah
                        </button>
                    ) : (
                        /* Qty stepper setelah ada di keranjang */
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onDecrement?.(menu)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all"
                            >
                                {quantity === 1 ? (
                                    <ShoppingCart size={12} className="text-red-500" />
                                ) : (
                                    <Minus size={12} className="text-[var(--color-text)]" />
                                )}
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-[var(--color-text)]">
                                {quantity}
                            </span>
                            <button
                                onClick={() => onIncrement?.(menu)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 active:scale-95 transition-all"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
