<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Storefront\StorefrontContentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CollectionController extends Controller
{
    public function __construct(private StorefrontContentService $content) {}

    public function show(Request $request, string $handle): Response
    {
        $collection = $this->content->browseCollection($handle, [
            'page' => (int) $request->integer('page', 1),
            'perPage' => (int) $request->integer('per_page', 24),
            'sort' => $request->string('sort', 'featured')->toString(),
            'availability' => (array) $request->input('availability', []),
            'minPrice' => $request->filled('min_price') ? (int) $request->input('min_price') : null,
            'maxPrice' => $request->filled('max_price') ? (int) $request->input('max_price') : null,
        ]);

        abort_if($collection === null, 404);

        return Inertia::render('Collection', [
            'collection' => $collection,
        ]);
    }
}
