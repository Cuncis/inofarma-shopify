<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();
    }

    public function test_order_history_is_sourced_from_shopify_admin_api(): void
    {
        config([
            'services.shopify.domain' => 'test-shop.myshopify.com',
            'services.shopify.admin_token' => 'admin-test-token',
            'services.shopify.api_version' => '2025-01',
        ]);

        $user = User::factory()->create(['email' => 'buyer@example.com']);

        Http::fake(fn () => Http::response(['data' => ['orders' => ['nodes' => [
            [
                'name' => '#1001',
                'createdAt' => '2026-08-20T10:00:00Z',
                'displayFinancialStatus' => 'PAID',
                'statusPageUrl' => 'https://test-shop.myshopify.com/orders/abc/status',
                'currentTotalPriceSet' => ['shopMoney' => ['amount' => '45000.0']],
                'lineItems' => ['nodes' => [['quantity' => 2], ['quantity' => 1]]],
            ],
        ]]]]));

        $response = $this->actingAs($user)->get('/profile');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Profile/Edit')
            ->where('orders.0.orderNumber', '#1001')
            ->where('orders.0.itemCount', 3)
            ->where('orders.0.total', 45000)
            ->where('orders.0.paymentStatus', 'paid')
            ->where('orders.0.statusPageUrl', 'https://test-shop.myshopify.com/orders/abc/status'));
    }

    public function test_profile_page_renders_with_empty_orders_when_shopify_is_unreachable(): void
    {
        config([
            'services.shopify.domain' => 'test-shop.myshopify.com',
            'services.shopify.admin_token' => 'admin-test-token',
            'services.shopify.api_version' => '2025-01',
        ]);

        Http::fake(fn () => Http::response(['errors' => [['message' => 'Internal error']]], 500));

        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/profile');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Profile/Edit')
            ->where('orders', []));
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'first_name' => 'Test',
                'last_name' => 'User',
                'phone' => '081234567890',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('Test', $user->first_name);
        $this->assertSame('User', $user->last_name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'first_name' => 'Test',
                'last_name' => 'User',
                'phone' => '081234567890',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/profile');

        $this->assertNotNull($user->fresh());
    }
}
