<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'menu_id' => $this->menu_id,
            'menu_name' => $this->menu_name,
            'quantity' => $this->quantity,
            'price_at_order' => (float) $this->price_at_order,
            'subtotal' => (float) $this->subtotal,
            'menu' => $this->whenLoaded('menu', function () {
                return [
                    'id' => $this->menu->id,
                    'name' => $this->menu->name,
                    'category_id' => $this->menu->category_id,
                    'image' => $this->menu->image_url,
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
