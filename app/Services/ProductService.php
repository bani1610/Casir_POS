<?php

namespace App\Services;

use App\DTO\PaginationDTO;
use App\DTO\ProductDTO;
use App\Exceptions\InsufficientStockException;
use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class ProductService
{
    public function __construct(
        protected ProductRepositoryInterface $repository
    ) {}

    public function getPaginated(PaginationDTO $pagination): LengthAwarePaginator
    {
        return $this->repository->paginate($pagination);
    }

    public function getById(int $id): Product
    {
        $product = $this->repository->findById($id);

        if (! $product) {
            throw ValidationException::withMessages([
                'product' => 'Produk tidak ditemukan.',
            ]);
        }

        return $product;
    }

    public function create(ProductDTO $dto): Product
    {
        $existing = $this->repository->findBySku($dto->sku);

        if ($existing) {
            throw ValidationException::withMessages([
                'sku' => 'SKU sudah digunakan produk lain.',
            ]);
        }

        return $this->repository->create($dto);
    }

    public function update(int $id, ProductDTO $dto): Product
    {
        $this->getById($id); // pastikan ada, throw kalau gak ketemu

        return $this->repository->update($id, $dto);
    }

    public function delete(int $id): bool
    {
        $this->getById($id);

        return $this->repository->delete($id);
    }

    public function reduceStockForSale(int $id, int $qty): void
    {
        $product = $this->getById($id);

        if ($product->stock < $qty) {
            throw new InsufficientStockException(
                "Stok {$product->name} tidak cukup. Sisa: {$product->stock}"
            );
        }

        $this->repository->decrementStock($id, $qty);
    }
}