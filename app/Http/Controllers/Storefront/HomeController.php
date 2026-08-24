<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Storefront\StorefrontContentService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(private StorefrontContentService $content) {}

    public function index(): Response
    {
        return Inertia::render('Home', [
            'sections' => $this->content->homepageSections(),
        ]);
    }
}
