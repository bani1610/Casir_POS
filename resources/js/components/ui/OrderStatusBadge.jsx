/**
 * OrderStatusBadge — Tampilkan badge status order
 * Props: status = 'pending' | 'processing' | 'done' | 'cancelled'
 */
const STATUS_CONFIG = {
    pending: {
        label: 'Menunggu',
        className: 'bg-amber-100 text-amber-700 border border-amber-200',
    },
    processing: {
        label: 'Diproses',
        className: 'bg-blue-100 text-blue-700 border border-blue-200',
    },
    done: {
        label: 'Selesai',
        className: 'bg-green-100 text-green-700 border border-green-200',
    },
    cancelled: {
        label: 'Dibatalkan',
        className: 'bg-red-100 text-red-600 border border-red-200',
    },
};

export default function OrderStatusBadge({ status, size = 'sm' }) {
    const config = STATUS_CONFIG[status] ?? {
        label: status,
        className: 'bg-slate-100 text-slate-600 border border-slate-200',
    };

    const sizeClass = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-0.5 text-xs';

    return (
        <span className={`inline-flex items-center font-medium rounded-full ${sizeClass} ${config.className}`}>
            {config.label}
        </span>
    );
}
