<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'product_id' => $this->faker->slug(2),
            'title' => $this->faker->words(3, true),
            'price' => $this->faker->numberBetween(10000, 100000),
            'qty' => $this->faker->numberBetween(1, 3),
            'image' => null,
        ];
    }
}
