# 0015 — Accessory-aware FilterEntry flowRate + BoosterEntry registry concept

## Context

Research Project #2 (flat-bottom filter drawdown, closed 2026-05-24 in [PR #238](https://github.com/chrismccann-dev/latent-coffee/pull/238)) surfaced two related registry-shape gaps that this ADR captures as locked decisions, with implementation deferred until usage data justifies the shape:

1. **`FilterEntry.flowRate` is a single qualitative string per paper.** Real flow rate is configuration-dependent. Project #2 measured the same B3 fiber draining in 48.5s free-seated in Orea vs ~127s if Negotiator-compressed — 2.6× speed difference under one `flowRate: "Medium"` label. Project #2 Audit Item #1.

2. **No registry representation for flow-modifying accessories.** Chris owns 3 Sibarist Boosters (per Project #2 handoff brief, 2026-05-24): BOOSTER 45 for flatbed drippers (Orea V3/O1, Kalita 155/185, Fellow, April), BOOSTER CONE for V60, BOOSTER UFO for UFO dripper. Each modifies the brewer-paper interaction. Project #2 measured the BOOSTER 45 effect as paper-specific (−75.5s on FLAT 2 B3, only −12s on FLAT 2 FAST — possibly confounded with paper size, see Project #2 Audit Item #9). Project #2 Audit Item #4.

These are interrelated: a context-conditional flowRate field is the natural home for accessory-aware measurements; a BoosterEntry registry is what those measurements reference.

## Decision

Both decisions locked; implementations deferred to a future PR when the trigger condition fires (see § Implementation trigger below).

### Decided shape — `FilterEntry.flowRateContexts` (new optional field)

```ts
flowRateContexts?: Array<{
  brewer: string                          // canonical brewer name; e.g. "Orea v4" / "Hario V60-01" / "Funnex"
  seatingState: 'compressed' | 'free-seating'
  accessory?: string                      // pointer to BoosterEntry.sku (or null for no accessory)
  measuredDrawdownSec: number
  measurementDose: string                 // mirror existing FilterEntry measurement-string convention ("15g")
  measurementBaseline?: string
  measurementDate?: string
  measurementProject?: string
}>
```

Back-compat: existing `flowRate: string` preserved as the default-context summary. Pre-existing `measuredDrawdownSec` + `measurementDose` + etc. on FilterEntry (Project #1 shipping) remain as the primary-measurement single-context fields; `flowRateContexts` is for when a paper has been measured in multiple configurations.

### Decided shape — `BoosterEntry` (new top-level canonical registry)

```ts
export interface BoosterEntry {
  name: string
  manufacturer: string
  sku: string
  link?: string
  fitsBrewers: string[]
  geometryFamily: 'flat' | 'cone' | 'ufo' | 'other'
  diameter?: string                       // "45mm" / "60mm" / "UFO-specific" etc.
  owned?: boolean
  location?: string
  primaryUseCase?: string
  measurementNote?: string                // mirror FilterEntry pattern; capture per-Booster context
}
```

New file: `lib/booster-registry.ts`. Pattern symmetric with `FilterEntry` / `BrewerEntry` / `GrinderEntry` / `SworksEntry` — each major equipment class is its own canonical registry.

### Substrate to seed when implemented

Chris's owned boosters (recorded here so future implementer doesn't have to re-derive from session transcripts):

| Name | SKU | Manufacturer | Fits brewers | Geometry family | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- |
| BOOSTER 45 | `BOOSTER-45` | Sibarist | Orea V3, Orea O1, Kalita 155/185, Fellow, April, similar flatbeds | flat | 45mm flatbed-diameter. Used in Project #2 exploratory pulls (Pull 8 + 9). |
| BOOSTER CONE | `BOOSTER-CONE` | Sibarist | Hario V60 | cone | 60° apex; not used in Project #1 or #2. |
| BOOSTER UFO | `BOOSTER-UFO` | Sibarist | Sibarist UFO dripper | ufo | UFO-specific 80° apex; not yet used in a research project. |

All `owned: true`, `location: "Home"`. Manufacturer URLs:
- https://sibarist.coffee/en-es/products/booster-45
- https://sibarist.coffee/en-es/products/booster-cone
- https://sibarist.coffee/en-es/products/booster-ufo

### Backfill targets when implemented

Project #2's exploratory Booster pulls (currently captured in `measurementNote` text only) should backfill into the new `flowRateContexts` arrays:

| Filter SKU | Brewer | Seating | Accessory | Drawdown | Project |
| :---- | :---- | :---- | :---- | :---- | :---- |
| FLAT2-B3 | Orea v4 | compressed | BOOSTER-45 | 52s | flat-bottom-filter-drawdown |
| FLAT2-FAST | Orea v4 | compressed | BOOSTER-45 | 105s | flat-bottom-filter-drawdown |

The existing `measuredDrawdownSec` on each FilterEntry should remain as the no-accessory default-context measurement (FLAT2-B3 = 127.5s; FLAT2-FAST = 117s).

## Implementation trigger

Per Project #2's Audit Item #1 trigger condition: implement when **either** (a) a third independent measurement project confirms context-dependence, **or** (b) a brewing-side query needs context-conditional flowRate, **or** (c) a second flow-modifying accessory (beyond Sibarist's 3 Boosters) enters inventory.

Project #3 (specialty cone filter drawdown — Funnex + Sibarist HALO, queued post-2026-05-24) is unlikely to need Booster registry per Chris's inventory (Boosters fit flatbed/V60/UFO geometry; Project #3 covers Funnex + Sibarist BS HALO, neither of which Booster-fits). The third independent confirmation will likely come from regular brewing-side Booster usage logged via `brews.filter` rows, not a Project #4.

When the trigger fires, the implementer should:

1. Add `BoosterEntry` type + canonical registry to `lib/booster-registry.ts` (new file)
2. Seed with the 3 owned boosters per § Substrate to seed table above
3. Extend `FilterEntry` type with `flowRateContexts` per § Decided shape
4. Backfill Project #2's exploratory Booster pulls per § Backfill targets table
5. Update cluster docs:
   - `docs/skills/brewing-equipment-expert/cluster/filters.md` — per-paper `flowRateContexts` surface
   - New `docs/skills/brewing-equipment-expert/cluster/boosters.md` — authoritative authored content for BoosterEntry registry (mirror pattern of `brewers.md` / `filters.md` / `grinder-eg1.md` / `sworks.md`)
6. Add `boosters.md` to `lib/mcp/docs.ts` `DOC_FILES` (per [feedback_register_reference_docs_in_mcp.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_register_reference_docs_in_mcp.md))
7. Run `npm run check:mcp-bundle` to verify Resource bundling

## Pattern reference

`SworksEntry` sub-taxonomy (Sprint T5 / CR-7, 2026-05-18, at [lib/sworks-registry.ts](../../lib/sworks-registry.ts) + [docs/skills/brewing-equipment-expert/cluster/sworks.md](../skills/brewing-equipment-expert/cluster/sworks.md)) is the closest pattern precedent — single-canonical sub-registry for owned-instrument enumerated entries (SworksEntry has per-dial enumeration; BoosterEntry doesn't need per-position enumeration since Boosters are binary on/off, but the top-level-equipment-class-gets-its-own-registry pattern is the same).

## Sources

- Research Project #2 close-out ([PR #238](https://github.com/chrismccann-dev/works) / 2026-05-24): Headline Finding #4 (Registry's flowRate labels are misleading — incomplete, not wrong); Headline Finding #3 (Booster effect is paper-specific); Audit Items #1 + #4
- Project #2 handoff brief (2026-05-24): Chris-confirmed booster inventory (BOOSTER 45 / CONE / UFO)
- Pattern precedent: SworksEntry sub-taxonomy (Sprint T5 / CR-7, 2026-05-18)
- Chris-locked at Project #3 prep session (2026-05-24): "yes we should do this, I actually have quite a few boosters"

---

## Project #3 substrate updates (2026-05-25)

Research Project #3 (specialty cone filter drawdown, closed 2026-05-25) produced two substrate updates to this ADR. Both queued as Project #3 audit items AI-6 + AI-7 and applied directly here while the decision shapes remain implementation-deferred:

### AI-6 — Funnex/Booster fit empirically resolved as NONE

The Implementation trigger section above (originally written 2026-05-24) speculated that Project #3 was "unlikely to need Booster registry per Chris's inventory (Boosters fit flatbed/V60/UFO geometry; Project #3 covers Funnex + Sibarist BS HALO, neither of which Booster-fits)." Project #3's Step 0 equipment cross-check confirmed this empirically: **none of Chris's 3 owned Sibarist Boosters (BOOSTER 45 flatbed / BOOSTER CONE V60 / BOOSTER UFO) physically fit Funnex deep-cone geometry**.

For the Sibarist Brewing System, Boosters are architecturally unnecessary — the BS is a "brewer-as-paper-housing" architectural class (Project #3 Lesson #35) where the paper IS the dripper and no seating accessory is needed.

**Implication for the BoosterEntry registry implementation when triggered:** the `fitsBrewers` array on each BoosterEntry should be treated as the canonical compatibility list, not a starting hint. Funnex + Sibarist BS are explicitly NOT compatible with any current Booster.

### AI-7 — flowRate-triple mechanism refined via Project #3 Lesson #36

The Decided shape section above frames `flowRateContexts` as a context-conditional array indexed by (brewer × seatingState × accessory). Project #3's Lesson #36 (paper "self-choke" is paper-brewer-interaction artifact, not paper-fiber-intrinsic) provides the **mechanistic underpinning** for this design choice that wasn't articulated when the ADR landed.

**Original framing (2026-05-24):** flowRate varies across configuration; the schema needs to capture multiple measurements per paper because the qualitative `flowRate: "Medium"` cell can't represent a 2.6× speed difference between configurations.

**Mechanistic refinement (Project #3 Lesson #36, 2026-05-25):** the configuration-dependence is **not three orthogonal dimensions** (brewer + seatingState + accessory). It's a single dimension — **paper-brewer-INTERACTION at the seating layer**. The brewer + seatingState + accessory triple is a *proxy* for the seating-layer interaction:

- Funnex + V60-geometry paper + no Negotiator-equivalent = high paper-brewer-fit noise (bimodal drawdown, ~80/20 split)
- Orea + flat paper + Negotiator = low paper-brewer-fit noise (tight unimodal drawdown)
- Sibarist BS + system-integrated paper = paper-brewer-fit eliminated (tightest noise floor in arc, 4s range)

**Implications for the `flowRateContexts` implementation:**

1. The schema captured in the Decided shape section is correct — three indexable fields (brewer + seatingState + accessory) cover the visible configuration variance.
2. But documentation accompanying the implementation should clarify that **the underlying mechanism is paper-brewer-interaction at the seating layer**, not three independent effects. This matters for:
   - Query interpretation: a paper without a `flowRateContexts` entry for (brewer X + accessory Y) doesn't necessarily HAVE a different flow rate in that config — it might just be uncharacterized. The triple is *evidence*, not *prediction*.
   - Future schema evolution: if a paper-brewer-fit metric ever lands (e.g. via Project #3 audit items AI-1 `paperFitsBrewerRim` + AI-3 `brewerRole`), that metric should be cross-referenced with `flowRateContexts` interpretation.
3. The `bedBehaviorUnderLoad` enum (originally 4 values: `stable` / `late-forming-crater` / `pour-impact-crater` / `mixed`) gains its first `stable` entries via Sibarist BS measurements (HALO-B3 + HALO-FAST in Project #3) — validating the enum value's design intent. The `mixed` value is now load-bearing for capturing bimodal regimes (CONE28-FAST in Funnex).

### Forward pointer

Research Project #4 (re-measure Project #1 V60 papers in Sibarist BS, scope brief at end of [specialty-cone-filter-drawdown.md](../research-projects/specialty-cone-filter-drawdown.md)) is the empirical test of Lesson #36's "paper-brewer-interaction not paper-fiber" framing. If RP4 confirms V60 papers converge to HALO-B3-like flow in BS, the mechanistic refinement above is strongly validated and the `flowRateContexts` implementation can proceed with the paper-brewer-interaction framing as the operating model.
