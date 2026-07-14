<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ─── Relasi ──────────────────────────────────────────────────

    /**
     * Satu metode pembayaran digunakan di banyak order.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    // ─── Scopes ──────────────────────────────────────────────────

    /**
     * Hanya metode pembayaran yang aktif.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
