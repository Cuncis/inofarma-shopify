<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = $this->faker->numberBetween(20000, 500000);
        $shippingCost = $this->faker->randomElement([15000, 25000]);

        return [
            'order_number' => 'INO-'.$this->faker->unique()->numerify('########'),
            'email' => $this->faker->safeEmail(),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'phone' => $this->faker->numerify('08##########'),
            'address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'province' => $this->faker->state(),
            'postal_code' => $this->faker->numerify('#####'),
            'subtotal' => $subtotal,
            'discount' => 0,
            'shipping_cost' => $shippingCost,
            'total' => $subtotal + $shippingCost,
            'coupon_code' => null,
            'shipping_courier' => 'jne',
            'shipping_service' => 'reg',
            'payment_method' => 'transfer',
            'payment_status' => 'pending',
        ];
    }
}
