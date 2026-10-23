# Remove Exhibition Stall from MAIN — 2026-10-23

Owner instruction: remove Exhibition Stall completely, including its moving circle, lower option and all related discovery/selection content.

- Removed shared occasion entry, detail-page content, rotating hero slide, search alias and unused category-19 photo. The existing loader now rejects the former detail slug as not found; no hidden duplicate detail page remains.
- Circle/grid/search/recommendations/optional planner/callback choices/server enquiry validation all derive from the shared lists: 19 normal occasions and 5 retained premium pages (24 searchable detail pages). Old Exhibition Stall form/query values no longer qualify as a supported occasion.
- Browse/back/header/Home labels and celebration-format statistic now use the actual shared count. Photo IDs are not renumbered: Annual Day Function stays photo 20. Grand Opening, Showroom Setup and unrelated photo/selfie booths remain; those are not exhibition-stall services.
- Six initial cards, progressive expansion 6→12→18→19, three-second bounded circle press, instant page opening, smart search, shared Bloon and backgrounds unchanged. Existing historical documents/standalone reference mockups are archival, not current MAIN options; pre-existing bilingual/Worker edits are not staged or altered. No AI/backend/provider deployment/configuration or real submissions.

TypeScript, targeted lint, native/phone builds and 265 tests / 18 files pass, including explicit cross-catalogue removal/unknown lookup/enquiry rejection/search exclusion, retained neighbouring routes and image numbering. Two previous parameterized cases disappear with the removed occasion and two removal regressions replace them. Browser/publication results are recorded in PHONE-VIEW.md.
