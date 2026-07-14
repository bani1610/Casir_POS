<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'order_id'       => $this->order_id,
            'menu_id'        => $this->menu_id,
            'menu_name'      => $this->menu_name,
            'quantity'       => $this->quantity,
            'price_at_order' => (float) $this->price_at_order,
            'subtotal'       => (float) $this->subtotal,

            // Relasi menu (jika di-load), tampilkan info tambahan
            'menu' => $this->whenLoaded('menu', fn () => $this->menu ? [
                'id'          => $this->menu->id,
                'name'        => $this->menu->name,
                'category_id' => $this->menu->category_id,
                'image_url'   => $this->menu->image_url,
                'is_available'=> $this->menu->is_available,
            ] : null),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
