<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Menu>
 */
class MenuFactory extends Factory
{
    protected $model = Menu::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name  = fake()->unique()->words(rand(2, 3), true);
        $price = fake()->randomElement([
            8000, 10000, 12000, 15000, 18000, 20000,
            22000, 25000, 28000, 30000, 35000, 40000,
        ]);

        return [
            'category_id'  => Category::inRandomOrder()->first()?->id ?? Category::factory(),
            'name'         => ucwords($name),
            'slug'         => Str::slug($name) . '-' . fake()->unique()->numberBetween(1, 9999),
            'description'  => fake()->optional(0.7)->sentence(10),
            'price'        => $price,
            'image'        => null,
            'is_available' => fake()->boolean(85), // 85% kemungkinan tersedia
        ];
    }

    /**
     * State: menu tersedia.
     */
    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_available' => true,
        ]);
    }

    /**
     * State: menu tidak tersedia.
     */
    public function unavailable(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_available' => false,
        ]);
    }

    /**
     * State: menu sudah di-soft delete.
     */
    public function deleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'deleted_at' => now()->subDays(rand(1, 30)),
        ]);
    }
}
