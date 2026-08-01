import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selfOrderService } from '@/services/selfOrderService';
import { useCartStore } from '@/stores/cartStore';
import MenuCard from '@/components/ui/MenuCard';
import { toast } from 'sonner';
import { Search, ShoppingBag, ArrowRight } from 'lucide-react';

const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

export default function MenuBrowserPage() {
    const navigate = useNavigate();
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState('');

    const { initSession, addItem, increment, decrement, getQty, getCount, getTotal } = useCartStore();
    const cartCount = getCount();
    const cartTotal = getTotal();

    // Init sesi pembeli
    useEffect(() => {
        initSession();
    }, [initSession]);

    useEffect(() => {
        selfOrderService.getMenus()
            .then(data => setMenus(Array.isArray(data) ? data : []))
            .catch(() => toast.error('Gagal memuat daftar menu'))
            .finally(() => setLoading(false));
    }, []);

    // Ambil kategori unik
    const categories = useMemo(() => {
        const seen = new Map();
        menus.forEach(m => {
            if (m.category && !seen.has(m.category_id)) seen.set(m.category_id, m.category);
        });
        return [...seen.entries()].map(([id, cat]) => ({ id, name: cat.name }));
    }, [menus]);

    const filteredMenus = useMemo(() => {
        return menus.filter(m => {
            const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
            const matchCat = !activeCat || m.category_id === Number(activeCat);
            return matchSearch && matchCat;
        });
    }, [menus, search, activeCat]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-20">
            {/* Banner / Title */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Pilih Menu</h1>
                    <p className="text-xs text-slate-500 font-medium">Silakan pesan makanan & minuman favorit Anda</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cari makanan, minuman..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-2xs"
                />
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 scroll-smooth">
                <button
                    type="button"
                    onClick={() => setActiveCat('')}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                        !activeCat
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    Semua ({menus.length})
                </button>
                {categories.map(c => (
                    <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveCat(String(c.id))}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                            activeCat === String(c.id)
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            {/* Menu grid */}
            {filteredMenus.length === 0 ? (
                <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200/80 p-8">
                    <p className="font-semibold text-slate-600">Tidak ada menu yang ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian lain</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredMenus.map(menu => (
                        <MenuCard
                            key={menu.id}
                            menu={menu}
                            quantity={getQty(menu.id)}
                            onAddToCart={addItem}
                            onIncrement={increment}
                            onDecrement={decrement}
                        />
                    ))}
                </div>
            )}

            {/* Mobile Bottom Floating Cart Bar */}
            {cartCount > 0 && (
                <div className="fixed bottom-16 left-0 right-0 z-30 px-4 max-w-xl mx-auto">
                    <button
                        type="button"
                        onClick={() => navigate('/order/cart')}
                        className="w-full flex items-center justify-between p-3.5 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 active:scale-98 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                                {cartCount}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-medium opacity-90">{cartCount} Item di Keranjang</p>
                                <p className="text-sm font-extrabold">{formatPrice(cartTotal)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-xs bg-white text-indigo-600 px-3 py-2 rounded-xl shadow-xs">
                            <span>Lanjut</span>
                            <ArrowRight size={14} />
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}

