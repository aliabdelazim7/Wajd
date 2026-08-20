<?php

use Illuminate\Support\Facades\Route;

// All web routes are handled by the PHP SPA shell in api/main.php
Route::get('/health-check', function () {
    return ['status' => 'ok'];
});
