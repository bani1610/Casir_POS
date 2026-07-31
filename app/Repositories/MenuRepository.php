<?php

namespace App\Repositories;

use App\Models\Menu;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MenuRepository
{
    public function all(): Collection
    {
        return Menu::with('category')->orderBy('name')->get();
    }

    /**
     * Paginated + filter list for admin panel
     *
     * @param array $filters  Keys: search, category_id, is_available
     * @param int   $perPage
     */
    public function paginate(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Menu::with('category');

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (isset($filters['category_id']) && $filters['category_id'] !== '') {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['is_available']) && $filters['is_available'] !== '') {
            $query->where('is_available', (bool) $filters['is_available']);
        }

        return $query->orderBy('name')->paginate($perPage);
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

    public function toggleAvailable(Menu $menu): bool
    {
        return $menu->update(['is_available' => !$menu->is_available]);
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
