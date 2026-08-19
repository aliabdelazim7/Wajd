# Wajd Agency — Vercel deployment runbook

This project now contains a Laravel API, a React/Vite frontend, and a protected CMS at `/admin`. Vercel can run the Laravel entrypoint through the community PHP runtime, but **Vercel is not a persistent Laravel server**. Production state must live in an external database and an external object-storage disk.

## 1. Required production services

Use a managed MySQL/PostgreSQL database for Laravel migrations and Sanctum tokens. Use S3 or an S3-compatible bucket for CMS media uploads. Do not use the local SQLite database or the `public/uploads` directory in production; serverless filesystem changes are not a durable media strategy.

## 2. Required Vercel environment variables

Add these variables in the Vercel Project Settings for **Production**, then create a new deployment. Never commit real values to `.env` or source control.

| Variable | Purpose |
|---|---|
| `APP_KEY` | Laravel encryption key generated with `php artisan key:generate --show` |
| `APP_URL` | Final production URL, for example `https://wajd.agency` |
| `DB_CONNECTION` | `mysql` or `pgsql` |
| `DB_HOST` / `DB_PORT` / `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | Managed database connection |
| `FILESYSTEM_DISK` | Set to `s3` for production media |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_DEFAULT_REGION` / `AWS_BUCKET` | S3-compatible storage credentials |
| `AWS_ENDPOINT` | Required by some S3-compatible providers; leave empty for AWS S3 |
| `SESSION_DRIVER` | Keep `cookie` for the stateless serverless deployment |
| `CACHE_STORE` | Keep `array` unless an external cache is configured |
| `QUEUE_CONNECTION` | Keep `sync` until a persistent queue worker exists |
| `WAJD_ADMIN_EMAIL` / `WAJD_ADMIN_PASSWORD` | Optional only for first-run seeding; prefer the artisan command below |

Vercel environment changes apply to new deployments, not already-running deployments.

## 3. First production database setup

Run the following from a controlled environment with the production database connection available. Do not run destructive refresh commands against production.

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan db:seed --class=WajdCmsSeeder --force
php artisan wajd:make-admin admin@your-domain.com --name="Wajd Admin"
```

When the command prompts for the password, use a unique password of at least 12 characters. If the optional `WAJD_ADMIN_*` variables were used for the first seed, remove or rotate them after the admin account exists.

## 4. Deploy

```bash
npm install
npm run build
vercel --prod
```

The repository includes `vercel.json`, which routes static assets to `public/` and all application/API traffic to `api/index.php`. The PHP runtime is pinned to `vercel-php@0.9.0` to satisfy the project's PHP 8.3+ requirement.

## 5. Smoke tests after deployment

```bash
curl -f "$APP_URL/up"
curl -f "$APP_URL/api/content?locale=ar"
curl -i -X POST "$APP_URL/api/admin/login" \
  -H 'Content-Type: application/json' \
  --data '{"email":"admin@your-domain.com","password":"REDACTED"}'
```

Then open `https://your-domain.com/admin`, sign in, confirm the Overview page loads, and verify that a test package/content edit is visible on the public site. Delete the test edit afterward.

## 6. Important operational notes

The admin API is protected by Sanctum bearer tokens and the explicit `EnsureAdmin` middleware. Public lead intake is validated, rate-limited, deduplicated, and stored in the `leads` table. Every protected write is recorded in `audit_logs`. Media deletion removes the object from the configured disk and the media record from the database.

For database or storage provider outages, the public site falls back to the bundled editorial copy and the admin UI displays an actionable error instead of silently reporting success.
