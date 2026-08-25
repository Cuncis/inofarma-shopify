<?php

namespace Tests\Feature;

use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.doku.client_id' => 'BRN-TEST',
            'services.doku.secret_key' => 'test-secret-key',
            'services.doku.production' => false,
            'services.biteship.api_key' => 'biteship_test.fake-key',
        ]);
    }

    public function test_checkout_page_renders(): void
    {
        $this->get('/checkout')->assertStatus(200);
    }

    public function test_shipping_rates_returns_mapped_courier_options(): void
    {
        Http::fake([
            'api.biteship.com/*' => Http::response([
                'pricing' => [
                    [
                        'courier_code' => 'jne',
                        'courier_name' => 'JNE',
                        'courier_service_code' => 'reg',
                        'courier_service_name' => 'Reguler',
                        'description' => 'Layanan reguler',
                        'duration' => '1 - 2 days',
                        'price' => 12000,
                    ],
                ],
            ], 200),
        ]);

        $response = $this->postJson('/checkout/shipping-rates', [
            'postal_code' => '40123',
            'items' => [
                ['title' => 'Adem Sari Sachet', 'price' => 16100, 'qty' => 1],
            ],
        ]);

        $response->assertOk()->assertJson([
            'rates' => [
                [
                    'courier' => 'jne',
                    'courier_name' => 'JNE',
                    'service' => 'reg',
                    'service_name' => 'Reguler',
                    'price' => 12000,
                ],
            ],
        ]);
    }

    public function test_store_creates_order_and_returns_doku_redirect_url(): void
    {
        Http::fake([
            'api-sandbox.doku.com/*' => Http::response([
                'message' => ['SUCCESS'],
                'response' => [
                    'payment' => [
                        'url' => 'https://staging.doku.com/checkout-link-v2/token123',
                        'token_id' => 'token123',
                        'expired_date' => '20260101120000',
                    ],
                ],
            ], 200),
        ]);

        $payload = [
            'email' => 'siti@example.com',
            'first_name' => 'Siti',
            'last_name' => 'Aminah',
            'phone' => '081298765432',
            'address' => 'Jl. Sudirman 10',
            'city' => 'Bandung',
            'province' => 'Jawa Barat',
            'postal_code' => '40123',
            'coupon_code' => null,
            'shipping_courier' => 'jne',
            'shipping_service' => 'reg',
            'shipping_cost' => 12000,
            'payment_method' => 'transfer',
            'items' => [
                ['id' => 'adem-sari-sachet', 'title' => 'Adem Sari Sachet', 'price' => 16100, 'qty' => 1, 'image' => null],
            ],
        ];

        $response = $this->postJson('/checkout', $payload);

        $response->assertOk()->assertJson([
            'redirect_url' => 'https://staging.doku.com/checkout-link-v2/token123',
        ]);

        $this->assertDatabaseHas('orders', [
            'email' => 'siti@example.com',
            'subtotal' => 16100,
            'shipping_cost' => 12000,
            'total' => 28100,
            'payment_status' => 'pending',
            'doku_token_id' => 'token123',
        ]);

        $this->assertDatabaseHas('order_items', [
            'product_id' => 'adem-sari-sachet',
            'title' => 'Adem Sari Sachet',
            'price' => 16100,
            'qty' => 1,
        ]);
    }

    public function test_store_applies_percent_coupon_server_side(): void
    {
        Http::fake([
            'api-sandbox.doku.com/*' => Http::response([
                'message' => ['SUCCESS'],
                'response' => [
                    'payment' => [
                        'url' => 'https://staging.doku.com/checkout-link-v2/token456',
                        'token_id' => 'token456',
                        'expired_date' => '20260101120000',
                    ],
                ],
            ], 200),
        ]);

        $payload = [
            'email' => 'siti@example.com',
            'first_name' => 'Siti',
            'last_name' => 'Aminah',
            'phone' => '081298765432',
            'address' => 'Jl. Sudirman 10',
            'city' => 'Bandung',
            'province' => 'Jawa Barat',
            'postal_code' => '40123',
            'coupon_code' => 'hemat10',
            'shipping_courier' => 'jne',
            'shipping_service' => 'reg',
            'shipping_cost' => 12000,
            'payment_method' => 'transfer',
            'items' => [
                ['id' => 'adem-sari-sachet', 'title' => 'Adem Sari Sachet', 'price' => 16100, 'qty' => 1, 'image' => null],
            ],
        ];

        $this->postJson('/checkout', $payload)->assertOk();

        $this->assertDatabaseHas('orders', [
            'email' => 'siti@example.com',
            'subtotal' => 16100,
            'discount' => 1610,
            'shipping_cost' => 12000,
            'total' => 26490,
            'coupon_code' => 'HEMAT10',
        ]);
    }

    public function test_webhook_updates_order_to_paid_with_valid_signature(): void
    {
        $order = Order::factory()->create(['order_number' => 'INO-WEBHOOKTEST', 'payment_status' => 'pending']);

        $body = json_encode(['order' => ['invoice_number' => 'INO-WEBHOOKTEST'], 'transaction' => ['status' => 'SUCCESS']]);
        $headers = $this->dokuSignedHeaders('/webhooks/doku', $body);

        $response = $this->call('POST', '/webhooks/doku', [], [], [], $this->transformHeadersToServerVars($headers), $body);

        $response->assertOk();
        $this->assertSame('paid', $order->fresh()->payment_status);
    }

    public function test_webhook_rejects_invalid_signature(): void
    {
        $order = Order::factory()->create(['order_number' => 'INO-BADSIG', 'payment_status' => 'pending']);

        $body = json_encode(['order' => ['invoice_number' => 'INO-BADSIG'], 'transaction' => ['status' => 'SUCCESS']]);
        $headers = $this->dokuSignedHeaders('/webhooks/doku', $body);
        $headers['Signature'] = 'HMACSHA256=tampered';

        $response = $this->call('POST', '/webhooks/doku', [], [], [], $this->transformHeadersToServerVars($headers), $body);

        $response->assertStatus(401);
        $this->assertSame('pending', $order->fresh()->payment_status);
    }

    /**
     * @return array<string, string>
     */
    private function dokuSignedHeaders(string $requestTarget, string $body): array
    {
        $clientId = config('services.doku.client_id');
        $secret = config('services.doku.secret_key');
        $requestId = 'test-request-id';
        $timestamp = gmdate('Y-m-d\TH:i:s\Z');
        $digest = base64_encode(hash('sha256', $body, true));

        $components = implode("\n", [
            "Client-Id:{$clientId}",
            "Request-Id:{$requestId}",
            "Request-Timestamp:{$timestamp}",
            "Request-Target:{$requestTarget}",
            "Digest:{$digest}",
        ]);

        $signature = 'HMACSHA256='.base64_encode(hash_hmac('sha256', $components, $secret, true));

        return [
            'Client-Id' => $clientId,
            'Request-Id' => $requestId,
            'Request-Timestamp' => $timestamp,
            'Signature' => $signature,
            'Content-Type' => 'application/json',
        ];
    }
}
