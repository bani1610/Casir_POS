<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MenuRequest;
use App\Http\Resources\MenuResource;
use App\Models\Menu;
use App\Services\MenuService;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    public function __construct(
        private MenuService $menuService
    ) {}

    public function index(): JsonResponse
    {
        $menus = $this->menuService->getAllMenus();

        return response()->json([
            'success' => true,
            'data' => MenuResource::collection($menus),
        ]);
    }

    public function show(Menu $menu): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new MenuResource($menu->load('category')),
        ]);
    }

    public function store(MenuRequest $request): JsonResponse
    {
        try {
            $menu = $this->menuService->createMenu($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Menu berhasil ditambahkan',
                'data' => new MenuResource($menu->load('category')),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function update(MenuRequest $request, Menu $menu): JsonResponse
    {
        try {
            $this->menuService->updateMenu($menu, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Menu berhasil diupdate',
                'data' => new MenuResource($menu->fresh()->load('category')),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function destroy(Menu $menu): JsonResponse
    {
        try {
            $this->menuService->deleteMenu($menu);

            return response()->json([
                'success' => true,
                'message' => 'Menu berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
