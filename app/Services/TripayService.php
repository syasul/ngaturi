<?php

namespace App\Services;

use App\Models\SystemSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class TripayService
{
    public static function getConfig()
    {
        $setting = SystemSetting::where('key', 'tripay')->first();
        if (!$setting || !$setting->value) {
            return null;
        }

        $config = $setting->value;
        if (!empty($config['apiKey']) && !empty($config['privateKey']) && !empty($config['merchantCode'])) {
            return [
                'apiKey' => $config['apiKey'],
                'privateKey' => $config['privateKey'],
                'merchantCode' => $config['merchantCode'],
                'isSandbox' => ($config['isSandbox'] ?? true) !== false,
            ];
        }

        return null;
    }

    public static function createTransaction($params)
    {
        $config = self::getConfig();

        if (!$config) {
            // Mock transaction
            $isQris = $params['method'] === 'QRIS';
            $expiredTime = time() + (24 * 3600);
            $mockRef = 'TRX-' . strtoupper(Str::random(9));

            return [
                'reference' => $mockRef,
                'merchant_ref' => $params['merchantRef'],
                'payment_name' => $isQris ? 'QRIS (Simulasi)' : "{$params['method']} Virtual Account (Simulasi)",
                'payment_method' => $params['method'],
                'payment_code' => $isQris ? 'NgaturiSimulatedQRIS' : '88301' . rand(10000000, 99999999),
                'qr_url' => $isQris 
                    ? "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=NgaturiPayment-{$params['merchantRef']}"
                    : null,
                'amount' => $params['amount'],
                'status' => 'UNPAID',
                'expired_time' => $expiredTime,
                'instructions' => [
                    [
                        'title' => 'Cara Pembayaran via ATM',
                        'steps' => [
                            'Masukkan kartu ATM dan PIN Anda.',
                            'Pilih menu Transaksi Lainnya > Transfer > Ke Rekening Virtual Account.',
                            'Masukkan Kode Bayar: ' . ($isQris ? 'Scan QR Code' : 'Nomor VA di atas') . '.',
                            'Pastikan nominal transfer sama dengan Rp ' . number_format($params['amount'], 0, ',', '.') . '.',
                            'Ikuti instruksi selanjutnya untuk menyelesaikan transaksi.'
                        ]
                    ],
                    [
                        'title' => 'Cara Pembayaran via M-Banking',
                        'steps' => [
                            'Buka aplikasi Mobile Banking Anda.',
                            'Pilih menu Transfer > Virtual Account.',
                            'Input Nomor Virtual Account / Kode Bayar.',
                            'Periksa detail tagihan, lalu konfirmasi pembayaran.',
                            'Masukkan PIN M-Banking Anda.'
                        ]
                    ]
                ]
            ];
        }

        // Real Tripay integration
        $baseUrl = $config['isSandbox'] 
            ? 'https://tripay.co.id/api-sandbox/transaction/create'
            : 'https://tripay.co.id/api/transaction/create';

        $signature = hash_hmac('sha256', $config['merchantCode'] . $params['merchantRef'] . $params['amount'], $config['privateKey']);

        $callbackUrl = route('webhook.payment');

        $body = [
            'method' => $params['method'],
            'merchant_ref' => $params['merchantRef'],
            'amount' => $params['amount'],
            'customer_name' => $params['customerName'],
            'customer_email' => $params['customerEmail'],
            'order_items' => [
                [
                    'name' => $params['packageName'],
                    'price' => $params['amount'],
                    'quantity' => 1,
                ]
            ],
            'callback_url' => $callbackUrl,
            'expired_time' => time() + (24 * 3600),
            'signature' => $signature,
        ];

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $config['apiKey']
        ])->post($baseUrl, $body);

        if (!$response->successful()) {
            $errMessage = $response->json('message') ?? 'Gagal membuat transaksi di Tripay.';
            throw new \Exception($errMessage);
        }

        $resJson = $response->json();
        if (!$resJson['success']) {
            throw new \Exception($resJson['message'] ?? 'Gagal membuat transaksi di Tripay.');
        }

        return $resJson['data'];
    }
}
