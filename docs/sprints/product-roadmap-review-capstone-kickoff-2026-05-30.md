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

### 4. (INTERIM — Chris-added 2026-05-31) Cross-domain simulated-pour-over workflow + roast↔brew handoff

The surface that was never designed because, pre-Latent, roasting and brewing were
**separate subsystems** — now they're one app and the operator is shuttling
between the two claude.ai projects (`/project/roasting` ↔ `/project/brewing`) by
hand. The **data model + linkages already exist** (cupping rows handle simulated
pour-overs via `eval_method` ~ "pourover" — see the **Simulated Pourover Gate**
term in CONTEXT-roasting; `brews.green_bean_id` + `roast_id` link the optimized
brew; MB-6 proved `best_roast_id` → reference brew). **What's unscoped is the
cross-domain *workflow orchestration*, not schema.** Two connected problems, both
from three live examples fresh in Chris's head (2026-05-31):

**Problem A — generating the simulated-pour-over recipe inside the roasting thread.**
Mid-V-set, before calling the reference roast, the operator pauses and runs a
**simulated pour-over** on 2 (sometimes 3) leading batches — *not* an optimized
recipe, a recipe "in the right continent / zone" that points toward how the lot
will land in the final optimized cup, without a full brewing-iteration flow. The
friction: he has to **come up with that recipe inside the roasting thread.** What
he'd prefer:
  - Walk a **brewing-cycle-lite** once — coffee brief → initial recipe, **NO**
    back-and-forth iterations — and **lock that as THE reference simulated-pour-over
    recipe for the lot**, reused on *every* simulated pour-over in that V-set AND
    future V-sets. Not perfect, but consistently points closer to the true final
    taste than ad-hoc per-cupping recipes.
  - **Open Q1:** today's manual shuttle (green-bean info → brewing thread → coffee
    brief → recipe → carry it back to roasting as a *throwaway, uncompleted*
    brewing session) — is that the best way, or is there a cleaner path?
  - **Open Q2:** can the **Master Coordinator** generate the brief + initial recipe
    *within the same thread* (a roasting thread, or a lightweight brewing handoff)
    rather than a manual cross-project copy-paste?
  - **Open Q3 (context budget — load-bearing):** roasting sessions in
    `/project/roasting` are **very context-heavy**; pulling the *entire* brewing
    substrate into a roasting thread just to produce one coffee brief + pour-over
    recipe is too expensive. How do we get just the **brief-generation slice**
    (the Coffee Brief + initial-recipe step of the Brewing Assistant) without the
    whole brewing zone? (Ties to the per-zone CONTEXT split + load-orchestration
    work — this is exactly the "load only the slice you need" problem.)
  - **Data-model open:** should the **reference simulated-pour-over recipe** be a
    *persisted* thing on the lot (so "use the same sim-pour-over recipe" is a
    lookup, not a re-derivation each session), and if so where — a field on
    `green_beans` / `roast_recipes` / a `brews`-shaped row flagged as simulated?

**Problem B — reference-roast → full brewing optimization → handoff-back loop.**
Once a batch is denoted the reference roast (after the simulated pour-over), the
operator runs the **full** brewing cycle: pulls it out of the roasting session →
opens a **new brewing session** → iterates → optimizes → writes a **handoff doc**
→ carries it **back to the roasting side**, telling roasting "this was the
reference roast, this was the reference recipe, here's the final cup, here's where
it landed, **here's the brew ID**" so the chain (**end roast ↔ pour-over cupping ↔
simulated pour-over ↔ end optimized brew**) all interlinks.
  - **Open Q4:** is the manual handoff-doc shuttle the most efficient loop, or
    should the Master Coordinator / a handoff prompt automate the
    "brewing-optimized-result → roasting-side linkage write" so the operator
    doesn't hand-carry the brew ID + recipe + final-cup back?
  - The linkages themselves exist; this is about the **workflow ergonomics** of
    keeping them intact across the project boundary.

**Why this is a grill, not a build:** the right shape touches the Master
Coordinator + `handoff-rules.md`, the per-zone CONTEXT / load-orchestration budget,
the cupping↔brew↔roast linkage model, and possibly a small data-model addition (a
persisted reference-sim-recipe). It overlaps **item 3 (MB-7)** directly — both are
about "the lot's canonical reference brew + keeping the roast↔brew linkage
explicit." Grill the two together. **Grade: BRAINSTORM** (the workflow shape is
still fluid; the term "Simulated Pourover Gate" is already locked, but the
cross-domain orchestration around it is not).

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

## Grilling topics surfaced during the redesign arc (drain alongside the roadmap)

The redesign arc (Sprints 1-6 + the 5 polish buckets) surfaced grill-shaped
items that were never formalized. Two are **net-new** (not yet in
`docs/grilling-queue.md` — appended there as Items 42 + 43 in the same commit
that added this brief's interim item); the rest are already-queued items this
session should formally drain.

**Net-new (redesign-surfaced):**
- **Item 42 — Per-surface mobile pattern → ADR candidate.** Sprints 1-4 locked a
  real convention but only as CLAUDE.md § Design-conventions prose: `order-*`
  single-tree where mobile is a *resequence* of the same blocks vs a
  container-query dual-subtree (`.s2-desktop`/`.s2-mobile` at the **520px
  crossover**) where mobile needs a genuinely different *composition*. Worth an
  ADR so future surfaces apply it instead of re-deciding per-sprint. **READY.**
- **Item 43 — Detail-view hero-tile reconciliation.** CLAUDE.md flags it
  explicitly: the `--tile-*` lifecycle gradient (index + green cards) vs the
  per-surface emphasis hero tiles (cupping lavender `#7A6E9E`, waiting-roast
  amber `#A88037`) "still use the old bindings — they reconcile in the green
  per-surface sprint." An unreconciled loose end; decide whether to reconcile or
  bless the divergence. **READY** (small, possibly folds into a green touch-up).

**Already queued — formally drain in this session's `/grill-with-docs` pass:**
- **Item 39 residual** — add the `Pour step` glossary term to CONTEXT-brewing.md
  (pour-structure shipped in the data-model session; the term waits for a grill
  per CONTEXT-grows-grilling-first).
- **Item 35** — drop-rules UI persistence / roast-time HUD (READY; a Latent app
  feature, redesign-adjacent — the `/green/[id]` view flips away from the
  design-intent panel the moment a roast is logged).
- **Items 36 / 37 / 38** — strategy-zone-terminology anchor-or-drop / claude.ai
  project-memory currency lag / operator-guide cross-reference density.
- **Items 40 / 41** — process-registry arbiter-queue reminder + honey-subprocess
  missing description field / Anoxic-qualifier aggregation promotion at N≥3.

## Suggested grill flow

1. **Frame the four parked items + carry-ins** (the surface trio, the
   cultivar-skeleton/MCP arc, MB-7, and the interim cross-domain
   simulated-pour-over workflow), then ask Chris to rank by *appetite* (what does
   he actually want to use next), not by size. Note item 4 + item 3 overlap and
   may grill together.
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
- **(Interim, item 4)** For the cross-domain simulated-pour-over workflow: is the
  reference sim-pour-over recipe a *persisted* lot artifact or re-derived each
  session? Can the Master Coordinator generate the brief + initial recipe inside a
  roasting thread without pulling the whole brewing zone (the Q3 context-budget
  problem)? And should the reference-roast → optimized-brew → roasting-side
  handoff loop stay a manual doc shuttle or get a handoff prompt / Coordinator
  automation? Grill alongside MB-7.
- Is there anything net-new not on this list now that the whole site is on v2 and
  the writing path is MCP-only? (The arc closures may have surfaced new appetite.)
