<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Theme;
use App\Models\Package;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\Wedding;
use App\Models\Music;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Packages
        $basicPkg = Package::firstOrCreate(
            ['name' => 'BASIC'],
            [
                'price' => 49000,
                'features' => ['Desain Standar', 'Buku Tamu', 'Masa Aktif 30 Hari'],
                'max_guests' => 150,
                'duration_days' => 30
            ]
        );

        $premiumPkg = Package::firstOrCreate(
            ['name' => 'PREMIUM'],
            [
                'price' => 99000,
                'features' => ['Desain Premium', 'Buku Tamu', 'Konfirmasi RSVP', 'Masa Aktif 365 Hari', 'Galeri Foto'],
                'max_guests' => 500,
                'duration_days' => 365
            ]
        );

        $customPkg = Package::firstOrCreate(
            ['name' => 'CUSTOM'],
            [
                'price' => 199000,
                'features' => ['Semua Fitur Premium', 'Desain Custom Khusus', 'Domain Custom (.com)', 'Layanan Premium VIP'],
                'max_guests' => 1000,
                'duration_days' => 365
            ]
        );

        // 2. Seed Themes
        Theme::upsert([
            ['id' => 'elegant', 'name' => 'Elegant Gold', 'thumbnail_url' => null, 'is_active' => false, 'package_level' => 'BASIC'],
            ['id' => 'rustic', 'name' => 'Rustic Bohemian', 'thumbnail_url' => null, 'is_active' => false, 'package_level' => 'BASIC'],
            ['id' => 'modern', 'name' => 'Modern Minimalist', 'thumbnail_url' => null, 'is_active' => false, 'package_level' => 'PREMIUM'],
            ['id' => 'royal-yogyakarta', 'name' => 'Royal Yogyakarta', 'thumbnail_url' => null, 'is_active' => false, 'package_level' => 'PREMIUM'],
            ['id' => 'botanical-minimal', 'name' => 'Botanical Minimal', 'thumbnail_url' => null, 'is_active' => false, 'package_level' => 'BASIC'],
            ['id' => 'editorial-mono', 'name' => 'Editorial Mono', 'thumbnail_url' => null, 'is_active' => false, 'package_level' => 'PREMIUM'],
            ['id' => 'theme-1', 'name' => 'Burgundy Bloom', 'thumbnail_url' => '/assets/theme_1/burgundy-envelope-closed.png', 'is_active' => true, 'package_level' => 'PREMIUM'],
            ['id' => 'custom-theme-1', 'name' => 'Custom Theme 1', 'thumbnail_url' => '/assets/theme_1/burgundy-envelope-closed.png', 'is_active' => false, 'package_level' => 'CUSTOM'],
            ['id' => 'theme-2', 'name' => 'Premium 10 Animasi', 'thumbnail_url' => null, 'is_active' => true, 'package_level' => 'PREMIUM'],
            ['id' => 'theme-3', 'name' => 'Burgundy Bloom V2', 'thumbnail_url' => '/assets/theme_1/burgundy-envelope-closed.png', 'is_active' => false, 'package_level' => 'PREMIUM'],
        ], ['id'], ['name', 'thumbnail_url', 'is_active', 'package_level']);

        // 2b. Seed Music
        $tracks = [
            [
                'title' => 'Jedag Jedug Gamelan',
                'artist' => 'Unknown Artist',
                'url' => '/assets/music/jedag-jedug-gamelan.mp3',
                'is_active' => true,
            ],
            [
                'title' => 'A Thousand Years',
                'artist' => 'Christina Perri',
                'url' => '/uploads/a_thousand_years.mp3',
                'is_active' => true,
            ],
            [
                'title' => 'Marry Me',
                'artist' => 'Train',
                'url' => '/uploads/marry_me.mp3',
                'is_active' => true,
            ],
            [
                'title' => 'Beautiful in White',
                'artist' => 'Westlife',
                'url' => '/uploads/beautiful_in_white.mp3',
                'is_active' => true,
            ],
        ];

        foreach ($tracks as $track) {
            Music::firstOrCreate(
                ['title' => $track['title']],
                [
                    'artist' => $track['artist'],
                    'url' => $track['url'],
                    'is_active' => $track['is_active'],
                ]
            );
        }

        // 3. Seed Users
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin Ngaturi',
                'password' => bcrypt('password'),
                'role' => 'ADMIN',
                'status' => 'ACTIVE',
            ]
        );

        $ilyas = User::updateOrCreate(
            ['email' => 'ilyas@example.com'],
            [
                'name' => 'Ilyas',
                'password' => bcrypt('password'),
                'role' => 'USER',
                'status' => 'ACTIVE',
            ]
        );

        // 4. Seed Custom Order & Transaction for Ilyas
        $order = Order::updateOrCreate(
            [
                'user_id' => $ilyas->id,
                'package_id' => $customPkg->id,
            ],
            [
                'status' => 'PAID',
                'amount' => $customPkg->price,
                'payment_method' => 'MANUAL',
                'paid_at' => now(),
            ]
        );

        Transaction::updateOrCreate(
            [
                'order_id' => $order->id,
            ],
            [
                'gateway_ref' => 'MANUAL-SEEDER',
                'status' => 'success',
                'payload' => ['status' => 'success', 'seeded' => true],
            ]
        );

        // 4b. Seed User & Premium Order & Transaction for Ilyas 2 (Theme 2)
        $ilyas2 = User::updateOrCreate(
            ['email' => 'ilyas2@example.com'],
            [
                'name' => 'Ilyas Theme 2',
                'password' => bcrypt('password'),
                'role' => 'USER',
                'status' => 'ACTIVE',
            ]
        );

        $order2 = Order::updateOrCreate(
            [
                'user_id' => $ilyas2->id,
                'package_id' => $premiumPkg->id,
            ],
            [
                'status' => 'PAID',
                'amount' => $premiumPkg->price,
                'payment_method' => 'MANUAL',
                'paid_at' => now(),
            ]
        );

        // 4c. Seed User & Premium Order & Transaction for Ilyas 3 (Theme 3)
        $ilyas3 = User::updateOrCreate(
            ['email' => 'ilyas3@example.com'],
            [
                'name' => 'Ilyas Theme 3',
                'password' => bcrypt('password'),
                'role' => 'USER',
                'status' => 'ACTIVE',
            ]
        );

        $order3 = Order::updateOrCreate(
            [
                'user_id' => $ilyas3->id,
                'package_id' => $premiumPkg->id,
            ],
            [
                'status' => 'PAID',
                'amount' => $premiumPkg->price,
                'payment_method' => 'MANUAL',
                'paid_at' => now(),
            ]
        );

        Transaction::updateOrCreate(
            [
                'order_id' => $order3->id,
            ],
            [
                'gateway_ref' => 'MANUAL-SEEDER-3',
                'status' => 'success',
                'payload' => ['status' => 'success', 'seeded' => true],
            ]
        );

        // 5. Seed Pre-configured Wedding for Ilyas
        $weddingData = [
            'groom' => [
                'name' => 'Ilyas Handsome, S.Kom',
                'nickname' => 'Ilyas',
                'parents' => 'Putra dari Bpk. Aghala Gola & Ibu Egela Egle',
                'bio' => 'Seorang tech enthusiast yang percaya bahwa setiap baris kode memiliki arti, sama seperti setiap detak jantung untuk pasangannya.',
                'ig' => '@ilyas_handsome',
                'photo' => '/assets/theme_1/foto-mempelai-pria.webp',
            ],
            'bride' => [
                'name' => 'Iftitah Beauty, S.Kom',
                'nickname' => 'Iftitah',
                'parents' => 'Putri dari Bapak Lord Capulet & Ibu Lady Capulet',
                'bio' => 'Pencinta seni dan keindahan yang menemukan harmoni dan kebahagiaan sejati dalam langkah kebersamaan bersama Ilyas.',
                'ig' => '@Iftitah_beauty',
                'photo' => '/assets/theme_1/foto-mempelai-cewe.webp',
            ],
            'schedule' => [
                'akad' => [
                    'date' => '2026-09-21',
                    'time' => '09:00 - 11:00 WIB',
                    'venue' => 'Masjid Raya Al-Jihad',
                    'address' => 'Jl. Kebahagiaan No. 88, Menteng, Jakarta Pusat',
                    'maps' => 'https://maps.app.goo.gl/example',
                ],
                'resepsi' => [
                    'date' => '2026-09-21',
                    'time' => '11:00 - 13:00 WIB',
                    'venue' => 'Gedung Golden Ballroom',
                    'address' => 'Jl. Harmoni Indah No. 12, Menteng, Jakarta Pusat',
                    'maps' => 'https://maps.app.goo.gl/example',
                ],
            ],
            'stories' => [
                [
                    'year' => '2024',
                    'title' => 'Awal Mula Bertemu',
                    'content' => 'Pertemuan pertama kami bermula di sebuah perpustakaan kota. Percakapan singkat tentang buku favorit menumbuhkan ketertarikan yang tak terduga.',
                ],
                [
                    'year' => '2025',
                    'title' => 'Mengikat Komitmen',
                    'content' => 'Setelah melewati banyak tawa dan cerita, kami memutuskan untuk saling berkomitmen membangun masa depan bersama dengan restu dari kedua keluarga.',
                ],
                [
                    'year' => '2026',
                    'title' => 'Menuju Pernikahan',
                    'content' => 'Hari ini, kami berdua berjanji di hadapan Tuhan dan keluarga besar untuk melangkah bersama sebagai suami istri dalam ikatan suci pernikahan.',
                ],
            ],
            'quotes' => [
                'text' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.',
                'source' => '(Qs. Ar-Rum : 21)',
            ],
            'customStyle' => [
                'primaryColor' => '#6B1D2F',
                'secondaryColor' => '#D4AF37',
                'baseBg' => '#FCF9F6',
                'textColor' => '#2D1A1E',
                'titleFont' => 'font-serif',
                'bodyFont' => 'font-sans',
                'musicUrl' => '/assets/music/jedag-jedug-gamelan.mp3',
            ],
            'musicUrl' => '/assets/music/jedag-jedug-gamelan.mp3',
        ];

        // Theme 1 Wedding for Ilyas
        Wedding::updateOrCreate(
            ['user_id' => $ilyas->id],
            [
                'theme_id' => 'custom-theme-1',
                'slug' => 'ilyas',
                'status' => 'published',
                'expired_at' => now()->addDays(365),
                'data' => $weddingData,
            ]
        );

        // Theme 2 Wedding for Ilyas 2
        Wedding::updateOrCreate(
            ['user_id' => $ilyas2->id],
            [
                'theme_id' => 'theme-2',
                'slug' => 'ilyas2',
                'status' => 'published',
                'expired_at' => now()->addDays(365),
                'data' => $weddingData,
            ]
        );

        // Theme 3 Wedding for Ilyas 3
        Wedding::updateOrCreate(
            ['user_id' => $ilyas3->id],
            [
                'theme_id' => 'theme-3',
                'slug' => 'ilyas3',
                'status' => 'published',
                'expired_at' => now()->addDays(365),
                'data' => $weddingData,
            ]
        );
    }
}
