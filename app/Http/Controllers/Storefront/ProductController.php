<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Storefront\StorefrontContentService;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(private StorefrontContentService $content) {}

    public function show(string $handle): Response
    {
        $product = $this->content->productDetail($handle);

        abort_if($product === null, 404);

        return Inertia::render('Product', [
            'product' => $product,
            'recommendations' => $this->content->productRecommendations($handle),
            'recentlyViewed' => $this->content->recentlyViewedProducts(),
        ]);
    }
}
