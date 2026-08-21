<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\JsonResponse;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(using: function (): void {
        Route::middleware('api')
            ->prefix('api')
            ->group(__DIR__.'/../routes/api.php');

        Route::middleware('web')
            ->group(__DIR__.'/../routes/web.php');

        Route::get('/up', function (Request $request) {
            return new JsonResponse(['status' => 'up']);
        });
    }, commands: __DIR__.'/../routes/console.php')
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->validateCsrfTokens(except: ['api/*']);
    })
    ->create();
