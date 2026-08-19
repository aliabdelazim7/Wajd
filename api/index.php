<?php

/**
 * Vercel entrypoint for the Laravel application.
 *
 * Vercel's legacy routes rewrite /api/* requests to this file. The internal
 * __path query parameter carries the original URI so Laravel can dispatch
 * API routes instead of seeing /api/index.php.
 */
$forwardedPath = $_GET['__path'] ?? null;

if (is_string($forwardedPath) && str_starts_with($forwardedPath, '/api')) {
    $query = $_GET;
    unset($query['__path']);

    $_SERVER['REQUEST_URI'] = $forwardedPath.($query !== [] ? '?'.http_build_query($query) : '');
    $_SERVER['PATH_INFO'] = $forwardedPath;
    $_SERVER['QUERY_STRING'] = http_build_query($query);
}

require __DIR__.'/../public/index.php';
