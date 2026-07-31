import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selfOrderService } from '@/services/selfOrderService';
import { useCartStore } from '@/stores/cartStore';
import MenuCard from '@/components/ui/MenuCard';
import { toast } from 'sonner';
import { Search, ShoppingCart } from 'lucide-react';

export default function MenuBrowserPage() {
    const navigate = useNavigate();
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState('');

    const { initSession, addItem, increment, decrement, getQty, getCount } = useCartStore();
    const cartCount = useCartStore(s => s.getCount());

    // Init sesi pembeli (reset kalau > 24 jam)
    useEffect(() => {
        initSession();
    }, []);

    useEffect(() => {
        selfOrderService.getMenus()
            .then(data => setMenus(Array.isArray(data) ? data : []))
            .catch(() => toast.error('Gagal memuat menu'))
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
                <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Title */}
            <div>
                <h1 className="text-xl font-bold text-[var(--color-text)]">Daftar Menu</h1>
                <p className="text-sm text-[var(--color-text-muted)]">Pilih menu yang ingin dipesan</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cari menu..."
                    className="w-full pl-9 pr-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                    onClick={() => setActiveCat('')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        !activeCat ? 'bg-[var(--color-primary)] text-white' : 'bg-white border border-[var(--color-border)] text-[var(--color-text-muted)]'
                    }`}
                >
                    Semua
                </button>
                {categories.map(c => (
                    <button
                        key={c.id}
                        onClick={() => setActiveCat(String(c.id))}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                            activeCat === String(c.id) ? 'bg-[var(--color-primary)] text-white' : 'bg-white border border-[var(--color-border)] text-[var(--color-text-muted)]'
                        }`}
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            {/* Menu grid */}
            {filteredMenus.length === 0 ? (
                <div className="text-center py-16 text-[var(--color-text-muted)]">
                    <p>Tidak ada menu tersedia</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
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

            {/* Floating cart button */}
            {cartCount > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                    <button
                        onClick={() => navigate('/order/cart')}
                        className="flex items-center gap-3 px-6 py-3.5 bg-[var(--color-primary)] text-white rounded-2xl shadow-lg hover:opacity-95 active:scale-95 transition-all"
                    >
                        <ShoppingCart size={20} />
                        <span className="font-semibold">Lihat Keranjang</span>
                        <span className="px-2 py-0.5 bg-white text-[var(--color-primary)] text-xs font-bold rounded-full">
                            {cartCount}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
