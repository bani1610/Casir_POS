import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { menuService } from '@/services/menuService';
import { categoryService } from '@/services/categoryService';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Image as ImageIcon } from 'lucide-react';

const menuSchema = z.object({
    category_id: z.string().min(1, 'Kategori wajib dipilih'),
    name: z.string().min(1, 'Nama menu wajib diisi').max(255, 'Maksimal 255 karakter'),
    description: z.string().optional(),
    price: z.string().min(1, 'Harga wajib diisi'),
    image: z.any().optional(),
    is_available: z.boolean().default(true),
});

export default function MenuPage() {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [deletingMenu, setDeletingMenu] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(menuSchema),
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [menusData, categoriesData] = await Promise.all([
                menuService.getAll(),
                categoryService.getAll(),
            ]);
            setMenus(menusData);
            setCategories(categoriesData.filter(c => c.is_active));
        } catch (error) {
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingMenu(null);
        setImagePreview(null);
        reset({
            category_id: '',
            name: '',
            description: '',
            price: '',
            is_available: true
        });
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
            is_available: menu.is_available
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
        if (file) {
            setValue('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('category_id', data.category_id);
            formData.append('name', data.name);
            formData.append('description', data.description || '');
            formData.append('price', data.price);
            formData.append('is_available', data.is_available ? '1' : '0');

            if (data.image && data.image instanceof File) {
                formData.append('image', data.image);
            }

            if (editingMenu) {
                await menuService.update(editingMenu.id, formData);
                toast.success('Menu berhasil diupdate');
            } else {
                await menuService.create(formData);
                toast.success('Menu berhasil ditambahkan');
            }
            closeModal();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menyimpan menu');
        }
    };

    const openDeleteModal = (menu) => {
        setDeletingMenu(menu);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await menuService.delete(deletingMenu.id);
            toast.success('Menu berhasil dihapus');
            setDeleteModalOpen(false);
            setDeletingMenu(null);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal menghapus menu');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
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
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Manajemen Menu</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Kelola menu dan harga</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm"
                >
                    <Plus size={18} />
                    Tambah Menu
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {menus.length > 0 ? (
                    menus.map((menu) => (
                        <div key={menu.id} className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-video bg-slate-100 relative">
                                {menu.image ? (
                                    <img
                                        src={menu.image}
                                        alt={menu.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="text-slate-400" size={48} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        menu.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {menu.is_available ? 'Tersedia' : 'Habis'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="mb-2">
                                    <span className="text-xs font-medium text-[var(--color-primary)] bg-blue-50 px-2 py-1 rounded">
                                        {menu.category?.name}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-[var(--color-text)] mb-1 line-clamp-1">{menu.name}</h3>
                                {menu.description && (
                                    <p className="text-xs text-[var(--color-text-muted)] mb-2 line-clamp-2">{menu.description}</p>
                                )}
                                <p className="text-lg font-bold text-[var(--color-primary)] mb-3">
                                    {formatPrice(menu.price)}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(menu)}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                    >
                                        <Pencil size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(menu)}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-[var(--color-text-muted)]">
                        Belum ada menu
                    </div>
                )}
            </div>

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
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                    Foto Menu {!editingMenu && <span className="text-red-600">*</span>}
                                </label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                                {errors.image && (
                                    <p className="text-sm text-red-600 mt-1">{errors.image.message}</p>
                                )}
                                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                    Format: JPG, PNG, WebP (Maks 2MB)
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                    Kategori <span className="text-red-600">*</span>
                                </label>
                                <select
                                    {...register('category_id')}
                                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-sm text-red-600 mt-1">{errors.category_id.message}</p>
                                )}
                            </div>

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
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                    Deskripsi
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="Deskripsi menu (opsional)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                    Harga <span className="text-red-600">*</span>
                                </label>
                                <input
                                    {...register('price')}
                                    type="number"
                                    min="0"
                                    step="1"
                                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="15000"
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    {...register('is_available')}
                                    type="checkbox"
                                    id="is_available"
                                    className="w-4 h-4 text-[var(--color-primary)] border-[var(--color-border)] rounded focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                                <label htmlFor="is_available" className="text-sm text-[var(--color-text)]">
                                    Menu tersedia
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
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">Hapus Menu</h2>
                        <p className="text-sm text-[var(--color-text-muted)] mb-4">
                            Yakin ingin menghapus menu <strong>{deletingMenu?.name}</strong>?
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
