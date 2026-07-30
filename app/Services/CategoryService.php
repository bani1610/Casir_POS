<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\CategoryRepository;
use Illuminate\Support\Str;

class CategoryService
{
    public function __construct(
        private CategoryRepository $categoryRepository
    ) {}

    public function getAllCategories()
    {
        return $this->categoryRepository->all();
    }

    public function getActiveCategories()
    {
        return $this->categoryRepository->getActive();
    }

    public function getCategoryById(int $id): ?Category
    {
        return $this->categoryRepository->findById($id);
    }

    public function createCategory(array $data): Category
    {
        // Generate slug dari name jika tidak ada
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->categoryRepository->create($data);
    }

    public function updateCategory(Category $category, array $data): bool
    {
        // Update slug jika name berubah dan slug tidak di-set manual
        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->categoryRepository->update($category, $data);
    }

    public function deleteCategory(Category $category): bool
    {
        // Cek apakah kategori masih memiliki menu
        if ($category->menus()->count() > 0) {
            throw new \Exception('Tidak dapat menghapus kategori yang masih memiliki menu');
        }

        return $this->categoryRepository->delete($category);
    }
}
