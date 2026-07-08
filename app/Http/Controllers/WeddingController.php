<?php

namespace App\Http\Controllers;

use App\Models\Wedding;
use App\Models\Photo;
use App\Models\Order;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WeddingController extends Controller
{
    public function renderPublicInvitation($slug)
    {
        return Inertia::render('public/InvitationPublic', [
            'slug' => $slug
        ]);
    }

    public function renderPublicPreview($slug)
    {
        return Inertia::render('public/InvitationPublic', [
            'slug' => $slug
        ]);
    }

    // 1. GET /api/weddings/public/{slug} - Get public wedding details
    public function getPublic($slug)
    {
        try {
            $wedding = Wedding::with('theme')
                ->where('slug', strtolower($slug))
                ->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Undangan tidak ditemukan.'], 404);
            }

            // Fetch associated photos
            $photos = Photo::where('wedding_id', $wedding->id)
                ->orderBy('order')
                ->get();

            return response()->json([
                'status' => 'success',
                'wedding' => array_merge($wedding->toArray(), [
                    'themeName' => $wedding->theme ? $wedding->theme->name : null,
                    'themeId' => $wedding->theme_id,
                    'photos' => $photos
                ])
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil data undangan.'], 500);
        }
    }

    // 2. GET /api/weddings/check-slug/{slug} - Check if slug is available
    public function checkSlug($slug)
    {
        $slug = strtolower($slug);

        if (!preg_match('/^[a-z0-9-]+$/', $slug)) {
            return response()->json(['status' => 'success', 'available' => false, 'message' => 'Format slug tidak valid']);
        }

        try {
            $existing = Wedding::where('slug', $slug)->first();
            return response()->json(['status' => 'success', 'available' => !$existing]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal memeriksa ketersediaan URL.'], 500);
        }
    }

    // 3. GET /api/weddings/me - Get user's current wedding
    public function getMe()
    {
        $user = Auth::user();
        try {
            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'success', 'wedding' => null]);
            }

            // Load user package details from latest paid order
            $latestPaidOrder = Order::with('package')
                ->where('user_id', $user->id)
                ->where('status', 'PAID')
                ->latest()
                ->first();

            $userPackage = $latestPaidOrder && $latestPaidOrder->package ? [
                'packageName' => $latestPaidOrder->package->name,
                'maxGuests' => $latestPaidOrder->package->maxGuests,
                'features' => $latestPaidOrder->package->features,
            ] : [
                'packageName' => 'BASIC',
                'maxGuests' => 100,
                'features' => [],
            ];

            // Fetch photos
            $photos = Photo::where('wedding_id', $wedding->id)
                ->orderBy('order')
                ->get();

            return response()->json([
                'status' => 'success',
                'wedding' => array_merge($wedding->toArray(), [
                    'photos' => $photos,
                    'package' => $userPackage,
                    'themeId' => $wedding->theme_id,
                ])
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil data undangan Anda.'], 500);
        }
    }

    // 4. POST /api/weddings - Create a wedding
    public function store(Request $request)
    {
        $user = Auth::user();
        try {
            $slug = $request->input('slug');
            $themeId = $request->input('themeId');

            if (!$slug || !$themeId) {
                return response()->json(['status' => 'error', 'message' => 'Slug URL dan Tema wajib diisi.'], 400);
            }

            $normalizedSlug = strtolower($slug);

            // Check if slug taken
            if (Wedding::where('slug', $normalizedSlug)->exists()) {
                return response()->json(['status' => 'error', 'message' => 'Slug URL sudah digunakan.'], 400);
            }

            // Check if user already has a wedding
            if (Wedding::where('user_id', $user->id)->exists()) {
                return response()->json(['status' => 'error', 'message' => 'Anda sudah membuat undangan.'], 400);
            }

            // Get package expiration duration
            $latestPaidOrder = Order::with('package')
                ->where('user_id', $user->id)
                ->where('status', 'PAID')
                ->latest()
                ->first();

            $durationDays = $latestPaidOrder && $latestPaidOrder->package ? $latestPaidOrder->package->duration_days : 90;
            $expiredAt = now()->addDays($durationDays);

            $wedding = Wedding::create([
                'user_id' => $user->id,
                'slug' => $normalizedSlug,
                'theme_id' => $themeId,
                'status' => 'draft',
                'expired_at' => $expiredAt,
                'data' => [],
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Undangan berhasil dibuat.',
                'wedding' => $wedding
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal membuat undangan.'], 500);
        }
    }

    // 5. PUT /api/weddings/me - Update wedding details
    public function update(Request $request)
    {
        $user = Auth::user();
        try {
            $data = $request->input('data');

            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Undangan tidak ditemukan.'], 404);
            }

            $wedding->update([
                'data' => $data,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Undangan berhasil disimpan.',
                'wedding' => array_merge($wedding->toArray(), [
                    'themeId' => $wedding->theme_id,
                ])
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menyimpan detail undangan.'], 500);
        }
    }

    // 6. PUT /api/weddings/me/slug - Change wedding slug
    public function changeSlug(Request $request)
    {
        $user = Auth::user();
        try {
            $slug = $request->input('slug');

            if (!$slug) {
                return response()->json(['status' => 'error', 'message' => 'Slug URL wajib diisi.'], 400);
            }

            $normalizedSlug = strtolower($slug);

            if (!preg_match('/^[a-z0-9-]+$/', $normalizedSlug)) {
                return response()->json(['status' => 'error', 'message' => 'Format URL tidak valid.'], 400);
            }

            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Undangan tidak ditemukan.'], 404);
            }

            // Check uniqueness
            $taken = Wedding::where('slug', $normalizedSlug)
                ->where('id', '!=', $wedding->id)
                ->first();

            if ($taken) {
                return response()->json(['status' => 'error', 'message' => 'Slug URL sudah digunakan oleh pengguna lain.'], 400);
            }

            $wedding->update([
                'slug' => $normalizedSlug
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'URL Undangan berhasil diubah.',
                'wedding' => $wedding
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengubah URL.'], 500);
        }
    }

    // 7. PUT /api/weddings/me/theme - Change wedding theme
    public function changeTheme(Request $request)
    {
        $user = Auth::user();
        try {
            $themeId = $request->input('themeId');

            if (!$themeId) {
                return response()->json(['status' => 'error', 'message' => 'Tema wajib dipilih.'], 400);
            }

            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Undangan tidak ditemukan.'], 404);
            }

            $wedding->update([
                'theme_id' => $themeId
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Tema berhasil diubah.',
                'wedding' => array_merge($wedding->toArray(), [
                    'themeId' => $wedding->theme_id,
                ])
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengubah tema.'], 500);
        }
    }

    // 8. PUT /api/weddings/me/status - Toggle draft/publish status
    public function toggleStatus(Request $request)
    {
        $user = Auth::user();
        try {
            $status = $request->input('status');

            if ($status !== 'draft' && $status !== 'published') {
                return response()->json(['status' => 'error', 'message' => 'Status tidak valid.'], 400);
            }

            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Undangan tidak ditemukan.'], 404);
            }

            $wedding->update([
                'status' => $status
            ]);

            return response()->json([
                'status' => 'success',
                'message' => $status === 'published' ? 'Undangan berhasil diterbitkan!' : 'Undangan berhasil diubah ke draft.',
                'wedding' => $wedding
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengubah status publikasi.'], 500);
        }
    }

    // 9. DELETE /api/weddings/me - Delete wedding
    public function destroy()
    {
        $user = Auth::user();
        try {
            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Undangan tidak ditemukan.'], 404);
            }

            $wedding->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Undangan berhasil dihapus.'
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menghapus undangan.'], 500);
        }
    }
}
