<?php

namespace App\Services;

use App\Models\SystemSetting;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer as SymfonyMailer;
use Symfony\Component\Mime\Email;

class MailerService
{
    public static function getMailer()
    {
        $setting = SystemSetting::where('key', 'smtp')->first();
        if ($setting && $setting->value) {
            $smtp = $setting->value;
            if (!empty($smtp['host']) && !empty($smtp['port']) && !empty($smtp['user']) && !empty($smtp['pass'])) {
                $dsn = sprintf(
                    'smtp://%s:%s@%s:%d',
                    urlencode($smtp['user']),
                    urlencode($smtp['pass']),
                    $smtp['host'],
                    $smtp['port']
                );
                return new SymfonyMailer(Transport::fromDsn($dsn));
            }
        }
        return null;
    }

    public static function getFromEmail()
    {
        $setting = SystemSetting::where('key', 'smtp')->first();
        if ($setting && $setting->value && !empty($setting->value['from'])) {
            return $setting->value['from'];
        }
        return config('mail.from.address', 'noreply@ngaturi.id');
    }

    protected static function wrapBrandedTemplate($title, $contentHtml)
    {
        $year = date('Y');
        return <<<HTML
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2cca6; border-radius: 12px; background-color: #faf7f2; color: #2c2c2c; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
  <div style="text-align: center; margin-bottom: 25px;">
    <h1 style="color: #a9803b; margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 300;">NGATURI</h1>
    <p style="margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #8b6914;">Premium Digital Invitation</p>
  </div>
  <div style="width: 100%; height: 1px; background: linear-gradient(to right, transparent, #e2cca6, transparent); margin-bottom: 30px;"></div>
  
  <div style="line-height: 1.6; font-size: 14px;">
    {$contentHtml}
  </div>
  
  <div style="width: 100%; height: 1px; background: linear-gradient(to right, transparent, #e2cca6, transparent); margin: 30px 0 20px 0;"></div>
  <div style="text-align: center; font-size: 11px; color: #a9803b; font-weight: 500; opacity: 0.6;">
    <p style="margin: 0;">© {$year} Ngaturi.id. All rights reserved.</p>
    <p style="margin: 5px 0 0 0; color: #999;">Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
  </div>
</div>
HTML;
    }

    public static function sendEmail($to, $subject, $htmlContent, $logLabel = 'EMAIL')
    {
        $mailer = self::getMailer();
        $from = self::getFromEmail();

        if ($mailer) {
            try {
                $email = (new Email())
                    ->from($from)
                    ->to($to)
                    ->subject($subject)
                    ->html($htmlContent);
                $mailer->send($email);
                return true;
            } catch (\Exception $e) {
                logger()->error("[Mailer Error] Failed to send email: " . $e->getMessage());
            }
        }

        // Fallback logger
        logger()->info("
┌────────────────────────────────────────────────────────┐
│               📧 OUTGOING {$logLabel} (DEV MODE)             │
├────────────────────────────────────────────────────────┤
│ Subject : {$subject}
│ To      : {$to}
│ From    : {$from}
└────────────────────────────────────────────────────────┘
");
        return false;
    }

    public static function sendOrderCreated($email, $name, $orderId, $amount, $packageName, $paymentMethod, $paymentCode, $qrUrl = null)
    {
        $subject = "Instruksi Pembayaran Order #" . strtoupper(substr($orderId, 0, 8)) . " — Ngaturi";
        $formattedAmount = "Rp " . number_format($amount, 0, ',', '.');

        $paymentDetailsHtml = '';
        if ($qrUrl) {
            $paymentDetailsHtml = <<<HTML
<div style="text-align: center; margin: 20px 0;">
  <p style="margin-bottom: 10px; color: #666; font-size: 13px;">Silakan scan QR Code berikut untuk membayar:</p>
  <img src="{$qrUrl}" alt="QR Code" style="border: 2px solid #e2cca6; border-radius: 8px; padding: 5px; background: white; max-width: 200px;" />
</div>
HTML;
        } else {
            $paymentDetailsHtml = <<<HTML
<div style="text-align: center; margin: 25px 0; background-color: #f5ede3; padding: 15px; border-radius: 8px; border: 1px solid #e2cca6;">
  <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Nomor Virtual Account / Kode Bayar</p>
  <span style="font-family: monospace; font-size: 24px; font-weight: bold; color: #8b6914;">{$paymentCode}</span>
</div>
HTML;
        }

        $htmlContent = self::wrapBrandedTemplate(
            $subject,
            <<<HTML
<h3 style="color: #8b6914; margin-top: 0; font-weight: 600;">Tagihan Pembayaran Baru</h3>
<p>Halo <strong>{$name}</strong>,</p>
<p>Order Anda untuk paket <strong>{$packageName}</strong> telah berhasil dibuat. Selesaikan pembayaran sebelum batas waktu untuk mengaktifkan undangan Anda.</p>

<div style="background-color: #f5ede3; padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #e2cca6;">
  <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid #e2cca6;">
      <td style="color: #666; padding: 8px 0;">Order ID</td>
      <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">#{$orderId}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2cca6;">
      <td style="color: #666; padding: 8px 0;">Metode Pembayaran</td>
      <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">{$paymentMethod}</td>
    </tr>
    <tr>
      <td style="color: #666; padding: 8px 0;">Total Tagihan</td>
      <td style="font-weight: bold; text-align: right; color: #a9803b; padding: 8px 0; font-size: 16px;">{$formattedAmount}</td>
    </tr>
  </table>
  
  {$paymentDetailsHtml}
</div>

<h4 style="color: #8b6914; margin-bottom: 10px; font-weight: 600;">Petunjuk Pembayaran:</h4>
<ol style="padding-left: 20px; margin: 0 0 20px 0; font-size: 13px; color: #555; line-height: 1.6;">
  <li>Buka aplikasi Mobile Banking / E-Wallet Anda.</li>
  <li>Pilih menu Transfer ke Virtual Account (atau scan QRIS).</li>
  <li>Masukkan Kode Bayar / Scan QR Code di atas.</li>
  <li>Pastikan nominal transfer tepat sebesar <strong>{$formattedAmount}</strong>.</li>
  <li>Konfirmasi transaksi Anda. Pembayaran akan terverifikasi otomatis dalam 1-5 menit.</li>
</ol>

<p style="color: #c92a2a; font-size: 13px; font-weight: 600; text-align: center; margin-top: 15px;">Batas waktu pembayaran adalah 24 jam semenjak transaksi dibuat.</p>
HTML
        );

        return self::sendEmail($email, $subject, $htmlContent, 'ORDER CREATED');
    }

    public static function sendAdminOrderNotification($adminEmail, $orderId, $amount, $packageName, $customerName, $customerEmail)
    {
        $subject = "[Admin Alert] Order Baru Masuk #" . strtoupper(substr($orderId, 0, 8));
        $formattedAmount = "Rp " . number_format($amount, 0, ',', '.');

        $htmlContent = self::wrapBrandedTemplate(
            $subject,
            <<<HTML
<h3 style="color: #8b6914; margin-top: 0; font-weight: 600;">Notifikasi Transaksi Baru</h3>
<p>Halo Admin,</p>
<p>Sebuah order baru dengan status <strong>PENDING</strong> telah didaftarkan ke sistem:</p>

<div style="background-color: #f5ede3; padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #e2cca6;">
  <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid #e2cca6;">
      <td style="color: #666; padding: 8px 0;">Order ID</td>
      <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">#{$orderId}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2cca6;">
      <td style="color: #666; padding: 8px 0;">Pelanggan</td>
      <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">{$customerName} ({$customerEmail})</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2cca6;">
      <td style="color: #666; padding: 8px 0;">Paket</td>
      <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">{$packageName}</td>
    </tr>
    <tr>
      <td style="color: #666; padding: 8px 0;">Nominal</td>
      <td style="font-weight: bold; text-align: right; color: #a9803b; padding: 8px 0; font-size: 16px;">{$formattedAmount}</td>
    </tr>
  </table>
</div>

<p style="font-size: 13px; color: #666;">Transaksi ini sedang menunggu konfirmasi pembayaran otomatis via gateway Tripay.</p>
HTML
        );

        return self::sendEmail($adminEmail, $subject, $htmlContent, 'ADMIN ALERT');
    }

    public static function sendPaymentReceipt($email, $name, $invoiceId, $amount, $packageName, $paymentMethod)
    {
        $subject = "Kwitansi Pembayaran #{$invoiceId} — Ngaturi";
        $formattedAmount = "Rp " . number_format($amount, 0, ',', '.');

        $htmlContent = self::wrapBrandedTemplate(
            $subject,
            <<<HTML
<h3 style="color: #8b6914; margin-top: 0; font-weight: 600;">Pembayaran Berhasil Diterima</h3>
<p>Halo <strong>{$name}</strong>,</p>
<p>Pembayaran Anda untuk Invoice <strong>#{$invoiceId}</strong> telah berhasil kami terima. Berikut adalah rincian transaksi Anda:</p>

<div style="background-color: #f5ede3; padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #e2cca6;">
  <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid #e2cca6;">
      <td style="color: #666; padding: 8px 0;">Invoice ID</td>
      <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">#{$invoiceId}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2cca6;">
      <td style="color: #666; padding: 8px 0;">Paket Layanan</td>
      <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">{$packageName}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2cca6;">
      <td style="color: #666; padding: 8px 0;">Metode Pembayaran</td>
      <td style="font-weight: bold; text-align: right; color: #2c2c2c; padding: 8px 0;">{$paymentMethod}</td>
    </tr>
    <tr>
      <td style="color: #666; padding: 12px 0 0 0; font-size: 15px;">Total Bayar</td>
      <td style="font-weight: bold; text-align: right; color: #a9803b; padding: 12px 0 0 0; font-size: 18px;">{$formattedAmount}</td>
    </tr>
  </table>
</div>

<p>Layanan undangan digital Anda telah diaktifkan / diperpanjang secara otomatis. Silakan masuk ke dashboard untuk mengelola undangan Anda.</p>
HTML
        );

        return self::sendEmail($email, $subject, $htmlContent, 'PAYMENT RECEIPT');
    }
}
