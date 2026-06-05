# Architecture-Review Skill — derivation (post-dogfood, 2026-06-04)

**Status:** 5/5 dogfood sessions complete. This is the Part E synthesis from [the brainstorm](architecture-review-skill-brainstorm-2026-06-04.md) — the **spec the standing skill gets authored from.** Mirrors how the doc-pruning mechanism was locked only after all six shapes had a worked example.

## The five sessions (index + verdict)

| # | Surface | Branch / loc | Top candidate | Stress-tested | Headline |
|---|---|---|---|---|---|
| 01 | detail-page family | `main` (#388) | `<AdditionalInfo>` + `extractCrossLinks` (pri 19/16) | duplication-at-distance | template copy-pasted 8× (not 7); the dup has **started to rot** (cultivarMap shape drift) |
| 02 | `green/[id]/page.tsx` | `strange-haslett-987b91` | type the query shape (pri 22) | large mixed-concern file + weak types | the smell is the **`any` boundary**, not the 2,098 LOC; fix is adopt-not-author (types already exist) |
| 03 | MCP + synthesis core | `fervent-zhukovsky` `9435b61` | `docs.ts` DOC_REGISTRY (pri 19) | module depth / deletion test | cores are **correctly deep**; smell is duplicated boilerplate the abstractions stopped one layer short of |
| 04 | doc substrate | `keen-fermi` `224a0fd` | CONTEXT-* `../../` + redirect-stub anchors (pri 20/19) | doc-substrate navigability | "broken" is **per-renderer**; 409 raw → ~167 agent-dead + ~169 GitHub-only + 33 FP |
| 05 | `lib/` type + dead-code sweep | pasted | none (calibration) | false-positive discipline | `lib/` is **healthy**; "leave it alone" is the correct output; ~15 real orphans, 1 weak boundary |

Every session **corrected its own seed** and every session produced a first-class *leave-alone* verdict. Those two facts are the spine of the skill.

---

## What converged (the skill's requirements — derived from friction logs, not theorized)

Ordered by cross-session weight. Each is a v0→v1 rubric change.

**R1 — Re-measure; the seed is a hypothesis, never a finding.** [01-F1, 02-F1, 04-headline, 05-#4 — all five] Seeds were wrong in every session: counts off (01: 3/5), size 50% low (02: 1,400→2,098), a smell that didn't hold (02: crash-asserts), a mis-frame (04: 282→409 with a different story), miscount + mislabel (05: 7→15). **Rule:** Step 0 re-runs the mechanical scan and `grep -c`-verifies every seed claim before trusting it. A skill that inherits the seed under-scopes.

**R2 — Ship `check:hotspots`; prioritize on churn × fanout × *logic*-LOC, never raw LOC.** [01-F6, 02-F6, 03-F2/F4] Two sessions independently asked for the same ~15-line script (`file | loc | churn_90d | import_fanout | product`). Churn was the cleanest, cheapest, most honest signal in every session and pointed straight at the real target (02: 29 commits, 03: docs.ts 42 commits). Raw LOC actively misleads — 03's two biggest files (`docs.ts` 1,342 bloat vs `brew-import.ts` 1,459 depth) need opposite verdicts, and `.describe()`-heavy schema files are "large" only with documentation. **Rule:** mechanical scan is a script, not hand-grep; size must be split into logic-LOC vs data-literal vs doc-string before it means anything; `change_freq` sources directly from churn.

**R3 — Pair the deletion test with an inverse extraction test.** [03-F1, 01-F7, 05-#7] The deletion test screens for shallow pass-throughs — but mature well-factored cores have none (03: returned "fine" on every file). The real smell there is the opposite: knowledge duplicated across N siblings where a helper makes N−1 vanish. **Rule:** add a named **extraction test** ("if I extract a helper, how many copies collapse?") and run it alongside deletion. Add a JSX/presentational depth heuristic (deep if it owns data-shaping/invariants; shallow if it only forwards props).

**R4 — Ask the adoption-gap vs missing-capability fork *before* scoring.** [02-F2, +01/03/05] The single highest-value finding in 02 flipped from "author a type system (M)" to "adopt the existing types (S)" only after a `grep lib/types.ts`. The pattern recurred everywhere: `kebab()` exists but private (01), `pickLatestExperiment` inlined instead of imported (02), `computeInputMaxUpdatedAt` re-defined (03). **Rule:** before scoring any duplication/weak-boundary candidate, grep for an existing helper/type that already does the job. Strength *and* size hinge on the answer.

**R5 — Divergence is the priority multiplier; diff the N copies.** [01-F3, 03-F8] 01's most valuable finding was a drift *bug* (cultivarMap `{id}` vs bare string), not a dup count — "same code in N places *that have begun to diverge*" is the dangerous version. **Rule:** diff the N copies against each other and surface the deltas; a normalized-whitespace clone-hash surfaces exact dups deterministically and flags the drifted copy. `git log -L`/blame to name the seed copy + divergence commit.

**R6 — Risk gates, it doesn't subtract.** [01-F4, 04-C5] 01's full-page-shell (the textbook over-abstraction trap) scored 2nd-highest because one `−risk` term can't offset four maxed positives; the narrative had to fight the table. **Rule:** any candidate with risk ≥4 caps at "Worth exploring" regardless of score (or risk multiplies). A decision-not-a-refactor (04-C5) is flagged as such, not ranked as a build.

**R7 — Emit a dependency DAG, not a sorted list.** [02-F4, +01/04] 02's split (C4) is *actively harmful* before the type (C1) and dedup (C2) land — you'd copy `any` into 5 files. 04 sequences decide-5 → fix-1 → fix-2. **Rule:** add a `Depends on:` field per card; the report emits a sequence.

**R8 — "Considered and rejected" is a first-class report section.** [03-F7, +01-C5, 02-calibration, 05-whole] On well-factored surfaces the leave-alone calls are *half the value* — they stop a future agent from shattering a deep module while "tidying." 03 needed a whole Calibration section the card format had no room for. **Rule:** report format = candidate list **+** considered-and-rejected list. Killing bad refactor ideas is core, per the doc-pruning "kill bad ideas" discipline verbatim.

**R9 — Each candidate emits its verification matrix (named live rows/URLs).** [02-F5] The brainstorm's "Today's data shape" notes naming a real lot per lifecycle state are what made preview verification *concrete* vs vague. **Rule:** every card lists the specific live rows/URLs/paths that exercise each code path, so the later refactor session has a runnable checklist. The no-tests safety net is locked: **tsc (`npm run build`) + `preview_snapshot` of named states + targeted `execute_sql` row-shape check** — proven complete across 01/02/03 because every candidate is behavior-preserving.

**R10 — Budget for reading consumers; cite the count as evidence.** [03-F6] Judging whether a seam is real ("one adapter hints, two confirm" — the vocabulary did real work) requires reading both sides; there's no cheap version. **Rule:** the card cites consumer count as evidence for a keep/refactor call.

**R11 — High import-fanout is not a smell on its own.** [03-F5] The top-fanout modules (`tool-wrapper` 31, `auth` 31) were the *healthiest*; the problems were in low-fanout files. **Rule:** fanout is a smell only as fanout × (interface-instability | mixed-concern). The "everything imports this" prompt must not flag depth-done-right.

**R12 — Doc-substrate audits need their own mode (the Latent extension).** [04-F1…F8] "Broken" is per-renderer (agent-cwd-root vs GitHub-file-relative vs `docs://` MCP catalog vs claude.ai-doesn't-follow-links) — lead with the consumer/renderer matrix, not a raw count. The naive checker's ~8% FP rate **is the deliverable** (the gate skip-list). Stale-pointer (dead-AND-misleading, e.g. page-ia.md → deleted SectionCard) ranks *above* merely-dead. Live-vs-archive segmentation is load-bearing (reuse `check:doc-sizes` Tier-1 manifest). `docs://` is a third address space. **Rule:** the skill has a doc-substrate mode that swaps the before/after-seam card slot for "resolution base + sample dead targets," hunts for the declared link convention first, and delegates detection to the spun-out `check:doc-links` gate while keeping the live-vs-archive + stale-vs-dead judgment.

---

## Locked smell taxonomy (v1)

Fired ✓ / didn't ✗ / added ⊕ relative to the v0 brainstorm list.

| Smell | Lens | Key sub-distinction (from friction logs) | Status |
|---|---|---|---|
| Duplication-at-distance | extraction test | divergence among the copies is the multiplier (R5) | ✓ 01,02,03 |
| **Shotgun-surgery** ⊕ | edit-sites-per-change | distinct from dup-of-logic: one logical change touches N collections/sites (03 docs.ts: 1 doc → 4 edit sites) | ⊕ 03 |
| Large mixed-concern file | "edit A → must read B?" | **sectioned-long vs tangled-long** — sectioned demotes the split (02) | ✓ 02 |
| Shallow / pass-through module | deletion test | rare on mature cores; the inverse (R3) fires instead | ✗ mostly |
| Weak type boundary | edge-vs-interior axis | classify each cast by dataflow location; ~32/34 were legit edge casts (05); adoption-gap fork decides effort (R4) | ✓ 02, calib 05 |
| Scattered conditionals | — | did not fire centrally (01-C6 synthesis-wiring is the nearest) | ✗ |
| Doc-substrate non-navigability | per-renderer matrix | stale-vs-dead, live-vs-archive, `docs://` third space (R12) | ✓ 04 |
| **Stale-pointer** ⊕ | doc-claim vs live code | dead-AND-misleading > merely-dead; needs a filesystem cross-check the link-checker doesn't do | ⊕ 04 |
| Dead code | extraction/deletion | **"unused export" ≠ "dead code"**: metric is repo-occurrences==1, not zero-external-refs; "intentional symmetric API surface" is a non-finding class needing an allowlist (05) | ✓ low, calib 05 |
| Adoption gap | grep-for-existing | the decisive pre-scoring fork (R4) | ✓ all |

---

## Candidate card v1 (format change)

```
### Candidate N: <name>  [STRONG | WORTH EXPLORING | SPECULATIVE]
- Files / consumers: <paths>  · consumer count: <n> (R10)
- Current shape: <1 para>
- Smell: <taxonomy row(s)>  · divergence delta: <how the copies differ, if any> (R5)
- Existing-helper check: <grep result — does a type/helper already do this?> (R4)
- Proposed deepening: <plain English, no code>
- Depends on: <other candidates that must land first | none> (R7)
- Verification matrix: <named live rows / URLs / tsc / execute_sql checks> (R9)
- Size: S|M|L · Risk: Low|Med|High  (risk ≥4 → caps at Worth-exploring, R6)
- Why first / later: <1 sentence>
```
Plus a mandatory **Considered-and-rejected** section (R8) and a **dependency sequence** (R7) at report end.

---

## Two deterministic spin-out gates (the `check:*` residue)

**`check:hotspots`** [R2] — `file | logic_loc | churn_90d | import_fanout | product`, sorted by product. ~15-line script; the skill's mechanical-scan layer calls it. Most-requested artifact across sessions. Low-risk to build now.

**`check:doc-links`** [R12, spec'd in full in Session 04] — walks `*.md`, resolves file-half **relative to repo root** (assumes the convention decision below), generates GitHub-slug anchor sets to catch redirect-stub dead anchors (the high-value class). **Skip-list (derived from 04's 33-FP taxonomy):** memory refs, `http(s)/mailto`, `docs://` → validate against `lib/mcp/docs.ts` catalog instead, strip `:NN`/`#LNN` line suffixes, `<...>` placeholders, a per-file `<!-- skeleton -->` opt-out, the grill-with-docs portable-template file. Daily CI cron, matching the existing 6 `check:*`.

---

## Decisions locked (Chris, 2026-06-04)

1. **Standing cadence → on-demand `/architecture-review <surface>`.** You invoke it against a named surface, like `/simplify` but repo-wide. No new cron. `check:hotspots` runs on CI to surface *where* to point it; the skill itself stays operator-invoked because architecture judgment is interpretive (the R6/R8 calibration discipline can't be automated). Tripwire/feature-ship coupling rejected — code has no clean every-session metric and most ships don't touch a hotspot.
2. **Link convention → root-relative everywhere.** Recorded as [ADR-0021](../adr/0021-root-relative-doc-links.md). Matches CLAUDE.md's stated instruction + the agent as primary consumer; GitHub-web 404s accepted as out-of-scope. This sets `check:doc-links`'s resolution base and the fix-shape of Session 04's Candidates 1/3/4.

## Build sequence (the follow-up, not this session)

Authoring is execution work for a fresh build session — this derive doc is its spec.

1. **`.claude/skills/architecture-review/SKILL.md`** — on-demand, takes a surface arg, runs the v1 rubric (R1-R11) read-only, emits candidate-cards-v1 + considered-and-rejected + dependency sequence. Carries the doc-substrate mode (R12). These 5 handoffs are its worked-example corpus (`docs/audits/architecture/01..05`). The skill **delegates** detection to the two gates and keeps the judgment (live-vs-archive, stale-vs-dead, adoption-gap fork) — per 04-Q5.
2. **`scripts/check-hotspots.ts`** (`check:hotspots`) — the mechanical-scan layer (R2). Lowest-risk, most-reused; can land first as a standalone.
3. **`scripts/check-doc-links.ts`** (`check:doc-links`) — root-relative resolution base (ADR-0021), anchor-set generation for redirect-stub anchors, skip-list from Session 04's 33-FP taxonomy. Daily CI cron.
4. **Doc-substrate remediation sprint** — Session 04 Candidates 1/3/4 (the `../../` + stale-pointer + off-by-one fixes) under the now-locked root-relative convention; this is where the 169-link migration lands.

The detail-page refactor (Session 01, the original "dedup finder" goal) and the green/[id] retype (Session 02) are independent build sprints, each with a ready candidate report.

## The dogfood ROI (why this worked)
Five surfaces, five independent seed-corrections, twelve convergent requirements, two new smell families, two spec'd gates, and a calibration session that correctly said "leave it alone." None of it came from the external sources' theory — it came from the friction of actually doing the audits. That is the doc-pruning template paying off on the code side.
