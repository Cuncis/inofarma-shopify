<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Shopify\ShopifyStorefrontClient;
use App\Services\Storefront\StorefrontContentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class CartController extends Controller
{
    /**
     * @var array{id: null, checkoutUrl: null, itemCount: 0, subtotal: 0, items: array<empty, empty>}
     */
    private const EMPTY_CART = ['id' => null, 'checkoutUrl' => null, 'itemCount' => 0, 'subtotal' => 0, 'items' => []];

    public function __construct(private StorefrontContentService $content) {}

    public function show(): Response
    {
        return Inertia::render('Cart', [
            'recentlyViewed' => $this->content->recentlyViewedProducts(),
        ]);
    }

    public function index(ShopifyStorefrontClient $client): JsonResponse
    {
        try {
            return response()->json($this->currentCart($client));
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 502);
        }
    }

    public function addLine(Request $request, ShopifyStorefrontClient $client): JsonResponse
    {
        $validated = $request->validate([
            'handle' => ['required', 'string'],
            'qty' => ['required', 'integer', 'min:1'],
        ]);

        $variantId = $client->productVariantIdByHandle($validated['handle']);

        if ($variantId === null) {
            return response()->json(['message' => 'Produk tidak ditemukan di Shopify.'], 404);
        }

        try {
            $cartId = session('shopify_cart_id');
            $lines = [['merchandiseId' => $variantId, 'quantity' => $validated['qty']]];

            $cart = $cartId
                ? $client->cartLinesAdd($cartId, $lines)
                : $client->cartCreate($lines);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 502);
        }

        session(['shopify_cart_id' => $cart['id']]);

        return response()->json($cart);
    }

    public function updateLine(Request $request, ShopifyStorefrontClient $client): JsonResponse
    {
        $validated = $request->validate([
            'lineId' => ['required', 'string'],
            'qty' => ['required', 'integer', 'min:0'],
        ]);

        $cartId = session('shopify_cart_id');

        if ($cartId === null) {
            return response()->json(['message' => 'Keranjang tidak ditemukan.'], 404);
        }

        try {
            $cart = $validated['qty'] < 1
                ? $client->cartLinesRemove($cartId, [$validated['lineId']])
                : $client->cartLinesUpdate($cartId, [['id' => $validated['lineId'], 'quantity' => $validated['qty']]]);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 502);
        }

        return response()->json($cart);
    }

    public function removeLine(Request $request, ShopifyStorefrontClient $client): JsonResponse
    {
        $validated = $request->validate([
            'lineId' => ['required', 'string'],
        ]);

        $cartId = session('shopify_cart_id');

        if ($cartId === null) {
            return response()->json(['message' => 'Keranjang tidak ditemukan.'], 404);
        }

        try {
            $cart = $client->cartLinesRemove($cartId, [$validated['lineId']]);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 502);
        }

        return response()->json($cart);
    }

    /**
     * @return array<string, mixed>
     */
    private function currentCart(ShopifyStorefrontClient $client): array
    {
        $cartId = session('shopify_cart_id');

        if ($cartId === null) {
            return self::EMPTY_CART;
        }

        $cart = $client->cart($cartId);

        if ($cart === null) {
            session()->forget('shopify_cart_id');

            return self::EMPTY_CART;
        }

        return $cart;
    }
}
