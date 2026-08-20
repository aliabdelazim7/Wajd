<?php

use App\Http\Controllers\API\Admin\AuthController;
use App\Http\Controllers\API\Admin\CmsController;
use App\Http\Controllers\API\ContentController;
use App\Http\Controllers\API\LeadController;
use App\Http\Controllers\API\UploadController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Support\Facades\Route;

Route::get('/content', [ContentController::class, 'index']);
Route::get('/debug-config', function() {
    return response()->json([
        'host' => config('database.connections.pgsql.host'),
        'port' => config('database.connections.pgsql.port'),
        'database' => config('database.connections.pgsql.database'),
        'username' => config('database.connections.pgsql.username'),
        'env_port' => env('DB_PORT'),
        'wajd_env_port' => env('WAJD_DB_PORT'),
        'wajd_env_url' => env('WAJD_DB_URL') ? 'set' : 'not set',
    ]);
});
Route::get('/content/projects/{slug}', [ContentController::class, 'project']);

Route::post('/leads/submit', [LeadController::class, 'submit'])
    ->middleware('throttle:lead-submissions');

Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:admin-login');

    Route::middleware(['auth:sanctum', EnsureAdmin::class])->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/overview', [CmsController::class, 'overview']);

        Route::get('/settings', [CmsController::class, 'settings']);
        Route::post('/settings', [CmsController::class, 'updateSettings']);

        Route::get('/projects', [CmsController::class, 'projects']);
        Route::post('/projects', [CmsController::class, 'storeProject']);
        Route::get('/projects/{project}', [CmsController::class, 'showProject']);
        Route::post('/projects/{project}', [CmsController::class, 'updateProject']);
        Route::delete('/projects/{project}', [CmsController::class, 'deleteProject']);

        Route::get('/leads', [CmsController::class, 'leads']);
        Route::get('/leads/{lead}', [CmsController::class, 'showLead']);
        Route::post('/leads/{lead}/status', [CmsController::class, 'updateLeadStatus']);

        Route::post('/upload', [UploadController::class, 'upload']);
    });
});
