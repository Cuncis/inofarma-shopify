<?php

namespace App\Services\Shipping;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class BiteshipService
{
    private const BASE_URL = 'https://api.biteship.com';

    /**
     * @param  array<int, array{name: string, value: int, weight: int, quantity: int}>  $items
     * @return array<int, array<string, mixed>>
     */
    public function getRates(string $destinationPostalCode, array $items): array
    {
        $response = Http::withHeaders([
            'Authorization' => config('services.biteship.api_key'),
        ])->post(self::BASE_URL.'/v1/rates/couriers', [
            'origin_postal_code' => (int) config('services.biteship.origin_postal_code'),
            'destination_postal_code' => (int) $destinationPostalCode,
            'couriers' => config('services.biteship.couriers'),
            'items' => $items,
        ]);

        if ($response->failed()) {
            Log::warning('Biteship rate lookup failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new RuntimeException('Unable to retrieve shipping rates.');
        }

        $pricing = $response->json('pricing', []);

        return collect($pricing)
            ->map(fn (array $rate) => [
                'courier' => $rate['courier_code'] ?? $rate['company'] ?? '',
                'courier_name' => $rate['courier_name'] ?? $rate['company'] ?? '',
                'service' => $rate['courier_service_code'] ?? $rate['service_code'] ?? '',
                'service_name' => $rate['courier_service_name'] ?? $rate['service_name'] ?? '',
                'description' => $rate['description'] ?? '',
                'duration' => $rate['duration'] ?? '',
                'price' => (int) ($rate['price'] ?? 0),
            ])
            ->filter(fn (array $rate) => $rate['price'] > 0)
            ->values()
            ->all();
    }
}
