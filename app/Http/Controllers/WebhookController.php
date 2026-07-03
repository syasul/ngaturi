<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Package;
use App\Models\Wedding;
use App\Models\Transaction;
use App\Models\User;
use App\Services\TripayService;
use App\Services\MailerService;
use App\Services\TelegramService;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function handlePayment(Request $request)
    {
        try {
            $rawBody = $request->getContent();
            $signature = $request->header('X-Callback-Signature');

            $payload = json_decode($rawBody, true);
            if (!$payload) {
                return response()->json(['status' => 'error', 'message' => 'Payload JSON tidak valid.'], 400);
            }

            $reference = $payload['reference'] ?? null;
            $merchantRef = $payload['merchant_ref'] ?? null;
            $status = $payload['status'] ?? null;
            $paymentMethod = $payload['payment_method'] ?? null;
            $amount = $payload['amount'] ?? null;

            if (!$merchantRef) {
                return response()->json(['status' => 'error', 'message' => 'merchant_ref tidak ditemukan.'], 400);
            }

            // Retrieve config
            $config = TripayService::getConfig();

            if ($config && !empty($config['privateKey'])) {
                // Validate signature strictly
                $calculatedSignature = hash_hmac('sha256', $rawBody, $config['privateKey']);

                if ($signature !== $calculatedSignature) {
                    logger()->warning("[Webhook Signature Mismatch] Expected: {$calculatedSignature}, Got: {$signature}");
                    return response()->json(['status' => 'error', 'message' => 'Signature tidak cocok.'], 403);
                }
            } else {
                logger()->warning('[Webhook Warning] Tripay Private Key not configured. Bypassing signature check for mock/local testing.');
            }

            // Process only if status is PAID
            if ($status !== 'PAID') {
                logger()->info("[Webhook Info] Order {$merchantRef} status is {$status}. Skipping activation.");

                // Update order/transaction status if expired or failed
                if ($status === 'EXPIRED' || $status === 'FAILED') {
                    $existingOrder = Order::find($merchantRef);
                    if ($existingOrder && $existingOrder->status === 'PENDING') {
                        $existingOrder->update(['status' => $status]);
                        Transaction::where('order_id', $merchantRef)->update(['status' => 'failed']);
                    }
                }

                return response()->json(['success' => true]);
            }

            // Find the corresponding order
            $order = Order::find($merchantRef);

            if (!$order) {
                return response()->json(['status' => 'error', 'message' => 'Order tidak ditemukan di database.'], 404);
            }

            // Idempotency check: if already PAID, return success instantly
            if ($order->status === 'PAID') {
                return response()->json(['success' => true, 'message' => 'Transaksi sudah diproses sebelumnya.']);
            }

            // Update order status
            $paidAt = now();
            $order->update([
                'status' => 'PAID',
                'paid_at' => $paidAt,
                'payment_method' => $paymentMethod ?: $order->payment_method,
            ]);

            // Update transaction log
            Transaction::where('order_id', $merchantRef)->update([
                'status' => 'success',
                'payload' => array_merge($payload, ['processedAt' => $paidAt->toIso8601String()]),
            ]);

            // Fetch related package and user
            $pkg = Package::find($order->package_id);
            $user = User::find($order->user_id);

            if ($user && $pkg) {
                // Find user's wedding
                $wedding = Wedding::where('user_id', $user->id)->first();

                if ($wedding) {
                    // Calculate new expiration date
                    $days = $pkg->duration_days;
                    $now = now();
                    $currentExpiry = $wedding->expired_at && $wedding->expired_at->isAfter($now) 
                        ? $wedding->expired_at 
                        : $now;

                    $newExpiry = $currentExpiry->addDays($days);

                    $wedding->update([
                        'expired_at' => $newExpiry,
                    ]);

                    logger()->info("[Subscription Updated] Extended wedding slug /u/{$wedding->slug} expiry to {$newExpiry->toIso8601String()}");
                }

                // 1. Dispatch Email Receipt
                try {
                    MailerService::sendPaymentReceipt(
                        $user->email,
                        $user->name,
                        strtoupper(substr($order->id, 0, 8)),
                        $amount ?: $order->amount,
                        $pkg->name,
                        $paymentMethod ?: $order->payment_method ?: 'Tripay'
                    );
                } catch (\Exception $mailErr) {
                    logger()->error('[Mail Error] Failed to send invoice email: ' . $mailErr->getMessage());
                }

                // 2. Dispatch Telegram Bot Alert to Admin Channel
                try {
                    $formattedAmount = number_format($amount ?: $order->amount, 0, ',', '.');
                    $textAlert = "🔔 <b>PEMBAYARAN MASUK (NGATURI)</b>\n\n" .
                      "• <b>Invoice:</b> INV-" . strtoupper(substr($order->id, 0, 8)) . "\n" .
                      "• <b>Customer:</b> {$user->name} ({$user->email})\n" .
                      "• <b>Paket:</b> {$pkg->name}\n" .
                      "• <b>Jumlah:</b> Rp {$formattedAmount}\n" .
                      "• <b>Metode:</b> " . ($paymentMethod ?: 'Tripay') . "\n" .
                      "• <b>Status:</b> PAID ✅";
                    TelegramService::sendAlert($textAlert);
                } catch (\Exception $telErr) {
                    logger()->error('[Telegram Error] Failed to send alert: ' . $telErr->getMessage());
                }
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            logger()->error('Webhook processing error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Gagal memproses webhook.'], 500);
        }
    }
}
