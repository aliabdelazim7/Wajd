# Final live smoke-test findings — 2026-08-21

## Production routes checked

- `https://www.wajd-agency.com/` rendered in the connected browser with the Arabic homepage, bilingual navigation, Growth ROI Calculator, Product Demo, Social Proof, pricing, and contact sections visible in extracted content.
- `https://www.wajd-agency.com/insights?lang=ar` rendered in the connected browser with the Arabic Growth Insights hub, three article cards, reading-time labels, dates, source-backed positioning, and contact CTA.
- `https://www.wajd-agency.com/api/content?locale=ar` returned HTTP 200 with the expected CMS payload.
- `https://www.wajd-agency.com/api/activity/recent` returned HTTP 200 with `{"data":[]}` after the production analytics tables were applied and the public route was hardened.

## Notable findings

- The live React app is not a white screen: both the homepage and Insights route expose populated content after hydration.
- The custom domain emits locale-aware server-rendered metadata for `/insights?lang=en`, including `Growth Insights | Wajd Agency` and a source-backed description.
- The activity feed is intentionally empty until recent safe conversion events exist; it no longer fails with HTTP 500.
- Browser annotated screenshots appear very dark because the tool overlays interaction bounding boxes and captures the upper viewport before visual content fully paints; extracted page content confirms successful hydration.

## Database advisory results

Supabase security advisors now report the new `lead_nurture_events`, `visitor_sessions`, and `visitor_events` tables as RLS-enabled with no policies, which is the intended default-deny posture for public clients while the Laravel server-side connection continues to operate. The advisors still show INFO-level RLS/no-policy findings on the existing CMS tables; those findings pre-date this release and follow the project’s existing backend-only access model.

The performance advisor reports INFO-level unused-index notices for newly added indexes because the new features have not accumulated production traffic yet, plus existing unindexed foreign-key notices on legacy `audit_logs` and `media_assets`. No ERROR-level performance finding was reported for the new activity query.
