<?php

namespace App\Services;

use App\Models\Menu;
use App\Repositories\MenuRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MenuService
{
    public function __construct(
        private MenuRepository $menuRepository
    ) {}

    public function getAllMenus()
    {
        return $this->menuRepository->all();
    }

    public function getAvailableMenus()
    {
        return $this->menuRepository->getAvailable();
    }

    public function getMenuById(int $id): ?Menu
    {
        return $this->menuRepository->findById($id);
    }

    public function createMenu(array $data): Menu
    {
        // Generate slug dari name jika tidak ada
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // Handle image upload
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $this->uploadImage($data['image']);
        }

        return $this->menuRepository->create($data);
    }

    public function updateMenu(Menu $menu, array $data): bool
    {
        // Update slug jika name berubah dan slug tidak di-set manual
        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // Handle image upload
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            // Delete old image
            if ($menu->image) {
                $this->deleteImage($menu->image);
            }
            $data['image'] = $this->uploadImage($data['image']);
        }

        return $this->menuRepository->update($menu, $data);
    }

    public function deleteMenu(Menu $menu): ?bool
    {
        // Delete image jika ada
        if ($menu->image) {
            $this->deleteImage($menu->image);
        }

        return $this->menuRepository->delete($menu);
    }

    /**
     * Upload image ke storage dan return path
     */
    private function uploadImage(UploadedFile $file): string
    {
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('menus', $filename, 'public');

        return $path;
    }

    /**
     * Delete image dari storage
     */
    private function deleteImage(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }
}
