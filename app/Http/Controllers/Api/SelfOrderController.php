<?php

namespace App\Http\Controllers\Api;

use App\DTO\OrderDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SelfOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Menu;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SelfOrderController extends Controller
{
    public function __construct(protected OrderService $service) {}

    /**
     * GET /api/v1/self-order/menus
     * Daftar menu yang tersedia untuk pembeli (tanpa auth).
     * Mendukung filter category_id dan search (nama/deskripsi).
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
            'data'    => $menus->map(fn ($menu) => [
                'id'          => $menu->id,
                'category_id' => $menu->category_id,
                'name'        => $menu->name,
                'slug'        => $menu->slug,
                'description' => $menu->description,
                'price'       => (float) $menu->price,
                'image_url'   => $menu->image_url,
                'is_available'=> $menu->is_available,
                'category'    => $menu->category ? [
                    'id'   => $menu->category->id,
                    'name' => $menu->category->name,
                    'slug' => $menu->category->slug,
                ] : null,
            ])->values(),
        ]);
    }

    /**
     * POST /api/v1/self-order/orders
     * Pembeli membuat order baru menggunakan device fingerprint.
     *
     * Logic sesi 24 jam:
     * - customer_identifier (hash device/browser) dikirim dari frontend.
     * - OrderRepository::findByCustomerIdentifier hanya mengambil order
     *   dalam 24 jam terakhir — frontend cukup cek apakah ada order aktif.
     * - Jika tidak ada, buat order baru dengan identifier yang sama.
     */
    public function placeOrder(SelfOrderRequest $request): JsonResponse
    {
        $dto = OrderDTO::fromArray(array_merge(
            $request->validated(),
            [
                'user_id' => null,   // self-order tidak terikat user
                'status'  => 'pending',
            ]
        ));

        $order = $this->service->createSelfOrder($dto);

        return response()->json([
            'message' => 'Order berhasil dibuat. Silakan menunggu pesanan Anda diproses.',
            'data'    => new OrderResource($order),
        ], 201);
    }

    /**
     * GET /api/v1/self-order/orders/{customerIdentifier}
     * Pembeli cek status order miliknya dalam sesi 24 jam terakhir.
     *
     * customerIdentifier = device fingerprint yang sama saat placeOrder.
     */
    public function orderStatus(string $customerIdentifier): JsonResponse
    {
        $orders = $this->service->getByCustomerIdentifier($customerIdentifier);

        if ($orders->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada order aktif dalam 24 jam terakhir.',
                'data'    => [],
            ]);
        }

        return response()->json([
            'message' => 'Status order berhasil diambil.',
            'data'    => OrderResource::collection($orders),
        ]);
    }
}
