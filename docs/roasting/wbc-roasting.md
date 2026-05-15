# WBC Roasting — Lessons + Open Ideas (Latent / Roest L200 Ultra)

Roasting-side companion to [docs/brewing/wbc-reference.md](../brewing/wbc-reference.md) and [docs/brewing/wbc-recipes.md](../brewing/wbc-recipes.md). Derived from Chris's "World Brewers Cup Champion - Recipes and Extraction Taxonomy - Roasting Info" research (~100 competitor entries, 2022-2025) plus the two synthesis documents Chris wrote off that source.

**This is an ideas / hypotheses / experiments doc, not a recipe lookup.** Unlike the brewing-side WBC archive — where competitors disclose full recipes and the doc maps cleanly onto Latent's strategy framework — the roasting data is sparse, machine-specific, and less-disclosed. The value here is in the *patterns* WBC competitors point to (split-roast layering, rest as a strategic variable, role-based development, ground Agtron, freeze-at-peak), not in copying their numbers verbatim.

Read this doc when:

- Scoping a V1 design for an expensive lot and looking for under-considered levers
- Deciding what to do with the extra roasted beans on a coffee that already has a reference roast (room to test rest curves, blends, agitation taper, etc.)
- Writing a Lot Knowledge entry and want to anchor the "what would competitors do here?" framing
- Thinking through whether a sourcing decision opens up a roast experiment that's worth running

For the sourcing-side companion (producers / origins / varieties / processes / Latent inventory mapped to tiers), see **[wbc-sourcing.md](wbc-sourcing.md)**.

## History

- **2026-05-09:** Initial draft. Authored from Chris's "Roasting Overall Lessons and Potential Future Ideas" + "Sourcing Strategy Ideas" synthesis docs, with the underlying CSV (~100 WBC competitor rows, 2022-2025) folded inline as illustrative citations rather than maintained as a separate competitor archive. Two-doc split: this doc covers *how to roast*, the sourcing doc covers *what to buy*.

## Counting note: data quality vs the brewing corpus

The brewing CSV has 102 fully-disclosed recipes that map cleanly onto a 5-axis / 8-family framework. The roasting CSV has ~100 competitor entries but most rows carry only 2-5 lines of `Roast:` detail and many say "not disclosed." Roast detail is also machine-specific (Link, Stronghold, Ikawa, Kaffelogic, drum, fluid-bed, gas) which doesn't transfer cleanly to a counterflow Roest L200 Ultra.

The result is a thinner, more open-ended doc:

- **No 38-subtype taxonomy** like the brewing archive's. The signal-per-row is too low to support that level of structure.
- **No "competitor X used profile Y, copy it"** instructions. The numbers don't transfer.
- **Patterns over recipes.** The lessons below are what holds up across 100 competitors, not what any one competitor did.
- **Hypotheses over prescriptions.** When this doc says "test X," it means "WBC patterns suggest X is worth structured experiments on the L200," not "X is the right answer."

## What's missing from WBC data that matters for Latent

Things the WBC corpus does *not* tell you that show up across Chris's actual roasting practice. When this doc gestures at one of these, treat it as a known gap and route to the in-house source:

| What WBC data is silent on | Where Latent's answer lives |
|---|---|
| Rest-day cupping protocols (which days to taste, freeze decision logic) | [ROASTING.md § Evaluation Protocol](../../ROASTING.md) — Day 7 pourover gate; Day 4 was deliberately removed. The structured rest-curve experiment in this doc is queued as Tier 1, since Chris hasn't run a formal rest study yet. |
| Counterflow-specific failure modes (TP / charge / FC-temp interactions on the L200) | [ROASTING.md § Key Counterflow Observations](../../ROASTING.md) and § Cross-Coffee Insight Layer. WBC competitors mostly use convection or drum, so their development targets and ROR shapes don't translate without a re-anchor on counterflow physics. |
| Whole-bean vs ground Agtron deltas as a development signal | [ROASTING.md § WB-to-Ground Agtron Delta as Development Signal](../../ROASTING.md). WBC mentions Agtron occasionally; Chris's per-process delta norms are the actual reference. |
| Closed-lot reference parameters and key learnings | [docs/roasting/archive.md](archive.md). |
| Per-lot V1 → reference-roast iteration arc | ROASTING.md § Lot Knowledge (Active Lots) + the per-coffee `roast_learnings` records in the app. WBC competitors only present the final stage; the iteration history is invisible. |
| Roast-to-brew translation logic (how a roast parameter shapes brew strategy) | [ROASTING.md § Roast-to-Brew Translation](../../ROASTING.md) and BREWING.md's 6-strategy framework. WBC mostly treats roast and brew as one integrated pitch; Chris's two-layer model is more useful for self-roasting. |

If a WBC pattern in this doc conflicts with one of those in-house references, the in-house reference wins — it's calibrated against Chris's actual machine and palate.

## Six generalizable lessons from the dataset

The lessons below hold up across many competitors and many machines. They're the layer most worth importing.

### 1. Counterflow makes sense for WBrC-style coffees

The dominant roaster language across the dataset is convective: Link, air roast, Stronghold, Ikawa, Kaffelogic, fluid-bed, "clean cup," "transparency," "clarity," "low inside/outside delta." Roughly half the disclosed roasts use a Link or Stronghold air-flow / convection-dominant machine. The Roest L200 Ultra in counterflow mode sits in the same heat-transfer family.

For high-end Gesha, Sudan Rume, Java, Mandela, and CGLE coffees, treat counterflow as the **default competition clarity mode**:

- Higher clarity, cleaner aromatics, less roast flavor
- Better preservation of florals and volatile fruit
- More sensitivity to underdevelopment

The tradeoff: fast counterflow profiles need enough mid-phase energy to avoid grassy, tomato, peanut, raw-nut, or hollow acidity. The recent underdeveloped / tomato / grassy notes Chris has flagged on some pourovers are exactly this failure mode (see ROASTING.md § Cross-Coffee Insight Layer for the FC-temp architectural-constraint hypothesis).

### 2. Development target is role-based, not universal

The dataset does not support a single "best DTR." It supports a range, keyed to what role the coffee is being asked to play:

| Coffee role | WBrC-style target zone | Cited examples |
|---|---|---|
| Washed Gesha / floral clarity | ~8-11% dev | Aga Rojewska 2024 (Esmeralda Natural, ~9% dev, 6:40 total); Barbora Mařáková 2025 (El Placer white honey, ~9% dev); Gökhan Selamet 2025 (Mikava CM, ~9% dev) |
| Natural Gesha / CM Gesha | ~10-12.5% dev | Martin Wölfl 2024 1st (Don Benji yeast+lacto, ~12% dev, ~6 min); Sungduk Kim 2025 (Altieri natural, ~11% DTR, 6:30 total); Ply 2025 (Mount Totumas low-temp natural, ~12.5% DTR) |
| Dense hybrid / Mandela / CGLE 17 / Sidra | ~11-15% dev | Daniel Horbat 2024 (CGLE 17, ~16% dev, extended Maillard); Janer Perez 2024 (Gesha + Sidra blend, ~13.3% / ~14% dev); Gabriele Pezzaioli 2024 (Geisha + Eugenioides, ~9 min Geisha / ~10 min Eugenioides) |
| Eugenioides / Laurina / body component | ~14-20% dev | Alistair Seetho 2024 (CGLE 17, ~20% dev for sweetness/body); Thomas Philips 2025 (Eugenioides ~20% dev for sugar extraction) |
| Brazil / lower elevation / low-acid component | More developed | Multiple; component-driven |

For Roest work, **stop thinking "is 10% or 12% right?" and tag each roast by intent**:

- **Aromatic clarity roast**
- **Fruit expression roast**
- **Sweetness / structure roast**

George Peng's 2025 1st-place triple roast is the cleanest expression of this idea: 185°C / 187°C / 189°C end temps for floral clarity / fruit expression / sweetness and structure. That's the same coffee, three small-delta drops, blended deliberately. It maps directly onto how Latent's roast-design schema should record V1 / V2 / V3 intent.

### 3. Split-roast experiments are a real competitive pattern

This is one of the strongest lessons. Competitors split by:

- Different coffees in a blend
- Same coffee at different roast levels
- Different screen sizes
- Different machines (Stronghold + Link, Kaffelogic + drum, etc.)
- Different rest windows
- Different development levels

For Latent's single-coffee context, the most useful adaptation is **same-green roast layering**, not multi-coffee blending. See § Blending experiments below for the structured protocol.

Notable split patterns in the data:

- **Daiki Hatakeyama 2025** — Two roast levels per coffee (Agtron 80 for sweet aroma, Agtron 90 for sweet taste), blended 1:1 across 3 source coffees.
- **Mariam Erin 2025** — 57% Panama Gesha at Agtron 90 (light) + 43% Colombia CM Gesha at Agtron 70 (medium), wet-blended after separate extraction.
- **Raul Rodas 2025** — One Gesha lot, 50% Link air-roast at ~11% dev for sweetness/intensity + 50% Stronghold halogen at ~15% dev for floral clarity.
- **Barry McGeehin 2025** — One Esmeralda Ellipse washed lot, 50/50 split: Stronghold halogen 14 days rest + Link air 3 days rest, both ~12% dev.
- **George Delichristos 2024** — Screen-size separation before roasting (70% size 20-16, 30% size 15-peaberry), roasted separately, 1:1 blended.
- **Eric So 2025** — Two-component "symphony" blend with different Gesha lots roasted with very different profiles (high-momentum 6 min / 30s dev for one, gentle 12 min no-cracking for the other). The second roast is the unusual one — a deliberate no-FC roast to extract lateral sweetness without development tone.

### 4. Rest timing is a real strategic variable

Competitors intentionally present coffees at very different rest points:

- 30 hours for peak aromatic clarity (Tom Hutchins 2024)
- 2-3 days for fresh-rested cup (Aga Rojewska 2024, Dongmin Kim 2024, Liew Kar Weng 2024)
- 4-7 days as the baseline (Wasin Kusakabe, Sungduk Kim, Kunie Inaba, etc.)
- 10-14 days for stability (Lakis Psomas 2025, Gabriele Pezzaioli 2024)
- 20+ days for some blends (Andrea Batacchi 2025, Şevval Nida 2024)
- 4 weeks for solubility-aligned blends (Elysia Tan 2024)
- Frozen at peak aroma for preservation (Tomas Taussig 2022 — frozen 2 years before competition; Thomas Philips 2025 — flash-frozen at -30°C at peak aroma before blending)

Latent's current practice (freeze at absolute peak) aligns with the freeze-at-peak pattern. The missing piece is making rest curves *structured* enough to compare across coffees. See § Rest as a structured variable below for the queued experiment.

### 5. Ground Agtron > whole-bean Agtron for clarity coffees

Several entries reference Agtron — whole, ground, or both. Liew Kar Weng (Mikava CM Gesha, Agtron ~75) and Erik Liao 2024 (74158, Agtron 75 whole / 90 ground) explicitly pair the two readings. Wei Lang 2025 measured Agtron *across particle sizes from 400-1200µm* to track inner / outer development.

The implication for Latent's L200 system: ground color is an internal-development proxy, whole-bean is an evenness proxy together with the WB-to-ground delta. Chris's recent move to log both is exactly right. For high-clarity counterflow roasts, ground Agtron likely gives the cleaner read on internal development; the delta tells you whether the bean is over-roasted on the outside relative to the inside.

ROASTING.md § Cross-Coffee Insight Layer already has per-process WB-to-ground delta norms. This doc only adds: WBC use confirms the practice, doesn't change the targets.

### 6. The WBrC roast goal is not always "lighter"

A trap would be reading this dataset as "competition coffee = fastest and lightest." The better read:

- **Light** when preserving florals
- **Longer Maillard** when building sweetness
- **More development** when the component provides body or sugar
- **Short development** when acidity and aromatics are the point
- **Separate roast paths** when one profile cannot do all jobs

This matters for Roest experiments because some coffees need more structure than the prettiest visual roast curve suggests. Chris's underdeveloped / tomato / grassy notes on some pourovers are exactly the "too light, too fast" failure case.

## Roest L200 hypotheses (testing layer)

Four hypotheses to test on the L200 in counterflow mode. Each is a *direction*, not a recipe.

### H1 — Counterflow as clarity baseline

For Gesha, Sudan Rume, washed / hybrid washed, and high-elevation naturals, counterflow as the reference path. Aim for clean fast development. Keep enough Maillard to avoid raw acidity. Measure ground Agtron every time.

Starting target window:

| Variable | Starting target |
|---|---|
| Total roast | ~4:30-6:30 (batch-size dependent) |
| Dev % | ~9-12.5% |
| Weight loss | ~10.5-12.5% for light competition style |
| Ground Agtron | Coffee-dependent; track against sensory first |
| Rest | Taste days 4, 7, 10, 14 (see H4) |

These windows describe *competition-style* roasts. For coffees in lower-clarity tiers (heavy anaerobics, dense hybrids, body components), shift the development zone up and the total time longer per Lesson 6.

### H2 — A 2-roast blend may outperform either roast alone for high-end Gesha

For expensive Gesha or Sudan Rume lots:

- Roast A — floral clarity (lightest acceptable color, shortest dev)
- Roast B — sweetness / structure (slightly more Maillard or slightly higher drop, still light)
- Blend 70/30 or 50/50 after rest

This may outperform either roast alone, especially in pourover. It mirrors the WBC pattern (Daiki Hatakeyama, Raul Rodas, George Peng) without requiring multi-origin blends. See § Blending experiments for the structured 3-batch protocol.

### H3 — Dense hybrids need more mid-phase, not necessarily darker finish

For Mandela, Sudan Rume, Java, Sidra, CGLE 17-style coffees:

- Don't only extend development after first crack
- Build sweetness earlier through controlled Maillard
- Keep drop light enough to avoid roast tone

This lines up with multiple WBC entries where competitors reference extended Maillard, caramelization, high early heat, or development tuned for sweetness while preserving florals / acidity (Daniel Horbat 2024 CGLE 17, Luca Croce 2024 Mandela with extended Maillard ~4 min, Alistair Seetho 2024 CGLE 17 ~20% dev).

### H4 — Rest curves should become part of the roast score

The roast score should not be "how did it taste once." Score on a *curve*:

| Dimension | Score window |
|---|---|
| Day 4-5 aromatic peak | Volatile intensity, dry/wet aroma |
| Day 7-10 balance | Best general drinking window |
| Day 14+ stability | Integration and fade resistance |
| Peak freeze date | Best single-dose freeze point |

Especially important for counterflow, very light roasts, and experimental processed coffees. See § Rest as a structured variable for the queued experiment shape.

## Blending experiments (Chris's interest area)

This is the section Chris flagged as the most worth investing structured experiment time in. Latent has done zero blending to date; the WBC dataset is full of blend signal. This section is the playbook for converting that signal into Roest-runnable experiments.

The blending question for Latent is **not** "should I source multiple greens to combine?" — that's competition stagecraft and not the goal. The question is "given that I roast a single green and have extra roasted beans, what blends within that one coffee are worth testing?"

### Three blending modes worth running

| Mode | What it tests | Examples in WBC |
|---|---|---|
| **Same-green roast layering** (development split) | Whether floral clarity + sweetness/structure layered from one lot beats either alone | George Peng 2025 1st (3 dev levels, single Mount Totumas Gesha); Raul Rodas 2025 (Stronghold + Link split on Finca El Injerto Gesha); Barry McGeehin 2025 (50/50 Stronghold + Link split on Esmeralda Ellipse) |
| **Same-green Agtron-paired blending** (color-targeted split) | Whether two roasts at deliberately different Agtron readings (e.g. 80 + 90, or 70 + 90) layer better than a single mid-color | Daiki Hatakeyama 2025 (Agtron 80 sweet aroma + Agtron 90 sweet taste, 1:1); Mariam Erin 2025 (Agtron 90 + Agtron 70 across two coffees); Jaco Chu 2024 (different drying durations matched by Agtron 80-81 to align solubility) |
| **Same-green rest split** (rest-window blend) | Whether two rest windows (e.g. 14 days + 3 days) layer differently than either alone | Barry McGeehin 2025 (14 days Stronghold + 3 days Link, same coffee); Tom Hutchins 2024 (~30 hours rest specifically) |

### Roest L200 protocol — same-green ladder + blend tasting

For the next high-end lot Chris wants to invest in (e.g. CGLE-SRUME-NATURAL-2026 or GESHA CLOUDS), run this exact experiment:

| Batch | Intent | Profile direction |
|---|---|---|
| **A** | Floral clarity | Fast counterflow, shortest clean development. Drop earliest acceptable color. ~9-10% dev. |
| **B** | Fruit + sweetness | Same profile but slightly more late Maillard / slightly longer dev. ~11-12% dev or +1-2°C drop. |
| **C** | Structure | Slightly more development or slightly higher drop, still light. ~12-14% dev or +2-4°C drop. |

Then evaluate at Day 7:

- A alone
- B alone
- C alone
- 70% B / 30% A
- 70% B / 30% C
- 50% A / 50% C

Same pourover recipe (Brian Quan xbloom evaluation recipe per ROASTING.md § Equipment), same rest day, same ground Agtron tracking on each component. Score each cup on the rest-curve dimensions in H4. Note which blend wins, by how much, and on which axis.

This is the most direct WBrC lesson for Roest work: **roast design as flavor composition, not single-profile optimization.**

### Practical consideration: green quantity gates the experiment

Chris's actual constraint here is *not* whether to test blending — the constraint is **how much green he has left on a given lot**. A 3-batch dev ladder needs enough green to justify burning ~300g across A/B/C plus the existing reference batch. The Roest inventory `quantity_g` field is the live read on this; the latent-coffee MCP `list_roest_inventory` Tool surfaces it.

Rough heuristic for whether a lot has the latitude to absorb a 3-batch ladder:

| Remaining `quantity_g` | Latitude for a 3-batch ladder |
|---|---|
| **2000g+** | Plenty of room — run the full 3-batch + blend matrix freely |
| **1000-2000g** | Reasonable room — run the ladder but expect this to be a meaningful fraction of remaining green |
| **500-1000g** | Tight — consider a 2-batch (A vs C) split instead of full A/B/C; or defer until after the next lot of similar process arrives |
| **<500g** | No latitude — single reference roast only; defer blending experiments to a future lot |

When scoping a 3-batch ladder in claude.ai, **first call `list_roest_inventory` (or check the existing roast records' green-bean linkage)** to confirm there's enough green before committing.

Lot priority for the ladder: high green cost + high cup ceiling + sufficient quantity. As a current snapshot, GESHA CLOUDS has clear latitude; CGLE Sudan Rume Natural needs the inventory check before scoping. See [wbc-sourcing.md § Latent inventory mapped to tiers](wbc-sourcing.md) for the broader portfolio frame.

### Multi-process and multi-origin blending — out of scope for now

The WBC dataset has plenty of multi-origin blends (Tom Hutchins 2024 Ombligon + Gesha; Wataru Iidaka 2024 layered three-coffee Panama bed; Yamil Quino 2024 washed + anaerobic + mossto Bolivian trio). These are blend stagecraft and don't transfer to single-origin home roasting in a useful way. Future-capture: if Latent ever buys two greens specifically to blend, the WBC patterns above are where to start.

## Rest as a structured variable

Latent has not run formal rest-window experiments. The WBC corpus shows competitors treat rest as a strategic variable, not a side effect. This section is the queued protocol.

### Why rest is under-modeled in current Latent practice

- Most beans get evaluated at Day 7 (the canonical pourover gate per ROASTING.md § Evaluation Protocol) and frozen shortly after.
- "Frozen at peak" is the right end-state but the curve leading to it is invisible.
- Cross-coffee comparisons of rest behavior live in ROASTING.md § Cross-Coffee Insight Layer § Rest Behavior Patterns, but are descriptive (notes from past lots) rather than the output of a structured A/B.

### Suggested Roest rest-curve protocol

For one or two reference roasts per lot — not every roast — split the bag into 4 equal portions immediately after evaluating at Day 7:

| Portion | Cup at | What to evaluate |
|---|---|---|
| 1 | Day 4-5 | Aroma, volatility, sharpness, CO2 interference, top-note brightness |
| 2 | Day 7 (canonical) | Best general drinking window — the existing reference cup |
| 3 | Day 10-12 | Sweetness integration, body development |
| 4 | Day 18-21 | Stability, body, florals vs fade |

At each tasting, record: dry / wet aroma, attack, mid-palate, finish, body, clarity, integration. Use the same brewer + grinder + grind setting + recipe as the Day 7 reference cup so rest is the only variable.

### Where the rest-curve data lives

This is neither a new roasting field nor a new brewing field — it sits naturally on the **existing cupping tracking structure**. Each rest-day tasting is a `cupping` row pointing to the same `roast_id`, with `cupping_date` advancing across the curve. No schema change needed; the rest curve emerges as 4 cupping rows with shared `roast_id` and a `rest_days` derivation from `cupping_date - roast_date`.

Operationally:

- After the canonical Day 7 cupping is logged, schedule the additional 3 cuppings (Day 4-5 backfilled if portion 1 was cupped before Day 7; Day 10-12 and Day 18-21 forward).
- Each cupping uses the same brewer + grinder + recipe as the Day 7 reference; the cupping notes carry the rest-day comparison delta (e.g. "vs Day 7: tighter finish, less aromatic lift").
- After Day 21, the lot's `roast_learnings` row gets a one-line rest-curve summary and the freeze-decision rule (which day was peak; was the cup still climbing at Day 21).

This avoids creating a "rest_curve" entity that would duplicate cupping fields. The cupping table is already the right home; the protocol is the disciplined cadence on top of it.

After Day 21, decide the freeze point: is the cup *still* improving (push the freeze date), at peak (freeze now), or fading (freeze should have happened earlier)? Record the freeze decision and the cup notes that drove it on the `roast_learnings` record.

### Freeze decision protocol

WBC patterns suggest two distinct freeze strategies:

- **Freeze at peak aroma** — Tomas Taussig 2022 vacuum-sealed and froze; Thomas Philips 2025 flash-froze at -30°C at peak aroma before blending. Goal: lock in peak.
- **Freeze immediately for preservation** — Raul Rodas 2025 (Finca El Injerto Gesha vacuum-sealed and frozen after harvest before roasting at all). Goal: stop time entirely.

Latent's freeze-at-peak practice is the first pattern. The structured rest curve above is what tells you when peak is. The decision rule going forward: freeze when **two consecutive tastings** show the cup is no longer improving.

### Tier 1 experiment: run the rest curve on the next reference roast

Concretely, queue this for the next lot that produces a reference roast (likely CGLE-SRUME-NATURAL-2026 or GESHA CLOUDS). Carve out 80g of the reference batch into 4 × 20g portions; cup each at the dates above. The result becomes the first formal rest curve in `docs/roasting/archive.md`, and the protocol becomes part of the close-out handoff (see [docs/prompts/close-lot.md](../prompts/close-lot.md) STAGE 4).

## Roest experiment queue

Tiered the same way [wbc-reference.md § Practical Experiment Queue](../brewing/wbc-reference.md) is — Tier 1 = test now, Tier 2 = future-capture, Tier 3 = consciously not pursuing.

### Tier 1 — test now (high signal, low effort)

| Experiment | Why it matters | Suggested setup |
|---|---|---|
| **Rest curve on reference roast** | Rest is under-modeled; WBC treats it as strategic | 4 × 20g portions, cup at days 4-5 / 7 / 10-12 / 18-21 (same brewer + recipe) |
| **Same-green dev ladder** (A / B / C blend test) | Tests Lesson 2 (role-based dev) and H2 (2-roast blend) in one experiment | 3 batches at differential dev / drop, 6-cup blend matrix at Day 7 |
| **Ground vs whole Agtron logging** | Internal development proxy for clarity coffees | Add ground Agtron to every reference roast post-evaluation; compare WB-to-ground delta against ROASTING.md § Cross-Coffee Insight Layer norms |
| **Mid-phase build for dense hybrids** | Tests H3 on Sudan Rume / Mandela / CGLE 17 lots | One batch with extended Maillard (controlled, before FC) + lighter drop, vs reference profile with same drop |
| **Aroma capture on freeze** | Tests whether vacuum-seal-at-peak preserves more than ambient freeze | Half the reference batch vacuum-sealed at peak, half ambient; compare 30-day-out cup |

### Tier 2 — future-capture (interesting but lower priority)

- **Screen-size pre-roast separation** (George Delichristos 2024). Sort to 70% size 20-16 / 30% 15-peaberry, roast separately, blend 1:1. Useful when bean-size variance on a green looks high. Defer until evidence shows variance is hurting evenness.
- **Multi-machine split-roast on one lot** (Raul Rodas 2025, Barry McGeehin 2025). Latent only has one Roest, so this is parked unless Chris picks up a second machine in a different heat-transfer family.
- **Multi-process blending across two greens** (Yamil Quino 2024, Tom Hutchins 2024 Ombligon + Gesha). Requires sourcing two greens specifically to blend. Park until the blending instinct is exercised on same-green ladders first.
- **Lower-temp drying phase + extended mid-phase caramelization** (Luca Croce 2025 Mosto Gesha). Specific Roest curve adjustment — interesting for naturals, flagged for the structured 3-batch ladder but not as a standalone experiment.
- **Saccharomyces-yeast-fermented coffee paired with reduced-Maillard roast** (Wasin Kusakabe 2024). Process-roast pairing experiment; deferred until Latent has a yeast-fermented green in inventory.

### Tier 3 — consciously not pursuing

- **Multi-origin blending built around competitive sensory roles** (most 2024-2025 finalist blends). Blend stagecraft, no single-origin transfer, and Latent's portfolio is built around learning per-coffee, not constructing competition cups.
- **Solubility alignment via roast matching across a multi-coffee blend** (Elysia Tan 2024 ~13% dev across 3 coffees, ~4 weeks rest). Blend-specific.
- **Layered bed by component / dual-chamber extraction** (Wataru Iidaka 2024). Already non-pursued on the brewing side; same reasoning here.
- **Folio / coffee-leaf extract fermentation as a roast-design problem** (Allen Chen 2025, Milo Gil 2024). Process novelty, doesn't generate a roast lesson.
- **Triple-roast layering** (George Peng 2025 — 3 dev levels of one Mount Totumas Gesha). Beautiful pattern but the 3-batch ladder is the right Latent-scale version. Triple is one extra step of complexity for marginal gain on a 100g roaster.

## Suggested fields to add to the roasting database

From Chris's "what I'd add" list, mapped to the existing `roasts` / `experiments` / `cuppings` / `roast_learnings` schema where possible:

| Field | Already exists? | Why it matters | Where it lives |
|---|---|---|---|
| Roast intent (floral / fruit / sweetness / structure) | Implicit in `experiment_id` and `roast_learnings`; not a discrete column | Makes Lesson 2 (role-based dev) explicit and queryable | Add as a tag or enum on `roasts` |
| Heat transfer bias (counterflow / non-counterflow) | Single value (counterflow) for the L200 in current mode | Future-proof if Chris ever runs L200 in non-counterflow mode | Add to `roasts` only if mode varies |
| Component role (standalone / acidity / sweetness / body) | New | Tracks blend-component intent for blending experiments | Add to `roasts` once blending experiments begin |
| Ground Agtron | New | Internal development proxy; pairs with whole-bean Agtron | Add to `roasts` (or `cuppings` since it's measured at evaluation, not at roast end) |
| WB-to-ground Agtron delta | Derivable | Evenness proxy already used in ROASTING.md § Cross-Coffee Insight Layer | Compute, don't store |
| Rest curve peak day | New | Output of the structured rest-curve experiment | Add to `roast_learnings` |
| Defect flag (grassy / nutty / baked / roasty / hollow / fermented / drying) | Free-text in `cuppings.notes` and `roast_learnings.what_changes` | Could be a structured tag set | Possible enum on `cuppings` if defect-tag analysis becomes useful |
| Best blend ratio | New | Output of same-green dev ladder | Add to `roast_learnings` if the ladder runs |
| Brewing match | Already lives on `brews.brewer` / `brews.filter` etc. | Cross-link to brewing context | Existing |

The discrete-field adds are not urgent — most can sit as free-text in `roast_learnings.what_changes` until a query pattern justifies promoting to a column.

## Practical takeaway

For the next serious coffee, run § Blending experiments § Roest L200 protocol. Same coffee, three deliberate dev levels, six cups (3 standalone + 3 blends) at Day 7. That single experiment exercises Lessons 2, 3, and 6, tests Hypotheses H2 and H3, and produces the first formal blend data point for `docs/roasting/archive.md`.

The most direct WBrC lesson for Roest work: **roast design is flavor composition, not single-profile optimization.**

## Cross-references

- **Brewing-side WBC docs:** [docs/brewing/wbc-reference.md](../brewing/wbc-reference.md) (lean mapping layer) + [docs/brewing/wbc-recipes.md](../brewing/wbc-recipes.md) (102-recipe archive).
- **Sourcing-side companion:** [wbc-sourcing.md](wbc-sourcing.md).
- **Roasting practice anchors:** [ROASTING.md § Evaluation Protocol](../../ROASTING.md), [§ Key Counterflow Observations](../../ROASTING.md), [§ Cross-Coffee Insight Layer](../../ROASTING.md), [§ Roast-to-Brew Translation](../../ROASTING.md).
- **Closed-lot archive:** [docs/roasting/archive.md](archive.md).
- **Operational prompts:** 4 lifecycle-mapped prompts: [docs/prompts/start-lot.md](../prompts/start-lot.md) (In inventory → Waiting for next roast), [docs/prompts/log-roast.md](../prompts/log-roast.md) (Waiting for next roast → Waiting for next cupping), [docs/prompts/log-cupping.md](../prompts/log-cupping.md) (Waiting for next cupping → Waiting for next roast loop OR Resolved-pending), [docs/prompts/close-lot.md](../prompts/close-lot.md) (Resolved-pending → Resolved).
