# Arabic default verification — 2026-08-22

## Live release

- Commit: `c1239cad31a2228dd81869cd1c8a9216d8432423`
- Vercel deployment: `READY`
- Fresh deployment origin: `https://wajd-agency-website-etimx8up5-ali-abdelazim-s-projects.vercel.app/`

## Checks

1. Opened the fresh deployment URL with no `lang` query and no prior site storage. The title, navbar, hero, CTA, ROI calculator, portfolio, and FAQ rendered in Arabic by default. The visible language toggle showed `EN`, confirming Arabic is active.
2. Clicked the language toggle. The site switched to English successfully, and the toggle changed to `عربي`, confirming intentional language changes still work.
3. The initializer now treats Arabic as the first-visit default. An English preference is only restored when `wajd.locale.selected=1`, which is written when the user intentionally changes language.

## Result

The site now opens in Arabic by default. Direct links containing `?lang=en` still open in English, and users can switch between languages normally.
