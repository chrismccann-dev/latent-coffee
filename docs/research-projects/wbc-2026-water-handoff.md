# 2026 WBC Water-Chemistry Handoff — RP6 reference

*Coffee Research · Latent · Research Project #6 reference material*

**Source:** distilled from the 2026 World Brewers Cup field by the WBC Brewing Archivist session (Chris's annual post-WBC routine: transcript every routine → map onto the WBC taxonomy). 7 competitors ran water as a primary/heavy-secondary lever; ~15 more disclosed formulas. **Provenance:** competitor routines + disclosed formulas, 2026 WBC. **Status:** external reference / hypothesis source for RP6 — NOT a Latent finding, NOT substrate. Treat the role map as a starting hypothesis set, not gospel (the field's own framing).

**Why it's here:** it landed mid-Track-2 and corroborates RP6's direction strongly. Linked from [the RP6 roadmap entry](docs/skills/research-coordinator/cluster/roadmap.md) + the [Lane B spawn prompt](docs/research-projects/water-single-mineral-isolation-laneB-spawn-prompt.md). How it reconciles with our data is in § How this lands on RP6 at the bottom.

---

## 1. The ion → sensory-role map the field converged on

Across competitors who'd never coordinated, the *role assignments* were remarkably consistent.

| Ion / compound | Role the field assigned it | Who |
|---|---|---|
| Magnesium sulfate (MgSO₄) | Florality / aromatics / acidity lift / "vibrancy" | Rasmus Madsen, Simon Gautherin, Andrew Delgado |
| Magnesium chloride (MgCl₂) | Sweetness (*same cation, different role*) | Rasmus Madsen, Andrew Delgado, Carlos Juarez |
| Calcium chloride (CaCl₂) | Body / mouthfeel / texture / stone-fruit sweetness | Andrew Delgado, Rasmus Madsen, Angie Molina |
| Potassium (KCl, K-citrate) | Finish / peach / acidity balance / "long finish" | Simon Gautherin, Sofia Luttrell, Angie Molina |
| Sodium sulfate | Aromatics | Angie Molina |
| Silica | Smooth / creamy / round texture | Andrew Delgado, Simon Gautherin, Matin Shaikh, Mikolaj Pociecha (→ "violet") |
| Bicarbonate / alkalinity | Buffer. Low = brighter, separated fruit; high = supports high-extraction + degassing | Aga Rojewska (low), Paprik Liu (high, 50 ppm) |

## 2. The three non-obvious takeaways

1. **The anion matters as much as the cation.** MgSO₄ vs MgCl₂ split *floral vs sweet* with the same magnesium. Carlos Juarez built his whole water around carbonate/chloride/citrate pairings as "keys to florality and sweetness." If a research program is only dialing Mg:Ca ratio + total ppm, add a sulfate-vs-chloride axis — the lever most home setups ignore.
2. **Stage-specific mineral profiling** (Esther Kim's whole routine): change water chemistry *across pours* like staging temperature. Mg-dominant early for florals/acidity, Ca-dominant late for sweetness/body. New vs "one water for the whole brew." Clean A/B: same total minerals, single profile vs Mg-early/Ca-late.
3. **When the brew is simple, water carries the precision** (Andrew Delgado: plain 2-min immersion + a surgical 50 CaCl₂ / 10 MgCl₂ / 10 MgSO₄ / 10 silica formula). To isolate the water variable, simplify the brew method deliberately so minerals are the only thing moving.

## 3. The field's tightened experiment ladder (one variable at a time)

1. **Total ppm** — ~50 / ~90 / ~120, recipe held constant. (Field bands: delicate/floral 30-60, balanced 60-90, body/push 100-200.)
2. **Mg:Ca ratio** — 1:1 vs 2.5:1 vs 3:2 (Mg-forward 2.5:1 / 3:2 for "juiciness as it cools" — Andrew Wong, Sierra Yeo). More Mg = florals/acidity; more Ca = body.
3. **Anion swap** — hold cation + ppm, swap MgSO₄ ↔ MgCl₂ (and CaCl₂ vs Ca-citrate/carbonate). Score floral vs sweet direction.
4. **Silica add/no-add** — single 10 ppm silica vs none, scored on texture only.
5. **Stage-split** — single profile vs Mg-early/Ca-late, same totals.

**Score acidity direction / florality / sweetness / body / texture *separately* each round** — the field's whole point is that water moves these independently, so a single "better/worse" judgment throws away the signal.

## 4. Three competitor formulas worth cloning as starting anchors

- **Andrew Delgado** (clarity + body): ~80 ppm = 50 CaCl₂ / 10 MgCl₂ / 10 MgSO₄ / 10 silica → florals, peach, muscat, silky body.
- **Simon Gautherin** (citrus-forward seasoning): 80 ppm = 3 MgSO₄ : 2 KCl : 1 silica → citrus / peach / smooth.
- **Rasmus Madsen** (floral + sweet split): 80 ppm = 30 MgCl₂ (sweetness) + 30 MgSO₄ (florality) + 20 CaCl₂ (silk).

## 5. Guardrails (the field's own failure modes)

Water "becomes too directive and overwhelms terroir"; high total hardness mutes clarity; alkalinity flattens acidity; over-Mg over-sharpens acidity; over-Ca over-weights body; stage-specific water is hard to reproduce (Esther Kim's risk — log exact ppm-per-pour or it won't replicate). **Net: water seasons, it doesn't fix a coffee that lacks the note.**

---

## How this lands on RP6 (Coordinator note, 2026-06-29)

**Strong structural corroboration.** The field's headline — *the anion matters as much as the cation; MgSO₄ vs MgCl₂ split floral-vs-sweet with the same Mg* — is exactly RP6 Track 2 Sitting 1's finding (cation × anion is an interaction; Mg flips sign with its anion). Seven uncoordinated competitors + our single-salt isolation converged on the same structure. The field's experiment ladder ≈ our design; their guardrails ≈ ours (water-overwhelms-terroir = reveal/inject; alkalinity-flattens-acidity = our buffer finding; "water seasons, doesn't fix" = the HOLD-BOTH / scaffold-off-what's-there thesis).

**The reconciliation our data owes the field (→ Lane B).** Our *post-brew* single-salt directions agree with the field on MgCl₂ = sweet, but DIVERGE on the two highest-value ions:

| Ion | Field (pre-brew, built water) | Our post-brew screen |
|---|---|---|
| MgCl₂ | sweetness | sweet (3.5) — agrees |
| MgSO₄ | florality / acidity / vibrancy | muddy, worst (1.5) — diverges |
| CaCl₂ | body / mouthfeel / stone-fruit | acid / clarity (3.5) — diverges |

The divergence is concentrated exactly where the field's value is highest (sulfate). Most likely cause: **post-brew misses the extraction effect** — sulfate's floral/acidity role is plausibly extraction-mediated (it shapes what's pulled from the bed during brewing), which a post-brew seasoning screen cannot show. That is precisely HT3, so **Lane B (pre-brew) is the our-data-vs-WBC-field reconciliation experiment.** A second contributor: holistic scoring — MgSO₄ scored "muddy/worst" as one number may hide a florality win the field prizes; Lane B fixes this with per-axis directional scoring (the field's explicit discipline).

**Seeded future RP6 tracks (queued, not in-flight):**
- **Stage-split mineral profiling** (Esther Kim) — Mg-early / Ca-late vs single profile at equal totals. Native fit for the programmable xBloom platform.
- **Potassium-as-finish** — the field uses K as KCl / K-citrate for "long finish / peach," a different role than the K-*bicarbonate* buffer RP6 tested (and disliked). Not in the current kit.
- **Silica-as-texture** — 4 competitors used it; not in the raw-reagent kit (Chris's original buy-list had Eidon silica).
- **Refinement anchor:** RP6 Sitting-1's best cup (two-chloride MgCl₂+CaCl₂) ≈ Delgado's clarity+body formula minus his 10 MgSO₄ + 10 silica — so "add a touch of sulfate + silica to the chloride base" is a competition-anchored next test.
