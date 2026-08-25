<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Payments\DokuPaymentService;
use App\Services\Shipping\BiteshipService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class CheckoutController extends Controller
{
    /**
     * @var array<string, array{type: string, value?: int, label: string}>
     */
    private const COUPONS = [
        'HEMAT10' => ['type' => 'percent', 'value' => 10, 'label' => 'Diskon 10%'],
        'ONGKIRGRATIS' => ['type' => 'free_shipping', 'label' => 'Gratis Ongkir'],
    ];

    public function show(): Response
    {
        return Inertia::render('Checkout');
    }

    public function rates(Request $request, BiteshipService $biteship): JsonResponse
    {
        $validated = $request->validate([
            'postal_code' => ['required', 'string', 'min:5', 'max:5'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.title' => ['required', 'string'],
            'items.*.price' => ['required', 'integer', 'min:0'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
        ]);

        $items = array_map(fn (array $item) => [
            'name' => $item['title'],
            'value' => $item['price'],
            'weight' => 500,
            'quantity' => $item['qty'],
        ], $validated['items']);

        try {
            $rates = $biteship->getRates($validated['postal_code'], $items);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 502);
        }

        return response()->json(['rates' => $rates]);
    }

    public function store(Request $request, DokuPaymentService $doku): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'province' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'min:5', 'max:5'],
            'coupon_code' => ['nullable', 'string'],
            'shipping_courier' => ['required', 'string'],
            'shipping_service' => ['required', 'string'],
            'shipping_cost' => ['required', 'integer', 'min:0'],
            'payment_method' => ['required', 'string', 'in:transfer,qris,cod'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'string'],
            'items.*.title' => ['required', 'string'],
            'items.*.price' => ['required', 'integer', 'min:0'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
            'items.*.image' => ['nullable', 'string'],
        ]);

        $subtotal = collect($validated['items'])->sum(fn (array $item) => $item['price'] * $item['qty']);

        $coupon = $validated['coupon_code'] ? (self::COUPONS[strtoupper($validated['coupon_code'])] ?? null) : null;
        $discount = $coupon && $coupon['type'] === 'percent' ? (int) round($subtotal * ($coupon['value'] / 100)) : 0;
        $shippingCost = $coupon && $coupon['type'] === 'free_shipping' ? 0 : $validated['shipping_cost'];
        $total = max(0, $subtotal - $discount + $shippingCost);

        $order = Order::create([
            'user_id' => $request->user()?->id,
            'order_number' => 'INO-'.strtoupper(Str::random(10)),
            'email' => $validated['email'],
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'province' => $validated['province'],
            'postal_code' => $validated['postal_code'],
            'subtotal' => $subtotal,
            'discount' => $discount,
            'shipping_cost' => $shippingCost,
            'total' => $total,
            'coupon_code' => $coupon ? strtoupper($validated['coupon_code']) : null,
            'shipping_courier' => $validated['shipping_courier'],
            'shipping_service' => $validated['shipping_service'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
        ]);

        foreach ($validated['items'] as $item) {
            $order->items()->create([
                'product_id' => $item['id'],
                'title' => $item['title'],
                'price' => $item['price'],
                'qty' => $item['qty'],
                'image' => $item['image'] ?? null,
            ]);
        }

        try {
            $payment = $doku->createPayment(
                invoiceNumber: $order->order_number,
                amount: $total,
                customerName: "{$validated['first_name']} {$validated['last_name']}",
                customerEmail: $validated['email'],
                customerPhone: $validated['phone'],
                callbackUrl: route('checkout.complete', ['order' => $order->order_number]),
                failedUrl: route('checkout.complete', ['order' => $order->order_number, 'status' => 'failed']),
            );
        } catch (RuntimeException $exception) {
            $order->update(['payment_status' => 'failed']);

            return response()->json(['message' => $exception->getMessage()], 502);
        }

        $order->update([
            'doku_token_id' => $payment['token_id'],
            'doku_expired_at' => $this->parseDokuExpiry($payment['expired_date']),
        ]);

        return response()->json(['redirect_url' => $payment['url']]);
    }

    public function complete(Request $request, string $order): Response
    {
        $model = Order::where('order_number', $order)->firstOrFail();

        return Inertia::render('CheckoutComplete', [
            'order' => [
                'orderNumber' => $model->order_number,
                'email' => $model->email,
                'total' => $model->total,
                'paymentStatus' => $model->payment_status,
            ],
        ]);
    }

    private function parseDokuExpiry(?string $expiredDate): ?string
    {
        if ($expiredDate === null) {
            return null;
        }

        return Carbon::createFromFormat('YmdHis', $expiredDate, 'Asia/Jakarta')?->utc()->toDateTimeString();
    }
}
