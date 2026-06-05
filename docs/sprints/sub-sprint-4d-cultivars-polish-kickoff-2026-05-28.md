# Sub-sprint 4d — Cultivars polish bundle — kickoff 2026-05-28

**Series**: Read-path surface polish series (PRODUCT.md § Active Sprints #4) — fourth sub-sprint, opened after Sub-sprint 4c (Brews polish) closed 2026-05-28 (2 PRs: [#286](https://github.com/chrismccann-dev/latent-coffee/pull/286) Bundle A recipe-substrate fields / [#285](https://github.com/chrismccann-dev/latent-coffee/pull/285) Bundle B filter collapse).

## Why cultivars is next

Per Chris's lived-frequency ordering (audio 2026-05-26, "which ones I view most often naturally on my own"): green beans → roasters → brews are the top three (all shipped, 4a/4b/4c). Cultivars / terroirs / processes are the aggregation surfaces that come after. They share the same `SectionCard` + `<FlavorNotesByFamily>` + `<TagLinkList>` + synthesis-card substrate, so 4d-4f should move faster than the top-three surfaces did. `/cultivars` was last reworked in Sub Pages 3 (2026-05-11) — the lineage→cultivar inversion (lineage demoted to a breadcrumb segment; single-cultivar detail destination).

## ⚠️ NOT a planned-execution sprint

Same rule as 4a/4b/4c: **default mode = LISTEN, DO NOT EXECUTE.** The autonomy rule does NOT apply until you've done Chris's Phase 1 audit + Claude's complementary pass + a bundled plan + ratified the open decisions. Treat as a grilling-shaped session per [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md).

**4c's lesson worth carrying in**: Chris's audit may reframe the sprint away from render-polish entirely (4c became forward data-model design). Don't assume "polish" means CSS tweaks — listen for what the audit actually surfaces (data-model gaps, missing fields, IA reorders, or "it's fine as-is").

## Process — 3 phases, strictly sequential

### Phase 1 — Chris's page-by-page audit (Chris-driven)

**Pages to walk:**

1. **`/cultivars` (index)** — [app/(app)/cultivars/page.tsx](app/%28app%29/cultivars/page.tsx). Groups Species → Genetic Family (swatch + visible-lineage count) → Lineage (sub-header) → Cultivar (linked row + brew count). 0-brew cultivars hidden; lineage cascades hide when all leaves hide; family cascades hide when all lineages hide. Brew counts via `cultivar_id` FK join.
2. **`/cultivars/[id]` (detail)** — single-cultivar destination post-Sub-Pages-3. 9 sections: (1) Hero (family-color swatch + `cultivar_name` h1 + `species → genetic_family → lineage` breadcrumb), (2) Genetic Background, (3) Cultivar Context (4 fields), (4) Brewing & Cup Profile (8 fields), (5) Roasting Characteristics (4 fields), (6) What I've Learned (synthesis card, conditional on `brewList.length >= 2`), (7) Coffees I Have Brewed In This Cultivar, (8) Additional Information (`<CollapsibleBlock>`: Flavor Notes + Terroirs + Processes + Roasters cross-links), (9) Confidence (dark card).

**Walk a representative sample.** 63 canonical cultivars. Walk at minimum: 1 well-populated cultivar (many brews, e.g. Gesha), 1 single-brew cultivar (synthesis card hidden — verify the LOW-confidence message reads right), 1 cultivar with sparse registry content (empty-state field handling), 1 cultivar whose lineage has multiple leaves vs 1 with a single leaf (e.g. Gesha lineage > Gesha).

**For each surface, note:** info design (right data here?) · UX (front-and-center vs demote) · IA (does section order match the job?) · noise (anything you never read?) · missing (any populated `cultivars` column not rendered? check `lib/types.ts Cultivar`) · mobile.

**Open questions to surface in the kickoff conversation:**
1. What's the primary job on `/cultivars/[id]`? (4c locked brews as "repeat-mode recipe recall"; 4b locked roasters as "index into brews." What's the cultivar-page job — sourcing decision? pre-brew/pre-roast reference? archive recall?) This frames the whole section-order audit.
2. The 9-section detail order is Sub-Pages-3 vintage — has lived practice shifted the weight of any section (e.g. is "Brewing & Cup Profile" the front-and-center block, or "What I've Learned")?
3. Index grouping (Species → Family → Lineage → Cultivar) — still right, or does the 4-level hierarchy feel heavy?
4. Mobile scope — full pass or spot-check? (Per 4c: `/brews/[id]` was uniquely mobile-first; is `/cultivars` a desktop-primary surface?)

**Handoff signal**: "OK that's my full audit pass." Until then, do not advance.

### Phase 2 — Claude's complementary pass

Output: `docs/sprints/sub-sprint-4d-cultivars-polish-complementary-pass-<date>.md` (mirror of 4a/4b/4c). Categorization buckets A-G. Substrate cross-check: every populated `cultivars` column has a render path; the `cultivar_id` FK join + synthesis adapter ([lib/synthesis/adapters/cultivar.ts](lib/synthesis/adapters/cultivar.ts)) shape; the ≥2-brew synthesis-card render gate; `CULTIVAR_LOOKUP` canonical resolution. Render-gate audit (mirror the 4b `brewGuideLink` false-negative + 4c "Water:" label-collision catches — spot-check conditional render paths against representative rows).

### Phase 3 — Plan-mode bundled implementation

Enter plan mode (`ExitPlanMode`). Present the bundle structure, get ratification, ship. Files likely to touch: `app/(app)/cultivars/page.tsx` + `[id]/page.tsx`, `lib/synthesis/adapters/cultivar.ts` (if substrate-fold), `lib/types.ts` (if new field surfaces), `CLAUDE.md § Cultivars`, sprint-close housekeeping.

**Likely NOT in scope** (defer per Bucket G): schema migrations (4a-4c avoided these unless a column was genuinely missing — though note 4c DID add `water_recipe`; a cultivar-side equivalent is possible if the audit surfaces a real gap), MCP Tool surface changes (cultivar resolution is stable), synthesis prompt rewrites (separate sprint when triggered).

## Locked decisions from prior sprints (do NOT re-litigate)
1. ✓ Desktop is the primary design target (mobile gets phone-scope sub-sprints separately)
2. ✓ The 3-phase sequencing pattern (Chris audit → Claude complementary pass → plan-mode bundle)
3. ✓ Single PR per bundle
4. ✓ MCP-only writes (forms already deprecated)
5. ✓ Six-actor audit before every PR

## ⚠️ Migration-apply gap (learned in 4c)
If a bundle adds a DB column, the migration must be applied to Supabase BEFORE the merge — the Claude Code worktree has no DDL path (no psql, no Supabase CLI, no `execute_sql` MCP, only PostgREST). 4c's `push_brew` insert + `list_recent_brews` select would 400 against a column-less DB. Plan for: ship code on a branch, hand Chris the one-line migration to apply, merge after `check-migrations` goes green. Sequence non-column bundles to merge independently (4c Bundle B had no DB dep and merged first).

## Reference
- [Sub-sprint 4c kickoff](docs/sprints/sub-sprint-4c-brews-polish-kickoff-2026-05-28.md) + [complementary pass](docs/sprints/sub-sprint-4c-brews-polish-complementary-pass-2026-05-28.md) — most recent precedent (incl. the data-model-reframe + migration-gap lessons)
- [Sub-sprint 4b kickoff](docs/sprints/sub-sprint-4b-roasters-polish-kickoff-2026-05-27.md) + [complementary pass](docs/sprints/sub-sprint-4b-roasters-polish-complementary-pass-2026-05-28.md)
- [PRODUCT.md § Active Sprints #4](PRODUCT.md) — series-level scope
- [CLAUDE.md § Cultivars](CLAUDE.md) — post-Sub-Pages-3 detail-page shape
