# WBC-2 — Time Distribution Playbook canonical-modifier promotion scoping

**Source**: [grilling-2026-05-16-wbc-followups.md item #2](../../sprints/grilling-2026-05-16-wbc-followups.md)
**Sprint**: T5 (2026-05-18)
**Pairs with**: [BR-3 WBC systematic review](BR-3-wbc-systematic-review.md)
**Decision**: **Stay deferred at MODIFIER_TYPES=4. Recommend promoting `time_distribution_pattern` as a 5th modifier ONLY when a population threshold is met (~3 brews using a non-`role_based_pulse` template).**

## Question

Per round 7 of the 2026-05-16 WBC grilling, Chris feels he's already practicing Time Distribution Playbook patterns (especially via SWORKS valve work + Phase-Mapped Hybrid sub-form). The Role-Based Pulse modifier (v8.5) already captures part of the surface; remaining patterns (fixed pulse / drain-based pulse / double bloom / short-long-short) live at doc-layer. Should the broader playbook earn promotion to a canonical Axis 2 modifier?

Implementation explicitly deferred to a v8.6 brewing taxonomy sprint per the kickoff brief — this doc is the scoping decision only.

## The 5 doc-layer templates

From [wbc-reference.md § Time Distribution Practical Playbook](../../brewing/wbc-reference.md):

| Template | Today's home | Latent absorption | Population? |
| --- | --- | --- | --- |
| **Fixed pulse** | Doc-only | Strategy_notes free-text | ~0 brews use the name explicitly |
| **Role-based pulse** | Canonical modifier `role_based_pulse` | ✅ Promoted v8.5 | Some brews populate |
| **Drain-based pulse** | Implicit in SWORKS valve work | Strategy_notes free-text | All SWORKS brews implicitly; not labeled |
| **Double bloom** | Doc-only | Strategy_notes free-text | ~0 brews use the name explicitly |
| **Short-long-short** | Doc-only | Strategy_notes free-text | ~0 brews use the name explicitly |

The promotion surface, if it lands, would be either:

**Option A: Per-template modifier types**

Five separate ModifierType enum members: `fixed_pulse` / `role_based_pulse` (already exists) / `drain_based_pulse` / `double_bloom` / `short_long_short`. Each has its own narrow sub-fields.

**Pros**: precise. Each template's distinct fields surface naturally.
**Cons**: surface bloat (5 chips on the picker for axis-2 alone). Most population would stay near-zero per template. Three of five would carry < 5 brews each through year 1.

**Option B: One `time_distribution_pattern` modifier with `template` enum**

```ts
interface TimeDistributionPatternModifier {
  type: 'time_distribution_pattern'
  template: 'fixed_pulse' | 'drain_based_pulse' | 'double_bloom' | 'short_long_short'
  // role_based_pulse stays a separate modifier (already promoted v8.5)
  pour_structure?: string | null  // free-text describing the specific structure
}
```

**Pros**: one new modifier chip; per-template detail lives in the enum value + free-text. Closer to how Chris actually thinks about these ("this brew is a double-bloom Clarity-First").
**Cons**: harder to render compact labels (the chip's "head" would be the template name, not the modifier type). Mild conceptual overlap with `role_based_pulse` (both are "time distribution" patterns).

**Option C: Defer until population threshold (Recommended)**

Stay at MODIFIER_TYPES=4. Continue surfacing the templates in the doc layer via `strategy_notes`. Promote a 5th `time_distribution_pattern` modifier (per Option B's shape) ONLY when at least one non-`role_based_pulse` template shows up in ~3 brews — at that point the pattern has demonstrated it earns its keep.

**Pros**: defends against category bloat. Promotion criterion matches Chris's framing that promotion is operator-driven, not system-driven. Honors WBC-reference's "deliberate non-add" framing on Time Distribution as a foundational axis.
**Cons**: continues to under-label drain-based pulse on SWORKS brews (currently implicit, no label). If cross-coffee learning calls for "show me all my drain-based-pulse brews", that query cannot be answered today.

## Recommendation

**Option C — Stay deferred.** Three reasons:

1. **Population evidence is missing.** None of the 4 non-`role_based_pulse` templates has 3+ brews using the named pattern today. Promotion-before-population would create category bloat the WBC reference's framing explicitly protects against.
2. **Free-text `strategy_notes` already captures the signal.** Brews using fixed-pulse or double-bloom patterns can — and historically do — populate `strategy_notes` with the structure. Cross-coffee learning queries today are LLM-read of prose, not structured-column aggregation. The chip surface would add form drag without unlocking aggregation Chris is asking for.
3. **`role_based_pulse` is the right precedent.** v8.5 promoted ONE template (the most-populated one) once the percolation-vs-immersion split made the case clear. The other 4 templates haven't earned the same threshold.

## Promotion criteria (if/when revisited)

The promotion threshold for `time_distribution_pattern` as MODIFIER_TYPES[5]:

1. **At least one** of `fixed_pulse` / `drain_based_pulse` / `double_bloom` / `short_long_short` shows up in **3+ brews** (the standard "earns a sub-page" Latent threshold).
2. **AND** a cross-coffee learning question is asked that the prose-shaped `strategy_notes` cannot answer ("which of my drain-based-pulse brews are Clarity-First vs Suppression?").
3. **AND** the chip-on-picker form drag is acceptable to Chris.

Until all three trigger, the playbook stays in the doc layer.

## Implementation shape (when triggered)

For when the promotion lands in a future v8.6 brewing taxonomy sprint:

```ts
// lib/extraction-modifiers.ts
export const MODIFIER_TYPES = [
  'output_selection',
  'inverted_temperature_staging',
  'aroma_capture',
  'role_based_pulse',
  'time_distribution_pattern',  // NEW
] as const

export const TIME_DISTRIBUTION_TEMPLATES = [
  'fixed_pulse',
  'drain_based_pulse',
  'double_bloom',
  'short_long_short',
] as const
export type TimeDistributionTemplate = (typeof TIME_DISTRIBUTION_TEMPLATES)[number]

export interface TimeDistributionPatternModifier {
  type: 'time_distribution_pattern'
  template: TimeDistributionTemplate
  pour_structure?: string | null
}
```

Surface deltas: `ModifierComposer` adds a 5th chip option; `ModifierBadges` adds template-aware label rendering; `composeModifierLabel` adds the template-first head shape; `cleanModifiers` validates the new shape.

**Migration**: no `brews.modifiers` jsonb migration needed — the existing column accepts the new shape via the cleanModifiers extension.

**No new column on `brews`.** Time Distribution patterns persist as `brews.modifiers[].template`, not a top-level column.

## What changes about today's `role_based_pulse` modifier?

When the broader promotion lands, `role_based_pulse` could collapse into `time_distribution_pattern` as a 5th template value (`'role_based_pulse'`). Alternative: keep it separate because the structural semantics differ ("each pour has a sensory role" vs "pour structure follows a named template").

**Recommendation at promotion time**: keep separate. `role_based_pulse` is the only template where the per-pour structure is the load-bearing decision; the others are about *when* extraction happens, not *what role* each pour plays. Distinct conceptual axis → distinct modifier.

## Out of scope for T5

- Any registry edit in `lib/extraction-modifiers.ts`.
- BREWING.md vocabulary expansion.
- Any persistence layer change.

Pure scoping doc. The promotion event (if it lands) is a future v8.6 brewing taxonomy sprint, triggered on the criteria above.
