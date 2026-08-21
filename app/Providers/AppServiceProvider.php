<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('lead-submissions', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip() ?: 'unknown');
        });

        RateLimiter::for('admin-login', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip() ?: 'unknown');
        });

        RateLimiter::for('analytics-collection', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip() ?: 'unknown');
        });
    }
}
