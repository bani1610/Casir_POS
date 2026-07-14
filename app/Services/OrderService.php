<?php

namespace App\Services;

use App\DTO\OrderDTO;
use App\DTO\OrderItemDTO;
use App\DTO\PaginationDTO;
use App\Models\Menu;
use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(
        protected OrderRepositoryInterface $repository
    ) {}

    public function getPaginated(
        PaginationDTO $pagination,
        array $filters = []
    ): LengthAwarePaginator {
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

    /**
     * Self-order pembeli: temukan order berdasarkan customer_identifier (24 jam).
     */
    public function getByCustomerIdentifier(string $customerIdentifier): Collection
    {
        return $this->repository->findByCustomerIdentifier($customerIdentifier);
    }

    /**
     * Buat order baru (oleh karyawan/admin).
     * Harga & subtotal diambil langsung dari data Menu (snapshot).
     */
    public function create(OrderDTO $dto): Order
    {
        $items      = $this->resolveItems($dto->items);
        $totalPrice = collect($items)->sum('subtotal');

        $dto = new OrderDTO(
            id:                 $dto->id,
            userId:             $dto->userId,
            paymentMethodId:    $dto->paymentMethodId,
            tableNumber:        $dto->tableNumber,
            customerIdentifier: $dto->customerIdentifier,
            status:             $dto->status ?? Order::STATUS_PENDING,
            totalPrice:         $totalPrice,
            notes:              $dto->notes,
            items:              $items,
        );

        return $this->repository->create($dto);
    }

    /**
     * Update order yang sudah ada.
     * Recalculate total dari items baru.
     */
    public function update(int $id, OrderDTO $dto): Order
    {
        $this->getById($id);

        $items      = $this->resolveItems($dto->items);
        $totalPrice = collect($items)->sum('subtotal');

        $dto = new OrderDTO(
            id:                 $id,
            userId:             $dto->userId,
            paymentMethodId:    $dto->paymentMethodId,
            tableNumber:        $dto->tableNumber,
            customerIdentifier: $dto->customerIdentifier,
            status:             $dto->status,
            totalPrice:         $totalPrice,
            notes:              $dto->notes,
            items:              $items,
        );

        return $this->repository->update($id, $dto);
    }

    /**
     * Update status order. Validasi transisi status yang diizinkan.
     */
    public function updateStatus(int $id, string $status): Order
    {
        $order = $this->getById($id);

        $this->validateStatusTransition($order->status, $status);

        return $this->repository->updateStatus($id, $status);
    }

    public function delete(int $id): bool
    {
        $order = $this->getById($id);

        // Hanya order dengan status pending atau cancelled yang boleh dihapus
        if (! in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_CANCELLED])) {
            throw ValidationException::withMessages([
                'order' => "Order dengan status '{$order->status}' tidak bisa dihapus.",
            ]);
        }

        return $this->repository->delete($id);
    }

    /**
     * Buat order dari self-order pembeli (tanpa user_id, pakai customer_identifier).
     */
    public function createSelfOrder(OrderDTO $dto): Order
    {
        if (empty($dto->customerIdentifier)) {
            throw ValidationException::withMessages([
                'customer_identifier' => 'Identitas pembeli diperlukan untuk self-order.',
            ]);
        }

        return $this->create($dto);
    }

    // ─── Private Helpers ─────────────────────────────────────────────────

    /**
     * Resolve items dari request: ambil snapshot harga dari Menu,
     * merge item dengan menu_id yang sama, hitung subtotal.
     * Hanya menu yang is_available=true yang diizinkan.
     */
    protected function resolveItems(array $rawItems): array
    {
        if (empty($rawItems)) {
            throw ValidationException::withMessages([
                'items' => 'Minimal satu item menu wajib dipilih.',
            ]);
        }

        // Merge item dengan menu_id yang sama sebelum query ke DB
        $merged = collect($rawItems)
            ->groupBy('menu_id')
            ->map(fn ($group, $menuId) => [
                'menu_id'  => (int) $menuId,
                'quantity' => $group->sum('quantity'),
            ])
            ->values()
            ->all();

        $menuIds = array_column($merged, 'menu_id');

        // Ambil semua menu dalam satu query (only available)
        $menus = Menu::available()->whereIn('id', $menuIds)->get()->keyBy('id');

        if (count($menus) !== count(array_unique($menuIds))) {
            throw ValidationException::withMessages([
                'items' => 'Ada menu yang tidak tersedia atau tidak ditemukan.',
            ]);
        }

        return collect($merged)->map(function ($item) use ($menus) {
            $menu         = $menus[$item['menu_id']];
            $quantity     = (int) $item['quantity'];
            $priceAtOrder = (float) $menu->price;
            $subtotal     = $quantity * $priceAtOrder;

            return (new OrderItemDTO(
                menuId:       $menu->id,
                menuName:     $menu->name,
                quantity:     $quantity,
                priceAtOrder: $priceAtOrder,
                subtotal:     $subtotal,
            ))->toArray();
        })->all();
    }

    /**
     * Validasi transisi status order.
     * pending → processing → done | cancelled
     */
    protected function validateStatusTransition(string $current, string $next): void
    {
        $allowed = [
            Order::STATUS_PENDING    => [Order::STATUS_PROCESSING, Order::STATUS_CANCELLED],
            Order::STATUS_PROCESSING => [Order::STATUS_DONE, Order::STATUS_CANCELLED],
            Order::STATUS_DONE       => [],
            Order::STATUS_CANCELLED  => [],
        ];

        if (! in_array($next, $allowed[$current] ?? [])) {
            throw ValidationException::withMessages([
                'status' => "Transisi status dari '{$current}' ke '{$next}' tidak diizinkan.",
            ]);
        }
    }
}
