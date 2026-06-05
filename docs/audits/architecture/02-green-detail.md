# Architecture audit 02 — `green/[id]/page.tsx` (large mixed-concern file + weak type boundary)

**Session:** Architecture-audit dogfood #2 (2026-06-04). Read-only; no code edited.
**Surface:** [`app/(app)/green/[id]/page.tsx`](../../../app/(app)/green/[id]/page.tsx) + [`lib/lifecycle-state.ts`](../../../lib/lifecycle-state.ts).
**Centered smell:** large mixed-concern file + weak type boundary.
**Rubric:** Part B v0 of [architecture-review-skill-brainstorm-2026-06-04.md](../../features/architecture-review-skill-brainstorm-2026-06-04.md).

---

## TL;DR

- The page is **2,098 lines** (the seed said ~1,400 — it has grown ~700 lines since the survey), holding **all 5 lifecycle view-shapes + ~20 in-file helpers + 4 small components** in one module. The dispatcher is 80 lines; the rest is five sibling renderers.
- The headline smell is **weak type boundary**, not the file size. `bean: any` is fetched once and threaded through all 5 views, and ~30 `any` annotations cascade from it. **The fix is an adoption gap, not authoring work** — fully-typed `GreenBean / Roast / Experiment / Cupping / RoastLearning / RoastRecipe / Brew` interfaces (with join fields) already exist in [`lib/types.ts`](../../../lib/types.ts) and are simply ignored here.
- The file size is real but **well-sectioned** — each view groups its own helpers below it. Splitting only pays off *after* the type + dedup seams exist, so it ranks third, not first.
- **Two calibration negatives:** (1) `lib/lifecycle-state.ts` is a genuinely deep module — leave it alone; (2) the seed's "riskiest non-null asserts (crash risk)" did not materialize — the file has only 2 `!` asserts and both are locally guarded. The real type risk is unguarded dynamic field access, not asserts.

**Top 3 (by priority score):** C1 Type the query shape (22) · C2 Extract header + derive helpers (17) · C4 Split per-view (13).
**Recommended first refactor:** **C1** — highest leverage, building blocks already exist, and it defines the shared `bean` contract that every later split view would import.

---

## Step 2 — Mechanical scan

| Signal | Value | Note |
|---|---|---|
| Lines, `green/[id]/page.tsx` | **2,098** | seed estimate (~1,400) was ~700 low |
| Lines, `lib/lifecycle-state.ts` | 281 | |
| Churn (commits, 3 mo) — page.tsx | **29** | top-quartile hotspot; this is the load-bearing prioritization signal |
| Churn — lifecycle-state.ts | 5 | stable |
| `any` annotations in page.tsx | ~30 | concentrated in the threaded `bean`/`roast`/`exp` shapes |
| Non-null `!` asserts in page.tsx | **2** (L566, L1046) | both guarded — see calibration |
| View functions in one file | 5 | `WaitingForNextRoastView`, `WaitingForNextCuppingView`, `ArchiveLotBody` (resolved+unresolved), `InventoryPlaceholder` |
| `batch_ids` free-text parsers | **3** | `parseBatchIds` (lib), `parseBatchIdsForHighlight` (page), `parseDeclaredBatchOrder` (page) |

**Cross of churn × size × cognitive-load:** this file is the clearest single hotspot in `app/(app)/green/`. High churn (29) + large (2,098) + a weak type boundary that taxes every one of those 29 edits = audit-first material. The ugliness here isn't aesthetic; it's that every future edit to any one of the 5 states forces the editor to re-derive what `bean` actually contains.

## In-file duplication-at-distance (quantified)

The "different reasons to change" are real, but so is the *same* logic copy-pasted across the 5 views — what `/simplify`'s diff-scope misses because the copies sit 500-1,100 lines apart:

| Pattern | Copies | Lines |
|---|---|---|
| `metaPairs = [{Producer},{Origin},{Variety}]` (identical FK-fallback) | 4 | 211, 756, 1362, 1902 |
| `pills = [StatusPill, …process Chip]` (near-identical) | 4 | 216, 761, 1367, 1907 |
| "← Back to Green Beans" `<Link>` (byte-identical) | 4 | 224, 787, 1437, 1914 |
| roasts sort-by-`roast_date ?? created_at` | 3 | 186, 729, 1317 |
| latest-experiment sort `(b.created_at).localeCompare` | 2 | 165, 714 |
| `recipesForLatest` filter-by-`experiment_id` + slot sort | 2 | 174, 721 |

**Adoption gap inside the dup:** `lib/lifecycle-state.ts` already exports `pickLatestExperiment` (with a deterministic id tiebreaker), but the detail page inlines a weaker `created_at`-only sort twice (L165, L714) instead of calling it.

---

## Step 4 — Candidate cards

### Candidate C1: Type the page query shape (`bean: any` → `GreenLotDetail`)
- **Files involved:** `app/(app)/green/[id]/page.tsx` (fetch L60-106 + all 5 view signatures); composes from existing `lib/types.ts` interfaces.
- **Current shape:** One Supabase `.select('*, terroir:…, roasts(*, cuppings(id)), experiments(*), roast_learnings(*), recipes:roast_recipes(*)')` returns an untyped row. It's passed as `bean: any` into `WaitingForNextRoastView`, `WaitingForNextCuppingView`, `ResolvedView`, `UnresolvedView`, `InventoryPlaceholder`. From there ~30 `any` annotations propagate (`roast: any`, `latestExp: any`, `priorExp: any`, `cuppings: any[]`). The riskiest reads are dynamic-keyed: `latestExp[\`taste_for_${slot}\`]`, `latestExp[\`updated_cup_prediction_${slot}\`]`, `priorExp[\`observed_outcome_${slot}\`]` — string-built field access with zero compiler coverage.
- **Problem:** weak type boundary. The fetch shape IS the page's real interface, but it's `any`, so every future edit re-derives the column set by reading the SQL. A renamed column (`taste_for_a` → …) fails silently as `undefined`-renders-em-dash, not a build error — exactly the drift the six-actor audit exists to catch, here with no compiler backstop. **This is an adoption gap, not missing types:** `GreenBean` (with `terroir`/`cultivar`/`roasts`/`roast_learnings`), `Roast` (with `cuppings`), `Experiment`, `Cupping`, `RoastRecipe`, `Brew` all already exist and are fully populated in `lib/types.ts`.
- **Proposed deepening:** Define one `type GreenLotDetail = GreenBean & { roasts: (Roast & { cuppings: {id:string}[] })[]; experiments: Experiment[]; roast_learnings: RoastLearning[]; recipes: RoastRecipe[] }` next to the fetch, annotate the query result once, and change the 5 view props from `bean: any` to `bean: GreenLotDetail`. For the dynamic slot-keyed reads, add a tiny typed accessor (`tasteFor(exp, slot)`) or an index signature on the slot fields so the compiler covers them. Delete the cascading `any`s that the typed root makes unnecessary.
- **Before / After (seam):**
  ```
  before:  fetch → bean:any ─┬─► 5 views (each re-derives shape) ─► ~30 any
  after:   fetch → GreenLotDetail ─┬─► 5 views (shape known) ─► slot reads via typed accessor
  ```
- **Verification to lock behavior first (no tests):** `npm run build` (tsc is the lock — a correct retype is a no-op at runtime); then `preview_snapshot` each of the 5 states (the brainstorm § Today's-data-shape notes name real lots per state: waiting-roast=Rancho Tio, waiting-cup=Bukure/Red Plum/Fazenda, resolved=Sudan Rume/Mandela, unresolved=Higuito) to confirm identical render. Targeted `execute_sql` read of one lot per state to confirm the typed shape matches live columns.
- **Recommendation:** **Strong**
- **Size:** M (one focused PR; the slot-accessor is the only non-mechanical part)
- **Risk:** Low–Medium (tsc catches structural mismatch; the slot-keyed reads are the one place a wrong type could hide)
- **Why first:** highest leverage, the parts already exist, and it establishes the `GreenLotDetail` contract that C2 and C4 both build on. Doing the file-split (C4) before this would just copy `any` into 5 files.

### Candidate C2: Extract the shared lot-header + derive helpers
- **Files involved:** `app/(app)/green/[id]/page.tsx` (the ×4 / ×3 / ×2 blocks listed above); likely a new `app/(app)/green/[id]/_shared.tsx` (or `lib/green-lot.ts` for the pure derivers).
- **Current shape:** Each of the 4 full views rebuilds `metaPairs`, `pills`, the back-link, and re-sorts `roasts` / `experiments` / `recipesForLatest` inline. `composeLotMeta` (L38) already exists for the meta string but the views don't use it — they inline the same `?? terroir.country` fallback.
- **Problem:** duplication-at-distance + adoption gap. A header change (e.g. add a 4th meta pair) is a 4-site edit with a guaranteed miss-one bug; the sort tiebreaker already drifted (inline vs `pickLatestExperiment`).
- **Proposed deepening:** A `<GreenLotHeader bean variant>` component owning back-link + `SspTopBar` + `SspNamePlate` + `metaPairs` + `pills` (state pill driven by `variant`/`state`). Pure derivers (`sortRoastsChrono`, `recipesForExperiment`) move to a `lib/green-lot.ts` and the inline latest-exp sorts switch to the existing `pickLatestExperiment`.
- **Before / After:** 4 header blocks + 7 inline sort/filter copies → 1 component + 3 named helpers, each called 4×/2×.
- **Verification to lock behavior first:** `preview_snapshot` all 5 states pre/post; the header is byte-identical so a visual diff is the lock. tsc.
- **Recommendation:** **Strong**
- **Size:** S
- **Risk:** Low
- **Why later than C1:** lands cleaner once `bean: GreenLotDetail` exists so the extracted component takes a typed prop, not `any`.

### Candidate C3: Consolidate the three `batch_ids` parsers
- **Files involved:** `lib/lifecycle-state.ts` (`parseBatchIds`), `app/(app)/green/[id]/page.tsx` (`parseBatchIdsForHighlight`, `parseDeclaredBatchOrder`).
- **Current shape:** Three near-identical free-text parsers of the same `"139, 140, 141" / "139-141" / "MX-139"` format. They differ only in return shape: `string[]` (dedup), `Set<string>` (membership), ordered `string[]` (slot mapping). The page-local comments even say "mirrors parseBatchIds … inlined here to avoid importing it."
- **Problem:** shallow duplication — one parsing concept, three implementations, so a format change (new separator, new range syntax) is a 3-site fix. The "avoid importing" comment is the tell that the seam was never cut.
- **Proposed deepening:** One exported `parseBatchIds(raw, { ordered?: boolean })` in `lib/lifecycle-state.ts` returning `string[]`; callers wrap in `new Set(...)` at the use site. Delete the two page-local copies.
- **Verification to lock behavior first:** the parsers have pure, enumerable inputs — a handful of `console`-checked cases (range, comma list, `MX-` prefix, empty) covers it; then preview the highlight + slot-mapping on a live waiting-cup lot. tsc.
- **Recommendation:** **Worth exploring**
- **Size:** S
- **Risk:** Low (subtle: the ordered variant must preserve declared order; the dedup variant must not — keep both behaviors behind the one flag)
- **Why later:** low churn on these helpers; real but small leverage.

### Candidate C4: Split the file into per-view modules
- **Files involved:** `app/(app)/green/[id]/page.tsx` → `page.tsx` (dispatcher only) + `views/{waiting-roast,waiting-cup,archive,inventory}.tsx`.
- **Current shape:** 2,098 lines = dispatcher + 5 views + ~20 helpers, with each view's helpers grouped directly below it (the file IS sectioned, just long).
- **Problem:** large mixed-concern file — an agent editing the cupping view loads the resolved view's 550 lines for free, and the shared `bean: any` + duplicated helpers mean "what can I safely change" spans the whole file. This is the seed's "must hold too much in its head" case.
- **Proposed deepening:** After C1+C2, each view imports `GreenLotDetail` + the shared header/derivers and moves to its own file; `page.tsx` keeps only the fetch + `computeLifecycleState` dispatch.
- **Before / After:** 1×2,098-line module → 1 thin dispatcher + 4 view modules (~300-550 each) sharing a typed contract.
- **Verification to lock behavior first:** pure move — `preview_snapshot` all 5 states; tsc; no DB read needed.
- **Recommendation:** **Worth exploring** (conditional on C1+C2 first)
- **Size:** M
- **Risk:** Medium (helpers are interleaved with views; splitting before the shared seam exists would duplicate them across files — sequencing matters)
- **Why later:** the file's length is tolerable *because* it's sectioned; the win is real but second-order to fixing the type boundary that taxes every edit regardless of file count.

---

## Step 5 — Score + prioritize

`priority = change_freq + cognitive_load + coupling + interface_mess + leverage − risk`

| Candidate | freq | cog | coup | iface | lev | risk | **priority** |
|---|---:|---:|---:|---:|---:|---:|---:|
| **C1 Type the query shape** | 5 | 5 | 4 | 5 | 5 | 2 | **22** |
| **C2 Header + derive helpers** | 5 | 3 | 3 | 3 | 4 | 1 | **17** |
| **C4 Split per-view** | 5 | 5 | 2 | 2 | 3 | 4 | **13** |
| **C3 Parser consolidation** | 2 | 2 | 2 | 2 | 3 | 1 | **10** |

The top item is not the ugliest concern (the 2,098-line wall) — it's the `any` boundary whose ugliness taxes *every one of the 29 recent edits*. That's the rubric working as intended.

## Calibration negatives (the skill must also kill bad ideas)

- **`lib/lifecycle-state.ts` — leave alone. It passes the deletion test.** 281 lines, pure functions, real typed contracts (`LifecycleInputs`, `PriorExperimentShape`, `LifecycleState`). Delete `computeLifecycleState` and the state-derivation logic reappears across the index page, this detail page, and `GreenCard`. Small interface, lots of behavior behind it = a deep module. The only thing it leaks is the third `batch_ids` parser (C3), and that's a draw it *toward* it, not break it up.
- **The 2 non-null asserts are NOT crash risk — do not "fix" them.** The seed flagged "5-6 non-null asserts on nullable Supabase fields = real crash risk." In this file there are exactly 2 (`s.rawValue!(r)` L566, `info.recipe!.end_condition_target` L1046) and **both are locally guarded** — L566 sits behind a `.filter(s => s.isLever && s.rawValue)`, L1046 behind `isDesignDropTempApplicable(info.recipe)` which returns false for null. A type-tightening pass that "removes the asserts" here would add noise, not safety. The real type risk is the *unguarded dynamic field access* (C1's slot-keyed reads), which the seed didn't name.
- **The verbose empty-state explainer prose is intentional, not dup.** Each view has long italic "push X via MCP" guidance blocks. They look copy-pasteable but each names a different next-step Tool; they're workflow scaffolding for a half-populated DB, not redundancy to collapse.

---

## FRICTION LOG (most important output)

What was awkward about *doing this audit* — the raw material the standing skill gets derived from.

1. **The seed's line count was ~50% low (1,400 vs 2,098) and one of its two named smells (non-null asserts) didn't hold.** The survey numbers in Part C are a *starting hypothesis the audit must re-measure*, not a finding to confirm. The rubric needs an explicit Step-2 instruction: "re-run the mechanical scan; treat seed numbers as stale." A skill that trusts the seed would have under-scoped the file and chased a phantom crash-risk.

2. **The rubric has no "is this an adoption gap or a missing-capability gap?" fork — and that fork changes everything.** The single highest-value finding (C1) flipped from "Worth exploring (author a type system)" to "Strong, S/M (the types already exist, just adopt them)" only after I grepped `lib/types.ts`. The v0 smell table lists "Adoption gap" as its own row, but for *type* boundaries it's the decisive question and isn't prompted. **Proposed rubric add:** before scoring any weak-type-boundary or duplication candidate, grep for an existing helper/type that already does the job; the recommendation strength and size both hinge on the answer.

3. **"Large mixed-concern file" needs a sub-distinction the v0 taxonomy lacks: *sectioned-long* vs *tangled-long*.** This file is 2,098 lines but cleanly sectioned (view → its helpers, repeated 5×). A genuinely tangled 2,098-line file would rank the split #1; here it ranks #3 because the length is tolerable and the *type boundary* is the real tax. The skill will misprioritize if it scores on raw LOC. **Proposed heuristic:** "does editing concern A force reading concern B's code?" — for a sectioned file the answer is mostly no, which demotes the split.

4. **Sequencing between candidates is load-bearing and the v0 card format doesn't capture it.** C4 (split) is actively *harmful* if done before C1 (type) and C2 (dedup) — you'd copy `any` and duplicated helpers into 5 files. The candidate card has "Why first / why later" but no explicit *depends-on* field. **Proposed add:** a `Depends on:` line per card so the report emits a DAG, not just a sorted list.

5. **No-tests "characterization verification" worked cleanly here — and the reason is worth locking into the skill.** Every candidate is behavior-preserving (retype, extract, move), so `npm run build` (tsc as the structural lock) + `preview_snapshot` of the 5 named states + one `execute_sql` row-shape check is a *complete* safety net with zero tests. The key enabler was that the brainstorm's "Today's data shape" notes **name a real lot per state** — that's what makes preview verification concrete. **Proposed rubric add:** the audit should emit, per candidate, the specific live rows/URLs that exercise each code path, so the later refactor session has its verification matrix pre-built. For a stateful surface this is the difference between "preview it" (vague) and a runnable checklist.

6. **Churn data was the cleanest prioritization signal and the cheapest to get** (`git log --name-only … | uniq -c`). 29 commits/3mo on this file vs 5 on its helper instantly justified auditing the page over the lib. This confirms the Part A "static structure × git change-history" borrow — recommend it be a *required* Step-2 output, not optional, and that the priority formula's `change_freq` score be sourced directly from it rather than estimated.

---

## Stop condition

Audit only — no code edited. Hand back to the originating thread:
- **Top 3:** C1 (type the query shape, 22) · C2 (header + derive helpers, 17) · C4 (split per-view, 13).
- **Recommended first refactor:** C1 — establishes the `GreenLotDetail` contract C2/C4 depend on; the types already exist, so it's adopt-not-author.
- **Open questions before implementation:** (a) typed accessor vs index-signature for the slot-keyed `taste_for_${slot}` reads — which reads cleaner against the `Experiment` interface? (b) do the pure derivers belong in `lib/green-lot.ts` or a route-local `_shared.tsx`? (c) confirm C4 is wanted at all, or whether C1+C2 leave the file comfortable enough to keep whole.

---

## Implementation note — C1 landed (Session 02, 2026-06-05)

C1 shipped as a behavior-preserving retype. The fetch row is now `GreenLotDetail`, defined inline next to the query as `Omit<GreenBean, 'roasts' | 'roast_learnings'> & { roasts; experiments; roast_learnings; recipes }` — composed entirely from existing `lib/types.ts` interfaces (adopt-not-author held). All 5 view props (`WaitingForNextRoastView`, `WaitingForNextCuppingView`, `ResolvedView`, `UnresolvedView`, `InventoryPlaceholder`/`ArchiveLotBody`) plus the threaded helpers (`computeSlotInfos`, `derivePriorWinnerCup`, `buildCupHypoData`, `buildRoastActualsData`, `pickPourover`, `pickOptimizedBrew`, `composeBrewRecipeLine`, `SlotInfo.roast`, `roastsById`) dropped from `any` to the typed entities. `tsc --noEmit` is green; the ~30 cascading `any`s are gone except dead `composeLotMeta` (C2 will delete it).

**Open question (a) resolved — no accessor needed.** The slot-keyed reads (`latestExp[\`taste_for_${info.slot}\`]` etc.) type-check cleanly *as-is* because `info.slot` is already `SlotLetter` (`'a'|'b'|'c'|'d'`), not `string`. The template-literal key resolves to the union `taste_for_a | … | taste_for_d`, all of which are real keys on `Experiment` → the index returns `string | null` with full compiler coverage. The old `as string | null` casts were redundant and were removed. The only place a cast stays is `derivePriorWinnerCup`, where the slot comes from a regex match (`string`, not `SlotLetter`) so the cast is load-bearing.

**Two schema-vs-type drifts surfaced — validating friction-log #2.** The audit predicted the win was "adopt the types that already exist." Adoption is what *found* two real columns the `lib/types.ts` interfaces had silently dropped — exactly the silent-`undefined` drift C1 exists to kill:
- `green_beans.producer_tasting_notes` (migration 039) — read at the cupping view's `buildCupHypoData`, missing from `GreenBean`. `GreenBeanInfoCard` had a structural-type workaround with a comment literally saying "not yet typed on the GreenBean interface." Added to `GreenBean`.
- `cuppings.recipe_variant` (migration 041) — read in the All-Cuppings list, missing from `Cupping`. Added to `Cupping`.
Both are real, long-lived DB columns used elsewhere (`lib/roast-import.ts`, `push_green_bean`); the interfaces were just incomplete. Neither is a cross-system substrate change (the columns already exist across all six actors) — this only brings Actor 6's type layer in line. The `GreenBean`/`Cupping` interfaces remain partial against the schema (e.g. 039's `seller` / `exporter` / `elevation_m` / `additional_notes` are still untyped) — left for adoption as consumers need them.

**One refinement vs the audit's proposed type.** The audit sketched `brewsForLot: Brew[]`, but the brews fetch uses an explicit partial projection (33 columns), and the Supabase client infers that exact subset — so `Brew[]` over-declares and `tsc` rejects it (missing 32 fields). Typed it as `LotBrew = Pick<Brew, …>` instead, which is both accurate to the projection and prevents reading an unselected field as a silent `undefined`. The audit's note that the client is "untyped" was half-right: `select('*')` rows are loose (the `GreenLotDetail` cast handles them), but explicit-projection rows are precisely inferred.

**Not done (deliberately out of C1 scope):** C2 (header + deriver dedup, incl. deleting dead `composeLotMeta` and adopting `pickLatestExperiment`), C3 (parser consolidation), C4 (per-view split). C1 establishes the `GreenLotDetail` contract those build on.
