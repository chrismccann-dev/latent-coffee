# Reference Roasts + Roasting Guide

Combined feature document scoping two linked projects: (1) the reference-roast archival surface — where a bean's committed best roast lives and how it renders, and (2) cross-bean insights — the cumulative authored roasting guide that captures distilled knowledge across beans.

Written 2026-04-21 after a brainstorm session grounded in `/tmp/sprint-handoff/green-detail-audit.md` (PR #25, merged 2026-04-20) and `Coffee_Roasting_Master_Reference_Guide_V2.docx` (Chris's authored roasting reference, V2 last updated 2026-04-18).

## Vision

The app today archives *what happened* per bean — raw roasts, experiments, cuppings, per-bean learnings. This feature adds two new layers on top: a **reference roast** (the roast Chris stands behind for each resolved bean, with its replication pair and the brew that came from it) and a **living roasting guide** (`/roasting-guide/`, rendered from `docs/ROASTING_GUIDE.md` in the repo) that compounds cross-bean wisdom — process norms, density/moisture hypotheses, varietal aromatic fingerprints, peer insights, onboarding protocols. Together they close the loop on the self-roasted workflow: every resolved bean locks its reference roast in the DB and contributes to the guide, and every new bean starts with relevant excerpts of the guide surfaced in its own context. The guide is pasteable into Claude-project threads as onboarding context, which is how Chris operationally uses it today outside the app.

## Reference-roast model

### What "best" means

"Best" is a subjective plateau, not an optimized peak. The target is **high expressiveness AND high elasticity** — a roast state where brew-side choices (push for extraction, pull back for delicate florals, land in the middle) all stay viable. Chris's thesis sentence from the guide: *"Roast for elasticity. Brew for intensity."*

The decision moment is subjective. Chris arrives at it through triangulating sets of three ("I liked the acidity of B but the complexity of C; next roast should be somewhere in the middle; then three roasts around there"), commits to a candidate, starts brew optimization around it, may test 1-3 other candidates lightly in parallel, then locks subjectively. The lock is at **commit**, not at candidate-flag.

A reference roast is **latched** at the time it's called — it's not re-evaluated when methodology or equipment shifts downstream. An old reference stays the reference for that bean's era. Example: Gesha Village Oma's pre-counterflow reference stays authoritative for that bean even though Chris now roasts exclusively counterflow; you don't retroactively re-roast.

A bean can also terminate as **unresolved** — Chris didn't reach the plateau, green exhausted, or the cycle stopped for any reason. Unresolved is a valid terminal state; the bean exists in the app without a reference roast.

Reference-roast claims are **bean-specific**. Never shared across beans. The same reasoning Chris uses for brewing (one optimized recipe per roasted bean) applies to roasting (one reference roast per green bean). Cross-bean patterns surface in the guide, not as shared records.

### Schema shape

**New table:** `reference_roasts` — one row per resolved bean, zero rows for unresolved beans.

```
reference_roasts
  id                      uuid PK
  user_id                 uuid FK (RLS)
  green_bean_id           uuid FK UNIQUE (one per bean)
  roast_id                uuid FK -> roasts (the canonical reference batch)
  replication_roast_ids   uuid[] (0-N confirmation batches)
  why_this_roast_won      text (prose, moved from roast_learnings)
  brew_id                 uuid FK -> brews (nullable until brew archived)
  locked_at               timestamptz
```

The three-layer architecture:

| Layer | Where | What |
|---|---|---|
| Substrate | `roasts`, `cuppings`, `experiments` | Raw per-batch records |
| Per-bean distilled | `roast_learnings` | 16-field bean-level knowledge (aromatic behavior, failure signals, starting hypothesis, etc.) |
| Decision | `reference_roasts` (new) | The commit per bean |
| Cross-bean distilled | `docs/ROASTING_GUIDE.md` | Authored, cumulative, pasteable |

**Intentionally NOT in the schema:**
- No methodology-era field (Chris is committing to counterflow; historical mixed-methodology is acknowledged mentally but not tracked)
- No confidence tier enum (presence of replication_roast_ids carries the signal implicitly; pragmatic-stop vs. replicated is derivable)
- No candidate-flag state on roasts (the commit is the signal; candidate-under-evaluation adds UI noise without value)
- No `roasts.is_reference` bool (derivable from `reference_roasts.roast_id` match; single source of truth wins over denorm)
- No `roast_learnings.best_batch_id` free-text (replaced by structured FK in `reference_roasts`)

**Naming:** the entity is `reference_roast`, not `best_roast`. Less subjective, more archival-honest. "Reference" = the recipe profile Chris anchors against, not a universal quality claim.

### Surface

Primary render is **on `/green/[id]`**, in the existing BEST ROAST block (which becomes REFERENCE ROAST). Today that block shows `batch_id` (free-text) + `why_this_roast_won` prose. Post-entity it shows:

- The reference roast: batch number + FC/drop/dev/Agtron/weight-loss/profile-link
- Replication roasts (0-N): batch numbers with mini-summaries, visually secondary
- `why_this_roast_won` prose (moved here from roast_learnings)
- Link to the perfected brew when `brew_id` is populated

On `/brews/[id]`, a small backlink badge appears when the brew's `roast_id` matches a row in `reference_roasts`: "From reference roast #133 on Sudan Rume Hybrid Washed → `/green/[id]`". Two clicks reach the full bean context.

**No separate `/reference-roasts` index.** A flat list across beans is thin signal; the real cross-bean view is the guide. One-query view if ever needed, not a sprint.

## Cross-bean insights (the roasting guide)

### Scope

This is Chris's personal roasting guide, explicitly scoped: *his bean, his Roest L200 Ultra, in counterflow mode*. Not a universal reference. He's not trying to produce a Scott Rao / Rob Hoo reference text — that requires thousands of roasts across many machines and isn't his goal. The target is World Brewer's Cup / Roasting Championship preparation: a repeatable systematic methodology for understanding each coffee as a unique material, identifying the roast parameters that maximize its potential, and producing a reference roast that can be brewed with precision.

Machine-specificity is a structural constraint, not a footnote:
- Roasting is machine-specific in a way brewing isn't. Brew recipes transfer across brewers; roast profiles barely transfer across roasting methods on the same machine.
- External reference points (Rob Hoo, book numbers, other roasters' graphs) are useful for *shape*, not for parameter values.
- The sole external source whose data is directly applicable is Chris's peer who uses the same machine in the same mode (same Roest L200 Ultra, counterflow).

### What patterns are in scope

The guide's existing structure (24+ sections in V2) is the target, not a Rob-Hoo-style 5-element-chapter template. Key sections that drive cross-bean value:

- **Philosophy + scope** — "Roast for elasticity. Brew for intensity." plus equipment spec, evaluation protocol, standard workflow, BBP/hopper/charge protocols, standard inlet-curve template.
- **Machine-specific observations** — TP artifact, FC targeting, charge temp, total-roast-time bounds, session-position effect, Agtron-delta development signal.
- **Fan strategy** — shaped curves required, per-coffee-type fan floors, current reference curves.
- **Process-specific frameworks** — Naturals, Washed, XO/anaerobic (expected to grow as more processes are resolved).
- **New coffee onboarding protocol** — the 4-step intake flow Chris runs when a new green lot arrives. Includes anchor profile selection logic and V1 design output template.
- **Current state** — active lots with status, recently closed lots with reference roasts.
- **Peer insights** — Chris's Dongzhe-equivalent (same machine, same mode). The only external source that directly transfers.
- **Per-bean generalized learnings** — compressed takeaways per resolved bean (like the 6-bullet Sudan Rume Washed section in V2).
- **Cross-Coffee Insight Layer** — the cumulative cross-bean tables:
  - FC Floor & Ceiling by Processing Method
  - WB-to-Ground Agtron Delta Norms by Processing Method
  - Session Position Effect data
  - Green Spec → Starting Hypothesis (density / moisture / process / variety → V1 direction)
  - Varietal Aromatic Fingerprints
  - Rest Behavior Patterns
- **Roast-to-Brew Translation** — how roast parameters predict brew behavior; starting-point brew recipes by process type.
- **Session Debrief Template** — copy-paste prompt for post-roast Claude interaction.

### Aggregation primitives + dimensions

- **Primary:** cultivar × process *and* density/moisture band. Cultivar alone is secondary; process alone is secondary. The combinations matter.
- **Secondary:** process-family level (Washed / Natural / Honey / Anaerobic / Experimental). Falls back from missing cultivar+process cells.
- **Secondary:** genetic family level. Fallback when cultivar cell is N=0.
- **Explicitly de-emphasized:** terroir, elevation, origin. Thin signal at current corpus depth; cultivar + process + density is a far higher-leverage triple.
- **Not aggregation keys:** drum direction, air flow, RPM — these are levers within a cultivar, not cross-bean groupings. "Counterflow vs. classic" is a methodology era (Chris committed to counterflow), not a cross-bean dimension.

### Surface

**Single top-level surface: `/roasting-guide/`** — one long-scroll page rendering `docs/ROASTING_GUIDE.md` with internal anchors. Split into sub-pages later if scroll-length becomes painful (YAGNI until then).

Implementation:
- Markdown file lives in the repo at `docs/ROASTING_GUIDE.md`.
- Next.js server component reads the file at request time, renders markdown → HTML.
- Server-side rendering means updates ship with Chris's normal commit-and-deploy cadence (same as PRODUCT.md — no special deploy needed).
- "Copy all" and per-chapter "Copy" affordances for the pasteable-context workflow (guide content pasted into Claude-project threads for new-bean onboarding).
- Batch numbers (#133, #148), lot IDs (CGLE-SRUME-WASHED-2026), and linked entity names get autolinked to their app URLs at render time. The guide becomes navigable as part of the app, not a static reference.
- Scope banner at page top: "My roasting guide, on my Roest L200 Ultra, in counterflow. Not a universal reference."

**Excerpts pulled into other pages:**
- **`/green/[id]` BEAN CONTEXT block** at top of page. Fallback cascade based on the bean's attributes:
  1. Cultivar × process match in guide → use those sections
  2. Cultivar alone match → fallback to cultivar fingerprint + process norm tables
  3. Genetic family × process → family-level framing
  4. Process alone → process-specific section
  5. Density/moisture band → Green Spec → Starting Hypothesis table row
  6. General principles — always applicable
  Block renders what it found, honestly scoped ("You've never roasted a Natural Pacamara. Closest prior lessons: process-level from Higuito + Forrest, density-level from SRH Washed."). Short paragraph format, terroir/cultivar-synthesis length.
- **`/cultivars/[id]` ROASTING PROFILE block** alongside the existing brew synthesis. Excerpts the Varietal Aromatic Fingerprint row + any relevant cultivar-level learnings + link to the full chapter in the guide.
- **`/processes/[id]`** — deferred. Only if per-process roast content in the guide grows substantially. Low priority.

### Synthesis vs. computation

**Synthesis with explicit citations. Not tabular computation.**

- **Authored, not synthesized.** The guide is a PRODUCT.md-pattern authored markdown file, not a synthesis cache regenerated from DB. Chris + Claude edit it at checkpoints (post-experiment-session, post-lot-close, or ad-hoc when a pattern clicks). Edits are surgical, not wholesale regeneration.
- **Claude writes, Chris reviews and provides subjective input.** The update workflow is session-debrief-style: Claude asks Chris questions ("what surprised you this session?", "what's your take on this Agtron delta?"), Chris answers, Claude incorporates into the relevant section. This mirrors the existing Session Debrief Template in V2. Claude does NOT silently synthesize from DB data — subjective input is a first-class checkpoint.
- **Citations preserved across edits.** Every cross-bean claim cites the bean(s) that drove it, bean-level granularity ("confirmed on Sudan Rume Washed, active hypothesis for Gesha Clouds"). No granular row-level links needed.
- **Sample-size-aware voice.** At N=1 for a cell, the voice is tentative ("active hypothesis," "confirmed on 1 bean"). At N=2+, it shifts ("confirmed across 2 lots"). At N=3+ the Hoo-book voice is earned. Mirrors the existing `/roasters/[id]` precedent (<3 brews = "early data — patterns will firm up").
- **No computed aggregations surfaced as primary views.** At current corpus depth (N=1 in most cells), mean/median is either trivially equal to the single value or hides the signal. Authored prose at single-bean-level is more honest.

### Current state sync

Only one section of the guide represents current operational state: **Current State** (active lots with status + recently closed lots with reference roasts). Two options:

- **Option (a):** auto-generated from DB at request time (Next.js query, slotted into the rendered markdown)
- **Option (b):** hand-maintained in the markdown, same as every other section — Chris + Claude edit at lot transitions

**Recommendation: (b).** Consistent with PRODUCT.md pattern, zero special-casing, no sync bugs possible. Cost of occasionally stale Current State is low; gain of architectural simplicity is high.

## How the two layers connect

```
┌──────────────────────────────────────────────────────────────────┐
│ docs/ROASTING_GUIDE.md (cumulative wisdom, authored)             │
│   │                                                               │
│   │ renders at                                                    │
│   ↓                                                               │
│ /roasting-guide/ (in-app read, pasteable as Claude-project ctx)  │
│   │                                                               │
│   │ excerpts into                                                 │
│   ↓                                                               │
│ /green/[id] BEAN CONTEXT block (bean-specific fallback cascade)  │
│ /cultivars/[id] ROASTING PROFILE block (cultivar-specific)       │
└──────────────────────────────────────────────────────────────────┘
         ↑ distills from                ↓ references
┌──────────────────────────────────────────────────────────────────┐
│ DB: reference_roasts + roast_learnings + roasts + cuppings        │
│   │                                                               │
│   │ renders at                                                    │
│   ↓                                                               │
│ /green/[id] REFERENCE ROAST block (structural decision render)   │
│ /green/[id] ROAST LEARNINGS block (per-bean distilled knowledge) │
│ /green/[id] ROAST LOG + CUPPING HISTORY + EXPERIMENTS            │
└──────────────────────────────────────────────────────────────────┘
```

The DB is the archive of what happened per bean. The guide is the distilled wisdom across beans. They don't overlap — no sync risk. The guide references DB rows by bean name and batch number; the DB is source-of-truth for those references. The app handles autolinking from guide content to DB entities at render time.

Checkpoint cadence: after each experiment session, Chris runs the Session Debrief Template against Claude; at lot close-out, Chris runs a larger update pass (Current State, per-bean generalized learnings, Cross-Coffee Insight Layer updates). Post-update commits go through Chris's normal deploy flow.

## Phasing

**Status (2026-04-21):** The original brainstorm scoped three sprints (A / B / C). Post-brainstorm reconciliation with the current sprint queue:

- **Sprint A's render-polish sub-piece already shipped 2026-04-20** — P0 display bugs fixed (moisture `%%` + density `g/L g/L` normalized), ROAST LEARNINGS grew from 5 to 14 rendered fields via a `<LearningField>` helper, ROAST LOG grew from 6 to 9 columns (added `fc_temp`, `drop_temp`, `profile_link`). See `project_green_detail_polish.md` in Chris's memory.
- **P1 schema additions** (`green_beans.elevation`, `green_beans.producer_tasting_notes`, `green_beans.exporter`, `roasts.turning_point_temp`, `cuppings.sweetness`, `cuppings.brew_method`) are tracked separately as candidate #3 in the sprint roadmap, not part of this feature. They're a soft prerequisite for Sprint C's BEAN CONTEXT block (cascade degrades gracefully when fields are absent).
- **Remaining work for this feature** is guide bootstrap + Sprints B and C below.

Queue position (per `memory/project_sprint_roadmap.md` as of 2026-04-21): this feature corresponds to candidates #4 (reference_roasts entity → Sprint B) and #5 (cross-bean insights → Sprints A-remaining + C). Candidate #1 (Claude-authored sync V1, brews slice) fires first; the reference-roast work fires after sync V1 is dog-fooded against a real backlog brew.

### Sprint A (remaining) — Guide bootstrap

- **Guide bootstrap:** convert `Coffee_Roasting_Master_Reference_Guide_V2.docx` to `docs/ROASTING_GUIDE.md`, check into repo. Build `/roasting-guide/` page as a Next.js server component that reads the markdown file at request time and renders. Read-only at this stage; no excerpts yet. Scope banner at page top ("My roasting guide, on my Roest L200 Ultra, in counterflow. Not a universal reference."). "Copy all" affordance for pasteable-context workflow.

Rough size: 1 sprint or less. Pure docs + render work, minimal surface area. Could ship in parallel with Sprint B since they don't touch the same files.

### Sprint B — `reference_roasts` entity + surface integration

Independent of Sprint A (remaining) — can ship in either order or in parallel.

- **Migration 02X:** create `reference_roasts` table + unique constraint on `green_bean_id`.
- **Data migration:** translate `roast_learnings.best_batch_id` free-text into structured `reference_roasts` rows for beans where it's populated (careful with strings like `"#133 reference, #148 replication"` — winner + replication).
- **Schema cleanup:** drop `roast_learnings.best_batch_id`, drop `roasts.is_reference`, move `why_this_roast_won` from `roast_learnings` to `reference_roasts`.
- **Enriched REFERENCE ROAST block** on `/green/[id]`: reference batch + FC/drop/dev/Agtron/weight-loss/profile-link, replication batches with mini-summaries, why_this_roast_won, link to perfected brew.
- **Backlink badge** on `/brews/[id]` when the brew came from a reference roast.

### Sprint C — Excerpts + cross-linking

Fires after B.

- **BEAN CONTEXT block** at top of `/green/[id]` with fallback cascade pulling from the guide's structured tables (Green Spec → Starting Hypothesis, Varietal Aromatic Fingerprints, FC Floor by process, Fan Curves by coffee type).
- **ROASTING PROFILE block** on `/cultivars/[id]` alongside existing brew synthesis. Excerpts Varietal Aromatic Fingerprint row + cultivar-relevant learnings + link to full guide chapter.
- **Autolinking** in the rendered guide: batch numbers → `/green/[id]#batch-N`, lot IDs → `/green/[id]`, cultivar names → `/cultivars/[id]`, process names → `/processes/[id]`.
- **"Copy chapter" affordances** per section for the pasteable-context workflow.

### Deferred (to later sprints or event-triggered)

- `/processes/[id]` roast-excerpt block (low priority; per-cultivar signal is stronger than per-process).
- Smarter fallback-cascade logic beyond heading-string matching (YAGNI until the simple version breaks).
- Meta-synthesis pattern applied retroactively to terroir / cultivar / process synthesis (Chris flagged during brainstorm — the palate-aware / opinionated / personal framing should apply to those older surfaces too, but that's a separate sprint).
- Per-cultivar hand-tuned rendering. The guide is one file, one render path. YAGNI.
- Scorecards / dashboards / "health of the guide" metrics. YAGNI.

## Out of scope

This feature explicitly is NOT trying to:

- **Be a universal roasting reference.** This is Chris's guide on his Roest L200 Ultra in counterflow. External audience is zero.
- **Support commercial repeatability.** The reference-roast concept is for personal conviction ("the best I got to, the recipe profile I stand behind"), not reproducible-every-time-from-any-bag production.
- **Support shared templates across beans.** Every bean gets its own reference roast. `starting_hypothesis` priors inform new beans; they don't become shared records at the data layer.
- **Auto-sync the guide with the DB.** The guide is authored, not computed. Sync would fight the model.
- **Provide a Chris-authored-override UI for the guide.** The markdown file itself is the override — Chris hand-edits or Claude-edits, both go through Claude Code, both commit and deploy normally.
- **Regenerate the guide on button click.** This is not `/cultivars/[id]` brew synthesis. Updates are surgical and Chris-reviewed, not wholesale regeneration.
- **Track methodology-era on reference roasts.** Chris is committing to counterflow; historical mixed-methodology is acknowledged mentally but not schema-tracked.
- **Surface computed aggregations (dev-time averages, weight-loss means, etc.).** At current corpus depth these are either trivial (N=1) or hide signal (N=3-ish). Not surfaced as primary views now; revisit if corpus reaches 50+ counterflow beans.

## Open questions

Deferred to when the use case fires.

- **Upload cadence.** Does Claude check in roasts / experiments / cuppings continuously as Chris iterates on a bean, or only once the full loop resolves (reference locked + brew optimized)? This is the same question the "systematic spreadsheet sync" roadmap sprint is trying to answer. Until decided, `reference_roasts.brew_id` is nullable; the frequency of null-in-production depends on cadence. Doesn't block this feature's schema.
- **Meta-synthesis retrofit.** The palate-aware framing used for roasting synthesis should retroactively apply to terroir / cultivar / process synthesis. Known follow-on sprint.
- **Guide sub-pages.** Single long-scroll `/roasting-guide/` is the launch shape. Splitting into sub-pages (`/roasting-guide/cultivars/{lineage}`, `/roasting-guide/processes/{process}`, etc.) is deferred until scroll length actually hurts.
- **Secondary-dimension surfaces.** Density/moisture chapters in the guide are primary content dimensions, but there's no `/density-bands/[band]` page in the app. If such a page ever earns its keep, an excerpt block there is straightforward. Not planned.
- **Citation audit cadence.** Over time, uncited claims can accumulate in the guide as edits drift. Probably worth an occasional "audit citations" pass (every 5 beans or so, Claude reviews the guide, flags uncited claims, traces to source). Not scoped here.
- **`/green/[id]` ROAST LEARNINGS vs. guide per-bean sections overlap.** The guide already has "Key Learnings - [Bean] (Generalized)" per-bean sections (6 bullets for SRH Washed in V2). The DB has `roast_learnings` (16 fields per bean). Both exist; they complement each other. But if the guide's per-bean sections become the canonical distilled takeaway and the DB fields become pure substrate, the UX story may want to shift — render the guide's bullets on `/green/[id]` alongside the DB fields. Revisit after Sprint C ships and we see how the two surfaces feel in practice.

## Principles captured

Process principles that should guide implementation sprints, not just the content.

- **The guide's scope is declared, not assumed.** Scope banner on `/roasting-guide/` + framing in the feature doc make it explicit: this is Chris's guide, on his machine, in counterflow. Every edit should respect this scope.
- **Claude asks Chris questions as a first-class step.** Guide-update workflow is session-debrief-style. Claude does not silently synthesize from DB. Chris's subjective input is a checkpoint, not an afterthought.
- **Citations every claim.** New cross-bean claims cite the bean(s) that drove them. Discipline preserved across edits.
- **Authored over synthesized, where the content is evolving.** The guide is a PRODUCT.md-pattern file. The DB handles what's structural; the file handles what's distilled.
- **Machine-specificity is a scope constraint, not a footnote.** Structural emphasis throughout.
- **"Roast for elasticity. Brew for intensity."** is Chris's thesis sentence. Should be surfaced at the top of `/roasting-guide/` verbatim.
