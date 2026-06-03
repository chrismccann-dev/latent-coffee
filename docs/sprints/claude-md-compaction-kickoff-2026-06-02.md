# Kickoff - CLAUDE.md root-doc compaction (+ PRODUCT.md trim)

THIS IS AN EXECUTION SPRINT WITH INTERPRETIVE CALLS UP FRONT - START IN PLAN MODE.
The WHAT-moves and WHERE-it-goes are interpretive (settle the structure before
cutting). The mechanical extraction follows the autonomy rule once the structure
is approved. This is NOT a grilling session.

## Context
CLAUDE.md crossed the 120KB standing tripwire. Measured 2026-06-02: **CLAUDE.md
152.4 KB** (32 KB over), **PRODUCT.md 128.9 KB** (~9 KB over). Over-tripwire root
docs cost every session (CLAUDE.md is auto-loaded as project instructions on every
turn) and signal it's time to split. Queued at the 2026-05-31 resync grill as
Cluster B / system-maintenance; it's queue item #1 now that the migration-drift gate
(#350) shipped.

## Goal
Get CLAUDE.md back under 120KB with headroom (target ~105-115 KB) by EXTRACTING
on-demand reference content to a dedicated doc + leaving pointer stubs. **Move,
never delete - no information loss.** PRODUCT.md trim is secondary (nice-to-have;
do it if cheap, else defer).

## Primary extraction candidates (resync-grill-named)
The giant per-page IA blocks are the biggest, least-every-session-needed chunks - you
only need them when actively touching that surface:
- The **`/brews/[id]` detail-page IA block** under § Page structure > Brews (the
  multi-paragraph section-by-section description + the Redesign Sprint 1 `Ssp*` chrome
  details + the pour-structure `data-model` history).
- The **`/green/[id]` detail IA blocks** under § Green - all 5 lifecycle view shapes
  (waiting-roast / waiting-cupping / resolved / unresolved / inventory) + the Redesign
  Sprint 2-5 re-skin paragraphs + the Sub Pages 6.x + 4a-4d history.
- These relocate cleanly to `docs/architecture/page-ia.md` (one file, clear `##`
  anchors), pulled on demand via the Read tool.

## Approach (settle in plan mode, then execute)
1. `wc -c CLAUDE.md`; identify the largest extractable blocks (the per-page IA prose).
2. Decide structure: one `docs/architecture/page-ia.md` vs per-surface files.
   Recommend ONE file with `## /brews/[id]` + `## /green/[id]` anchors.
3. Extract verbatim to the new doc; replace each block in CLAUDE.md with a 1-2 line
   pointer stub (e.g. "Per-page IA for /brews/[id] lives in
   docs/architecture/page-ia.md § /brews/[id] - read when touching that surface").
4. "What else can move out" review pass: scan for OTHER on-demand-only blocks (long
   registry enumerations, per-PR Redesign Sprint logs, the data-model § histories).
   Propose, don't over-cut. KEEP every-session content: Architecture, Data Model,
   canonical-registry rules, Git Discipline, Sprint cadence / six-actor, Design
   conventions, Standing tripwires.
5. Re-measure; confirm < 120000 bytes with headroom.

## Constraints / watch-items
- CLAUDE.md is auto-loaded EVERY session - extract ONLY content not needed every
  turn. When in doubt, keep it.
- Leave navigable pointer stubs so extracted content stays discoverable (don't orphan).
- The new doc is **Claude-Code-facing** (read via Read tool on demand). It does NOT
  need MCP registration - claude.ai doesn't consume page IA. If you nonetheless add a
  new `docs://` resource, run `npm run check:mcp-bundle`.
- Six-actor: **Actor 5 (Claude Code docs) only.** No schema / MCP / prompt / app /
  migration / build impact. Docs-only.

## Verification
- `wc -c CLAUDE.md` before + after; confirm < 120000 bytes (ideally ~105-115 KB).
- Grep that every extracted block left a pointer stub behind (nothing silently dropped).
- Spot-read `docs/architecture/page-ia.md` for coherence.

## Roadmap currency
- Update the § Standing tripwires KB measurements in CLAUDE.md post-extraction.
- shipped.md row.
- After this: queue is "Optional grill" (only if new concepts surfaced) then
  "PRODUCT.md roadmap review."

## Branch
Off latest main. Docs-only; one PR (CLAUDE.md trim + new page-ia.md + pointer stubs +
shipped.md row + tripwire-note update).

## Async tail still open from the prior session (not blocking this sprint)
- One-shot Optimized Brew Packet **back-half dogfood** (UGA-MH-ELGON-LADIES-FW-2026):
  Chris brews the Mt Elgon recipe -> `bundled-brewing-completion.md` -> brings the
  `brew_id` to `one-shot-closeout.md`. Verifies push-not-stop at the self-roasted gate,
  STAGE 3 LINK, Outcome-B close. Lands whenever Chris finishes brewing.
