# Pruning case 003 — PRODUCT.md

> Structured handoff for a post-tripwire pruning exercise. Lead with the header so lessons aggregate toward the systematization decision (see [doc-pruning-mechanism-brainstorm-2026-06-03.md](docs/features/doc-pruning-mechanism-brainstorm-2026-06-03.md)).

## Header

- **Doc pruned:** `PRODUCT.md` — **127.3 KB → 20.9 KB**. Split into `docs/product/roadmap.md` (16.3 KB) + `docs/product/issues.md` (5.3 KB) + `docs/sprints/lessons-learned-archive.md` (12.5 KB); closed roadmap detail dropped (already in `docs/sprints/shipped.md`). Net working-surface reduction ~72 KB.
- **Trigger:** root-doc 120 KB tripwire ([doc-tripwires.md](docs/architecture/doc-tripwires.md) live queue #2). The Roadmap was the growth driver (330 of 758 lines).
- **Shape(s) used:** **`archive`** (primary — the shape this case existed to land) + **`split`** (roadmap + issues → own docs) + **`consolidate`** (data-model/registries/synthesis sections tightened to index-shape) + **`extract`** (Lessons Learned → archive doc). No `delete` (nothing removed that didn't survive elsewhere).
- **Judgment calls:** (1) **Operator-led restructure.** Chris did a section-by-section audio walkthrough + a full refactored-doc prototype (3 files) and handed it over design-prototype-style — "treat what you have as canonical, pull from mine as needed." Claude Code synthesized: adopted his structure (Purpose merge / Product Boundaries / Split-Archive Triggers / roadmap+issues split) but treated **live ground-truth as canonical** over the prototype where they conflicted. (2) Four forks went to Chris via AskUserQuestion → all recommended options: destinations `docs/product/`; issues as a markdown queue now (GitHub later); Lessons Learned archived + future-synthesis pointer (not deleted); execute in one PR. (3) The prototype inherited stale facts from the live doc; Claude Code fixed them (see Drift fixes).
- **Heuristic learned:** **`archive` ≠ `extract`/`delete`: it is "relocate stale-but-historical content to a surface where it's preserved as record but out of the working doc."** The cleanest archive needs no new destination — closed roadmap detail was *already* archived in shipped.md, so the archive op was "don't carry it forward into the split," not "move it." The split shrank the doc by 72 KB while only ~35 KB of new files were written, because ~37 KB of closed detail simply stopped being duplicated. **Archive's tell: the content already has a historical home; the prune is ceasing to re-state it in the live surface.**

## Shape-coverage note

This case **deliberately landed `archive`** — the one shape the protocol had no standalone worked example of (only the BREWING/ROASTING redirect-stub partial). Three archive operations: (a) closed roadmap detail → ceased duplication (shipped.md already holds it); (b) Source-Data-Locations + Taste-Profile prose → superseded-references summary + brewing-side substrate; (c) Lessons Learned → `lessons-learned-archive.md`. With this, **all five shapes (extract / split / consolidate / archive / delete) now have a worked example across three doc-shapes** (reference-doc 001 / glossary 002 / roadmap 003). The systematization deferral gate is **clear**.

## Delete flags (if any)

None. Everything pruned from the working surface survives in shipped.md, the split docs, the archive doc, or the per-sprint retros. One *process* item flagged for a future decision (not a delete): the "auto-handoff doc on every ship → append to shipped → remove from roadmap" loop Chris floated — noted in the roadmap doc as a Cluster B feedback-handoff-formalization brainstorm candidate, not codified as autonomy.

## Drift fixes (live doc was stale; prototype inherited it)

- `/add` + `/brews/[id]/edit` were **deleted** (Writing-path Sub-sprint 4, 2026-05-27), not "Built" / "retired" — pages table corrected to MCP-only.
- Per-entity **record counts removed** (were April-2026 baseline; live ~89 brews). Per Chris's "rely on the DB" steer, the data-model table now tracks meaning, not rotting counts.
- Roaster registry corrected toward current shape; AI-Synthesis section was outdated ("2-4 sentences," terroir+cultivar only) → now points at the 3-call pipeline doc.
- "9 registries" kept but footnoted as **13 validated axes** so it doesn't contradict the MCP describe surface.

## Result

- PRODUCT.md **20.9 KB**, well under the 120 KB cap. New: `docs/product/roadmap.md`, `docs/product/issues.md`, `docs/sprints/lessons-learned-archive.md`, this case doc, `docs/sprints/product-md-refactor-handoff-2026-06-03.md` (operator's handoff, filed).
- Cross-refs updated: CLAUDE.md doc-index + roadmap-currency rule + tripwire summary; `doc-tripwires.md` (PRODUCT.md → cleared); the pruning-mechanism brainstorm (archive ✅, gate cleared); memory pointers (`project_sprint_roadmap`, `feedback_sprint_closeout_roadmap_currency`, MEMORY.md).
- Six-actor: Actor 5 (Claude-Code docs) primary; Actors 2/3/4 N/A (PRODUCT.md + `docs/product/*` are not MCP Resources — verified `lib/mcp/docs.ts` has no PRODUCT entry). Move-never-delete verified (split docs written before PRODUCT.md trimmed).

## Transcript / detailed log

Operator walkthrough = the section-by-section audio in the kickoff thread + the `product_md_refactor_bundle` prototype (PRODUCT.refactored.md / PRODUCT_ROADMAP.refactored.md / PRODUCT_ISSUES.refactored.md / PRODUCT_REFACTOR_HANDOFF.md). Claude Code synthesis + four AskUserQuestion forks (all recommended options chosen) → one-PR execution. Per the kickoff ([product-md-prune-kickoff-2026-06-03.md](docs/sprints/product-md-prune-kickoff-2026-06-03.md)).
