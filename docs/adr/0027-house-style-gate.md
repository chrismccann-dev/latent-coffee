# ADR-0027: The Day 7 gate is the Latent house style; xBloom gate and standing SPG retired

**Status:** Accepted (2026-11-13, operator call after the Maya / Los Lajones Bambu 8B / Black Moon Chiroso close-outs)

## Decision

Every slot of a V-set is evaluated at Day 7 in the Latent house style on the SWORKS (94°C, no roast-level row), in the roasting thread. That one session picks the leading slot, supports the reference call when the winner is bracketed by an underdeveloped and an overdeveloped sibling, and yields the optimized brew when the winning cup needs nothing (one adjustment on the winner otherwise). The xBloom gate and the Simulated Pourover Gate as a standing step are retired; a top-two rebrew survives as the tie-break for close reads.

Paired with it: on a seen-before lot, V1 is a fixed family curve with a three-slot bean-temp drop ladder, and landing the reference on V1 is the expected outcome rather than a suspect one.

## Why

The SPG existed because the xBloom recipe misranked close candidates against real pourover (8 instances, 6 lots, one flipped reference call). After [ADR-0026](docs/adr/0026-latent-house-style-chassis.md) the SPG recipe and the optimized brew were both already the house style, so the xBloom session was the only step in the chain not brewed the way the coffee is drunk. Three hand brews cost about the same as three xBloom cups. On the three lots closed 2026-11-11 to 2026-11-13 the SPG was waived, skipped, and confirmatory.

## Trade-off accepted

Machine repeatability is given up for consumption fidelity: three hand brews carry brew variance the xBloom did not. Mitigation is procedural (frozen recipe, one sitting, rebrew a faulted cup). House-style gate reads do not compare directly with pre-2026-11-13 `xbloom_gate` cuppings.

## Unchanged

`eval_method: 'Simulated Pourover'` stays the canonical cupping value for gate cups (now with `recipe_variant: 'house_style_gate'`), so the app's reference-cup card and prior SPG rows keep working. The [ADR-0025](docs/adr/0025-spg-pending-composite-encoding.md) deferral encoding survives for the one case it still fits: a tie-break rebrew that has to wait for another day.

## Unratified until lived

The seen-before test (process family + cultivar family with a closed anchor, density within about 30 g/L and moisture within about 0.5 points of it) is a working number drawn from three Panama naturals at 800-833 g/L. Revisit after the first lot that lands on V1 outside that family, or the first that fails to.
