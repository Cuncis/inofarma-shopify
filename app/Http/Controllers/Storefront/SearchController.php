<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Storefront\StorefrontContentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function __construct(private StorefrontContentService $content) {}

    public function show(Request $request): Response
    {
        $results = $this->content->search($request->string('q', '')->toString(), [
            'page' => (int) $request->integer('page', 1),
            'perPage' => (int) $request->integer('per_page', 24),
            'sort' => $request->string('sort', 'featured')->toString(),
            'availability' => (array) $request->input('availability', []),
            'minPrice' => $request->filled('min_price') ? (int) $request->input('min_price') : null,
            'maxPrice' => $request->filled('max_price') ? (int) $request->input('max_price') : null,
        ]);

        return Inertia::render('Search', [
            'results' => $results,
        ]);
    }

    public function predictive(Request $request): JsonResponse
    {
        $query = $request->string('q', '')->toString();
        $results = $this->content->search($query, ['perPage' => 5]);

        return response()->json([
            'query' => $query,
            'total' => $results['pagination']['total'],
            'products' => array_slice($results['products'], 0, 5),
        ]);
    }
}
