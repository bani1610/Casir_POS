<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed default admin account dan beberapa karyawan dummy.
     */
    public function run(): void
    {
        // Admin utama
        User::firstOrCreate(
            ['email' => 'admin@casir.id'],
            [
                'name'      => 'Administrator',
                'password'  => Hash::make('password'),
                'role'      => 'admin',
                'is_active' => true,
            ]
        );

        // Karyawan dummy untuk development
        $karyawan = [
            ['name' => 'Budi Santoso',  'email' => 'budi@casir.id'],
            ['name' => 'Sari Dewi',     'email' => 'sari@casir.id'],
            ['name' => 'Rizky Pratama', 'email' => 'rizky@casir.id'],
        ];

        foreach ($karyawan as $k) {
            User::firstOrCreate(
                ['email' => $k['email']],
                [
                    'name'      => $k['name'],
                    'password'  => Hash::make('password'),
                    'role'      => 'karyawan',
                    'is_active' => true,
                ]
            );
        }
    }
}
