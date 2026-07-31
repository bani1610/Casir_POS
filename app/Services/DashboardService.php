<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Ambil statistik dashboard untuk admin.
     */
    public function getAdminStatistics(): array
    {
        $today = today();
        $startOfMonth = now()->startOfMonth();

        // Total order hari ini
        $totalOrdersToday = Order::whereDate('created_at', $today)->count();

        // Total pendapatan hari ini (hanya order yang done)
        $totalRevenueToday = Order::whereDate('created_at', $today)
            ->where('status', Order::STATUS_DONE)
            ->sum('total_price');

        // Total pendapatan bulan ini
        $totalRevenueMonth = Order::where('created_at', '>=', $startOfMonth)
            ->where('status', Order::STATUS_DONE)
            ->sum('total_price');

        // Jumlah order per status hari ini
        $ordersByStatus = Order::whereDate('created_at', $today)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Orders per day untuk grafik tren (7 hari terakhir)
        $ordersPerDay = Order::where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->where('status', Order::STATUS_DONE)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(total_price) as revenue')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'total_orders' => (int) $item->total_orders,
                    'revenue' => (float) $item->revenue,
                ];
            });

        // Menu terlaris (berdasarkan quantity terjual hari ini)
        $topSellingMenus = OrderItem::query()
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('menus', 'order_items.menu_id', '=', 'menus.id')
            ->whereDate('orders.created_at', $today)
            ->where('orders.status', Order::STATUS_DONE)
            ->select(
                'menus.name',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.subtotal) as total_revenue')
            )
            ->groupBy('menus.id', 'menus.name')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get();

        // 5 order terbaru
        $recentOrders = Order::with(['user', 'paymentMethod', 'orderItems.menu'])
            ->latest()
            ->limit(5)
            ->get();

        return [
            'total_orders_today' => $totalOrdersToday,
            'total_revenue_today' => (float) $totalRevenueToday,
            'total_revenue_month' => (float) $totalRevenueMonth,
            'orders_by_status' => [
                'pending' => $ordersByStatus[Order::STATUS_PENDING] ?? 0,
                'processing' => $ordersByStatus[Order::STATUS_PROCESSING] ?? 0,
                'done' => $ordersByStatus[Order::STATUS_DONE] ?? 0,
                'cancelled' => $ordersByStatus[Order::STATUS_CANCELLED] ?? 0,
            ],
            'orders_per_day' => $ordersPerDay,
            'top_selling_menus' => $topSellingMenus,
            'recent_orders' => $recentOrders,
        ];
    }

    /**
     * Ambil data dashboard untuk karyawan.
     */
    public function getKaryawanStatistics(): array
    {
        // Order aktif yang perlu diproses
        $activeOrders = Order::with(['user', 'paymentMethod', 'orderItems.menu'])
            ->whereIn('status', [Order::STATUS_PENDING, Order::STATUS_PROCESSING])
            ->latest()
            ->get();

        // Jumlah order aktif per status
        $pendingCount = $activeOrders->where('status', Order::STATUS_PENDING)->count();
        $processingCount = $activeOrders->where('status', Order::STATUS_PROCESSING)->count();

        return [
            'active_orders' => $activeOrders,
            'pending_count' => $pendingCount,
            'processing_count' => $processingCount,
            'total_active' => $activeOrders->count(),
        ];
    }
}
