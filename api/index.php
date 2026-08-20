<?php

/**
 * Vercel entrypoint for the Laravel application.
 *
 * Vercel's legacy routes rewrite /api/* requests to this file. The internal
 * route query parameter carries the original URI so Laravel can dispatch
 * API routes instead of seeing /api/index.php.
 */
$forwardedPath = $_GET['route'] ?? ($_GET['__path'] ?? null);

if (is_string($forwardedPath) && str_starts_with($forwardedPath, '/api')) {
    $query = $_GET;
    unset($query['route'], $query['__path']);

    $_SERVER['REQUEST_URI'] = $forwardedPath.($query !== [] ? '?'.http_build_query($query) : '');
    $_SERVER['PATH_INFO'] = $forwardedPath;
    $_SERVER['QUERY_STRING'] = http_build_query($query);
}

$currentUri = $_SERVER['REQUEST_URI'] ?? '/';
$currentPath = parse_url($currentUri, PHP_URL_PATH) ?: '/';
$entrypointPrefix = '/api/index.php/';

if (str_starts_with($currentPath, $entrypointPrefix)) {
    $laravelPath = '/api'.substr($currentPath, strlen('/api/index.php'));
    $queryString = $_SERVER['QUERY_STRING'] ?? '';

    $_SERVER['REQUEST_URI'] = $laravelPath.($queryString !== '' ? '?'.$queryString : '');
    $_SERVER['PATH_INFO'] = $laravelPath;
}

// The Vercel function lives at /api/index.php, but Laravel's public index is
// the application base. Align CGI variables so Symfony keeps the full path.
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';
$_SERVER['DOCUMENT_URI'] = '/index.php';

require __DIR__.'/../public/index.php';
