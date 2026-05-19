# CR-6 — Roaster strategy tag ↔ brew extraction strategy vocabulary-coherence audit

**Source**: [grilling-2026-05-16-canonical-registries-followups.md item #6](../../sprints/grilling-2026-05-16-canonical-registries-followups.md) + [CONTEXT.md flagged ambiguity line 1518](../../../CONTEXT.md)
**Sprint**: T5 (2026-05-18)
**Decision**: **The two vocabularies should NOT be force-aligned. They describe different things. Lock the distinction in CONTEXT.md; no rename sprint.**

## Question

Per round 12C of the 2026-05-16 canonical-registries grilling: "my Clarity-First when I brew should match Clarity-First on a roaster's house style." Today's alignment is partial:

- `CLARITY-FIRST` ↔ `Clarity-First` align in concept
- `FULL EXPRESSION` ↔ `Full Expression` align in concept
- Brew `Suppression` / `Extraction Push` / `Hybrid` have no direct roaster-tag equivalent
- Roaster `SYSTEM` / `VARIES` / `SELF-ROASTED` have no brew equivalent
- Case-style divergence: `UPPERCASE-WITH-DASHES` (roaster) vs `Title Case` (brew)

Output: audit doc + alignment proposal.

## Vocabularies in full

### Brew `extraction_strategy` (6 canonical, [lib/brew-import.ts:92](../../../lib/brew-import.ts))

| Value | Mechanics |
| --- | --- |
| `Suppression` | Coarse + low-temp + low-agitation to hold an over-expressive coffee back |
| `Clarity-First` | Coarse + low-temp + low-agitation to protect a delicate cup |
| `Balanced Intensity` | Mid-grind + mid-temp + moderate agitation |
| `Full Expression` | Fine + hot + high agitation |
| `Extraction Push` | Fine + hot + Melodrip / low agitation |
| `Hybrid` | Multi-phase, with required sub-form |

### Roaster `strategyTag` (11 canonical, [lib/roaster-registry.ts:25](../../../lib/roaster-registry.ts))

| Value | Maps to family | Notes |
| --- | --- | --- |
| `CLARITY-FIRST` | Clarity-First | Roaster's house default |
| `CLARITY-FIRST → BALANCED` | Clarity-First | Roaster tilts clarity-first but accepts balanced on heavier processes |
| `BALANCED` | Balanced | Roaster's house default is balanced |
| `BALANCED → CLARITY` | Balanced | Roaster tilts balanced but pushes clarity on lighter coffees |
| `BALANCED → FULL` | Extraction-Forward | Roaster tilts balanced but pushes toward full expression on heavier coffees |
| `BALANCED → HIGH` | Extraction-Forward | Roaster tilts balanced but pushes toward high-yield on certain coffees |
| `FULL EXPRESSION` | Extraction-Forward | Roaster's house default is full expression |
| `SYSTEM` | System | Roaster's identity is built around control logic, not a fixed extraction recipe |
| `VARIES` | Varies | Roaster varies per coffee with no house default |
| `BALANCED / VARIES` | Varies | Roaster mostly balanced but varies per coffee on edges |
| `SELF-ROASTED` | Self-Roasted | Chris's own roasting; not a roaster-driven extraction direction |

## Audit findings

### Finding 1 — The two vocabularies describe different things

`brews.extraction_strategy` is a **post-brew tasting attestation** — "this is what the cup landed at." It's an output of the iteration loop. Six canonical values; required NOT NULL on every brew.

`roasters.strategyTag` is a **pre-brew house default** — "this is how I think the roaster wants the brew to go." It's an input to the Coffee Brief Step 1c roaster-signal. Eleven canonical values including directional shifts (X → Y) and meta-categories (SYSTEM / VARIES / SELF-ROASTED).

The conceptual mismatch is structural, not cosmetic:

- A roaster's `CLARITY-FIRST → BALANCED` strategy tag isn't a brew strategy — it's a *region of strategy space* the roaster operates in. The brew that resolves it tastes as either Clarity-First or Balanced Intensity (or any other strategy if the roaster signal got overridden by variety / process / Coffee Brief Step 1c arbitration).
- A roaster's `SYSTEM` tag (Subtext, Picky Chemist, Ona, Rose, Noma) says "I have repeatable control logic — pick from my notes." That doesn't reduce to a single brew strategy either.
- A roaster's `VARIES` tag explicitly says "no house default." That's a roaster-side signal, not a brew-side outcome.

### Finding 2 — Case-style divergence is deliberate, not drift

`UPPERCASE-DASH` on roaster tags is the DB-side `roaster.strategyTag` value (e.g. `'CLARITY-FIRST'`). `Title Case` on brew strategies is the DB-side `brews.extraction_strategy` value (e.g. `'Clarity-First'`). The case-style signals which side of the schema the value lives on. Renaming for case-only consistency would lose that signal AND require a migration on `roasters` + every reference in `lib/roaster-registry.ts`.

### Finding 3 — The 3 brew-side "missing" tags (Suppression / Extraction Push / Hybrid) are legitimate

The grilling framed these as gaps. They aren't.

- **Suppression** is a brew-specific intent (hold an over-expressive coffee back). No roaster bakes "Suppression" into their house style; suppression is a brew-time decision driven by the COFFEE, not the roaster. Reasonable that no roaster carries it as a house tag.
- **Extraction Push** is a niche brew style (Wölfl / Tran / Giachgia pattern). 1 brew uses it across the 82-brew corpus. No roaster has a "PUSH" house tag because the technique is too narrow to be a default.
- **Hybrid** is also a brew-time decision driven by the COFFEE + the brewer (Switch / SWORKS). Roasters don't bake "Hybrid" into their house style.

### Finding 4 — The 4 roaster-side "extra" tags (SYSTEM / VARIES / BALANCED → X / SELF-ROASTED) are also legitimate

Same logic.

- **SYSTEM** captures roasters whose identity is built around control logic, not a fixed extraction recipe. The brew side doesn't have an equivalent because every brew DOES resolve to a single strategy.
- **VARIES** captures roasters who genuinely vary per coffee. Per-brew the resolution still happens; per-roaster the default is uninformative.
- **BALANCED → X** captures directional shifts (X → Y). Brews don't shift mid-brew; the brew lands in one strategy.
- **SELF-ROASTED** captures Chris's own coffees. The brew side doesn't tag self-roasted brews with a special strategy because the brewing decision is independent of the self-roast/purchased provenance.

## Decision

**Do not force-align. Lock the distinction.**

The two vocabularies describe different things at different lifecycle stages:

- `roaster.strategyTag` is a **roaster-default signal** (input to Step 1c, 11 canonicals including directional + meta values)
- `brews.extraction_strategy` is a **brew-resolved outcome** (output of the iteration loop, 6 canonicals — no directional, no meta)

Forcing alignment (either by adding directional + meta to brews, or by reducing roasters to 6 simple values) would erase real signal in one direction or the other. A future reader who looks at the two vocabularies side-by-side should see the distinction is principled, not drift.

## Recommended action

1. **Lock the distinction in CONTEXT.md.** Resolve the flagged ambiguity at [CONTEXT.md line 1518](../../../CONTEXT.md) — the resolution is "both vocabularies are correct as-is; they describe distinct lifecycle stages. Roaster strategy tag is a house-default signal; brew extraction strategy is a per-brew resolved outcome."
2. **Lightweight cross-mapping table** in BREWING.md or wbc-reference.md that surfaces the most-common "this roaster tag tends to resolve to that brew strategy" pattern. NOT a forcing rule — descriptive only, so claude.ai's Coffee Brief Step 1c can lean on it as the roaster-signal.

```
CLARITY-FIRST            → Clarity-First (default) | Balanced Intensity (on heavier processes)
CLARITY-FIRST → BALANCED → Balanced Intensity (default) | Clarity-First (on light coffees)
BALANCED                 → Balanced Intensity
BALANCED → CLARITY       → Balanced Intensity | Clarity-First on lighter coffees
BALANCED → FULL          → Balanced Intensity | Full Expression on heavier coffees
BALANCED → HIGH          → Balanced Intensity | Full Expression (yield-leaning)
FULL EXPRESSION          → Full Expression
SYSTEM                   → use roaster-specific notes
VARIES                   → use coffee-specific signals only
BALANCED / VARIES        → Balanced Intensity (default) | varies per coffee
SELF-ROASTED             → use Chris's iteration loop directly
```

3. **No case-style migration.** UPPERCASE-DASH stays on roaster strategyTag; Title Case stays on brew extraction_strategy. The case distinction encodes the side of the schema and would be lost on rename.

## Pairs with

- [CR-13 + MCP-3 strictness mapping](CR-13-MCP-3-canonical-strictness-mapping.md) — both vocabularies are strict-static enums; their strictness tier is in the strictness audit.
- The CONTEXT.md flagged-ambiguity close — closes line 1518 inline at sprint close-out.

## Out of scope for T5

- The cross-mapping table in BREWING.md / wbc-reference.md (Recommendation 2). Doc-edit lands in a future BREWING.md / wbc-reference.md update sprint — most natural ride-along is Sprint 9 (Roasting cluster doc edits) or a future v8.6 brewing taxonomy sprint.
- Any registry edit or migration.

T5 ships the audit + CONTEXT.md flagged-ambiguity close only.
