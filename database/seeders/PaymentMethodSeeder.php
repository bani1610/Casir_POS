<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Seed default payment methods: Cash, QRIS, Transfer.
     */
    public function run(): void
    {
        $methods = [
            [
                'name'        => 'Cash',
                'description' => 'Pembayaran tunai langsung di kasir',
                'is_active'   => true,
            ],
            [
                'name'        => 'QRIS',
                'description' => 'Pembayaran via QR Code (GoPay, OVO, Dana, dll.)',
                'is_active'   => true,
            ],
            [
                'name'        => 'Transfer Bank',
                'description' => 'Transfer via rekening bank (BCA, Mandiri, BNI, BRI)',
                'is_active'   => true,
            ],
        ];

        foreach ($methods as $method) {
            PaymentMethod::firstOrCreate(
                ['name' => $method['name']],
                $method
            );
        }
    }
}
