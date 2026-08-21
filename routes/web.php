<?php

use Illuminate\Support\Facades\Route;

// Vercel serves the public shell directly; this fallback keeps the Laravel app
// functional in local, preview, and traditional PHP environments as well.
Route::get('/', function () {
    return view('app');
});

Route::get('/health-check', function () {
    return ['status' => 'ok'];
});
