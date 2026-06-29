# Doc-pruning mechanism — brainstorm + protocol (Cluster B member #1)

**Session:** 2026-06-03 grilling/brainstorm (Chris audio-driven; no autonomous calls). Cluster B member #1 of the system-maintenance / anti-bloat layer.
**Status:** protocol defined + tripwires placed. Systematization **deliberately deferred** until all 5 pruning shapes have a lived worked example.

## The problem (Chris's framing, Group D Round 2 audio)

> "We are adding cumulatively to all of these docs but there is no mechanism to consolidate, split, delete... real pruning exercises on specific docs and then figure out the mechanism to apply this to all doc surfaces and then have this be part of the ongoing autonomy process."

The ADD-shaped self-improvement patterns (A-E in [ADR-0013](docs/adr/0013-self-improvement-primitives.md)) compound substrate monotonically. Pattern J (substrate pruning) is the named counterbalance but shipped 2026-05-24 as a **placeholder** — the mechanism was deliberately deferred pending lived case studies. This session resolves *how we accumulate those case studies and what we put in place now*, not the final mechanism.

## Core decision: don't systematize yet

The deferral gate (ADR-0013: "lock the mechanism once 2-3-4 lived candidates are worked through") looks cleared on a count basis — we have ~4 de-facto prunes. **But every one of them is the same shape: `extract`.**

| Prune | Shape |
|---|---|
| PRODUCT.md § Recently shipped → shipped.md | extract |
| CLAUDE.md 152→38 KB compaction (#352) | extract (+ split into 4 docs) |
| CONTEXT.md 483 KB → 3 zone docs (#244) | extract / split |
| BREWING.md / ROASTING.md → redirect stubs (Waves 2-4) | extract + archive (stub) |

A mechanism generalized from these would over-fit to extraction and leave the **risky shapes — `delete`, `consolidate`, `archive`-as-standalone — guessed at.** `delete` is the dangerous one (irreversible; the "looks quiet but is load-bearing" trap) and we have **zero** worked example of it.

**Decision (Chris, 2026-06-03):** keep accumulating manual case studies until we've seen all five shapes — **extract / split / consolidate / archive / delete** — *then* decide whether to systematize. Right now systematizing "feels a little immature."

## The five pruning shapes (sub-mechanism vocabulary)

Carried from ADR-0013 / grilling-queue, now treated as the coverage checklist:

| Shape | What it does | Worked example? |
|---|---|---|
| **extract** | move a block verbatim to a sub-doc + leave a pointer | ✅ ×4 (+ FC operational detail → fc-marking.md, [case 002](docs/sprints/pruning-cases/002-context-roasting.md)) |
| **split** | divide one doc into multiple zone/topic docs | ✅ (CONTEXT zone split); [case 004](docs/sprints/pruning-cases/004-filters-md.md) — first split on an **ownership axis** (filters.md owned vs not-owned), shaped by a validation-mirror constraint (docs split, `lib/filter-registry.ts` kept whole) — often co-occurs with extract |
| **consolidate** | merge multiple sections into something more concise (synthesis, not move) | ✅ first example: [case 002](docs/sprints/pruning-cases/002-context-roasting.md) (operator cluster-regroup + definition-tightening + concept relocation) |
| **archive** | move stale-but-historical content to an archival surface (or redirect stub) | ✅ first standalone example: [case 003](docs/sprints/pruning-cases/003-product-md.md) — PRODUCT.md closed-roadmap detail (ceased-duplication, already in shipped.md) + Source-Data/Taste-Profile + Lessons Learned → archive doc |
| **delete** | true removal of content that exists nowhere else | ✅ first example: [case 002](docs/sprints/pruning-cases/002-context-roasting.md) — two operator-authorized sub-categories (provenance shrapnel + deferred-future TODOs). Concept-bearing delete **stays flag-only** |

**Status update (2026-06-03, after case 003):** **all five shapes now have a worked example** across three doc-shapes (reference-doc [001](docs/sprints/pruning-cases/001-claude-md-compaction.md) / glossary [002](docs/sprints/pruning-cases/002-context-roasting.md) / roadmap [003](docs/sprints/pruning-cases/003-product-md.md)). The deferral gate ("lock the mechanism once all five shapes are worked through") is **clear** — the systematization decision is now a live Cluster B item (see [roadmap](docs/product/roadmap.md) § Active queue). Systematization inputs surfaced so far: (1) `delete` splits into a low-risk class (provenance + deferred-future TODOs — git-recoverable, zero downstream consumers, candidate for the *first autonomous-delete rule*) vs. a concept-bearing class (must stay flag-only) [case 002]; (2) **always run a concept-set diff after a structural reorg** — case 002's reorg silently dropped a concept a prompt cross-referenced; (3) **`archive`'s tell is "the content already has a historical home; the prune is ceasing to re-state it in the live surface"** — case 003 shrank PRODUCT.md 72 KB while writing only ~35 KB of new files, because ~37 KB of closed detail simply stopped being duplicated from shipped.md.

**Status update (2026-06-03, after case 004 — filters.md):** **for a registry-catalog doc with an owned/not-owned distinction, the highest-leverage prune is `split` on the ownership axis, not consolidate** — a live equipment doc only needs what the operator owns; the catalog long-tail is a promotion-pool reference that belongs outside the loaded surface. Two new systematization inputs: (4) **when a doc mirrors a `lib/*-registry.ts` validator, split the docs but keep the validator whole** — two doc files + one intact validator preserves canonical consistency with zero brew-orphan risk, and defers identity-merges (pack-size / cup-size / duplicate-SKU dedup) to a dedicated DB-cross-checked reconciliation pass; (5) **one prune can clear a parent cap as a side effect** — case 004 cleared the brewing-equipment-expert *cluster* cap (157.8 → 109.9) by pruning its single biggest doc, making the companion case 005 (Pattern F decomposition) moot before it ran. Lesson: prune the lever doc first, re-measure, *then* decide whether the structural/decomposition case is still real.

**Status update (2026-06-04, after cases 006 + 007 — over-cap backlog drained):** the last two over-cap surfaces cleared, and **case 007 surfaced a sixth shape.**
- **Case 006 (log-cupping.md, 49.3 → 24.0 KB)** — first **prompt-shape** (live-procedure) case. Shape = `consolidate`-to-pointer + `archive` (dead STAGE 0 → break-glass sibling, DB-confirmed zero live pre-rewrite lots). Inputs: (6) **for a procedure prompt, consolidate-to-pointer needs no behavior change** — re-stated glossary definitions / worked examples / backstory are pointer-able; the STAGE skeleton + write-contracts + halt gates + MCP call sequences + uncross-queryable field semantics must stay inline. Validate every pointer against live glossary headings first. (7) **the 40 KB prompt cap holds** (landed at 24 KB with behavior byte-for-byte intact) — answers open-question #4; don't loosen it. (8) **a KB target that clears via consolidation lets you decline an architectural refactor on its merits** — case 006's STAGE 5/6 design-ownership move was deferred to the roasting-coordinator workflow rather than forced by the cap.
- **Case 007 (cross-coffee-insights.md, 80.0 → 44 KB; staged 007a/007b)** — **the sixth shape: `re-home` / `re-scope`.** Reduce a doc by tightening its *job definition* and pushing now-out-of-scope content to its canonical home, leaving routers — distinct from `split` (parallel siblings of the same content) and `extract` (move a self-contained block). The prune surfaced that the CCIL had drifted into a catch-all rollup; the fix re-scoped it to cross-anchor-only. New inputs: (9) **safety ordering is destinations-first, index-last** — the by-cultivar capsules *pointed into* the CCIL rollup, so thinning the index before filling them would orphan detail; fill the capsule at full fidelity → leave a router → the index shrinks as a consequence. (10) **preserve the append target** — rewrite the routing/workflow list to name the new homes or the next Historian refresh re-bloats the index. (11) **cross-cluster re-home is dedupe-and-rewire, not move** (007b) — the destination often already holds ~90% of the displaced content; the work is reconciliation + **back-pointer rewiring** (capsules that point at the deleted index section must be redirected same-pass or they dangle). (12) **a repo-wide anchor grep** (`grep -rn '<doc>.md#<anchor>'`) is now a standard CCIL-restructure step — 007a's intra-cluster link check missed an *inbound* link from a different cluster.

The five-shape framing is now **six**: extract / split / consolidate / archive / delete / **re-home (re-scope)**. `re-home` is a candidate headword for the CONTEXT-shared grill (see grilling-queue). The over-cap live-fire backlog is drained ([doc-tripwires.md](docs/architecture/doc-tripwires.md) Live queue — all Tier-1 within cap as of 2026-06-04).

**Status update (2026-06-29, after case 009 — wbc-recipes.md):** [case 009](docs/sprints/pruning-cases/009-wbc-recipes.md) is the first over-cap fire on an **inherently-growing reference corpus** (the WBC archive gains ~50 routines per competition year; the 2026 drop pushed it 73.8 → over the 60 KB cap). Shape = `split` along the doc's own taxonomy↔per-recipe seam (parent keeps distribution + findings + 65 subtype definitions; new `wbc-recipes-by-family.md` sibling holds the 154 competitor rows). One new systematization input: (16) **for a monotonically-growing corpus, choose the split axis to isolate the *growth vector*, and keep the slow-growing taxonomy/index as the canonically-named parent that routes to the fast-growing sibling** — this puts the next cap-trip on the half that actually accumulates and the stable taxonomy half never re-trips. The year-split alternative was explicitly rejected (it scatters each strategy family across files, fighting the dominant by-family lookup); raise-the-cap was rejected as a pure deferral (~2 drops of runway). First split of an Archivist-cluster reference corpus; first split-axis chosen for growth-isolation rather than ownership/zone.

**Status update (2026-06-12, after case 008 — first preemptive + first second-pass case):** [case 008](docs/sprints/pruning-cases/008-context-roasting-second-pass.md) re-pruned CONTEXT-roasting (109.2 → 104.0 KB) at ~91% of cap, operator-initiated rather than tripwire-fired. Three new systematization inputs: (13) **on a second pass over an already-pruned glossary, the dominant bloat class shifts from deliberation narrative to cluster duplication** — detection is mechanical (diff each operational-flavored section against the cluster doc the redirect-stub map says owns it); (14) **a prune doubles as a practice-contradiction detector** — side-by-side comparison with the operational twin surfaced two real contradictions (BBP duration, session-position slot placement) that neither doc's own maintenance caught; (15) **glossary-prune savings estimates run ~2× actual** when definitions + distinctions + avoid-lists are correctly kept intact — plan KB targets accordingly.

## The protocol (what we do now and going forward)

### 1. Tripwires on all constantly-loaded core docs — PLACED this session

Tripwires now cover the docs most constantly loaded across all three surfaces, not just CLAUDE.md / PRODUCT.md. Canonical registry: [docs/architecture/doc-tripwires.md](docs/architecture/doc-tripwires.md). New coverage filled the two holes Claude Code can't see from its own session:

- **CONTEXT-\* family** (claude.ai-facing, section-read) — 120 KB cap with explicit per-file watch-lines. CONTEXT-roasting is the live fire at 115.8 KB.
- **claude.ai entry prompts** (full-read every session) — **40 KB cap**, tighter than the CONTEXT files because full-read costs more per session than a section-read glossary. log-cupping (49.2 KB) is already over.

### 2. Tripwire fires → manual post-tripwire pruning exercise

When a doc trips, run a manual session (operator + Claude Code back-and-forth, the shape of the CLAUDE.md compaction in [docs/sprints/pruning-cases/001-claude-md-compaction.md](docs/sprints/pruning-cases/001-claude-md-compaction.md)). Three standing rules on every exercise:

- **Run the cut-test on each candidate section.** The size tripwire says *when* to prune; the `no-op / sediment / sprawl / duplication / relevance` lens says *what to cut and why* (full vocabulary, doc-agnostic and lifted from skill-craft, in the [writing-great-skills](.claude/skills/writing-great-skills/SKILL.md) reference skill; type `/writing-great-skills`). **no-op** (the reader already knows it by default) and **relevance** (does it still bear on the doc's job?) are *per-sentence* tests; run them sentence-by-sentence, and when a sentence fails, delete the whole sentence rather than trim words. **sediment** (stale layers), **duplication** (the same meaning the cluster doc the redirect map says owns it already holds; case 008's dominant second-pass class), and **sprawl** (live + unique but simply too long → disclose/split) classify *why* a section goes. The cut-test names the cut; shape-coverage (next rule) names the move.
- **Bias toward shape-coverage, don't just reach for extract.** Extraction is the safe default; if we always reach for it we'll rack up five more `extract` cases and still have no `delete`/`consolidate` precedent. Each exercise explicitly asks: *is the honest move here actually a consolidate or a delete, even though extract is easier?* — deliberately hunt the missing shapes.
- **Capture a structured handoff doc, not just a transcript.** Each case lands in [docs/sprints/pruning-cases/](docs/sprints/pruning-cases/) using the [_template.md](docs/sprints/pruning-cases/_template.md) 5-line structured header (doc / trigger / shape(s) used / judgment calls / heuristic learned) + transcript appended. The header is what lets the eventual systematization session read structured inputs across all cases instead of five raw logs.

### 3. delete stays flag-only

Claude Code **flags** delete candidates for operator review; it never deletes content that exists nowhere else autonomously. Revisit autonomy on delete only after several delete cases where Chris agreed each time. (Same posture as the autonomy ladder for irreversible writes in ADR-0013.)

### 4. After all 5 shapes have a worked example → decide on systematization — DONE (light formalization, 2026-06-03)

All five shapes covered (cases 001/002/003). Decision: **light formalization, not a full mechanism build** — the interpretive prune resists automation (operator-led restructure was load-bearing in all three cases), so only the trigger + scaffolding were automated; the judgment stays manual. Shipped:
- **Trigger:** `npm run check:doc-sizes` ([scripts/check-doc-sizes.ts](scripts/check-doc-sizes.ts)) + a daily CI cron — computes live sizes vs. the [doc-tripwires.md](docs/architecture/doc-tripwires.md) caps across both load surfaces, exits non-zero on any Tier-1 over-cap, and regenerates the registry's live-size block (killing the hand-maintained-column drift). First run caught `brewing-equipment-expert` over its ADR-0014 cluster cap.
- **Pattern J promoted placeholder → defined** in [ADR-0013 Amendment 2026-06-03](docs/adr/0013-self-improvement-primitives.md): doc-shape→prune-shape routing, the four safety steps, cap-working-surfaces-never-archives, the provenance-class autonomous-delete carve-out.
- **Deferred:** a heavier `prune-doc` skill (mirror of grill-with-docs) — until the manual kickoff-writing shows friction. The accumulating `pruning-cases/` corpus is its eventual input.

## Heuristics learned so far

- **extract works cleanly when content has chronological-append or on-demand-reference shape** (a sprint log, per-page IA history, per-column migration notes) — content you only need when actively touching that surface. It does **not** fit living-glossary shape, where the value is in the cross-references staying co-located. (From the CLAUDE.md + PRODUCT.md-shipped cases.)
- **Living-glossary docs (CONTEXT-\*) will likely force `consolidate` or `delete`, not `extract`** — you can't extract a glossary term to a pointer without breaking the relationship web. This is why CONTEXT-roasting is the right next dogfood: it's the shape that forces the missing sub-mechanisms.

## Open questions for the eventual systematization sprint

1. Once all 5 shapes are seen: skill vs. recurring schedule vs. arbiter step vs. standing cadence rule? (ADR-0013 leans mech-a, the arbiter pass.)
2. How autonomous can `consolidate`/`archive` safely become, given delete stays flag-only?
3. Cadence relative to the ADD-side patterns — how often must pruning fire to keep substrate net-flat rather than net-growing?
4. Does the prompt 40 KB cap hold, or loosen once we have prompt-side pruning evidence?
5. Does the structured-handoff format need richer fields once we have non-extract cases to compare?
6. **Registry-drift / size automation.** The tripwire registry's "Current size" column is hand-maintained and has drifted **3× in 3 days** (CONTEXT-roasting 105→116, PRODUCT 114→126→127). "Keep it current or the tripwires go blind" is a real failure mode. Candidate: a tiny `npm run check:doc-sizes` script (analog to `check:mcp-bundle`) that prints each tracked doc's live size vs cap and flags over/approaching — could ship *before* full systematization as the trigger half of the mechanism, with the manual exercise staying the response half.
7. **Autonomous-delete rule for provenance-class content** (from case 002): provenance shrapnel + deferred-future TODOs are git-recoverable with zero downstream consumers — the lowest-risk delete class and the candidate for the *first* autonomous-delete rule, kept distinct from concept-bearing deletes (which stay flag-only).

## New vocabulary to queue for a CONTEXT-shared grill (not authored yet — premature)

The pruning-op vocabulary is still forming; queue for a CONTEXT-shared grill once 2-3 cases stabilize it, rather than authoring CONTEXT entries now:

- the **six** shapes as first-class ops (extract / split / consolidate / archive / delete / **re-home (re-scope)** — the last added by case 007)
- "tripwire registry" · "post-tripwire pruning exercise" · "loading-profile-aware tiering" · "shape-coverage bias" · "structured handoff doc / pruning case" · "destinations-first / index-last ordering" · "preserve the append target" · "uniform n-threshold graduation" (case 007's CCIL lifecycle principle)

## This session's outputs

- [docs/architecture/doc-tripwires.md](docs/architecture/doc-tripwires.md) — the consolidated tripwire registry (NEW; placed live).
- [docs/sprints/pruning-cases/](docs/sprints/pruning-cases/) — structured handoff home + `_template.md` + `001-claude-md-compaction.md` (the retroactive `extract` seed case).
- [docs/sprints/context-roasting-prune-kickoff-2026-06-03.md](docs/sprints/context-roasting-prune-kickoff-2026-06-03.md) — kickoff for the next dogfood (CONTEXT-roasting; the first deliberate consolidate/delete hunt).
- grilling-queue § Substrate pruning candidates — worked examples filed (#244, #352); procedure points here.
- ADR-0014 — pointer note: live tripwire table now lives in the registry.
- **Decision (revised after case 003, 2026-06-03):** all five shapes now have a standalone worked example across three doc-shapes (reference-doc 001 / glossary 002 / roadmap 003) — **the full-coverage deferral gate is clear.** Case 003 (PRODUCT.md refactor + split, 127→21 KB) landed the missing `archive` shape. The **systematization decision** (skill / recurring schedule / arbiter step / standing cadence rule) is now a live Cluster B item on the [roadmap](docs/product/roadmap.md) § Active queue — no longer deferred.
