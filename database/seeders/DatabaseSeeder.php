<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Urutan penting karena ada foreign key constraint:
     * 1. PaymentMethodSeeder  → tidak bergantung pada tabel lain
     * 2. UserSeeder           → tidak bergantung pada tabel lain
     * 3. CategorySeeder       → tidak bergantung pada tabel lain
     * 4. MenuSeeder           → bergantung pada categories
     */
    public function run(): void
    {
        $this->call([
            PaymentMethodSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            MenuSeeder::class,
        ]);
    }
}
