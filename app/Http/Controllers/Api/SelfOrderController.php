<?php

namespace App\Http\Controllers\Api;

use App\DTO\OrderDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SelfOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Menu;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SelfOrderController extends Controller
{
    public function __construct(protected OrderService $service) {}

    /**
     * GET /api/v1/self-order/menus
     * Daftar menu yang tersedia untuk pembeli (tanpa auth).
     * Dikelompokkan per kategori.
     */
    public function menuList(): JsonResponse
    {
        $menus = Menu::with('category')
            ->available()
            ->orderBy('name')
            ->get()
            ->groupBy(fn ($menu) => $menu->category->name ?? 'Lainnya')
            ->map(fn ($items, $category) => [
                'category' => $category,
                'items'    => $items->map(fn ($menu) => [
                    'id'          => $menu->id,
                    'name'        => $menu->name,
                    'description' => $menu->description,
                    'price'       => (float) $menu->price,
                    'image_url'   => $menu->image_url,
                ])->values(),
            ])->values();

        return response()->json([
            'data' => $menus,
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
                'user_id' => null,  // self-order tidak terikat user
                'status'  => 'pending',
            ]
        ));

        $order = $this->service->createSelfOrder($dto);

        return (new OrderResource($order))
            ->response()
            ->setStatusCode(201);
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
            'data' => OrderResource::collection($orders),
        ]);
    }
}
