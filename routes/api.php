<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Casir POS
|--------------------------------------------------------------------------
|
| Semua route API menggunakan prefix /api/v1
| dan middleware auth:sanctum untuk route yang terproteksi.
|
*/

Route::prefix('v1')->group(function () {

    // ─── Auth (Public) ────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
        Route::post('forgot-password', [\App\Http\Controllers\Api\AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [\App\Http\Controllers\Api\AuthController::class, 'resetPassword']);
    });

    // ─── Authenticated Routes ─────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::prefix('auth')->group(function () {
            Route::post('logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
            Route::get('me', [\App\Http\Controllers\Api\AuthController::class, 'me']);
        });

        // TODO: Uncomment when controllers are implemented
        // Dashboard
        // Route::get('dashboard', [\App\Http\Controllers\Api\DashboardController::class, 'index']);

        // Categories
        // Route::apiResource('categories', \App\Http\Controllers\Api\CategoryController::class);

        // Menus
        // Route::apiResource('menus', \App\Http\Controllers\Api\MenuController::class);

        // Payment Methods
        // Route::apiResource('payment-methods', \App\Http\Controllers\Api\PaymentMethodController::class);

        // Orders
        Route::patch('orders/{order}/status', [\App\Http\Controllers\Api\OrderController::class, 'updateStatus']);
        Route::apiResource('orders', \App\Http\Controllers\Api\OrderController::class);

        // Reports (Admin only)
        // Route::prefix('reports')->group(function () {
        //     Route::get('daily', [\App\Http\Controllers\Api\ReportController::class, 'daily']);
        //     Route::get('monthly', [\App\Http\Controllers\Api\ReportController::class, 'monthly']);
        //     Route::get('export', [\App\Http\Controllers\Api\ReportController::class, 'export']);
        // });

        // Users / Karyawan (Admin only)
        // Route::patch('users/{user}/toggle-active', [\App\Http\Controllers\Api\UserController::class, 'toggleActive']);
        // Route::apiResource('users', \App\Http\Controllers\Api\UserController::class);

        // Audit Logs (Admin only)
        // Route::get('audit-logs', [\App\Http\Controllers\Api\AuditLogController::class, 'index']);
    });

    // ─── Public Self-Order (Pembeli, no auth) ─────────────────────────
    Route::prefix('self-order')->group(function () {
        Route::get('menus', [\App\Http\Controllers\Api\SelfOrderController::class, 'menuList']);
        Route::post('orders', [\App\Http\Controllers\Api\SelfOrderController::class, 'placeOrder']);
        Route::get('orders/{customerIdentifier}', [\App\Http\Controllers\Api\SelfOrderController::class, 'orderStatus']);
    });
});
