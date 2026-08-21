# Live Admin CMS verification — 2026-08-21

Source URL: https://www.wajd-agency.com/admin/login

The connected browser session is authenticated as Wajd Admin and the overview renders live data. The overview shows 5 leads, 3 published packages, 5 technical add-ons, 8 published case studies, and 3 FAQs.

The technical-add-ons module loads successfully and renders five production records with Arabic/English names, category, billing cycle, SAR price, feature summary, and Edit/Delete actions. Verified records: Professional store launch (1,800 SAR one-time), Market POS (2,500 SAR one-time), LiftDesk AI automation (750 SAR monthly), Custom system (4,500 SAR one-time), and Performance dashboard (600 SAR one-time).

The public API smoke test also returned 3 packages, 5 add-ons, 8 projects, and the new `form_options`, `navigation`, and `product_demos` settings for both `ar` and `en`. The public Barner case-study endpoint returns the English name and metric `2.10x ROAS`.

The packages module also loads successfully and renders three marketing plans with Arabic/English names, category, billing cycle, SAR price, feature summary, and Edit/Delete actions: Starter (350 SAR monthly), Growth (950 SAR monthly), and Partner (2,200 SAR monthly). The module’s add action is labeled "إضافة باقة".

The case-studies module loads successfully with all 8 portfolio records, thumbnail images, and Edit/Delete actions. One UI label still displayed the generic "إضافة باقة" action on this live deployment; the source had already been corrected to "إضافة دراسة حالة", but the committed Vite bundle had been built before that final label edit. A fresh asset rebuild is required before the next deployment.

After the refreshed bundle deployment, the Admin settings module loads successfully and exposes six editable JSON settings: brand, contact, form_options, navigation, product_demos, and seo. Each row has Edit/Delete controls, and the new form options, navigation labels, and product-demo metrics are visible in production.

The site-content module loads successfully with bilingual homepage, services, about, footer, and why-Wajd blocks. Every listed block has Edit/Delete controls, and the refreshed bundle correctly shows the add action as "إضافة محتوى".

After the refreshed deployment, the case-studies list correctly shows "إضافة دراسة حالة". Opening an existing portfolio record exposes editable slug, bilingual names/categories/descriptions/challenge/strategy, primary and thumbnail URLs, alt text, metrics/outcomes, periods, results JSON, ordered gallery JSON, evidence notes, metadata, sort order, and publication state. No production data was changed during verification.

The live public homepage renders successfully after the CMS deployment. Verified visible dynamic/navigation content includes Arabic navigation, currency switcher, editable hero copy and metrics, ROI calculator, product demos for Market POS and LiftDesk, proof/case-study content, and the package-builder with published plans. No blank-screen failure appeared; the page’s large hero visual is loaded and the extracted page contains the full content sections.

Switching the live site to English works and the English navigation, hero, calculator labels, product-demo UI, and package-builder headings render correctly. A content-quality issue remains: several seeded case-study names and descriptions in the English page are still Arabic because those records’ English fields were not fully localized. The CMS now exposes those fields for direct editing, but this is a copy/content cleanup item rather than a rendering or control failure.
