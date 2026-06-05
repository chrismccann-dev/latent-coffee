# Redesign Polish Punch-List

Source: Chris's "New Design Feedback - Latent" doc (2026-05-30), desktop pass at 1024
+ "Mobile - New Design Feedback" doc (2026-05-30), mobile pass at 390. Mobile section captured
below — desktop items all still hold on mobile (Chris did not re-list them).

## STATUS — both polish PRs SHIPPED (2026-05-30)

- **PR1** — [#317](https://github.com/chrismccann-dev/latent-coffee/pull/317), main `b197574`:
  T-A tick scale · T-B corner badge · T-C collapsible alignment · BI-1 brew-card heights ·
  MB-1 mobile roaster popover · CI-1 cultivar tree spline.
- **PR2** — [#318](https://github.com/chrismccann-dev/latent-coffee/pull/318), main `8c9cbe4`:
  WC-2 cupping reshape (+ WC-1/WC-2b/WC-3/WC-5) · WR-2 anchor label.
- **`side-quest` MB-6 — ✅ SHIPPED 2026-05-30** (session 5 of 5, FINAL). See "MB-6 session outcomes" below. **All 5 buckets shipped — redesign-polish punch-list CLOSED.** Capstone next: product roadmap review / brainstorm.
- **`data-audit` — ✅ SHIPPED 2026-05-30** (session 1 of 5). See "Data-audit session outcomes" immediately below.
- **`naming` — ✅ SHIPPED 2026-05-30** (session 2 of 5). See "Naming session outcomes" below.
- **`cleanup` — ✅ SHIPPED 2026-05-30** (session 3 of 5). See "Cleanup session outcomes" below.
- **`data-model` (pour-structure) — ✅ SHIPPED 2026-05-30** (session 4 of 5). See "Data-model session outcomes" below.

## Data-audit session outcomes (2026-05-30, session 1 of 5)

- **GI-1 (5 unresolved lots) — ✅ FIXED via MCP.** Root cause was uniform: each of Higuito /
  CGLE Sudan Rume Natural / GV Oma 25/035 / GUA Libertad / GUA El Socorro had a *complete*
  `roast_learnings` row with a flagged reference roast (`best_roast_id` set + the `roasts` row
  `is_reference=true`) and all takeaway prose — but `why_this_roast_won` was NULL, and
  `computeLifecycleState` keys resolved-vs-unresolved solely on that field. Not a code bug; a
  data gap. Drafted verdicts from each lot's own winning-experiment prose, Chris approved all 5,
  patched `why_this_roast_won` via `patch_roast_learnings`. All 5 now render Resolved
  (Batch #185 / #187 / #52 / #94 / #88). Higuito confirmed genuinely resolved (has an optimized
  drinking brew, correctly FK-linked).
- **BS-1 Ruarai missing producer — ✅ FIXED.** `patch_brew(producer="Ruarai Factory (Ruthaka FCS)")`
  from Chris's full CSV row. Also canonicalized: added the `ProducerEntry` to
  `lib/producer-registry.ts` (registry now 121) + `docs/taxonomies/producers.md`, normalized to
  the existing Kenya-entry convention (producerSystem null; macro "Central Kenyan Volcanic
  Highlands"). `patch_brew` override persists verbatim (no queue row); the name resolves canonical
  once this PR deploys.
- **MB-5 Bourbon skeleton — ✅ FIXED + APPLIED.** Bourbon's `cultivars` row had all 18 reference
  fields NULL because the row was auto-created *after* migration 022 (which backfilled the 26 rows
  existing on 2026-04-22). `varieties.md` already carried the full authored `### Bourbon` block.
  `supabase/migrations/072_bourbon_cultivar_content_backfill.sql` (mirrors 022's column set) —
  **Chris applied it via the Supabase SQL Editor 2026-05-30; page verified rendering full content**
  (Genetic Background + Cultivar Context + Brewing & Cup Profile + Roasting). Note: no MCP path
  exists for cultivar content, so this axis is migration-only. **5 more cultivar rows remain
  skeletons for the same post-022 reason** (Mokka / Wush Wush / SL28 / Khun Lao / Mandela) — logged
  as a roadmap item below; Chris scoped this session to Bourbon-only.
- **BI-2 Heritage variety — ⏸ DEFERRED to `naming` (session 2).** Confirmed: "Heritage Collection"
  is a Finca Sophia *product-line* name, not a cultivar, and the brew (`06672cbf`) is wrongly
  FK-linked to **Gesha** while Chris's own notes say it's a Bourbon/Typica/Caturra heritage field
  blend. The correct fix needs the blend-naming convention being decided in the naming bucket, so
  it lands there (not this session).

### New roadmap items surfaced (for the post-bucket roadmap-review capstone)

- **Systemic cultivar-skeleton gap.** Bourbon is the visible tip: **5 more cultivar rows with
  brews are also skeletons** for the same post-022 reason — **Mokka · Wush Wush · SL28 · Khun Lao
  · Mandela**. All 6 have authored `### {name}` content in `docs/taxonomies/varieties.md`. Only
  Bourbon fixed this session (Chris scoped it to Bourbon-only). Candidate: a one-shot backfill
  migration covering all post-022 skeletons + (longer-term) an MCP write path for cultivar content
  so auto-created rows self-heal.
- **"Attach resolved brew to lot" affordance.** The FK linkage exists (`brews.green_bean_id` +
  `roast_id`) but there's no explicit UI/workflow way to *designate* "this brew IS the lot's
  reference drinking brew." Chris flagged confusion risk about which end-brew belongs to a lot.
- *(Out of scope, flagged only)* Finca Sophia Heritage brew lists producer "Wilton Benitez"
  (Colombia/Granja Paraíso) on a Panama Finca Sophia lot — possible mis-attribution; not touched.

### NAMING SESSION (session 2 of 5) — kickoff brief

**THIS IS A NORMAL EXECUTION SESSION, but it is heavily interpretive (label/abbreviation
conventions are Chris-taste calls). Default to capture-first + AskUserQuestion on every convention
decision; the autonomy rule applies only AFTER Chris signs off on each convention.**

- **Goal:** the `naming` bucket — index/cover title abbreviations, the standard blend-naming
  convention, and filter-label shortening — plus the deferred Heritage variety fix that depends on
  the blend convention.
- **Scope (in):**
  - **BI-2 abbreviation cleanup** (brew-cover titles): the full list is under "## Brew Index" →
    BI-2 (e.g. "Dark Room Dried"→DRD, "El Placer (Farm)"→"El Placer", "Generic Honey"→"Honey",
    "Ethiopian Landrace Population"→"Ethiopian Landrace", numbered-blend trims, "Gesha Panama
    lineage Washed"→"Gesha", etc.). Keep the "…" overflow handling.
  - **Blend-naming convention** (broader than the index): decide the canonical shape for field
    blends ("Bourbon Caturra blend", "Red Bourbon, Mibirizi blend", "Ethiopian landraces blend").
    This is the gating decision for the Heritage fix.
  - **BS-1 filter-label shortening** (`naming` sub-items of BS-1): "CAFEC Abaca+ Cup 4 Cone Paper
    Filter"→"CAFEC Abaca+ Cone"; "CAFEC T-92 - Cup 4 Light Roast Paper Filter"→"CAFEC T-92".
    These live in `lib/filter-registry.ts` (canonical + displayName/aliases). NOTE: the Abaca+
    `displayName` ("CAFEC Abaca+ Cone") was added in the 2026-06-04 filter reconciliation, so that
    half is already done; remaining work is whichever UI surfaces still render the long canonical.
  - **Heritage variety fix (carried from data-audit):** brew `06672cbf` — once the blend
    convention is set, repoint the cultivar off Gesha to the correct heritage-blend canonical and
    fix the `variety` text. Likely a cultivar-registry 2-step edit + a `patch_brew`. Note: blend
    cultivars are net-new canonicals → cultivar-registry edit (no `cultivar_override` flag exists),
    and per migration 022 precedent, NEW cultivar rows need content backfilled too.
  - **The "naming" decisions are partly registry edits** (filter displayName, cultivar blend
    canonicals) and partly pure display-string logic (cover-title abbreviation). Separate the two:
    registry edits propagate via the six-actor audit; cover abbreviation may be a render-layer
    transform (where? likely `components/BrewCard.tsx` title composition) — confirm before editing.
- **Scope (out):** the `cleanup` bucket (session 3 — /brews heights + cultivar spine + terroir
  index); pour-structure (that's `data-model`, session 4); MB-6 (session 5); the systemic
  cultivar-skeleton backfill + attach-resolved-brew feature (roadmap capstone).
- **Files likely to touch:** `lib/filter-registry.ts`, `lib/cultivar-registry.ts` +
  `docs/taxonomies/varieties.md` (blend canonicals), `components/BrewCard.tsx` (cover-title
  abbreviation if render-layer), possibly a small naming/abbreviation helper. `patch_brew` (MCP)
  for the Heritage row; a content-backfill migration if a new blend cultivar row needs reference
  fields.
- **Verification:** preview at 1024 + 390 on `/brews` (cover titles) + the affected brew/filter
  surfaces; `/simplify`; tsc via the symlink trick; squash-merge per autonomy once conventions are
  signed off.
- **Open questions for Chris (ask first):** exact blend-naming convention; which abbreviations are
  acronyms (DRD) vs trims (drop "(Farm)"); whether cover-title shortening is render-layer or stored;
  the Heritage blend's canonical name + whether to treat it as a single blend cultivar or pick a
  lead variety.
- **End the naming session by writing the session-3 (`cleanup`) kickoff brief.** (Cleanup itself
  is lightly specified here — Chris pastes full specifics into that session's thread; the naming
  brief just needs to hand off cleanly, noting cleanup precedes data-model.)
  Reminder: Chris will do a **full audio readout of several recipes** (complex + simplistic) to
  kick off data-model — do NOT start the parser fix before that audio lands.

### Naming session outcomes (2026-05-30, session 2 of 5)

Shipped in one PR. Conventions captured via AskUserQuestion before any edit (per the
capture-first brief); autonomy applied only after each was signed off.

**Locked conventions:**
- **Cover abbreviation = render-layer** (Chris Q1). New `lib/brew-cover-title.ts`:
  `displayVariety` (explicit override map keyed on the 11 known messy titles + generic
  ` (group)` strip), `displayCoverProcess` (composes from structured columns via
  `composeProcessDisplay` + cover-only `Dark Room Dried`→`DRD` / `Generic Honey`→`Honey`),
  `displayProducerShort` (` (farm)` strip). Wired into `components/BrewCard.tsx`. Canonical
  registries + DB rows untouched; only the /brews cover changes. Scope-guarded: unlisted
  titles pass through verbatim.
- **Blend naming = `V1, V2 (Blend)`** (Chris refined the AskUserQuestion answer in-thread —
  capitalized `(Blend)` parenthetical, not a bare word). Chris chose to **rename canonicals**,
  not just render: `Bourbon / Caturra blend`→`Bourbon, Caturra (Blend)`,
  `Red Bourbon / Mibirizi blend`→`Red Bourbon, Mibirizi (Blend)` in `lib/cultivar-registry.ts`
  + back-compat aliases + **migration 073** (`UPDATE cultivars.cultivar_name`, idempotent) +
  `docs/taxonomies/varieties.md` (3 lines + a new "Blend-naming convention" subsection).
  Ethiopian-landrace JARC blends keep their detailed canonical (collision-avoidance + component
  fidelity) and render short via the cover layer. Free-text-only blends (Purple Caturra Bourbon)
  stay render-layer. **Migration 073 needs applying in the Supabase SQL Editor** (same as 072).
- **Process display fix (free):** switching the cover off raw `brew.process` to
  `composeProcessDisplay` fixed the double-`Anaerobic` (Altieri Gesha →
  `Anaerobic + Slow Dry + Raised Bed, Natural`) and the `Aerobic Anaerobic` misread (Sudan Rume
  → `Aerobic + Anaerobic, Washed`) at the same time.
- **Filter shortening (BS-1):** `displayName` added to the 2 CAFEC entries
  (`CAFEC Abaca+ Cone`, `CAFEC T-92`) + `getFilterDisplayName` wired into `/brews/[id]` recipe
  shead. Verified on both brews.

**Data fixes (via `patch_brew`):**
- **Mandela** (`a116bb9c`): `signature_method="XO"` → process recomposes to `XO` (CGLE branded
  signature; Anaerobic + Co-ferment kept as structured backing). Verified.
- **Heritage** (`06672cbf`, carried from data-audit): `cultivar_name="Bourbon"` (FK off Gesha,
  Bourbon has content via migration 072) + `variety="Bourbon, Typica, Caturra (Blend)"`. Cover +
  Coffee-Overview verified showing Bourbon. Lead-variety approach (Chris's call) avoided a new
  blend canonical + content migration.

**⚠ Handed to Chris (not auto-done):**
- **Duplicate brew** (`b27afe61` @14:11:19 + `15c67c4a` @14:10:26 — identical "Pepe Jijón Finca
  Soledad - Sidra Wave Hybrid", 53s apart): no MCP delete path, so removal is a SQL DELETE in the
  Supabase Editor. Recommended deleting the **earlier** write (`15c67c4a`), keeping `b27afe61`:
  `DELETE FROM brews WHERE id = '15c67c4a-9bd1-4181-be52-2cd074ac2e8c';`
- **Apply migration 073** in the Supabase SQL Editor.
- **Unflagged cover lookalikes — ✅ FIXED** (Chris approved all 6 in-thread, follow-up commit):
  `Geisha` ×2 / `Green-Tip Gesha` / `Gesha 1931` ×2 → `Gesha`; `JARC 74158` → `74158`;
  `Sidra Bourbon` → `Sidra, Bourbon (Blend)`. All added to the `displayVariety` override map.
- **Migration 073 + duplicate-brew DELETE — ✅ DONE** by Chris in the Supabase SQL Editor
  ("Success. No rows returned" on both).

**Six-actor audit (canonical rename):** Actor 6 registry+migration ✓ · Actor 5 varieties.md +
this doc ✓ · Actor 4 `read_canonical(cultivars)` serves the registry (no Tool-schema change;
count unchanged — rename not add) ✓ · Actors 2/3 aliases keep old slash forms resolving on write
✓ · Actor 1 cover + cultivar index show the new names ✓.

### Next-up sequencing (Chris-locked 2026-05-30)

The open buckets run **ONE PER SESSION, SEQUENTIALLY, in this fixed order** (Chris-locked
2026-05-30; `cleanup` bucket inserted 2026-05-30 after the data-audit session):

1. ~~**`data-audit`**~~ ✅ SHIPPED 2026-05-30 (PR #322; see "Data-audit session outcomes" above)
2. ~~**`naming`**~~ ✅ SHIPPED 2026-05-30 (see "Naming session outcomes" above)
3. ~~**`cleanup`**~~ ✅ SHIPPED 2026-05-30 (see "Cleanup session outcomes" above)
4. ~~**`data-model`** (pour-structure)~~ ✅ SHIPPED 2026-05-30 (migration 074; see "Data-model session outcomes" below)
5. ~~**`side-quest` MB-6**~~ ✅ SHIPPED 2026-05-30 (green index card grid; see "MB-6 session outcomes"). **Sequence complete — punch-list CLOSED.**

Each session ends by writing the kickoff brief for the next. Then a **product roadmap review /
brainstorm** is the explicit capstone *after all ship*. The deferred **/producers ·
/experiments · homepage** trio is NOT the next thing — it stays parked behind the roadmap review.

### Cleanup session outcomes (2026-05-30, session 3 of 5)

Shipped in one PR. Three "make it cleaner — mostly by *removing* things" index/card surfaces,
all page-local render-layer polish (no data work). Capture-first: Chris pasted the specific case +
a screenshot per area; each change signed off before edit, autonomy applied only after.

- **BI-1 brew-card heights (reopen/residual of PR1 #317) — ✅ FIXED.** Root cause: `.who` (the
  paper foot) used `min-height`, so a 2-line producer (Ruarai Factory / Mama Cata Estate /
  Rigoberto & Luis Eduardo Herrera) *grew* the foot and shifted the face/foot seam — colored
  covers misaligned within a row — and the grid had no cross-row equalization. Fix = `.who` →
  **fixed `height: 86px`** (seam locked at one vertical position; 2-line producers fit, shorter
  feet center with cover negative space — the "negative space is fine" call) + **`auto-rows-fr`**
  on the [brews/page.tsx](<app/(app)/brews/page.tsx>) grid (every row matches the tallest →
  all cards identical height across the whole grid). Verified: 1 distinct card height (260) + 1
  distinct face height (174) + 0 clipped feet across all 88 cards @1024; 248/162/0 @390.
- **CI-1 cultivar tree declutter — ✅ FIXED.** The deployed index IS the `├└│` tree (CI-1 shipped
  PR1 #317 — the kickoff-brief caveat that it was the grl grouped-row list was stale; confirmed
  via Chris's screenshot). Branch rows (species / family / lineage — the non-clickable nodes) now
  **drop the swatch + count + 5-block dial entirely** (grid → `auto 1fr`), rendering connector +
  label flush to the spine; only clickable cultivar leaves keep the dial. Whole spine **nudged
  ~1px larger** (name 12→13px, species 11→12px, conn 12→13px, swatch 9→10px, row pad 3→4px) so it
  reads at a weight closer to the other indexes. [cultivars/page.tsx](<app/(app)/cultivars/page.tsx>)
  render gate + `.cultivar-tree` CSS. `/simplify` then removed the now-dead branch count reduces
  (`spCount`/`famCount`/`linCount`) + branch `color` (branch rows carry `count: 0` / `color: null`).
- **Terroir row meta (climate-clause removal — new this session, distinct from TI-1's tick
  scale) — ✅ FIXED.** Dropped the climate-stress clause + its ` · ` dot from `terroirMeta` in
  [terroirs/page.tsx](<app/(app)/terroirs/page.tsx>) — country header + macro name +
  elevation is the clean set.

**Verified**: tsc clean (worktree node_modules symlink trick); previewed all 3 surfaces @1024 +
390 (uniform card heights with no clipping, decluttered cultivar spine, terroir climate gone).
**Six-actor**: render-layer only (Actor 6 UI + Actor 5 docs: this outcomes block + shipped.md row);
Actors 1-4 no-op.

**Retro (what surprised us / carry forward):**
- **The kickoff-brief history caveat was stale, the screenshot resolved it instantly.** The brief
  warned the cultivar index might still be the grl grouped-row list (Sprint 6 PR2) rather than the
  `├└│` tree; Chris's first screenshot showed the tree is deployed (CI-1 shipped PR1 #317). Trust
  the live screenshot over the brief's reconstructed history — the capture-first paste settled it
  before any wrong-target editing.
- **`min-height` on an equal-height card foot is a latent seam bug.** A foot sized with
  `min-height` silently grows on long content and breaks the face/foot alignment the equal-height
  work was supposed to guarantee — the original BI-1 fix (PR1) used `min-height` and that's exactly
  why it reopened. Fixed-height + `auto-rows-fr` is the actual equal-height primitive; `min-height`
  only equalizes the floor, not the seam.
- **Measuring uniformity with `getBoundingClientRect` (distinct-height set + clipped-foot count)
  beats eyeballing screenshots** for "are these all the same height" — caught the all-88-uniform
  proof + zero-clip guarantee a screenshot can only suggest.

- **`data-model` pour-structure bug kickoff:** Chris will do a **full audio readout** of several
  recipes — deliberately spanning **complex and simplistic** pour structures — to kick it off
  (same capture-first pattern that made WC-2 land right). Do NOT start implementing the parser
  fix before that audio lands; the storage-shape decision depends on seeing the real range of
  pour structures he describes. Treat it as a grilling/spec session first, build second.

### Retro (what surprised us / what we'd carry forward)
- **The single biggest lesson: capture-first paid off enormously.** WC-2 looked like a 2-row
  swap from the written note; Chris's *audio* recount of two live cuppings revealed it was a
  full reshape (mobile-is-the-target, demote taste-for + primary-question, batch numbers in
  labels). Had we implemented off the written note we'd have built the wrong thing. Audio on
  interpretive UI work is load-bearing — ask for it.
- **Stale `preview_logs` bit twice.** A mid-edit JSX parse error stays in the dev-server stderr
  buffer after the fix; `preview_logs --level error` showed a PR1 error during PR2. Confirm
  staleness by actually fetching the route (200 + expected content) rather than trusting the log.
- **The worktree `--delete-branch` "error" on merge is benign** — `gh pr merge` tries to check
  out main, which the sibling worktree holds; the squash-merge itself succeeds. Don't chase it.
- **Eval double-toggle.** Driving disclosure/popover state via repeated `preview_eval` clicks
  races itself (each call re-toggles). Drive with single clicks + check state between, or do the
  whole open-sequence in one eval.

Capture-first review session. No app edits until the punch-list is complete (desktop + mobile)
and the batching is approved. Several items are open decisions or belong to separate sessions
(data audits / data-model / naming) — flagged inline.

### Data-model session outcomes (2026-05-30, session 4 of 5)

Shipped in one PR. Spec/grilling first, build second — opened with Chris's full audio readout of
his real bench flow + 7 claude.ai recipe cards + 3 raw DB rows, so the storage-shape call was made
against the real range (capture-first, the WC-2 pattern). The shape was an interpretive call Chris
signed off via AskUserQuestion *before* any file edit; autonomy applied only to the build after.

- **BS-1 pour-structure — ✅ FIXED via structured `brews.pours` jsonb (migration 074).** Root cause
  was a missing **write contract**, not a parser bug: claude.ai wrote a different free-text format
  every brew (`;`-delimited clean / prose paragraph / "Phase N" / "Steep N"), so the parser was
  chasing an uncontracted writer — plus the page double-counted bloom (prepended `brew.bloom` AND
  the `pour_structure` text restating it). The 3 raw rows proved each failure mode: Apricoast +
  Ruarai double-bloom, Ruarai "manual lever-staged immersion" meta + "no Melodrip…" footer leaking
  as pours, El Placer 2-phase collapsing to 1.
- **Storage call (Chris-locked):** **B-light + Hybrid.** Structured `pours` array forward (claude.ai
  writes via `push_brew`); parser kept as read-fallback for legacy NULL-`pours` rows; hand-backfill
  only the 6 BS-1 brews + lock-reference recipes (no lossy mass-parse). Rejected: Option A
  (parser-only — the evidence killed it) and B-heavy (the brainstorm md's nested
  valve.transition/drain/pattern/agitation objects — Chris's "way too overkill").
- **`PourStep` shape:** six flat keys, no nesting — `{type:"bloom"|"pour", at, to_g?, pour_s?,
  hold_s?, valve?, detail?}`. bloom index 0 (kills double-bloom); `at` required (kills `·`); only
  typed steps render (meta/footer → `strategy_notes`); valve transitions / drain-reclose / kettle
  stance = prose in `detail`, NOT typed (the (a)-(d) grilling-queue Item 39 calls, all resolved
  toward lean); valve = free-text + SWORKS vocab, not a strict enum.
- **Verified:** all 6 BS-1 brews render correctly @1024 + 390 via a seeded render proof (structured
  branch + `pourTimelineRows`), legacy fallback unbroken, tsc clean, console clean. The 6 backfill
  `pours` arrays are built + ready as `patch_brew` payloads.
- **Six-actor:** A6 migration 074 + `lib/types.ts` + render seam ✓ · A4 `push_brew`/`patch_brew`
  Zod + descriptions + `brews.ts` RECENT_SELECT + `cleanPours` in persist/patch ✓ · A2
  `bundled-brewing-completion.md` § "Pour structure" write contract + close-lot / one-shot-closeout
  pointers ✓ · A3 catalog refresh on next claude.ai session (post-deploy) · A5 CLAUDE.md § Brews
  (superseded the "don't change the storage shape" note) + SWORKS bullet + grilling-queue Item 39
  closed ✓ · A1 rendered recipes read right ✓. Drained **grilling-queue Item 39**.
- **⚠ Handed to Chris (not auto-done):** **apply migration 074** in the Supabase SQL Editor (072/073
  precedent), then the 6-brew `pours` backfill runs via `patch_brew` post-deploy (it needs the
  column + deployed Tool schema). The structured render then lights up on real data.
- **Deferred:** the `total_time` 4:15-vs-real-~3:15 mismatch Chris flagged on Ruarai is a per-brew
  data point, not schema — left untouched (changing recorded tasting data isn't this sprint's call).
  CONTEXT-brewing `Pour step` glossary term waits for the next grill (CONTEXT grows grilling-first).

**Retro (what surprised us / carry forward):**
- **Capture-first earned its keep again, exactly as predicted.** The written punch-list framed BS-1
  as "the parser is buggy." The audio + the 7 cards reframed it as "there is no write contract" —
  a different fix entirely (the lever is the *writer*, not the *reader*). Pulling the 3 raw rows
  turned that into proof: the parser was working as designed against input it could never win.
- **The worktree/prod boundary makes "verify the fix on real data" a post-deploy step.** The dev
  server reads prod Supabase, which won't have the `pours` column until Chris applies 074, and
  `patch_brew` can't write `pours` until the code deploys — so in-session verification is a seeded
  render proof, and the real-data backfill is gated behind the merge + SQL-apply. Same shape as the
  072/073 cultivar migrations. Be explicit about it rather than pretending the loop closed.
- **A "lean structured" middle beat both poles cleanly.** The brainstorm md (which Chris commissioned)
  leaned toward a heavy nested schema; pure parser-fix was the other pole. The signed-off answer was
  neither — flat six-key objects with prose in `detail` — and it satisfied every stated constraint
  (don't-overcomplicate + line-readable + kills the parse-ambiguity class). When the user's own
  brainstorm over-specifies, the move is still to grill it down to what the render + a real query
  actually need.

### MB-6 session outcomes (2026-05-30, session 5 of 5 — FINAL)

Shipped in one PR. **Capture-first** — did NOT design the card cold; built to Chris's mock + his
answers (lifecycle sections survive · mobile collapses to 1 tile · grid-cols my call). The v2 §04
lot-card grid that Redesign Sprint 6 PR1 deliberately rejected is now adopted, but **grouped by
lifecycle state** rather than flattened with experiment-frame payload — the rejection's concern
(experiment payload on the face) was avoided.

- **What shipped:** new `components/GreenCard.tsx` (presentational, state-dependent face/foot) +
  a `buildCardData(bean, state)` builder + `composeTally`/`formatVLabel`/`pickRefBrew` helpers in
  `app/(app)/green/page.tsx` + `.green-card` in `globals.css`. Page widened `max-w-3xl` →
  `max-w-6xl`; each lifecycle section renders a `grid-cols-1 sm:2 lg:3 gap-2.5` card grid under
  its `<LotStage>` header (sections + headers preserved).
- **Card face (per state):** big mono lot name + top-right pill (active: `V2`/`V3` via
  `formatVLabel(latest experiment)` or `ONE-SHOT` when `is_one_shot`; archive: reference batch
  `#187`) + a bottom line — `origin · variety · process` on active lots, the reference/leading
  brew's flavor notes on archive lots. Face bg = the per-state `--tile-*` color.
- **Card foot:** lot code (`lot_id`) on active lots; `Reference: Batch #N` /
  `Leading Candidate: Batch #N` + `N V-Sets · N Roasts · N Cuppings` (or `One-Shot Lot`) on
  archive lots.
- **No schema work.** The reference/leading brew was already reachable end-to-end:
  `best_roast_id` → the brew with `roast_id = best_roast_id` (`pickRefBrew`, mirroring the resolved
  detail page's `pickOptimizedBrew`). The multi-brew-per-lot case Chris raised (a lot can have
  several brews; only the reference-roast brew is canonical) is handled by the FK-match-first pick
  — confirmed on CGLE Sudan Rume Natural. The broader "explicitly designate the lot's reference
  drinking brew" affordance stays the parked **MB-7 / attach-resolved-brew** roadmap item.
- **Correctness win:** the reference batch derives from `best_roast_id → roasts.batch_id`
  (authoritative) with `best_batch_id` fallback, fixing the stale free-text `best_batch_id` the
  old flat `<GrlRow>` list rendered directly (CGLE Sudan Rume Natural showed #185; the real
  reference roast is batch 187, `is_reference=true`). No regression: lots whose `best_roast_id` is
  null fall back to `best_batch_id` exactly as the old list did.
- **`/simplify` (4-agent pass):** banked the `pickLatestExperiment` lib-export reuse (manual
  pre-pass; Reuse agent confirmed correct). Skipped, with reason: `pickRefBrew`/`getReferenceBatch`
  extraction + `.green-card`/`.brew-card` base class — the actual dedup targets are twins in the
  2000-line detail page + `BrewCard` (outside the reviewed diff); extraction without rewiring those
  is a lateral move. `formatVLabel` kept local (detail returns `V?` on null, index returns null —
  different contracts). `ARCHIVE_STATES`/`isArchive` inline + `composeTally` single-pass — agents
  judged current form clearer / negligible.
- **Six-actor:** render-layer only — Actor 6 (UI: GreenCard + page + CSS) + Actor 5 (docs:
  CLAUDE.md § Green Index, this block, shipped.md). Actors 1-4 no-op (no MCP / prompt / schema /
  claude.ai changes).
- **Flagged + spun off → ✅ INVESTIGATED 2026-05-31, NOT A DATA BUG.** The flag was "Higuito +
  GUA Libertad both surface `#185`." DB check across all 9 closed lots: every lot's FK-derived
  reference batch (`best_roast_id → roasts.batch_id`) agrees with its `best_batch_id`, and every
  reference batch number is globally unique. Higuito = **185** (correct, sole owner of batch 185
  globally); GUA Libertad = **94** (its roasts run 33→94, no batch 185 exists in the lot). No
  collision, no drift, no patch. The real "second #185" lot was **CGLE Sudan Rume Natural** —
  whose `best_batch_id` historically read "185" (per the code comment) but has since been corrected
  to **187**; the old flat list reading `best_batch_id` directly showed both as #185. GUA Libertad
  was a mis-ID in the original flag. Cleanup: refreshed the now-stale "drifted to 185" code comment
  in [green/page.tsx](../../app/(app)/green/page.tsx) to past tense ("once said 185 … since
  corrected").
- **Verified:** tsc clean (symlink trick) + `npm run build` green; previewed `/green` @1024
  (3 columns) + 390 (1 tile). DOM-inspected all 14 cards via `preview_eval` across the 4 lifecycle
  sections — pills (`V2`/`ONE-SHOT`/`V3`/`#187`/`#133`/`#179`), identity vs flavor bottom lines,
  active vs archive feet, and the #187 fix all confirmed; brew `723984cc`'s `flavor_notes` matched
  the mock exactly.

**Retro (what surprised us / carry forward):**
- **Capture-first held again.** The brief framed MB-6 as a "card-treatment tweak"; Chris's mock
  revealed it's a full `/green` migration with *state-dependent* card content (active = identity +
  lot code; archive = flavor notes + reference batch + V-set tally) — a different build than a
  uniform card. Designing cold would have produced a flat brew-card clone that didn't fit a green
  lot's data model.
- **The redesign already had the data path; the card just surfaced it.** No schema work was needed
  because the resolved detail page (`pickOptimizedBrew`) had already proven the `best_roast_id` →
  brew linkage. The card reused that exact pattern. Worth checking the detail page first whenever
  an index wants to surface a relationship the detail view already renders.
- **The #185/#187 drift was caught by deriving from the FK, not the text field.** Building the card
  off `best_roast_id → roasts.batch_id` (rather than copying the old list's `best_batch_id` read)
  surfaced that the free-text field had drifted on at least one lot — a correctness improvement that
  fell out of choosing the authoritative source.

## Legend

- **type**: `polish` (clear design fix, batchable) · `decision` (needs Chris call) ·
  `data-audit` (separate audit session) · `data-model` (broader sprint, e.g. pour structure) ·
  `naming` (abbreviation/label cleanup, candidate for own sprint)
- **scope**: `page-local` vs `shared-primitive` (shared = fixing once fixes N surfaces)

---

## Recurring themes (highest leverage — fix once, propagates)

- **T-A · Representation tick scale** (`polish`, shared-primitive) — the 5-block bar on the
  index pages currently normalizes relative to the page-max (`barBlocks(count, max)` in
  `components/IndexList.tsx`). Chris wants **absolute, fixed thresholds** so bars mean the same
  thing across every index. Flagged on Terroir / Cultivar / Roaster indexes; applies to all grl
  indexes (also Processes modifier/signature rows). Proposed scale (de-overlapped from Chris's
  dictation): `1→1 · 2-3→2 · 4-5→3 · 6-7→4 · 8+→5`. **Open: confirm boundaries** (his dictated
  set overlapped: 1-2 / 2-4 / 4-6 / 6-8 / 8+).
- **T-B · Green state-card corner badge reads as an artifact** (`polish`, shared-primitive) —
  the `.ssp-corner` chip (e.g. "V2", "BATCH #179 · LEADING") floats top-right and has faint
  **background text behind it** ("DEV" / "RECIPE"). Chris: on waiting-for-roast "get rid of the
  top-right V2 box, seems like an artifact"; on unresolved "right-adjust that and get rid of the
  background text." Seen on a handful of sub-pages. Fix: remove the background/ghost text, clean
  up or drop the corner chip. **Open: drop the corner entirely vs keep a clean right-aligned
  chip?**
- **T-C · Collapsible section-header alignment is inconsistent** (`polish`, shared-primitive) —
  across green views the collapsible headers mix left- and right-adjusted meta+chevron. Some put
  the count next to the title ("EXPERIMENT FRAME · V2 ▾", "ROAST LOG · 3 ROASTS ▾"), others
  right-adjust it ("PER-ROAST REFLECTIONS … 3 POPULATED ▾", "ADDITIONAL INFORMATION … FULL
  HISTORY RENDERS ON THE RESOLVED VIEW ▾"). Chris: make all consistent, **right-adjust
  everything**. Root: `CollapsibleSection` / `.ssp-coll` summary layout + how each green view
  passes meta.

---

## Brew Index (`/brews`)

- **BI-1 · Inconsistent card heights** (`polish`, shared-primitive: `components/BrewCard.tsx`)
  — cards should be uniform height for BOTH the colored cover face AND the white producer foot.
  Longer producer info should size the whole grid's cards up to match, not stretch one card.
  Chris: a little negative space inside containers is fine — prefer consistent over per-card
  resizing. Mockup provided (equal-height grid). Fix: equalize card height (flex column +
  min-height / grid auto-rows; foot grows to fill).
- **BI-2 · Tag/abbreviation/naming cleanup** (`naming` — Chris OK to punt to its own sprint)
  — long titles on covers. Examples he called out:
  - "Dark Room Dried" → **DRD** acronym (Mokkita; Sidra)
  - "El Placer (Farm)" → drop "(Farm)" → "El Placer"
  - "Ethiopian Landrace Population" → "Ethiopian Landrace" (drop "Population")
  - "Generic Honey" → "Honey"
  - "Ethiopian Landrace Blend 74110/74112" → "Ethiopian Landrace Blend" (drop numbers)
  - "Catimor (group)" → "Catimor"
  - "Bourbon Caturra (field blend)" → "Bourbon Caturra blend"
  - "Red Bourbon / Mibirizi blend" → "Red Bourbon, Mibirizi blend"
  - "74158 [dark listing]" → "74158"
  - "Gesha Panama lineage Washed" → "Gesha"
  - "Laurina (Bourbon Pointu)" → "Laurina"
  - "Ethiopian landraces (JARC 74110, 74112)" / "(74158, 74110, 74112)" → "Ethiopian landraces blend"
  - Overflow handling with "…" is good — keep it.
  - **Needs a standard blend-naming convention** (broader than the index).
  - **Heritage Collection Natural** → Chris suspects "Heritage" isn't actually the variety →
    `data-audit` item (verify variety).

## Brew Sub-Pages (`/brews/[id]`)

- **BS-1 · Pour-structure rendering is wrong on multiple brews** — ✅ **FIXED (data-model session
  2026-05-30, migration 074).** Root cause was structural, not a parser tweak: claude.ai wrote a
  different free-text format every brew (`;`-delimited vs prose paragraph vs "Phase N"/"Steep N"),
  so the parser was chasing an uncontracted writer — and the page double-counted bloom (prepended
  `brew.bloom` AND the `pour_structure` text restating it). Fix = structured `brews.pours` jsonb
  (bloom index 0, `at` required, only typed steps render) written by claude.ai via `push_brew`,
  parser kept as legacy read-fallback. All 6 verified @1024+390 (seeded render proof — backfill is
  a post-deploy `patch_brew` step gated on migration 074 apply). See "Data-model session outcomes"
  below. The original symptom set (kept for the record):
  - [2026 Ruarai AA Separation](https://www.latentcoffee.com/brews/da937ce6-2877-4436-84f4-8191d93e5528)
    — timeline shows `0:00 Bloom` → `· Pour 1` (no start time) → `~3:00 Bloom` (should be the
    second POUR, not "Bloom" again). Also **no producer listed** (`data-audit`; Chris will supply).
  - [Garrido Mokkita Cold Room](https://www.latentcoffee.com/brews/7ad09c9b-35c3-4635-88eb-248bb38b42bc)
    — cleaner (`0:00`/`0:50`/`1:40`) but Pour 3 starts at "·" because it's a 2-pour recipe with a
    dial change at the end of pour 2.
  - [Release 056 - El Placer](https://www.latentcoffee.com/brews/71c1d610-5a13-4dbc-ad73-cb211a455f0f)
    — 2-pour brew showing only 1 pour (Pours 3/4 are "Office tap water" / "Kettle on base
    throughout" with "·" times). Also filter label "CAFEC Abaca+ Cup 4 Cone Paper Filter" →
    **"CAFEC Abaca+ Cone"** (`naming`; displayName now set per 2026-06-04 reconciliation).
  - [Ethiopia Heirloom Cold Room Natural](https://www.latentcoffee.com/brews/0d93118c-555e-4778-905f-17d166e33a8f)
    — pour structure not represented correctly.
  - [Altieri Gesha CHOMBI Natural Dry Fermentation](https://www.latentcoffee.com/brews/4fc7e914-095d-4d1e-9af6-3a6c7c556c9b)
    — pour structure all off.
  - [Apricoast](https://www.latentcoffee.com/brews/53c552ec-3046-4090-a6ec-4e9dba14c523)
    — showing two blooms (pour-structure data). Also filter "CAFEC T-92 - Cup 4 Light Roast Paper
    Filter" → **"CAFEC T-92"** (`naming`).

## Terroir Index (`/terroirs`)

- **TI-1 · Representation tick scale** → see **T-A**. Otherwise good.

## Terroir Sub-Pages — ✅ no comments, good.

## Cultivar Index (`/cultivars`)

- **CI-1 · Lineage spline / genealogical tree** (`decision`) — Chris likes the lineage spline
  text-tree from the original redesign mock (├ └ genealogy, "LINEAGES MAPPED · N LINEAGES · N
  FAMILIES · N BREWS"). Current deployed cultivar index uses the grl grouped-row list (lineage as
  indented sub-label) per Sprint 6 PR2. He's asking: is the tree worth bringing back, knowing it'd
  be different from the other index pages? **Decision needed: keep grouped rows, or adopt the
  tree spline (and accept the cultivar index being a one-off shape).**
- **CI-2 · Representation tick scale** → see **T-A**.

## Cultivar Sub-Pages — ✅ good, no comments.

## Processes Index — ✅ good, no comments. (Tick scale T-A still applies to its grl rows.)
## Processes Sub-Pages — ✅ good, no comments.

## Roaster Index (`/roasters`)

- **RI-1 · Representation tick scale** → see **T-A**. Otherwise good.

## Roasters Sub-Pages — ✅ good.

## Green Bean Index (`/green`)

- **GI-1 · Design good; data wrong** (`data-audit`, separate session per Chris) — these lots
  should all be resolved but aren't rendering that way: Costa Rica Anaerobic Dry Process Higuito ·
  CGLE Sudan Rume Natural · Gesha Village Oma (Lot 25/035) · Guatemala Libertad (Aurelio del
  Cerro) · Guatemala El Socorro (Java variety). Needs a quick lifecycle-state audit.

## Green — Waiting-for-next-roast (`/green/[id]`)

[Fazenda Um - Wush Wush Natural DRD](https://www.latentcoffee.com/green/038ef36d-0b9f-4630-be61-eec176694910)

- **WR-1 · Top-right "V2" corner box is an artifact** → see **T-B**.
- **WR-2 · Primary-question block has two different fonts** (`decision`/`polish`) — the sans
  primary-question prose is followed by a smaller mono paragraph ("V1 leading slot v1a (Batch
  173)…"). These are two different fields: `experiments.primary_question` (the `.ssp-question`)
  + the anchor line from `experiments.control_baseline` (the `.ssp-anchor-line`). Chris asks if
  they're the same field. **Decision: label the second one (e.g. an "Anchor / V1 reference"
  caption) or unify the type so it doesn't read as a font glitch.**
- **WR-3 · Hypothesis collapsible field + drop-temp/drop-rules** — ✅ liked, "exactly what I was
  looking for." No action.
- **WR-4 · Collapsible header alignment inconsistent** → see **T-C**.

## Green — Waiting-for-next-cupping (`/green/[id]`)

[El Paraiso Red Plum Castillo](https://www.latentcoffee.com/green/be477009-20ca-4b7f-acbc-71c089e16117)

- **WC-1 · Text overflow** (`polish`, page-local) — the transposed cupping table's V2C
  (right-most) column prose overflows its container. Fix: word-break / min-width / cell padding on
  `SspExpGrid` cells.
- **WC-2 · Reshape the cupping view to the actual cupping flow** (`polish`→`reshape`, page-local)
  — **REFINED via Chris's 2026-05-30 audio note (recounting two live cuppings that morning).**
  The headline: the **mobile stack layout IS the target for desktop too** — "the mobile one has
  actually done much better than the desktop one... I typically do this while I'm on my phone."
  So collapse the Sprint-2 dual-subtree into ONE canonical layout = the mobile composition.

  **Cupping priority order (Chris's literal mental model at the table):**
  1. **Producer notes** — the benchmark, top/foreground ("taste against this").
  2. **Predicted Cup given roast actuals** — per-slot, THE primary read before each sip. "It only
     matters how it actually went in reality, not how we thought it would go."
  3. *(far secondary)* Previous leading slot cup memory — "nice to have," dense, hard to parse.
  4. *(tertiary)* Roast Actuals — "not actively staring at this while drinking"; vs-Expected
     prose collapses by default (= WC-3).
  5. *(very tertiary)* Taste-for cupping-table question — "didn't happen, so I'd rather go for
     actuals." Demote out of the foreground.
  6. Primary Question — lot-level framing, not read during cupping. Demote.

  **Target layout (single tree, both breakpoints):**
  - **CUPPING card:** Producer notes ("taste against this") → per-slot stack cards, each = slot
    label **with batch number** (`V3A · #190` — Chris explicitly asked; mirror the Roast Actuals
    `slot · #batch` format) + **Predicted Cup** as the card's primary content.
  - Previous-leading-cup + Taste-for + Primary Question → a collapsed tertiary disclosure below.
  - **ROAST ACTUALS card** stays below; the long `vs Expected` prose row collapses by default.
  - Desktop: slot cards MAY go side-by-side (3-col) for comparison ("comparatively from 190 to
    191, how is 192 reading") via a container-query grid on the slot row — ONE content def, not a
    second DOM subtree. (Open Q below.)

  **This supersedes:** Bundle-B's 2-row transposed table (Taste-for/Predicted-Cup) AND the
  Sprint-2 `.s2-desktop`/`.s2-mobile` dual-subtree. Both are intentionally retired here — the
  retire is the point, not a regression. WC-1 (table overflow) dissolves with the table.

  **Build decisions (Chris-locked 2026-05-30, follow-up):**
  - Desktop slot cards **side-by-side** (3-col container-query grid); mobile stacks. One content
    def, not a second subtree.
  - Tertiary content → **one collapsed "Reference & detail" drawer** (prior-leading-cup +
    taste-for + primary-question together).
  - Prior-leading-cup density → **just collapse as-is**; the rewrite is a DATA/content problem
    (how claude.ai writes `observed_outcome_*`), punted to the `naming`/`data` bucket — NOT this PR.

- **WC-2b · Batch number in slot labels** — slot cards/columns label as `V3A · #190` not bare
  `V3A`; Chris navigates by roast number, not V-slot. Data already on `info.roast.batch_id` /
  `info.declaredBatchId` (Roast Actuals already composes this).
- **WC-3 · "Roast Actuals" vs-Expected cells should collapse by default** (`polish`, page-local)
  — section is liked; the long "vs Expected" prose per column should be a collapsible like the
  hypothesis collapsible. Collapse by default.
- **WC-4 · Collapsible arrows right-adjust / consistent** → see **T-C**.
- **WC-5 · "Previous leading slot cup" heading is absurdly long** (`polish`, page-local) — on
  [Gesha Clouds - Forest](https://www.latentcoffee.com/green/0f6e1e49-e7d6-41fc-8754-be249fbe4349)
  the label column renders the full derived string (experiment_id + V2C + caveats prose) as the
  *label*. Fix: the label should be a short fixed caption; the prose belongs in the value column.

## Green — Resolved Lot Page — ✅ good, liked, no comments.

## Green — Unresolved Lot Page (`/green/[id]`)

[Rancho Tio Emilio - Typica Mejorado Washed](https://www.latentcoffee.com/green/b0c57fd5-2a43-46b4-9cf8-197ec97bd6ab)

- **UR-1 · "LEADING ROAST" corner chip floats above heading + has background text** → see
  **T-B**. ("BATCH #179 · LEADING" chip top-right with ghost "RECIPE" text behind.)
- **UR-2** — otherwise good.

## Green — In-inventory (direct URL) — not walked in this pass.

---

## MOBILE PASS (390) — additional items only

Chris's mobile pass was light. Desktop items all still apply on mobile; these are net-new.

- **MB-1 · Roaster filter popover clips names on mobile** (`polish`, page-local:
  `components/BrewsFilterBar.tsx` + `FilterPopover`) — on `/brews` mobile, opening the ROASTER
  filter popover pushes its left edge off-screen so every option's first chars are clipped
  ("olibri" = Colibri, "ongzhe" = Dongzhe, "ower Child" = Flower Child, "oonwake" = Moonwake,
  etc.). The popover anchors `right-0 md:left-0` with `max-w-[calc(100vw-3rem)]`; on a narrow
  viewport the right-anchor + max-width is letting content overflow its left edge. Fix: clamp the
  popover to the viewport (left/right inset + `overflow` so the text column starts on-screen).
  Chris otherwise loves the brew index on mobile.
- **MB-2 · /brews/[id] mobile** — ✅ "design wise mobile brew pages look great." (Pour-structure
  data bug from BS-1 still applies — already logged as `data-model`.)
- **MB-3 · Cultivar / Terroir / Processes indexes + sub-pages on mobile** — ✅ all good.
- **MB-4 · Waiting-for-cupping mobile** ([El Paraiso Red Plum Castillo](https://www.latentcoffee.com/green/be477009-20ca-4b7f-acbc-71c089e16117))
  — ✅ "I like this one a lot - this is perfect." (The s2-mobile dual-subtree from Redesign
  Sprint 2 lands well.)
- **MB-5 · Bourbon cultivar is a skeleton page** (`data-audit`, NOT a mobile issue — Chris
  flagged it here) — [Bourbon](https://www.latentcoffee.com/cultivars/ddfce7fc-4595-41f9-9ee4-a788af8a792b)
  renders as a skeleton/empty page but should have full data. → folds into the `data-audit`
  bucket alongside GI-1.
- **MB-6 · Green index mobile = brew-card treatment** (`side-quest`) — ✅ **SHIPPED 2026-05-30.**
  `/green` migrated to a BrewCard-style lifecycle-sectioned card grid (Chris mocked the shape; the
  card-cold design was deliberately NOT attempted before the mock landed). The open question —
  does the lifecycle-list IA survive inside cards? — resolved **yes**: the 4 lifecycle sections
  are preserved, cards grouped under each. See "MB-6 session outcomes" above.

---

## FINAL batching (mobile pass folded in — ready to build)

- **PR 1 — Shared-primitive + index polish.** Highest leverage; touches every index + every
  green view at once.
  - T-A tick scale (absolute) — `components/IndexList.tsx` `barBlocks` + drop `max` threading
  - T-B corner badge — `.ssp-corner` ghost-text removal + right-align (`Ssp.tsx` / globals.css)
  - T-C collapsible header alignment (right-adjust all) — `CollapsibleSection` / `.ssp-coll`
  - BI-1 brew-card equal heights — `components/BrewCard.tsx`
  - MB-1 roaster filter popover clip on mobile — `components/BrewsFilterBar.tsx` / `FilterPopover`
  - CI-1 cultivar tree spline (sequenced LAST; split off if fiddly) — `cultivars/page.tsx` + CSS
- **PR 2 — Green page-local polish.** All in `app/(app)/green/[id]/page.tsx` + green view
  components.
  - WC-1 cupping table overflow
  - WC-2 cupping section reorder (verify vs Bundle-B IA first)
  - WC-3 vs-Expected collapse-by-default
  - WC-5 "Previous leading slot cup" long-label fix
  - WR-2 primary-question anchor-line labeling
- **Punt (separate sessions, NOT this polish round):**
  - `naming` — BI-2 abbreviations + blend-naming convention + filter-label shortening (BS-1
    filter sub-items). Own sprint per Chris.
  - `data-audit` — GI-1 unresolved lots, BS-1 Ruarai missing producer, BI-2 Heritage variety,
    MB-5 Bourbon skeleton page.
  - `data-model` — BS-1 pour-structure parsing/storage (the recurring "two blooms / missing
    pour / · time" bug across 6 brews). Broader than polish; **highest-priority functional
    follow-up after this round.**
  - `side-quest` — MB-6 green index card treatment (Chris will mock; explicitly optional).

## Decisions — LOCKED (Chris, 2026-05-30)

1. **T-A · tick scale** → ✅ **absolute thresholds**, switching off relative-to-page-max.
   Scale: `1→1 · 2-3→2 · 4-5→3 · 6-7→4 · 8+→5`. Change `barBlocks(count, max)` in
   `components/IndexList.tsx` to a `barBlocks(count)` absolute mapping; drop the `max` prop
   threading from all 4 aggregation index callers.
2. **T-B · corner badge** → ✅ **keep a clean right-aligned chip**; remove ONLY the ghost
   background text. Applies to `.ssp-corner` on all green state cards.
3. **CI-1 · cultivar tree spline** → ✅ **build it now, in PR1, sequenced last.** ~1-2 hrs —
   data tree already built in `cultivars/page.tsx`; pure render swap to `├ └ │` connectors +
   spline CSS. Chris: "take a stab at it now, split off if it gets fiddly, iterate as needed."
   Becomes the one index not using `GrlRow` (accepted one-off).
4. **WC-2 · cupping reorder** → still need to confirm it doesn't conflict with the locked
   Bundle-B cupping IA. Verify against `app/(app)/green/[id]/page.tsx` cupping view + the
   redesign Sprint 2 notes before implementing PR2.

## Remaining open item

- **WC-2** — cross-check the requested reorder (Reference Signals above the V2A/B/C table;
  Predicted-Cup above Taste-for inside the table) against the Bundle-B locked 2-row order so we
  don't re-introduce something a prior sprint deliberately removed. Resolve at PR2 build time.
