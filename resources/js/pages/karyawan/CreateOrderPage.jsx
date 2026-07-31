import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuService } from '@/services/menuService';
import { categoryService } from '@/services/categoryService';
import { paymentMethodService } from '@/services/paymentMethodService';
import { orderService } from '@/services/orderService';
import { toast } from 'sonner';
import {
    Search, Plus, Minus, Trash2, ShoppingCart,
    ChevronRight, X, Image as ImageIcon,
} from 'lucide-react';

const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

// ─── Cart Item Component ─────────────────────────────────────────────────────
function CartItem({ item, onIncrement, onDecrement, onRemove }) {
    return (
        <div className="flex items-center gap-3 py-2.5 border-b border-[var(--color-border)] last:border-0">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text)] truncate">{item.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onDecrement(item.id)}
                    className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    <Minus size={12} />
                </button>
                <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                <button
                    onClick={() => onIncrement(item.id)}
                    className="w-6 h-6 flex items-center justify-center rounded bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
                >
                    <Plus size={12} />
                </button>
            </div>
            <p className="text-sm font-semibold text-[var(--color-primary)] w-20 text-right">
                {formatPrice(item.price * item.qty)}
            </p>
            <button
                onClick={() => onRemove(item.id)}
                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
}

// ─── Menu Card (mini) ────────────────────────────────────────────────────────
function MenuMiniCard({ menu, qty, onAdd }) {
    return (
        <div className={`bg-white rounded-xl border overflow-hidden flex gap-3 items-center p-3 transition-shadow hover:shadow-sm ${
            !menu.is_available ? 'opacity-50' : 'cursor-pointer'
        }`}>
            <div className="w-14 h-14 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                {menu.image
                    ? <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-slate-300" /></div>}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text)] truncate">{menu.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{menu.category?.name}</p>
                <p className="text-sm font-bold text-[var(--color-primary)] mt-0.5">{formatPrice(menu.price)}</p>
            </div>
            {menu.is_available ? (
                <button
                    onClick={() => onAdd(menu)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        qty > 0
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-slate-100 text-[var(--color-text)] hover:bg-slate-200'
                    }`}
                >
                    <Plus size={12} />
                    {qty > 0 ? qty : 'Tambah'}
                </button>
            ) : (
                <span className="text-xs text-slate-400 px-2">Habis</span>
            )}
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CreateOrderPage() {
    const navigate = useNavigate();

    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Filter state
    const [search, setSearch] = useState('');
    const [activeCatId, setActiveCatId] = useState('');

    // Cart
    const [cart, setCart] = useState([]); // [{ id, name, price, qty }]

    // Order meta
    const [tableNumber, setTableNumber] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [notes, setNotes] = useState('');

    // Load data
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const [menusData, catsData, pmData] = await Promise.all([
                    menuService.getAll(),
                    categoryService.getAll(),
                    paymentMethodService.getAll(),
                ]);
                setMenus(Array.isArray(menusData) ? menusData : []);
                setCategories(Array.isArray(catsData) ? catsData.filter(c => c.is_active) : []);
                setPaymentMethods(Array.isArray(pmData) ? pmData : []);
            } catch {
                toast.error('Gagal memuat data menu');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Filtered menu
    const filteredMenus = useMemo(() => {
        return menus.filter(m => {
            const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
            const matchCat = !activeCatId || m.category_id === Number(activeCatId);
            return matchSearch && matchCat;
        });
    }, [menus, search, activeCatId]);

    // Cart helpers
    const cartTotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.qty, 0), [cart]);
    const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);
    const getQty = (menuId) => cart.find(i => i.id === menuId)?.qty ?? 0;

    const addToCart = (menu) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === menu.id);
            if (existing) return prev.map(i => i.id === menu.id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { id: menu.id, name: menu.name, price: menu.price, qty: 1 }];
        });
    };

    const increment = (id) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
    const decrement = (id) => setCart(prev => {
        const item = prev.find(i => i.id === id);
        if (!item) return prev;
        if (item.qty === 1) return prev.filter(i => i.id !== id);
        return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
    const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

    // Submit order
    const handleSubmit = async () => {
        if (cart.length === 0) { toast.error('Keranjang masih kosong'); return; }
        if (!paymentMethodId) { toast.error('Pilih metode pembayaran'); return; }

        setSubmitting(true);
        try {
            await orderService.create({
                payment_method_id: Number(paymentMethodId),
                table_number: tableNumber || null,
                notes: notes || null,
                items: cart.map(i => ({ menu_id: i.id, quantity: i.qty })),
            });
            toast.success('Order berhasil dibuat!');
            navigate('/karyawan/orders');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal membuat order');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex gap-6 h-[calc(100vh-10rem)]">
            {/* ── Left: Menu Browser ──────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Buat Order Baru</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Pilih menu untuk ditambahkan ke order</p>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Cari menu..."
                        className="w-full pl-9 pr-4 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                </div>

                {/* Category filter */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    <button
                        onClick={() => setActiveCatId('')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                            !activeCatId ? 'bg-[var(--color-primary)] text-white' : 'bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-slate-50'
                        }`}
                    >
                        Semua
                    </button>
                    {categories.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setActiveCatId(String(c.id))}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                activeCatId === String(c.id) ? 'bg-[var(--color-primary)] text-white' : 'bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-slate-50'
                            }`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                {/* Menu list */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {filteredMenus.length === 0 ? (
                        <div className="text-center py-10 text-[var(--color-text-muted)] text-sm">Tidak ada menu ditemukan</div>
                    ) : filteredMenus.map(menu => (
                        <MenuMiniCard
                            key={menu.id}
                            menu={menu}
                            qty={getQty(menu.id)}
                            onAdd={addToCart}
                        />
                    ))}
                </div>
            </div>

            {/* ── Right: Cart & Order Form ────────────────────────────────── */}
            <div className="w-80 flex-shrink-0 flex flex-col bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                {/* Cart header */}
                <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-2">
                    <ShoppingCart size={18} className="text-[var(--color-primary)]" />
                    <h2 className="font-semibold text-[var(--color-text)] flex-1">Keranjang</h2>
                    {cartCount > 0 && (
                        <span className="px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full">{cartCount}</span>
                    )}
                </div>

                {/* Cart items */}
                <div className="flex-1 overflow-y-auto px-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-muted)] py-8">
                            <ShoppingCart size={36} className="mb-2 opacity-20" />
                            <p className="text-sm">Belum ada item</p>
                        </div>
                    ) : cart.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onIncrement={increment}
                            onDecrement={decrement}
                            onRemove={removeFromCart}
                        />
                    ))}
                </div>

                {/* Order details form */}
                <div className="p-4 border-t border-[var(--color-border)] space-y-3">
                    {/* Total */}
                    <div className="flex items-center justify-between py-1">
                        <span className="text-sm font-medium text-[var(--color-text-muted)]">Total</span>
                        <span className="text-lg font-bold text-[var(--color-primary)]">{formatPrice(cartTotal)}</span>
                    </div>

                    {/* Nomor meja */}
                    <input
                        type="text"
                        value={tableNumber}
                        onChange={e => setTableNumber(e.target.value)}
                        placeholder="Nomor meja (opsional)"
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />

                    {/* Metode pembayaran */}
                    <select
                        value={paymentMethodId}
                        onChange={e => setPaymentMethodId(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                        <option value="">Pilih Pembayaran *</option>
                        {paymentMethods.map(pm => (
                            <option key={pm.id} value={pm.id}>{pm.name}</option>
                        ))}
                    </select>

                    {/* Catatan */}
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Catatan (opsional)"
                        rows={2}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                    />

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || cart.length === 0}
                        className="w-full py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <ChevronRight size={18} />
                        )}
                        {submitting ? 'Memproses...' : 'Buat Order'}
                    </button>
                </div>
            </div>
        </div>
    );
}
