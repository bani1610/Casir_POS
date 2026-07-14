<?php

namespace App\Http\Controllers\Api;

use App\DTO\OrderDTO;
use App\DTO\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function __construct(protected OrderService $service) {}

    /**
     * Display a paginated listing of orders.
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
            'data' => OrderResource::collection($orders->items()),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * Store a newly created order.
     */
    public function store(OrderRequest $request): JsonResponse
    {
        $payload = $request->validated();

        // Kalau request sudah authenticated, pakai user login sebagai creator.
        // Kalau self-order, user_id tetap null dan customer_identifier wajib dikirim frontend.
        if ($request->user()) {
            $payload['user_id'] = $request->user()->id;
        }

        $order = $this->service->create(OrderDTO::fromArray($payload));

        return response()->json([
            'message' => 'Order berhasil dibuat.',
            'data' => new OrderResource($order),
        ], 201);
    }

    /**
     * Display the specified order.
     */
    public function show(int $id): JsonResponse
    {
        $order = $this->service->getById($id);

        return response()->json([
            'message' => 'Detail order berhasil diambil.',
            'data' => new OrderResource($order),
        ]);
    }

    /**
     * Update the specified order.
     */
    public function update(OrderRequest $request, int $id): JsonResponse
    {
        $payload = $request->validated();

        if ($request->user()) {
            $payload['user_id'] = $request->user()->id;
        }

        $order = $this->service->update($id, OrderDTO::fromArray($payload));

        return response()->json([
            'message' => 'Order berhasil diperbarui.',
            'data' => new OrderResource($order),
        ]);
    }

    /**
     * Remove the specified order.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);

        return response()->json([
            'message' => 'Order berhasil dihapus.',
        ]);
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(Order::STATUSES)],
        ]);

        $order = $this->service->updateStatus($id, $validated['status']);

        return response()->json([
            'message' => 'Status order berhasil diperbarui.',
            'data' => new OrderResource($order),
        ]);
    }
}
