<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryService $categoryService
    ) {}

    public function index(): JsonResponse
    {
        $categories = $this->categoryService->getAllCategories();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
        ]);
    }

    public function store(CategoryRequest $request): JsonResponse
    {
        try {
            $category = $this->categoryService->createCategory($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Kategori berhasil ditambahkan',
                'data' => new CategoryResource($category),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new CategoryResource($category),
        ]);
    }

    public function update(CategoryRequest $request, Category $category): JsonResponse
    {
        try {
            $this->categoryService->updateCategory($category, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Kategori berhasil diupdate',
                'data' => new CategoryResource($category->fresh()),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function destroy(Category $category): JsonResponse
    {
        try {
            $this->categoryService->deleteCategory($category);

            return response()->json([
                'success' => true,
                'message' => 'Kategori berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
