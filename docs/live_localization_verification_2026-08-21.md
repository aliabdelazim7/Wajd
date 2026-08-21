# Live localization verification — 2026-08-21

## Deployment

- Production deployment: Vercel project `wajd-agency-website`
- Commit: `4a07bad` — `Fix bilingual portfolio result localization`
- Deployment state: `READY`
- Verified domain: https://www.wajd-agency.com/

## Checks completed

1. English homepage opened successfully at `/?lang=en`. The page title, navigation, hero, ROI calculator, product previews, portfolio proof, package builder, FAQ, and final CTA rendered as English content; no blank-screen failure was observed in the extracted page content.
2. English case study opened successfully at `/portfolio/al-owaid?lang=en`. The Results achieved section displayed: `2.62x purchase ROAS`, `1,137 purchases`, `8,274 adds to cart`, and `$28,268.79 ad spend`.
3. Arabic API case-study response returned Arabic result bullets for the same project: `عائد شراء 2.62x`, `1,137 عملية شراء`, `8,274 إضافة إلى السلة`, and `إنفاق إعلاني $28,268.79`.
4. English API case-study response returned English result bullets for the same project and HTTP 200.

## Conclusion

The production API and frontend now use locale-specific portfolio result arrays. Existing records were backfilled in Supabase, and the English case-study page no longer displays the Arabic result bullets.
