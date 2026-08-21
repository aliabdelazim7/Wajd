<?php

use App\Http\Middleware\RequireAdminBearerToken;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

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
        $middleware->alias([
            'admin.bearer' => RequireAdminBearerToken::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Throwable $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            if ($exception instanceof ValidationException) {
                return new JsonResponse([
                    'message' => 'The given data was invalid.',
                    'errors' => $exception->errors(),
                ], 422);
            }

            $status = $exception instanceof AuthenticationException
                ? 401
                : ($exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : 500);
            $message = match ($status) {
                404 => 'Resource not found.',
                401 => 'Unauthenticated.',
                403 => 'Forbidden.',
                429 => 'Too many requests. Please try again later.',
                default => $status >= 500 ? 'An unexpected error occurred.' : 'Request could not be processed.',
            };

            return new JsonResponse(['message' => $message], $status);
        });
    })
    ->create();
