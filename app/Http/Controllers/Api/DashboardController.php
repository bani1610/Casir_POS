<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    /**
     * Ambil statistik dashboard admin.
     */
    public function admin(): JsonResponse
    {
        $statistics = $this->dashboardService->getAdminStatistics();

        return response()->json([
            'success' => true,
            'data' => [
                'total_orders_today' => $statistics['total_orders_today'],
                'total_revenue_today' => $statistics['total_revenue_today'],
                'orders_by_status' => $statistics['orders_by_status'],
                'top_selling_menus' => $statistics['top_selling_menus'],
                'recent_orders' => OrderResource::collection($statistics['recent_orders']),
            ],
        ]);
    }

    /**
     * Ambil data dashboard karyawan.
     */
    public function karyawan(): JsonResponse
    {
        $statistics = $this->dashboardService->getKaryawanStatistics();

        return response()->json([
            'success' => true,
            'data' => [
                'active_orders' => OrderResource::collection($statistics['active_orders']),
                'pending_count' => $statistics['pending_count'],
                'processing_count' => $statistics['processing_count'],
                'total_active' => $statistics['total_active'],
            ],
        ]);
    }
}
