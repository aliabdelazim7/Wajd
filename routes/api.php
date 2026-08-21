<?php

use App\Http\Controllers\API\Admin\AuthController;
use App\Http\Controllers\API\Admin\CmsController;
use App\Http\Controllers\API\ContentController;
use App\Http\Controllers\API\LeadController;
use App\Http\Controllers\API\UploadController;
use App\Http\Controllers\API\AnalyticsController;
use App\Http\Controllers\API\NurtureController;
use App\Http\Controllers\API\PublicActivityController;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\RequireAdminBearerToken;
use Illuminate\Support\Facades\Route;

Route::get('/debug-env', function() {
    return response()->json([
        'app_env' => config('app.env'),
        'app_debug' => config('app.debug'),
        'has_app_key' => !empty(config('app.key')),
        'db_connection' => config('database.default'),
        'db_host' => config('database.connections.pgsql.host'),
        'cache_driver' => config('cache.default'),
        'session_driver' => config('session.driver'),
    ]);
});

Route::get('/content', [ContentController::class, 'index']);
Route::get('/content/projects/{slug}', [ContentController::class, 'project']);

Route::post('/leads/submit', [LeadController::class, 'submit'])
    ->middleware('throttle:lead-submissions');

Route::post('/analytics/collect', [AnalyticsController::class, 'collect'])
    ->middleware('throttle:analytics-collection');

Route::get('/automation/nurture', [NurtureController::class, 'run']);
Route::get('/activity/recent', [PublicActivityController::class, 'recent']);

Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:admin-login');

    Route::middleware([
        RequireAdminBearerToken::class,
        'auth:sanctum',
        EnsureAdmin::class,
    ])->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/overview', [CmsController::class, 'overview']);
        Route::get('/analytics', [AnalyticsController::class, 'dashboard']);

        Route::get('/settings', [CmsController::class, 'settings']);
        Route::put('/settings', [CmsController::class, 'upsertSetting']);
        Route::delete('/settings/{setting}', [CmsController::class, 'deleteSetting']);

        Route::get('/blocks', [CmsController::class, 'blocks']);
        Route::put('/blocks', [CmsController::class, 'upsertBlock']);
        Route::delete('/blocks/{block}', [CmsController::class, 'deleteBlock']);

        Route::get('/packages', [CmsController::class, 'packages']);
        Route::post('/packages', [CmsController::class, 'storePackage']);
        Route::put('/packages/{package}', [CmsController::class, 'updatePackage']);
        Route::delete('/packages/{package}', [CmsController::class, 'deletePackage']);

        Route::get('/faqs', [CmsController::class, 'faqs']);
        Route::post('/faqs', [CmsController::class, 'storeFaq']);
        Route::put('/faqs/{faq}', [CmsController::class, 'updateFaq']);
        Route::delete('/faqs/{faq}', [CmsController::class, 'deleteFaq']);

        Route::get('/projects', [CmsController::class, 'projects']);
        Route::post('/projects', [CmsController::class, 'storeProject']);
        Route::put('/projects/{project}', [CmsController::class, 'updateProject']);
        Route::delete('/projects/{project}', [CmsController::class, 'deleteProject']);

        Route::get('/leads', [CmsController::class, 'leads']);
        Route::patch('/leads/{lead}/status', [CmsController::class, 'updateLeadStatus']);
        Route::post('/leads/{lead}/follow-up', [CmsController::class, 'triggerLeadFollowUp']);
        Route::delete('/leads/{lead}', [CmsController::class, 'deleteLead']);

        Route::get('/media', [UploadController::class, 'index']);
        Route::post('/media', [UploadController::class, 'uploadImage']);
        Route::delete('/media/{asset}', [UploadController::class, 'destroy']);

        Route::get('/audit-logs', [CmsController::class, 'auditLogs']);
    });
});
