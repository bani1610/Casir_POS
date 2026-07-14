<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'status'      => $this->status,
            'total_price' => (float) $this->total_price,
            'table_number'         => $this->table_number,
            'customer_identifier'  => $this->customer_identifier,
            'notes'       => $this->notes,
            'is_self_order' => $this->isSelfOrder(),
            'paid_at'     => $this->paid_at?->toISOString(),

            // ─── Relasi User (karyawan/admin yang membuat) ────────────
            'user' => $this->whenLoaded('user', fn () => [
                'id'   => $this->user->id,
                'name' => $this->user->name,
                'role' => $this->user->role,
            ]),

            // ─── Relasi Payment Method ────────────────────────────────
            'payment_method' => $this->whenLoaded('paymentMethod', fn () => [
                'id'   => $this->paymentMethod->id,
                'name' => $this->paymentMethod->name,
                'type' => $this->paymentMethod->type,
            ]),

            // ─── Order Items ──────────────────────────────────────────
            'items' => OrderItemResource::collection(
                $this->whenLoaded('orderItems')
            ),
            'items_count' => $this->whenCounted('orderItems'),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
