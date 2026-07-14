<?php

namespace App\Http\Controllers\Api;

use App\DTO\OrderDTO;
use App\DTO\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\OrderRequest;
use App\Http\Requests\Api\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(protected OrderService $service) {}

    /**
     * GET /api/v1/orders
     * Daftar order dengan pagination, filter status, tanggal, dsb.
     */
    public function index(Request $request): JsonResponse
    {
        $pagination = PaginationDTO::fromRequest($request);

        $filters = $request->only([
            'status',
            'user_id',
            'payment_method_id',
            'date',
            'from_date',
            'to_date',
        ]);

        $orders = $this->service->getPaginated($pagination, $filters);

        return response()->json([
            'message' => 'Data order berhasil diambil.',
            'data'    => OrderResource::collection($orders->items()),
            'meta'    => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    /**
     * GET /api/v1/orders/{order}
     * Detail satu order beserta items dan relasi lainnya.
     */
    public function show(int $order): JsonResponse
    {
        return response()->json([
            'message' => 'Detail order berhasil diambil.',
            'data'    => new OrderResource($this->service->getById($order)),
        ]);
    }

    /**
     * POST /api/v1/orders
     * Buat order baru (oleh karyawan/admin).
     */
    public function store(OrderRequest $request): JsonResponse
    {
        $payload = $request->validated();

        // Karyawan/admin yang login otomatis jadi creator order
        if ($request->user()) {
            $payload['user_id'] = $request->user()->id;
        }

        $order = $this->service->create(OrderDTO::fromArray($payload));

        return response()->json([
            'message' => 'Order berhasil dibuat.',
            'data'    => new OrderResource($order),
        ], 201);
    }

    /**
     * PUT/PATCH /api/v1/orders/{order}
     * Update order (items, payment, catatan).
     */
    public function update(OrderRequest $request, int $order): JsonResponse
    {
        $payload = $request->validated();

        if ($request->user()) {
            $payload['user_id'] = $request->user()->id;
        }

        return response()->json([
            'message' => 'Order berhasil diperbarui.',
            'data'    => new OrderResource(
                $this->service->update($order, OrderDTO::fromArray($payload))
            ),
        ]);
    }

    /**
     * DELETE /api/v1/orders/{order}
     * Hapus order (hanya status pending/cancelled).
     */
    public function destroy(int $order): JsonResponse
    {
        $this->service->delete($order);

        return response()->json([
            'message' => 'Order berhasil dihapus.',
        ]);
    }

    /**
     * PATCH /api/v1/orders/{order}/status
     * Update status order (pending → processing → done | cancelled).
     */
    public function updateStatus(
        UpdateOrderStatusRequest $request,
        int $order
    ): JsonResponse {
        $updated = $this->service->updateStatus($order, $request->validated('status'));

        return response()->json([
            'message' => 'Status order berhasil diperbarui.',
            'data'    => new OrderResource($updated),
        ]);
    }
}
