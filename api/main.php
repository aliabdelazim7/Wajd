<?php

$uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($uri, PHP_URL_PATH) ?? '/';

$forwardedPath = $_GET['route'] ?? ($_GET['__path'] ?? null);

$isApi = str_starts_with($path, '/api') ||
         str_starts_with($path, '/up') ||
         str_starts_with($path, '/health-check') ||
         (is_string($forwardedPath) && (str_starts_with($forwardedPath, '/api') || str_starts_with($forwardedPath, '/up')));

if ($isApi) {
    if (is_string($forwardedPath) && (str_starts_with($forwardedPath, '/api') || str_starts_with($forwardedPath, '/up'))) {
        $query = $_GET;
        unset($query['route'], $query['__path']);

        $_SERVER['REQUEST_URI'] = $forwardedPath . ($query !== [] ? '?' . http_build_query($query) : '');
        $_SERVER['PATH_INFO'] = $forwardedPath;
        $_SERVER['QUERY_STRING'] = http_build_query($query);
    }

    $_SERVER['SCRIPT_NAME'] = '/api/index.php';
    $_SERVER['PHP_SELF'] = '/api/index.php';
    $_SERVER['DOCUMENT_URI'] = '/api/index.php';

    define('LARAVEL_START', microtime(true));

    // Ensure /tmp directories exist for Laravel.
    $tmpDirs = [
        '/tmp/laravel/views',
        '/tmp/laravel/cache',
        '/tmp/laravel/sessions',
    ];
    foreach ($tmpDirs as $dir) {
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
    }

    require __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';

    $response = $app->handleRequest(\Illuminate\Http\Request::capture());
    $response->send();
    $app->terminate($response);
    exit;
}

// The public shell owns web metadata, structured data, locale handling, and manifest-based assets.
require __DIR__ . '/../public/index.php';
