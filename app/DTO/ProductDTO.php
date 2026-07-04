<?php

namespace App\DTO;

class ProductDTO
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly string $sku,
        public readonly float $price,
        public readonly int $stock,
        public readonly ?int $categoryId = null,
        public readonly ?string $description = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'] ?? null,
            name: $data['name'],
            sku: $data['sku'],
            price: (float) $data['price'],
            stock: (int) $data['stock'],
            categoryId: $data['category_id'] ?? null,
            description: $data['description'] ?? null,
        );
    }

    public static function fromRequest(\Illuminate\Http\Request $request): self
    {
        return self::fromArray($request->validated());
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'price' => $this->price,
            'stock' => $this->stock,
            'category_id' => $this->categoryId,
            'description' => $this->description,
        ];
    }
}