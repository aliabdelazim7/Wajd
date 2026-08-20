# Wajd-Improve

A unified master skill that consolidates 50 curated, high-quality skills from [skills.sh](https://www.skills.sh/) to improve the Wajd marketing agency website (Laravel backend + frontend + client dashboard) across five pillars: **SEO, GEO (AI-search visibility), audience & business growth, dashboard/dashboard analytics, and code quality & testing**.

All original skill contents are mirrored under `references/` so the agent can read them directly without fetching anything.

## When to use

Use this skill when working on the Wajd website, dashboard, or marketing growth. It is relevant for:

- SEO audits, keyword research, technical SEO fixes, schema markup, backlinks, and programmatic page generation
- GEO: making the site citable by ChatGPT, Perplexity, Gemini, and Google AI Overviews
- Understanding and targeting the agency's audience (personas, belief mapping, segmentation)
- Content strategy, copywriting, competitor analysis, conversion rate optimization, and A/B testing
- Improving the client dashboard design, KPI visualization, and dashboard UX
- Improving overall code quality, performance, Core Web Vitals, accessibility, and testing discipline

## How to work

1. Read the relevant sub-skill's `SKILL.md` from `references/<skill-name>/SKILL.md` for the exact methodology.
2. Follow that sub-skill's instructions fully (checklists, prompts, and reference files are inside the same folder).
3. Multiple sub-skills can be combined; e.g., run `seo-audit` first, then apply fixes guided by `core-web-vitals`, then verify with `verification-before-completion`.

## Sub-skill directory (all under `references/`)

| Pillar | Sub-skills |
|--------|-----------|
| SEO & GEO | seo-audit, ai-seo, programmatic-seo, seo-geo, optimize-for-ai, audit, brief, find-keywords, build-links, schema |
| Technical web quality (Google official) | seo, performance, core-web-vitals, web-quality-audit, accessibility, best-practices |
| Audience & growth | audience-targeting, user-personas, competitor-profiling, competitors, content-strategy, copywriting, marketing-psychology, pricing, launch, lead-magnets, cold-email, emails, social, ads, attribution, analytics, cro, popups, ab-testing |
| Dashboard & UI/UX | kpi-dashboard-design, design, design-system, brand, ui-styling, frontend-design, uxui-evaluator, ui-ux-reviewer |
| Testing & engineering | webapp-testing, test-driven-development, verification-before-completion, playwright-best-practices, diagnosing-bugs* |

*`diagnosing-bugs` and `tdd` are included as reference docs (Matt Pocock's engineering guide) rather than full SKILL.md folders.

## Recommended workflows

**Baseline audit (first run):**
1. Read `references/seo-audit/SKILL.md` and audit the live Wajd site.
2. Read `references/web-quality-audit/SKILL.md` + `references/core-web-vitals/SKILL.md` and fix performance issues.
3. Read `references/webapp-testing/SKILL.md` and set up the test suite.

**GEO / AI-search visibility:**
1. Read `references/ai-seo/SKILL.md` and `references/optimize-for-ai/SKILL.md`.
2. Apply `references/schema/SKILL.md` for structured data on service pages.
3. Use `references/programmatic-seo/SKILL.md` to generate location/service landing pages.

**Audience & conversion:**
1. Read `references/audience-targeting/SKILL.md` + `references/user-personas/SKILL.md`.
2. Read `references/competitor-profiling/SKILL.md` and `references/cro/SKILL.md`.
3. Validate changes with `references/ab-testing/SKILL.md`.

**Dashboard improvement:**
1. Read `references/kpi-dashboard-design/SKILL.md`.
2. Apply `references/ui-styling/SKILL.md` and `references/design-system/SKILL.md`.
3. Evaluate with `references/uxui-evaluator/SKILL.md` before shipping.

## Source attribution

These skills are open source; each `references/<skill>/` folder preserves the original skill file structure from its upstream repository (see LICENSE files inside where present). Major upstream sources: coreyhaines31/marketingskills, calm-north/seojuice-skills, aaron-he-zhu/seo-geo-claude-skills, addyosmani/web-quality-skills (Google Chrome team), anthropics/skills, obra/superpowers, mattpocock/skills, nextlevelbuilder/ui-ux-pro-max-skill, wshobson/agents, currents-dev/playwright-best-practices-skill, hubspot/agent-cli-skills, phuryn/pm-skills, uxuiprinciples/agent-skills, arjenschwarz/agentic-coding.
