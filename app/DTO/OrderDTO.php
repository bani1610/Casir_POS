<?php

namespace App\DTO;

class OrderDTO
{
    /**
     * @param int|null $id
     * @param int|null $userId User yang membuat order (karyawan/admin). Null untuk self-order pembeli.
     * @param int|null $paymentMethodId Metode pembayaran. Nullable saat pending.
     * @param string|null $tableNumber Nomor meja (untuk dine-in). Nullable untuk self-order.
     * @param string|null $customerIdentifier Device fingerprint untuk self-order pembeli (24 jam session).
     * @param string $status pending|processing|done|cancelled
     * @param float $totalPrice Total harga order.
     * @param string|null $notes Catatan order.
     * @param array $items Array of OrderItemDTO untuk order items.
     */
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?int $userId = null,
        public readonly ?int $paymentMethodId = null,
        public readonly ?string $tableNumber = null,
        public readonly ?string $customerIdentifier = null,
        public readonly string $status = 'pending',
        public readonly float $totalPrice = 0,
        public readonly ?string $notes = null,
        public readonly array $items = [],
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id:                 $data['id'] ?? null,
            userId:             $data['user_id'] ?? null,
            paymentMethodId:    $data['payment_method_id'] ?? null,
            tableNumber:        $data['table_number'] ?? null,
            customerIdentifier: $data['customer_identifier'] ?? null,
            status:             $data['status'] ?? 'pending',
            totalPrice:         (float) ($data['total_price'] ?? 0),
            notes:              $data['notes'] ?? null,
            items:              $data['items'] ?? [],
        );
    }

    public static function fromRequest(\Illuminate\Http\Request $request): self
    {
        return self::fromArray($request->validated());
    }

    public function toArray(): array
    {
        return [
            'id'                  => $this->id,
            'user_id'             => $this->userId,
            'payment_method_id'   => $this->paymentMethodId,
            'table_number'        => $this->tableNumber,
            'customer_identifier' => $this->customerIdentifier,
            'status'              => $this->status,
            'total_price'         => $this->totalPrice,
            'notes'               => $this->notes,
            'items'               => $this->items,
        ];
    }
}
