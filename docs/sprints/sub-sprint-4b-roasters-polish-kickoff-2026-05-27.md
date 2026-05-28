# Sub-sprint 4b — Roasters polish bundle — kickoff 2026-05-27

**Series**: Read-path surface polish series (PRODUCT.md § Active Sprints #4) — second sub-sprint, opened immediately after Sub-sprint 4a (Green-bean polish) closed 2026-05-27 (5 PRs: [#274](https://github.com/chrismccann-dev/latent-coffee/pull/274) Bundle A / [#275](https://github.com/chrismccann-dev/latent-coffee/pull/275) Bundle D / [#276](https://github.com/chrismccann-dev/latent-coffee/pull/276) Bundle B / [#277](https://github.com/chrismccann-dev/latent-coffee/pull/277) substrate docs / [#279](https://github.com/chrismccann-dev/latent-coffee/pull/279) Bundle C).

## Why roasters is next

Per Chris audio 2026-05-26: "I usually remember [a coffee] roaster first, so I usually go to the roasting page." Second most-visited surface after green beans. Sub Pages 5 (2026-05-11) already surfaced 24 RoasterEntry fields in a 3-jobs reorder (brew guide / roasting philosophy / specific coffee recall) — the polish sprint is lived-use sharpening on that foundation, not substrate redesign.

## How this differs from 4a

| Dimension | 4a Green-bean | 4b Roasters |
|---|---|---|
| Pages | Index + detail with 5 state-dispatched view-shapes (waiting_for_next_roast / waiting_for_next_cupping / resolved / unresolved / in_inventory placeholder) | Index + detail (one shape) |
| Lines | 1936 in `[id]/page.tsx` alone | 337 in `[slug]/page.tsx` + 118 in `page.tsx` |
| Lifecycle state | Yes, derived helper | None |
| Major recent investment | Sub Pages 6 series (6.1-6.8 + Sub-sprint 4a) | Sub Pages 5 (2026-05-11) |
| Substrate touched | lifecycle helper + new view-shape + 3 mockups + 4 PRs | Likely 0-1 PRs of UI tweaks + maybe taxonomy drift cleanup |
| Sizing estimate | 1-2 stacked sprints (took 5 PRs in one session) | ~1 sprint, narrower; could plausibly be 2-3 PRs |

Bundle C of 4a was a prompt-edit micro-PR shipped same-day. 4b is unlikely to spawn a parallel "Bundle C" but the 3-phase audit structure still applies.

## ⚠️ NOT a planned-execution sprint

Same rule as 4a: **default mode = LISTEN, DO NOT EXECUTE.** The autonomy rule does NOT apply until you've done your audit + Claude's complementary pass + a bundled plan + ratified the open decisions. Treat as a grilling-shaped session per [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md).

**Failure mode to avoid**: opening the session, glancing at the radar items below, and starting to fix "Synthesis card positioning" because it looks mechanical. Wait for the full bundle.

## Process — 3 phases, strictly sequential

### Phase 1 — Chris's page-by-page audit (Chris-driven, single session likely sufficient)

Walk both pages line-by-line. Roasters is small enough that one focused pass should cover it.

**Pages to walk:**

1. **`/roasters` (index)** — `app/(app)/roasters/page.tsx`. 6 families (Clarity-First / Balanced / Extraction-Forward / System / Varies / Self-Roasted) → roaster name → brew count. Verify family swatches + grouping read correctly.
2. **`/roasters/[slug]` (detail)** — `app/(app)/roasters/[slug]/page.tsx`. 9 sections top-to-bottom:
   1. Hero — family-color swatch + roaster name + family/count/location subtitle
   2. Brewing Philosophy — Brew Guide + House Style + Brewing Intent (auto-renders when entry exists)
   3. Roasting Philosophy — Roast Style + Development Bias (auto-hides if both empty)
   4. Generalized Brewing Recipe — 2-col grid (primaryBrewer / extractionIntent / brewAdjustmentMethod / overExtractionTolerance + filterType / Baseline Recipe + processSensitivity / failureMode / Other Notes)
   5. Resting Info — `restCurve` (auto-hides if empty)
   6. Coffees I Have Brewed From This Roaster — brew list
   7. What I've Learned (synthesis card) — deliberately demoted below coffees list per Sub Pages 5 (your three-jobs framing)
   8. Additional Information — `<CollapsibleBlock>` containing Roaster Metadata + Common Flavor Notes + Cultivars + Terroirs + Processes Explored
   9. Confidence — dark card (HIGH ≥5 / MEDIUM ≥2 / LOW = 1)

**Walk every roaster you actually use.** 70 canonical roasters across 6 families post Roaster sprint 1h.1 (2026-04-24). At minimum walk: the ones you've brewed ≥3 from + Latent (self-roasted, structurally distinct). Sparse-registry roasters (Latent) should degrade gracefully via the auto-hide behavior — verify.

**For each surface, note:**
- **Info design** — is this the right data here?
- **UX design** — is anything front-and-center that should be demoted / vice versa?
- **IA** — does the section order match the three-jobs framing (brew prep / roasting context / specific coffee recall)?
- **Noise** — anything rendering that you never read?
- **Missing** — anything in `RoasterEntry` that's populated in the registry but doesn't render here?
- **Synthesis position** — Sub Pages 5 demoted the synthesis card below the coffees list. Has lived practice argued for/against?

**Format**: same as 4a — screenshot + annotation per section, organized by surface. Tags optional (`[info design]` / `[UX]` / `[IA]` / `[noise]` / `[missing]` / `[fine, keep]`). "Fine, keep" notes welcome.

**Handoff signal**: "OK that's my full audit pass" or equivalent. Until then, do not advance.

### Phase 2 — Claude's complementary pass (single session)

Same shape as 4a Phase 2. Output: a single doc at `docs/sprints/sub-sprint-4b-roasters-polish-complementary-pass-<date>.md` (mirror of 4a's complementary pass).

Categorization buckets (per 4a Phase 2):
- (A) Chris flagged this — agree, skip
- (B) Chris didn't flag — recommend adding
- (C) Chris flagged this — pushback / scope different
- (D) Cross-cutting pattern across multiple notes
- (E) Substrate gap (field exists, render missing or stale data)
- (F) Bug root cause (for a flagged bug)
- (G) Out-of-scope for polish — defer

Substrate cross-check checklist:
- `lib/roaster-registry.ts` — 70 canonicals + 24 aliases; verify all rendered fields are wired
- `docs/taxonomies/roasters.md` — authored content match against registry
- `RoasterEntry` shape — 29 CSV fields + `displayName?` + `bmrHouseStyle?` + `bmrNotes?`. Confirm every field has a render path.
- 6 family groupings via `STRATEGY_TAG_FAMILY` map — verify on-screen swatches match registry hue assignments
- Per-roaster synthesis cache — `roaster_syntheses` table keyed on (user_id, roaster)
- Cross-link tag blocks — Common Flavor Notes / Cultivars Explored / Terroirs Explored / Processes Explored — confirm tag links still resolve post Sub Pages 2-5 read-side reorganization

Handoff signal: Chris reads the complementary pass and approves / asks for revisions.

### Phase 3 — Bundled plan + plan-mode review

Same as 4a Phase 3. Group items into bundle-coherent PRs. For each bundle: scope + files + verification + sizing + risk. Surface decisions needing audio-confirm BEFORE implementation. Route through plan-mode `ExitPlanMode`.

Only after plan approval does code change.

## Audit surfaces (canonical list)

**Pages:**
- `app/(app)/roasters/page.tsx` (118 lines) — index
- `app/(app)/roasters/[slug]/page.tsx` (337 lines) — detail

**Reference docs:**
- [`lib/roaster-registry.ts`](../../lib/roaster-registry.ts) — `ROASTERS` array + `RoasterEntry` shape + family lookup
- [`docs/taxonomies/roasters.md`](../taxonomies/roasters.md) — authored content
- [`lib/synthesis/adapters/roaster.ts`](../../lib/synthesis/adapters/roaster.ts) — per-roaster synthesis prompt + RoasterEntry → anchor
- `roaster_syntheses` table — cache layer
- [`app/api/roasters/synthesize/route.ts`](../../app/api/roasters/synthesize/route.ts) — synthesis API

**Components likely in scope:**
- [`components/SectionCard.tsx`](../../components/SectionCard.tsx) — shared section chrome
- [`components/Tag.tsx`](../../components/Tag.tsx) + [`components/TagLinkList.tsx`](../../components/TagLinkList.tsx) — cross-link tag blocks
- [`components/CollapsibleBlock.tsx`](../../components/CollapsibleBlock.tsx) — Additional Information wrapper
- [`components/SynthesisCard.tsx`](../../components/SynthesisCard.tsx) — "What I've Learned" card
- [`components/FlavorNotesByFamily.tsx`](../../components/FlavorNotesByFamily.tsx) — Common Flavor Notes in Additional Info

## Known candidate items (radar, NOT implementation list)

These are on the radar going in. Chris may keep / drop / expand / merge.

### From PRODUCT.md § Sub-sprint 4b scope notes

- **Roaster index grouping + family swatches** — 6 families. Verify hue separation works on the actual roasters you visit most.
- **Roaster detail page surfaces** — info architecture review across the 9 sections.
- **Synthesis card positioning** — demoted below coffees list per Sub Pages 5. Revisit if lived practice argues otherwise.
- **24 RoasterEntry fields surfaced post-Sub-Pages-5** — any drift or new fields to surface.

### Previously in Side Quests, absorbed into 4b

- **Per-roaster archive page enhancement** — the framing that compounds with per-entity directed synthesis. Template for the eventual `/cultivars/[id]` + `/terroirs/[id]` + `/processes/[slug]` archive surfaces (4d / 4e / 4f).

### Cross-cutting questions Claude should pre-think

- **Tag-link block staleness** — `<TagLinkList>` on roasters detail shows Cultivars / Terroirs / Processes Explored. Confirm the linked aggregation pages still render correctly post Sub Pages 2-5.
- **Family swatch consistency** — the 6 hue tokens. Verify they read distinctly at the small-tile scale on the index.
- **Confidence card threshold** — HIGH ≥5 / MEDIUM ≥2 / LOW = 1 was set at Sub Pages 5. Has any roaster's count shifted enough that the threshold needs revisiting?
- **Sparse-registry degradation** — Latent (self-roasted) has few populated `RoasterEntry` fields. Verify auto-hide behavior reads cleanly.
- **Strategy tag visibility** — Sub Pages 5 demoted the strategy tag pill into the Additional Information collapsible. Is that the right home, or has lived practice argued for promotion back to the hero?
- **Mobile** — desktop is primary per CLAUDE.md. Tablet spot-check on the 2-col grid (it's likely the failure mode).

### Out-of-scope likely candidates (Claude flags during Phase 2)

- New `RoasterEntry` field additions (deliberate registry edits, not polish work)
- New family / strategy tag additions (same — deliberate registry work)
- Synthesis adapter rewrites (lives in `lib/synthesis/adapters/roaster.ts`; structural changes are their own sprint)
- Per-cup / per-brew enrichment that doesn't surface on the roaster page

## Files likely touched (do NOT pre-edit)

Read-only at first. Implementation surfaces:

- [app/(app)/roasters/page.tsx](../../app/(app)/roasters/page.tsx)
- [app/(app)/roasters/[slug]/page.tsx](../../app/(app)/roasters/%5Bslug%5D/page.tsx)
- [components/SectionCard.tsx](../../components/SectionCard.tsx) / [components/TagLinkList.tsx](../../components/TagLinkList.tsx) / [components/CollapsibleBlock.tsx](../../components/CollapsibleBlock.tsx) / [components/SynthesisCard.tsx](../../components/SynthesisCard.tsx) — if shared component tweaks needed
- [lib/roaster-registry.ts](../../lib/roaster-registry.ts) — only if drift surfaces (rare)
- [docs/taxonomies/roasters.md](../taxonomies/roasters.md) — only if drift surfaces

**Unlikely net-new this sprint**: schema changes, new tables, new MCP Tools. Polish is primarily render-side.

## Methodology notes

### For Chris (Phase 1)

- Walk roasters you've actually brewed from in volume — the ones where you have lived intuition. Sparse roasters (1-2 brews) read differently than your anchor roasters; both perspectives matter.
- Within each roaster page, walk section-by-section in order. Note the section order itself separately from the content (IA vs. content critique).
- The synthesis card placement question is the biggest open IA call going in — explicitly form an opinion on whether Sub Pages 5's demotion still feels right.
- Voice memos welcome for the bigger interpretive calls (synthesis position, mobile, family swatches).

### For Claude (Phase 2)

1. Read Chris's notes top-to-bottom before opening code
2. Read PRODUCT.md § Sub-sprint 4b scope notes + this kickoff brief + the `roaster-registry.ts` rich-shape definition
3. Cross-check substrate: every `RoasterEntry` field → does it have a render path? Is any populated field invisible? Any registry alias / drift case unhandled?
4. Author the complementary pass as a single doc at `docs/sprints/sub-sprint-4b-roasters-polish-complementary-pass-<date>.md`
5. Categorize per the buckets above

Do NOT propose implementation specifics in Phase 2.

### For Phase 3 bundling

Roasters has a much narrower scope than 4a. Plausible bundle shapes:
- **Bundle A** — Detail page IA + render adds (most likely the only bundle, if scope stays focused)
- **Bundle B** — Index polish (family swatches, grouping clarity) — IF scope warrants a separate PR
- **Bundle C** — Synthesis card / adapter tweaks — IF the synthesis position decision lands as a meaningful change

Aim for 1-3 bundles, not 4+. If the bundle count balloons, scope creep is happening.

## Sizing

PRODUCT.md says "~1 sprint." Realistic: 1-2 PRs over a single session if scope stays narrow. The 3-phase audit overhead is fixed; the implementation overhead scales with how much of the radar Chris keeps.

Compared to 4a (1936-line `[id]/page.tsx` + new view-shape + new lifecycle state + new helpers): 4b's render surface is ~1/4 the size + no substrate work. Expect roughly 1/3 the PR volume of 4a.

## Open questions for kickoff

Flag during Phase 1 if your audit doesn't naturally address them:

1. **Synthesis card position** — keep below coffees list per Sub Pages 5, or promote back up? (Largest open IA call.)
2. **Strategy tag visibility** — keep in Additional Information collapsible, or promote to hero?
3. **Latent (self-roasted) degradation** — does the sparse-registry render look right today, or does it feel like an empty page?
4. **Mobile scope** — tablet spot-check only, or in-scope for a real mobile pass?
5. **Per-roaster archive enhancement** — the Side Quests-absorbed framing. Does any roaster's page want a "deep archive" sub-view (every closed brew on the lot) that doesn't exist today? Or is the current coffees-list rendering enough?

## Cross-system audit reminder (for the implementation phase)

When bundles ship, trace through the six-actor chain per CLAUDE.md sprint cadence #4. Roasters polish bundles likely touch:
- Actor 6 (UI + lib) — primary
- Actor 5 (CLAUDE.md § Roasters) — needs editing when page surface changes shape
- Actor 4 (MCP) — only if a new field is exposed via a Tool (unlikely)
- Actor 3 (claude.ai) — only if Tool catalog changes (unlikely)
- Actor 2 (prompts) — only if a new write field affects `push_brew` / similar prompts (unlikely)
- Actor 1 (Chris) — rendered UI verification per bundle

## Related docs

- [docs/sprints/sub-sprint-4a-green-bean-polish-kickoff-2026-05-27.md](sub-sprint-4a-green-bean-polish-kickoff-2026-05-27.md) — 4a kickoff template + audio-clarification recovery pattern
- [docs/sprints/sub-sprint-4a-green-bean-polish-complementary-pass-2026-05-27.md](sub-sprint-4a-green-bean-polish-complementary-pass-2026-05-27.md) — 4a Phase 2 output (shape reference)
- [project_roasters_aggregation.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_roasters_aggregation.md) — original aggregation sprint (2026-04-18)
- [project_roaster_taxonomy_adoption.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_roaster_taxonomy_adoption.md) — 1h.1 70-roaster registry (2026-04-24)
- [project_roasters_detail_rethink.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_roasters_detail_rethink.md) — Sub Pages 5 (2026-05-11), the precedent for 4b
- CLAUDE.md § Roasters — canonical surface map; cross-ref every audit observation
- [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md) — the rule that bounds pacing

## Session-start checklist

When the next session opens, before doing anything else:

- [ ] Read this kickoff brief in full
- [ ] Confirm you are in audit-listening mode, NOT execution mode
- [ ] Acknowledge to Chris that you understand the 3-phase process
- [ ] Ask Chris how he'd like to start (dive into the index, dive into the detail page on a specific roaster, or get a brief on dormant `RoasterEntry` fields first)
- [ ] Do NOT open `app/(app)/roasters/[slug]/page.tsx` and start scanning until Chris says "go" or asks a clarifying question that needs a code read
