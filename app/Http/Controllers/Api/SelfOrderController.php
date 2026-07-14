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
        $menus = Menu::with('category')
            ->available()
            ->when($request->query('category_id'), function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->query('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderBy('category_id')
            ->orderBy('name')
            ->get();

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
                    'image' => $menu->image_url,
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
            'payment_method_id' => ['required', 'integer', 'exists:payment_methods,id'],
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
