<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'user_id' => $this->user_id,
            'payment_method_id' => $this->payment_method_id,
            'table_number' => $this->table_number,
            'customer_identifier' => $this->customer_identifier,
            'status' => $this->status,
            'total_price' => (float) $this->total_price,
            'notes' => $this->notes,
            'paid_at' => $this->paid_at?->toISOString(),
            'is_self_order' => $this->isSelfOrder(),
            'user' => $this->whenLoaded('user', function () {
                return $this->user ? [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'role' => $this->user->role,
                ] : null;
            }),
            'payment_method' => $this->whenLoaded('paymentMethod', function () {
                return $this->paymentMethod ? [
                    'id' => $this->paymentMethod->id,
                    'name' => $this->paymentMethod->name,
                    'description' => $this->paymentMethod->description,
                ] : null;
            }),
            'items' => OrderItemResource::collection($this->whenLoaded('orderItems')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
