<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CartApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.shopify.domain' => 'test-shop.myshopify.com',
            'services.shopify.storefront_token' => 'storefront-test-token',
            'services.shopify.api_version' => '2025-01',
        ]);
    }

    /**
     * @param  array<int, array{lineId?: string, quantity: int}>  $lines
     * @return array<string, mixed>
     */
    private function fakeCartPayload(array $lines): array
    {
        return [
            'id' => 'gid://shopify/Cart/abc',
            'checkoutUrl' => 'https://test-shop.myshopify.com/cart/c/abc',
            'totalQuantity' => array_sum(array_column($lines, 'quantity')),
            'cost' => ['subtotalAmount' => ['amount' => '30000.0']],
            'lines' => [
                'nodes' => array_map(fn (array $line) => [
                    'id' => $line['lineId'] ?? 'gid://shopify/CartLine/1',
                    'quantity' => $line['quantity'],
                    'merchandise' => [
                        'id' => 'gid://shopify/ProductVariant/111',
                        'title' => 'Standar',
                        'price' => ['amount' => '15000.0'],
                        'image' => ['url' => 'https://cdn.shopify.com/adem-sari.jpg'],
                        'product' => ['title' => 'Adem Sari Sachet', 'vendor' => 'Adem Sari'],
                    ],
                ], $lines),
            ],
        ];
    }

    private function fakeVariantLookup(): array
    {
        return ['data' => ['product' => [
            'variants' => ['nodes' => [['id' => 'gid://shopify/ProductVariant/111']]],
        ]]];
    }

    public function test_cart_returns_empty_state_when_no_session_cart(): void
    {
        $response = $this->getJson('/api/cart');

        $response->assertOk()->assertExactJson([
            'id' => null,
            'checkoutUrl' => null,
            'itemCount' => 0,
            'subtotal' => 0,
            'items' => [],
        ]);
    }

    public function test_adding_a_line_creates_a_cart_and_persists_its_id_in_session(): void
    {
        Http::fake(function ($request) {
            $query = json_decode($request->body(), true)['query'] ?? '';

            if (str_contains($query, 'ProductVariantId')) {
                return Http::response($this->fakeVariantLookup());
            }

            return Http::response(['data' => ['cartCreate' => [
                'cart' => $this->fakeCartPayload([['quantity' => 2]]),
                'userErrors' => [],
            ]]]);
        });

        $response = $this->postJson('/api/cart/lines', ['handle' => 'adem-sari-sachet', 'qty' => 2]);

        $response->assertOk()
            ->assertJsonPath('itemCount', 2)
            ->assertJsonPath('items.0.qty', 2)
            ->assertJsonPath('items.0.title', 'Adem Sari Sachet')
            ->assertJsonPath('checkoutUrl', 'https://test-shop.myshopify.com/cart/c/abc');

        $this->assertSame('gid://shopify/Cart/abc', session('shopify_cart_id'));
    }

    public function test_adding_an_unknown_handle_returns_404(): void
    {
        Http::fake(fn () => Http::response(['data' => ['product' => null]]));

        $response = $this->postJson('/api/cart/lines', ['handle' => 'unknown-product', 'qty' => 1]);

        $response->assertStatus(404);
        $this->assertNull(session('shopify_cart_id'));
    }

    public function test_adding_a_line_to_an_existing_cart_calls_cart_lines_add(): void
    {
        session(['shopify_cart_id' => 'gid://shopify/Cart/abc']);

        Http::fake(function ($request) {
            $query = json_decode($request->body(), true)['query'] ?? '';

            if (str_contains($query, 'ProductVariantId')) {
                return Http::response($this->fakeVariantLookup());
            }

            $this->assertStringContainsString('CartLinesAdd', $query);

            return Http::response(['data' => ['cartLinesAdd' => [
                'cart' => $this->fakeCartPayload([['quantity' => 3]]),
                'userErrors' => [],
            ]]]);
        });

        $response = $this->postJson('/api/cart/lines', ['handle' => 'adem-sari-sachet', 'qty' => 1]);

        $response->assertOk()->assertJsonPath('itemCount', 3);
    }

    public function test_updating_line_quantity(): void
    {
        session(['shopify_cart_id' => 'gid://shopify/Cart/abc']);

        Http::fake(fn () => Http::response(['data' => ['cartLinesUpdate' => [
            'cart' => $this->fakeCartPayload([['lineId' => 'gid://shopify/CartLine/1', 'quantity' => 5]]),
            'userErrors' => [],
        ]]]));

        $response = $this->postJson('/api/cart/lines/update', ['lineId' => 'gid://shopify/CartLine/1', 'qty' => 5]);

        $response->assertOk()->assertJsonPath('items.0.qty', 5);
    }

    public function test_updating_line_quantity_to_zero_removes_it(): void
    {
        session(['shopify_cart_id' => 'gid://shopify/Cart/abc']);

        Http::fake(function ($request) {
            $query = json_decode($request->body(), true)['query'] ?? '';
            $this->assertStringContainsString('CartLinesRemove', $query);

            return Http::response(['data' => ['cartLinesRemove' => [
                'cart' => $this->fakeCartPayload([]),
                'userErrors' => [],
            ]]]);
        });

        $response = $this->postJson('/api/cart/lines/update', ['lineId' => 'gid://shopify/CartLine/1', 'qty' => 0]);

        $response->assertOk()->assertJsonPath('itemCount', 0);
    }

    public function test_removing_a_line(): void
    {
        session(['shopify_cart_id' => 'gid://shopify/Cart/abc']);

        Http::fake(fn () => Http::response(['data' => ['cartLinesRemove' => [
            'cart' => $this->fakeCartPayload([]),
            'userErrors' => [],
        ]]]));

        $response = $this->postJson('/api/cart/lines/remove', ['lineId' => 'gid://shopify/CartLine/1']);

        $response->assertOk()->assertJsonPath('items', []);
    }

    public function test_updating_line_without_a_session_cart_returns_404(): void
    {
        $response = $this->postJson('/api/cart/lines/update', ['lineId' => 'gid://shopify/CartLine/1', 'qty' => 2]);

        $response->assertStatus(404);
    }

    public function test_shopify_error_returns_502(): void
    {
        Http::fake(function ($request) {
            $query = json_decode($request->body(), true)['query'] ?? '';

            if (str_contains($query, 'ProductVariantId')) {
                return Http::response($this->fakeVariantLookup());
            }

            return Http::response(['data' => ['cartCreate' => [
                'cart' => null,
                'userErrors' => [['message' => 'Variant is out of stock']],
            ]]]);
        });

        $response = $this->postJson('/api/cart/lines', ['handle' => 'adem-sari-sachet', 'qty' => 1]);

        $response->assertStatus(502);
    }
}
