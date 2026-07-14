<?php

namespace App\Repositories;

use App\DTO\OrderDTO;
use App\DTO\PaginationDTO;
use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class OrderRepository implements OrderRepositoryInterface
{
    public function __construct(protected Order $model)
    {
    }

    public function paginate(
        PaginationDTO $pagination,
        array
        $filters = []
    ): LengthAwarePaginator {
        return $this->model->newQuery()
            ->with([
                'user',
                'paymentMethod',
                'orderItems.menu'
            ])
            ->when($pagination->search, function ($query, $search) {
                $query->where(function ($searchQuery) use ($search) {
                    $searchQuery->where(
                        'table_number',
                        'like',
                        "%{$search}%"
                    )
                        ->orWhere(
                            'customer_identifier',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where(
                                'name',
                                'like',
                                "%{$search}%"
                            );
                        });
                });
            })
            ->when($filters['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($filters['user_id'] ?? null, function ($query, $userId) {
                $query->where('user_id', $userId);
            })
            ->when(
                $filters['payment_method_id'] ?? null,
                function ($query, $paymentMethodId) {
                    $query->where(
                        'payment_method_id',
                        $paymentMethodId
                    );
                }
            )
            ->when($filters['date'] ?? null, function ($query, $date) {
                $query->whereDate('created_at', $date);
            })
            ->when($filters['from_date'] ?? null, function ($query, $fromDate) {
                $query->whereDate(
                    'created_at',
                    '>=',
                    $fromDate
                );
            })
            ->when($filters['to_date'] ?? null, function ($query, $toDate) {
                $query->whereDate(
                    'created_at',
                    '<=',
                    $toDate
                );
            })
            ->orderBy(
                $pagination->sortBy,
                $pagination->sortDirection
            )
            ->paginate(
                $pagination->perPage,
                ['*'],
                'page',
                $pagination->page
            );
    }

    public function findById(int $id): ?Order
    {
        return $this->model->with([
            'user',
            'paymentMethod',
            'orderItems.menu'
        ])->find($id);
    }

    public function findByCustomerIdentifier(
        string
        $customerIdentifier
    ): Collection {
        return $this->model->newQuery()
            ->with(['paymentMethod', 'orderItems.menu'])
            ->where(
                'customer_identifier',
                $customerIdentifier
            )
            ->where('created_at', '>=', now()->subHours(24))
            ->latest()
            ->get();
    }

    public function create(OrderDTO $dto): Order
    {
        $order = $this->model->create($this->orderData($dto));

        if ($dto->items !== []) {
            $this->syncItems($order, $dto->items);
        }

        return $order->fresh([
            'user',
            'paymentMethod',
            'orderItems.menu'
        ]);
    }

    public function update(int $id, OrderDTO $dto): Order
    {
        $order = $this->model->findOrFail($id);
        $order->update($this->orderData($dto));

        if ($dto->items !== []) {
            $this->syncItems($order, $dto->items);
        }

        return $order->fresh([
            'user',
            'paymentMethod',
            'orderItems.menu'
        ]);
    }

    public function updateStatus(
        int $id,
        string $status
    ): Order {
        $order = $this->model->findOrFail($id);
        $order->update([
            'status' => $status,
            'paid_at' => $status === Order::STATUS_DONE &&
                is_null($order->paid_at)
                ? now()
                : $order->paid_at,
        ]);

        return $order->fresh([
            'user',
            'paymentMethod',
            'orderItems.menu'
        ]);
    }

    public function delete(int $id): bool
    {
        $order = $this->model->findOrFail($id);

        return $order->delete();
    }

    public function syncItems(
        Order $order,
        array $items
    ): Order {
        $order->orderItems()->delete();

        foreach ($items as $item) {
            $order->orderItems()->create($item);
        }

        $order->recalculateTotal();

        return $order->fresh([
            'user',
            'paymentMethod',
            'orderItems.menu'
        ]);
    }

    protected function orderData(OrderDTO $dto): array
    {
        return [
            'user_id' => $dto->userId,
            'payment_method_id' => $dto->paymentMethodId,
            'table_number' => $dto->tableNumber,
            'customer_identifier' => $dto->customerIdentifier,
            'status' => $dto->status,
            'total_price' => $dto->totalPrice,
            'notes' => $dto->notes,
        ];
    }
}