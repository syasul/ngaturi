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
            $list = Theme::where('is_active', true)->get()->map(function ($theme) {
                $screenshot = '/assets/themes/' . $theme->id . '.png';
                $thumb = file_exists(public_path('assets/themes/' . $theme->id . '.png'))
                    ? $screenshot
                    : ($theme->thumbnail_url ?: $screenshot);

                return [
                    'id' => $theme->id,
                    'name' => $theme->name,
                    'thumbnailUrl' => $thumb,
                    'isActive' => $theme->is_active,
                    'packageLevel' => $theme->package_level,
                    'code' => $theme->code,
                    'tierCode' => $theme->tier_code,
                    'demoUrl' => $theme->demo_url,
                ];
            });

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
     * Resolve theme by tier and code (or id fallback) with self-healing fallback
     */
    protected function resolveTheme($tier, $code)
    {
        $cleanCode = strtolower(trim($code));

        $knownCodes = [
            'tv6akl' => 'basic-1',
            'b2x8k1' => 'basic-2',
            'b3v7x2' => 'basic-3',
            'b4k8n1' => 'basic-4',
            'b5w9p3' => 'basic-5',
            'b6m4k2' => 'basic-6',
            'b7p9x5' => 'basic-7',
            'b8s3t7' => 'basic-8',
            'b9e2r8' => 'basic-9',
            'b10w7q' => 'basic-10',
            'b11n9x' => 'basic-11',
            'b12c4v' => 'basic-12',
            'b13r8m' => 'basic-13',
            'b14p7k' => 'basic-14',
            'b15e2w' => 'basic-15',
            'b16a5z' => 'basic-16',
            'b17l3d' => 'basic-17',
            'b18d6s' => 'basic-18',
            'b19c8p' => 'basic-19',
            'b20o1r' => 'basic-20',
            'emikvq' => 'theme-1',
            't2ltgr' => 'theme-2',
            'rgudhs' => 'custom-theme-1',
            'u6etuk' => 'elegant',
            'c3j55t' => 'rustic',
            'auildo' => 'modern',
            'mowx32' => 'royal-yogyakarta',
            'bzuqtb' => 'botanical-minimal',
            '94shhu' => 'editorial-mono',
            'w616j1' => 'theme-3',
        ];

        // 1. Try exact match by code (if column exists)
        try {
            $theme = Theme::where('code', $cleanCode)->first();
        } catch (\Throwable $e) {
            $theme = null;
        }

        // 2. Try match by theme id as fallback
        if (!$theme) {
            $theme = Theme::where('id', $cleanCode)->first();
        }

        // 3. Try match from predefined known codes
        if (!$theme && isset($knownCodes[$cleanCode])) {
            $themeId = $knownCodes[$cleanCode];
            $theme = Theme::find($themeId);
        }

        // 4. Auto-healing for basic-1 if requested (e.g. migrate hasn't been run on server)
        if (!$theme && in_array($cleanCode, ['tv6akl', 'basic-1', 'basic', 'b-1'])) {
            try {
                $theme = Theme::firstOrCreate(
                    ['id' => 'basic-1'],
                    [
                        'name' => 'Minimalist Sage',
                        'code' => 'tv6akl',
                        'thumbnail_url' => '/assets/wedding/couple-foliage.png',
                        'is_active' => true,
                        'package_level' => 'BASIC',
                    ]
                );
                if (empty($theme->code)) {
                    $theme->code = 'tv6akl';
                    $theme->save();
                }
            } catch (\Throwable $e) {
                // In-memory fallback
                $theme = new Theme();
                $theme->id = 'basic-1';
                $theme->name = 'Minimalist Sage';
                $theme->code = 'tv6akl';
                $theme->thumbnail_url = '/assets/wedding/couple-foliage.png';
                $theme->is_active = true;
                $theme->package_level = 'BASIC';
            }
        }

        // 5. Auto-healing for basic-2 if requested
        if (!$theme && in_array($cleanCode, ['b2x8k1', 'basic-2', 'basic2', 'b-2'])) {
            try {
                $theme = Theme::firstOrCreate(
                    ['id' => 'basic-2'],
                    [
                        'name' => 'Terracotta Bloom',
                        'code' => 'b2x8k1',
                        'thumbnail_url' => '/assets/wedding/couple-rustic.png',
                        'is_active' => true,
                        'package_level' => 'BASIC',
                    ]
                );
                if (empty($theme->code)) {
                    $theme->code = 'b2x8k1';
                    $theme->save();
                }
            } catch (\Throwable $e) {
                // In-memory fallback
                $theme = new Theme();
                $theme->id = 'basic-2';
                $theme->name = 'Terracotta Bloom';
                $theme->code = 'b2x8k1';
                $theme->thumbnail_url = '/assets/wedding/couple-rustic.png';
                $theme->is_active = true;
                $theme->package_level = 'BASIC';
            }
        }

        // 6. Auto-healing for basic-3 if requested
        if (!$theme && in_array($cleanCode, ['b3v7x2', 'basic-3', 'basic3', 'b-3'])) {
            try {
                $theme = Theme::firstOrCreate(
                    ['id' => 'basic-3'],
                    [
                        'name' => 'Dusty Rose',
                        'code' => 'b3v7x2',
                        'thumbnail_url' => '/assets/wedding/hero-floral.png',
                        'is_active' => true,
                        'package_level' => 'BASIC',
                    ]
                );
                if (empty($theme->code)) {
                    $theme->code = 'b3v7x2';
                    $theme->save();
                }
            } catch (\Throwable $e) {
                // In-memory fallback
                $theme = new Theme();
                $theme->id = 'basic-3';
                $theme->name = 'Dusty Rose';
                $theme->code = 'b3v7x2';
                $theme->thumbnail_url = '/assets/wedding/hero-floral.png';
                $theme->is_active = true;
                $theme->package_level = 'BASIC';
            }
        }

        // 7. Auto-healing for basic-4 if requested
        if (!$theme && in_array($cleanCode, ['b4k8n1', 'basic-4', 'basic4', 'b-4'])) {
            try {
                $theme = Theme::firstOrCreate(
                    ['id' => 'basic-4'],
                    [
                        'name' => 'Classic Ivory Noir',
                        'code' => 'b4k8n1',
                        'thumbnail_url' => '/assets/wedding/couple-royal.png',
                        'is_active' => true,
                        'package_level' => 'BASIC',
                    ]
                );
                if (empty($theme->code)) {
                    $theme->code = 'b4k8n1';
                    $theme->save();
                }
            } catch (\Throwable $e) {
                // In-memory fallback
                $theme = new Theme();
                $theme->id = 'basic-4';
                $theme->name = 'Classic Ivory Noir';
                $theme->code = 'b4k8n1';
                $theme->thumbnail_url = '/assets/wedding/couple-royal.png';
                $theme->is_active = true;
                $theme->package_level = 'BASIC';
            }
        }

        // 8. Auto-healing for basic-5 if requested
        if (!$theme && in_array($cleanCode, ['b5w9p3', 'basic-5', 'basic5', 'b-5'])) {
            try {
                $theme = Theme::firstOrCreate(
                    ['id' => 'basic-5'],
                    [
                        'name' => 'Ocean Breeze',
                        'code' => 'b5w9p3',
                        'thumbnail_url' => '/assets/wedding/couple-foliage.png',
                        'is_active' => true,
                        'package_level' => 'BASIC',
                    ]
                );
                if (empty($theme->code)) {
                    $theme->code = 'b5w9p3';
                    $theme->save();
                }
            } catch (\Throwable $e) {
                // In-memory fallback
                $theme = new Theme();
                $theme->id = 'basic-5';
                $theme->name = 'Ocean Breeze';
                $theme->code = 'b5w9p3';
                $theme->thumbnail_url = '/assets/wedding/couple-foliage.png';
                $theme->is_active = true;
                $theme->package_level = 'BASIC';
            }
        }

        // 9. Auto-healing for basic-6 if requested
        if (!$theme && in_array($cleanCode, ['b6m4k2', 'basic-6', 'basic6', 'b-6'])) {
            try {
                $theme = Theme::firstOrCreate(
                    ['id' => 'basic-6'],
                    [
                        'name' => 'Olive Earth',
                        'code' => 'b6m4k2',
                        'thumbnail_url' => '/assets/wedding/couple-rustic.png',
                        'is_active' => true,
                        'package_level' => 'BASIC',
                    ]
                );
                if (empty($theme->code)) {
                    $theme->code = 'b6m4k2';
                    $theme->save();
                }
            } catch (\Throwable $e) {
                $theme = new Theme();
                $theme->id = 'basic-6';
                $theme->name = 'Olive Earth';
                $theme->code = 'b6m4k2';
                $theme->thumbnail_url = '/assets/wedding/couple-rustic.png';
                $theme->is_active = true;
                $theme->package_level = 'BASIC';
            }
        }

        // 10. Auto-healing for basic-7 if requested
        if (!$theme && in_array($cleanCode, ['b7p9x5', 'basic-7', 'basic7', 'b-7'])) {
            try {
                $theme = Theme::firstOrCreate(
                    ['id' => 'basic-7'],
                    [
                        'name' => 'Lavender Mist',
                        'code' => 'b7p9x5',
                        'thumbnail_url' => '/assets/wedding/hero-floral.png',
                        'is_active' => true,
                        'package_level' => 'BASIC',
                    ]
                );
                if (empty($theme->code)) {
                    $theme->code = 'b7p9x5';
                    $theme->save();
                }
            } catch (\Throwable $e) {
                $theme = new Theme();
                $theme->id = 'basic-7';
                $theme->name = 'Lavender Mist';
                $theme->code = 'b7p9x5';
                $theme->thumbnail_url = '/assets/wedding/hero-floral.png';
                $theme->is_active = true;
                $theme->package_level = 'BASIC';
            }
        }

        // 11. Auto-healing for basic-8 if requested
        if (!$theme && in_array($cleanCode, ['b8s3t7', 'basic-8', 'basic8', 'b-8'])) {
            try {
                $theme = Theme::firstOrCreate(
                    ['id' => 'basic-8'],
                    [
                        'name' => 'Golden Sunset',
                        'code' => 'b8s3t7',
                        'thumbnail_url' => '/assets/wedding/couple-rustic.png',
                        'is_active' => true,
                        'package_level' => 'BASIC',
                    ]
                );
                if (empty($theme->code)) {
                    $theme->code = 'b8s3t7';
                    $theme->save();
                }
            } catch (\Throwable $e) {
                $theme = new Theme();
                $theme->id = 'basic-8';
                $theme->name = 'Golden Sunset';
                $theme->code = 'b8s3t7';
                $theme->thumbnail_url = '/assets/wedding/couple-rustic.png';
                $theme->is_active = true;
                $theme->package_level = 'BASIC';
            }
        }

        // 12. Auto-healing for basic-9 if requested
        if (!$theme && in_array($cleanCode, ['b9e2r8', 'basic-9', 'basic9', 'b-9'])) {
            try {
                $theme = Theme::firstOrCreate(
                    ['id' => 'basic-9'],
                    [
                        'name' => 'Emerald Royal',
                        'code' => 'b9e2r8',
                        'thumbnail_url' => '/assets/wedding/couple-royal.png',
                        'is_active' => true,
                        'package_level' => 'BASIC',
                    ]
                );
                if (empty($theme->code)) {
                    $theme->code = 'b9e2r8';
                    $theme->save();
                }
            } catch (\Throwable $e) {
                $theme = new Theme();
                $theme->id = 'basic-9';
                $theme->name = 'Emerald Royal';
                $theme->code = 'b9e2r8';
                $theme->thumbnail_url = '/assets/wedding/couple-royal.png';
                $theme->is_active = true;
                $theme->package_level = 'BASIC';
            }
        }

        // 13. Auto-healing for basic-10 if requested
        if (!$theme && in_array($cleanCode, ['b10w7q', 'basic-10', 'basic10', 'b-10'])) {
            try {
                $theme = Theme::firstOrCreate(
                    ['id' => 'basic-10'],
                    [
                        'name' => 'Sakura Blossom',
                        'code' => 'b10w7q',
                        'thumbnail_url' => '/assets/wedding/hero-floral.png',
                        'is_active' => true,
                        'package_level' => 'BASIC',
                    ]
                );
                if (empty($theme->code)) {
                    $theme->code = 'b10w7q';
                    $theme->save();
                }
            } catch (\Throwable $e) {
                $theme = new Theme();
                $theme->id = 'basic-10';
                $theme->name = 'Sakura Blossom';
                $theme->code = 'b10w7q';
                $theme->thumbnail_url = '/assets/wedding/hero-floral.png';
                $theme->is_active = true;
                $theme->package_level = 'BASIC';
            }
        }

        // 14. Auto-healing for basic-11 to basic-20
        $extraBasics = [
            'basic-11' => ['name' => 'Midnight Navy', 'code' => 'b11n9x', 'thumb' => '/assets/wedding/couple-royal.png'],
            'basic-12' => ['name' => 'Champagne Luxe', 'code' => 'b12c4v', 'thumb' => '/assets/wedding/couple-royal.png'],
            'basic-13' => ['name' => 'Crimson Velvet', 'code' => 'b13r8m', 'thumb' => '/assets/wedding/hero-floral.png'],
            'basic-14' => ['name' => 'Nordic Pine', 'code' => 'b14p7k', 'thumb' => '/assets/wedding/couple-foliage.png'],
            'basic-15' => ['name' => 'Ethereal Sky', 'code' => 'b15e2w', 'thumb' => '/assets/wedding/couple-foliage.png'],
            'basic-16' => ['name' => 'Warm Amber', 'code' => 'b16a5z', 'thumb' => '/assets/wedding/couple-rustic.png'],
            'basic-17' => ['name' => 'Lilac Dream', 'code' => 'b17l3d', 'thumb' => '/assets/wedding/hero-floral.png'],
            'basic-18' => ['name' => 'Desert Sand', 'code' => 'b18d6s', 'thumb' => '/assets/wedding/couple-rustic.png'],
            'basic-19' => ['name' => 'Peachy Coral', 'code' => 'b19c8p', 'thumb' => '/assets/wedding/hero-floral.png'],
            'basic-20' => ['name' => 'Pearl Opal', 'code' => 'b20o1r', 'thumb' => '/assets/wedding/couple-royal.png'],
        ];

        foreach ($extraBasics as $bId => $bInfo) {
            $num = str_replace('basic-', '', $bId);
            if (!$theme && in_array($cleanCode, [$bInfo['code'], $bId, 'basic' . $num, 'b-' . $num])) {
                try {
                    $theme = Theme::firstOrCreate(
                        ['id' => $bId],
                        [
                            'name' => $bInfo['name'],
                            'code' => $bInfo['code'],
                            'thumbnail_url' => $bInfo['thumb'],
                            'is_active' => true,
                            'package_level' => 'BASIC',
                        ]
                    );
                    if (empty($theme->code)) {
                        $theme->code = $bInfo['code'];
                        $theme->save();
                    }
                } catch (\Throwable $e) {
                    $theme = new Theme();
                    $theme->id = $bId;
                    $theme->name = $bInfo['name'];
                    $theme->code = $bInfo['code'];
                    $theme->thumbnail_url = $bInfo['thumb'];
                    $theme->is_active = true;
                    $theme->package_level = 'BASIC';
                }
                break;
            }
        }

        // Ensure theme has its code set even if legacy db row had empty code
        if ($theme && empty($theme->code)) {
            $flipped = array_flip($knownCodes);
            if (isset($flipped[$theme->id])) {
                $theme->code = $flipped[$theme->id];
            } else {
                $theme->code = $cleanCode;
            }
        }

        return $theme;
    }

    /**
     * Generate rich, complete sample wedding data for demo preview
     */
    protected function getSampleWeddingData($theme): array
    {
        $weddingData = [
            'groom' => [
                'name' => 'Arya Pratama, S.T.',
                'nickname' => 'Arya',
                'parents' => 'Putra pertama dari Bpk. Ir. H. Bambang Pratama & Ibu Hj. Rina Wulandari',
                'bio' => 'Seorang profesional muda yang menemukan kehangatan, inspirasi, dan masa depan dalam senyuman Nabila.',
                'ig' => '@arya.pratama',
                'photo' => '/assets/theme_1/foto-mempelai-pria.webp',
                'bankName' => 'Bank BCA',
                'accountNumber' => '8820192841',
                'accountHolder' => 'Arya Pratama',
            ],
            'bride' => [
                'name' => 'Nabila Putri Larasati, S.I.Kom',
                'nickname' => 'Nabila',
                'parents' => 'Putri kedua dari Bpk. Drs. H. Hendra Setiawan & Ibu Hj. Dewi Anggraini',
                'bio' => 'Pencinta seni dan literasi yang menemukan ketenangan dan kebahagiaan sejati dalam langkah kebersamaan bersama Arya.',
                'ig' => '@nabila.larasati',
                'photo' => '/assets/theme_1/foto-mempelai-cewe.webp',
                'bankName' => 'Bank Mandiri',
                'accountNumber' => '1370019284910',
                'accountHolder' => 'Nabila Putri Larasati',
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
                'giftAddress' => 'Perumahan Cempaka Indah Residence Blok B2 No. 8, Jagakarsa, Jakarta Selatan 12620 (Penerima: Arya & Nabila - 081234567890)',
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
                'name' => 'Dimas & Sarah',
                'message' => 'Selamat menempuh hidup baru Arya & Nabila! Semoga sakinah mawaddah warahmah, dilancarkan sampai hari H dan bahagia selamanya.',
                'createdAt' => now()->subHours(2)->toIso8601String(),
                'rsvpStatus' => 'hadir',
            ],
            [
                'id' => 'w2',
                'name' => 'Fajar Pratama',
                'message' => 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khoir. Selamat ya bro Arya & Nabila, lancar selalu acaranya!',
                'createdAt' => now()->subHours(5)->toIso8601String(),
                'rsvpStatus' => 'hadir',
            ],
            [
                'id' => 'w3',
                'name' => 'Keluarga Besar Bpk. Hendra',
                'message' => 'Selamat untuk kedua mempelai Arya & Nabila dan keluarga besar. Semoga ikatan suci pernikahan ini senantiasa diberkahi Allah SWT.',
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
