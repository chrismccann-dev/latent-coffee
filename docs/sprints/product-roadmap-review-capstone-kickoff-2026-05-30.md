# Product roadmap review / brainstorm — capstone kickoff brief

The explicit capstone after the 5-bucket redesign-polish punch-list closed
(`data-audit` → `naming` → `cleanup` → `data-model` → `side-quest` MB-6, all
shipped 2026-05-30). Every existing surface is now on the v2 chrome and the
punch-list is closed; this session decides **what's next**.

## ⚠️ THIS IS A GRILLING / SPEC SESSION. DO NOT EXECUTE. ⚠️

Interview Chris in long-form prose on every direction-setting call. Default to
**"ask, don't ship."** The autonomy rule does **NOT** apply here — this is
roadmap-shaping, not planned execution (per
[feedback_grilling_vs_executing_distinction](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md)).
No file edits, no migrations, no PRs. The output is a **prioritized, scoped
roadmap** (and, where a direction firms up, a per-item kickoff brief for a
future execution session). Consider running `/grill-with-docs` and/or the
product-management brainstorm skill as the working mode.

## Why now

The redesign-polish arc is the third major arc to close in ~2 weeks (writing-path
deprecation → read-path → redesign first-arc → redesign-polish). Several real
items were deliberately parked *behind* this capstone rather than folded into the
polish buckets. They are not yet sequenced against each other. This session is
where Chris sets the next direction with full situational awareness instead of
picking the loudest parked item.

## The parked items to pull together (the raw material)

### 1. The deferred surface trio: `/producers` · `/experiments` · homepage
- **`/producers`** — there is a 121-entry rich `ProducerEntry` registry
  (`lib/producer-registry.ts`) + `brews.producer` text, but **no `/producers`
  index or detail surface** (unlike terroirs / cultivars / processes / roasters,
  which all have full aggregation pages). Producers are arguably the richest
  un-surfaced axis.
- **`/experiments`** — the roasting V-set experiments are only reachable inside a
  `/green/[id]` lot page; there's no cross-lot experiment index. Is a standalone
  surface wanted, or is the per-lot Experiment Journey enough?
- **homepage** — `/` is currently minimal. What's the front door for a
  single-user research journal — recent brews? active lots? a "what should I
  brew/roast next" surface?
- **Grill:** which of the three earns a surface first, and what job does each do?
  Do they reuse the existing index/`Ssp*` primitives, or need new shapes? (The
  index primitive family `components/IndexList.tsx` + the detail `Ssp*` family
  both exist and are battle-tested now.)

### 2. Systemic cultivar-skeleton backfill + an MCP cultivar-content write path
- **The gap:** cultivar rows auto-created *after* migration 022 (2026-04-22) have
  all reference fields NULL — they render as skeleton pages. Bourbon was fixed in
  the data-audit session via a one-off migration (072). **5 more remain skeletons
  for the same reason: Mokka · Wush Wush · SL28 · Khun Lao · Mandela.** All 6 had
  authored `### {name}` content in `docs/taxonomies/varieties.md`.
- **Two-part candidate:** (a) a one-shot backfill migration covering all post-022
  skeletons (mirrors 022/072's column set), and (b) **the deeper fix — an MCP
  write path for cultivar content** so auto-created rows self-heal instead of
  needing a migration each time. Today there is NO MCP path for cultivar reference
  content (it's migration-only); every new cultivar a brew introduces is a future
  skeleton.
- **Grill:** is the one-shot backfill enough, or is the MCP cultivar-content Tool
  the real ask? If the latter, it touches the six-actor chain (a new Tool +
  Resource + Zod schema + the varieties.md ↔ DB sync model). Scope it as its own
  arc, not a quick fix.

### 3. "Attach resolved brew to lot" affordance (MB-7)
- **The gap:** the FK linkage exists (`brews.green_bean_id` + `brews.roast_id`),
  and MB-6 just proved the reference-brew pick (`best_roast_id` → the brew with
  `roast_id = best_roast_id`) works end-to-end. But there's **no explicit
  UI/workflow way to *designate* "this brew IS the lot's reference drinking
  brew."** Chris flagged confusion risk about which end-brew belongs to a lot.
- **The deeper shape Chris raised during MB-6:** a green lot can have **many**
  linked brews (different batches he brewed) but only **one canonical reference
  brew** by Latent — and the model could also accommodate "other roasted variants
  of the same green lot not roasted by me." Today the canonical one is implicitly
  the FK-matched brew; MB-7 would make it explicit + handle the multi-brew case.
- **Grill:** is this a render affordance (surface + let Chris pick) or a data-model
  change (a `green_beans.reference_brew_id` FK / a flag on `brews`)? How does it
  interact with the brews↔lot multi-link case?

## Carry-ins from the MB-6 session (smaller, fold into the grill)

- **`#185` duplicate data nit (spun off).** Two resolved lots — Higuito + GUA
  Libertad — both surface reference batch `#185` on the new green cards. Likely
  pre-existing `best_batch_id` drift on the GUA lot (NOT an MB-6 regression — the
  old flat list read `best_batch_id` directly too). A data check, candidate for a
  data-audit follow-up. The MB-6 card already derives from the authoritative
  `best_roast_id → roasts.batch_id` where available.
- **Green-helper consolidation (deferred from MB-6 `/simplify`).** `pickRefBrew`
  (index) and `pickOptimizedBrew` (detail) are identical-logic twins; the
  reference-batch derivation (`best_roast_id → roasts.batch_id` with
  `best_batch_id` fallback) is also now duplicated. A shared
  `getReferenceBatch` / `pickRefBrew` in `lib/lifecycle-state.ts` would dedup —
  but only once the detail page adopts it. Pairs naturally with MB-7 (both touch
  "the lot's reference brew"). Low priority; mention as a tidy-along.

## Suggested grill flow

1. **Frame the three parked items + carry-ins**, then ask Chris to rank by
   *appetite* (what does he actually want to use next), not by size.
2. For the top pick, grill it to a **scoped spec**: the user job, the surface(s),
   reuse-vs-new primitives, the six-actor footprint (especially anything touching
   MCP / schema), and an explicit in/out scope line.
3. Surface the **prior locked decisions** as defaults where they exist (e.g.
   index pages reuse `IndexList.tsx`; detail pages reuse `Ssp*`; MCP-only writes
   per `feedback_mcp_only_input`).
4. Output: a ranked roadmap + a paste-ready kickoff brief for whichever item is
   sequenced first. End by deciding whether that first item is an execution
   session or itself needs more grilling.

## Open questions to put to Chris (ask first — do not pre-pick)

- Of the parked three (producers / experiments / homepage), which earns a surface
  first — or does the cultivar-skeleton/MCP-content arc or MB-7 jump ahead?
- Is the cultivar gap a quick backfill migration or the start of the
  MCP-cultivar-content arc?
- Is MB-7 a render affordance or a data-model change, and how should the
  many-brews-per-lot / one-canonical-reference model work?
- Is there anything net-new not on this list now that the whole site is on v2 and
  the writing path is MCP-only? (The arc closures may have surfaced new appetite.)
