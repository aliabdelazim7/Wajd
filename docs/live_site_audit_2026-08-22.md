# Live site audit — 2026-08-22

## Scope

Reviewed the live Wajd homepage in Arabic and English after the contact-form and Arabic-default releases. Checked the first viewport, navigation, CTA paths, ROI calculator, product demo, social proof, portfolio links, and the public client-portal API.

## Findings fixed

### Arabic UI leakage

The Arabic product demo still displayed `Last 30 days`, `W1`–`W4`, `Healthy`, `Running`, and `Live`. The empty social-proof video state displayed `CMS ready`. These labels are now localized through the component copy model. Arabic live verification showed `آخر 30 يوماً`, `أ1`–`أ4`, `جيد`, `يعمل`, `مباشر`, and `جاهز للإضافة من لوحة التحكم` where applicable.

### Client portal data exposure

The public portal endpoint previously fell back to `Lead::latest()` when a token was missing or invalid, which could expose the most recent lead. The fallback was removed. The endpoint now requires a token, validates strict base64-decoded email syntax, restricts lookup to invited leads, and returns 401/404 instead of another client’s data.

### English regression check

The English homepage was checked after the changes. Navigation, hero, ROI calculator, product demo, portfolio proof, and CTA content remained coherent and functional.

## Automated checks

- Vite production build: passed.
- Laravel test suite: 8 tests passed, 42 assertions.
- `git diff --check`: passed.
- Latest production deployment: Vercel `READY`.
- Audit commit: `fae1245`.

## Remaining non-blocking observations

The production bundle still reports a chunk-size warning above 500 kB. This does not block functionality, but future performance work should split the large React bundle using route-level dynamic imports. Product names such as `Market POS`, `LiftDesk`, `ROAS`, `CAC`, and currency code `SAR` remain intentionally unchanged as product or industry terminology.
