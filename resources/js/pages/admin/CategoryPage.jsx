import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categoryService } from '@/services/categoryService';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

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
        } catch (error) {
            toast.error('Gagal memuat data kategori');
        } finally {
            setLoading(false);
        }
    };

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

    const openDeleteModal = (category) => {
        setDeletingCategory(category);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await categoryService.delete(deletingCategory.id);
            toast.success('Kategori berhasil dihapus');
            setDeleteModalOpen(false);
            setDeletingCategory(null);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menghapus kategori');
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Kategori Menu</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Kelola kategori menu</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm"
                >
                    <Plus size={18} />
                    Tambah Kategori
                </button>
            </div>

            <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-[var(--color-border)]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-[var(--color-text)]">{category.name}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">{category.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            category.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {category.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(category)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-sm text-[var(--color-text-muted)]">
                                    Belum ada kategori
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
                                    Nama Kategori
                                </label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="Contoh: Makanan"
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
                                    className="w-4 h-4 text-[var(--color-primary)] border-[var(--color-border)] rounded focus:ring-2 focus:ring-[var(--color-primary)]"
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

            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">Hapus Kategori</h2>
                        <p className="text-sm text-[var(--color-text-muted)] mb-4">
                            Yakin ingin menghapus kategori <strong>{deletingCategory?.name}</strong>?
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
