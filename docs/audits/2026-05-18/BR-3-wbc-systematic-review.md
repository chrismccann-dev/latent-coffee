# BR-3 — WBC systematic review report

**Source**: [grilling-2026-05-15-brewing-followups.md item #3](docs/sprints/grilling-2026-05-15-brewing-followups.md)
**Sprint**: T5 (2026-05-18)
**Decision**: **Latent's 6 + 4 + Hybrid-subforms vocabulary is the right starting point.** 1 minor promotion candidate; rest stay deferred per Chris's intentional non-add framing.

## Question

Per round 3 of the 2026-05-15 brewing grilling: a systematic review of the WBC 5 foundational control axes + 9 strategy families + per-family subtypes against Latent's 6 strategies + 4 modifiers + 5 Hybrid sub-forms, to confirm the chosen subset is the right starting point or whether anything should be promoted next. Output is a report, not a code change.

Pairs with [WBC-2 Time Distribution Playbook scoping](docs/audits/2026-05-18/WBC-2-time-distribution-playbook-scoping.md) — the largest promotion-candidate question gets its own scoping doc.

## Latent vocabulary today

| Surface | Count | Source of truth |
| --- | --- | --- |
| Strategies | **6** | `lib/extraction-strategy.ts` — Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid |
| Modifiers | **4** | `lib/extraction-modifiers.ts` `MODIFIER_TYPES` — output_selection (4 forms: early_cut / late_cut / both / dilution) / inverted_temperature_staging / aroma_capture / role_based_pulse |
| Hybrid sub-forms | **5** | sequential / phase_mapped / selective_bloom / intensity_clarity_split / temperature_staged |
| Cross-cutting playbook (doc-layer) | **5** | wbc-reference.md § Cross-Cutting Control Patterns — Time Distribution Practical Playbook / Water Strength / Agitation Taper / Filter Behavior / Pre-Brew Conditioning / Output Selection extended |

## WBC vocabulary

| Surface | Count | Source |
| --- | --- | --- |
| Foundational Control Axes | **5** | Extraction Intensity / Time Distribution / Physical System / External Control / Output Selection |
| Core Strategy Families | **9** (in the 102-recipe corpus) | Hybrid / Flow & Stability / Thermal / Structural / Suppression / Time-Distributed / Immersion / Extraction Push / Output Selection |
| Hybrid subtypes (most-canonical) | 7 | Sequential / Immersion Staging / Phase-Mapped / Selective Bloom / Intensity-Clarity Split / Alternating Phase Control / Temperature-Staged + Temperature-Sandwich + Parametric |

## Mapping audit — axis by axis

### Axis 1 — Extraction Intensity

| WBC concept | Latent absorption | Status |
| --- | --- | --- |
| Suppression intensity | Strategy: Suppression | ✅ Fully absorbed |
| Clarity intensity (low) | Strategy: Clarity-First | ✅ Fully absorbed |
| Balanced intensity (middle) | Strategy: Balanced Intensity | ✅ Fully absorbed |
| Body / sweetness intensity (high) | Strategy: Full Expression | ✅ Fully absorbed |
| Yield-push intensity (high + clarity) | Strategy: Extraction Push | ✅ Fully absorbed |

**Verdict**: Axis 1 is the most thoroughly absorbed. The 6-strategy enum IS Axis 1 with Hybrid as the meta-strategy for combining intensities across phases.

### Axis 2 — Time Distribution

| WBC concept | Latent absorption | Status |
| --- | --- | --- |
| Role-based pulse (percolation-only) | Modifier: `role_based_pulse` (v8.5) | ✅ Fully absorbed |
| Phase-mapped (immersion / Hybrid) | Hybrid sub-form: `phase_mapped` | ✅ Fully absorbed |
| Drain-based pulse | Implicit in SWORKS valve work; doc-only | ⚠️ Partially absorbed |
| Fixed pulse | Doc-only (Cross-Cutting Playbook template) | ⚠️ Partially absorbed |
| Double bloom | Doc-only | ⚠️ Partially absorbed |
| Short-long-short | Doc-only | ⚠️ Partially absorbed |
| Parametric Hybrid | Deferred per wbc-reference.md | ⛔️ Out of scope (blend territory) |

**Verdict**: Most under-served axis at the *recipe* level. 34 of 102 recipes use Time Distribution as a secondary control. Promotion candidate is the broader Time Distribution Playbook — covered in [WBC-2 scoping](docs/audits/2026-05-18/WBC-2-time-distribution-playbook-scoping.md). Recommendation deferred to that doc; do not promote in T5.

### Axis 3 — Physical System

| WBC concept | Latent absorption | Status |
| --- | --- | --- |
| Layered bed by component | Out of scope (blend-specific) | ⛔️ Consciously not pursuing |
| Dual-chamber / wet-blended | Out of scope (blend stagecraft) | ⛔️ Consciously not pursuing |
| Roast-based structuring | Out of scope (single-origin) | ⛔️ Consciously not pursuing |
| Mesh-then-paper transitions | Out of scope (geometry not available) | ⛔️ Consciously not pursuing |

**Verdict**: Single-origin home brewing context legitimately blanks this axis. Direct adoption would produce empty / single-valued schema columns — exact category bloat the WBC reference's "don't bite the bullet" framing protects against. Status: stay out of scope; no promotion candidate.

### Axis 4 — External Control

| WBC concept | Latent absorption | Status |
| --- | --- | --- |
| Inverted temperature staging | Modifier: `inverted_temperature_staging` | ✅ Fully absorbed |
| Aroma capture (Paragon ball, etc.) | Modifier: `aroma_capture` | ✅ Fully absorbed |
| Melodrip (flow stabilization) | Implicit inside Clarity-First + Extraction Push | ⚠️ Tool-not-modifier |
| Cooling-curve design | BREWING.md `cooling_curve_target` field | ⚠️ Doc-only schema field; no modifier |
| Filter-mediated flow | Cross-Cutting Playbook (Filter Behavior) | ⛔️ Consciously not pursuing as foundational axis |
| Pre-brew conditioning | Cross-Cutting Playbook (Tier 2 future-capture) | ⛔️ Consciously not pursuing |

**Verdict**: 2 modifiers cover the structural cases (ITS + aroma capture); flow tools live inside strategies; filter + pre-brew stay in the doc layer. Promotion candidates would each have to clear the "would a real-data field land as something other than null on 80%+ of brews" filter — none currently does. No promotion candidate.

### Axis 5 — Output Selection

| WBC concept | Latent absorption | Status |
| --- | --- | --- |
| Front cut | Modifier form: `early_cut` | ✅ Fully absorbed |
| Back cut | Modifier form: `late_cut` | ✅ Fully absorbed |
| Both | Modifier form: `both` | ✅ Fully absorbed |
| Post-brew dilution | Modifier form: `dilution` (v8.5) | ✅ Fully absorbed |
| Bloom separation | Hybrid sub-form: `selective_bloom` | ✅ Fully absorbed (correctly placed in strategy, not modifier) |

**Verdict**: Axis 5 is the most surgically mapped — 4 forms on the modifier + 1 sub-form on Hybrid. Fully covered.

## Family-by-family promotion check

| WBC family | Population in corpus | Latent absorption | Promote? |
| --- | --- | --- | --- |
| Hybrid Systems | 18 (largest) | Strategy + 5 sub-forms | Already promoted; no gap |
| Flow / Stability | 14 | Inside Clarity-First + Extraction Push | No (tool, not strategy) |
| Thermal | 8 | 1 modifier (ITS) + 1 Hybrid sub-form (temp-staged) | No additional gap |
| Structural (sum) | 24 | Out of scope | No (consciously not pursuing) |
| Suppression | 6 | Strategy | Already promoted; no gap |
| Time-Distributed | 9 (primary) / 34 (any) | 1 modifier + 1 Hybrid sub-form + doc-layer playbook | **See WBC-2 scoping** |
| Immersion (standalone) | 5 | Hybrid sub-form: sequential (degenerate full-immersion) | No (correctly subsumed) |
| Extraction Push | 5 | Strategy | Already promoted; no gap |
| Output Selection (standalone) | 1 | Modifier (4 forms) + Hybrid sub-form (selective_bloom) | No additional gap |

## Net new candidates (from BR-3 alone — WBC-2 separate)

After mapping the full WBC corpus, the only structural gap surfaced by this audit (separate from WBC-2's specific question) is:

### Candidate: `cooling_curve_design` modifier

**Source**: WBC reference Axis 4 — cooling-curve design is one of 8 Thermal Systems patterns. Today it lives as a free-text `brews.cooling_curve_target` column populated on rare brews.

**Pros for promotion**:
- Structurally analogous to `inverted_temperature_staging` (also a single-free-text-field modifier).
- Specific enough to be a deliberate decision when used.

**Cons for promotion**:
- Population rate today is very low (< 5% of brews).
- Already has a schema field; the "is this a modifier or a column" question would just rename the same data.
- Promoting adds form drag on `/add` + `/edit` + ModifierComposer without unlocking real new signal.

**Decision: Do not promote.** The existing `cooling_curve_target` text column is the right home. Keep as field-not-modifier until population rate hits ~20% or a clear taxonomy-of-cooling-curves emerges from the brewing corpus.

## Overall recommendation

**Latent's 6 strategies + 4 modifiers + 5 Hybrid sub-forms + 5 cross-cutting doc-layer patterns is the right starting point.** The WBC corpus shifts the relative weights (Hybrid emerged as the largest cluster, Time Distribution shows up in 34/102 as some control logic) but Latent's compression strategy — fold axes 2-5 mechanics into the modifier + Hybrid surface, leave axis 3 out of scope, keep extras in the doc layer — remains structurally sound at this corpus size.

**One promotion candidate (Time Distribution Playbook) is non-trivial enough to deserve its own scoping doc** — see [WBC-2](docs/audits/2026-05-18/WBC-2-time-distribution-playbook-scoping.md). Recommendation lives there; T5 is no-registry-edits.

**Re-test trigger**: if any of these signals lands, re-run this audit:

1. A brewing-side sprint adds a 7th strategy or a 5th modifier (the next promotion event itself).
2. Corpus crosses ~150 brews AND the long tail of Cross-Cutting Playbook templates shows up in ≥3 brews each (signal that a 5th modifier is earning its keep).
3. A cross-coffee insight emerges that the existing 6+4 vocabulary cannot articulate cleanly.

## Out of scope for T5

- The Time Distribution Playbook scoping (separate doc, [WBC-2](docs/audits/2026-05-18/WBC-2-time-distribution-playbook-scoping.md)).
- Any registry edit in `lib/extraction-modifiers.ts`.
- Any BREWING.md vocabulary expansion.
