<?php

namespace App\DTO;

class OrderItemDTO
{
    /**
     * @param int|null $id
     * @param int $menuId 
     * @param string $menuName 
     * @param int $quantity 
     * @param float $priceAtOrder 
     * @param float $subtotal 
     */
    public function __construct(
        public readonly ?int $id = null,
        public readonly int $menuId = 0,
        public readonly string $menuName = '',
        public readonly int $quantity = 1,
        public readonly float $priceAtOrder = 0,
        public readonly float $subtotal = 0,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'] ?? null,
            menuId: (int) ($data['menu_id'] ?? 0),
            menuName: $data['menu_name'] ?? '',
            quantity: (int) ($data['quantity'] ?? 1),
            priceAtOrder: (float) ($data['price_at_order'] ?? 0),
            subtotal: (float) ($data['subtotal'] ?? 0),
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'menu_id' => $this->menuId,
            'menu_name' => $this->menuName,
            'quantity' => $this->quantity,
            'price_at_order' => $this->priceAtOrder,
            'subtotal' => $this->subtotal,
        ];
    }

    /**
     * Hitung subtotal berdasarkan quantity dan priceAtOrder.
     */
    public function calculateSubtotal(): float
    {
        return $this->quantity * $this->priceAtOrder;
    }
}
