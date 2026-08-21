# Wajd launch verification — 2026-08-21

## Production status

- Public site: https://www.wajd-agency.com/
- Content API: https://www.wajd-agency.com/api/content
- Supabase project: `wurvjwbnnusicksvjtey`
- Vercel project: `wajd-agency-website` (`prj_UuAHx17sfrLxGDgxJQspVWrwSvKc`)
- Vercel team: `team_nQjaTB7zN6N4Y5WqBYd5Lf1K`

## Resolved

1. The Laravel-to-Supabase PostgreSQL connection now works through the transaction pooler at `aws-1-eu-west-1.pooler.supabase.com:6543` with the tenant-qualified database user.
2. The database password was reset in Supabase and the production `WAJD_DB_PASSWORD` variable updated in Vercel. The connection was verified from the sandbox with `SELECT 1`.
3. The public content endpoint returns populated data and the React SPA renders correctly at the production domain.
4. Arabic and English home and contact page flows were visually checked. The language switch loads localized navigation, copy, packages, and contact form labels. The contact form has required fields, consent, backend validation, rate limiting, and Telegram integration configured.
5. Temporary `/api/debug-config` database diagnostics were removed from `routes/api.php` in commit `76e11495b3e2cec18d620b7afcd9e828c84b78e2`.
6. API exception handling was replaced with safe JSON errors in commit `e0e5036a95d70769d03618e2e6bdc96d587df454`. Verification confirmed that `/api/debug-config` now returns `404 {"message":"Resource not found."}` without a server path or stack trace.

## Content review follow-up

- The public-facing Arabic copy still includes some intentionally premium phrases such as "محرك النتائج", "نهندس النتائج", and "احجز مقعدك في القمة". Earlier feedback requested lighter language; revise these together with their English counterparts if further refinement is desired.
- CMS blocks are locale-specific. The hero uses `home.hero` from the content API when available; core fallback copy is in `resources/js/v2/translations.js`.
- FAQ and some case-study paths combine CMS content with static fallbacks, which can create bilingual drift. Normalize these if a full copy pass is started.

## Security follow-up

- Do not reintroduce public debug endpoints or exception traces.
- Keep database credentials only in Vercel/Supabase secrets and never in React source.

