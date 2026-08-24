<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductPageTest extends TestCase
{
    public function test_product_page_renders_for_a_valid_handle(): void
    {
        $response = $this->get('/products/adem-sari-sachet');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Product')
            ->where('product.handle', 'adem-sari-sachet')
            ->has('product.variants', 1)
            ->has('recommendations')
            ->has('recentlyViewed')
        );
    }

    public function test_product_page_404s_for_an_invalid_handle(): void
    {
        $response = $this->get('/products/not-a-real-handle');

        $response->assertStatus(404);
    }
}
