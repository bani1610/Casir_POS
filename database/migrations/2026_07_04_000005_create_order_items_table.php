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
     * - PK: id (surrogate key)
     * - Kandidat key: (order_id, menu_id) — composite unique key
     * - price_at_order: snapshot harga menu saat order dibuat.
     *   Diperlukan karena menu.price bisa berubah di masa depan.
     *   Ini BUKAN redundansi, melainkan historical data yang valid.
     * - subtotal: disimpan untuk performa query laporan.
     *   subtotal = quantity * price_at_order (bukan transitive dep,
     *   karena price_at_order adalah snapshot, bukan derived dari menus).
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')
                  ->constrained('orders')
                  ->cascadeOnDelete();
            $table->foreignId('menu_id')
                  ->constrained('menus')
                  ->restrictOnDelete();
            $table->string('menu_name')
                  ->comment('Snapshot nama menu saat order, antisipasi perubahan nama');
            $table->unsignedInteger('quantity');
            $table->decimal('price_at_order', 12, 2)
                  ->comment('Snapshot harga menu saat transaksi terjadi');
            $table->decimal('subtotal', 12, 2)
                  ->comment('quantity * price_at_order, disimpan untuk performa laporan');
            $table->timestamps();

            // Satu menu hanya bisa muncul sekali dalam satu order
            $table->unique(['order_id', 'menu_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
