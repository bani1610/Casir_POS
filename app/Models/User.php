<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// HasApiTokens akan ditambahkan di Phase 3 setelah laravel/sanctum di-install

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Role yang tersedia.
     */
    const ROLE_ADMIN    = 'admin';
    const ROLE_KARYAWAN = 'karyawan';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
        ];
    }

    // ─── Relasi ──────────────────────────────────────────────────

    /**
     * Order yang dibuat oleh user ini (sebagai karyawan/admin).
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Semua audit log yang dicatat atas aksi user ini.
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    // ─── Helpers ─────────────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isKaryawan(): bool
    {
        return $this->role === self::ROLE_KARYAWAN;
    }

    public function isActive(): bool
    {
        return $this->is_active === true;
    }

    // ─── Scopes ──────────────────────────────────────────────────

    public function scopeAdmin($query)
    {
        return $query->where('role', self::ROLE_ADMIN);
    }

    public function scopeKaryawan($query)
    {
        return $query->where('role', self::ROLE_KARYAWAN);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
