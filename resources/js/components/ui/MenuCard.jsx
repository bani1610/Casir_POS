import { Image as ImageIcon } from 'lucide-react';

export default function MenuCard({ menu, onAddToCart }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
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
                {!menu.is_available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg">
                            Habis
                        </span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="mb-2">
                    <span className="text-xs font-medium text-[var(--color-primary)] bg-blue-50 px-2 py-1 rounded">
                        {menu.category?.name}
                    </span>
                </div>
                <h3 className="font-semibold text-[var(--color-text)] mb-1 line-clamp-1">
                    {menu.name}
                </h3>
                {menu.description && (
                    <p className="text-sm text-[var(--color-text-muted)] mb-3 line-clamp-2">
                        {menu.description}
                    </p>
                )}
                <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-[var(--color-primary)]">
                        {formatPrice(menu.price)}
                    </p>
                    {menu.is_available && onAddToCart && (
                        <button
                            onClick={() => onAddToCart(menu)}
                            className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Tambah
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
