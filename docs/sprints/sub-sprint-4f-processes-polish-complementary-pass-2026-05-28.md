# Sub-sprint 4f — Processes polish — Claude's complementary pass (2026-05-28)

Phase 2 of the 4f grilling session. Mirror of the 4a-4e complementary passes. Runs after Chris's Phase 1 page-by-page audit; cross-checks the wider-than-usual processes surface (6 page kinds) and surfaces anything the page-by-page walk wouldn't catch.

## Chris's Phase 1 audit (summary)

Processes came in lighter than expected because Chris already did the hard IA work in Sub Pages 4 (2026-05-11). His read:

- **IA earns its keep — do not shrink.** Processes is genuinely multi-access: "pure washed" and "double anaerobic thermal shock yeast inoculated washed" are different objects. The 3-tier nav + 5 sub-page kinds reflect the reality of the domain, not over-build. This closes the kickoff brief's central open question (Q2).
- **Index: good as-is.** Core Process Portals + Modifier Index + Signature Methods all read right. Signatures stay below (branded by nature; can't fold into the modifier index) — accepted, no change.
- **Base hubs (Natural): informational** (like cultivars/terroirs). Right structure. One ask: the coffees-tried list should not grow unbounded — show first ~10, expand the rest (**F1**).
- **Modifier-index (Yeast Inoculated): good.** No change.
- **Honey-subprocess (Black Honey) + modifier-combo (Anaerobic Washed): structure mismatch.** The cross-link blocks (flavor notes / cultivars / terroirs / roasters) render inline rather than inside the collapsed `ADDITIONAL INFORMATION` block the base/modifier/signature pages use. Page structure should be the same (**F2**).
- **Signature (Moonshadow): skeleton is fine.** Empty-state "overview pending authoring" reads correctly. Ask: do unauthored entries surface in the arbiter queue as an authoring reminder (**F4**)?

## Substrate cross-check

| Check | Result |
|---|---|
| Registry render paths (`BaseProcessEntry.summary`/`brewArchetype`, `ModifierEntry.overview`, `SignatureEntry.overview`/`observedCupProfile`) | **Clean.** Every field that exists has a render path with empty-state gating. No 4d-style populated-but-hidden column. |
| Routing determinism ([lib/process-routing.ts](lib/process-routing.ts)) | Slug helpers + reverse parsers consistent; `modifierComboSlug` alphabetizes so the same structural pattern → same slug. (Note: honey subprocess slug strips the "honey" suffix — `Black Honey` → `black`, URL `/processes/honey/black`.) |
| Aggregation ([lib/process-aggregation.ts](lib/process-aggregation.ts)) | Signature brews excluded from modifier-combo aggregations, included in modifier-index; `composeProcessDisplay` dedupe holds. No change. |
| Synthesis dispatch ([lib/synthesis/adapters/process.ts](lib/synthesis/adapters/process.ts)) | `getProcessAdapter(kind)` (5 kinds) + `process_aggregation_syntheses` cache intact. No change. |
| Confidence thresholds ([lib/process-confidence.ts](../../lib/process-confidence.ts)) | **Drift caught (F5/B3).** Code renders HIGH at `>= 5`, but the file comment + CLAUDE.md + the kickoff brief all said "3+ = HIGH per Rule 5." |

## New catch — confidence threshold drift (B3)

`confidenceFor` uses `>= 5` for HIGH and `>= 2` for MEDIUM. The header comment, CLAUDE.md (§ Processes + the process-confidence bullet), and this sprint's kickoff brief all documented "3+ HIGH." A 3-4 brew process therefore shows MEDIUM despite the documented intent. Natural read HIGH correctly only because it has 5+ brews. **Chris's call: align the docs to the code (5+ = HIGH).** 5 is the honest "HIGH" bar; the code has been `>= 5` since the helper landed. Comment + CLAUDE.md + brief updated; code untouched.

## F4 — turned into a scoping call, deferred

F4 is a real gap, two parts:

1. `list_skeleton_entries` covers only the **producer** + **roaster** registries (explicit `skeleton: true` flag). Process-registry overviews (signature `overview`, base `summary`) have no flag and feed **no arbiter queue** — they only render empty-state prose on the page. Nothing reminds Chris to author them.
2. Honey subprocesses have **no description field at all** — there is `BaseProcessEntry.summary` for Honey-the-base but no per-subprocess slot. "Black honey description" is a *missing field*, not an unauthored one; adding it = net-new registry shape + render path.

Both cross into MCP-surface / content-architecture territory (Actor 4), which the kickoff brief flagged as likely-out-of-scope ("process resolution stable"). **Chris's call: defer both** — 4f stays the light series-closer. Logged to [docs/grilling-queue.md](docs/grilling-queue.md) as a follow-up.

## Ratified 4f bundle

- **B1** — `ProcessCoffeesList` truncates to first 10 + a pure-CSS `<details>` "Show N more" expander. Shared component, so uniform across all 6 page kinds.
- **B2** — honey-subprocess + modifier-combo pages wrap their cross-link blocks in the collapsed `ADDITIONAL INFORMATION` `CollapsibleBlock` (bare props, `hasAdditional` gate), matching base/modifier/signature.
- **B3** — confidence-threshold doc alignment to 5+ = HIGH (comment + CLAUDE.md + kickoff brief). Code unchanged.

**Anoxic (Q4): Path 1 — leave it.** Anoxic stays a recorded `fermentation_qualifiers` annotation; aggregation correctly stays at the Anaerobic modifier. Only 1 brew carries it today (N=1, below the ≥3 aggregation floor the whole processes IA already runs on). Revisit promotion only if 3+ brews carry it. No code, no schema. Note added to the grilling queue.

## Deferred follow-ups

- **F4** (skeleton-author arbiter reminder for process overviews + honey-subprocess description field) — grilling queue.
- **Anoxic re-evaluation** — when 3+ brews carry the qualifier.
- **`ProcessAdditionalInfo` extraction** — the `ADDITIONAL INFORMATION` block is now inlined across 5 process pages (3 pre-existing + 2 from B2). Pre-existing per-page pattern; extraction would touch 3 untouched files. Flagged as a code-cleanup follow-up, not folded into the series-closer.

## Verification

- B1 confirmed on `/processes/washed` (43 coffees → 10 shown + "Show 33 more"; expands to reveal 33).
- B2 confirmed on `/processes/honey/black` + `/processes/honey/white` + `/processes/washed/modifiers/anaerobic` (cross-link blocks now inside collapsed `ADDITIONAL INFORMATION`).
- B3 confirmed: Washed shows HIGH at 43; Black Honey shows MEDIUM at 2 — consistent with the now-documented 5+ cutoff.
- `npx tsc --noEmit` clean (exit 0, via main-repo node_modules symlink); no console errors.

## Series state

**4f closes the Read-path surface polish series (4a-4f).** Redesign-brainstorm trigger condition #2 (PRODUCT.md § 5) now met — both surface polish series complete. Remaining trigger #3 (Claude-Design redesign brainstorm session) still pending before the redesign Active-sprint promotion.
