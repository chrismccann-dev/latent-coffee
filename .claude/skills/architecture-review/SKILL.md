---
name: architecture-review
description: Read-only architecture audit of a named surface (a page family, a lib core, the doc substrate). Like /simplify but repo-wide and judgment-heavy — finds duplication-at-distance, large mixed-concern files, weak type boundaries, shallow/deep mismatches, and doc-substrate rot, then emits a decisive lead recommendation + candidate cards + a considered-and-rejected list + a dependency sequence. Stops at the report; never edits code. Use when Chris says "architecture-review <surface>", "audit the architecture of X", "where's the duplication in Y", or wants a refactor scoped before building it.
---

<what-this-is>

`/architecture-review <surface>` runs one read-only audit of a named surface and produces a refactor-ready report. It is the **code-side sibling of the doc-pruning mechanism** — operator-invoked, judgment-heavy, repo-wide. It was *derived from* five real Latent audits (the worked-example corpus, [docs/audits/architecture/](docs/audits/architecture/) `01..05`), not theorized; every rule below (R1-R13) is a friction-log correction, not a guess.

**The two guardrails that define the skill's character:**
- **R8 — it kills bad refactor ideas.** On a well-factored surface the leave-alone calls are *half the value* — they stop a future agent from shattering a deep module while "tidying." A `Considered-and-rejected` section is mandatory, not optional.
- **R13 — it pushes the real ones.** The report is not a neutral menu. For genuine wins it *actively recommends action and states the cost of inaction*. It leads with a decisive "do this now," scopes the work, and hands off the packets — but **never silently executes** (the push is in the recommendation, not the keyboard).

**Hard rules, non-negotiable:**
1. **READ-ONLY. Stop at the report. Never edit code.** The actual refactor is a separate, grilled, later session.
2. **Re-measure everything (R1).** The surface description / seed counts are a *hypothesis*, never a finding. They were wrong in all five dogfood sessions.
3. **Delegate detection to the gates, keep the judgment.** `check:hotspots` and `check:doc-links` produce the mechanical lists; the skill does the keep/refactor/leave-alone judgment they can't.

</what-this-is>

<vocabulary>

Enforce these consistently (the "one adapter hints, two confirm" line did real work in Session 03 — keep it):

- **Module** — anything with an interface and an implementation.
- **Interface** — everything a caller must know: types, invariants, errors, ordering, config.
- **Implementation** — code hidden behind the interface.
- **Depth** — leverage behind the interface. Lots of behavior, small interface = deep. A JSX/presentational component is **deep if it owns data-shaping or invariants, shallow if it only forwards props/children** (R3).
- **Seam** — where behavior can change without editing callers. *One adapter hints at a seam; two confirm it.*
- **Adapter** — a concrete implementation at a seam.
- **Locality** — related knowledge/change lives in one place.
- **Leverage** — callers get more behavior while knowing less.

</vocabulary>

<the-process>

## Step 0 — Re-measure the seed (R1). Do this first, every time.

The seed (the surface brief, Part C survey numbers, a prior count) is a hypothesis. In all five dogfood sessions it was wrong: counts off (01: 3 of 5 claims), size ~50% low (02: 1,400→2,098), a named smell that didn't hold (02: crash-asserts), a mis-frame (04: 282→409 with a *different story*), a miscount + mislabel (05: 7→15 orphans, wrong dominant class).

- Run `npm run check:hotspots` (it surfaces *where* the churn × logic-LOC × fanout mass is).
- `grep -c` / `rg` **every** seed claim before trusting it ("BackLink ×10" turned out to be 8 inline `<Link>`s and **zero** `<BackLink>` component — a different, easier refactor than the seed implied).
- Treat the re-measured numbers as the finding; treat the seed as folklore. A skill that inherits the seed under-scopes.

## Step 1 — Orient (read-only)

Read the orienting substrate before the surface's own files: [CLAUDE.md](CLAUDE.md), the relevant CONTEXT-{zone}.md, [PRODUCT.md](PRODUCT.md), the relevant [docs/architecture/](docs/architecture/) docs + any [docs/adr/](docs/adr/) that constrain this surface (don't re-litigate a settled decision — if you reject a candidate for a load-bearing reason, *offer an ADR*). Use the deletion + extraction tests and the vocabulary as the lens.

## Step 2 — Mechanical scan (R2): `check:hotspots`, not hand-grep

Run `npm run check:hotspots`. It emits `file | logic_loc | churn_90d | import_fanout | product` sorted by product. Read it with these corrections baked in:

- **logic_loc, never raw LOC.** Raw `wc -l` actively misleads — Session 03's two biggest files needed *opposite* verdicts (`docs.ts` 1,342 = literal bloat → refactor; `brew-import.ts` 1,459 = engine depth → keep). The script already subtracts comments + `.describe()` doc-prose. **Caveat it still can't catch:** the `lib/*-registry.ts` files rank high on logic_loc because they are large *data literals* (the RoasterEntry / producer arrays). Per Session 05 those are **intentional symmetric API surface — a non-finding class.** Apply the calibration filter; don't audit a registry data file as if it were logic.
- **churn is the cleanest signal** (02-F6) — it feeds the `change_freq` score directly. 29 commits/3mo on a file vs 5 on its helper *is* the prioritization.
- **fanout is NOT a smell on its own (R11).** The top-fanout modules (`tool-wrapper` 31, `auth` 31) were the *healthiest*. Fanout is a smell only as fanout × (interface-instability | mixed-concern). The product uses `(1 + fanout)` precisely so a zero-fanout `page.tsx` (Session 02's hotspot) still ranks on churn × logic-LOC.
- **Emit a route inventory** when the surface is a page family — classify `app/` routes as index vs `[dynamic]` detail by hand if needed (01-F2: "7 pages" was really 8; counting was error-prone).

## Step 3 — Smell pass: the locked v1 taxonomy + the paired tests

Run **both** screening tests on each candidate module — they catch opposite failure modes:
- **Deletion test** — delete the module; does complexity reappear at the callers? If yes, it's deep (keep). Screens for *shallow pass-throughs*.
- **Extraction test (R3)** — if I extract a helper, how many sibling copies collapse? Mature well-factored cores have *no* shallow pass-throughs (03 returned "fine" on every file with the deletion test alone); the real smell there is the inverse — knowledge duplicated across N siblings where a helper makes N−1 vanish. **Run this alongside deletion, always.**

The locked smell taxonomy (fired ✓ in the cited sessions):

| Smell | Lens | Key sub-distinction | Seen |
|---|---|---|---|
| **Duplication-at-distance** | extraction test | **divergence among the copies is the priority multiplier (R5)** — diff the N copies; "same code in N places *that have begun to diverge*" is the dangerous version | 01, 02, 03 |
| **Shotgun-surgery** | edit-sites-per-change | distinct from dup-of-logic: one logical change touches N collections/sites (03 `docs.ts`: 1 doc → 4 edit sites). For a high-churn file, sample its recent commits and count distinct sites each change touched | 03 |
| **Large mixed-concern file** | "edit A → must read B?" | **sectioned-long vs tangled-long** — a sectioned file (02: view→its-helpers ×5) demotes the split; score on the *tax*, not raw LOC | 02 |
| **Shallow / pass-through** | deletion test | rare on mature cores; the extraction test fires instead | mostly ✗ |
| **Weak type boundary** | edge-vs-interior axis | classify each cast by dataflow location — ~32/34 were legit *edge* casts (05); only *interior* `any`/asserts count. The **adoption-gap fork (R4)** decides effort | 02, calib 05 |
| **Doc-substrate non-navigability** | per-renderer matrix | stale-vs-dead, live-vs-archive, `docs://` third space → **doc-substrate mode** below (R12) | 04 |
| **Stale-pointer** | doc-claim vs live code | dead-AND-misleading > merely-dead; needs a filesystem cross-check the link-checker can't do (04: `page-ia.md` → deleted `SectionCard`) | 04 |
| **Dead code** | extraction/deletion | **"unused export" ≠ "dead code"** — metric is repo-occurrences == 1, *not* zero-external-refs; "intentional symmetric API surface" is a non-finding class needing an allowlist (05) | low, calib 05 |
| **Adoption gap** | grep-for-existing | the decisive *pre-scoring* fork (R4) | all |

**Three sub-procedures the pass must run:**
- **R4 — the adoption-gap fork, BEFORE scoring.** For any duplication / weak-type candidate, `grep` for an existing helper/type that already does the job. Strength *and* size hinge on the answer: Session 02's top finding flipped from "author a type system (M)" to "adopt the existing `lib/types.ts` types (S)" only after one grep. (`kebab()` exists but private — 01; `pickLatestExperiment` inlined not imported — 02; `computeInputMaxUpdatedAt` re-defined — 03.)
- **R5 — diff the copies for divergence.** A normalized-whitespace clone-hash surfaces exact dups; then `git log -L`/blame to name the seed copy + the divergence commit. 01's most valuable finding was a *drift bug* (`cultivarMap` `{id}` object vs bare string), not a dup count.
- **R10 — budget for reading consumers; cite the count.** You can't judge whether a seam is real without reading both sides. The card cites consumer count as evidence for the keep/refactor call (03: reading all 4 adapters + 4 routes is what confirmed `EntityAdapter` earns its keep).

## Step 4 — Score, with the risk *gate* (R6)

`priority = change_freq + cognitive_load + coupling + interface_mess + leverage − risk` (each 1-5), sourcing `change_freq` from churn.

**But the formula under-penalizes high-risk speculative refactors** — a single `−risk` term can't offset four maxed positives, so the textbook over-abstraction trap (01's full-page shell) scored 2nd-highest and the narrative had to *fight the table*. So **risk gates, it does not subtract**:
- **Any candidate with risk ≥ 4 caps at `WORTH EXPLORING`, regardless of score.**
- A *decision, not a refactor* (04's convention schism) is flagged as such — it gates the others; it is not ranked as a build.

The top items are rarely the ugliest files — they're the ones whose ugliness **taxes every future change**.

## Step 5 — Candidate cards (v1 format)

One card per candidate:

```
### Candidate N: <name>  [STRONG | WORTH EXPLORING | SPECULATIVE]
- Files / consumers: <paths>  · consumer count: <n>            (R10)
- Current shape: <1 para — how it works today>
- Smell: <taxonomy row(s)>  · divergence delta: <how the copies differ, if any>  (R5)
- Existing-helper check: <grep result — does a type/helper already do this?>      (R4)
- Proposed deepening: <plain English, NO code>
- Depends on: <other candidates that must land first | none>                       (R7)
- Verification matrix: <named live rows / URLs / tsc / execute_sql checks>         (R9)
- Size: S|M|L · Risk: Low|Med|High        (risk ≥4 → caps at WORTH EXPLORING, R6)
- Cost of inaction: <what this taxes / what's actively rotting>   (MANDATORY on every STRONG card, R13)
- Why first / later: <1 sentence>
```

`Proposed deepening` is **plain English, never code** — this is a scoping report, not a patch.

## Step 6 — Considered-and-rejected (R8, mandatory)

A first-class section listing the plausible-but-wrong refactors and *why each is left alone*. On a well-factored surface this is half the value. Each entry names the module, the naive smell that would flag it, and the reason it's depth-earning-its-keep (deletion-test result, `.describe()`-is-documentation, intentional symmetric API surface, sectioned-not-tangled). Kill the bad ideas explicitly — the doc-pruning "kill bad ideas" discipline, verbatim.

## Step 7 — Dependency sequence (R7)

Emit a sequence, not just a sorted list. Sequencing is load-bearing: 02's split (C4) is *actively harmful* before the type (C1) and dedup (C2) land — you'd copy `any` into 5 files. 04 sequences decide-5 → fix-1 → fix-2. Use each card's `Depends on:` field to build the DAG and state the order.

## Step 8 — The decisive lead recommendation (R13)

The report **opens** with a clear "**Do this now:** …" lead recommendation — the single highest-leverage first move, stated as a stance, not a table the operator has to interpret. Every `STRONG` card carries its explicit *cost-of-inaction* line (what future change it taxes, what's actively rotting — e.g. 01's live `cultivarMap` drift bug). Decisiveness lives *between* the two guardrails: the R6 risk-gate still caps over-abstraction, R8 still kills the bad ideas, but for the candidates that survive both, **take a side rather than hedging.**

</the-process>

<doc-substrate-mode>

When the surface is the doc substrate (clusters / CONTEXT-* / prompts / the broken-link population), the smell is **doc-substrate non-navigability (R12)** and the rubric adapts:

- **"Broken" is per-renderer, not a boolean (04-F1).** Lead with the consumer/renderer matrix, not a raw count: the **Claude Code agent** resolves links from cwd = repo root (root-relative works); **claude.ai** doesn't follow markdown links at all (reads `docs://` MCP Resources); **GitHub web / Chris-in-GitHub** resolve relative to the containing file (root-relative 404s). A link's severity depends on *which consumer it breaks for* — broken-for-the-agent is an emergency, broken-for-GitHub-only is convention debt, checker-artifact is noise.
- **Delegate detection to `npm run check:doc-links`; keep the judgment.** The gate produces the dead-file + dead-anchor list (resolution base = repo root per [ADR-0021](docs/adr/0021-root-relative-doc-links.md); its skip-list is Session 04's false-positive taxonomy — *that ~8% FP rate is the deliverable, not contamination*). The skill keeps the three judgments the gate can't:
  - **live-vs-archive segmentation (04-F5):** a dead link in a closed sprint doc is not a CONTEXT-* dead link. Down-weight the archive layer (reuse the gate's live/archive split, which mirrors `check:doc-sizes`'s Tier-1 manifest).
  - **stale-vs-dead (04-F4 / the stale-pointer smell):** a link to a *deleted-and-replaced* concept (`page-ia.md` → deleted `SectionCard.tsx`) actively misleads — rank it **above** a merely-dead link. Needs a filesystem cross-check against live `components/`/`lib/`.
  - **`docs://` is a third address space (04-F6):** validated against the `lib/mcp/docs.ts` catalog, not the filesystem. A `docs://` pointing at an unregistered Resource is a real bug class.
- **First, hunt for the declared link convention (04-F7).** Here it's [ADR-0021](docs/adr/0021-root-relative-doc-links.md) (root-relative). Note the absence of a stated convention as itself a root cause if one is missing.
- **Swap the card slot:** doc-link remediation has no interesting before/after seam diagram — replace that slot with **"resolution base + sample dead targets"** (04-F8).

</doc-substrate-mode>

<verification-and-safety-net>

Latent has **no test suite** — the safe-change net is **characterization *verification*, not characterization tests**. It is proven complete across Sessions 01/02/03 because every behavior-preserving refactor (retype / extract / move) is covered by:

1. **`npm run build` (tsc)** — the structural lock. A correct retype/extract is a no-op at runtime, so a green build catches structural mismatch (the `strictNullChecks` discriminated-union narrowing does real work here).
2. **`preview_snapshot` of named live states** — every card's `Verification matrix` (R9) lists the *specific live rows/URLs* that exercise each code path, so the later refactor session gets a runnable checklist, not "preview it" (vague). Name a real lot per state (02: waiting-roast = Rancho Tio, resolved = Sudan Rume, etc.).
3. **Targeted `execute_sql` row-shape check** — confirm the typed/extracted shape matches live columns.

Because no substrate changes (this is internal refactor scoping), a full six-actor cross-system audit is usually *not* triggered — but say so explicitly per candidate (01-C: "the cross-link href convention touches actor 6 (UI) only; no schema/MCP/doc hops"). If a candidate *does* change substrate, flag the six-actor trace as required follow-up.

</verification-and-safety-net>

<stop-condition>

The audit session **stops at the report.** Do not edit code. End with: the decisive lead recommendation, the candidate cards, the considered-and-rejected list, the dependency sequence, and open questions to resolve before implementation. The actual refactor is a later, separate, grilled exercise:
1. `/grill-with-docs` the chosen candidate (own concept? right interface? what should callers stop knowing? which ADRs constrain it?). **Compose — don't restate** `/grill-with-docs` or `/simplify`.
2. Characterization verification (the matrix above) to lock current behavior.
3. Name/extract the seam → move implementation → migrate one caller → migrate the rest → delete the old path (back-compat stub per Latent discipline) → update docs/ADR/CONTEXT → `npm run build` + preview verify + six-actor audit if substrate moved.

</stop-condition>

<worked-example-corpus>

The five derivation audits are the skill's worked examples — read the matching one when auditing a similar surface:

- [docs/audits/architecture/01-detail-pages.md](docs/audits/architecture/01-detail-pages.md) — **duplication-at-distance + adoption gap** (the detail-page family). The template copy-pasted 8× (not the seed's 7) and the dup had *started to rot* (`cultivarMap` shape drift). Killed the full-page-shell over-abstraction (Candidate 5).
- [docs/audits/architecture/02-green-detail.md](docs/audits/architecture/02-green-detail.md) — **large mixed-concern file + weak type boundary** (`green/[id]/page.tsx`). The smell was the `any` boundary, not the 2,098 LOC; the fix was adopt-not-author (types already existed). Demonstrates the dependency DAG.
- [docs/audits/architecture/03-mcp-synthesis-core.md](docs/audits/architecture/03-mcp-synthesis-core.md) — **module depth** (MCP + synthesis core). Cores are *correctly deep*; the smell is duplicated boilerplate the abstractions stopped one layer short of. Where the extraction test (R3) and the considered-and-rejected section (R8) were born.
- [docs/audits/architecture/04-doc-substrate.md](docs/audits/architecture/04-doc-substrate.md) — **doc-substrate non-navigability** (the doc-substrate-mode source). The per-renderer matrix; 409 raw → ~167 agent-dead + ~169 GitHub-only + 33 FP; the `check:doc-links` gate spec.
- [docs/audits/architecture/05-lib-type-deadcode.md](docs/audits/architecture/05-lib-type-deadcode.md) — **calibration** (`lib/` type + dead-code sweep). The "leave it alone" verdict is the correct output; ~15 real orphans, 1 weak boundary. Proves the false-positive discipline.

</worked-example-corpus>

<relationship-to-the-rest>

- **Two deterministic gates do the mechanical detection** — `scripts/check-hotspots.ts` (`check:hotspots`, the Step-2 scan) and `scripts/check-doc-links.ts` (`check:doc-links`, the doc-substrate-mode detector). The skill *calls* them and interprets; it does not re-implement their logic.
- **On-demand, operator-invoked** ([decision locked 2026-06-04](docs/features/architecture-review-skill-derivation-2026-06-04.md)): there is no cron and no feature-ship coupling — architecture judgment is interpretive (the R6/R8 calibration can't be automated). `check:hotspots` runs on CI to surface *where* to point the skill.
- **Compose, don't duplicate:** the refactor step reuses `/grill-with-docs` and `/simplify`; this skill scopes and hands off, it does not restate their loops.

</relationship-to-the-rest>
