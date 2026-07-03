<?php

namespace App\Services;

use App\Models\SystemSetting;
use Illuminate\Support\Facades\Http;

class TelegramService
{
    public static function sendAlert($message)
    {
        try {
            $setting = SystemSetting::where('key', 'telegram')->first();
            if (!$setting || !$setting->value) {
                return;
            }

            $config = $setting->value;
            if (empty($config['enabled']) || empty($config['botToken']) || empty($config['chatId'])) {
                return;
            }

            $url = "https://api.telegram.org/bot{$config['botToken']}/sendMessage";
            $response = Http::post($url, [
                'chat_id' => $config['chatId'],
                'text' => $message,
                'parse_mode' => 'HTML',
            ]);

            if (!$response->successful()) {
                logger()->error('Telegram notification error: ' . $response->body());
            }
        } catch (\Exception $e) {
            logger()->error('Error sending Telegram alert: ' . $e->getMessage());
        }
    }
}
