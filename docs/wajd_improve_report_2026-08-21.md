# Wajd Agency — /wajd-improve Release Report

**Date:** August 21, 2026
**Release commits:** `bf251dd` and `512d1d8`
**Production:** `https://www.wajd-agency.com/`

## Executive Summary

The Wajd website received a combined SEO, AI-search visibility, conversion, and dashboard UX improvement pass. The most important discovery was that the first SEO implementation had been applied to `public/index.php`, while the real Vercel web path was serving the older HTML shell from `api/main.php`. That gateway has now been corrected so the live custom domain serves the intended metadata and asset manifest.

The public site now presents a clearer modular Growth Engine offer, with plan-fit guidance and a context-aware recommendation for LiftDesk AI Automation when the Growth Plan is selected. The admin overview now gives the operator a more actionable daily summary instead of exposing only raw counts.

## Implemented Changes

| Area | Change | Outcome |
| :--- | :--- | :--- |
| Production shell | Manifest-based hashed asset lookup, canonical URL, bilingual title/description, OG/Twitter tags, `lang`/`dir`, `robots`, and structured data | Search engines and social previews receive accurate page signals without depending only on React execution |
| International SEO | Arabic and English hreflang variants using the current query-based locale architecture; locale is persisted in local storage and a first-party cookie | Language switches survive reloads and the server can render the matching language shell |
| Structured data | Organization/LocalBusiness, WebSite, OfferCatalog, service modules, and grounded bilingual FAQPage JSON-LD | Better extraction for search engines and answer engines |
| AI-search visibility | Rewrote `public/llms.txt` and `public/pricing.md` to describe the modular Growth Engine, approved prices, technical add-ons, and current positioning | AI agents no longer receive the old fixed-package story |
| Crawlability | Added `/services` and known case-study routes to the sitemap; excluded `/admin` and `/api` in `robots.txt` | Important public routes are discoverable while internal surfaces stay out of crawl paths |
| CRO | Added bilingual plan-fit hints and a “Recommended with Growth Plan” LiftDesk label in the builder | Reduces choice anxiety without hiding the modular pricing model |
| Dashboard UX | Added operational summary context and KPI hints to the admin overview | The operator can see what needs attention and what each number represents |
| Vercel gateway | Removed the leftover `/debug-files` endpoint and routed web requests through the canonical public shell | Eliminates an unnecessary diagnostic surface and aligns production behavior with source changes |

## Verification Evidence

Local verification passed with no PHP syntax errors in `public/index.php` or `api/main.php`, a successful Vite production build, and a clean `git diff --check`. The build still reports a non-blocking bundle-size warning because the single SPA JavaScript chunk is above 500 kB; code splitting is the next performance opportunity.

The live Vercel deployment for the gateway fix reached `READY`. A direct live-shell check confirmed the Arabic homepage serves the new Arabic title and description, while `?lang=en` serves the English title and description. The same check confirmed canonical and hreflang tags, the new hashed JavaScript asset, the updated robots directives, and the expanded sitemap.

The browser QA check confirmed that the English Growth Engine builder displays the three approved base plans, the plan-fit hints, the LiftDesk recommendation label, the correct monthly/one-time labels, and the request CTA. No blank public page was reproduced.

## Remaining Priority Roadmap

The next performance sprint should split the 650+ kB JavaScript bundle by route and defer non-critical animation libraries. After that, run a Lighthouse audit on a representative mobile device and connect Search Console to establish real-world Core Web Vitals and query baselines.

The next CRO experiment should compare the current modular builder against a guided two-step version that asks “What stage is your business in?” before showing the recommended base plan. The current implementation intentionally keeps the full catalog visible, so this should be tested rather than assumed.

The next dashboard sprint should convert the leads table into a mobile card view, add filters and pagination to audit activity, and format settings JSON into editable grouped fields. These are usability improvements, not production blockers.

## Important Limitation

The audit did not claim organic ranking gains or Core Web Vitals pass/fail results because Search Console and a full Lighthouse session were not available in this run. Those outcomes require measurement after the release has accumulated real traffic.
