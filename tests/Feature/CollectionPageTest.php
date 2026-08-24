<?php

namespace Tests\Feature;

use App\Services\Storefront\StorefrontContentService;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CollectionPageTest extends TestCase
{
    public function test_collection_page_renders_for_a_valid_handle(): void
    {
        $response = $this->get('/collections/kesehatan');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Collection')
            ->where('collection.handle', 'kesehatan')
            ->where('collection.title', 'Kesehatan')
            ->has('collection.products')
            ->has('collection.pagination')
            ->has('collection.facets')
        );
    }

    public function test_collection_page_404s_for_an_invalid_handle(): void
    {
        $response = $this->get('/collections/not-a-real-collection');

        $response->assertStatus(404);
    }

    public function test_collection_page_filters_by_availability(): void
    {
        $response = $this->get('/collections/kesehatan?availability[]=sold_out');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Collection')
            ->where('collection.pagination.total', 1)
        );
    }

    public function test_collection_page_sorts_by_price_ascending(): void
    {
        $collection = app(StorefrontContentService::class)->browseCollection('kesehatan', [
            'sort' => 'price-ascending',
            'perPage' => 48,
        ]);

        $prices = array_column($collection['products'], 'price');
        $sorted = $prices;
        sort($sorted);

        $this->assertSame($sorted, $prices);
    }
}
