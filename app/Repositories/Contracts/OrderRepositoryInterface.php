<?php

namespace App\Repositories\Contracts;

use App\DTO\OrderDTO;
use App\DTO\PaginationDTO;
use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface OrderRepositoryInterface
{
    public function paginate(PaginationDTO $pagination, array $filters = []): LengthAwarePaginator;

    public function findById(int $id): ?Order;

    public function findByCustomerIdentifier(string $customerIdentifier): Collection;

    public function create(OrderDTO $dto): Order;

    public function update(int $id, OrderDTO $dto): Order;

    public function updateStatus(int $id, string $status): Order;

    public function delete(int $id): bool;

    public function syncItems(Order $order, array $items): Order;
}
