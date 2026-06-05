# PRODUCT.md Refactor Handoff

*Operator-authored 2026-06-03; filed into the repo as the case-003 input artifact. The structured pruning-case record is [pruning-cases/003-product-md.md](docs/sprints/pruning-cases/003-product-md.md); this is Chris's original prototype handoff, preserved.*

---

## What changed

This pass refactored PRODUCT.md from a mixed product / roadmap / shipped-history / bug / lessons document into a cleaner product-system index.

- Merged "What This Is" and "Who It's For" into **Purpose**.
- Reframed the doc as a product-system guide, not a brewing/roasting instruction manual.
- Kept the two core workflows but removed detailed brewing/roasting theory; pointed to coordinator + CONTEXT docs.
- Collapsed equipment detail into a pointer table.
- Kept the data model, relationship map, FK rules, canonical-registry index, AI synthesis, current app state, architecture, and design-system pointers.
- Removed spreadsheet-era source-data counts from the active operating surface.
- Archived taste-profile prose (preference handling is now per-coffee + brewing-side).
- Split the roadmap into `docs/product/roadmap.md`.
- Split issues / incomplete substrate into `docs/product/issues.md`.
- Added roadmap-hygiene rules so shipped work leaves the live roadmap after it's logged.
- Kept Scaling Watch-Items in PRODUCT.md (product-architecture pressure points).
- Replaced the hand-maintained Lessons Learned section with a pointer to periodic synthesis from recent retrospectives (existing prose archived to `docs/sprints/lessons-learned-archive.md`).

## Repo moves (as executed)

| Generated artifact | Destination |
|---|---|
| `PRODUCT.refactored.md` | Synthesized into root `PRODUCT.md` (live ground-truth treated as canonical over the prototype where they conflicted). |
| `PRODUCT_ROADMAP.refactored.md` | `docs/product/roadmap.md` (Chris-confirmed destination). |
| `PRODUCT_ISSUES.refactored.md` | `docs/product/issues.md` (markdown queue; GitHub Issues deferred). |
| `PRODUCT_REFACTOR_HANDOFF.md` | this file (`docs/sprints/product-md-refactor-handoff-2026-06-03.md`). |

## Follow-up decisions (resolved this session)

1. ~~Roadmap under `docs/product/` vs `docs/roadmap/`~~ → **`docs/product/`**.
2. ~~Issues to GitHub vs markdown~~ → **markdown queue now**, GitHub later if volume grows.
3. Data model extraction into its own doc — not needed yet; the next natural split if PRODUCT.md regrows. (Per-column histories already live in `docs/architecture/data-model.md`.)
4. Repo-aware link pass — done as part of the refactor PR.

## Open process question (not codified)

The "every ship auto-produces a handoff doc → append to shipped.md → remove from the roadmap" loop Chris floated is a real candidate standing rule, but overlaps Cluster B's feedback-handoff formalization and was explicitly left as "let me think about it." Flagged in `docs/product/roadmap.md`; not codified as autonomous behavior.
