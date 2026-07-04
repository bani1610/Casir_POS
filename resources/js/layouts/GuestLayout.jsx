import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export default function GuestLayout() {
    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)] shadow-sm">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    <span className="font-bold text-[var(--color-primary)]">Casir POS</span>
                    <Link to="/order/cart" className="relative">
                        <ShoppingCart size={22} className="text-[var(--color-text)]" />
                    </Link>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-6">
                <Outlet />
            </div>
        </div>
    );
}
