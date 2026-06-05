# Sudan Rume — across roasting and brewing

*Cross-Coffee Insight Layer · seed pattern · authored Wave 4 PR 4a, 2026-05-21*

**Cardinality:** N=3 across both domains (2 roasting lots + 1 brewing lot at this writing).

- **Roasting:** [CGLE Sudan Rume Hybrid Washed (CGLE-SRUME-WASHED-2026)](../../../../../../ROASTING.md#cgle-srume-washed-2026---sudan-rume-hybrid-washed) (closed, reference roast batch #133) · [CGLE Sudan Rume Natural (CGLE-SRUME-NATURAL-2026)](../../../../../../ROASTING.md#cgle-srume-natural-2026---sudan-rume-natural) (closed 2026-05-23, reference roast batch #187 / V5A)
- **Brewing:** [CGLE Las Margaritas Sudan Rume Natural (Special Guests Edition 0326-42)](../../../../../brewing-historian/cluster/patterns/by-cultivar/sudan-rume.md) — one data point on the brewing-only side (different roaster, not Latent-roasted)

This is the **first CCIL seed pattern** authored in Wave 4 PR 4a. Its job is to demonstrate the shape of cross-domain synthesis on a coffee where both a Latent-roasted lot AND an externally-roasted brewing lot of the same variety exist. Pattern F's archetype: the same variety throughline expresses differently on each layer; CCIL surfaces the cross-layer tension and proposes the unified working hypothesis.

## Variety throughline

Sudan Rume is an ancient Ethiopian landrace from the Boma Plateau — parent of SL-28. Both domains converge on the same character description: **transparency-driven aromatic landrace with variety-intrinsic light brown-tea body and a herbal-spicy aromatic register** (lemongrass, ginger, cardamom, blueberry on the brewing side; pineapple, lemongrass, ginger, light brown tea on the resolved natural roast). The variety expresses the same flavor signature on every layer; the differences below are about *how to preserve it through that layer's mechanics*, not about competing flavor targets.

**Body intuition rule applies on both sides.** On the brewing side: do not chase weight via grind when aromatic integration and cooling behavior confirm full expression — light body is variety-intrinsic. On the roasting side: do not add heat to chase body when the variety's intrinsic character is light. The variety is the variety. Pushing either lever produces over-extraction (brewing) or overdevelopment (roasting), both of which suppress the herbal-spicy aromatic register.

## Roasting layer — what we've learned

**Hybrid Washed (closed, ref batch #133, Las Margaritas / Herrera, Caicedonia, Valle del Cauca, Colombia, 1710m).** FC window confirmed at 200-205°C arriving ~4:00-4:15; below 200°C is uniformly underdeveloped (nutty, grassy, flat) regardless of dev time. Charge 117°C / hopper pre-load 125°C / bean-temp end condition. WB-to-Ground Agtron delta on winning pourover batch #119 was 1.0 (tight = even development = target). Fan curve confirmed at `80% → 70% → 65% → 72% → 75%` across BBP / Maillard / pre-FC / dev / drop.

**Natural (closed 2026-05-23, ref roast batch #187 / V5A, ~6:00-6:15 total, peak inlet 242°C with hard post-peak cliff).** Density 791 g/L / moisture 10.3%. The fruit layer thermally insulates the bean surface, so **WB-to-Ground deltas run wide (7-11 points)** — the negative reading reflects surface-suppressed-by-fruit-layer rather than core stall, and the magnitude is normal for this lot family. V5 session (2026-05-12) closed two protocol hypotheses: 240°C peak inlet definitively insufficient on this cliff shape (cannot reach 205°C bean temp within 6:00); 207°C end condition not viable (bean cannot reach within practical total time). Optimal total-time ceiling 6:15 (not 6:00).

**Cross-process roasting takeaway.** Dongzhe's "always start from the washed profile and let FC timing tell you whether to add or reduce energy" applies, **with the caveat from SR Natural's lived experience: Sudan Rume Natural required nearly as much energy as the washed version because the fruit layer insulates the surface.** Do NOT default to "natural = less heat" on Sudan Rume — the variety's density + the natural process's fruit layer combine to need washed-level energy. Fan curve hypothesis for SR Natural (V2 not confirmed): slightly lower mid-curve fan than washed (`80% → 68% → 63% → 70% → 73%`) to keep more heat in the drum through Maillard.

## Brewing layer — what we've learned

**Washed reference brew (CGLE-SRUME-WASHED-2026 batch #133, Latent-roasted).** UFO Ceramic + Sibarist Fast Cone, EG-1 6.0, 15g/210g (1:14 ratio), 91°C, Melodrip throughout, bloom 45g/45s, slow pour to 130g, slow pour to 210g. 2:45-3:15. Best warm-to-cool; cup opens significantly as it cools. Target flavors: candied apricot + bergamot + jasmine + lemon + integrated stone fruit tartness. **If muted at 91°C, go 1 click finer on grind (do NOT increase temp).** Cool-window evaluation is essential.

**Natural reference brew (CGLE Las Margaritas Sudan Rume Natural Special Guests, externally roasted).** EG-1 6.5 / 91°C / **April Brewer Glass + April Paper** / 15g / 240g (1:16) / three-pour structure. Temperature ceiling 91°C — at 92°C, lemongrass sharpens on cooling. Vehicle integration is the load-bearing axis: on Orea Glass + fast cone papers (B3 Cone, UFO Fast), the cup phase-separates with pungent lemongrass over adjacent sweetness; April Brewer Glass + April Paper integrates the same flavors as a woven composition.

## Cross-domain tension to flag

**The "fast cone phase-separates on Sudan Rume" brewing rule has a roasting-side counter-example.** The Brewing Historian's [by-cultivar/sudan-rume.md](../../../../../brewing-historian/cluster/patterns/by-cultivar/sudan-rume.md) vehicle-dependency rule was confirmed at N=2 (SR Natural + Newbery Street Thai cultivar-mix Washed) and promoted to working rule: SL-lineage and aromatic-landrace varieties on fast-cone vehicles phase-separate; April Brewer Glass + April Paper is the corrective vehicle. But the Latent-roasted SR Hybrid Washed reference brew runs on **UFO Ceramic + Sibarist Fast Cone + Melodrip** and produces an integrated cup (candied apricot + bergamot + jasmine + lemon + integrated stone fruit).

**Working cross-domain hypothesis (low confidence, single counter-example):** the vehicle-dependency rule may be process-scoped rather than variety-scoped. The aromatic-landrace volatile profile gets denser on naturals (fruit-layer fermentation adds late-attack volatile complexity that needs slow integration via the bed) and lighter on washed (less late-attack volatile complexity; fast bed with Melodrip-controlled turbulence preserves clarity). If this holds, the rule generalizes to: **fast-cone vehicles phase-separate aromatic-landrace NATURALS; fast-cone + Melodrip-controlled vehicles work on aromatic-landrace WASHED.**

Confirmation needed: a second Sudan Rume Washed brew (could be SR Hybrid Washed batch #148 re-brewed on April vs UFO Ceramic at identical recipe to compare integration), or a fresh aromatic-landrace washed lot (74110/74112/SL-28/Wush Wush). Until then, treat the vehicle-dependency rule as confirmed on naturals only.

## Recommendations consumable by planners

**Roasting Assistant — when you see Sudan Rume + Washed + medium-altitude origin (~1700m):**
- Anchor profile: SR Hybrid Washed batch #133 fan curve + 242-247°C peak inlet + charge 117°C + hopper 125°C + bean-temp end condition 205°C.
- FC window 200-205°C; below 200°C is uniformly underdeveloped. WB-Ground delta target ≤3 (tight = even development).
- Target dev time: leave the bean-temp end condition to fire (typically 5:30-6:00 total).

**Roasting Assistant — when you see Sudan Rume + Natural + low-to-medium altitude:**
- Start from the SR Washed profile envelope — **do not default to lower heat for natural processing on Sudan Rume.** Fruit layer insulation needs washed-level energy.
- If density ≥790 g/L and moisture ~10%: peak inlet 242°C minimum on a hard post-peak cliff (240°C definitively insufficient per V5 session).
- WB-Ground delta running wide (7-11 points) is normal for this lot family; read magnitude against the closest natural anchor, not against the washed anchor.
- Total-time ceiling 6:15; bean-temp end condition 205°C; don't try 207°C (V5B confirmed not viable).

**Brewing Assistant — when you see Sudan Rume + Natural (fermentation-driven, fruit-forward):**
- Anchor recipe: EG-1 6.5 / 91°C / **April Brewer Glass + April Paper** / 15g / 240g (1:16) / three-pour structure. Temperature ceiling 91°C.
- AVOID fast-cone vehicles (Orea + Sibarist FAST / B3 Cone / UFO Fast). Phase separation confirmed.
- Cool window evaluation: peaks 45-50°C; if lemongrass sharpens on cooling, drop temp 1°C — do NOT extend extraction.

**Brewing Assistant — when you see Sudan Rume + Washed (Latent-roasted reference exists):**
- Anchor recipe (low confidence on vehicle generalization): UFO Ceramic + Sibarist Fast Cone OR April Brewer Glass + April Paper, EG-1 6.0, 15g/210g (1:14), 91°C, Melodrip throughout. Bloom 45g/45s, slow pour to 130g, slow pour to 210g. 2:45-3:15.
- If muted at 91°C, go 1 click finer on grind — do NOT increase temp.
- Cool-window evaluation: best warm-to-cool; cup opens significantly cooling.

**Research Coordinator — when scoping a Sudan Rume research project (per [ADR-0017](../../../../../../adr/0017-research-assistant-architecture.md)):**
- N=3 is the corpus floor for cross-process pattern promotion. Today's N=3 covers Hybrid Washed (Latent) + Natural (Latent, resolved) + Natural (external CGLE Las Margaritas brewing-only). A third Sudan Rume Washed brew or a fresh aromatic-landrace washed lot would resolve the vehicle-dependency tension flagged above.
- Track candidate variables: process (washed / natural / hybrid) × vehicle (April vs fast cone) × roast peak inlet (washed envelope vs natural envelope). The variety throughline is the constant; the project maps how each layer's mechanics serve or suppress it.

## What this seed pattern is NOT

- **Not a recipe lookup.** Planners pulling specific recipes go to the brewing historian / roasting historian clusters. CCIL surfaces the cross-domain framing that informs HOW those recipes get chosen.
- **Not a final answer.** Promotion of the working "process-scoped vehicle-dependency" hypothesis requires the second Sudan Rume Washed brew counter-example to resolve. CCIL working hypotheses age into confirmed patterns or get retired; this entry will be revisited when N grows.
- **Not the only CCIL pattern that could land in Wave 4.** Sudan Rume is the seed because the substrate exists across both domains today. Future Pattern A refresh events (when Historians' patterns drift, when Workflow Executor sub-skills push new brews / roasts that match an existing CCIL pattern) will append patterns or trigger new pattern files via the [Roasting Historian](../../../../../roasting-historian/SKILL.md) + [Brewing Historian](../../../../../brewing-historian/SKILL.md) integration paths.

## Cross-references

- [Roasting Historian § Cross-Coffee Insight Layer](../../../../../roasting-historian/cluster/patterns/cross-coffee-insights.md) — WB-Ground Agtron delta directional interpretation by lot family
- [Roasting Historian § Roast-to-Brew Translation](../../../../../roasting-historian/cluster/patterns/roast-to-brew-translation.md) — predicting brew behavior from roast parameters
- [Roest Knowledge § Counterflow Observations](../../../../../roest-knowledge/cluster/machine/counterflow-observations.md) — FC window targeting, drop temp discipline, WB-Ground delta as development signal
- [Roest Knowledge § Fan Strategy](../../../../../roest-knowledge/cluster/protocols/fan-strategy.md) — fan curves for SR Washed (confirmed) and SR Natural (V2 hypothesis)
- [Peer-Learning Roasting Archivist § Dongzhe](../../../../../peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md) — "start from washed profile and let FC timing tell you" principle + SR Natural energy caveat
- [Brewing Historian § by-cultivar/sudan-rume.md](../../../../../brewing-historian/cluster/patterns/by-cultivar/sudan-rume.md) — full brewing-side variety entry: vehicle-dependency rule + body intuition rule + temperature ceiling
- [CCIL § decomposition-log.md](../../decomposition-log.md) — Pattern F audit trail (logs every CCIL self-decomposition event)
