<?php

namespace App\Repositories\Contracts;

use App\DTO\PaginationDTO;
use App\DTO\ProductDTO;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    public function paginate(PaginationDTO $pagination): LengthAwarePaginator;

    public function findById(int $id): ?Product;

    public function findBySku(string $sku): ?Product;

    public function create(ProductDTO $dto): Product;

    public function update(int $id, ProductDTO $dto): Product;

    public function delete(int $id): bool;

    public function decrementStock(int $id, int $qty): bool;
}