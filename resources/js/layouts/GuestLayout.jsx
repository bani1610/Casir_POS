import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, ClipboardList } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

export default function GuestLayout() {
    const location = useLocation();
    const cartCount = useCartStore(s => s.getCount());

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)] shadow-sm">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link to="/order" className="font-bold text-[var(--color-primary)] text-lg">
                        Casir <span className="text-[var(--color-text)] font-normal text-base">POS</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/order/status"
                            className={`p-2 rounded-xl transition-colors ${
                                location.pathname === '/order/status'
                                    ? 'bg-blue-50 text-[var(--color-primary)]'
                                    : 'text-[var(--color-text-muted)] hover:bg-slate-50'
                            }`}
                            title="Status Pesanan"
                        >
                            <ClipboardList size={22} />
                        </Link>
                        <Link
                            to="/order/cart"
                            className="relative p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-slate-50 transition-colors"
                            title="Keranjang"
                        >
                            <ShoppingCart size={22} className={cartCount > 0 ? 'text-[var(--color-primary)]' : ''} />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center bg-[var(--color-primary)] text-white text-xs font-bold rounded-full">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
                <Outlet />
            </div>
        </div>
    );
}
