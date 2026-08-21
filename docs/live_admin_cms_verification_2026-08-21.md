# Live Admin CMS verification — 2026-08-21

Source URL: https://www.wajd-agency.com/admin/login

The connected browser session is authenticated as Wajd Admin and the overview renders live data. The overview shows 5 leads, 3 published packages, 5 technical add-ons, 8 published case studies, and 3 FAQs.

The technical-add-ons module loads successfully and renders five production records with Arabic/English names, category, billing cycle, SAR price, feature summary, and Edit/Delete actions. Verified records: Professional store launch (1,800 SAR one-time), Market POS (2,500 SAR one-time), LiftDesk AI automation (750 SAR monthly), Custom system (4,500 SAR one-time), and Performance dashboard (600 SAR one-time).

The public API smoke test also returned 3 packages, 5 add-ons, 8 projects, and the new `form_options`, `navigation`, and `product_demos` settings for both `ar` and `en`. The public Barner case-study endpoint returns the English name and metric `2.10x ROAS`.

The packages module also loads successfully and renders three marketing plans with Arabic/English names, category, billing cycle, SAR price, feature summary, and Edit/Delete actions: Starter (350 SAR monthly), Growth (950 SAR monthly), and Partner (2,200 SAR monthly). The module’s add action is labeled "إضافة باقة".

The case-studies module loads successfully with all 8 portfolio records, thumbnail images, and Edit/Delete actions. One UI label still displayed the generic "إضافة باقة" action on this live deployment; the source had already been corrected to "إضافة دراسة حالة", but the committed Vite bundle had been built before that final label edit. A fresh asset rebuild is required before the next deployment.
