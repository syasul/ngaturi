<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\User;
use App\Services\TripayService;
use App\Services\MailerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // 1. GET /api/orders/packages - Get available packages
    public function getPackages()
    {
        try {
            $list = Package::all();
            return response()->json(['status' => 'success', 'packages' => $list]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil paket.'], 500);
        }
    }

    // 2. GET /api/orders/history - Get order history
    public function history()
    {
        $user = Auth::user();
        try {
            $list = Order::with('package')
                ->where('user_id', $user->id)
                ->latest()
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'status' => $order->status,
                        'amount' => $order->amount,
                        'paymentMethod' => $order->payment_method,
                        'paidAt' => $order->paid_at,
                        'createdAt' => $order->created_at,
                        'packageName' => $order->package ? $order->package->name : null,
                    ];
                });

            return response()->json(['status' => 'success', 'history' => $list]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil riwayat transaksi.'], 500);
        }
    }

    // 3. GET /api/orders/{id} - Get order details
    public function show($id)
    {
        $user = Auth::user();
        try {
            $order = Order::with('package')
                ->where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$order) {
                return response()->json(['status' => 'error', 'message' => 'Order tidak ditemukan.'], 404);
            }

            $transaction = Transaction::where('order_id', $order->id)
                ->latest()
                ->first();

            $formattedOrder = [
                'id' => $order->id,
                'status' => $order->status,
                'amount' => $order->amount,
                'paymentMethod' => $order->payment_method,
                'paidAt' => $order->paid_at,
                'createdAt' => $order->created_at,
                'packageName' => $order->package ? $order->package->name : null,
            ];

            return response()->json([
                'status' => 'success',
                'order' => $formattedOrder,
                'transaction' => $transaction,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal memuat detail order.'], 500);
        }
    }

    // 4. POST /api/orders/checkout - Process checkout
    public function checkout(Request $request)
    {
        $user = Auth::user();
        try {
            $packageId = $request->input('packageId');
            $paymentMethod = $request->input('paymentMethod');

            if (!$packageId || !$paymentMethod) {
                return response()->json(['status' => 'error', 'message' => 'ID Paket dan Metode Pembayaran wajib diisi.'], 400);
            }

            $pkg = Package::find($packageId);

            if (!$pkg) {
                return response()->json(['status' => 'error', 'message' => 'Paket tidak ditemukan.'], 400);
            }

            return DB::transaction(function () use ($user, $pkg, $paymentMethod) {
                // Create a pending order
                $newOrder = Order::create([
                    'user_id' => $user->id,
                    'package_id' => $pkg->id,
                    'status' => 'PENDING',
                    'amount' => $pkg->price,
                    'payment_method' => $paymentMethod,
                ]);

                // Register closed transaction to Tripay
                try {
                    $tripayTrx = TripayService::createTransaction([
                        'method' => $paymentMethod,
                        'merchantRef' => $newOrder->id,
                        'amount' => $pkg->price,
                        'customerName' => $user->name,
                        'customerEmail' => $user->email,
                        'packageName' => $pkg->name,
                    ]);
                } catch (\Exception $apiErr) {
                    // DB transaction will rollback automatically
                    throw $apiErr;
                }

                // Create transaction log
                Transaction::create([
                    'order_id' => $newOrder->id,
                    'gateway_ref' => $tripayTrx['reference'] ?? null,
                    'status' => 'pending',
                    'payload' => $tripayTrx,
                ]);

                // Send payment instructions email to customer
                try {
                    MailerService::sendOrderCreated(
                        $user->email,
                        $user->name,
                        $newOrder->id,
                        $newOrder->amount,
                        $pkg->name,
                        $tripayTrx['payment_name'] ?? $paymentMethod,
                        $tripayTrx['payment_code'] ?? '',
                        $tripayTrx['qr_url'] ?? null
                    );
                } catch (\Exception $mailErr) {
                    logger()->error('[Mail Error] Failed to send order confirmation email: ' . $mailErr->getMessage());
                }

                // Send new order notifications to all admins
                try {
                    $admins = User::where('role', 'ADMIN')->get();
                    foreach ($admins as $admin) {
                        try {
                            MailerService::sendAdminOrderNotification(
                                $admin->email,
                                $newOrder->id,
                                $newOrder->amount,
                                $pkg->name,
                                $user->name,
                                $user->email
                            );
                        } catch (\Exception $adminMailErr) {
                            logger()->error("[Mail Error] Failed to notify admin {$admin->email}: " . $adminMailErr->getMessage());
                        }
                    }
                } catch (\Exception $adminErr) {
                    logger()->error('[Admin Query Error] Failed to fetch admins for order notification: ' . $adminErr->getMessage());
                }

                return response()->json([
                    'status' => 'success',
                    'message' => 'Transaksi berhasil didaftarkan.',
                    'order' => $newOrder,
                    'tripay' => $tripayTrx,
                ]);
            });
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage() ?: 'Gagal memproses pembayaran.'], 500);
        }
    }
}
