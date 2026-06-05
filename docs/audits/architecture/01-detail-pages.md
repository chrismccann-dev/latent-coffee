# Architecture Audit 01 — Detail-page family (duplication-at-distance)

**Session:** 2026-06-04 · ARCHITECTURE-AUDIT DOGFOOD SESSION (read-only, no code edited).
**Surface:** `app/(app)/{terroirs,cultivars,roasters,processes}/[*]/page.tsx` — the aggregation **detail** pages.
**Centered smell:** duplication-at-distance + adoption gap.
**Rubric:** Part B of [architecture-review-skill-brainstorm-2026-06-04.md](docs/features/architecture-review-skill-brainstorm-2026-06-04.md) (v0).

---

## Surface inventory (correction to the seed)

The brief said "7 aggregation detail pages." There are **8** dynamic detail routes:

| # | File | Lines | Churn (6mo, commits) | Anchor |
|---|---|---|---|---|
| 1 | `terroirs/[id]/page.tsx` | 313 | 18 | registry row (terroir) |
| 2 | `cultivars/[id]/page.tsx` | 227 | 20 | registry row (cultivar) |
| 3 | `roasters/[slug]/page.tsx` | 315 | 11 | registry entry (roaster) |
| 4 | `processes/[base]/page.tsx` | 281 | 3 (+9 on the pre-restructure `[slug]`) | structured-process aggregate |
| 5 | `processes/[base]/[subprocess]/page.tsx` | 178 | 5 | structured-process aggregate |
| 6 | `processes/[base]/modifiers/[combo]/page.tsx` | 184 | 5 | structured-process aggregate |
| 7 | `processes/modifiers/[modifier]/page.tsx` | 212 | 4 | structured-process aggregate |
| 8 | `processes/signatures/[name]/page.tsx` | 197 | 4 | structured-process aggregate |

Two sub-families share one skeleton:
- **Registry-anchor pages (1-3)** — fetch one entity + its brews, render authored prose cards from a registry/row.
- **Structured-process aggregates (4-8)** — fetch brews by a process predicate, render aggregation chips/archetypes.

The churn × size cross says the **registry-anchor pages are the hotspots**: `cultivars/[id]` (20 commits) and `terroirs/[id]` (18) are touched ~weekly and are mid-size. The process leaves are large-ish but cold (3-5). Per the rubric ("a 500-line file touched every week beats a 900-line file touched yearly"), **refactor leverage concentrates in the shared tail that 1-3 exercise most.**

### Seed-claim reconciliation (Part C vs. reality)

| Seed claim | Actual | Note |
|---|---|---|
| brew→cross-link loop ×7 | **×8** (all detail pages) | also drifted — see Candidate 1 |
| BackLink ×10 | **×8 inline `<Link>`, 0 `<BackLink>` component** | the seed implied a component exists; none does. Pure copy-paste. |
| slug regex ×4 | **×4** (terroir, cultivar, roaster cross-links + `[base]` `generateStaticParams`) | confirmed; `kebab()` exists but is private |
| SynthesisCard ×7 | **×8** | every detail page |
| Additional-Info ×6 | **×8** | every detail page |

---

## What is shared, verbatim or near-verbatim, across all 8

Every detail page is the same seven-beat spine:

1. **Back-link** — `<Link href className="font-mono text-xs uppercase tracking-[0.16em] text-latent-mid hover:text-latent-fg">← Back to X</Link>`. Identical className 8×; only `href` + label vary.
2. **Header** — `<SspTopBar>` + `<SspNamePlate>` (already primitives; thin).
3. **Page-specific prose/aggregation cards** — the *real* per-page variation. `SspShead` + `SspProseRows`/`SspStructure`/chip clusters. **Do not flatten this.**
4. **Cross-link aggregation loop** — `for (const brew of brewList)` building `terroirMap` / `cultivarMap` / `roasterSet` / `processSet`. Each page builds the subset it needs (a registry page omits its own dimension).
5. **`<SynthesisCard>`** — ~11-prop call. Cache source differs by axis (see Candidate 6).
6. **`<CoffeesList>`** — already a primitive; thin.
7. **Additional Information** — `<CollapsibleBlock title="ADDITIONAL INFORMATION">` wrapping `<FlavorNotesByFamily>` + 2-3 `<TagLinkList>` cross-link sections, each mapping a Map/Set to `{key,label,href}`.
8. **`<ConfidenceCard>`** — already a primitive; thin.

So beats 1, 4, 7 are the un-extracted duplication; beats 2, 5, 6, 8 are already components (mostly). Beat 3 is the legitimate variation.

`lib/process-aggregation.ts` does **not** build cross-link maps — the cross-link loop is inlined in every page, including all 5 process pages that already delegate their *primary* aggregation to that lib.

---

## Candidate cards

### Candidate 1: `extractCrossLinks(brews)` — the brew→cross-link aggregation loop
- **Files:** all 8 detail pages (`terroirs/[id]:139-148`, `cultivars/[id]:65-77`, `roasters/[slug]:79-96`, `processes/[base]:87-101`, + 4 process leaves).
- **Current shape:** each page hand-rolls a `for (const brew of brewList)` that populates 2-4 of `{terroirMap, cultivarMap, roasterSet, processSet}`. Terroir is keyed `macro_terroir || admin_region || country` → `{id, country}`; cultivar keyed by `cultivar_name` → id; roaster/process are `Set<string>`.
- **Problem (duplication-at-distance + drift):** copy-paste has **already diverged** — `terroirs/[id]` stores `cultivarMap` values as `{ id: string }` (object), while `roasters/[slug]` and the process pages store a bare `string`. Same concept, two shapes, because the loop was pasted and locally edited. This is the canonical "the dup has started to rot" tell. A future agent changing the terroir keying (e.g. to dedupe on macro) must find and hand-edit 8 sites.
- **Proposed deepening:** one `lib/cross-links.ts` export — `extractCrossLinks(brews, opts?)` returning `{ terroirs, cultivars, roasters, processes }` in a single canonical shape (each an array of `{id?, label, href}` ready for `TagLinkList`). Pages select the slices they render. Deep module: ~40 lines of logic behind a 1-call interface; deletion test passes (delete it and the keying logic reappears in 8 callers).
- **Before/After:** `const { cultivars, terroirs, roasters } = extractCrossLinks(brewList)` replaces the 12-line loop + the per-page Map→items `.map()` in beat 7.
- **Verification to lock first:** `preview_snapshot` the Additional-Info block on one registry page + one process page (cross-link labels/hrefs unchanged); `npm run build` (tsc); spot-check one `/terroirs/[id]` and one `/processes/[base]` in preview that cross-links still navigate.
- **Recommendation:** **Strong**
- **Size:** S (1 PR) · **Risk:** Low
- **Why first:** fixes an active drift bug, not just aesthetics; smallest blast radius; unblocks Candidate 3.

### Candidate 2: `<DetailBackLink to label>` — the inline back-link
- **Files:** all 8 (`terroirs/[id]:195`, `cultivars/[id]:117`, `roasters/[slug]:198`, `processes/[base]:123`, +4).
- **Current shape:** identical `<Link>` with a 4-class mono/uppercase/tracking style, `← Back to {X}`.
- **Problem (adoption gap / shallow dup):** there is **no** `BackLink` component despite the seed assuming one. A style-token change (the tracking value, the hover color) is an 8-file edit. Low cognitive cost individually, but it's the cheapest possible win and removes a whole class of style drift.
- **Proposed deepening:** `<DetailBackLink to="/terroirs">Terroirs</DetailBackLink>` (or `label`/`href` props) in `components/`. Shallow-but-justified: the value is *consistency enforcement*, not logic hiding.
- **Verification:** visual `preview_screenshot` of the back-link on two pages; tsc.
- **Recommendation:** **Strong** (trivial)
- **Size:** S · **Risk:** Low
- **Why:** zero-logic, pure consistency; fold into the same PR as Candidate 1/3.

### Candidate 3: `<AdditionalInfo>` — the cross-link + flavor block  ⟵ HIGHEST LEVERAGE
- **Files:** all 8 (`terroirs/[id]:283-307`, `cultivars/[id]:193-221`, `roasters/[slug]:277-309`, `processes/[base]:227-249`, +4).
- **Current shape:** `<CollapsibleBlock title="ADDITIONAL INFORMATION">` → `<FlavorNotesByFamily>` + N `<TagLinkList>` blocks, each `Array.from(map.entries()).map(...)` into `{key,label,href}`. The process cross-link href is built with **inline** `p.toLowerCase().replace(/[^a-z0-9]+/g, '-')`.
- **Problem (duplication-at-distance, ~25 lines × 8, with embedded drift):**
  - The `FlavorNotesByFamily` `title` prop is **inconsistent** — `"FLAVOR NOTES I HAVE EXPERIENCED"` on most, but `roasters/[slug]` omits it (renders the default). Copy-paste drift again.
  - The TagLinkList section titles vary by page ("CULTIVARS I HAVE EXPLORED" vs "CULTIVARS EXPLORED") — some of this is *intentional voice*, some is drift; a shared component forces the decision to be made once.
  - `roasters/[slug]` adds a `ROASTER METADATA` sub-block (beat-3 overflow) inside Additional-Info — the one real structural variation; the component takes it as an optional `prepend`/`children` slot.
- **Proposed deepening:** `<AdditionalInfo flavors={...} links={extractCrossLinks(...)} prepend={roasterMetadata?}>`. Consumes Candidate 1's output directly; applies the slug helper (Candidate 4) internally; centralizes the section titles. Deep: hides the entire collapsible + 3 map→items conversions behind a declarative interface.
- **Before/After:** ~25 JSX lines per page → one `<AdditionalInfo>` element + the optional roaster prepend.
- **Verification:** `preview_snapshot` + `preview_click` to expand the block on a registry page and a process page; confirm flavor families + every cross-link group render and navigate; tsc.
- **Recommendation:** **Strong**
- **Size:** M (2-3 PRs if staged registry-then-process) · **Risk:** Low-Medium (the roaster metadata slot + title-voice decisions need a quick grill).
- **Why:** biggest line-count win, contains two live drift bugs, and it's the cleanest expression of "deep shared module" the brief asked us to test.

### Candidate 4: export a `processUrl()` / `kebab()` — the inline slug regex (adoption gap)
- **Files:** `terroirs/[id]:297`, `cultivars/[id]:209`, `roasters/[slug]:305`, `processes/[base]:54` (`generateStaticParams`).
- **Current shape:** `\`/processes/${p.toLowerCase().replace(/[^a-z0-9]+/g, '-')}\``. `lib/process-routing.ts` already has `kebab()` (line 41, **not exported**) and exports `baseSlug`/`modifierSlug` which *wrap* `kebab`.
- **Problem (adoption gap + correctness risk):** the canonical slug logic is one import away but is re-typed inline. If `kebab` ever changes (e.g. handle apostrophes, unicode), the four inline copies silently produce wrong/404 URLs. Even `[base]`'s own `generateStaticParams` re-inlines the regex instead of calling `baseSlug`.
- **Proposed deepening:** export `kebab` (or add `processCrossLinkUrl(name)`) from `lib/process-routing.ts`; replace all 4 inline copies. Folds naturally into Candidate 3 (the URL is built inside `extractCrossLinks`/`AdditionalInfo`).
- **Verification:** tsc; spot-check one process cross-link URL resolves; confirm `generateStaticParams` still emits identical params.
- **Recommendation:** **Strong** (sub-item of 1+3, not a standalone PR)
- **Size:** S · **Risk:** Low

### Candidate 5: `<RegistryDetailShell>` — the whole-page template  ⟵ CALIBRATION / DEFER
- **Files:** the registry-anchor trio (1-3); the process aggregates could follow.
- **Current shape:** beats 1-8 in the same order on every page.
- **Problem:** the *spine* is duplicated, but the **meaningful variation lives in beat 3 (page-specific cards), the SynthesisCard cache source, and the roaster's inverted priority stack** (`roasters/[slug]` deliberately leads with `CoffeesList` and collapses synthesis — the documented "roaster exception" in [docs/design-system.md § Detail-page grammar](docs/design-system.md)). A single shell that owns the section order would have to special-case the roaster, and would tempt future authors to bend pages toward the template instead of the content.
- **Proposed deepening:** *Possible* `<DetailShell backTo header synthesis coffees additional>{children=beat3}</DetailShell>`, but only after 1-4 prove the seams. **More likely correct: do NOT build this** — once the cross-link loop, back-link, and Additional-Info are extracted, the residual per-page code IS the legitimate variation, and a shell would be a shallow pass-through that hides nothing and constrains layout.
- **Verification:** N/A (recommend not building yet).
- **Recommendation:** **Speculative** — explicitly flagged as the over-abstraction trap the brief warned about. This is the audit *killing a plausible-but-wrong refactor*: the rubric's false-positive discipline says surface it and recommend against it for now.
- **Size:** L (staged migration) · **Risk:** High (priority-stack inversion, 3 synthesis cache sources, would fight beat-3 variation).
- **Why later (or never):** revisit only if a 9th detail page appears and the post-1-4 residual is *still* substantially duplicated.

### Candidate 6: per-axis `SynthesisCard` cache wiring
- **Files:** all 8 — the ~11-prop `<SynthesisCard>` call.
- **Current shape:** three cache-source patterns: (a) terroir/cultivar read `synthesis*` columns off the entity row; (b) roaster reads `roaster_syntheses` via a parallel query; (c) process reads `process_aggregation_syntheses` by `(aggregation_kind, aggregation_key)`. Then ~11 props are wired identically.
- **Problem (scattered conditional / prop-drilling):** the same prop bundle is repeated 8×; the only real difference is *where the cache row comes from*. The wiring is mechanical but verbose and easy to mis-paste (the SYN-7 `currentInputMaxUpdatedAt` arg has 3 spellings: brews-only vs brews+roastLearnings).
- **Proposed deepening:** a thin `synthesisPropsFor(axis, ...)` helper or per-axis wrapper component that maps a cache row + brew list to the prop bundle. Lower priority than 1/3 because the variation (cache source) is genuine and the win is modest.
- **Verification:** preview that synthesis still renders/regenerates on a registry + process page; tsc.
- **Recommendation:** **Worth exploring**
- **Size:** M · **Risk:** Medium (synthesis regen trigger is subtle — needs the SYN-7 currentInputMaxUpdatedAt behavior locked before touching).

---

## Step 5 — Scores & priority

`priority = change_freq + cognitive_load + coupling + interface_mess + leverage − risk` (each 1-5)

| Candidate | chg | cog | coup | iface | lev | risk | **priority** |
|---|---|---|---|---|---|---|---|
| **3 · AdditionalInfo block** | 4 | 4 | 5 | 3 | 5 | 2 | **19** |
| 5 · Full detail shell | 4 | 5 | 5 | 4 | 5 | 5 | 18 |
| **1 · extractCrossLinks** | 4 | 3 | 4 | 3 | 4 | 2 | **16** |
| 6 · SynthesisCard wiring | 3 | 3 | 4 | 4 | 3 | 2 | 15 |
| 4 · slug adoption gap | 2 | 2 | 3 | 2 | 2 | 1 | 10 |
| 2 · BackLink | 3 | 1 | 3 | 1 | 2 | 1 | 9 |

**Read the table with the risk caveat:** Candidate 5 scores 18 almost entirely on leverage/coupling, but its risk (5) is the *whole story* — it's the over-abstraction trap. The score formula rewards it; judgment rejects it. (Friction-log item: the formula under-penalizes high-risk speculative refactors — a single `−risk` term lets a High-risk candidate rank 2nd. See below.)

---

## Recommended first refactor

**Bundle Candidates 1 + 3 + 4 into one staged module: a `lib/cross-links.ts` data extractor + an `<AdditionalInfo>` component that consumes it + the exported slug helper.** This is the brief's exact test — turning known dup into *one deep shared module* while leaving beat-3 (the page-specific cards) untouched. It fixes two live drift bugs (the `cultivarMap` shape divergence, the `FlavorNotesByFamily` title inconsistency) as a side effect.

Sequence: extract `extractCrossLinks` first (pure data, trivially verifiable) → build `<AdditionalInfo>` on top of it → migrate registry trio → migrate process leaves → delete inline copies. Add `<DetailBackLink>` (Candidate 2) in the same arc since it's free. **Stop there.** Re-evaluate Candidate 6 separately; explicitly do **not** build Candidate 5.

## Top 3 candidates
1. **Candidate 3 — `<AdditionalInfo>`** (priority 19; highest line-count + drift-bug win)
2. **Candidate 1 — `extractCrossLinks(brews)`** (priority 16; prerequisite + fixes active shape drift)
3. **Candidate 6 — SynthesisCard wiring** (priority 15; do after 1+3, needs SYN-7 grill)

## Open questions before implementation
- **TagLinkList section-title voice:** are "CULTIVARS I HAVE EXPLORED" vs "CULTIVARS EXPLORED" intentional per-page voice or drift? `<AdditionalInfo>` must either accept per-section title overrides or standardize. (Grill question.)
- **`extractCrossLinks` return shape:** arrays of `{id?, label, href}` ready for TagLinkList, or raw Maps? The former is deeper (hides the href-building + slug logic) but bakes the URL convention into the lib.
- **Roaster Additional-Info `prepend`:** slot prop vs `children`? The metadata sub-block is the only structural variation; confirm it stays roaster-only.
- **Does this subsume part of the six-actor audit?** The cross-link href convention touches actor 6 (UI) only; no schema/MCP/doc hops. Confirm the refactor is UI-internal (no substrate change → no full six-actor trace needed).

---

## FRICTION LOG (most important output)

What was awkward about *doing this audit* — the raw material for the standing skill.

1. **The seed counts were wrong in three of five rows, and one assumed a component that doesn't exist.** "BackLink ×10" implied a `<BackLink>` component to consolidate adoption around; there are 8 *inline* Links and no component — a different (easier) refactor than the seed implied. **Rubric gap:** Step 1/2 should mandate a `grep -c` verification of every seed claim before trusting it, and the friction of *finding zero* `BackLink` usages was itself the signal. The skill needs a "verify the seed, don't inherit it" step.

2. **"7 pages" vs 8 — the surface boundary was fuzzy.** The brief globbed `processes/[*]` but the count assumed 4 process pages; there are 5. Counting dynamic routes by hand (`find ... -name page.tsx`, then mentally excluding index `page.tsx`) was error-prone. **Tooling wish:** a one-liner that classifies `app/` routes as index vs `[dynamic]` detail would remove the manual step. The skill's mechanical-scan layer should emit a route inventory, not just a file-size list.

3. **The most valuable finding was a drift *bug*, not a dup *count*.** The `cultivarMap` shape divergence (`{id}` object vs bare `string`) and the `FlavorNotesByFamily` title inconsistency are where copy-paste has started to rot — exactly the thing that makes the dup *dangerous* rather than merely ugly. **Rubric gap:** Step 3's "duplication-at-distance" tell is framed as "same code in N places," but the high-signal version is "same code in N places *that have begun to diverge*." The skill should explicitly diff the N copies against each other and surface the deltas — the divergence is the priority multiplier, and the v0 rubric doesn't ask for it.

4. **The scoring formula under-penalizes high-risk speculative refactors.** Candidate 5 (the full-page shell — the textbook over-abstraction trap) scored 18, second-highest, because a single `−risk` term can't offset four positive terms all maxed by "lots of duplication." A real audit reader who trusted the number would build the wrong thing. **Rubric fix candidate:** either gate (any candidate with risk ≥4 caps at "Worth exploring" regardless of score) or make risk a multiplier, not a subtrahend. The narrative recommendation had to actively fight the table — that's a smell in the rubric itself.

5. **No `git log -L`/blame pass meant I inferred drift direction, not proved it.** I can see `cultivarMap` has two shapes but not which page is the "original" and which the drifted paste, which matters for picking the canonical shape. **Tooling wish:** the skill should blame the duplicated regions to find the seed copy + the divergence commit — cheap with `git log --follow -L`, and it turns "these differ" into "this one drifted on PR #X."

6. **Churn data needed manual cross-referencing with size; the rubric describes the cross but gives no command.** I ran size and churn as two separate `find`/`git log` invocations and eyeballed the intersection. For 8 files that's fine; for a repo-wide pass it won't scale. **Tooling wish:** a `check:hotspots` script emitting `file | loc | churn_90d | import_fanout | product` sorted by product. This is the single most reusable artifact the skill could ship and it's ~15 lines of shell.

7. **"Deep vs shallow" was easy to apply to data (Candidate 1 = clearly deep) but genuinely hard for JSX blocks.** Is `<AdditionalInfo>` deep (hides 3 map conversions + slug logic) or shallow (just a JSX wrapper)? The deletion test helped — delete it and the conversions reappear in 8 callers, so it's deep — but the vocabulary in Part B is code/data-oriented and didn't give me a clean handle for "presentational component that also owns small transforms." **Rubric gap:** add a JSX-specific depth heuristic (a component is deep if it owns data-shaping or invariants, shallow if it only forwards props/children).

8. **The boundary against index pages was a judgment call the brief didn't cover.** `cultivars/page.tsx` (index) also has a brew-aggregation `for` loop and Maps, but for hierarchy grouping, not cross-links — a *different* concept that looks superficially like Candidate 1. I scoped it out, but a naive grep for "Map + for-loop" would have swept it in. **Rubric note:** "duplication" detection needs a concept filter, not just a syntactic one — same shape, different *purpose* is not duplication. The skill must distinguish.
