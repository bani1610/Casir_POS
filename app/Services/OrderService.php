<?php

namespace App\Services;

use App\DTO\OrderDTO;
use App\DTO\PaginationDTO;
use App\Models\Menu;
use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(protected OrderRepositoryInterface $repository) {}

    public function getPaginated(PaginationDTO $pagination, array $filters = []): LengthAwarePaginator
    {
        return $this->repository->paginate($pagination, $filters);
    }

    public function getById(int $id): Order
    {
        $order = $this->repository->findById($id);

        if (! $order) {
            throw ValidationException::withMessages([
                'order' => 'Order tidak ditemukan.',
            ]);
        }

        return $order;
    }

    public function getSelfOrdersByCustomerIdentifier(string $customerIdentifier): Collection
    {
        return $this->repository->findByCustomerIdentifier($customerIdentifier);
    }

    public function create(OrderDTO $dto): Order
    {
        $calculatedItems = $this->validateAndCalculateItems($dto->items);
        $totalPrice = collect($calculatedItems)->sum('subtotal');

        $orderData = new OrderDTO(
            userId: $dto->userId,
            paymentMethodId: $dto->paymentMethodId,
            tableNumber: $dto->tableNumber,
            customerIdentifier: $dto->customerIdentifier,
            status: $dto->status ?? Order::STATUS_PENDING,
            totalPrice: $totalPrice,
            notes: $dto->notes,
            items: $calculatedItems,
        );

        return $this->repository->create($orderData);
    }

    public function update(int $id, OrderDTO $dto): Order
    {
        $this->getById($id);

        $calculatedItems = $this->validateAndCalculateItems($dto->items);
        $totalPrice = collect($calculatedItems)->sum('subtotal');

        $orderData = new OrderDTO(
            id: $id,
            userId: $dto->userId,
            paymentMethodId: $dto->paymentMethodId,
            tableNumber: $dto->tableNumber,
            customerIdentifier: $dto->customerIdentifier,
            status: $dto->status,
            totalPrice: $totalPrice,
            notes: $dto->notes,
            items: $calculatedItems,
        );

        return $this->repository->update($id, $orderData);
    }

    public function updateStatus(int $id, string $status): Order
    {
        $order = $this->getById($id);

        if (! in_array($status, Order::STATUSES)) {
            throw ValidationException::withMessages([
                'status' => "Status '{$status}' tidak valid.",
            ]);
        }

        if (in_array($order->status, [Order::STATUS_DONE, Order::STATUS_CANCELLED])) {
            throw ValidationException::withMessages([
                'status' => "Order dengan status '{$order->status}' tidak bisa diubah.",
            ]);
        }

        return $this->repository->updateStatus($id, $status);
    }

    public function delete(int $id): bool
    {
        $order = $this->getById($id);

        if ($order->status === Order::STATUS_PROCESSING) {
            throw ValidationException::withMessages([
                'order' => 'Order yang sedang diproses tidak bisa dihapus.',
            ]);
        }

        return $this->repository->delete($id);
    }

    protected function validateAndCalculateItems(array $items): array
    {
        if (empty($items)) {
            throw ValidationException::withMessages([
                'items' => 'Minimal satu item menu wajib dipilih.',
            ]);
        }

        $calculatedItems = [];
        $mergedItems = collect($items)
            ->groupBy('menu_id')
            ->map(function ($group, $menuId) {
                return [
                    'menu_id' => (int) $menuId,
                    'quantity' => $group->sum('quantity'),
                ];
            })
            ->values()
            ->all();

        $menuIds = array_column($mergedItems, 'menu_id');
        $menus = Menu::available()->whereIn('id', $menuIds)->get()->keyBy('id');

        if (count($menus) !== count(array_unique($menuIds))) {
            throw ValidationException::withMessages([
                'items' => 'Ada menu yang tidak tersedia atau tidak ditemukan.',
            ]);
        }

        foreach ($mergedItems as $item) {
            $menuId = $item['menu_id'];
            $quantity = $item['quantity'];

            if ($quantity < 1) {
                throw ValidationException::withMessages([
                    'items' => 'Jumlah item minimal harus 1.',
                ]);
            }

            $menu = $menus[$menuId];

            $calculatedItems[] = [
                'menu_id' => $menuId,
                'menu_name' => $menu->name,
                'quantity' => $quantity,
                'price_at_order' => $menu->price,
                'subtotal' => $quantity * $menu->price,
            ];
        }

        return $calculatedItems;
    }
}
