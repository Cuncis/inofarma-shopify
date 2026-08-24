<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SearchPageTest extends TestCase
{
    public function test_search_page_renders_with_matching_products(): void
    {
        $response = $this->get('/search?q=maltofer');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Search')
            ->where('results.query', 'maltofer')
            ->where('results.pagination.total', 2)
        );
    }

    public function test_search_page_renders_with_no_query(): void
    {
        $response = $this->get('/search');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Search')
            ->where('results.query', '')
            ->where('results.pagination.total', 0)
        );
    }

    public function test_search_page_matches_blog_posts(): void
    {
        $response = $this->get('/search?q=PCOS');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Search')
            ->has('results.pageResults', 1)
        );
    }
}
