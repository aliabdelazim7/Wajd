<?php

use Illuminate\Support\Facades\Route;

Route::middleware('api')->prefix('api')->group(function (): void {
    require __DIR__.'/api.php';
});

Route::get('{any}', function () {
    return view('app');
})->where('any', '^(?!api(?:/|$)|up$).*$');
