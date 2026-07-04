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
     * - user_id (FK) → siapa yang membuat order (karyawan/admin)
     * - payment_method_id (FK) → normalisasi metode pembayaran
     * - total_price disimpan sebagai snapshot harga saat transaksi,
     *   bukan computed dari order_items (historical accuracy)
     * - table_number berdiri sendiri sebagai atribut order, bukan FK
     *   karena meja tidak perlu entitas tersendiri di scope MVP
     * - status hanya bergantung pada order (PK), tidak ada transitive dep.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->nullable() // null jika self-order oleh pembeli
                  ->constrained('users')
                  ->nullOnDelete();
            $table->foreignId('payment_method_id')
                  ->nullable() // null saat pending, diisi saat checkout
                  ->constrained('payment_methods')
                  ->restrictOnDelete();
            $table->string('table_number', 20)->nullable();
            $table->string('customer_identifier', 64)->nullable()
                  ->comment('Device fingerprint untuk self-order pembeli (24 jam)');
            $table->enum('status', ['pending', 'processing', 'done', 'cancelled'])
                  ->default('pending');
            $table->decimal('total_price', 12, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
