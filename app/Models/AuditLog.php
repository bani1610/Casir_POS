<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasFactory;

    /**
     * Tidak ada updated_at pada audit log — immutable record.
     */
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'event',
        'auditable_type',
        'auditable_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Event yang tersedia.
     */
    const EVENT_LOGIN    = 'login';
    const EVENT_LOGOUT   = 'logout';
    const EVENT_CREATED  = 'created';
    const EVENT_UPDATED  = 'updated';
    const EVENT_DELETED  = 'deleted';
    const EVENT_EXPORTED = 'exported';

    // ─── Relasi ──────────────────────────────────────────────────

    /**
     * Log ini dibuat oleh seorang user.
     * Nullable jika aksi dilakukan oleh sistem.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    // ─── Scopes ──────────────────────────────────────────────────

    public function scopeForModel($query, string $modelClass)
    {
        return $query->where('auditable_type', $modelClass);
    }

    public function scopeEvent($query, string $event)
    {
        return $query->where('event', $event);
    }

    // ─── Static Helpers ──────────────────────────────────────────

    /**
     * Buat audit log dengan mudah.
     *
     * @param  string       $event     Nama event (login, created, dll.)
     * @param  Model|null   $model     Model yang diubah (jika ada)
     * @param  array        $oldValues Data sebelum perubahan
     * @param  array        $newValues Data setelah perubahan
     */
    public static function record(
        string $event,
        ?Model $model = null,
        array $oldValues = [],
        array $newValues = []
    ): static {
        return static::create([
            'user_id'        => auth()->id(),
            'event'          => $event,
            'auditable_type' => $model ? get_class($model) : null,
            'auditable_id'   => $model?->getKey(),
            'old_values'     => $oldValues ?: null,
            'new_values'     => $newValues ?: null,
            'ip_address'     => request()->ip(),
            'user_agent'     => request()->userAgent(),
            'created_at'     => now(),
        ]);
    }
}
