import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categoryService } from '@/services/categoryService';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';

const categorySchema = z.object({
    name: z.string().min(1, 'Nama kategori wajib diisi').max(100, 'Maksimal 100 karakter'),
    is_active: z.boolean().default(true),
});

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Filter states
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); // '' | 'active' | 'inactive'

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(categorySchema),
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAll();
            setCategories(data);
        } catch {
            toast.error('Gagal memuat data kategori');
        } finally {
            setLoading(false);
        }
    };

    // Filter client-side (kategori biasanya sedikit, tidak perlu server-side)
    const filteredCategories = useMemo(() => {
        return categories.filter((c) => {
            const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
            const matchStatus =
                !filterStatus ||
                (filterStatus === 'active' && c.is_active) ||
                (filterStatus === 'inactive' && !c.is_active);
            return matchSearch && matchStatus;
        });
    }, [categories, search, filterStatus]);

    // ── Modal helpers ──────────────────────────────────────────────────────────
    const openAddModal = () => {
        setEditingCategory(null);
        reset({ name: '', is_active: true });
        setModalOpen(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        reset({ name: category.name, is_active: category.is_active });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
        reset();
    };

    // ── Submit ─────────────────────────────────────────────────────────────────
    const onSubmit = async (data) => {
        try {
            if (editingCategory) {
                await categoryService.update(editingCategory.id, data);
                toast.success('Kategori berhasil diupdate');
            } else {
                await categoryService.create(data);
                toast.success('Kategori berhasil ditambahkan');
            }
            closeModal();
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menyimpan kategori');
        }
    };

    // ── Delete ─────────────────────────────────────────────────────────────────
    const openDeleteModal = (category) => {
        setDeletingCategory(category);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        setDeletingId(deletingCategory.id);
        try {
            await categoryService.delete(deletingCategory.id);
            toast.success('Kategori berhasil dihapus');
            setDeleteModalOpen(false);
            setDeletingCategory(null);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menghapus kategori');
        } finally {
            setDeletingId(null);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Kategori Menu</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Kelola kategori untuk pengelompokan menu
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm"
                >
                    <Plus size={18} />
                    Tambah Kategori
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama kategori..."
                        className="w-full pl-9 pr-9 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                    <option value="">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                </select>
                {/* Counter */}
                <span className="text-sm text-[var(--color-text-muted)]">
                    {filteredCategories.length} dari {categories.length} kategori
                </span>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-[var(--color-border)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Nama
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-[var(--color-text)]">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--color-text-muted)] font-mono">
                                            {category.slug}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                category.is_active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                {category.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(category)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(category)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-sm text-[var(--color-text-muted)]">
                                        {search || filterStatus ? 'Tidak ada kategori yang sesuai filter' : 'Belum ada kategori'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Add / Edit Modal ── */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-[var(--color-text)]">
                                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
                            </h2>
                            <button onClick={closeModal} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                    Nama Kategori <span className="text-red-600">*</span>
                                </label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="Contoh: Makanan"
                                    autoFocus
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    {...register('is_active')}
                                    type="checkbox"
                                    id="is_active"
                                    className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
                                />
                                <label htmlFor="is_active" className="text-sm text-[var(--color-text)]">
                                    Kategori aktif
                                </label>
                            </div>

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

            {/* ── Delete Modal ── */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">Hapus Kategori</h2>
                        <p className="text-sm text-[var(--color-text-muted)] mb-1">
                            Yakin ingin menghapus kategori <strong>{deletingCategory?.name}</strong>?
                        </p>
                        <p className="text-xs text-amber-600 mb-4">
                            ⚠ Kategori yang masih memiliki menu tidak dapat dihapus.
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
                                disabled={deletingId === deletingCategory?.id}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {deletingId ? 'Menghapus...' : 'Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
