<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Package;
use App\Models\Theme;
use App\Models\Wedding;
use App\Models\Transaction;
use App\Models\Music;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer as SymfonyMailer;
use Symfony\Component\Mime\Email;
use Carbon\Carbon;

class AdminController extends Controller
{
    // Protect using auth and admin role check (we will assign this via middleware in routes)

    // 1. GET /api/admin/analytics - Dashboard metrics & charts
    public function getAnalytics()
    {
        try {
            $now = now();
            $firstDayOfMonth = now()->startOfMonth();

            // Total Revenue All-Time & This Month
            $totalRevenueAllTime = (int) Order::where('status', 'PAID')->sum('amount');
            $totalRevenueMonth = (int) Order::where('status', 'PAID')
                ->where(function ($q) use ($firstDayOfMonth) {
                    $q->where('paid_at', '>=', $firstDayOfMonth)
                      ->orWhere(function ($sub) use ($firstDayOfMonth) {
                          $sub->whereNull('paid_at')->where('created_at', '>=', $firstDayOfMonth);
                      });
                })
                ->sum('amount');

            // Total Users & breakdown
            $totalUsers = User::where('role', 'USER')->count();
            $payingCustomers = Order::where('status', 'PAID')->distinct('user_id')->count('user_id');
            $freeUsers = max(0, $totalUsers - $payingCustomers);

            // Weddings breakdown
            $totalWeddings = Wedding::count();
            $liveWeddings = Wedding::where('status', 'published')->count();
            $draftWeddings = Wedding::where('status', '!=', 'published')->orWhereNull('status')->count();

            // Orders breakdown
            $totalOrders = Order::count();
            $paidOrders = Order::where('status', 'PAID')->count();
            $pendingOrders = Order::where('status', 'PENDING')->count();

            // Daily Revenue (last 30 days)
            $thirtyDaysAgo = now()->subDays(30)->startOfDay();
            $dailyRevOrders = Order::where('status', 'PAID')
                ->where(function ($q) use ($thirtyDaysAgo) {
                    $q->where('paid_at', '>=', $thirtyDaysAgo)
                      ->orWhere(function ($sub) use ($thirtyDaysAgo) {
                          $sub->whereNull('paid_at')->where('created_at', '>=', $thirtyDaysAgo);
                      });
                })
                ->get(['amount', 'paid_at', 'created_at']);

            $dailyRevMap = [];
            for ($i = 29; $i >= 0; $i--) {
                $dateStr = now()->subDays($i)->toDateString();
                $dailyRevMap[$dateStr] = 0;
            }
            foreach ($dailyRevOrders as $o) {
                $payDate = $o->paid_at ?? $o->created_at;
                if ($payDate) {
                    $dateStr = Carbon::parse($payDate)->toDateString();
                    if (array_key_exists($dateStr, $dailyRevMap)) {
                        $dailyRevMap[$dateStr] += (int) $o->amount;
                    }
                }
            }
            $dailyRevenue = [];
            foreach ($dailyRevMap as $date => $amount) {
                $dailyRevenue[] = ['date' => $date, 'amount' => $amount];
            }

            // New Users per Week (4 Weeks with readable Date Ranges)
            $weeklyUsers = [];
            $recentUsersCount = 0;
            for ($w = 3; $w >= 0; $w--) {
                $weekStart = now()->subDays(($w + 1) * 7)->startOfDay();
                $weekEnd = $w === 0 ? now()->endOfDay() : now()->subDays($w * 7)->endOfDay();
                
                $label = $weekStart->format('d M') . ' - ' . $weekEnd->format('d M');
                $count = User::where('role', 'USER')
                    ->whereBetween('created_at', [$weekStart, $weekEnd])
                    ->count();

                $recentUsersCount += $count;
                $weeklyUsers[] = [
                    'week' => $label,
                    'count' => $count,
                ];
            }
            $olderUsersCount = max(0, $totalUsers - $recentUsersCount);

            // Package Sales Distribution (All-Time)
            $pkgDistributionOrdersAll = Order::with('package')->where('status', 'PAID')->get();
            $pkgMapAll = [];
            foreach ($pkgDistributionOrdersAll as $o) {
                $name = $o->package ? $o->package->name : 'UNKNOWN';
                if (!isset($pkgMapAll[$name])) {
                    $pkgMapAll[$name] = ['count' => 0, 'amount' => 0];
                }
                $pkgMapAll[$name]['count']++;
                $pkgMapAll[$name]['amount'] += (int) $o->amount;
            }
            $packageDistribution = [];
            foreach ($pkgMapAll as $name => $item) {
                $packageDistribution[] = [
                    'name' => $name,
                    'value' => $item['count'],
                    'amount' => $item['amount'],
                ];
            }

            // Package Sales Distribution (Current Month)
            $pkgDistributionOrdersMonth = Order::with('package')
                ->where('status', 'PAID')
                ->where(function ($q) use ($firstDayOfMonth) {
                    $q->where('paid_at', '>=', $firstDayOfMonth)
                      ->orWhere(function ($sub) use ($firstDayOfMonth) {
                          $sub->whereNull('paid_at')->where('created_at', '>=', $firstDayOfMonth);
                      });
                })
                ->get();

            $pkgMapMonth = [];
            foreach ($pkgDistributionOrdersMonth as $o) {
                $name = $o->package ? $o->package->name : 'UNKNOWN';
                if (!isset($pkgMapMonth[$name])) {
                    $pkgMapMonth[$name] = ['count' => 0, 'amount' => 0];
                }
                $pkgMapMonth[$name]['count']++;
                $pkgMapMonth[$name]['amount'] += (int) $o->amount;
            }
            $packageDistributionMonth = [];
            foreach ($pkgMapMonth as $name => $item) {
                $packageDistributionMonth[] = [
                    'name' => $name,
                    'value' => $item['count'],
                    'amount' => $item['amount'],
                ];
            }

            // Recent 5 Transactions
            $recentTransactions = Order::with(['user', 'package'])
                ->latest()
                ->limit(5)
                ->get()
                ->map(function ($o) {
                    return [
                        'id' => $o->id,
                        'userName' => $o->user ? $o->user->name : 'Customer',
                        'userEmail' => $o->user ? $o->user->email : '-',
                        'packageName' => $o->package ? $o->package->name : 'PAKET',
                        'amount' => (int) $o->amount,
                        'status' => $o->status,
                        'paymentMethod' => $o->payment_method ?: 'Payment Gateway',
                        'createdAt' => $o->created_at,
                    ];
                });

            // Weddings expiring in 7 days
            $sevenDaysFromNow = now()->addDays(7)->endOfDay();
            $expiringWeddings = Wedding::with('user')
                ->whereNotNull('expired_at')
                ->where('expired_at', '>=', $now)
                ->where('expired_at', '<=', $sevenDaysFromNow)
                ->orderBy('expired_at')
                ->get()
                ->map(function ($w) {
                    return [
                        'id' => $w->id,
                        'slug' => $w->slug,
                        'expiredAt' => $w->expired_at,
                        'userName' => $w->user ? $w->user->name : null,
                        'userEmail' => $w->user ? $w->user->email : null,
                    ];
                });

            // Theme Usage Statistics (Most frequently used themes)
            $themeUsages = Wedding::selectRaw('theme_id, count(id) as count')
                ->whereNotNull('theme_id')
                ->where('theme_id', '!=', '')
                ->groupBy('theme_id')
                ->orderByDesc('count')
                ->get();

            $allThemes = Theme::all()->keyBy('id');
            $topThemes = $themeUsages->map(function ($tu) use ($allThemes) {
                $theme = $allThemes->get($tu->theme_id);
                return [
                    'themeId' => $tu->theme_id,
                    'name' => $theme ? $theme->name : ucwords(str_replace('-', ' ', $tu->theme_id)),
                    'packageLevel' => $theme ? $theme->package_level : (str_starts_with($tu->theme_id, 'basic') ? 'BASIC' : 'PREMIUM'),
                    'thumbnailUrl' => $theme ? $theme->thumbnail_url : null,
                    'count' => (int) $tu->count,
                ];
            });

            $mostPopularTheme = $topThemes->first() ?? null;
            $totalWeddingsWithTheme = $themeUsages->sum('count');

            return response()->json([
                'status' => 'success',
                'analytics' => [
                    'kpis' => [
                        'totalRevenueAllTime' => $totalRevenueAllTime,
                        'totalRevenueMonth' => $totalRevenueMonth,
                        'totalUsers' => $totalUsers,
                        'payingCustomers' => $payingCustomers,
                        'freeUsers' => $freeUsers,
                        'recentUsersCount' => $recentUsersCount,
                        'olderUsersCount' => $olderUsersCount,
                        'totalWeddings' => $totalWeddings,
                        'liveWeddings' => $liveWeddings,
                        'draftWeddings' => $draftWeddings,
                        'totalOrders' => $totalOrders,
                        'paidOrders' => $paidOrders,
                        'pendingOrders' => $pendingOrders,
                        'mostPopularTheme' => $mostPopularTheme ? $mostPopularTheme['name'] : '-',
                        'mostPopularThemeCount' => $mostPopularTheme ? $mostPopularTheme['count'] : 0,
                        'totalWeddingsWithTheme' => (int) $totalWeddingsWithTheme,
                    ],
                    'dailyRevenue' => $dailyRevenue,
                    'weeklyUsers' => $weeklyUsers,
                    'packageDistribution' => $packageDistribution,
                    'packageDistributionMonth' => $packageDistributionMonth,
                    'topThemes' => $topThemes,
                    'mostPopularTheme' => $mostPopularTheme,
                    'recentTransactions' => $recentTransactions,
                    'expiringWeddings' => $expiringWeddings,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 2. GET /api/admin/users - List users
    public function getUsers(Request $request)
    {
        try {
            $search = $request->query('search', '');
            $status = $request->query('status', 'all');
            $role = $request->query('role', 'all');
            $tier = $request->query('tier', 'all');
            $themeFilter = $request->query('theme', 'all');

            $query = User::query();

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }
            if ($status !== 'all') {
                $query->where('status', $status);
            }
            if ($role !== 'all') {
                $query->where('role', $role);
            }

            $allThemes = Theme::all()->keyBy('id');

            $users = $query->latest()
                ->with([
                    'orders' => function ($q) {
                        $q->where('status', 'PAID')->latest()->with('package');
                    },
                    'weddings' => function ($q) {
                        $q->latest();
                    }
                ])
                ->get();

            $list = $users->map(function ($u) use ($allThemes) {
                $latestPaid = $u->orders->first();
                $userTier = $latestPaid && $latestPaid->package ? $latestPaid->package->name : 'BASIC';
                $packageId = $latestPaid && $latestPaid->package ? $latestPaid->package->id : null;

                $wedding = $u->weddings->first();
                $themeId = $wedding?->theme_id;
                $theme = $themeId ? $allThemes->get($themeId) : null;
                $themeName = $theme ? $theme->name : ($themeId ? ucwords(str_replace('-', ' ', $themeId)) : null);

                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'status' => $u->status,
                    'tier' => $userTier,
                    'packageId' => $packageId,
                    'themeId' => $themeId,
                    'themeName' => $themeName,
                    'themePackageLevel' => $theme?->package_level ?: ($themeId && str_starts_with($themeId, 'basic') ? 'BASIC' : null),
                    'weddingId' => $wedding?->id,
                    'weddingSlug' => $wedding?->slug,
                    'weddingStatus' => $wedding?->status,
                    'createdAt' => $u->created_at,
                ];
            });

            if ($tier !== 'all') {
                $list = $list->filter(function ($item) use ($tier) {
                    return strtoupper($item['tier']) === strtoupper($tier);
                })->values();
            }

            if ($themeFilter !== 'all') {
                if ($themeFilter === 'none') {
                    $list = $list->filter(function ($item) {
                        return empty($item['themeId']);
                    })->values();
                } else {
                    $list = $list->filter(function ($item) use ($themeFilter) {
                        return $item['themeId'] === $themeFilter;
                    })->values();
                }
            }

            return response()->json([
                'status' => 'success',
                'users' => $list,
                'availableThemes' => $allThemes->values()->map(function ($t) {
                    return [
                        'id' => $t->id,
                        'name' => $t->name,
                        'packageLevel' => $t->package_level,
                    ];
                }),
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 2.1 POST /api/admin/users - Create new user with selected tier
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'nullable|in:USER,ADMIN',
            'status' => 'nullable|in:ACTIVE,PENDING,BLOCKED',
            'tier' => 'nullable|string|in:BASIC,PREMIUM,CUSTOM',
            'package_id' => 'nullable|string',
            'notes' => 'nullable|string|max:255',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 6 karakter.',
        ]);

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => trim($validated['name']),
                'email' => strtolower(trim($validated['email'])),
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'] ?? 'USER',
                'status' => $validated['status'] ?? 'ACTIVE',
                'email_verified_at' => now(), // Auto-verified for instant access
            ]);

            // Resolve package
            $tierName = strtoupper(trim($validated['tier'] ?? 'BASIC'));
            $package = Package::where('name', $tierName)->first();
            if (!$package && !empty($validated['package_id'])) {
                $package = Package::find($validated['package_id']);
            }
            if (!$package) {
                $package = Package::where('name', 'BASIC')->first();
            }

            if ($package) {
                $order = Order::create([
                    'user_id' => $user->id,
                    'package_id' => $package->id,
                    'status' => 'PAID',
                    'amount' => $package->price,
                    'payment_method' => 'WO_PARTNERSHIP',
                    'paid_at' => now(),
                ]);

                Transaction::create([
                    'order_id' => $order->id,
                    'gateway_ref' => 'WO-' . strtoupper(Str::random(8)),
                    'status' => 'success',
                    'payload' => [
                        'source' => 'admin_create_user',
                        'partner_notes' => $validated['notes'] ?? 'Kemitraan Wedding Organizer (WO)',
                        'tier' => $package->name,
                        'created_by' => Auth::user()?->email,
                    ],
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'User berhasil dibuat dengan tier ' . ($package ? $package->name : 'BASIC') . '.',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'tier' => $package ? $package->name : 'BASIC',
                    'packageId' => $package ? $package->id : null,
                    'createdAt' => $user->created_at,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Gagal membuat user: ' . $e->getMessage()], 500);
        }
    }

    // 2.2 PUT /api/admin/users/{id} - Update user info & tier
    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan.'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'nullable|in:USER,ADMIN',
            'status' => 'nullable|in:ACTIVE,PENDING,BLOCKED',
            'tier' => 'nullable|string|in:BASIC,PREMIUM,CUSTOM',
            'package_id' => 'nullable|string',
            'notes' => 'nullable|string|max:255',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan oleh akun lain.',
            'password.min' => 'Password minimal 6 karakter.',
        ]);

        try {
            DB::beginTransaction();

            $updateData = [
                'name' => trim($validated['name']),
                'email' => strtolower(trim($validated['email'])),
                'role' => $validated['role'] ?? $user->role,
                'status' => $validated['status'] ?? $user->status,
            ];

            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $user->update($updateData);

            // Sync Tier / Package
            $tierName = strtoupper(trim($validated['tier'] ?? ''));
            if ($tierName || !empty($validated['package_id'])) {
                $package = Package::where('name', $tierName)->first();
                if (!$package && !empty($validated['package_id'])) {
                    $package = Package::find($validated['package_id']);
                }

                if ($package) {
                    $latestPaidOrder = Order::where('user_id', $user->id)
                        ->where('status', 'PAID')
                        ->latest()
                        ->first();

                    if ($latestPaidOrder) {
                        $latestPaidOrder->update([
                            'package_id' => $package->id,
                            'amount' => $package->price,
                            'paid_at' => $latestPaidOrder->paid_at ?: now(),
                        ]);
                    } else {
                        $order = Order::create([
                            'user_id' => $user->id,
                            'package_id' => $package->id,
                            'status' => 'PAID',
                            'amount' => $package->price,
                            'payment_method' => 'ADMIN_UPDATE',
                            'paid_at' => now(),
                        ]);

                        Transaction::create([
                            'order_id' => $order->id,
                            'gateway_ref' => 'WO-' . strtoupper(Str::random(8)),
                            'status' => 'success',
                            'payload' => [
                                'source' => 'admin_update_user',
                                'partner_notes' => $validated['notes'] ?? 'Updated by Admin',
                                'tier' => $package->name,
                                'updated_by' => Auth::user()?->email,
                            ],
                        ]);
                    }

                    // Sync Wedding expiration duration if wedding exists
                    $wedding = Wedding::where('user_id', $user->id)->first();
                    if ($wedding) {
                        $durationDays = $package->duration_days ?: 365;
                        $wedding->update([
                            'expired_at' => now()->addDays($durationDays),
                        ]);
                    }
                }
            }

            DB::commit();

            $activeOrder = Order::with('package')->where('user_id', $user->id)->where('status', 'PAID')->latest()->first();

            return response()->json([
                'status' => 'success',
                'message' => 'Data user & tier berhasil diperbarui.',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'tier' => $activeOrder && $activeOrder->package ? $activeOrder->package->name : 'BASIC',
                    'packageId' => $activeOrder && $activeOrder->package ? $activeOrder->package->id : null,
                    'createdAt' => $user->created_at,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Gagal memperbarui user: ' . $e->getMessage()], 500);
        }
    }

    // 3. GET /api/admin/users/{id} - Get user detail
    public function getUserDetail($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan.'], 404);
            }

            $orders = Order::with('package')
                ->where('user_id', $id)
                ->latest()
                ->get()
                ->map(function ($o) {
                    return [
                        'id' => $o->id,
                        'packageName' => $o->package ? $o->package->name : null,
                        'amount' => $o->amount,
                        'status' => $o->status,
                        'paymentMethod' => $o->payment_method,
                        'createdAt' => $o->created_at,
                    ];
                });

            $latestPaid = Order::with('package')
                ->where('user_id', $id)
                ->where('status', 'PAID')
                ->latest()
                ->first();

            $activeTier = $latestPaid && $latestPaid->package ? $latestPaid->package->name : 'BASIC';
            $activePackageId = $latestPaid && $latestPaid->package ? $latestPaid->package->id : null;

            $wedding = Wedding::where('user_id', $id)->first();
            $theme = null;
            if ($wedding && $wedding->theme_id) {
                $theme = Theme::find($wedding->theme_id);
            }

            return response()->json([
                'status' => 'success',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'tier' => $activeTier,
                    'packageId' => $activePackageId,
                    'themeId' => $wedding?->theme_id,
                    'themeName' => $theme?->name ?? ($wedding?->theme_id ? ucwords(str_replace('-', ' ', $wedding->theme_id)) : null),
                    'themePackageLevel' => $theme?->package_level ?: ($wedding?->theme_id && str_starts_with($wedding->theme_id, 'basic') ? 'BASIC' : 'PREMIUM'),
                    'createdAt' => $user->created_at,
                ],
                'orders' => $orders,
                'wedding' => $wedding ? array_merge($wedding->toArray(), [
                    'themeName' => $theme?->name ?? ($wedding->theme_id ? ucwords(str_replace('-', ' ', $wedding->theme_id)) : null),
                    'themePackageLevel' => $theme?->package_level ?: ($wedding->theme_id && str_starts_with($wedding->theme_id, 'basic') ? 'BASIC' : 'PREMIUM'),
                ]) : null,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 4. PUT /api/admin/users/{id}/status - Update user status
    public function updateUserStatus(Request $request, $id)
    {
        try {
            $status = $request->input('status');

            if (!in_array($status, ['ACTIVE', 'BLOCKED', 'PENDING'])) {
                return response()->json(['status' => 'error', 'message' => 'Status tidak valid.'], 400);
            }

            $user = User::find($id);
            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan.'], 404);
            }

            $user->update(['status' => $status]);

            return response()->json(['status' => 'success', 'message' => 'Status user berhasil diperbarui.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 5. PUT /api/admin/users/{id}/reset-password - Reset user password
    public function resetUserPassword(Request $request, $id)
    {
        try {
            $password = $request->input('password');

            if (!$password || strlen($password) < 6) {
                return response()->json(['status' => 'error', 'message' => 'Password minimal 6 karakter.'], 400);
            }

            $user = User::find($id);
            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan.'], 404);
            }

            $user->update(['password' => Hash::make($password)]);

            return response()->json(['status' => 'success', 'message' => 'Password user berhasil direset.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 6. DELETE /api/admin/users/{id} - Delete user
    public function deleteUser($id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'User tidak ditemukan.'], 404);
            }

            $user->delete();
            return response()->json(['status' => 'success', 'message' => 'User berhasil dihapus.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 7. GET /api/admin/orders - List orders
    public function getOrders(Request $request)
    {
        try {
            $status = $request->query('status', 'all');
            $search = $request->query('search', '');

            $query = Order::with(['user', 'package']);

            if ($status !== 'all') {
                $query->where('status', $status);
            }

            if ($search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $list = $query->latest()->get()->map(function ($o) {
                return [
                    'id' => $o->id,
                    'amount' => $o->amount,
                    'status' => $o->status,
                    'paymentMethod' => $o->payment_method,
                    'paidAt' => $o->paid_at,
                    'createdAt' => $o->created_at,
                    'userName' => $o->user ? $o->user->name : null,
                    'userEmail' => $o->user ? $o->user->email : null,
                    'packageName' => $o->package ? $o->package->name : null,
                ];
            });

            return response()->json(['status' => 'success', 'orders' => $list]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 8. GET /api/admin/orders/{id} - Get order details
    public function getOrderDetail($id)
    {
        try {
            $order = Order::with(['user', 'package'])->find($id);

            if (!$order) {
                return response()->json(['status' => 'error', 'message' => 'Order tidak ditemukan'], 404);
            }

            $transaction = Transaction::where('order_id', $id)->first();

            $formatted = [
                'id' => $order->id,
                'amount' => $order->amount,
                'status' => $order->status,
                'paymentMethod' => $order->payment_method,
                'paidAt' => $order->paid_at,
                'createdAt' => $order->created_at,
                'userName' => $order->user ? $order->user->name : null,
                'userEmail' => $order->user ? $order->user->email : null,
                'packageName' => $order->package ? $order->package->name : null,
            ];

            return response()->json([
                'status' => 'success',
                'order' => $formatted,
                'transaction' => $transaction ?: null,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 9. POST /api/admin/orders/{id}/confirm - Confirm pending payment manually
    public function confirmOrder($id)
    {
        try {
            $order = Order::find($id);

            if (!$order) {
                return response()->json(['status' => 'error', 'message' => 'Order tidak ditemukan'], 404);
            }

            if ($order->status === 'PAID') {
                return response()->json(['status' => 'error', 'message' => 'Order sudah dibayar sebelumnya.'], 400);
            }

            return DB::transaction(function () use ($order) {
                $order->update([
                    'status' => 'PAID',
                    'paid_at' => now(),
                ]);

                Transaction::where('order_id', $order->id)->update([
                    'status' => 'success',
                    'gateway_ref' => 'MANUAL-' . time(),
                ]);

                $userWedding = Wedding::where('user_id', $order->user_id)->first();
                $pkg = Package::find($order->package_id);

                if ($userWedding && $pkg) {
                    $expDate = now()->addDays($pkg->duration_days);
                    $userWedding->update([
                        'expired_at' => $expDate,
                        'status' => 'published',
                    ]);
                }

                \App\Models\Notification::send(
                    $order->user_id,
                    'Pembayaran Dikonfirmasi!',
                    'Pembayaran paket ' . ($pkg?->name ?? 'Undangan') . ' telah diverifikasi. Masa aktif undangan telah diperpanjang.',
                    'order',
                    '/dashboard/billing'
                );

                return response()->json(['status' => 'success', 'message' => 'Pembayaran manual berhasil dikonfirmasi!']);
            });
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 10. POST /api/admin/orders/{id}/cancel - Cancel order
    public function cancelOrder($id)
    {
        try {
            Order::where('id', $id)->update(['status' => 'EXPIRED']);
            Transaction::where('order_id', $id)->update(['status' => 'failed']);
            return response()->json(['status' => 'success', 'message' => 'Order berhasil dibatalkan.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 11. POST /api/admin/orders/{id}/refund - Refund order
    public function refundOrder($id)
    {
        try {
            Order::where('id', $id)->update(['status' => 'REFUND']);
            Transaction::where('order_id', $id)->update(['status' => 'failed']);
            return response()->json(['status' => 'success', 'message' => 'Order ditandai sebagai refund.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 12. GET /api/admin/themes - List themes
    public function getThemes()
    {
        try {
            $themes = Theme::orderBy('id')->get();
            $usages = Wedding::selectRaw('theme_id, count(id) as count')
                ->groupBy('theme_id')
                ->pluck('count', 'theme_id')
                ->toArray();

            $formatted = $themes->map(function ($t) use ($usages) {
                return array_merge($t->toArray(), [
                    'usersCount' => $usages[$t->id] ?? 0,
                ]);
            });

            $popularThemes = $formatted->sortByDesc('usersCount')->values()->take(5);
            $totalWeddingsCount = array_sum($usages);

            return response()->json([
                'status' => 'success',
                'themes' => $formatted,
                'popularThemes' => $popularThemes,
                'totalWeddingsCount' => $totalWeddingsCount,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 13. POST /api/admin/themes - Create theme
    public function storeTheme(Request $request)
    {
        try {
            $id = $request->input('id');
            $name = $request->input('name');
            $thumbnailUrl = $request->input('thumbnailUrl');
            $packageLevel = $request->input('packageLevel');
            $code = $request->input('code');

            if (!$id || !$name) {
                return response()->json(['status' => 'error', 'message' => 'ID dan Nama tema wajib diisi.'], 400);
            }

            Theme::create([
                'id' => preg_replace('/[^a-z0-9-]/', '', strtolower($id)),
                'code' => $code ? strtolower(trim($code)) : Theme::generateUniqueCode(),
                'name' => $name,
                'thumbnail_url' => $thumbnailUrl ?: '',
                'package_level' => $packageLevel ?: 'BASIC',
                'is_active' => true,
            ]);

            return response()->json(['status' => 'success', 'message' => 'Tema baru berhasil ditambahkan.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 14. PUT /api/admin/themes/{id} - Update theme
    public function updateTheme(Request $request, $id)
    {
        try {
            $theme = Theme::find($id);
            if (!$theme) {
                return response()->json(['status' => 'error', 'message' => 'Tema tidak ditemukan.'], 404);
            }

            $updateData = [
                'name' => $request->input('name'),
                'thumbnail_url' => $request->input('thumbnailUrl'),
                'package_level' => $request->input('packageLevel'),
                'is_active' => $request->input('isActive'),
            ];

            if ($request->has('code') && !empty($request->input('code'))) {
                $updateData['code'] = strtolower(trim($request->input('code')));
            }

            $theme->update($updateData);

            return response()->json(['status' => 'success', 'message' => 'Tema berhasil diperbarui.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 15. DELETE /api/admin/themes/{id} - Delete theme
    public function deleteTheme($id)
    {
        try {
            $inUse = Wedding::where('theme_id', $id)->first();
            if ($inUse) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Gagal menghapus: Tema masih digunakan oleh satu atau beberapa undangan.'
                ], 400);
            }

            $theme = Theme::find($id);
            if ($theme) {
                $theme->delete();
            }

            return response()->json(['status' => 'success', 'message' => 'Tema berhasil dihapus.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 16. GET /api/admin/packages - List packages
    public function getPackages()
    {
        try {
            $list = Package::orderBy('price')->get();
            return response()->json(['status' => 'success', 'packages' => $list]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 17. POST /api/admin/packages - Create package
    public function storePackage(Request $request)
    {
        try {
            $name = $request->input('name');
            $price = $request->input('price');
            $features = $request->input('features');
            $maxGuests = $request->input('maxGuests');
            $durationDays = $request->input('durationDays');

            if (!$name || $price === null || !$durationDays) {
                return response()->json(['status' => 'error', 'message' => 'Lengkapi seluruh data wajib paket.'], 400);
            }

            Package::create([
                'name' => strtoupper($name),
                'price' => (int) $price,
                'features' => $features ?: [],
                'max_guests' => (int) ($maxGuests ?: 0),
                'duration_days' => (int) $durationDays,
            ]);

            return response()->json(['status' => 'success', 'message' => 'Paket baru berhasil ditambahkan.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 18. PUT /api/admin/packages/{id} - Update package
    public function updatePackage(Request $request, $id)
    {
        try {
            $pkg = Package::find($id);
            if (!$pkg) {
                return response()->json(['status' => 'error', 'message' => 'Paket tidak ditemukan.'], 404);
            }

            $pkg->update([
                'name' => strtoupper($request->input('name')),
                'price' => (int) $request->input('price'),
                'features' => $request->input('features'),
                'max_guests' => (int) ($request->input('maxGuests') ?: 0),
                'duration_days' => (int) $request->input('durationDays'),
            ]);

            return response()->json(['status' => 'success', 'message' => 'Paket berhasil diperbarui.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 19. GET /api/admin/music - List music
    public function getMusic()
    {
        try {
            $list = Music::orderBy('title')->get();
            return response()->json(['status' => 'success', 'music' => $list]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 20. POST /api/admin/music - Create music
    public function storeMusic(Request $request)
    {
        try {
            $title = $request->input('title');
            $artist = $request->input('artist');
            $url = $request->input('url');

            if (!$title || !$artist || !$url) {
                return response()->json(['status' => 'error', 'message' => 'Judul, artis, dan file URL wajib diisi.'], 400);
            }

            Music::create([
                'title' => $title,
                'artist' => $artist,
                'url' => $url,
                'is_active' => true,
            ]);

            return response()->json(['status' => 'success', 'message' => 'Musik berhasil diunggah ke pustaka.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 21. PUT /api/admin/music/{id} - Update music
    public function updateMusic(Request $request, $id)
    {
        try {
            $m = Music::find($id);
            if (!$m) {
                return response()->json(['status' => 'error', 'message' => 'Musik tidak ditemukan.'], 404);
            }

            $m->update([
                'title' => $request->input('title'),
                'artist' => $request->input('artist'),
                'is_active' => $request->input('isActive'),
            ]);

            return response()->json(['status' => 'success', 'message' => 'Metadata musik berhasil diubah.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 22. DELETE /api/admin/music/{id} - Delete music
    public function deleteMusic($id)
    {
        try {
            $m = Music::find($id);
            if ($m) {
                $m->delete();
            }
            return response()->json(['status' => 'success', 'message' => 'Musik berhasil dihapus dari pustaka.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 23. GET /api/admin/finance - Financial reports
    public function getFinanceReport(Request $request)
    {
        try {
            $start = $request->query('start');
            $end = $request->query('end');

            $query = Order::with('package')->where('status', 'PAID');
            if ($start) {
                $startDt = Carbon::parse($start)->startOfDay();
                $query->where(function ($q) use ($startDt) {
                    $q->where('paid_at', '>=', $startDt)
                      ->orWhere(function ($sub) use ($startDt) {
                          $sub->whereNull('paid_at')->where('created_at', '>=', $startDt);
                      });
                });
            }
            if ($end) {
                $endDt = Carbon::parse($end)->endOfDay();
                $query->where(function ($q) use ($endDt) {
                    $q->where('paid_at', '<=', $endDt)
                      ->orWhere(function ($sub) use ($endDt) {
                          $sub->whereNull('paid_at')->where('created_at', '<=', $endDt);
                      });
                });
            }

            $paidOrders = $query->latest(DB::raw('COALESCE(paid_at, created_at)'))->get();

            $totalRevenue = 0;
            $packageBreakdown = [];
            $methodBreakdown = [];

            foreach ($paidOrders as $o) {
                $totalRevenue += $o->amount;

                $pkgName = $o->package ? $o->package->name : 'UNKNOWN';
                if (!isset($packageBreakdown[$pkgName])) {
                    $packageBreakdown[$pkgName] = ['count' => 0, 'sum' => 0];
                }
                $packageBreakdown[$pkgName]['count']++;
                $packageBreakdown[$pkgName]['sum'] += $o->amount;

                $method = $o->payment_method ?: 'UNKNOWN';
                if (!isset($methodBreakdown[$method])) {
                    $methodBreakdown[$method] = ['count' => 0, 'sum' => 0];
                }
                $methodBreakdown[$method]['count']++;
                $methodBreakdown[$method]['sum'] += $o->amount;
            }

            $formattedPkg = [];
            foreach ($packageBreakdown as $name => $val) {
                $formattedPkg[] = array_merge(['name' => $name], $val);
            }

            $formattedMethod = [];
            foreach ($methodBreakdown as $name => $val) {
                $formattedMethod[] = array_merge(['name' => $name], $val);
            }

            $formattedOrders = $paidOrders->map(function ($o) {
                return [
                    'id' => $o->id,
                    'amount' => $o->amount,
                    'paymentMethod' => $o->payment_method,
                    'paidAt' => $o->paid_at,
                    'packageName' => $o->package ? $o->package->name : null,
                ];
            });

            return response()->json([
                'status' => 'success',
                'report' => [
                    'totalRevenue' => $totalRevenue,
                    'ordersCount' => $paidOrders->count(),
                    'packageBreakdown' => $formattedPkg,
                    'methodBreakdown' => $formattedMethod,
                    'orders' => $formattedOrders,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 24. GET /api/admin/settings - Get system configurations
    public function getSettings()
    {
        try {
            $list = SystemSetting::all();
            $settingsMap = [];
            foreach ($list as $s) {
                $settingsMap[$s->key] = $s->value;
            }
            return response()->json(['status' => 'success', 'settings' => $settingsMap]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 25. PUT /api/admin/settings - Update settings
    public function updateSettings(Request $request)
    {
        try {
            $body = $request->all();

            foreach ($body as $key => $value) {
                SystemSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value]
                );
            }

            return response()->json(['status' => 'success', 'message' => 'Konfigurasi sistem berhasil diperbarui.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // 26. POST /api/admin/settings/test-email - Test SMTP configuration
    public function testEmail(Request $request)
    {
        try {
            $smtp = $request->input('smtp');
            $testEmail = $request->input('testEmail');

            if (!$testEmail) {
                return response()->json(['status' => 'error', 'message' => 'Email tujuan wajib diisi.'], 400);
            }

            $dsn = sprintf(
                'smtp://%s:%s@%s:%d',
                urlencode($smtp['user']),
                urlencode($smtp['pass']),
                $smtp['host'],
                $smtp['port']
            );
            $mailer = new SymfonyMailer(Transport::fromDsn($dsn));

            $email = (new Email())
                ->from($smtp['from'] ?? 'noreply@ngaturi.id')
                ->to($testEmail)
                ->subject('Test Email Konfigurasi SMTP Ngaturi')
                ->html('<h3>Ngaturi SaaS</h3><p>Selamat! Konfigurasi SMTP Anda berjalan dengan lancar.</p>');

            $mailer->send($email);

            return response()->json(['status' => 'success', 'message' => 'Test email berhasil dikirim!']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => "Gagal mengirim email: " . $e->getMessage()], 500);
        }
    }
}
