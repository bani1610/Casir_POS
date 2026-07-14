<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'menu_id',
        'menu_name',
        'quantity',
        'price_at_order',
        'subtotal',
    ];

    protected $casts = [
        'quantity'       => 'integer',
        'price_at_order' => 'decimal:2',
        'subtotal'       => 'decimal:2',
    ];

    // ─── Relasi ──────────────────────────────────────────────────

    /**
     * Item ini milik satu order.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Item ini merujuk ke satu menu.
     * Menggunakan withTrashed agar item tetap bisa diakses
     * meski menu sudah di-soft delete.
     */
    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class)->withTrashed();
    }

    // ─── Helpers ─────────────────────────────────────────────────

    /**
     * Hitung ulang subtotal berdasarkan quantity dan price_at_order.
     */
    public function calculateSubtotal(): static
    {
        $this->subtotal = $this->quantity * $this->price_at_order;

        return $this;
    }
}
