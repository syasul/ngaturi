<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class GuestController extends Controller
{
    // 1. GET /api/guests/public/wishes/{weddingId} - Get public visible wishes
    public function getPublicWishes($weddingId)
    {
        try {
            $wishes = Guest::select(['id', 'name', 'rsvp_status', 'message', 'created_at'])
                ->where('wedding_id', $weddingId)
                ->where('is_message_visible', true)
                ->whereNotNull('message')
                ->latest()
                ->get();

            return response()->json(['status' => 'success', 'wishes' => $wishes]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil ucapan tamu.'], 500);
        }
    }

    // 2. GET /api/guests/public/by-token/{token} - Get guest by token
    public function getPublicGuestByToken($token)
    {
        try {
            $guest = Guest::where('unique_token', $token)->first();

            if (!$guest) {
                return response()->json(['status' => 'error', 'message' => 'Tamu tidak ditemukan.'], 404);
            }

            return response()->json(['status' => 'success', 'guest' => $guest]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil data tamu.'], 500);
        }
    }

    // 3. POST /api/guests/public/rsvp - Submit RSVP from public page
    public function submitPublicRsvp(Request $request)
    {
        try {
            $uniqueToken = $request->input('uniqueToken');
            $rsvpStatus = $request->input('rsvpStatus');
            $message = $request->input('message');

            if (!$uniqueToken || !$rsvpStatus) {
                return response()->json(['status' => 'error', 'message' => 'Token dan Status RSVP wajib diisi.'], 400);
            }

            $guest = Guest::where('unique_token', $uniqueToken)->first();

            if (!$guest) {
                return response()->json(['status' => 'error', 'message' => 'Data tamu tidak valid.'], 400);
            }

            $guest->update([
                'rsvp_status' => $rsvpStatus,
                'message' => $message ?: null,
                'is_message_visible' => true,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Konfirmasi kehadiran berhasil dikirim.',
                'guest' => $guest,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengirim konfirmasi kehadiran.'], 500);
        }
    }

    // 4. GET /api/guests - Get guests for current user's wedding
    public function index(Request $request)
    {
        $user = Auth::user();
        $searchQuery = $request->query('q', '');
        try {
            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'success', 'guests' => []]);
            }

            $query = Guest::where('wedding_id', $wedding->id);

            if ($searchQuery) {
                $query->where('name', 'like', "%{$searchQuery}%");
            }

            $list = $query->latest()->get();

            return response()->json(['status' => 'success', 'guests' => $list]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil daftar tamu.'], 500);
        }
    }

    // 5. GET /api/guests/stats - Get RSVP and Wishes analytics
    public function stats()
    {
        $user = Auth::user();
        try {
            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json([
                    'status' => 'success',
                    'stats' => ['total' => 0, 'attending' => 0, 'declined' => 0, 'tentative' => 0, 'pending' => 0],
                ]);
            }

            $stats = Guest::where('wedding_id', $wedding->id)
                ->selectRaw('rsvp_status, count(id) as count')
                ->groupBy('rsvp_status')
                ->get();

            $result = [
                'total' => 0,
                'attending' => 0,
                'declined' => 0,
                'tentative' => 0,
                'pending' => 0,
            ];

            foreach ($stats as $row) {
                $count = (int) $row->count;
                $result['total'] += $count;
                $status = $row->rsvp_status;

                if ($status === 'attending' || $status === 'hadir') {
                    $result['attending'] += $count;
                } elseif ($status === 'declined' || $status === 'tidak hadir') {
                    $result['declined'] += $count;
                } elseif ($status === 'tentative' || $status === 'ragu-ragu') {
                    $result['tentative'] += $count;
                } else {
                    $result['pending'] += $count;
                }
            }

            return response()->json(['status' => 'success', 'stats' => $result]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil statistik tamu.'], 500);
        }
    }

    // 6. POST /api/guests - Add guest manually
    public function store(Request $request)
    {
        $user = Auth::user();
        try {
            $name = $request->input('name');
            $phone = $request->input('phone');

            if (!$name) {
                return response()->json(['status' => 'error', 'message' => 'Nama tamu wajib diisi.'], 400);
            }

            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Buat undangan Anda terlebih dahulu.'], 400);
            }

            $uniqueToken = Str::random(8) . '-' . Str::random(4);

            $guest = Guest::create([
                'wedding_id' => $wedding->id,
                'name' => $name,
                'phone' => $phone ?: null,
                'unique_token' => $uniqueToken,
                'rsvp_status' => 'pending',
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Tamu berhasil ditambahkan.',
                'guest' => $guest,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menambahkan tamu.'], 500);
        }
    }

    // 7. POST /api/guests/import - Bulk import guests
    public function import(Request $request)
    {
        $user = Auth::user();
        try {
            $guestList = $request->input('guests');

            if (!is_array($guestList) || empty($guestList)) {
                return response()->json(['status' => 'error', 'message' => 'Daftar tamu kosong atau format tidak valid.'], 400);
            }

            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Buat undangan Anda terlebih dahulu.'], 400);
            }

            $inserted = [];
            foreach ($guestList as $g) {
                $uniqueToken = Str::random(8) . '-' . Str::random(4);
                $inserted[] = Guest::create([
                    'wedding_id' => $wedding->id,
                    'name' => $g['name'],
                    'phone' => $g['phone'] ?: null,
                    'unique_token' => $uniqueToken,
                    'rsvp_status' => 'pending',
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => count($inserted) . ' tamu berhasil diimport.',
                'guests' => $inserted,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengimport daftar tamu.'], 500);
        }
    }

    // 8. PUT /api/guests/{id} - Update guest info
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        try {
            $name = $request->input('name');
            $phone = $request->input('phone');
            $rsvpStatus = $request->input('rsvpStatus');
            $message = $request->input('message');
            $isMessageVisible = $request->input('isMessageVisible');

            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Akses ditolak.'], 403);
            }

            $guest = Guest::where('id', $id)->where('wedding_id', $wedding->id)->first();

            if (!$guest) {
                return response()->json(['status' => 'error', 'message' => 'Tamu tidak ditemukan.'], 404);
            }

            $updateFields = [];
            if ($name !== null) $updateFields['name'] = $name;
            if ($phone !== null) $updateFields['phone'] = $phone;
            if ($rsvpStatus !== null) $updateFields['rsvp_status'] = $rsvpStatus;
            if ($message !== null) $updateFields['message'] = $message;
            if ($isMessageVisible !== null) $updateFields['is_message_visible'] = $isMessageVisible;

            $guest->update($updateFields);

            return response()->json([
                'status' => 'success',
                'message' => 'Data tamu berhasil diperbarui.',
                'guest' => $guest,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal memperbarui data tamu.'], 500);
        }
    }

    // 9. DELETE /api/guests/{id} - Delete guest
    public function destroy($id)
    {
        $user = Auth::user();
        try {
            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Akses ditolak.'], 403);
            }

            $guest = Guest::where('id', $id)->where('wedding_id', $wedding->id)->first();

            if (!$guest) {
                return response()->json(['status' => 'error', 'message' => 'Tamu tidak ditemukan.'], 404);
            }

            $guest->delete();

            return response()->json(['status' => 'success', 'message' => 'Tamu berhasil dihapus.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menghapus tamu.'], 500);
        }
    }

    // 10. POST /api/guests/bulk-delete - Delete multiple guests
    public function bulkDelete(Request $request)
    {
        $user = Auth::user();
        try {
            $ids = $request->input('ids');

            if (!is_array($ids) || empty($ids)) {
                return response()->json(['status' => 'error', 'message' => 'Pilih tamu yang ingin dihapus.'], 400);
            }

            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Akses ditolak.'], 403);
            }

            $deletedCount = Guest::whereIn('id', $ids)->where('wedding_id', $wedding->id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => $deletedCount . ' tamu berhasil dihapus.',
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menghapus beberapa tamu.'], 500);
        }
    }

    // 11. POST /api/guests/checkin - QR Scan checkin
    public function checkin(Request $request)
    {
        $user = Auth::user();
        try {
            $uniqueToken = $request->input('uniqueToken');

            if (!$uniqueToken) {
                return response()->json(['status' => 'error', 'message' => 'Token QR Code wajib diisi.'], 400);
            }

            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Undangan tidak ditemukan.'], 404);
            }

            $guest = Guest::where('unique_token', $uniqueToken)->where('wedding_id', $wedding->id)->first();

            if (!$guest) {
                return response()->json(['status' => 'error', 'message' => 'Token QR Code tidak valid untuk undangan Anda.'], 400);
            }

            $alreadyAttending = ($guest->rsvp_status === 'attending' || $guest->rsvp_status === 'hadir');

            $guest->update(['rsvp_status' => 'attending']);

            return response()->json([
                'status' => 'success',
                'message' => $alreadyAttending
                    ? "{$guest->name} sudah melakukan check-in sebelumnya."
                    : "{$guest->name} berhasil check-in kehadiran!",
                'guest' => $guest,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal memproses check-in QR Code.'], 500);
        }
    }
}
