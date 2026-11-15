<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use App\Models\Photo;
use App\Models\Music;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeController extends Controller
{
    public function index()
    {
        try {
            $list = Theme::where('is_active', true)->get()->map(fn ($theme) => [
                'id' => $theme->id,
                'name' => $theme->name,
                'thumbnailUrl' => $theme->thumbnail_url,
                'isActive' => $theme->is_active,
                'packageLevel' => $theme->package_level,
                'code' => $theme->code,
                'tierCode' => $theme->tier_code,
                'demoUrl' => $theme->demo_url,
            ]);

            return response()->json(['status' => 'success', 'themes' => $list]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil daftar tema.'], 500);
        }
    }

    /**
     * Render live interactive demo of a theme at /demo/{tier}/{code}
     */
    public function renderDemo(Request $request, $tier, $code)
    {
        $theme = $this->resolveTheme($tier, $code);

        if (!$theme) {
            return Inertia::render('demo/ThemeNotFound', [
                'tier' => $tier,
                'code' => $code,
            ]);
        }

        $demoData = $this->getSampleWeddingData($theme);

        return Inertia::render('demo/ThemeDemo', [
            'theme' => [
                'id' => $theme->id,
                'name' => $theme->name,
                'code' => $theme->code,
                'tierCode' => $theme->tier_code,
                'packageLevel' => $theme->package_level,
                'demoUrl' => $theme->demo_url,
                'thumbnailUrl' => $theme->thumbnail_url,
            ],
            'wedding' => $demoData['wedding'],
            'wishes' => $demoData['wishes'],
            'isDemo' => true,
        ]);
    }

    /**
     * API endpoint to get demo data as JSON
     */
    public function getDemoData(Request $request, $tier, $code)
    {
        $theme = $this->resolveTheme($tier, $code);

        if (!$theme) {
            return response()->json([
                'status' => 'error',
                'message' => 'Template demo tidak ditemukan.',
            ], 404);
        }

        $demoData = $this->getSampleWeddingData($theme);

        return response()->json([
            'status' => 'success',
            'theme' => [
                'id' => $theme->id,
                'name' => $theme->name,
                'code' => $theme->code,
                'tierCode' => $theme->tier_code,
                'packageLevel' => $theme->package_level,
                'demoUrl' => $theme->demo_url,
            ],
            'wedding' => $demoData['wedding'],
            'wishes' => $demoData['wishes'],
            'isDemo' => true,
        ]);
    }

    /**
     * Resolve theme by tier and code (or id fallback)
     */
    protected function resolveTheme($tier, $code)
    {
        $tierCode = strtolower($tier);
        $cleanCode = strtolower(trim($code));

        // 1. Try exact match by code
        $theme = Theme::where('code', $cleanCode)->first();

        // 2. Try match by theme id as fallback
        if (!$theme) {
            $theme = Theme::where('id', $cleanCode)->first();
        }

        return $theme;
    }

    /**
     * Generate rich, complete sample wedding data for demo preview
     */
    protected function getSampleWeddingData(Theme $theme): array
    {
        $weddingData = [
            'groom' => [
                'name' => 'Raden Bagus Ilyas, S.Kom',
                'nickname' => 'Ilyas',
                'parents' => 'Putra pertama dari Bpk. Ir. H. Ahmad Santoso & Ibu Hj. Siti Rohmah',
                'bio' => 'Seorang tech enthusiast yang percaya bahwa setiap baris kode memiliki arti, sama seperti detak jantung untuk pasangannya.',
                'ig' => '@ilyas_bagus',
                'photo' => '/assets/theme_1/foto-mempelai-pria.webp',
                'bankName' => 'Bank BCA',
                'accountNumber' => '8820192841',
                'accountHolder' => 'Raden Bagus Ilyas',
            ],
            'bride' => [
                'name' => 'Iftitah Nurul Beauty, S.Pd',
                'nickname' => 'Iftitah',
                'parents' => 'Putri kedua dari Bpk. Drs. H. Bambang Wijaya & Ibu Hj. Nur Aini',
                'bio' => 'Pencinta seni dan keindahan yang menemukan harmoni dan kebahagiaan sejati dalam langkah kebersamaan bersama Ilyas.',
                'ig' => '@iftitah_beauty',
                'photo' => '/assets/theme_1/foto-mempelai-cewe.webp',
                'bankName' => 'Bank Mandiri',
                'accountNumber' => '1370019284910',
                'accountHolder' => 'Iftitah Nurul Beauty',
            ],
            'schedule' => [
                'akad' => [
                    'date' => '2026-10-24',
                    'time' => '08:00 - 10:00 WIB',
                    'venue' => 'Masjid Agung Al-Ikhlas',
                    'address' => 'Jl. Melati Indah No. 45, Kebayoran Baru, Jakarta Selatan',
                    'maps' => 'https://maps.google.com',
                ],
                'resepsi' => [
                    'date' => '2026-10-24',
                    'time' => '11:00 - 14:00 WIB',
                    'venue' => 'The Glass House Grand Ballroom',
                    'address' => 'Jl. Sudirman Boulevard No. 108, Jakarta Selatan',
                    'maps' => 'https://maps.google.com',
                ],
            ],
            'stories' => [
                [
                    'year' => '2022',
                    'title' => 'Awal Berjumpa',
                    'content' => 'Pertemuan pertama kami bermula di sebuah perpustakaan kota saat sore hari. Percakapan singkat tentang buku favorit menumbuhkan ketertarikan yang tak terduga.',
                ],
                [
                    'year' => '2024',
                    'title' => 'Mengikat Janji',
                    'content' => 'Setelah melewati banyak tawa, cerita, dan ujian bersama, kami memutuskan untuk saling berkomitmen membangun masa depan dengan restu kedua keluarga.',
                ],
                [
                    'year' => '2026',
                    'title' => 'Melangkah Menuju Halal',
                    'content' => 'Hari ini, dengan memohon rahmat dan ridho Allah SWT, kami berdua berikrar suci untuk melangkah bersama sebagai sepasang suami istri.',
                ],
            ],
            'quotes' => [
                'text' => 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.',
                'source' => 'QS. Ar-Rum Ayat 21',
            ],
            'customStyle' => [
                'primaryColor' => $theme->package_level === 'BASIC' ? '#2D4F3E' : '#6B1D2F',
                'secondaryColor' => $theme->package_level === 'BASIC' ? '#C2A676' : '#D4AF37',
                'baseBg' => '#F7F5F0',
                'textColor' => '#243028',
                'titleFont' => 'font-serif',
                'bodyFont' => 'font-sans',
                'musicUrl' => '/assets/music/jedag-jedug-gamelan.mp3',
                'giftAddress' => 'Perumahan Griya Asri Blok B3 No. 12, Cilandak, Jakarta Selatan 12430 (Penerima: Ilyas & Iftitah - 081234567890)',
            ],
            'musicUrl' => '/assets/music/jedag-jedug-gamelan.mp3',
            'sections' => [
                'showStory' => true,
                'showGallery' => true,
                'showQuotes' => true,
                'showGift' => true,
                'showRsvp' => true,
                'showWishes' => true,
            ],
        ];

        $photos = [
            ['id' => '1', 'url' => '/assets/theme_1/gallery1.webp', 'order' => 1],
            ['id' => '2', 'url' => '/assets/theme_1/gallery2.webp', 'order' => 2],
            ['id' => '3', 'url' => '/assets/theme_1/gallery3.webp', 'order' => 3],
            ['id' => '4', 'url' => '/assets/theme_1/gallery4.webp', 'order' => 4],
            ['id' => '5', 'url' => '/assets/theme_1/gallery6.webp', 'order' => 5],
            ['id' => '6', 'url' => '/assets/theme_1/gallery7.webp', 'order' => 6],
        ];

        $wishes = [
            [
                'id' => 'w1',
                'name' => 'Dimas & Anisa',
                'message' => 'Selamat menempuh hidup baru Ilyas & Iftitah! Semoga sakinah mawaddah warahmah, dilancarkan sampai hari H dan selamanya.',
                'createdAt' => now()->subHours(2)->toIso8601String(),
                'rsvpStatus' => 'hadir',
            ],
            [
                'id' => 'w2',
                'name' => 'Fajar Pratama',
                'message' => 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khoir. Selamat bro, lancar selalu!',
                'createdAt' => now()->subHours(5)->toIso8601String(),
                'rsvpStatus' => 'hadir',
            ],
            [
                'id' => 'w3',
                'name' => 'Keluarga Besar Bpk. Hendra',
                'message' => 'Selamat untuk kedua mempelai dan keluarga besar. Semoga ikatan suci ini senantiasa diberkahi Allah SWT.',
                'createdAt' => now()->subDay()->toIso8601String(),
                'rsvpStatus' => 'hadir',
            ],
        ];

        $wedding = [
            'id' => 'demo-' . $theme->id,
            'slug' => 'demo-' . ($theme->code ?: $theme->id),
            'status' => 'published',
            'theme_id' => $theme->id,
            'themeId' => $theme->id,
            'themeName' => $theme->name,
            'data' => $weddingData,
            'photos' => $photos,
            'expiredAt' => null,
        ];

        return [
            'wedding' => $wedding,
            'wishes' => $wishes,
        ];
    }
}
