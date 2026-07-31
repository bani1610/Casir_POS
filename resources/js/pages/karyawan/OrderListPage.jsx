import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import OrderStatusBadge from '@/components/ui/OrderStatusBadge';
import { toast } from 'sonner';
import {
    Search, ChevronLeft, ChevronRight, Eye, X,
    Printer, RefreshCw,
} from 'lucide-react';

const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

const formatDate = (iso) => {
    if (!iso) return '-';
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium', timeStyle: 'short',
    }).format(new Date(iso));
};

// ─── Status Flow ─────────────────────────────────────────────────────────────
const NEXT_STATUS = {
    pending: 'processing',
    processing: 'done',
};

const STATUS_LABELS = {
    pending: 'Proses',
    processing: 'Selesai',
};

// ─── Detail Modal ────────────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose, onStatusChange, onPrint }) {
    const [updating, setUpdating] = useState(false);
    const nextStatus = NEXT_STATUS[order.status];

    const handleStatusChange = async () => {
        if (!nextStatus) return;
        setUpdating(true);
        try {
            await orderService.updateStatus(order.id, nextStatus);
            toast.success(`Order #${order.id} status diperbarui`);
            onStatusChange();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal update status');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-xl" id="print-area">
                {/* Header */}
                <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-[var(--color-text)] text-lg">Order #{order.id}</h2>
                        <p className="text-xs text-[var(--color-text-muted)]">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <OrderStatusBadge status={order.status} size="sm" />
                        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-5 space-y-4">
                    {/* Info */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-[var(--color-text-muted)] text-xs mb-0.5">Meja</p>
                            <p className="font-medium">{order.table_number || '-'}</p>
                        </div>
                        <div>
                            <p className="text-[var(--color-text-muted)] text-xs mb-0.5">Pembayaran</p>
                            <p className="font-medium">{order.payment_method?.name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-[var(--color-text-muted)] text-xs mb-0.5">Kasir</p>
                            <p className="font-medium">{order.user?.name || (order.is_self_order ? 'Self Order' : '-')}</p>
                        </div>
                        <div>
                            <p className="text-[var(--color-text-muted)] text-xs mb-0.5">Total</p>
                            <p className="font-bold text-[var(--color-primary)]">{formatPrice(order.total_price)}</p>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                            <p className="font-medium text-xs text-amber-600 mb-1">Catatan</p>
                            {order.notes}
                        </div>
                    )}

                    {/* Items */}
                    <div>
                        <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Item Pesanan</h3>
                        <div className="space-y-2">
                            {(order.items ?? []).map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-[var(--color-text)] flex-1 truncate">
                                        {item.menu_name} <span className="text-[var(--color-text-muted)]">×{item.quantity}</span>
                                    </span>
                                    <span className="font-medium text-right ml-4">{formatPrice(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-[var(--color-primary)]">{formatPrice(order.total_price)}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-[var(--color-border)] flex gap-2">
                    <button
                        onClick={onPrint}
                        className="flex items-center gap-1.5 px-3 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-xl text-sm hover:bg-slate-50 transition-colors"
                    >
                        <Printer size={15} /> Cetak Struk
                    </button>
                    {nextStatus && (
                        <button
                            onClick={handleStatusChange}
                            disabled={updating}
                            className="flex-1 py-2 bg-[var(--color-primary)] text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {updating ? 'Memperbarui...' : `→ ${STATUS_LABELS[order.status]}`}
                        </button>
                    )}
                    {order.status === 'done' && (
                        <div className="flex-1 py-2 bg-green-50 text-green-700 text-center font-semibold rounded-xl text-sm">
                            ✓ Sudah Selesai
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Print Struk ─────────────────────────────────────────────────────────────
function printStruk(order) {
    const items = (order.items ?? [])
        .map(i => `${i.menu_name.padEnd(20)} x${i.quantity}  ${formatPrice(i.subtotal)}`)
        .join('\n');

    const win = window.open('', '_blank', 'width=320,height=600');
    win.document.write(`
        <html><head><title>Struk Order #${order.id}</title>
        <style>
            body { font-family: monospace; font-size: 12px; padding: 16px; }
            hr { border: none; border-top: 1px dashed #999; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .row { display: flex; justify-content: space-between; }
        </style></head><body>
        <div class="center bold">CASIR POS</div>
        <div class="center">Order #${order.id}</div>
        <div class="center">${formatDate(order.created_at)}</div>
        <hr/>
        ${order.table_number ? `<div>Meja: ${order.table_number}</div>` : ''}
        <div>Kasir: ${order.user?.name ?? 'Self Order'}</div>
        <div>Bayar: ${order.payment_method?.name ?? '-'}</div>
        <hr/>
        <pre>${items}</pre>
        <hr/>
        <div class="row bold"><span>TOTAL</span><span>${formatPrice(order.total_price)}</span></div>
        ${order.notes ? `<hr/><div>Catatan: ${order.notes}</div>` : ''}
        <hr/>
        <div class="center">Terima kasih!</div>
        </body></html>
    `);
    win.document.close();
    win.print();
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function OrderListPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingId, setUpdatingId] = useState(null); // row-level loading

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [page, setPage] = useState(1);

    const searchTimer = useRef(null);

    const fetchOrders = useCallback(async (params) => {
        setLoading(true);
        try {
            const result = await orderService.getPaginated(params);
            setOrders(Array.isArray(result?.data) ? result.data : []);
            setMeta(result?.meta ?? null);
        } catch {
            toast.error('Gagal memuat data order');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders({ status: statusFilter, date: dateFilter, page, per_page: 15 });
    }, [statusFilter, dateFilter, page, fetchOrders]);

    // Client-side search filter
    const displayedOrders = search
        ? orders.filter(o =>
            String(o.id).includes(search) ||
            (o.table_number ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (o.user?.name ?? '').toLowerCase().includes(search.toLowerCase())
          )
        : orders;

    const handleRefresh = () => {
        fetchOrders({ status: statusFilter, date: dateFilter, page, per_page: 15 });
    };

    // Quick status update langsung dari baris tabel
    const handleQuickStatus = async (order, nextStatus) => {
        setUpdatingId(order.id);
        try {
            await orderService.updateStatus(order.id, nextStatus);
            const label = nextStatus === 'processing' ? 'diproses' : 'selesai';
            toast.success(`Order #${order.id} sekarang ${label}`);
            fetchOrders({ status: statusFilter, date: dateFilter, page, per_page: 15 });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const openDetail = async (order) => {
        try {
            const detail = await orderService.getById(order.id);
            setSelectedOrder(detail);
        } catch {
            toast.error('Gagal memuat detail order');
        }
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Riwayat Order</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Lihat dan kelola semua order</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        className="p-2 border border-[var(--color-border)] rounded-xl hover:bg-slate-50 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={17} />
                    </button>
                    <button
                        onClick={() => navigate('/karyawan/orders/create')}
                        className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        + Buat Order
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[180px]">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Cari ID / meja / kasir..."
                        className="w-full pl-9 pr-4 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                    <option value="">Semua Status</option>
                    <option value="pending">Menunggu</option>
                    <option value="processing">Diproses</option>
                    <option value="done">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                </select>
                <input
                    type="date"
                    value={dateFilter}
                    onChange={e => { setDateFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-[var(--color-border)]">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">#ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Meja</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Kasir</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Waktu</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {displayedOrders.length > 0 ? displayedOrders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 text-sm font-bold text-[var(--color-text)]">#{order.id}</td>
                                    <td className="px-4 py-3 text-sm text-[var(--color-text)]">{order.table_number || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                                        {order.user?.name ?? (order.is_self_order ? 'Self Order' : '-')}
                                    </td>
                                    <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                                    <td className="px-4 py-3 text-sm font-semibold text-right text-[var(--color-primary)]">
                                        {formatPrice(order.total_price)}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">
                                        {formatDate(order.created_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {/* Tombol aksi cepat sesuai status */}
                                            {order.status === 'pending' && (
                                                <button
                                                    onClick={() => handleQuickStatus(order, 'processing')}
                                                    disabled={updatingId === order.id}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                                                >
                                                    {updatingId === order.id
                                                        ? <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                        : '▶'}
                                                    Proses
                                                </button>
                                            )}
                                            {order.status === 'processing' && (
                                                <button
                                                    onClick={() => handleQuickStatus(order, 'done')}
                                                    disabled={updatingId === order.id}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                                >
                                                    {updatingId === order.id
                                                        ? <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                                        : '✓'}
                                                    Selesai
                                                </button>
                                            )}
                                            {/* Tombol detail */}
                                            <button
                                                onClick={() => openDetail(order)}
                                                className="p-1.5 text-slate-500 hover:text-[var(--color-primary)] hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <Eye size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-12 text-center text-sm text-[var(--color-text-muted)]">
                                        Tidak ada order ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-[var(--color-text-muted)]">
                        {(meta.current_page - 1) * meta.per_page + 1}–{Math.min(meta.current_page * meta.per_page, meta.total)} dari {meta.total}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={meta.current_page === 1}
                            className="p-2 rounded-lg border border-[var(--color-border)] disabled:opacity-40 hover:bg-slate-50"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="px-3 text-sm font-medium">{meta.current_page} / {meta.last_page}</span>
                        <button
                            onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                            disabled={meta.current_page === meta.last_page}
                            className="p-2 rounded-lg border border-[var(--color-border)] disabled:opacity-40 hover:bg-slate-50"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={handleRefresh}
                    onPrint={() => printStruk(selectedOrder)}
                />
            )}
        </div>
    );
}
