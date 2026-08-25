<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Storefront\StorefrontContentService;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(private StorefrontContentService $content) {}

    public function show(): Response
    {
        return Inertia::render('Cart', [
            'recentlyViewed' => $this->content->recentlyViewedProducts(),
        ]);
    }
}
