<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Menu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MenuSeeder extends Seeder
{
    /**
     * Seed menu-menu realistis per kategori.
     */
    public function run(): void
    {
        $menus = [
            // Makanan
            'Makanan' => [
                ['name' => 'Nasi Goreng Spesial',    'price' => 25000, 'description' => 'Nasi goreng dengan telur, ayam, dan sayuran pilihan'],
                ['name' => 'Mie Goreng Seafood',     'price' => 28000, 'description' => 'Mie goreng dengan udang, cumi, dan bumbu rempah khas'],
                ['name' => 'Ayam Bakar Kecap',       'price' => 30000, 'description' => 'Ayam bakar dengan marinasi kecap manis dan rempah pilihan'],
                ['name' => 'Soto Ayam',              'price' => 20000, 'description' => 'Soto ayam kuah bening dengan lontong dan tauge'],
                ['name' => 'Gado-Gado',              'price' => 18000, 'description' => 'Sayuran segar dengan saus kacang dan kerupuk'],
                ['name' => 'Rendang Sapi',           'price' => 35000, 'description' => 'Daging sapi empuk dengan bumbu rendang khas Minang'],
                ['name' => 'Bakso Spesial',          'price' => 22000, 'description' => 'Bakso sapi kenyal dengan kuah kaldu gurih'],
                ['name' => 'Nasi Uduk Komplit',      'price' => 27000, 'description' => 'Nasi uduk dengan ayam goreng, tempe orek, dan sambal'],
            ],

            // Minuman
            'Minuman' => [
                ['name' => 'Es Teh Manis',           'price' => 8000,  'description' => 'Teh manis segar dengan es batu'],
                ['name' => 'Es Jeruk',               'price' => 10000, 'description' => 'Perasan jeruk segar dengan es batu'],
                ['name' => 'Kopi Hitam',             'price' => 12000, 'description' => 'Kopi robusta pilihan diseduh panas'],
                ['name' => 'Es Kopi Susu',           'price' => 18000, 'description' => 'Kopi dengan susu segar dan es batu'],
                ['name' => 'Jus Alpukat',            'price' => 20000, 'description' => 'Jus alpukat segar dengan susu kental manis'],
                ['name' => 'Es Cincau',              'price' => 10000, 'description' => 'Cincau hitam dengan santan dan gula merah'],
                ['name' => 'Air Mineral',            'price' => 5000,  'description' => 'Air mineral botol 600ml'],
                ['name' => 'Teh Tarik',              'price' => 15000, 'description' => 'Teh susu khas tarik ala kopi Malaysia'],
            ],

            // Snack
            'Snack' => [
                ['name' => 'Pisang Goreng Crispy',   'price' => 15000, 'description' => 'Pisang goreng renyah dengan taburan gula halus'],
                ['name' => 'Tempe Mendoan',          'price' => 10000, 'description' => 'Tempe tipis dengan bumbu khas Banyumas'],
                ['name' => 'Kentang Goreng',         'price' => 18000, 'description' => 'Kentang goreng renyah dengan saus sambal dan tomat'],
                ['name' => 'Tahu Isi Goreng',        'price' => 12000, 'description' => 'Tahu goreng isi sayuran dengan bumbu rempah'],
                ['name' => 'Risoles Mayo',           'price' => 14000, 'description' => 'Risoles isi sayuran dan mayo goreng renyah'],
            ],

            // Dessert
            'Dessert' => [
                ['name' => 'Es Campur',              'price' => 18000, 'description' => 'Campuran buah, jelly, dan sirup dengan es serut'],
                ['name' => 'Pudding Coklat',         'price' => 12000, 'description' => 'Pudding coklat lembut dengan saus karamel'],
                ['name' => 'Klepon',                 'price' => 10000, 'description' => 'Jajanan tradisional ketan isi gula merah'],
                ['name' => 'Es Krim Vanilla',        'price' => 15000, 'description' => 'Es krim vanilla premium dengan topping wafer'],
            ],

            // Paket Hemat
            'Paket Hemat' => [
                ['name' => 'Paket Nasi + Ayam + Teh', 'price' => 30000, 'description' => 'Nasi putih + ayam goreng + es teh manis'],
                ['name' => 'Paket Mie + Kopi',         'price' => 25000, 'description' => 'Mie goreng + kopi hitam panas'],
                ['name' => 'Paket Sarapan',            'price' => 20000, 'description' => 'Nasi uduk + teh manis panas'],
            ],
        ];

        foreach ($menus as $categoryName => $items) {
            $category = Category::where('name', $categoryName)->first();

            if (! $category) {
                continue;
            }

            foreach ($items as $item) {
                Menu::firstOrCreate(
                    ['slug' => Str::slug($item['name'])],
                    [
                        'category_id' => $category->id,
                        'name'        => $item['name'],
                        'slug'        => Str::slug($item['name']),
                        'description' => $item['description'],
                        'price'       => $item['price'],
                        'image'       => null,
                        'is_available' => true,
                    ]
                );
            }
        }

        // Tambah 10 menu dummy random via factory (butuh kategori ada)
        if (Category::count() > 0) {
            Menu::factory(10)->available()->create();
        }
    }
}
