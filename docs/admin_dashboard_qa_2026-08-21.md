# Wajd Admin Dashboard QA — 2026-08-21

## Scope
Read-only live audit of `https://www.wajd-agency.com/admin` in My Browser, covering login, overview, navigation, module loading, empty states, and mobile/desktop usability. No content was edited or deleted.

## Initial findings

The live admin login loaded successfully and accepted the existing session credentials. The overview module rendered without a blank screen and showed five leads, five new leads, three published packages, three projects, and three FAQs. The overview also rendered recent leads and recent activity.

The dashboard is a single React SPA mounted at `/admin`. The navigation exposes nine modules: overview, site content blocks, packages, FAQs, case studies, leads, media library, settings, and audit log. The central frontend currently clears `payload` before each request and renders a generic loading message only while `loading && !payload`; module-specific runtime errors are not isolated by an error boundary.

## QA protocol

Test each navigation item from the live dashboard without mutating records. Record whether the module loads, whether data matches its table contract, whether empty states are clear, and whether the module can be refreshed or revisited without a blank screen.

## Findings log

The site-content module first displayed a transient loading panel and an empty-state message, then populated successfully after the API response arrived. It rendered 14 content records (Arabic and English variants) with edit/delete controls. This is a UX defect: the table currently presents `لا توجد عناصر بعد` during the loading window instead of a dedicated loading state, which can be misread as missing data. The module itself did not crash on the live run.

The FAQ module initially showed the same loading-plus-empty-state flash, then rendered three bilingual FAQ records with edit/delete controls. Data and table shape were correct on the live run; the loading/empty-state race is shared across collection tabs.

The packages module showed the same transient loading/empty-state flash, then rendered the three expected plans at SAR 350, SAR 950, and SAR 2,200 with Arabic/English names, prices, and feature summaries. The table contract matched the API and did not crash.

The case-studies module showed the shared loading/empty-state flash, then rendered three records with Arabic names, slugs, categories, thumbnails, and edit/delete controls. The image URLs loaded successfully in the live browser; no module crash was reproduced.

The leads module showed the shared loading/empty-state flash, then rendered five lead records with contact details, service, SAR budget, status selects, dates, and delete buttons. The table is functionally present, but it is very wide (`min-w-[1000px]`) and relies on horizontal scrolling on smaller screens. The current live records include multiple QA/test submissions, which makes the operational view noisy. Package-selection details were not present in these older test records, so that branch remains unverified against a real modular-builder lead. Delete controls are direct and visually prominent; the existing confirm dialog is a minimum safeguard but the UX would benefit from a safer secondary action and clearer destructive wording.

The media library loaded successfully and confirmed a genuine empty collection, not a stalled request. The upload control is visible, and the empty state is clear enough, but it does not explain supported file limits, recommended dimensions, storage status, or what the user should do after upload. The module currently has no media records to exercise thumbnail/error handling.

The settings module showed the shared loading/empty-state flash, then rendered three JSON settings records (`brand`, `contact`, and `seo`) with edit/delete controls. The data is technically visible, but long JSON values are difficult to scan and edit safely in a table. The module needs formatted summaries, an editor with JSON validation feedback, and clearer distinction between public settings and sensitive configuration.

The audit-log module showed the shared loading/empty-state flash, then rendered one activity row for the prior lead deletion. Date, user, action, entity, and metadata fields were visible. The module is functional but lacks filters, pagination, a retention indicator, and a clearer human-readable action label.

Pending module-by-module testing.

## Developer evidence

Primary code surface: `/home/ubuntu/wajd-repo/resources/js/v2/pages/Admin.jsx`. The public admin API routes are defined in `routes/api.php`; admin data is served through `app/Http/Controllers/API/Admin/CmsController.php`. The frontend normalizes collections from `response.data` and nested paginator `response.data.data`, but does not provide a React error boundary around individual module renderers. The Laravel admin endpoints return consistent `{ data: ... }` envelopes; collection endpoints for leads and audit logs return paginators under `data`, while other modules return arrays. This contract is compatible with the current normalizer.

The main confirmed frontend defect is in `Admin.load()`: it calls `setPayload(null)` before every request, while the tab renderer remains mounted and sees an empty array before the request finishes. That produces a loading panel plus a misleading empty table and makes slow API responses feel like a blank/black module. The absence of an error boundary also means any malformed record or render-time exception can blank the entire dashboard.

## UX recommendations to verify

Use explicit per-module loading, error, retry, and empty states; keep the last successful data visible during refresh; display API status and timestamps; prevent malformed records from crashing tables; make destructive actions safer; and improve mobile navigation and table access.

## Final status

The stability release deployed successfully. On reloading the authenticated live dashboard, the overview first showed only the dedicated `جاري تحميل بيانات هذه الوحدة...` panel, without a misleading empty table, then rendered the counts, recent leads, and activity successfully. This confirms the primary loading/empty-state race fix in production.

The deployed packages module now showed the dedicated loading panel first, then rendered all three plans correctly at SAR 350, SAR 950, and SAR 2,200. No misleading `لا توجد عناصر بعد` flash appeared during this regression check.

The deployed site-content module now showed only the dedicated loading panel during the request, then rendered all 14 Arabic/English records with edit/delete controls. The previous misleading empty-table flash was not reproduced.

Pending final module regression verification.
