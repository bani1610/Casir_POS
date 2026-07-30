<?php

namespace App\Repositories;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Collection;

class MenuRepository
{
    public function all(): Collection
    {
        return Menu::with('category')->orderBy('name')->get();
    }

    public function findById(int $id): ?Menu
    {
        return Menu::with('category')->find($id);
    }

    public function create(array $data): Menu
    {
        return Menu::create($data);
    }

    public function update(Menu $menu, array $data): bool
    {
        return $menu->update($data);
    }

    public function delete(Menu $menu): ?bool
    {
        return $menu->delete();
    }

    public function getByCategory(int $categoryId): Collection
    {
        return Menu::where('category_id', $categoryId)
            ->orderBy('name')
            ->get();
    }

    public function getAvailable(): Collection
    {
        return Menu::with('category')
            ->where('is_available', true)
            ->orderBy('name')
            ->get();
    }
}
