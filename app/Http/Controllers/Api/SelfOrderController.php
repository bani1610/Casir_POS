<?php

namespace App\Http\Controllers\Api;

use App\DTO\OrderDTO;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Menu;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SelfOrderController extends Controller
{
    public function __construct(protected OrderService $orderService) {}

    /**
     * Get available menus for self-order (public, no auth required).
     */
    public function menuList(Request $request): JsonResponse
    {
        $query = Menu::query()->where('is_available', true);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $menus = $query->with('category')->get();

        return response()->json([
            'message' => 'Daftar menu berhasil diambil.',
            'data' => $menus->map(function ($menu) {
                return [
                    'id' => $menu->id,
                    'category_id' => $menu->category_id,
                    'name' => $menu->name,
                    'slug' => $menu->slug,
                    'description' => $menu->description,
                    'price' => (float) $menu->price,
                    'image_url' => $menu->image_url,
                    'is_available' => $menu->is_available,
                    'category' => $menu->category ? [
                        'id' => $menu->category->id,
                        'name' => $menu->category->name,
                        'slug' => $menu->category->slug,
                    ] : null,
                ];
            }),
        ]);
    }

    /**
     * Place a new order from self-order customer (public, no auth required).
     */
    public function placeOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_identifier' => ['required', 'string', 'max:64'],
            'payment_method_id' => ['nullable', 'integer', 'exists:payment_methods,id'],
            'table_number' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_id' => ['required', 'integer', 'exists:menus,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:999'],
        ]);

        $order = $this->orderService->create(OrderDTO::fromArray($validated));

        return response()->json([
            'message' => 'Order berhasil dibuat. Silakan menunggu pesanan Anda diproses.',
            'data' => new OrderResource($order),
        ], 201);
    }

    /**
     * Get order status by customer identifier (public, no auth required).
     * Returns all orders in the last 24 hours for this customer.
     */
    public function orderStatus(string $customerIdentifier): JsonResponse
    {
        $orders = $this->orderService->getSelfOrdersByCustomerIdentifier($customerIdentifier);

        return response()->json([
            'message' => 'Status order berhasil diambil.',
            'data' => OrderResource::collection($orders),
        ]);
    }
}
