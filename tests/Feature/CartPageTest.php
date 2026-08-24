<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CartPageTest extends TestCase
{
    public function test_cart_page_renders(): void
    {
        $response = $this->get('/cart');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->component('Cart'));
    }
}
