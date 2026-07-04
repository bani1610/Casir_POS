<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * 3NF:
     * - Menggunakan polymorphic relation (auditable_type + auditable_id)
     *   agar satu tabel bisa mencatat log untuk semua entitas.
     * - old_values dan new_values disimpan sebagai JSON (satu kolom per
     *   atribut tidak praktis dan melanggar atomicity untuk data dinamis).
     * - Setiap kolom bergantung hanya pada PK, tidak ada transitive dep.
     */
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->nullable() // null jika aksi sistem/otomatis
                  ->constrained('users')
                  ->nullOnDelete();
            $table->string('event', 50)
                  ->comment('login, logout, created, updated, deleted, exported');
            $table->string('auditable_type')->nullable()
                  ->comment('Nama model yang diubah, misal App\Models\Menu');
            $table->unsignedBigInteger('auditable_id')->nullable()
                  ->comment('ID record yang diubah');
            $table->json('old_values')->nullable()
                  ->comment('Data sebelum perubahan');
            $table->json('new_values')->nullable()
                  ->comment('Data setelah perubahan');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();

            // Index untuk mempercepat query filter log
            $table->index(['auditable_type', 'auditable_id']);
            $table->index('event');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
