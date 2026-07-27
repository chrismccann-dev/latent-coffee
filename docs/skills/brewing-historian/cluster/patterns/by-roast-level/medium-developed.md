# Medium / Developed Roast - by-roast-level capsule

First `by-roast-level/` capsule, stood up 2026-07-27: the graduation of cross-coffee Pattern #1 (Roast Level Can Override Process and Cultivar) at n=4 override data points with the non-Untold confirmation landed, plus the promotion of the **Medium-roast over-extraction lever** from the CCIL observing list. Operator-ratified scope broadening (Chris, audio, 2026-07-27): if something is more darkly roasted it does not really matter what it is (process, variety, etc.) - it has to be brewed in the context of taming its roast characteristic first and foremost. The pattern is **any-process** (seeded on specialty naturals, now confirmed on a clean washed) and **not an Untold-specific artifact** (non-Untold NO°5 confirmation + operator ratification).

## The override pattern (graduated Pattern #1)

When a coffee is materially more developed than the light / ultra-light baseline, roast level becomes the first routing signal. Process and cultivar defaults can point in the wrong direction because they assume lighter-roast solubility.

Confirmed shape:

- Process and cultivar defaults (Balanced Intensity / Suppression on naturals, Clarity-First on clean washed) would point elsewhere.
- Medium / dark roast solubles dominate the body.
- The cup shows fruit on attack but roast / ash / oversteeped black tea through the body.
- Parameter tweaks inside Balanced or Clarity-First do not solve it.
- Hybrid Intensity-Clarity Split works better because it separates fruit extraction from roast-register control.

Confirmed data points (n=4 override + 1 boundary marker):

- **Untold Brazil Fazenda Um Wush Wush Natural (WWNAT), brew 25b4465b (2026-05-22)** - a clean controlled natural (Raised Bed) the Controlled Natural row would default to Balanced Intensity. Roasted MEDIUM. On Balanced Intensity (April + April Paper, EG-1 6.4 / 93°C) the developed-roast solubles were amplified into a punishing oversteeped-black-tea wall with prune barely detectable. Resolution was a strategy re-zone to Hybrid (Intensity-Clarity Split) on the Switch (see [by-strategy/hybrid.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md)), NOT a parameter tweak within Balanced.
- **Untold Panama Janson Pacamara Natural (Hacienda 491, Dark Room Dried natural, Pacamara), brew 24b39678 (2026-05-31)** - whole-bean Agtron 47.9, the darkest roast in the archive, visibly oily. Pacamara density -> Balanced and the cold-room-dehydration flag -> Suppression, but at Agtron 47.9 the roast governed above both. Brew 1 (Orea + FLAT 2 B3, 88°C / EG-1 6.7) gave guava/molasses attack but a bitter/smoky/ashy oversteeped-tea body; resolved by Hybrid (Switch, EG-1 6.8). See [by-cultivar/pacamara.md](docs/skills/brewing-historian/cluster/patterns/by-cultivar/pacamara.md).
- **NO°5 Classic Crema, Tanzania Kifaru Bourbon Washed, brew 91b546bb (2026-07-22)** - the NON-UNTOLD confirmation, on a commodity/house-label MEDIUM roast. Clean washed Bourbon would default nowhere near Hybrid; the roast governed. Brew 1 (April, 88°C, Suppression) came back roast-walled; resolution was the strategy re-zone to Hybrid (Intensity-Clarity Split) on the SWORKS Bottomless (92°C + fast Dial 7 drain + lift-cut at ~180g), not a parameter tweak. Same signal shape: fruit (orange/stone fruit) on attack, dark roast register through body/finish. This is the data point that both ruled out the roaster-specific-artifact concern AND broadened the confirmed shape beyond naturals (clean washed now confirmed) - the basis for the any-process scope.
- **Untold Panama Finca Deborah Geisha Natural "Interstellar", brew c818dfcb (2026-07-27)** - WB Agtron 60.6 MEDIUM. The roast beat BOTH the Panama Gesha Clarity-First variety default and the yeast-inoculated-natural Balanced Intensity default. First clean instrument-Agtron-led intake confirmation: the WB read at dose-out + the Untold roaster card led strategy from brief time. Resolved via Hybrid (Intensity-Clarity Split) on Hario Switch + CONE FAST after three failed brews on the April Switch - the hardware precondition below. See [by-cultivar/gesha.md](docs/skills/brewing-historian/cluster/patterns/by-cultivar/gesha.md) + [by-strategy/hybrid.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md).
- **Boundary marker - Untold Brazil Fazenda Um Pink Bourbon Dark Room Natural (TUVADKNAT), brew 91a014fd (2026-07-27)** - WB Agtron 70.1 MEDIUM LIGHT, same farm as WWNAT, and the first Untold lot with NO roast-tail wall. The override has an Agtron bound: the wall threshold sits somewhere between 65.4 and 70.1 WB. At ~70 and above, run a single-mode diagnostic brew first rather than pre-committing to ICS (the fast-rinse open phase starves a light-roast back half with nothing to flush).

Operational rule:

- If Agtron, visual roast, or first cup says "developed roast is the loudest signal," check roast-level logic before process family or cultivar. The override is catchable at the Agtron read, before brewing - 47.9 on a coffee sold as a fruit-forward natural was the lead diagnostic, and the visual (oily, deep brown) corroborated.
- If the tasting signal is **fruit on attack + ashy / smoky / black-tea body**, treat it as a Hybrid trigger.
- Do not chase roast ashiness with finer grind or more agitation.
- At brief time, roast level should LEAD strategy selection on developed-roast lots rather than sitting as a tasting-posture footnote.
- **Hardware precondition:** developed-roast ICS needs a fast-draining cone switch + fast paper (Hario / V60 Switch + CONE FAST), NOT the April Switch - the ICS open phase must be a true rinse, and a slow-draining flat switch silently turns it into continued extraction. Full routing rule in [brewing-equipment-expert operational-reference.md](docs/skills/brewing-equipment-expert/cluster/operational-reference.md).
- **Cut boundary:** the late-cut guidance flips with roast depth - cut tight at ~Agtron 48 (Pacamara), do NOT cut at ~60 (Finca Deborah: the late drain carries balancing depth). The cut-vs-no-cut boundary sits between 48 and 60, not at "medium."

## The over-extraction lever (promoted from the CCIL observing list, 2026-07-27)

On a medium-or-darker roast, over-extraction risk is **roast character** (chocolate / nut / bittering climbing forward of the green's fruit signature), NOT under-development. The corrective lever is **evaluate cooler + accept a chocolatier register** - not temperature / agitation push. Pushing harder surfaces more roast, not more flavor; on delicate-aromatic lots, coarse-plus-cool suppression is also unsafe (it starves fruit faster than roast - Finca Deborah).

Runtime intake guidance lives in [brewing-assistant operational-guide § Roaster roast-level hook](docs/skills/brewing-assistant/cluster/operational-guide.md): the two intake channels (instrument WB Agtron read where feasible; deliberate operator call-out otherwise) + the three-route forceful-confirmation discipline.

Promotion history: seeded Round 10 Wush Wush (2026-05-22); intake-led trigger tightened at Item 20 / Group 5 grill (2026-05-24, audio-ratified); confirmations WWNAT (operator), Janson Pacamara (operator call-out), Finca Deborah (instrument-Agtron-led). All three confirmations are Untold lots, but Chris ratified the lever as not Untold-specific at the 2026-07-27 arbitration follow-up (the NO°5 washed override + human empirical read: a darker roast must be tamed first regardless of what the coffee is).

## Thermal-ceiling refinement (density hypothesis, n=1)

**Roast level routes the STRATEGY but under-predicts the TEMPERATURE CEILING; suspect bean density (2026-07-27, TUVADKNAT, brew 91a014fd).** The TUVADKNAT lot (Agtron 70.1, Sul de Minas at 1000-1260 m) bled roast character across the whole cup at 94°C - at every station, with the two Hybrid phases failing to integrate - and reverting to 92°C resolved it completely. Meanwhile Terraform Clara Luz Sidra Natural at Agtron 62.4, a materially DARKER roast (but 1720 m), took 94°C with zero roast bleed. A lighter roast with a tighter thermal ceiling is backwards on roast level alone.

**Hypothesis (n=1, explicitly unconfirmed): bean density sets the temperature ceiling, and roast level sets the strategy.** A softer, less dense sub-1400 m bean plausibly gives up its roast-derived compounds sooner at a given temperature regardless of how far the roast was taken. If it holds, the operative rule is "low-elevation lots have a low thermal ceiling regardless of how light the roast reads" - generalizing past Brazil to any sub-1400 m lot.

**Named discriminator, ready to run:** two other Untold Brazilian lots in freezer stock are Carmo de Minas at higher elevation - Carmo Pacamara Anaerobic Natural (WB 76.5, LIGHTER) and Carmo SL28 Natural Anaerobic (WB 59.1, DARKER). Brewing either at 94°C separates the explanations: if the higher-elevation lots tolerate 94°C at both Agtron extremes, density governs; if the 59.1 bleeds and the 76.5 does not, roast level is sufficient and this entry should be retracted.

**Practical guidance in the meantime:** on any lot below ~1400 m, do not read "the roast is light" as temperature headroom - establish the thermal ceiling on its own before spending it. And keep STRUCTURAL headroom (the immersion could go longer) separate from THERMAL headroom (the kettle could not) - they are easy to conflate and call for opposite moves.

## Open boundaries

- What Agtron or visual threshold should trigger roast-level-first routing before process-family routing? Current markers: wall confirmed at 65.4 and below; no wall at 70.1; the cut boundary sits between 48 and 60.
- Density-vs-roast-level discriminator (above) - unrun.
- Whether the graduation criterion's original "non-Untold specialty natural" case ever lands is now moot for the pattern's existence (any-process, operator-ratified) but still useful as further N on the naturals side.

## Related

- [cross-coffee-insights.md](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md) - router (Pattern #1 pointer + Cross-Axis Strategy Router row)
- [by-strategy/hybrid.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md) - the ICS data-point log
- [brewing-equipment-expert operational-reference.md](docs/skills/brewing-equipment-expert/cluster/operational-reference.md) - switch-brewer routing rule
- [brewing-assistant operational-guide.md](docs/skills/brewing-assistant/cluster/operational-guide.md) - Roaster roast-level hook (runtime intake)
- [docs/brewing/roasters.md](docs/brewing/roasters.md) - Untold Coffee Lab card (roaster-level skew + Agtron bound)
