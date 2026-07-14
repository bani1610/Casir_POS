<?php

namespace App\Http\Controllers\Api;

use App\DTO\OrderDTO;
use App\DTO\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\OrderRequest;
use App\Http\Requests\Api\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function __construct(protected OrderService $service) {}

    /**
     * GET /api/v1/orders
     * Daftar order dengan pagination, filter status, tanggal, dsb.
     */
    public function index(Request $request): AnonymousResourceCollection
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

        return OrderResource::collection($orders);
    }

    /**
     * GET /api/v1/orders/{order}
     * Detail satu order beserta items dan relasi lainnya.
     */
    public function show(int $order): OrderResource
    {
        return new OrderResource($this->service->getById($order));
    }

    /**
     * POST /api/v1/orders
     * Buat order baru (oleh karyawan/admin).
     */
    public function store(OrderRequest $request): JsonResponse
    {
        $dto = OrderDTO::fromArray(array_merge(
            $request->validated(),
            ['user_id' => $request->user()->id]
        ));

        $order = $this->service->create($dto);

        return (new OrderResource($order))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * PUT/PATCH /api/v1/orders/{order}
     * Update order (items, payment, catatan).
     */
    public function update(OrderRequest $request, int $order): OrderResource
    {
        $dto = OrderDTO::fromArray($request->validated());

        return new OrderResource(
            $this->service->update($order, $dto)
        );
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
    ): OrderResource {
        return new OrderResource(
            $this->service->updateStatus($order, $request->validated('status'))
        );
    }
}
