# Vercel deployment research

## Sources

1. [vercel-community/php](https://github.com/vercel-community/php) — current README documents the PHP runtime, recommends `vercel-php@0.9.0` for PHP 8.5, supports `functions` entries for `api/*.php`, and shows catch-all routing to `/api/index.php`. It also notes that Composer is supported and that filesystems in serverless functions should not be treated as persistent application storage.
2. [Vercel Functions](https://vercel.com/docs/functions) — Vercel Functions run per invocation, scale to zero, and should execute near the external data source; persistent application state belongs in an external database or storage service.
3. [Vercel environment variables](https://vercel.com/docs/environment-variables) — variables are configured outside source code, are encrypted at rest, apply to new deployments after changes, and support the PHP Community Runtime.

## Release implications

The project should use an external production database instead of SQLite on Vercel, configure `APP_KEY`, database credentials, `FILESYSTEM_DISK`, S3-compatible storage variables, and admin credentials in Vercel Environment Variables, and run migrations from a controlled deployment/maintenance environment. Uploaded media should use the configured persistent storage disk, not the ephemeral function filesystem.
