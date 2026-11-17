<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Order;
use App\Models\Wedding;
use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;

class NotificationController extends Controller
{
    /**
     * GET /api/notifications
     * Retrieve notifications for current user
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        try {
            // Seed initial notifications if user has zero notifications yet
            $existingCount = Notification::where('user_id', $user->id)->count();
            if ($existingCount === 0) {
                // 1. Welcome notification
                Notification::send(
                    $user->id,
                    'Selamat Datang di Ngaturi!',
                    'Akun Anda berhasil aktif. Lengkapi profil mempelai dan rancang undangan digital pernikahan Anda.',
                    'system',
                    '/dashboard/wedding-data'
                );

                // 2. Active order/package notification if exists
                $latestPaid = Order::with('package')->where('user_id', $user->id)->where('status', 'PAID')->latest()->first();
                if ($latestPaid) {
                    Notification::send(
                        $user->id,
                        'Paket ' . ($latestPaid->package?->name ?? 'Undangan') . ' Aktif',
                        'Pembayaran berhasil dikonfirmasi. Paket Anda aktif dengan akses penuh.',
                        'order',
                        '/dashboard/billing'
                    );
                }

                // 3. Wedding status & recent guest RSVPs
                $wedding = Wedding::where('user_id', $user->id)->first();
                if ($wedding) {
                    if ($wedding->status === 'published' && $wedding->slug) {
                        Notification::send(
                            $user->id,
                            'Undangan Siap Dibagikan',
                            'Undangan digital Anda /u/' . $wedding->slug . ' sudah tayang dan siap disebarkan.',
                            'wedding',
                            '/u/' . $wedding->slug
                        );
                    }

                    $recentGuests = Guest::where('wedding_id', $wedding->id)
                        ->whereNotNull('rsvp_status')
                        ->latest()
                        ->take(3)
                        ->get();

                    foreach ($recentGuests as $g) {
                        Notification::send(
                            $user->id,
                            'Konfirmasi RSVP: ' . $g->name,
                            $g->name . ' mengonfirmasi: ' . ucfirst($g->rsvp_status) . ($g->message ? ' - "' . Str::limit($g->message, 45) . '"' : ''),
                            'rsvp',
                            '/dashboard/rsvps'
                        );
                    }
                }
            }

            $notifications = Notification::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->take(30)
                ->get();

            $unreadCount = Notification::where('user_id', $user->id)
                ->where('is_read', false)
                ->count();

            $formatted = $notifications->map(function ($n) {
                return [
                    'id' => $n->id,
                    'title' => $n->title,
                    'message' => $n->message,
                    'type' => $n->type,
                    'url' => $n->url,
                    'is_read' => (bool) $n->is_read,
                    'read_at' => $n->read_at,
                    'createdAt' => $n->created_at?->toISOString(),
                    'timeAgo' => $n->created_at ? Carbon::parse($n->created_at)->diffForHumans() : 'Baru saja',
                ];
            });

            return response()->json([
                'status' => 'success',
                'notifications' => $formatted,
                'unreadCount' => $unreadCount,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * PUT /api/notifications/{id}/read
     * Mark single notification as read
     */
    public function markAsRead($id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        try {
            $notification = Notification::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if ($notification) {
                $notification->update([
                    'is_read' => true,
                    'read_at' => now(),
                ]);
            }

            $unreadCount = Notification::where('user_id', $user->id)
                ->where('is_read', false)
                ->count();

            return response()->json([
                'status' => 'success',
                'message' => 'Notifikasi ditandai telah dibaca.',
                'unreadCount' => $unreadCount,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * PUT /api/notifications/read-all
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        try {
            Notification::where('user_id', $user->id)
                ->where('is_read', false)
                ->update([
                    'is_read' => true,
                    'read_at' => now(),
                ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Seluruh notifikasi ditandai telah dibaca.',
                'unreadCount' => 0,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * DELETE /api/notifications/{id}
     * Delete notification
     */
    public function destroy($id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        try {
            Notification::where('id', $id)
                ->where('user_id', $user->id)
                ->delete();

            $unreadCount = Notification::where('user_id', $user->id)
                ->where('is_read', false)
                ->count();

            return response()->json([
                'status' => 'success',
                'message' => 'Notifikasi berhasil dihapus.',
                'unreadCount' => $unreadCount,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
