# Wajd Growth Command Center — Analytics & Engagement Tracking Upgrade

**Date:** August 21, 2026  
**Author:** Manus AI  
**Target Platform:** [wajd-agency.com](https://www.wajd-agency.com/) (Laravel 11, React 19, Supabase PostgreSQL, Vercel)

---

## Executive Summary

To transform the Wajd Admin Dashboard from a static CMS into a proactive **Growth Command Center**, we have designed, implemented, and deployed a robust visitor analytics and behavioral intelligence system. This upgrade provides granular visibility into visitor journeys, engagement duration, Growth Engine builder interactions, intent scoring, and conversion pipelines without compromising site performance or user privacy.

---

## Architecture & Data Model

### 1. Database Schema (`visitor_sessions` & `visitor_events`)
Two new PostgreSQL tables track anonymous visitor interactions securely:
- **`visitor_sessions`**: Records session lifecycle, token, visitor fingerprint (`visitor_id`), IP address, user agent, locale, session duration, page count, calculated **Intent Score** (`intent_score`), and campaign/landing page metadata.
- **`visitor_events`**: Captures individual events (`page_view`, `scroll_depth`, `builder_base_selected`, `builder_addon_toggled`, `builder_continue_clicked`, `contact_form_viewed`, `lead_submitted`, etc.) linked to each session with structured JSON properties.

### 2. Lightweight Frontend Tracker (`resources/js/v2/utils/analytics.js`)
- **Zero Heavy Dependencies**: Operates natively using standard browser APIs (`fetch`, `navigator.sendBeacon`, `localStorage`, `sessionStorage`).
- **Batched & Buffered**: Queues events in memory and flushes them every 4 seconds or when batch size reaches 8 events, ensuring zero UI jank or main-thread blocking.
- **Robust Visibility Handling**: Automatically fires `session_pause`, `session_resume`, and `session_end` events with reliable `sendBeacon` payload delivery on tab closure or navigation hide.

### 3. Intent Scoring Engine
The backend computes real-time **Intent Scores** (0–100) based on visitor actions:
- **Browsing**: Page view (+1), scroll depth (+2 per 25%).
- **Growth Engine Builder**: Starting builder (+3), selecting base plan (+5), toggling technical add-ons (+8), clicking continue to contact (+20).
- **Lead Pipeline**: Viewing contact form (+10), submitting lead (+100).

---

## Admin Dashboard Integration ("تحليلات الزوار")

The Admin panel (`Admin.jsx`) now features a dedicated **"تحليلات الزوار" (Visitor Analytics)** tab backed by `AnalyticsController::dashboard()`. Key visualizations include:
1. **Summary Cards**: Total sessions, unique visitors, average session duration, engagement rate, and high-intent sessions.
2. **Trend Chart**: Daily session volume trend graph over the selected period.
3. **Intent Profiling**: Breakdown of traffic by visitor intent tier (High, Medium, Low).
4. **Builder Interest**: Most selected base plans and technical add-ons.
5. **Device & Page Breakdown**: Traffic split across mobile, tablet, and desktop, alongside top visited pages.
6. **Live Activity Feed**: Real-time ticker of recent visitor events with session intent scores and timestamps.

---

## Verification & Deployment

- **Syntax & Compilation**: Verified via PHP lint and Vite production bundling (`npx vite build`).
- **Rate Limiting**: Configured dedicated rate-limiting (`analytics-collection` at 60 requests/minute) to prevent abuse of the ingestion endpoint.
- **Deployment**: Committed and pushed to GitHub for automated Vercel production deployment.

<div style="text-align: center;">
<img src="/home/ubuntu/wajd-repo/growth_results.png" alt="Growth Command Center Architecture" style="max-width: 100%; height: auto; object-fit: contain;" />
</div>

---

## References
- [1] Wajd Production Playbook & Architecture Standards (`wajd-production`)
- [2] KPI Dashboard Design & Metric Governance (`kpi-dashboard-design`)
- [3] Analytics Implementation & Tracking Plan Framework (`analytics`)
