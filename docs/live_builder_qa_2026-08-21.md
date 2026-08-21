# Live Builder QA — 2026-08-21

The production Wajd homepage at `https://www.wajd-agency.com/` loaded successfully in My Browser with HTTP 200 and no blank screen. Arabic is the default language. The live homepage includes the modular package section with the heading `ابدأ بالأساس.. وأضف ما يحتاجه مشروعك`, three monthly base plans at SAR 350, SAR 950, and SAR 2,200, technical add-ons for store launch, Market POS, LiftDesk AI automation, custom systems, and a performance dashboard, plus a cart summary and request CTA.

The deployed HTML references the new built assets `main-CjRUIX9k.js` and `app-DCEPoEuM.css`. The page copy is aligned with the new positioning: `نحن نبني النمو — النتائج التي تُرى.` and `لا نكتفي بإطلاق الحملات؛ نبني لك المتجر والنظام التقني...`.

Keyboard navigation reached the package builder successfully. The page displays the three-step flow: choose the core plan, add technical modules, and review the growth-engine cart. The default cart starts with the Growth Plan at SAR 950 monthly and shows no technical modules selected.

The live browser exposed the technical add-on buttons and positioned the builder controls correctly above the FAQ section. The visible controls included Professional Store Launch, Market POS, LiftDesk AI Automation, and Custom System; each control is a button with an add/selected state.

Selecting LiftDesk AI automation changed its button to a selected/check state and recalculated the cart from SAR 950 monthly to SAR 1,700 monthly, while preserving the selected add-on line item.

The request-build CTA is present in the extracted live page content immediately after the recalculated total. The browser viewport did not expose it as a numbered control because the sticky two-column layout kept the add-on grid in view; the underlying route handoff is covered by the compiled implementation and backend validation checks.

After redeploying the bilingual fix, switching the live site to English showed `Starter Plan`, `Growth Plan`, and `Partner Plan` with English subtitles and features. The English add-on catalog and the `Your growth-engine cart` summary also render fully in English, while SAR pricing remains consistent.
