import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { menuService } from '@/services/menuService';
import { categoryService } from '@/services/categoryService';
import { toast } from 'sonner';
import {
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    Pencil,
    Plus,
    Search,
    Trash2,
    ToggleLeft,
    ToggleRight,
    X,
} from 'lucide-react';

// ─── Zod schema ────────────────────────────────────────────────────────────────
const menuSchema = z.object({
    category_id: z.string().min(1, 'Kategori wajib dipilih'),
    name: z.string().min(1, 'Nama menu wajib diisi').max(255, 'Maksimal 255 karakter'),
    description: z.string().optional(),
    price: z.string().min(1, 'Harga wajib diisi'),
    image: z.any().optional(),
    is_available: z.boolean().default(true),
});

// ─── Helper ─────────────────────────────────────────────────────────────────────
const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

// ─── Sub-components ─────────────────────────────────────────────────────────────
function FilterBar({ search, onSearch, categoryId, onCategory, availability, onAvailability, categories }) {
    return (
        <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Cari nama atau deskripsi menu..."
                    className="w-full pl-9 pr-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                />
                {search && (
                    <button onClick={() => onSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Filter Kategori */}
            <select
                value={categoryId}
                onChange={(e) => onCategory(e.target.value)}
                className="px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
                <option value="">Semua Kategori</option>
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            {/* Filter Ketersediaan */}
            <select
                value={availability}
                onChange={(e) => onAvailability(e.target.value)}
                className="px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
                <option value="">Semua Status</option>
                <option value="1">Tersedia</option>
                <option value="0">Habis</option>
            </select>
        </div>
    );
}

function Pagination({ meta, onPage }) {
    if (!meta || meta.last_page <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-[var(--color-text-muted)]">
                Menampilkan {(meta.current_page - 1) * meta.per_page + 1}–
                {Math.min(meta.current_page * meta.per_page, meta.total)} dari {meta.total} menu
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPage(meta.current_page - 1)}
                    disabled={meta.current_page === 1}
                    className="p-2 rounded-lg border border-[var(--color-border)] disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === meta.last_page || Math.abs(p - meta.current_page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                        acc.push(p);
                        return acc;
                    }, [])
                    .map((item, idx) =>
                        item === '...' ? (
                            <span key={`ellipsis-${idx}`} className="px-2 text-[var(--color-text-muted)]">…</span>
                        ) : (
                            <button
                                key={item}
                                onClick={() => onPage(item)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                    item === meta.current_page
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'border border-[var(--color-border)] hover:bg-slate-50'
                                }`}
                            >
                                {item}
                            </button>
                        )
                    )}
                <button
                    onClick={() => onPage(meta.current_page + 1)}
                    disabled={meta.current_page === meta.last_page}
                    className="p-2 rounded-lg border border-[var(--color-border)] disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function MenuPage() {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState(null);

    // Filter states
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [availability, setAvailability] = useState('');
    const [page, setPage] = useState(1);

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [deletingMenu, setDeletingMenu] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const searchTimer = useRef(null);

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(menuSchema),
    });

    // ── Load categories sekali ─────────────────────────────────────────────────
    useEffect(() => {
        categoryService.getAll()
            .then((data) => setCategories(Array.isArray(data) ? data : []))
            .catch(() => toast.error('Gagal memuat kategori'));
    }, []);

    // ── Fetch menus saat filter/page berubah ──────────────────────────────────
    const fetchMenus = useCallback(async (params) => {
        try {
            setLoading(true);
            const result = await menuService.getPaginated(params);
            setMenus(Array.isArray(result?.data) ? result.data : []);
            setMeta(result?.meta ?? null);
        } catch {
            toast.error('Gagal memuat data menu');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMenus({ search, category_id: categoryId, is_available: availability, page, per_page: 12 });
    }, [categoryId, availability, page, fetchMenus]);

    // Debounce search agar tidak terlalu banyak request saat mengetik
    useEffect(() => {
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            setPage(1);
            fetchMenus({ search, category_id: categoryId, is_available: availability, page: 1, per_page: 12 });
        }, 400);
        return () => clearTimeout(searchTimer.current);
    }, [search]);

    // ── Filter handlers ────────────────────────────────────────────────────────
    const handleSearch = (val) => setSearch(val);
    const handleCategory = (val) => { setCategoryId(val); setPage(1); };
    const handleAvailability = (val) => { setAvailability(val); setPage(1); };

    // ── Quick toggle is_available ──────────────────────────────────────────────
    const handleToggle = async (menu) => {
        setTogglingId(menu.id);
        try {
            await menuService.toggleAvailable(menu.id);
            toast.success(`Menu "${menu.name}" sekarang ${menu.is_available ? 'tidak tersedia' : 'tersedia'}`);
            fetchMenus({ search, category_id: categoryId, is_available: availability, page, per_page: 12 });
        } catch {
            toast.error('Gagal mengubah status menu');
        } finally {
            setTogglingId(null);
        }
    };

    // ── Modal open/close ───────────────────────────────────────────────────────
    const openAddModal = () => {
        setEditingMenu(null);
        setImagePreview(null);
        reset({ category_id: '', name: '', description: '', price: '', is_available: true });
        setModalOpen(true);
    };

    const openEditModal = (menu) => {
        setEditingMenu(menu);
        setImagePreview(menu.image);
        reset({
            category_id: menu.category_id.toString(),
            name: menu.name,
            description: menu.description || '',
            price: menu.price.toString(),
            is_available: menu.is_available,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingMenu(null);
        setImagePreview(null);
        reset();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setValue('image', file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    // ── Submit form ───────────────────────────────────────────────────────────
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('category_id', data.category_id);
            formData.append('name', data.name);
            formData.append('description', data.description || '');
            formData.append('price', data.price);
            formData.append('is_available', data.is_available ? '1' : '0');
            if (data.image instanceof File) formData.append('image', data.image);

            if (editingMenu) {
                await menuService.update(editingMenu.id, formData);
                toast.success('Menu berhasil diupdate');
            } else {
                await menuService.create(formData);
                toast.success('Menu berhasil ditambahkan');
            }
            closeModal();
            fetchMenus({ search, category_id: categoryId, is_available: availability, page, per_page: 12 });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menyimpan menu');
        }
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const openDeleteModal = (menu) => { setDeletingMenu(menu); setDeleteModalOpen(true); };

    const confirmDelete = async () => {
        try {
            await menuService.delete(deletingMenu.id);
            toast.success('Menu berhasil dihapus');
            setDeleteModalOpen(false);
            setDeletingMenu(null);
            // Jika halaman kosong setelah hapus, mundur ke halaman sebelumnya
            const newTotal = (meta?.total ?? 1) - 1;
            const maxPage = Math.max(1, Math.ceil(newTotal / 12));
            const newPage = Math.min(page, maxPage);
            setPage(newPage);
            fetchMenus({ search, category_id: categoryId, is_available: availability, page: newPage, per_page: 12 });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menghapus menu');
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    const activeCategories = categories.filter((c) => c.is_active);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Manajemen Menu</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Kelola menu, harga, dan ketersediaan
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm"
                >
                    <Plus size={18} />
                    Tambah Menu
                </button>
            </div>

            {/* Filter Bar */}
            <FilterBar
                search={search}
                onSearch={handleSearch}
                categoryId={categoryId}
                onCategory={handleCategory}
                availability={availability}
                onAvailability={handleAvailability}
                categories={activeCategories}
            />

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : menus.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {menus.map((menu) => (
                        <div
                            key={menu.id}
                            className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                        >
                            {/* Image */}
                            <div className="aspect-video bg-slate-100 relative flex-shrink-0">
                                {menu.image ? (
                                    <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="text-slate-400" size={40} />
                                    </div>
                                )}
                                {/* Status badge */}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                        menu.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {menu.is_available ? 'Tersedia' : 'Habis'}
                                    </span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-4 flex flex-col flex-1">
                                <div className="mb-2">
                                    <span className="text-xs font-medium text-[var(--color-primary)] bg-blue-50 px-2 py-0.5 rounded">
                                        {menu.category?.name}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-[var(--color-text)] mb-1 line-clamp-1">{menu.name}</h3>
                                {menu.description && (
                                    <p className="text-xs text-[var(--color-text-muted)] mb-2 line-clamp-2 flex-1">
                                        {menu.description}
                                    </p>
                                )}
                                <p className="text-base font-bold text-[var(--color-primary)] mb-3">
                                    {formatPrice(menu.price)}
                                </p>

                                {/* Actions */}
                                <div className="flex items-center gap-1.5 mt-auto">
                                    {/* Quick toggle */}
                                    <button
                                        onClick={() => handleToggle(menu)}
                                        disabled={togglingId === menu.id}
                                        title={menu.is_available ? 'Nonaktifkan' : 'Aktifkan'}
                                        className={`flex items-center gap-1 px-2 py-1.5 text-xs rounded-lg transition-colors ${
                                            menu.is_available
                                                ? 'text-green-700 bg-green-50 hover:bg-green-100'
                                                : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                                        } disabled:opacity-50`}
                                    >
                                        {togglingId === menu.id ? (
                                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : menu.is_available ? (
                                            <ToggleRight size={14} />
                                        ) : (
                                            <ToggleLeft size={14} />
                                        )}
                                        {menu.is_available ? 'Aktif' : 'Nonaktif'}
                                    </button>

                                    <div className="flex gap-1 ml-auto">
                                        <button
                                            onClick={() => openEditModal(menu)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(menu)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
                    <ImageIcon size={48} className="mb-3 opacity-30" />
                    <p className="font-medium">Tidak ada menu ditemukan</p>
                    {(search || categoryId || availability) && (
                        <p className="text-sm mt-1">Coba ubah filter pencarian</p>
                    )}
                </div>
            )}

            {/* Pagination */}
            <Pagination meta={meta} onPage={setPage} />

            {/* ── Add / Edit Modal ── */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-[var(--color-text)]">
                                {editingMenu ? 'Edit Menu' : 'Tambah Menu'}
                            </h2>
                            <button onClick={closeModal} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Foto */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                    Foto Menu {!editingMenu && <span className="text-red-600">*</span>}
                                </label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                                />
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />
                                )}
                                {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image.message}</p>}
                                <p className="text-xs text-[var(--color-text-muted)] mt-1">Format: JPG, PNG, WebP (Maks 2MB)</p>
                            </div>

                            {/* Kategori */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                    Kategori <span className="text-red-600">*</span>
                                </label>
                                <select
                                    {...register('category_id')}
                                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {activeCategories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-sm text-red-600 mt-1">{errors.category_id.message}</p>}
                            </div>

                            {/* Nama */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                    Nama Menu <span className="text-red-600">*</span>
                                </label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="Contoh: Nasi Goreng Spesial"
                                />
                                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Deskripsi</label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="Deskripsi menu (opsional)"
                                />
                            </div>

                            {/* Harga */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                    Harga <span className="text-red-600">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-muted)]">Rp</span>
                                    <input
                                        {...register('price')}
                                        type="number"
                                        min="0"
                                        step="1"
                                        className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                        placeholder="15000"
                                    />
                                </div>
                                {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
                            </div>

                            {/* Toggle Tersedia */}
                            <div className="flex items-center gap-2">
                                <input
                                    {...register('is_available')}
                                    type="checkbox"
                                    id="is_available"
                                    className="w-4 h-4 text-[var(--color-primary)] border-[var(--color-border)] rounded"
                                />
                                <label htmlFor="is_available" className="text-sm text-[var(--color-text)]">
                                    Menu tersedia / aktif
                                </label>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ── */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">Hapus Menu</h2>
                        <p className="text-sm text-[var(--color-text-muted)] mb-4">
                            Yakin ingin menghapus menu <strong>{deletingMenu?.name}</strong>?
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
