<?php

namespace App\Services\Payments;

use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

class DokuPaymentService
{
    private const CHECKOUT_PATH = '/checkout/v1/payment';

    private function baseUrl(): string
    {
        return config('services.doku.production')
            ? 'https://api.doku.com'
            : 'https://api-sandbox.doku.com';
    }

    /**
     * @return array{url: string, token_id: string, expired_date: string}
     */
    public function createPayment(
        string $invoiceNumber,
        int $amount,
        string $customerName,
        string $customerEmail,
        string $customerPhone,
        string $callbackUrl,
        string $failedUrl,
    ): array {
        $body = [
            'order' => [
                'amount' => $amount,
                'invoice_number' => $invoiceNumber,
                'callback_url' => $callbackUrl,
                'failed_url' => $failedUrl,
                'auto_redirect' => true,
            ],
            'payment' => [
                'payment_due_date' => 1440,
            ],
            'customer' => [
                'name' => $customerName,
                'email' => $customerEmail,
                'phone' => $customerPhone,
                'country' => 'ID',
            ],
        ];

        $response = $this->post(self::CHECKOUT_PATH, $body);

        if ($response->failed() || $response->json('response.payment.url') === null) {
            Log::warning('DOKU checkout creation failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new RuntimeException('Unable to create DOKU payment.');
        }

        return [
            'url' => $response->json('response.payment.url'),
            'token_id' => $response->json('response.payment.token_id'),
            'expired_date' => $response->json('response.payment.expired_date'),
        ];
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function post(string $path, array $body): Response
    {
        $requestId = (string) Str::uuid();
        $timestamp = gmdate('Y-m-d\TH:i:s\Z');
        $jsonBody = json_encode($body, JSON_UNESCAPED_SLASHES);
        $digest = base64_encode(hash('sha256', $jsonBody, true));

        return Http::withHeaders([
            'Client-Id' => config('services.doku.client_id'),
            'Request-Id' => $requestId,
            'Request-Timestamp' => $timestamp,
            'Signature' => $this->signature($requestId, $timestamp, $path, $digest),
            'Digest' => "SHA-256={$digest}",
            'Content-Type' => 'application/json',
        ])->withBody($jsonBody, 'application/json')
            ->post($this->baseUrl().$path);
    }

    private function signature(string $requestId, string $timestamp, string $requestTarget, string $digest): string
    {
        $components = implode("\n", [
            'Client-Id:'.config('services.doku.client_id'),
            'Request-Id:'.$requestId,
            'Request-Timestamp:'.$timestamp,
            'Request-Target:'.$requestTarget,
            'Digest:'.$digest,
        ]);

        $hmac = base64_encode(hash_hmac('sha256', $components, (string) config('services.doku.secret_key'), true));

        return "HMACSHA256={$hmac}";
    }

    public function verifyNotification(Request $request, string $requestTarget): bool
    {
        $clientId = $request->header('Client-Id', '');
        $requestId = $request->header('Request-Id', '');
        $timestamp = $request->header('Request-Timestamp', '');
        $signature = $request->header('Signature', '');

        if ($clientId !== config('services.doku.client_id') || $signature === '') {
            return false;
        }

        $digest = base64_encode(hash('sha256', $request->getContent(), true));
        $expected = $this->signature($requestId, $timestamp, $requestTarget, $digest);

        return hash_equals($expected, $signature);
    }
}
