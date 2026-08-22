# Hero first-render verification — 2026-08-22

## Issue reported

The first visible frame of the homepage appeared almost black, with the hero headline and CTA barely readable while Framer Motion entrance animations were still at opacity 0.

## Root cause

The shared `Layout` wrapper started every route at `opacity: 0`, while `CinematicHero` independently started its badge, headline, slogan, CTA, description, and metrics at `opacity: 0` with staggered delays. A screenshot taken immediately after navigation therefore captured the intentional animation start state rather than the readable hero.

## Fix

- Shared route wrapper now uses `initial={false}` so it does not hide the complete page on first paint.
- Above-the-fold `CinematicHero` motion elements now use `initial={false}` while retaining their final visible animation targets.
- The production Vite bundle was regenerated and the change was committed as `e5387c2`.

## Live verification

- Arabic: `https://www.wajd-agency.com/?lang=ar&fresh=hero-fix`
- English: `https://www.wajd-agency.com/?lang=en&fresh=hero-fix-en`
- Both pages loaded with HTTP-rendered content and readable hero headlines, slogan, description, and CTA in the initial viewport.
- Arabic headline observed: `نحن نبني النمو — النتائج التي تُرى.`
- English headline observed: `We Engineer Growth. We Found Results.`
- Vercel deployment for commit `e5387c2dbe109eb704e7c271465895d7e3803b21` reached `READY`.

## Result

The first-render dark veil is removed. The hero remains dark and premium by design, but the primary message is now visible immediately rather than appearing only after the entrance delays complete.
