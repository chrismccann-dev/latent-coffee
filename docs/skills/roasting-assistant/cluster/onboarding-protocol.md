# Roasting Assistant — new coffee onboarding protocol

*Coffee Research · Latent · Roasting Assistant cluster*

The full New Coffee Onboarding Protocol (Steps 1-4 + Naming Conventions + Parallel Experiment Considerations). Migrated from ROASTING.md § New Coffee Onboarding Protocol in Wave 4 PR 4b (2026-05-21).

Operational entry surface = [`docs/prompts/start-lot.md`](../../../prompts/start-lot.md) (V-set lots) and [`docs/prompts/one-shot.md`](../../../prompts/one-shot.md) (one-shot calibration lots). Both prompts cover STAGES 1-5 of the operational flow; this doc holds the methodology that the prompts compose over — the *why* behind the intake fields and the V1-design output.

## How to use this doc

The prompts handle the operational flow (paste intake fields → STAGE 1 push bean → STAGE 2 design experiment → ...). This doc holds the methodology behind each step: how to pick the anchor profile, what V1 should output, how to name batches across systems, how to plan parallel experiments.

If you're operating, follow the prompts. If you're designing a new lot from scratch and want to understand *why* the prompts ask what they do, read this.

## Step 1 — Intake: What to Provide Claude

When onboarding a new coffee, the LOT SPEC block in [start-lot.md](../../../prompts/start-lot.md) should include:

- **Full green bean spec row** in the format used by the Roest inventory (Green Lot ID, Coffee Name, Variety, Producer, Region, Origin, Seller/Importer, Process, Moisture %, Density g/L, Purchase Date, and any additional fields like Altitude, Source Type, Price per kg when available). Field set mirrors the Roest new-inventory form rather than a fixed canonical list — do not block onboarding on missing optional fields.
- **Producer's published tasting notes verbatim — REQUIRED.** These are the comparison target for the Day 7 pourover gate and feed into the evaluation session's primary question: does the cup match what the producer described? Do not proceed with V1 design without these notes; if unavailable from the producer, use the seller's cupping notes (e.g. Sweet Maria's full cupping notes).
- **Process description if available** (fermentation length, drying method, time in drying, any anaerobic, thermal shock, or co-ferment details).
- **Whether a reference roast of this same variety/process exists** (peer, favorite roaster, competition lot) — if so, what it tasted like.
- **Learning intent:** is this a "find out what this coffee wants" V1 or a "optimize toward a specific expression" V1?

Before scoping V1 batches, optionally cross-check the lot against [wbc-roasting-archivist/cluster/sourcing/strategy.md](../../wbc-roasting-archivist/cluster/sourcing/strategy.md) — which tier (T1/T2/T3) and portfolio lane the green falls in shapes how much experiment investment is justified, and whether the lot is a candidate for the same-green dev ladder in [wbc-roasting-archivist/cluster/wbc-roasting.md § Blending experiments](../../wbc-roasting-archivist/cluster/wbc-roasting.md).

## Step 2 — Claude Asks These Three Questions

Before drafting V1, Claude should ask exactly these three questions. These define the scope of V1 and eliminate ambiguity downstream:

- **Experiment structure** — always three batches (v1a/v1b/v1c). Default variable is peak inlet temperature. Skip this question when the user's learning intent is a directional probe (e.g. "broad sense of what direction this coffee wants to go") — peak inlet variation is assumed in that case and asking is redundant. Ask this question only when intent is ambiguous, when the anchor coffee is well-resolved enough that fan curve or Maillard length could legitimately be the primary variable, or when the user signals a specific hypothesis worth isolating.
- **Anchor profile** — which existing profile to start from. Default: closest process match from a resolved or active counterflow lot. See § Step 3 Anchor Profile Selection Logic below.
- **FC ambiguity risk** — how to handle silent-crack risk. Naturals, heavy-ferment processes, and some high-grown washed coffees often produce subtle or silent cracks. Decision: plan for manual mark at 208°C if silent, manage primarily by drop temp. See [roest-knowledge/cluster/protocols/fc-marking.md](../../roest-knowledge/cluster/protocols/fc-marking.md).

## Step 3 — Anchor Profile Selection Logic

**Green-physics-first framing.** Read the lot's moisture + density (paired) as a first-order intake signal **alongside** process and terroir/cultivar — not subordinate to process. This is a structural refinement from the [Yunnan livestream extraction (Dongzhe, 2026-05-17)](../../peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md#delta-1--green-physics-first-process-second-structural): moisture/density picks the energy envelope, then process decides stretch-vs-compress within that envelope. In practice that means the priority-order list below picks the anchor *coffee* via process + variety, but the starting *energy* on that anchor profile is set by moisture/density per the Green Spec table — so a 9.3% moisture honey and an 11% moisture honey anchor on the same profile but start with different early-energy adjustments. For lots where no process-family match exists (e.g. a Daterra Laurina with unfamiliar bean shape), moisture/density alone is a defensible starting point for energy even when the anchor process is uncertain.

Select the anchor profile in priority order:

1. **Exact process + variety match from a resolved lot** → use reference roast profile directly
2. **Same process, different variety from a resolved lot** → use that lot's reference profile, expect process-driven behavior to transfer but variety character to differ
3. **Same process from an active (unresolved) lot** → use that lot's current working hypothesis as anchor, noting it is not yet confirmed. If multiple active-but-unresolved lots share process characteristics, see tie-breaker logic below.
4. **Related process** (e.g. natural coffee, anchor on closest resolved natural) → adjust starting energy per Green Spec → Starting Hypothesis table in [roasting-historian/cluster/patterns/cross-coffee-insights.md § Green Spec → Starting Hypothesis](../../roasting-historian/cluster/patterns/cross-coffee-insights.md#green-spec--starting-hypothesis)
5. **No close match** → anchor on CF-Light (Sudan Rume Washed confirmed) as baseline counterflow profile and scale energy based on density and moisture

**Tie-breaker when multiple active-but-unresolved lots share process characteristics:** Prefer the lot with the most recent empirical data (closest to current machine behavior and current protocol — e.g. a lot whose V2 used the current BBP and 125°C hopper pre-load is a stronger anchor than a lot whose V1 predates those changes). When confidence in the anchor is Low or Medium, the correct response is to widen the v1a/v1b/v1c peak inlet spread rather than to narrow around the anchor. An unresolved anchor with a wide spread is more likely to produce a usable data point than a resolved-looking anchor with a narrow spread that misses the coffee entirely.

**Cross-coffee transfer caveat:** Per the Cross-Coffee Insight Layer guidance, patterns should be treated as hypotheses until confirmed across three or more lots. When anchoring V1 on a related (but not identical) coffee, design V1 to *test* the transfer rather than assume it. The A/B/C spread should be wide enough that if the anchor is wrong, one of the three batches still lands in a usable zone.

## Step 4 — V1 Design Output

Claude produces the following for every new lot V1 design:

- **Shared constants table** (BBP, charge temp, standard 125°C hopper load for all three batches — no session-position compensation by default, fan curve, drop target, dev time safety net, FC marking protocol, preheat). See [roest-knowledge/cluster/protocols/between-batch-protocol.md](../../roest-knowledge/cluster/protocols/between-batch-protocol.md) for the canonical Between Batch Protocol + Hopper Pre-Load Timing.
- **Three inlet profiles (v1a/v1b/v1c)**, using the Standard Inlet Curve Template timestamps with only the seven inlet values differing across batches (see [roest-knowledge/cluster/protocols/fan-strategy.md](../../roest-knowledge/cluster/protocols/fan-strategy.md) for the template). Profile names in the Roest UI follow the format "[Lot short name] v1a", "[Lot short name] v1b", "[Lot short name] v1c" (e.g. "Higuito Anaerobic v1a") so experiment set identity is visible in the machine itself.
- **Expected outcome table** (FC time/temp, drop temp, dev time, Agtron WB, WB-to-ground delta prediction per batch).
- **Failure boundary definitions** (specific temperature and time breakpoints that invalidate a batch as a data point).
- **Batch ordering recommendation** (anchor/midpoint batch first for most consistent session position; outer batches second and third). No session-position compensation applied — thermal reset protocol handles starting drum temp equalization.
- **Full pre-filled `experiments` row** (all columns populated except Observed Outcomes and Winner, which come from the session debrief and Day 7 evaluation). Columns retain A/B/C labels (Observed Outcome A, B, C) for archive-import compatibility — the v1a/v1b/v1c naming lives in the Roest profile names and session notes, while the schema remains unchanged.
- **Explicit list of what V1 does NOT answer** (reserves V2/V3 scope).

## Naming Conventions

Experiment sets are numbered sequentially per lot (V1, V2, V3…) with three batches per set labeled a/b/c:

- First experiment set: v1a, v1b, v1c
- Second experiment set: v2a, v2b, v2c
- Third experiment set: v3a, v3b, v3c
- Subsequent sets follow the same pattern (v4a/b/c, v5a/b/c, etc.)

**Where each label lives:**

- **Roest profile names** — use the lot short name followed by the batch label (e.g. "Higuito Anaerobic v1a"). This keeps experiment set identity visible on the machine itself and prevents mixing profiles across batches during a session.
- **Session notes and conversation context** — use v1a/v1b/v1c labels throughout session debriefs, Claude conversations, and experiment hypotheses. This matches the Roest profile names and keeps reasoning unambiguous.
- **Database columns** — retain A/B/C labels (`observed_outcome_a`, `observed_outcome_b`, `observed_outcome_c`, `delta_from_roast_a`, etc.). These column names are import-compatible with the archive app and must not change. The v1a/v1b/v1c labels appear in the Roest Batch #s and Context cells, not as column renames. Translation is implicit: v1a → A, v1b → B, v1c → C.

Claude uses v1a/v1b/v1c in all conversational output (V1 design, session debrief responses, next-experiment hypotheses). When writing to the `experiments` table, Claude maps v1a → A, v1b → B, v1c → C without requiring explicit instruction.

## Parallel Experiment Considerations

When running experiments across multiple lots in parallel:

- **Session rule:** do not mix lots within a single session. Each session targets exactly one lot and one experiment set (A/B/C). This keeps session-position effects and thermal drift isolated to a single coffee.
- **Evaluation cadence:** Day 7 pourover evaluations can be stacked across lots within a single sitting (up to 3 batches per session, 4 possible but not preferred). Across lots, the xbloom recipe stays identical — only the dose and grind setting need resetting.
- **Context handoff:** when bootstrapping a new claude.ai session focused on a specific active lot, paste the lot's green bean spec, the most recent experiments record for that lot, and a one-line status ("V2 complete, V3 not yet executed, working hypothesis: [X]"). Even better: just reference the lot by `lot_id` and let the operational prompt fetch the substrate via MCP. This is sufficient context for V-next design without re-reading the full master doc set.
- **Bake-off planning:** when two different lots approach reference-roast declaration near the same time, schedule a direct comparison brew session rather than relying on cross-session memory. Day 4 cupping staleness applies equally across lots.

## Cross-references

- [SKILL.md](../SKILL.md) — Roasting Assistant role + Phase 1/2/3 framing summary
- [coordinator/catalog.md § roasting-domain-principles](../../coordinator/catalog.md) — Roasting Philosophy + V-set methodology framing
- [coordinator/operator-guide.md](../../coordinator/operator-guide.md) — canonical lookups + MCP server how-to + session debrief paste template
- [roasting-historian/cluster/patterns/cross-coffee-insights.md § Green Spec → Starting Hypothesis](../../roasting-historian/cluster/patterns/cross-coffee-insights.md#green-spec--starting-hypothesis) — Step 3 anchor energy-adjustment substrate
- [roest-knowledge/cluster/protocols/between-batch-protocol.md](../../roest-knowledge/cluster/protocols/between-batch-protocol.md) — BBP + Hopper Pre-Load
- [roest-knowledge/cluster/protocols/fan-strategy.md](../../roest-knowledge/cluster/protocols/fan-strategy.md) — Standard Inlet Curve Template
- [roest-knowledge/cluster/protocols/fc-marking.md](../../roest-knowledge/cluster/protocols/fc-marking.md) — FC marking protocol
- [docs/prompts/start-lot.md](../../../prompts/start-lot.md) — operational entry surface (V-set lots)
- [docs/prompts/one-shot.md](../../../prompts/one-shot.md) — operational entry surface (one-shot calibration lots)
