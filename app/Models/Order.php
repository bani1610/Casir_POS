<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_method_id',
        'table_number',
        'customer_identifier',
        'status',
        'total_price',
        'notes',
        'paid_at',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'paid_at'     => 'datetime',
        'status'      => 'string',
    ];

    /**
     * Status yang tersedia untuk order.
     */
    const STATUS_PENDING    = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_DONE       = 'done';
    const STATUS_CANCELLED  = 'cancelled';

    const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_PROCESSING,
        self::STATUS_DONE,
        self::STATUS_CANCELLED,
    ];

    // ─── Relasi ──────────────────────────────────────────────────

    /**
     * Order dibuat oleh seorang user (karyawan/admin).
     * Nullable untuk self-order pembeli.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Order menggunakan satu metode pembayaran.
     */
    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    /**
     * Satu order memiliki banyak item.
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // ─── Scopes ──────────────────────────────────────────────────

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', [self::STATUS_PENDING, self::STATUS_PROCESSING]);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    // ─── Helpers ─────────────────────────────────────────────────

    /**
     * Cek apakah order milik self-order pembeli (bukan karyawan).
     */
    public function isSelfOrder(): bool
    {
        return is_null($this->user_id) && ! is_null($this->customer_identifier);
    }

    /**
     * Recalculate dan simpan total_price dari order items.
     */
    public function recalculateTotal(): void
    {
        $this->total_price = $this->orderItems()->sum('subtotal');
        $this->save();
    }
}
