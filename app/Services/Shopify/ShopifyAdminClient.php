<?php

namespace App\Services\Shopify;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class ShopifyAdminClient
{
    /**
     * @var array<string, string>
     */
    private const STATUS_MAP = [
        'PAID' => 'paid',
        'PARTIALLY_PAID' => 'pending',
        'PENDING' => 'pending',
        'AUTHORIZED' => 'pending',
        'EXPIRED' => 'failed',
        'VOIDED' => 'failed',
        'REFUNDED' => 'failed',
        'PARTIALLY_REFUNDED' => 'failed',
    ];

    private function endpoint(): string
    {
        $domain = config('services.shopify.domain');
        $version = config('services.shopify.api_version');

        return "https://{$domain}/admin/api/{$version}/graphql.json";
    }

    /**
     * @param  array<string, mixed>  $variables
     * @return array<string, mixed>
     */
    private function request(string $query, array $variables = []): array
    {
        try {
            $response = Http::withHeaders([
                'X-Shopify-Access-Token' => config('services.shopify.admin_token'),
                'Content-Type' => 'application/json',
            ])->post($this->endpoint(), [
                'query' => $query,
                'variables' => $variables,
            ]);
        } catch (\Throwable $exception) {
            Log::warning('Shopify Admin API request could not be sent', ['exception' => $exception->getMessage()]);

            throw new RuntimeException('Tidak dapat terhubung ke Shopify.', previous: $exception);
        }

        if ($response->failed()) {
            Log::warning('Shopify Admin API request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new RuntimeException('Tidak dapat terhubung ke Shopify.');
        }

        $payload = $response->json();

        if (! empty($payload['errors'])) {
            Log::warning('Shopify Admin API returned errors', ['errors' => $payload['errors']]);

            throw new RuntimeException('Shopify mengembalikan kesalahan.');
        }

        return $payload['data'] ?? [];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function ordersForEmail(string $email, int $limit = 20): array
    {
        $sanitizedEmail = str_replace(['"', '\\'], '', $email);

        $data = $this->request(
            <<<'GRAPHQL'
                query OrdersForEmail($query: String!, $limit: Int!) {
                    orders(first: $limit, query: $query, sortKey: CREATED_AT, reverse: true) {
                        nodes {
                            name
                            createdAt
                            displayFinancialStatus
                            statusPageUrl
                            currentTotalPriceSet { shopMoney { amount } }
                            lineItems(first: 50) { nodes { quantity } }
                        }
                    }
                }
                GRAPHQL,
            ['query' => "email:{$sanitizedEmail}", 'limit' => $limit],
        );

        return array_map(fn (array $order) => [
            'orderNumber' => $order['name'],
            'date' => $order['createdAt'],
            'itemCount' => array_sum(array_column($order['lineItems']['nodes'] ?? [], 'quantity')),
            'total' => (int) round((float) $order['currentTotalPriceSet']['shopMoney']['amount']),
            'paymentStatus' => self::STATUS_MAP[$order['displayFinancialStatus']] ?? 'pending',
            'statusPageUrl' => $order['statusPageUrl'],
        ], $data['orders']['nodes'] ?? []);
    }
}
