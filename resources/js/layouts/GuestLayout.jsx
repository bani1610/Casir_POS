import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, ClipboardList, UtensilsCrossed } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

export default function GuestLayout() {
    const location = useLocation();
    const cartCount = useCartStore(s => s.getCount());
    const total = useCartStore(s => s.getTotal());

    const formatPrice = (p) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

    const isMenuPage = location.pathname === '/order';
    const isCartPage = location.pathname === '/order/cart';
    const isCheckoutPage = location.pathname === '/order/checkout';
    const isStatusPage = location.pathname === '/order/status';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link to="/order" className="flex items-center gap-2 font-black text-indigo-600 text-lg tracking-tight">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                            <UtensilsCrossed size={18} />
                        </div>
                        <span>Casir <span className="text-slate-800 font-semibold text-base">SelfOrder</span></span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link
                            to="/order/status"
                            className={`p-2 rounded-xl transition-all ${
                                isStatusPage
                                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                                    : 'text-slate-500 hover:bg-slate-100'
                            }`}
                            title="Status Pesanan"
                        >
                            <ClipboardList size={22} />
                        </Link>
                        <Link
                            to="/order/cart"
                            className={`relative p-2 rounded-xl transition-all ${
                                isCartPage
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-slate-500 hover:bg-slate-100'
                            }`}
                            title="Keranjang"
                        >
                            <ShoppingCart size={22} className={cartCount > 0 ? 'text-indigo-600' : ''} />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 flex items-center justify-center bg-indigo-600 text-white text-[11px] font-bold rounded-full shadow-xs animate-bounce-subtle">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-xl w-full mx-auto px-4 py-4 pb-28">
                <Outlet />
            </main>

            {/* Bottom Mobile Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg px-6 py-2.5 max-w-xl mx-auto rounded-t-2xl">
                <div className="flex items-center justify-around">
                    <Link
                        to="/order"
                        className={`flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                            isMenuPage ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <UtensilsCrossed size={20} />
                        <span>Menu</span>
                    </Link>

                    <Link
                        to="/order/cart"
                        className={`relative flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                            isCartPage || isCheckoutPage ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <div className="relative">
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span>Pesanan</span>
                    </Link>

                    <Link
                        to="/order/status"
                        className={`flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                            isStatusPage ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <ClipboardList size={20} />
                        <span>Status</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}

