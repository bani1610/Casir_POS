<?php

namespace App\Repositories;

use App\DTO\PaginationDTO;
use App\DTO\ProductDTO;
use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductRepository implements ProductRepositoryInterface
{
    public function __construct(protected Product $model) {}

    public function paginate(PaginationDTO $pagination): LengthAwarePaginator
    {
        return $this->model->newQuery()
            ->when($pagination->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            })
            ->orderBy($pagination->sortBy, $pagination->sortDirection)
            ->paginate($pagination->perPage, ['*'], 'page', $pagination->page);
    }

    public function findById(int $id): ?Product
    {
        return $this->model->find($id);
    }

    public function findBySku(string $sku): ?Product
    {
        return $this->model->where('sku', $sku)->first();
    }

    public function create(ProductDTO $dto): Product
    {
        return $this->model->create($dto->toArray());
    }

    public function update(int $id, ProductDTO $dto): Product
    {
        $product = $this->model->findOrFail($id);
        $product->update($dto->toArray());

        return $product->fresh();
    }

    public function delete(int $id): bool
    {
        $product = $this->model->findOrFail($id);

        return $product->delete();
    }

    public function decrementStock(int $id, int $qty): bool
    {
        return $this->model->where('id', $id)
            ->where('stock', '>=', $qty)
            ->decrement('stock', $qty) > 0;
    }
}