**State transition**: Resolved-pending → Resolved.

**Trigger**: I've declared a lot-level reference roast (the single batch slot, from one specific V-set, that I'd repeat if I had more green) AND I've dialed in the optimized brew for it via the brewing-side workflow. I'll paste the reference-roast designation + optimized-brew recipe + cupping notes + lessons-learned synthesis below this message. Your job: mark the reference roast in the roasts table, link (or push) the optimized brew, write the per-lot roast learnings row, propose the cluster-doc close-out narrative, and archive the Roest inventory row.

**Workflow position**: Fourth and final lifecycle prompt (`start-lot.md` → `log-roast.md` ⇄ `log-cupping.md` → **`close-lot.md`**). This one runs exactly once per lot, after `log-cupping.md` has flagged Path A (lot ready for close-out).

Vocabulary used in this prompt is defined in CONTEXT-roasting.md (reference roast vs leading slot, reference cup, optimized brew, lot-specific learnings, carry-forward learnings, roasted bean characteristic, underdev signal / overdev signal, aromatic / structural / rest behavior). The lot-level reference roast designation is what distinguishes this prompt from `log-cupping.md`'s V-set-level leading-slot designation. Cross-zone vocabulary lives in CONTEXT-shared.md (glossary index) — Qualifier + Canonical Registries terms now live in docs/reference/canonical-registries.md per the 2026-05-25 Pattern J pruning sprint; pull via `read_doc` when needed.

## Tools for this session

`get_green_bean`, `get_bean_pipeline`, `get_brew`, `patch_green_bean`,
`patch_roast`, `push_roast_learnings`, `patch_roast_learnings`, `push_brew`,
`patch_brew`, `patch_inventory`, `read_doc`, `read_doc_section`,
`list_doc_sections`, `read_canonical`, `propose_doc_changes`.

(`get_brew` + `patch_green_bean` added Cluster A / MB-7 2026-06-01 for the
STAGE 3 optimized-brew LINK path - verify the handed-back brew_id, then set
`green_beans.optimized_brew_id`.)

MCP namespace: tools surface under `Latent Coffee`.

**Pre-load `patch_inventory` at session start** (do this BEFORE STAGE 1):
`patch_inventory` is called exactly once per lot - at STAGE 6's single archive
call - so it is **structurally never warm** in the catalog when you reach it,
and the `tool_search` cold-lookup latency lands on the close-out's last write.
Explicitly call `tool_search(query: "patch_inventory archive roest inventory row is_archived")`
right after the catalog fetch so the tool is resolved before STAGE 6. If it
doesn't surface in the top-3, fall back to invoking it directly by name
(`patch_inventory`) - the discovery ranking is advisory; the tool exists in the
registry regardless. (It takes `roest_inventory_id`, not `inventory_id`.)

## Routing

I'll reference the lot by `lot_id` or `green_bean_id` + name the reference roast (e.g. "Sudan Rume Natural reference roast = V4C / Batch 169"). I'll either paste the optimized brew recipe inline or reference it by an existing `brew_id` if it's already in the DB.

## STAGE 1 - Resolve bean + verify Resolved-pending state

**This STAGE writes**: nothing (read-only).

- `get_green_bean({lot_id})` → returns `green_bean_id`.
- `get_bean_pipeline({green_bean_id})` → full state. Verify:
  - At least one experiment row has a non-null `winner` (the V-set leading-slot designations).
  - The roast I'm naming as the lot reference is in `roasts[]` with a `recipe_id` linkage to a `roast_recipes` row.
  - `roast_learnings` row does NOT yet exist (or exists but is incomplete - both cases route to this prompt; the row UPSERTs on `(user_id, green_bean_id)`).
- Compare project-doc claims against existing DB state. Flag any divergence.

## STAGE 2 - Mark the reference roast on the roasts table

**This STAGE writes**: `roasts` row patch (the reference roast).

The lot-level reference roast designation is distinct from any V-set's leading slot. The reference roast is the *one batch I'd replicate if I had more green*.

`patch_roast(roast_id, ...)`:

- `is_reference: true`. **Axis-1 of the close-out**: this is the row the resolved-view page renders as the reference roast. Set unconditionally on the named reference roast. **The `is_reference_candidate` flag set on this batch during V-set iteration does NOT auto-flip — this STAGE 2 patch is the explicit promotion** (Schema sprint S2, migration 056, 2026-05-18). If `is_reference_candidate` was never set true on the eventual reference roast (some V-set leading slots never read as candidate-quality but became the lot reference by elimination), that's fine — `is_reference` stands on its own.
- `worth_repeating: "yes"` if not already set. **Axis-2, decoupled from `is_reference`**: this is the "I'd run this exact recipe again if I had more green" axis. Usually correlates with `is_reference` on V-set lots (you wouldn't name a roast the reference if you wouldn't repeat it), but they're structurally independent fields. On V-set lots both default to true together; the decoupling matters more for one-shot lots (`one-shot-closeout.md` STAGE 2) where `is_reference` is structural (single batch IS the reference) but `worth_repeating` can vary by outcome.
- Optionally refine `what_worked` / `what_didnt` / `what_to_change` if the close-out reflection added clarity over the in-iteration prose.
- **Drop-attribution confirm (backlog #43c, Batch 194 case):** if the reference roast carries `end_condition_type: "manual"` paired with a `drop_temp` meaningfully below the recipe's designed bean_temp trigger (degrees, not probe-lag scale), ask the operator to confirm the drop attribution before patching - deliberate manual pull (drop-rule fire or judgment call) vs a mis-recorded auto-drop. Correct a provisional attribution via `patch_roast` while the close-out has the operator's attention.

`patch_roast` echoes `updated_fields: [...]` + `canonical_values` for enum fields.

## STAGE 3 - Link (or push) the optimized brew

**This STAGE writes**: `green_beans.optimized_brew_id` (the link - primary path); a `brews` row only on the legacy fallback path.

The optimized brew is the daily-consumption recipe Chris dialed in for the reference roast via the brewing-side workflow. It's the **consumption-condition endpoint** of the full pipeline - post-hoc attribution traces backward from here.

**Why this stage runs BEFORE the roast_learnings write (reordered 2026-07-15, backlog #42):** brewing dial-in can surface insights (the AN10 honeycomb read is the case study) that invalidate carry-forward prose written seconds earlier - the SPG packet doesn't always predict them. Link and READ the brew here (`get_brew` on the handed-back brew_id, especially `what_i_learned` + the prose fields) so STAGE 4's carry-forward fields are authored with the brew-side learnings already in hand, instead of patched after the fact.

**Invariant: the optimized brew is pushed exactly ONCE and linked exactly ONCE.** Normally the brewing thread (the `bundled-brewing-completion.md` carve-out) pushes the brew row and this STAGE only LINKS it (`optimized_brew_id`); the inline push (fallback) fires only when no brewing thread pushed it. NEVER both - pushing here when the brew already exists creates a duplicate / orphan brew row (the exact failure the self-roasted gate guards against).

**Primary path - LINK (Cluster A / MB-7, 2026-06-01).** The optimized brew is now brewed + pushed in a dedicated BREWING thread (the optimized/reference-brew carve-out in `bundled-brewing-completion.md`), which hands back the pushed `brew_id`. So the usual case is: the brew row already exists and this STAGE just LINKS it - it does NOT re-push.

- Read the `brew_id` from the optimized-brew handoff line I paste in (shape: `Optimized brew pushed: brew_id=<id> for lot <...>`). If I didn't include it, ASK for it (or for the brew's identity so you can recover it via `get_brew` / `list_recent_brews`) - do NOT silently fall through to re-pushing and creating a duplicate brew row.
- Verify with `get_brew(brew_id)` that it exists and is this lot's brew (its `green_bean_id` should match STAGE 1's, or be NULL-and-patchable).
- `patch_green_bean(green_bean_id, optimized_brew_id: <brew_id>)` - the canonical link the resolved-view's `pickOptimizedBrew` prefers over the legacy `roast_id === best_roast_id` heuristic (which survives only as a fallback for lots closed before this column existed). **Catalog-cache caveat**: `optimized_brew_id` is a recent field on `patch_green_bean` (migration 075); if the Tool rejects it as an unknown/no-op field, your claude.ai session's tool catalog predates it - start a fresh session to re-handshake the catalog, then retry (the field IS in the deployed server). See CONTEXT-shared.md § MCP catalog cache.
- If the brew's `roast_id` isn't already the reference roast, `patch_brew(brew_id, roast_id: <STAGE 2 reference roast_id>)` so the brew links to the batch it was dialed for.

**Legacy / fallback path - PUSH inline.** Only when the optimized brew was NOT pushed in a brewing thread (I pasted the recipe inline instead of handing back a `brew_id`). Then push it here as a `brews` row (source=self-roasted), capture the returned id, and run the same `patch_green_bean(..., optimized_brew_id)` link above. Apply canonical-validation discipline from `bundled-brewing-completion.md`. Key schema-strict gates:

- `extraction_strategy` z.enum, 6 strict canonicals (v8.4: Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid).
- When `extraction_strategy = "Hybrid"`, `hybrid_subform` is REQUIRED - pick one of: sequential / phase_mapped / selective_bloom / intensity_clarity_split / temperature_staged.
- Within-strategy gradient ("lower edge of Balanced Intensity") goes in `strategy_notes`, NOT `extraction_strategy`.
- Cooling-window-as-strategy goes in `cooling_curve_target` (free-text), populated only when peak evaluation window IS the strategy (e.g. `"40-45°C peak"`).
- `structure_tags` z.enum on canonical `"Axis:Descriptor"` keys.
- `flavors`: structured chip array of `{base, modifiers[]}`, NOT free-text.
- Roaster / producer / brewer / filter / grinder canonicalize via their `*_LOOKUP`; `*_override: true` ONLY if legitimately new (rare for roaster = `"Latent"` on a self-roasted brew).

**Required identity fields (often missed — push_brew rejects without them):**

- `coffee_name` (string) — the brew's display name. Compose from green bean: `"<producer> <cultivar> <process>"` (e.g. `"Higuito Bourbon Anaerobic Dry Process"`). NOT inferred from `green_bean_id`.
- `roaster` (string) — `"Latent"` for self-roasted (NOT `roaster_override: true` since Latent is a canonical roaster). No `roaster_override` needed.
- `terroir` (object) — required sub-object. Shape: `{ country: "<canonical>", macro_terroir: "<canonical macro>", meso_terroir: "<free-text or canonical>" }`. **Do NOT free-text the country/macro fields.** Look up the canonical macro via `read_canonical(axis: "terroirs", name: "<country>")` if uncertain. Caveat: today's `push_brew` re-resolves terroir from scratch and creates a new terroir row if the macro doesn't match an existing canonical — even when `green_bean_id` is supplied. Inherit the green bean's terroir_id mentally by reading `green_bean.terroir` first and passing the same canonical macro to keep terroir consistency. (Logged as future Tool sprint: `push_brew` should inherit terroir/cultivar FKs from `green_bean_id` automatically — Round 9/10 friction.)
- `cultivar` (object) — required sub-object. Shape: `{ cultivar_name: "<canonical>" }`. Read the green bean's cultivar via `read_canonical(axis: "cultivars", name: "<canonical>")` first to confirm canonical form.

**Schema-strict body fields:**

- `source: "self-roasted"`
- `green_bean_id` from STAGE 1
- `roast_id` from STAGE 2 (the reference roast - links the brew to the specific batch it was dialed for)
- Recipe: brewer / filter / dose / water / grinder / grind_setting / temperature
- `extraction_strategy` (+ `hybrid_subform` if Hybrid) + `strategy_notes` + optional `cooling_curve_target`
- `flavors` (structured chips) + `structure_tags` — **`structure_tags` enum is narrower than intuition.** Body axis canonicals do NOT include "Heavy" (use "Syrupy" / "Full" / "Light"); Sweetness axis canonicals are intensity-shaped not flavor-shaped (no "Honeyed" — that's a flavor; use "High" / "Moderate" / "Low"); Acidity axis does NOT include "Tart" (use "Bright" / "Juicy" / "Soft" / "Sparkling"). Call `read_canonical(axis: "flavors")` or check the error message's enum list if unsure. Common slip: copying flavor descriptors into structure_tags.
- `fermentation_qualifiers: ['Anoxic']` when the green bean's process detail indicates sealed-container / no-headspace / Grain-Pro-at-low-moisture fermentation execution (Sprint T3 / CR-5 / migration 059, 2026-05-18). Canonical via `FERMENTATION_QUALIFIER_LOOKUP`; aliases `No Oxygen` / `Zero O2` / `Oxygen Free` resolve to `Anoxic`. Record-when-known annotation — does not dictate strategy (aggregation stays at the `[Anaerobic]` modifier per docs/reference/canonical-registries.md § Qualifier). Omit (leave as `[]`) when not applicable or not knowable from the source.
- Pour structure: prefer the STRUCTURED `pours` array (`{type,at,to_g?,pour_s?,hold_s?,valve?,detail?}`, bloom at index 0 — migration 074, 2026-05-30) over legacy free-text `bloom` + `pour_structure`; see `bundled-brewing-completion.md` § "Pour structure" for the shape + one-step-per-real-step discipline.
- Prose: `peak_expression`, `aroma`, `attack`, `mid_palate`, `body`, `finish`, `what_i_learned`, `terroir_connection`, `cultivar_connection`

For field-level edits to a brew already pushed, prefer `patch_brew`.

The optimized brew lights up the resolved-view's "Reference Cup" + "Optimized Brew" sub-cards. The reference cup (xBloom gate at day-7) is sourced from the matching `cuppings` row on the reference roast (pushed previously via `log-cupping.md` with `recipe_variant: "xbloom_gate"`); the optimized brew is THIS push.

## STAGE 4 - Write the per-lot roast learnings row

**This STAGE writes**: `roast_learnings` row (one per lot, UPSERTs on `(user_id, green_bean_id)`).

`push_roast_learnings(payload)`. This is the structured carry-forward learning - the **compounding-knowledge primitive** that future `start-lot.md` runs consume when designing V1 on a lot with overlapping cultivar / terroir / process. Author every field that has signal; leave NULL only when there's genuinely nothing to say.

### Required FK

- `green_bean_id` from STAGE 1
- **`best_roast_id`**: typed FK to `roasts.id` - the reference roast. Sub Pages 6.1 (2026-05-13) addition; preferred over the legacy text field. Get from STAGE 1's `roasts[]` filtered by `is_reference: true` (after STAGE 2's patch lands).
- `best_batch_id`: legacy free-text reference roast batch number (e.g. `"169"`). Populate both for back-compat through Phase 3.

### Reference-roast explainer

- **`why_this_roast_won`**: what about this specific batch made it the lot-level reference. 3-6 sentences. The most load-bearing field - it's the verdict prose surfaced front-and-center on the resolved-view page. Cite specific roast measurements (FC time/temp, drop temp, Agtron, WB→Gnd delta) AND specific cup descriptors. Distinguish "this roast won the V-set comparison" from "this roast is the lot-level reference" - the latter is what this prompt records. Always populated on V-set close-outs (NULL is reserved for "Closed without reference" lots — see one-shot-closeout.md).

### Roasted bean characteristic (3 attributes per CONTEXT-roasting.md)

These are what the resolved-view page's Roast Character mini-card surfaces side-by-side:

- **`primary_lever`**: the single variable that mattered most for this lot - the lever to move first when re-roasting. 1-2 sentences.
- **`secondary_levers`**: smaller-impact levers that still moved the cup. Optional.
- **`roast_window_width`**: `"Narrow"` / `"Moderate"` / `"Wide"`. The **acceptable roast window** for the primary lever - the range within which the cup stays in the desired zone. UI renders this as "Acceptable Roast Window"; the schema column name stays `roast_window_width` for content-shape reasons.
- **`brewing_tolerance`**: how well the cup holds up when brewing variables are pushed toward extremes (Full Expression / Suppression / Extraction Push). High = cup stays coherent across a wide brew range; Low = cup falls in on itself when pushed. Distinct from `roast_window_width` which captures latitude on the *roast* side. Note: Chris deprioritizes brewing tolerance in favor of expressiveness (Latent's motto: "Roast for brewing tolerance, brew for intensity" — controls-both-sides posture means the roasted bean has to hold up when pushed or pulled from either direction), so low-tolerance lots are acceptable provided they don't fully collapse - phrase the assessment accordingly. Renamed from `elasticity` in Sprint 10 (migration 060, 2026-05-19) per ADR-0007.

### Variable post-hoc promotions

- **`what_didnt_move_needle`**: variables tested across V-sets that produced no clear cup effect - non-factors. Recording these is useful: the absence of effect is itself a carry-forward lesson.

### Cup-side diagnostic signals (NOT roast-side observations)

CONTEXT-roasting.md is strict on this distinction. Underdev / overdev signals describe what the CUP TASTES LIKE when development is off-target, NOT roast-side observations like "the roast stalled at the end" (those go in the per-roast prose `what_didnt` or in `additional_notes` on the experiment row).

- **`underdevelopment_signal`**: what underdev tasted like for THIS lot's cup - diagnostic marker for future lots of similar cultivar / process. Lot-specific (grassy / hay / sour / underextracted-acidity vary by cultivar). Cite the specific batch slot(s) that exhibited this so the signal is anchored to evidence.
- **`overdevelopment_signal`**: cup-side mirror. Lot-specific (roasty / nutty / ashy / muted / dark-chocolate-heavy / pronounced drying tannin / Sichuan peppercorn vary by cultivar).

**Cup-first + labeled-roast-correlate pattern** (Sprint 11 RO-5 formalized 2026-05-20): the structure existing closed lots already use. Write the cup observation FIRST (what the cup tasted like at underdev / overdev). If a roast-side correlate is consistent across this lot — e.g. `Agtron WB above 77, ground above 74` or `FC below 200°C` or `Maillard above 50%` — append it AFTER the cup observation, explicitly framed as a roast-level correlate. Worked example from CGLE Mandela XO's underdev signal: "Aggressive alcoholic attack dominating the cup; sour-fermented pungency front-loaded with no body or integration; attack dissipates quickly. Agtron whole bean above 77, ground above 74. Seen clearly in V1 Batch 100 and V3a batches 137/138." Cup descriptors → Agtron threshold → cited batches. Do NOT replace the cup observation with a roast-side observation — that miscategorizes the field. Audit confirmed all 3 currently-populated lots follow this pattern cleanly; this rule encodes it for future writes.

### Lot-level rest behavior

- **`rest_behavior`**: how the roast evolves across rest days (Day 4 / 7 / 10+) AND across cross-cup vehicle comparisons (April brewer vs xBloom, etc.) AND storage observations (foil-bag temperature, ambient). Three-thread content scope per the Sprint 10 RO-7 reframe. Populated rate 3 of 7 closed lots (43%); use when the lot teaches something about rest evolution worth carrying forward to similar lots. Sprint 11 (migration 062, 2026-05-20) note: `aromatic_behavior` + `structural_behavior` previously lived alongside `rest_behavior` in this section; they relocated to `cuppings.aromatic_behavior` / `cuppings.structural_behavior` per ADR-0008 because they describe what a CUP IS (per-tasting observation), not a lot-level rest-curve lesson. Push them at log-cupping.md STAGE 2 via `push_cupping` (or `patch_cupping` for corrections), NOT here.

### Carry-forward learnings (the compounding-knowledge primitive)

These are the fields `start-lot.md` reads when designing V1 on a new lot with overlapping attributes. Designed to shorten time-to-reference-roast on the next similar lot.

**Scope tags (Sprint 12 / migration 064 / ADR-0009, 2026-05-21)**: each carry-forward field below has a paired `*_scope_tags text[]` array for sub-scoping. Tag the lot's takeaways with loose-canonical namespaced prefixes when the lesson only applies under specific conditions — this makes cross-lot SQL queries reliable ("which takeaways apply to washed Colombians?") rather than relying on grep against prose. The convention is **loose-canonical**: prompts describe it; write paths do NOT enforce. Conventional prefixes:

- `process:washed` / `process:natural` / `process:honey` / `process:wet-hulled` (base process scope)
- `process:xo-fermented` / `process:anaerobic` / `process:hybrid-washed` (modifier or signature-level scope, when the lesson is specifically about heavy-process behavior)
- `variety:sudan-rume` / `variety:gesha-1931` / `variety:typica-mejorado` (within-cultivar accession scope for cultivar_takeaway)
- `country:colombia` / `country:guatemala` / `country:ethiopia` / `terroir:macro:huila` (geography scope)
- `altitude:high` / `altitude:low` / `density:high` / `density:low` (load-bearing physical dimensions)
- `evaluation_method:day-7-pourover` / `evaluation_method:day-4-cupping` (when the lesson is about the gate, not the coffee)
- `general` — catch-all for genuinely universal principles ("Fix the RoR shape before varying any other lever"); use as the sole tag when the takeaway transfers across all axes

The field's name already implies the PRIMARY scope axis (cultivar / terroir / general / starting_hypothesis); scope_tags carries **sub-scoping** within or across axes. For a Sudan Rume Washed lot's `cultivar_takeaway` that doesn't transfer to natural, tag `['process:washed']` to make the constraint queryable. For a `general_takeaway` like "shaped fan curve mandatory for heavy-ferment under counterflow", tag `['process:xo-fermented','process:anaerobic']`. Leave the array empty (`[]`) when the takeaway applies broadly across the field's primary axis.

- **`cultivar_takeaway`**: what this lot taught about the cultivar generally. Cross-lot scope. Pair with `cultivar_takeaway_scope_tags` when the lesson sub-scopes (e.g. only applies to washed expressions of this cultivar).
- **`terroir_takeaway`**: what this lot taught about the terroir generally (country / admin region / macro terroir patterns). Cross-lot scope. Added Sprint 10 (migration 060, 2026-05-19) — closes the missing carry-forward axis Chris's mental model has always carried. Populate when the lot teaches something terroir-specific that future similar-terroir lots should inherit; leave NULL when the carry-forward is cultivar- or process-driven rather than terroir-driven. Pair with `terroir_takeaway_scope_tags` for sub-scoping (e.g. `['altitude:high','process:washed']`).
- **`general_takeaway`**: what this lot taught about roasting generally / cross-coffee patterns. Cross-cultivar / cross-terroir scope. Pair with `general_takeaway_scope_tags` — this field is the most likely to need explicit tagging because "general" prose drifts across scopes (process-scoped principles vs evaluation-method scope vs universal scope all currently coexist here).
- **`starting_hypothesis`**: hypothesis for the next similar coffee - what to start from. The most actionable field for future `start-lot.md` runs. Pair with `starting_hypothesis_scope_tags` to define which future similar-lot pattern should consume this hypothesis on STAGE 1 carry-forward search (e.g. `['variety:typica-mejorado','process:honey','altitude:high']` makes the hypothesis surface for the queued Cruz Loma TM Honey one-shot).
- **`reference_roasts`**: which batches to keep in mind for replication / comparison (a string list - typically just the reference roast plus 1-2 other strong slots from the lot for benchmarking).

## STAGE 5 - Propose close-out narrative to cluster docs

**This STAGE writes**: `doc_proposals` row (one multi-citation proposal).

**Resuming a partially-completed close-out (backlog #53):** a mid-close-out compaction or trigger re-send can naively re-run STAGES 1-4. Every write is idempotent (roast_learnings UPSERTs on `(user_id, green_bean_id)`, `patch_*` echoes, proposals auto-supersede per `(target_doc, section_anchor)`), so a re-run is safe - but wasteful and noisy. On resume: STAGE 1's pipeline read already shows whether the roast_learnings row exists (patch it, don't re-push) and whether `is_reference` / `optimized_brew_id` already landed; before re-issuing any `propose_doc_changes` call, check what's already queued via `list_doc_proposals(status: "pending", target_doc: <target>)` and skip citations whose `(target_doc, section_anchor)` pair is already pending.

BEFORE drafting any citation, fetch the live cluster doc via `read_doc(uri="docs://skills/<cluster-path>.md")` (or `list_doc_sections` against the same URI if anchors don't resolve). Reference the [Master Coordinator catalog](docs://skills/coordinator/catalog.md) to identify the right cluster home for each insight.

> **Catalog trigger discipline** (load-orchestration sprint, 2026-05-25 spec): the catalog fetch lives at this STAGE specifically because cross-domain proposal routing is the one moment in the roasting lifecycle where intent is genuinely ambiguous (the decision tree below routes by insight-SHAPE across active-lots / learnings / protocol / CCIL / varietal-fingerprint / reference-brew clusters). Do NOT promote this fetch to session start; do NOT duplicate it at other lifecycle stages. If a future edit wants the catalog at an earlier stage, the right move is to verify whether the underlying routing decision really needs it — most stages can route by domain alone without consulting the catalog.

Routing decision tree - pick the cluster doc that matches the SHAPE of the insight, not just the topic. Per-citation `target_doc` is `"skills/<cluster-path>.md"` (`'roasting.md'` is deprecated post Wave 4 PR 4b per ARBITER.md § target_doc routing):

- **Active Lots `### LOT-CODE - Description` sub-section** — **soft-retire convention.** Prefer status-flip-with-pointer over hard-blank. Other cluster docs cross-reference the active-lot file by anchor (by-process/natural.md, cross-coffee-insights.md, etc.); a hard-blank empty-replace would break those anchors. Instead: keep the file's `# <lot title>` h1, change the `Status:` line to `Closed (YYYY-MM-DD)`, add a `**See closed-lot learnings:** [learnings/<lot-slug>.md](../learnings/<lot-slug>.md)` pointer block, and empty-replace only the working-hypothesis prose body - **the h1 status-block region specifically** (the prose between the `#` h1 line and the first `##` header). H2 sections are PRESERVED as historical / cross-ref anchors, NOT emptied per-section (operator call, Round 21 S6#5 / backlog #43b). Citation `target_doc: 'skills/roasting-historian/cluster/active-lots/<lot-slug>.md'`. (Hard-blank is acceptable only when no cross-refs exist — rare.)
- **Closed-lot learnings**: CREATE the close-out deep-dive at `docs/skills/roasting-historian/cluster/learnings/<lot-slug>.md` (one file per closed lot). A net-new learnings file is NOT yet registered in `lib/mcp/docs.ts` SKILL_FILES, so `propose_doc_changes` will reject a citation against it (`"Unknown skills target..."`). Do NOT route the learnings file through `propose_doc_changes`. Instead, emit a **per-lot-file-registration ticket** (the standardized path the arbiter consumes - Chris pastes it into a Claude Code session that runs the ARBITER.md "Per-lot file registration tickets" playbook section). Draft the full file body and emit the ticket as a fenced block (render it to Chris at STAGE 7):

  ```
  ticket_type: per-lot-file-registration
  lot_slug: <lot-slug>
  target_path: skills/roasting-historian/cluster/learnings/<lot-slug>.md
  seed_content: |
    # <Lot title>
    ... full drafted markdown body (header + Substrate pointers + Cross-lot framing + Related) ...
  source: {kind: "session", id: "<lot_id close-out>"}
  ```

  Chris pastes the ticket into a Claude Code arbiter session; the ARBITER section registers the path (SKILL_FILES + DOC_DESCRIPTIONS), glob-verifies it (`npm run check:mcp-bundle`), and seeds the file with `seed_content`. One ticket per net-new file. Everything else in this STAGE still goes through `propose_doc_changes` as usual - the ticket flow is ONLY for the net-new per-lot learnings file. Optionally also update the closed-lot archive at `docs/roasting/archive.md` if a fuller per-lot prose entry is warranted; that's a separate `propose_doc_changes` citation with its own `target_doc: 'docs/roasting/archive.md'` (legacy non-`skills/` path is glob-registered and accepts new files directly).
- **Protocol-level insights** confirmed by close-out - e.g. "use bean-temp end conditions on silent-FC coffees", "anaerobic naturals tolerate drop ceiling 1°C above the Sudan-Rume-Washed-derived 207°C", "audibility count is diagnostic-primary on silent-FC lots" - route to the appropriate workflow / protocol cluster doc — FC Marking Protocol at `docs://skills/roest-knowledge/cluster/protocols/fc-marking.md`; Drop Temp as the Primary Drop Signal at `docs://skills/roest-knowledge/cluster/machine/counterflow-observations.md#drop-temp-as-the-primary-drop-signal`; Between Batch Protocol at `docs://skills/roest-knowledge/cluster/protocols/between-batch-protocol.md`. Use citation `target_doc: 'skills/roest-knowledge/cluster/<file>.md'`. REPLACE the relevant paragraph when contradictory; APPEND when additive.
- **Varietal Aromatic Fingerprints**: APPEND or REPLACE the subsection of `docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` if the variety already had a placeholder. Cite the cup descriptors confirmed across multiple roasts on this lot. Citation `target_doc: 'skills/roasting-historian/cluster/patterns/cross-coffee-insights.md'`.
- **Reference Brew Recipes by Lot**: APPEND the optimized brew recipe from STAGE 3 to the relevant Reference Brew section in the Roasting Historian cluster (route via the catalog if uncertain). Format matches the section's existing convention.
- **FC Floor & Ceiling**: APPEND to the FC Floor & Ceiling subsection of `docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` if a new floor / ceiling for this cultivar / process was confirmed by close-out (promote from working-hypothesis to confirmed once the lot closes).
- **Cross-Coffee Insight Layer**: APPEND to `docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` if a new generalizable cross-COFFEE pattern emerged (NOT protocol-level - those route to protocol cluster docs). Use the `key_insight_confidence` enum vocabulary in the marker.
- **Rest Behavior Patterns**: APPEND to the Rest Behavior subsection of `docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` if a new rest-curve insight was characterized (rare - usually NULL on `roast_learnings.rest_behavior`).
- **Green Spec to Starting Hypothesis**: APPEND to the relevant subsection of `docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` if a new green-spec rule emerged (moisture / density / cultivar / process combination → starting hypothesis).
- **Cross-domain (roasting + brewing) patterns**: if the lot's close-out reveals a pattern that holds across roasting and brewing (cultivar-throughline / process-layer mechanics), APPEND to the CCIL cluster at `docs://skills/ccil/cluster/coffee/<cultivar-slug>/across-roasting-and-brewing.md` (or propose a new seed pattern when the pattern is novel enough). Citation `target_doc: 'skills/ccil/cluster/coffee/<cultivar-slug>/across-roasting-and-brewing.md'`.

Submit as `propose_doc_changes` call(s). Required fields per call: top-level `summary` (one-line, the arbiter sees this when triaging), `citations: [{section_anchor, operation, proposed_text, current_text, rationale, target_doc?}]` (the citation field is named `operation`, NOT `op`; `rationale` is also required per citation; per-citation `target_doc` is required when citations route to different cluster docs). For replace, copy the existing text VERBATIM into `current_text`. Optional `source = {kind: "session", id: "<lot_id close-out>"}`. An `append` op's `proposed_text` MAY carry new `##`/`###` headers - they land at the end of the anchored section and read as new sections positioned relative to the subsequent section boundaries; this is the sanctioned way to create a net-new subsection via append (backlog #45b).

**Auto-split when citations span multiple target_docs** (Round 15 diagnostic, 2026-05-26 / Sub-sprint 2 Item 15(b)). The close-out routing tree above commonly produces citations targeting 3-6 distinct cluster docs (active-lot + learnings + cross-coffee-insights + reference-brew + protocol + CCIL). When citations would target more than one distinct `target_doc`, issue ONE `propose_doc_changes` call per `(target_doc, section_anchor)` pair instead of a single multi-citation bundle. The aggregate payload (proposed_text + rationale sum) across multiple target_docs trips claude.ai's client-side approval-gating ceiling that doesn't fire on single-citation calls. Each split call carries exactly one citation, one target_doc, one section_anchor — keeps each payload small and the approval flow smooth. Reuse the same `source` shape across all split calls (`{kind: "session", id: "<lot_id close-out>"}`); use the same `summary` (or append a short `(1/N)` suffix per call). Auto-supersede operates per `(target_doc, section_anchor)`, so split calls remain idempotent on re-run. When the rare close-out produces citations all targeting the SAME target_doc, a single multi-citation call stays correct — the split rule only fires on cross-target_doc bundles. **Granularity, verified against `lib/mcp/propose-doc-changes.ts` (backlog #43a, 2026-07-15):** the split is entirely client-side - the server neither splits nor bundles; every call queues independently, and auto-supersede matches per citation `(target_doc, section_anchor)`. When the split fires, go fully granular: one call per `(target_doc, section_anchor)` pair globally, including when one target_doc carries multiple anchors - do NOT re-bundle within-target_doc citations inside a split close-out.

DRIFT DETECTION: if the live cluster doc disagrees with what you observed in DB / Roest data (e.g. a reference brew recipe specifies a fan curve that doesn't match the actual Roest profile), include a `replace` citation that updates the doc to match observed reality.

## STAGE 6 - Archive the Roest inventory row

**This STAGE writes**: `roest_inventory` row patch (`is_archived: true`).

After the close-out proposal lands, mark the Roest inventory row archived so the tablet picker hides the lot from the active inventory list.

- `patch_inventory({roest_inventory_id: <from STAGE 1's green_bean_inventory_id>, is_archived: true})`.
- Skip if the lot was never pushed to Roest (rare).
- `patch_inventory` echoes `canonical_values: { is_archived }` for sanity-check.

## STAGE 7 - Confirmation output

**This STAGE writes**: nothing (output only).

Print:

- `green_bean_id`
- Reference roast designation: `roast_id`, `batch_id`, V-set + slot, brief `why_this_roast_won` excerpt
- `roast_learnings_id` + `created` (true on first push)
- `brew_id` for the optimized brew + key recipe summary one-liner
- `proposal_id` from `propose_doc_changes`
- `is_archived: true` confirmation (or "skipped: <reason>" if not on Roest)
- Lifecycle state confirmation: "Lot closed. State flipped to **Resolved**. The lot will now surface on `/green` under Resolved with the green tile, and `/green/[id]` renders the resolved-view page shape."

## What this prompt does NOT do

- Push new cuppings or roasts. Those happen mid-iteration via `log-roast.md` / `log-cupping.md`.
- Design new V-sets. Lot is closed.
- Dial in the optimized brew - that's the brewing-side workflow's job. By the time this prompt runs, the brew has been iterated to a final recipe; this prompt just records it.
