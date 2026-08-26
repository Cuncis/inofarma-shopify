<?php

namespace App\Services\Shopify;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class ShopifyStorefrontClient
{
    private const CART_FIELDS = <<<'GRAPHQL'
        id
        checkoutUrl
        totalQuantity
        cost {
            subtotalAmount { amount }
        }
        lines(first: 50) {
            nodes {
                id
                quantity
                merchandise {
                    ... on ProductVariant {
                        id
                        title
                        price { amount }
                        image { url }
                        product { title vendor }
                    }
                }
            }
        }
        GRAPHQL;

    private function endpoint(): string
    {
        $domain = config('services.shopify.domain');
        $version = config('services.shopify.api_version');

        return "https://{$domain}/api/{$version}/graphql.json";
    }

    /**
     * @param  array<string, mixed>  $variables
     * @return array<string, mixed>
     */
    private function request(string $query, array $variables = []): array
    {
        try {
            $response = Http::withHeaders([
                'X-Shopify-Storefront-Access-Token' => config('services.shopify.storefront_token'),
                'Content-Type' => 'application/json',
            ])->post($this->endpoint(), [
                'query' => $query,
                'variables' => $variables,
            ]);
        } catch (\Throwable $exception) {
            Log::warning('Shopify Storefront API request could not be sent', ['exception' => $exception->getMessage()]);

            throw new RuntimeException('Tidak dapat terhubung ke Shopify.', previous: $exception);
        }

        if ($response->failed()) {
            Log::warning('Shopify Storefront API request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new RuntimeException('Tidak dapat terhubung ke Shopify.');
        }

        $payload = $response->json();

        if (! empty($payload['errors'])) {
            Log::warning('Shopify Storefront API returned errors', ['errors' => $payload['errors']]);

            throw new RuntimeException('Shopify mengembalikan kesalahan.');
        }

        return $payload['data'] ?? [];
    }

    public function productVariantIdByHandle(string $handle): ?string
    {
        $data = $this->request(
            <<<'GRAPHQL'
                query ProductVariantId($handle: String!) {
                    product(handle: $handle) {
                        variants(first: 1) {
                            nodes { id }
                        }
                    }
                }
                GRAPHQL,
            ['handle' => $handle],
        );

        return $data['product']['variants']['nodes'][0]['id'] ?? null;
    }

    /**
     * @param  array<int, array{merchandiseId: string, quantity: int}>  $lines
     * @return array<string, mixed>
     */
    public function cartCreate(array $lines): array
    {
        $data = $this->request(
            <<<GRAPHQL
                mutation CartCreate(\$input: CartInput) {
                    cartCreate(input: \$input) {
                        cart { {$this->cartFields()} }
                        userErrors { message }
                    }
                }
                GRAPHQL,
            ['input' => ['lines' => $lines]],
        );

        $this->assertNoUserErrors($data['cartCreate']['userErrors'] ?? []);

        return $this->mapCart($data['cartCreate']['cart']);
    }

    /**
     * @param  array<int, array{merchandiseId: string, quantity: int}>  $lines
     * @return array<string, mixed>
     */
    public function cartLinesAdd(string $cartId, array $lines): array
    {
        $data = $this->request(
            <<<GRAPHQL
                mutation CartLinesAdd(\$cartId: ID!, \$lines: [CartLineInput!]!) {
                    cartLinesAdd(cartId: \$cartId, lines: \$lines) {
                        cart { {$this->cartFields()} }
                        userErrors { message }
                    }
                }
                GRAPHQL,
            ['cartId' => $cartId, 'lines' => $lines],
        );

        $this->assertNoUserErrors($data['cartLinesAdd']['userErrors'] ?? []);

        return $this->mapCart($data['cartLinesAdd']['cart']);
    }

    /**
     * @param  array<int, array{id: string, quantity: int}>  $lines
     * @return array<string, mixed>
     */
    public function cartLinesUpdate(string $cartId, array $lines): array
    {
        $data = $this->request(
            <<<GRAPHQL
                mutation CartLinesUpdate(\$cartId: ID!, \$lines: [CartLineUpdateInput!]!) {
                    cartLinesUpdate(cartId: \$cartId, lines: \$lines) {
                        cart { {$this->cartFields()} }
                        userErrors { message }
                    }
                }
                GRAPHQL,
            ['cartId' => $cartId, 'lines' => $lines],
        );

        $this->assertNoUserErrors($data['cartLinesUpdate']['userErrors'] ?? []);

        return $this->mapCart($data['cartLinesUpdate']['cart']);
    }

    /**
     * @param  array<int, string>  $lineIds
     * @return array<string, mixed>
     */
    public function cartLinesRemove(string $cartId, array $lineIds): array
    {
        $data = $this->request(
            <<<GRAPHQL
                mutation CartLinesRemove(\$cartId: ID!, \$lineIds: [ID!]!) {
                    cartLinesRemove(cartId: \$cartId, lineIds: \$lineIds) {
                        cart { {$this->cartFields()} }
                        userErrors { message }
                    }
                }
                GRAPHQL,
            ['cartId' => $cartId, 'lineIds' => $lineIds],
        );

        $this->assertNoUserErrors($data['cartLinesRemove']['userErrors'] ?? []);

        return $this->mapCart($data['cartLinesRemove']['cart']);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function cart(string $cartId): ?array
    {
        $data = $this->request(
            <<<GRAPHQL
                query Cart(\$cartId: ID!) {
                    cart(id: \$cartId) { {$this->cartFields()} }
                }
                GRAPHQL,
            ['cartId' => $cartId],
        );

        if ($data['cart'] === null) {
            return null;
        }

        return $this->mapCart($data['cart']);
    }

    private function cartFields(): string
    {
        return self::CART_FIELDS;
    }

    /**
     * @param  array<int, array{message: string}>  $userErrors
     */
    private function assertNoUserErrors(array $userErrors): void
    {
        if ($userErrors === []) {
            return;
        }

        Log::warning('Shopify cart mutation returned user errors', ['errors' => $userErrors]);

        throw new RuntimeException(implode(' ', array_column($userErrors, 'message')));
    }

    /**
     * @param  array<string, mixed>  $cart
     * @return array<string, mixed>
     */
    private function mapCart(array $cart): array
    {
        return [
            'id' => $cart['id'],
            'checkoutUrl' => $cart['checkoutUrl'],
            'itemCount' => (int) $cart['totalQuantity'],
            'subtotal' => (int) round((float) $cart['cost']['subtotalAmount']['amount']),
            'items' => array_map(fn (array $line) => [
                'lineId' => $line['id'],
                'title' => $line['merchandise']['product']['title'] ?? $line['merchandise']['title'],
                'vendor' => $line['merchandise']['product']['vendor'] ?? null,
                'price' => (int) round((float) $line['merchandise']['price']['amount']),
                'qty' => $line['quantity'],
                'image' => $line['merchandise']['image']['url'] ?? null,
            ], $cart['lines']['nodes'] ?? []),
        ];
    }
}
