<?php

use App\Http\Controllers\WeddingController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\ThemeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Pages & API Routes
|--------------------------------------------------------------------------
*/

// Landing Page & Statics
Route::get('/', function () {
    return Inertia::render('LandingPage');
})->name('home');

Route::get('/theme-preview/{themeId}', function ($themeId) {
    return Inertia::render('ThemePreview', ['themeId' => $themeId]);
});

Route::get('/kebijakan-privasi', function () {
    return Inertia::render('static/PrivacyPolicy');
});

Route::get('/syarat-ketentuan', function () {
    return Inertia::render('static/TermsConditions');
});

Route::get('/tentang-kami', function () {
    return Inertia::render('static/AboutUs');
});

Route::get('/kontak', function () {
    return Inertia::render('static/Contact');
});

// Public Wedding Invitation Pages
Route::get('/u/{slug}', [WeddingController::class, 'renderPublicInvitation'])->name('wedding.public');
Route::get('/u/{slug}/preview', [WeddingController::class, 'renderPublicPreview'])->name('wedding.preview');

// Public Guest API Routes
Route::get('/api/guests/public/wishes/{weddingId}', [GuestController::class, 'getPublicWishes']);
Route::get('/api/guests/public/by-token/{token}', [GuestController::class, 'getPublicGuestByToken']);
Route::post('/api/guests/public/rsvp', [GuestController::class, 'submitPublicRsvp']);
Route::get('/api/weddings/check-slug/{slug}', [WeddingController::class, 'checkSlug']);

// Tripay Payment Callback Webhook
Route::post('/api/webhook/payment', [WebhookController::class, 'handlePayment'])->name('webhook.payment');

/*
|--------------------------------------------------------------------------
| Authenticated User Routes (Dashboard & API)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Page Routes
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard/Overview');
    })->name('dashboard');

    Route::get('/dashboard/onboarding', function () {
        return Inertia::render('dashboard/Onboarding');
    });

    Route::get('/dashboard/wedding-data', function () {
        return Inertia::render('dashboard/WeddingData');
    });

    Route::get('/dashboard/themes', function () {
        return Inertia::render('dashboard/Themes');
    });

    Route::get('/dashboard/gallery', function () {
        return Inertia::render('dashboard/Gallery');
    });

    Route::get('/dashboard/guests', function () {
        return Inertia::render('dashboard/Guests');
    });

    Route::get('/dashboard/rsvp', function () {
        return Inertia::render('dashboard/Rsvps');
    });

    Route::get('/dashboard/checkin', function () {
        return Inertia::render('dashboard/Checkin');
    });

    Route::get('/dashboard/billing', function () {
        return Inertia::render('dashboard/Billing');
    });

    Route::get('/dashboard/settings', function () {
        return Inertia::render('dashboard/Settings');
    });

    Route::get('/dashboard/checkout/{orderId}', function ($orderId) {
        return Inertia::render('dashboard/Checkout', ['orderId' => $orderId]);
    });

    Route::get('/payment/success', function () {
        return Inertia::render('payment/PaymentStatus', ['status' => 'success']);
    });

    Route::get('/payment/pending', function () {
        return Inertia::render('payment/PaymentStatus', ['status' => 'pending']);
    });

    Route::get('/payment/failed', function () {
        return Inertia::render('payment/PaymentStatus', ['status' => 'failed']);
    });

    // API: Weddings
    Route::get('/api/weddings/my', [WeddingController::class, 'getMyWedding']);
    Route::post('/api/weddings/my', [WeddingController::class, 'updateMyWedding']);

    // API: Guests
    Route::get('/api/guests', [GuestController::class, 'index']);
    Route::post('/api/guests', [GuestController::class, 'store']);
    Route::get('/api/guests/stats', [GuestController::class, 'stats']);
    Route::post('/api/guests/import', [GuestController::class, 'import']);
    Route::post('/api/guests/bulk-delete', [GuestController::class, 'bulkDelete']);
    Route::post('/api/guests/checkin', [GuestController::class, 'checkin']);
    Route::put('/api/guests/{id}', [GuestController::class, 'update']);
    Route::delete('/api/guests/{id}', [GuestController::class, 'destroy']);

    // API: Themes
    Route::get('/api/themes', [ThemeController::class, 'index']);

    // API: Orders
    Route::get('/api/orders/packages', [OrderController::class, 'getPackages']);
    Route::get('/api/orders/history', [OrderController::class, 'history']);
    Route::post('/api/orders/checkout', [OrderController::class, 'checkout']);
    Route::get('/api/orders/{id}', [OrderController::class, 'show']);

    // API: Media
    Route::post('/api/media/upload', [MediaController::class, 'upload']);
    Route::post('/api/media/photos/sort', [MediaController::class, 'sortPhotos']);
    Route::delete('/api/media/photos/{id}', [MediaController::class, 'deletePhoto']);
});

/*
|--------------------------------------------------------------------------
| Admin Portal Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'admin'])->group(function () {

    // Admin Page Routes
    Route::get('/admin', function () {
        return Inertia::render('admin/Overview');
    })->name('admin.dashboard');

    Route::get('/admin/users', function () {
        return Inertia::render('admin/Users');
    });

    Route::get('/admin/orders', function () {
        return Inertia::render('admin/Orders');
    });

    Route::get('/admin/themes', function () {
        return Inertia::render('admin/Themes');
    });

    Route::get('/admin/packages', function () {
        return Inertia::render('admin/Packages');
    });

    Route::get('/admin/music', function () {
        return Inertia::render('admin/Music');
    });

    Route::get('/admin/finance', function () {
        return Inertia::render('admin/Finance');
    });

    Route::get('/admin/settings', function () {
        return Inertia::render('admin/Settings');
    });

    // Admin API Routes
    Route::get('/api/admin/analytics', [AdminController::class, 'getAnalytics']);
    
    Route::get('/api/admin/users', [AdminController::class, 'getUsers']);
    Route::get('/api/admin/users/{id}', [AdminController::class, 'getUserDetail']);
    Route::put('/api/admin/users/{id}/status', [AdminController::class, 'updateUserStatus']);
    Route::put('/api/admin/users/{id}/reset-password', [AdminController::class, 'resetUserPassword']);
    Route::delete('/api/admin/users/{id}', [AdminController::class, 'deleteUser']);

    Route::get('/api/admin/orders', [AdminController::class, 'getOrders']);
    Route::get('/api/admin/orders/{id}', [AdminController::class, 'getOrderDetail']);
    Route::post('/api/api/admin/orders/{id}/confirm', [AdminController::class, 'confirmOrder']); // support /api/api/admin pattern as Hono route registered
    Route::post('/api/admin/orders/{id}/confirm', [AdminController::class, 'confirmOrder']);
    Route::post('/api/admin/orders/{id}/cancel', [AdminController::class, 'cancelOrder']);
    Route::post('/api/admin/orders/{id}/refund', [AdminController::class, 'refundOrder']);

    Route::get('/api/admin/themes', [AdminController::class, 'getThemes']);
    Route::post('/api/admin/themes', [AdminController::class, 'storeTheme']);
    Route::put('/api/admin/themes/{id}', [AdminController::class, 'updateTheme']);
    Route::delete('/api/admin/themes/{id}', [AdminController::class, 'deleteTheme']);

    Route::get('/api/admin/packages', [AdminController::class, 'getPackages']);
    Route::post('/api/admin/packages', [AdminController::class, 'storePackage']);
    Route::put('/api/admin/packages/{id}', [AdminController::class, 'updatePackage']);

    Route::get('/api/admin/music', [AdminController::class, 'getMusic']);
    Route::post('/api/admin/music', [AdminController::class, 'storeMusic']);
    Route::put('/api/admin/music/{id}', [AdminController::class, 'updateMusic']);
    Route::delete('/api/admin/music/{id}', [AdminController::class, 'deleteMusic']);

    Route::get('/api/admin/finance', [AdminController::class, 'getFinanceReport']);

    Route::get('/api/admin/settings', [AdminController::class, 'getSettings']);
    Route::put('/api/admin/settings', [AdminController::class, 'updateSettings']);
    Route::post('/api/admin/settings/test-email', [AdminController::class, 'testEmail']);
});

require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| Dynamic Fallback public wedding slug routing
|--------------------------------------------------------------------------
*/
Route::get('/{slug}', [WeddingController::class, 'renderPublicInvitation']);
