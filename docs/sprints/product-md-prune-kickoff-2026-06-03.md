# KICKOFF — PRODUCT.md pruning exercise (pruning case 003)

**THIS IS AN INTERPRETIVE PRUNING SESSION.** Chris's steer is load-bearing on every shape call. Default to "ask, don't ship" on what-to-prune; once a call is steered, execute the mechanical part (same division of labor that worked on cases 001 + 002 — **operator owns the interpretive restructure + shape steer; Claude Code owns the mechanical prune + fidelity verification**). Do NOT remove roadmap content without Chris approving the specific section.

Third dogfood of the doc-pruning protocol ([scope doc](../features/doc-pruning-mechanism-brainstorm-2026-06-03.md)). Its job: prune the live-fire root doc AND deliberately land the one shape still without a standalone worked example — **`archive`**.

## Why this doc, why now

`PRODUCT.md` is **~127 KB / 120 KB** — over the root-doc tripwire ([doc-tripwires.md](../architecture/doc-tripwires.md), live queue #2). It is the largest root living doc and grows monotonically as the Roadmap accumulates shipped/closed/parked entries. It was 114 KB at the 2026-06-02 compaction and has already drifted +13 KB — the Roadmap is the growth driver.

## The deliberate-hunt mandate: land `archive`

Coverage after case 002: `extract` / `split` / `consolidate` / `delete` all have worked examples. **`archive` is the only shape still without a standalone one** (we have the BREWING/ROASTING redirect-stub precedent, but never a deliberate archive dogfood). PRODUCT.md is the natural place to land it:

- **archive** — move **stale-but-historical** roadmap content (CLOSED sprints, resolved closeouts, superseded plans, the "Recently shipped"-style log) to an **archival surface** where it's preserved as record but out of the working roadmap. Distinct from `delete` (the content survives, just relocated) and from `extract` (the destination is an *archive*, not an on-demand reference the working doc still pulls from). Candidate destinations: `docs/sprints/shipped.md` (already the shipped-log archive — the original worked example used it), or a new `docs/features/roadmap-archive.md` for closed/superseded roadmap sections.

PRODUCT.md will also naturally exercise the other shapes — **consolidate** the living roadmap (Longer Term Items / Future Directions / Lessons Learned that have grown verbose), **extract** any chronological-append log content (the shipped-log shape). That's fine; the *primary* target to be deliberate about is `archive`, so the case completes coverage.

## What NOT to prune (load-bearing working roadmap)

The § Active Sprints ordered working queue, the capstone reprioritization, the Cluster A/B framing, Scaling Watch-Items, and any item still NEXT/NOW are the live working surface — `consolidate` for concision is fine, but they stay in PRODUCT.md. The archive target is **closed/resolved/superseded** content, not active direction.

## Procedure (mirrors case 002, which worked)

1. **Operator-led pass first (recommended):** Chris reads PRODUCT.md from first principles and flags what's closed/stale/archivable vs. living. Case 002's biggest lesson was that the operator owning the interpretive restructure (not just fork decisions) is what made the prune clean.
2. Claude Code size-maps the doc section-by-section so the weight is visible.
3. Per heavy/closed section, propose a shape: archive / consolidate / extract / delete-flag / keep. Present forks in long-form prose; wait for audio steer.
4. Apply only steered calls. **Run a concept-set / section diff after any structural reorg** (case 002's load-bearing safety step — a reorg silently dropped a concept that a prompt cross-referenced).
5. Re-measure; confirm under 120 KB.

## Output

- PRODUCT.md under the 120 KB tripwire.
- **Case-003 handoff doc** at `docs/sprints/pruning-cases/003-product-md.md` using `_template.md` — header filled, with the shape-coverage note answering "did we land `archive`?"
- Update [doc-tripwires.md](../architecture/doc-tripwires.md) Current-size column + Live queue.
- If the archive destination is a new doc, register it where appropriate (note: PRODUCT.md and most `docs/features` / `docs/sprints` are NOT MCP-registered — Actor 4 likely N/A; verify).
- Return the handoff to the Cluster B doc-pruning thread → triggers the **systematization decision** (all 5 shapes now covered across 3 doc-shapes: reference-doc 001 / glossary 002 / roadmap 003).

## Standing rules / six-actor

- Roadmap-currency rule: any shipped/closed entry archived must keep its audit trail (shipped.md row or archive-doc entry) — that's the existing § roadmap-currency discipline, and it *is* the archive operation here.
- PRODUCT.md is Claude-Code-facing (not an MCP Resource), so Actor 4/3 hops are likely N/A; Actor 5 (CLAUDE.md § Standing tripwires numbers) updates if sizes change. Confirm before assuming.
- Grilling posture: no content-removal ship without Chris's sign-off on the pruned result.

BRANCH: own branch off latest main.
