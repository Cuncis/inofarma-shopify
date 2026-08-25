<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Payments\DokuPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DokuWebhookController extends Controller
{
    public function handle(Request $request, DokuPaymentService $doku): JsonResponse
    {
        if (! $doku->verifyNotification($request, '/webhooks/doku')) {
            Log::warning('DOKU webhook signature mismatch', ['payload' => $request->all()]);

            return response()->json(['message' => 'Invalid signature'], 401);
        }

        $invoiceNumber = $request->input('order.invoice_number');
        $status = $request->input('transaction.status');

        $order = Order::where('order_number', $invoiceNumber)->first();

        if ($order === null) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // DOKU recommends ignoring a FAILED status and relying on doku_expired_at
        // to determine timeouts, since a late notification can arrive as FAILED
        // even after a successful retry.
        if ($status === 'SUCCESS') {
            $order->update(['payment_status' => 'paid', 'paid_at' => now()]);
        }

        return response()->json(['message' => 'OK']);
    }
}
