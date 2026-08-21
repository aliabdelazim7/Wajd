# Wajd Agency: Baseline SEO, GEO & Web Quality Audit
Date: August 21, 2026

## 1. Executive Summary
The Wajd Agency website is technically functional but lacks critical SEO and GEO (AI-search) optimizations required for market leadership in the GCC. The current production shell serves static, non-localized metadata, and the machine-readable files are outdated following the "Growth Engine" modular launch.

## 2. Technical SEO & Indexation
*   **Issue:** Static metadata in production shell (`public/index.php`).
    *   **Impact:** High. Search engines see the same title and description for all pages, leading to poor CTR and keyword targeting.
    *   **Fix:** Implement dynamic metadata injection in `index.php` or a React-based head manager (e.g., React Helmet) with SSR support.
*   **Issue:** Missing International SEO signals.
    *   **Impact:** Medium. No `hreflang` tags or localized canonicals are present, despite being a bilingual (AR/EN) site.
    *   **Fix:** Add `hreflang` tags to the `<head>` and implement self-referencing canonicals for both `/` and `/en` variants.
*   **Issue:** Missing Social Graph tags.
    *   **Impact:** Medium. No Open Graph (OG) or Twitter cards are present.
    *   **Fix:** Add `og:title`, `og:description`, `og:image`, and `twitter:card` tags.

## 3. GEO (AI-Search Visibility)
*   **Issue:** Outdated `pricing.md`.
    *   **Impact:** High. AI agents (ChatGPT, Perplexity) will retrieve the old fixed-package model instead of the new modular "Growth Engine" offer.
    *   **Fix:** Rewrite `pricing.md` to reflect the modular builder (Base Plans + Technical Add-ons).
*   **Issue:** Thin Schema Markup.
    *   **Impact:** Medium. The current `Organization` schema is basic.
    *   **Fix:** Expand schema to include `Service` details for each modular add-on, `LocalBusiness` for Riyadh office, and `FAQPage` schema for the FAQ section.
*   **Issue:** `llms.txt` needs a messaging refresh.
    *   **Impact:** Low. The content is good but doesn't mention "Growth Engineering" or the "LiftDesk" automation brand.
    *   **Fix:** Update `llms.txt` with the latest messaging framework terminology.

## 4. Web Quality (Lighthouse Standards)
*   **Issue:** Font preloading is good, but asset names are hardcoded in `index.php`.
    *   **Impact:** Medium. Hardcoded filenames (`main-BRmYZbHa.js`) in the PHP shell will break whenever Vite regenerates hashes during a build.
    *   **Fix:** Use the `manifest.json` from the build folder to inject asset paths dynamically.
*   **Issue:** Language attribute is hardcoded to `ar`.
    *   **Impact:** Medium. English users/bots see `lang="ar"`, which can confuse translation tools and accessibility screen readers.
    *   **Fix:** Detect locale in `index.php` and set `lang` and `dir` attributes dynamically.

## 5. CRO (Conversion Optimization)
*   **Issue:** The modular builder is powerful but needs "Decision Support".
    *   **Impact:** Medium. Users may be overwhelmed by choices.
    *   **Fix:** Add "Recommended" badges to specific add-on combinations (e.g., "The Scaler's Choice").
*   **Issue:** Contact form lacks "Success Context".
    *   **Impact:** Low.
    *   **Fix:** Ensure the success message reinforces the "Tech-Enabled Growth" promise.

## Recommended Priority
1.  **Immediate:** Update `pricing.md` and `llms.txt` to match the new offer (Phase 2).
2.  **High:** Fix the hardcoded asset and language attributes in `index.php` (Phase 2).
3.  **High:** Implement dynamic metadata and `hreflang` tags (Phase 2).
4.  **Medium:** Expand Schema Markup and add OG tags (Phase 2).
5.  **Medium:** Add CRO "Decision Support" to the builder (Phase 3).
