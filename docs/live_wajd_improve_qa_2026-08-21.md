# Wajd Improve Live QA — August 21, 2026

## Deployment
The `/wajd-improve` release was deployed to Vercel from commit `bf251dd` and reported `READY` in production.

## Arabic homepage
The live homepage at `https://www.wajd-agency.com/` rendered with the Arabic title `وكالة وجد | شريك النمو والتقنية في الخليج`, Arabic navigation, and RTL presentation. The site remained functional and did not show the previous blank-screen failure.

## English homepage
The live locale variant at `https://www.wajd-agency.com/?lang=en` rendered with the English title `Wajd Agency | Tech-Enabled Growth Partner in the Gulf`, English navigation, and LTR content. The Growth Engine builder showed the new decision-support text, including `Best for` plan guidance and `Recommended with Growth Plan` on LiftDesk AI automation.

## Builder verification
The English builder displayed Starter at SAR 350/month, Growth at SAR 950/month, Partner at SAR 2,200/month, and technical modules with the approved one-time/monthly labels. The default cart showed Growth Plan at SAR 950/month and the request CTA remained visible.

## Static shell verification
The first live curl check exposed that Vercel was still using the legacy `api/main.php` shell even though the public source had been updated. The gateway was corrected, the leftover `/debug-files` endpoint was removed, and a second production deployment reached `READY`. The final live curl check confirmed the new Arabic and English titles/descriptions, canonical URL, reciprocal hreflang links, hashed asset, updated robots directives, and expanded sitemap.

## Remaining note
Browser extraction confirms visible copy and metadata. A full Lighthouse run and Search Console validation still require an external performance/analytics session; the release was validated locally with PHP lint, Vite production build, and repository diff checks.
