# Lost Origin Maya Tri-Up Lot Yeast Natural Geisha (Panama, Fran Zeimetz) - closed-lot learnings

*Coffee Research · Latent · Roasting Historian cluster · learnings*

**Lot:** PAN-LOSTORIGIN-MAYA-TRIUP-YEAST-NAT-2026
**Status:** Closed (2026-11-13) - **the one-V-set lot**: fastest intake-to-reference arc in the archive (2026-11-02 -> 2026-11-13), on the lot family Martin Wölfl used to win the 2025 World Brewers Cup
**Cultivar:** Gesha
**Terroir:** Panama / Volcán Barú Highlands (Chiriquí / Boquete), 1550m
**Process:** Natural - Yeast Inoculation (LOY-011, sealed tank 8 days, cold-room dried 32 days, depulped after drying; processed by Lost Origin x Tri-Up)
**Green:** density 833 g/L (HIGH), moisture 11.6% (HIGH). $720/kg via Kumquat (competition-grade one-time reference buy). ~700g remaining at close (1000g minus V1's 3x100g).
**Reference roast:** Batch 236 (V1 v1b) · 246°C-peak sustained-tail curve · bean_temp auto-drop 208°C / 5:10 · FC audible 4:24 / 203.6°C · dev 46s (14.8%) · WB Agtron 78.6 / WL 12.4% · Roest profile 625674 ("Maya - v1b")
**Optimized brew:** brew_id `bbf2c256` · Latent house style unchanged (= the SPG standing recipe, adopted directly per operator call) · Sworks Bottomless + xBloom Premium paper · 15g / 240g (1:16) · EG-1 6.5 · 94°C · Hybrid sequential (Dial 0 bloom -> Dial 5 -> crack to 6) · white grape / orange / floral / mango / tea, scaffolded, improves cooling

## Substrate pointers

- **roast_learnings row:** `f54513b7-ead4-43ac-96a8-f5ca851710e1` (green_bean_id `c4ae4c30-9b1e-47fc-b326-99bfb7fe7617`). All structured fields populated.
- **Experiment:** V1 `PAN-LOSTORIGIN-MAYA-TRIUP-YEAST-NAT-2026-V1`: `1b443360-0ec7-4c98-a077-fba0af6f934b` (drop ladder 206/208/210 on the fixed 246°C curve; winner V1B Batch 236, confirmed at the SPG with no inversion).
- **Roasts:** Batches 235 (`4c3bf4b8`, underdev calibration marker) / 236 (`e0a227d7`, **reference**, is_reference=true, worth_repeating=yes) / 237 (`41c06bc0`, overdev calibration marker). All auto-dropped on trigger, FC audible on all three.
- **Cuppings:** Day-7 xbloom gate 2026-11-11 (`46587a46` 235 / `aafa85ec` 236 / `6ce615f7` 237); **SPG 2026-11-13** (house style frozen across finalists): `72f28e29` (235, runner-up) vs `cbdbf0dc` (236, winner).
- **Brews:** optimized `bbf2c256-3f9c-47c0-a1e4-bfee935a62c0` (2026-11-13, = the SPG winning cup); peer reference `49da10c7` (Loquat's Maya 317 roast, WB 74.9, cupped 2026-11-02 - fed the V1 design as the develop-vs-process probe frame).
- **Active-lot doc:** [active-lots/pan-lostorigin-maya-triup-yeast-nat-2026.md](docs/skills/roasting-historian/cluster/active-lots/pan-lostorigin-maya-triup-yeast-nat-2026.md) (closed stub; carried the working hypothesis + V1 design/actuals/cupping records during the arc).
- Roest inventory 12273 archived at close.

## Why Batch 236 won as the lot reference

It won both gates in one V-set with no inversion - a first for the engineered-process-natural family. At the Day 7 xbloom gate it was the favorite by far (loud orange blossom / grape / mango, closest to the layered-evolving target, holding across the full cooling arc). At the SPG the gate read held: the same notes plus body and aftertaste - "scaffolded" - improving as it cools (white grape / orange / floral / mango / tea fully resolved cool), while 235's gate-read thinness resolved as hollowness under real pourover. 236 sits at the apex point of the dev ladder: developed enough to scaffold the fruit, light enough that the yeast process stays essentially silent in the cup (faint dry-aroma only). Operator at the gate: "I don't really know what to do to 236 to improve it."

## Roast architecture that produced it

Single fixed curve across all three batches (Deborah family architecture, high-lot-value narrow-V1 precedence): 246°C peak (no density reduction at 833 g/L - Deborah's pre-gate number), early ramp 200 -> 236 (1:15) -> 243 (2:30) -> 246 (3:15), sustained tail 243/239/235/232 (4:00-7:00), SR-Natural fan 80/68/63/70/73, RPM 65, charge 117 / hopper 125 / preheat 210, honest bean_temp auto-drops throughout. The drop ladder was the entire development lever and separated every cup. Lot physics vs the Deborah sibling (741 g/L): FC came EARLY (~4:24 / ~204°C, 25-30s ahead of model) rather than racing the probe; the color-per-degree slope steepens sharply late (9.4 Agtron points over 208->210°C) - step 1°C, not 2, above the apex zone.

## Cup-side diagnostic signals

- **Underdev:** thin / hollow base under a loud bright fruit attack - NOT grassy or raw even at 16s dev (the dense bean tolerates extreme underdevelopment without defect). At the gate the thinness can masquerade as light-tea elegance; under real pourover it resolves as emptiness. Correlates: WB ≥ ~81, drops ≤ 206°C. Seen: 235.
- **Overdev:** sharp roasty bitterness in the warm cup persisting through the cool - NOT Deborah's milk-chocolate/spice tell despite the shared process family; the cup stays flavorful underneath but the roast register never clears. Correlates: WB ≤ ~70, drops ≥ 210°C. Seen: 237.
- **Ferment:** never a failure mode (family precedent holds). LOY-011 yeast read as faint dry-aroma presence at most; roast character was the only ceiling.

## Measurement lessons

- **Ground Agtron skipped by design on 100g-batch lots**: ~15g cupping samples are too small for an accurate ground reading. WB + the cup arc were sufficient to resolve the lot; no WB->Gnd delta recorded.
- **FC audible on all three batches at high density** - unlike Deborah's dev-window-gated audibility. v1c's FC mark at 4:51 was ~25s late (identical curve to siblings; low RoR at FC-30s) - on shared-curve ladders, sibling FC consistency is the cross-check for a suspect mark.
- **The gate read HELD at the SPG** (first non-inversion in the family) - which does not retire the SPG arbiter: it confirms it cheaply. One brew-off, reference confirmed, lot closed.

## The apex scorecard

The peer cup (Loquat's 74.9 WB roast) established pre-roast that the apex shape is real in this coffee. The reference cup delivers it at Latent's lighter development: layered-evolving with a cool peak, scaffolded rather than merely loud, process silent. The peer-darker hypothesis (develop toward 74.9 WB to smooth the process note) was tested by the ladder and REJECTED - darker just added roast character; this lot's optimum sits at ~78-79 WB. The berry-loud aroma of the peer cup did not reappear at the lighter development (open question: darker-roast artifact vs rest/bag age).

## Cross-lot framing

The lot extends the ferment-natural Gesha family map along the density axis: Deborah (741 g/L) resolved ferment-behaved at 209-210.5°C triggers and ~84.9 WB; Maya (833 g/L) resolves at 208°C and 78.6 WB with FC early and audible. The family rule survives intact - fixed curve, drop ladder as the sole lever, real-pourover arbiter before the reference call - while every trigger/color number re-anchored, confirming the no-transfer-across-density caution. For the next high-density yeast-natural Gesha: inherit the starting_hypothesis on the roast_learnings row (same curve, ladder 207/208/209 at 1°C steps, expect ~one V-set). ~700g remain for a planned second V-set or repeat roasts of the 236 recipe (2x500g buy = the deliberate depth exception to range-over-depth).

## Related

- Family anchor: [learnings/pan-deborah-geisha-nat-2026.md](docs/skills/roasting-historian/cluster/learnings/pan-deborah-geisha-nat-2026.md) (architecture donor; density caveat validated here)
- Bracket donors: [learnings/bra-fazendaum-wushwush-nat-2026.md](docs/skills/roasting-historian/cluster/learnings/bra-fazendaum-wushwush-nat-2026.md) (FC-onset light end) + [learnings/rwa-nova-an10-rb-2026.md](docs/skills/roasting-historian/cluster/learnings/rwa-nova-an10-rb-2026.md) (ferment-behaved deep end)
