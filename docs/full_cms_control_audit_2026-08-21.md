# Wajd Full CMS Control Audit

## Audit objective

The requested end state is a WordPress-like CMS for the Wajd Growth Platform: the owner should be able to add, remove, reorder, publish, unpublish, and edit every commercial offer, price, portfolio item, image, page section, and conversion-form option from the Admin Dashboard.

## What already works

The existing Admin Dashboard has authenticated CRUD for site settings, localized content blocks, packages, FAQs, portfolio projects, media assets, lead statuses, lead deletion, lead follow-up, analytics, and audit logs. The public Laravel content endpoint returns localized blocks, packages, FAQs, portfolio projects, and a limited allow-list of public settings. The dashboard UI already exposes add/edit/delete forms for the core catalog resources.

## Critical ownership gaps

| Area | Current source of truth | Impact |
|---|---|---|
| Portfolio listing | `portfolioEvidence.js` always starts with eight bundled evidence projects, then appends CMS projects | Deleting or unpublishing an existing evidence project in Admin does not remove it from the public site |
| Portfolio detail | `CaseStudy.jsx` prefers `getEvidenceProject()` over the CMS response | Editing an existing CMS record may not affect the visible case-study detail page |
| Evidence galleries | Bundled local assets selected by static slug-to-folder mapping | Images cannot be replaced, reordered, or removed from Admin |
| Marketing base packages | CMS-backed only for Arabic when package rows exist; English falls back to translations | English pricing/content can diverge from Admin |
| Technical add-ons/cart | Hard-coded in `t.packages.addons` and rendered by `Home.jsx` | Add-ons, prices, billing type, labels, and availability cannot be managed from Admin |
| Package taxonomy | `packages` has no category/type field | Marketing packages and technology packages cannot be filtered or managed as separate catalogs |
| Pricing | Single `price_sar` field | No editable one-time price, currency display policy, compare-at price, or regional pricing metadata |
| Home partner proof | Hard-coded partner array and remote image URLs in `Home.jsx` | Partner names and logos cannot be managed safely from Admin |
| Contact page | Bilingual copy, service options, industries, budgets, preferences, location, and social/contact details are hard-coded | Admin cannot update lead form taxonomy or business contact information |
| Homepage claims | Hero metrics and several visual/copy elements remain hard-coded | Admin cannot correct or update performance claims without a deployment |
| Services page | CMS blocks are supported but a large hard-coded fallback catalog and process remain | Content may not be fully controllable when blocks are missing or incomplete |
| Client Portal | Entire page is a static preview with local mock data | No lead-specific ROI snapshot, project data, files, reports, or admin-managed portal content |
| Public content payload | `/api/content` only returns four public setting keys | New CMS-controlled sections cannot be consumed until the allow-list and frontend contract are expanded |
| Admin editor quality | JSON fields are powerful but difficult for non-technical editing; no media picker, gallery editor, category selector, or drag ordering | Full control exists only for developers, not for normal dashboard use |

## Recommended architecture

1. Treat Laravel/Supabase as the single source of truth for public content. Static evidence should become seed data only, not a permanent frontend override.
2. Extend packages with `category` (`marketing` or `technology`), `price_one_time_sar`, optional `compare_at_price_sar`, and structured metadata for billing, CTA, visibility, and add-on compatibility.
3. Add a first-class `package_addons` table or a typed `catalog_items` table. The initial implementation should use a dedicated `package_addons` table so the existing package builder remains simple and safe.
4. Extend portfolio projects with a JSON gallery, proof/metric fields, evidence note, and optional case-study metadata. Admin should manage gallery entries through the media library and order them explicitly.
5. Add a structured `site_navigation`/`site_options` setting contract for brand, contact, social links, partner logos, form choices, budget bands, currencies, hero metrics, and footer content. Keep arbitrary JSON settings for extensibility, but provide typed Admin controls for high-value settings.
6. Change the public content endpoint to return package categories/add-ons and all approved public settings required by the frontend. Make both Arabic and English use the same CMS record with localized fields.
7. Refactor `mergePortfolioProjects` and `CaseStudy` so CMS rows control publication and override static seed data. Static evidence should be migrated into CMS rows and media assets; the frontend should no longer force those records into the site.
8. Build reusable Admin editors for category selects, publication status, drag/order fields, media selection, galleries, and bilingual structured options. Keep JSON editing only for advanced settings.
9. Add explicit audit events for reorder, publish/unpublish, media attach/detach, and settings changes.
10. Maintain production safety: validate every write server-side, require admin bearer auth, rate-limit public forms, retain RLS, and test public/admin routes before deployment.

## Implementation order

1. Add schema/model/API support for package categories, add-ons, portfolio galleries, and typed public options.
2. Update Admin UI with separate Marketing and Technology package views, add-on management, media picker/gallery management, and settings editors.
3. Expand the public content contract and refactor homepage, contact, portfolio, services, layout, and case-study pages to consume CMS data.
4. Remove frontend static overrides after data migration/seed verification.
5. Test add/edit/delete/unpublish/reorder flows from Admin and verify public reflection in Arabic and English.
6. Deploy, smoke-test, and monitor analytics/audit logs.

## Definition of done

The owner can use only the Admin Dashboard to change any visible business content or commercial value on the public site, publish or hide it, and see the result reflected publicly in both Arabic and English without a code deployment. The only remaining code-owned content should be structural UI behavior, not business copy, pricing, portfolio claims, contact data, or catalog options.

## Important data note

The current project contains previously supplied performance evidence and local image assets. These should be migrated as CMS seed records and media references rather than deleted. Existing slugs should remain stable to preserve public URLs and SEO.
