# Brew Recorder

**Tier:** Workflow / **Sub-tier:** Executing / **Domain:** Brewing / **Wave:** 3 / **Status:** ACTIVE (Wave 3 PR 3 shipped 2026-05-26)
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Write the final optimized brew to substrate after the brew session completes. Owns `push_brew` + `patch_brew`. Validates canonical-registry compliance (brewer / filter / grinder / grind setting / roaster / producer / roast level / process / flavors / structure tags) before write. Triggers the `bundled-brewing-completion` downstream propose_doc_changes flow into Brewing Historian's cluster.

**Per-coffee terminal write.** Brewing iterates IN-THREAD ONLY (ADR-0011 § iteration-depth asymmetry); intermediate iterations stay in claude.ai thread context and never persist. Only the optimized brew lands here.

## Workflow scope

1. **Validate canonical-registry compliance.** Brewer / filter / grinder / grind_setting → Brewing Equipment Expert cluster (`brewers.md` / `filters.md` / `grinder-eg1.md` / `sworks.md`). Roaster / producer / roast level / process → per-registry `read_canonical` reads. Net-new on text-only columns (roaster / producer / brewer / filter / grinder) → set `*_override: true` to bypass canonical + queue via `taxonomy_overrides_queue` (Phase 3). Net-new cultivar / terroir is **strict** — requires registry edit OR `propose_canonical_addition` before push.
2. **Validate process structure.** `base_process` (NOT NULL CHECK) + optional `subprocess` (Honey color tiers) + 4 stackable modifier arrays + optional `decaf_modifier` + optional `signature_method` (15 canonicals post Sprint T1 / BR-1). Use `ProcessPicker`-equivalent shape: structured columns + `composeProcess()` denormalized display.
3. **`fermentation_qualifiers` cue (Sprint T3 / CR-5, migration 059).** Set `['Anoxic']` when source coffee's process detail indicates sealed-container / no-headspace / Grain-Pro-at-low-moisture fermentation execution. Aliases `No Oxygen` / `Zero O2` / `Oxygen Free` resolve via `FERMENTATION_QUALIFIER_LOOKUP`. Omit (leave `[]`) when not applicable or not knowable. Record-when-known annotation — does not dictate strategy (aggregation stays at the `[Anaerobic]` modifier per docs/reference/canonical-registries.md § Qualifier).
4. **Validate strategy + modifiers.** `extraction_strategy` z.enum on 6 canonicals (Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid). When Hybrid, `hybrid_subform` is REQUIRED. Modifiers via `cleanModifiers()` — 4 canonical types (output_selection / inverted_temperature_staging / aroma_capture / immersion).
5. **Validate flavors + structure_tags.** `flavors` = structured chip array of `{base, modifiers[]}`, NOT free-text. `structure_tags` z.enum on canonical `"Axis:Descriptor"` keys.
6. **`push_brew`** with `source: "purchased"` or `"self-roasted"` (latter for Chain 1 optimized-brew dial-in path; `roast_id` FK to the reference roast accompanies). Returns `brew_id` + `queued_for_taxonomy_review[]` echo if any override fired.
7. **Trigger downstream `propose_doc_changes`** via the `bundled-brewing-completion.md` flow — proposals target the Brewing Historian cluster post Wave 2 PR 2 (`skills/brewing-historian/cluster/patterns/cross-coffee-insights.md` for cross-coffee / `by-strategy/<strategy>.md` for "coffees that confirmed X" / `by-cultivar/<cultivar>.md` or `by-coffee-family/<family>.md` for per-cluster patterns / `roaster/<Canonical Name>` for roaster card updates / `brewing.md` only for residual sections).

## Inputs

- Brew execution data — from Brewing Assistant Phase 3 handoff (final optimized recipe) OR from operator-paste at `bundled-brewing-completion.md`
- Tasting observations — audio-dictation transcript per `feedback_audio_dictation.md` (long multi-fact turns; extract every implicit term)
- [Brewing Equipment Expert](../brewing-equipment-expert/) cluster — canonical equipment validation
- [Brewing Historian](../brewing-historian/) cluster — retrospective comparison; surfaces "this brew's flavor profile is consistent with prior anaerobic-natural Sudan Rume Suppression brews" kind of signal in the prose fields

## Outputs

- `push_brew` row in `brews` table
- Optional `patch_brew` corrections
- Downstream `propose_doc_changes` proposals targeting Brewing Historian cluster (multi-citation per session) — wired via the bundled-brewing-completion pipeline; this sub-skill owns the validation + write, the arbiter owns the proposal application
- Side effect: synthesis cache invalidation on terroir / cultivar / processes / roasters keyed by FK + canonical text (per-entity directed synthesis pipeline picks up the new row on next regenerate trigger)

## Called by / Calls

- **Called by:** Master Coordinator (via `bundled-brewing-completion.md` for purchased brews; via Brewing Assistant Phase 3 handoff for in-thread iterated brews); Chain 1 terminal hop for cross-domain optimized-brew dial-in; Chain 4 terminal hop for single-coffee brew session
- **Calls:** Brewing Equipment Expert · Brewing Historian
- **Hands off to:** Close-Lot Specialist (Chain 1 only — when this brew is the optimized brew on a self-roasted reference roast; close-out completes lot resolution)

## MCP Tools owned

- `push_brew` — primary write
- `patch_brew` — post-push corrections
- `propose_doc_changes` — co-owned with the arbiter; this sub-skill emits proposals from brew-session retrospectives, arbiter applies them

Tool descriptions in `lib/mcp/push-brew.ts` / `patch-brew.ts` carry an "Owned by Brew Recorder per ADR-0011" pointer.

## Self-improvement

- **Patterns:** A (substrate-event refresh — new canonical axis lands, like `fermentation_qualifiers` / Anoxic Sprint T3, recording interface refreshes; new strategy promoted, equipment registry expansion, etc.)
- **Stage:** 1 (in-loop). Substrate-writing executor; N=10 consecutive auto-approvals required for Stage 1 → 2 graduation per ADR-0013 outlier rule.
- **Signal:** new column / new canonical axis added → SKILL.md updates to surface the new field; new equipment registered → Brewing Equipment Expert refresh triggers Brew Recorder validation rule extension.

## Wave 3 PR 3 ship notes (2026-05-26)

- **No cluster authored.** SKILL.md only per PR 2 precedent; cluster materializes later under Pattern F if validation-rule templates accrue across lived use.
- **Prompts unchanged at PR 3 ship.** `docs/prompts/bundled-brewing-completion.md` is the canonical claude.ai entry surface; Brew Recorder is the canonical fetch target. Per `feedback_mcp_only_input.md`, brewing-side `/add?type=purchased` deprecation in favor of full MCP-only input is a future sprint trigger. (`log-brew.md` + `propose-doc-changes-from-brew.md` deprecated to redirect stubs in Writing-path Sub-sprint 3 / 2026-05-26 — bundled covers the full path.)
- **All Knowledge tier dependencies ACTIVE:** Brewing Equipment Expert (Wave 1) + Brewing Historian (Wave 2 PR 2).
- **Chain 1 + Chain 4 terminal hop ACTIVE.** Promoted PARTIAL → ACTIVE in `coordinator/handoff-rules.md` Chains 1 + 4 at PR 3 ship time.
- **Migration source:** `docs/prompts/bundled-brewing-completion.md` covers the recording + downstream proposal workflow. Sub-skill spec elevates the logic; prompt stays as operator entry surface.
- **Cross-system audit:** Actor 6 (no schema change), Actor 4 (MCP Resource registration + 2 Tool description pointers), Actor 5 (CLAUDE.md notes ACTIVE), Actor 2 (prompts unchanged; Anoxic + `fermentation_qualifiers` patches from the 2026-05-26 audit cluster already landed), Actor 3 (catalog refresh), Actor 1 (brewing session flow unchanged in feel).
