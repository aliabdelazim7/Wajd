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

## Bundle-splitting performance follow-up

- Before this change, the main JavaScript chunk exceeded the 500 kB Vite warning threshold.
- After route-level lazy loading, the main chunk is `390.63 kB` (`134.28 kB` gzip).
- Page chunks are loaded on demand; the largest page-specific chunk is `Layout` at `137.90 kB` (`45.30 kB` gzip), followed by `Home` at `71.35 kB` (`19.74 kB` gzip).
- The Vite build completed without the previous >500 kB chunk warning.
- Production commit: `92efc56`.
- Vercel deployment: `https://wajd-agency-website-f47kd1voa-ali-abdelazim-s-projects.vercel.app` with state `READY`.

## Live smoke verification after code splitting

The READY performance deployment was opened from a clean Arabic homepage URL. The first viewport rendered in Arabic with the navigation, hero, ROI controls, product demo, portfolio proof, and primary CTA present. The product-demo content was available without a blank route state.

The Arabic `/contact` route was then opened directly. Its lazy page chunk loaded successfully, the form displayed the expected name, company, email, phone/WhatsApp, social URL, service, industry, budget, contact preference, message, consent, and submit controls, and the localized contact copy remained intact.
