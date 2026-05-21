# Key Counterflow Observations (Machine-Specific)

All observations in this doc are **specific to Chris's Roest L200 Ultra in counterflow mode**. Directional principles transfer across counterflow units; specific numbers (TP, charge temp, FC floor) do not. Use these as the anchor for Chris's machine; re-derive for any new unit.

Migrated from ROASTING.md § Key Counterflow Observations (Machine-Specific) in Wave 3 PR 1 (2026-05-26).

---

## Turning Point (TP)

TP probe reads consistently low (78-81°C) across all sessions regardless of charge temp, BBP fan speed, or charge timing. Dongzhe's machine reads ~94°C under similar conditions (see [peer-learning-roasting-archivist § Dongzhe](../../../peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md) for the same-machine peer reference). TP is almost certainly a measurement artifact or probe placement difference specific to this unit.

> **Do not use TP as a primary diagnostic signal — it is not actionable on this machine.** Use FC temp and FC timing as the primary drum-state proxies instead.

---

## FC Temperature Targeting

**Target FC at 202-205°C arriving at ~4:00-4:15.**

For CGLE Sudan Rume Hybrid Washed, the confirmed FC window is 200-205°C:

- Below 200°C (#134, FC 197.6°C): uniformly underdeveloped cup — nutty, grassy, flat — regardless of dev time
- 200-205°C: correct development range — aromatic character fully expresses
- Above 206°C: overdevelopment risk begins — dark tea, flat, loss of top-note lift

This FC floor/ceiling concept is coffee-specific and should be re-established for each new lot through experimentation. Do not assume this window transfers directly.

---

## Charge Temperature

Charge at 117°C. This is the resolved charge temp for this machine based on extensive empirical testing.

- Charging at 112-113°C: slow Maillard, late FC, potential stalling
- Charging at 117°C with 125°C hopper pre-load: FC timing and phase balance on target
- Charging at 119°C+: risk of over-energized drum, compressed dev time, early overdevelopment

The logged "charge drum temp" in Roest Connect will read 113-116°C due to probe measurement lag after beans begin absorbing heat. This is normal. Your actual charge moment is when the probe reads 117°C.

---

## Total Roast Time

**Acceptable range: 4:30 - 6:00.** Below 4:30 is almost always underdeveloped (tighter tolerance on the lower end). Between 5:00 and 6:00 can still produce strong cups depending on the coffee. Above 6:30 starts to enter overdevelopment / baked territory regardless of profile. The lower bound is firm; the upper bound has more give.

- Under 4:30: risk of insufficient internal development in counterflow mode regardless of surface Agtron reading
- 4:30 - 6:00: usable window; 4:30-5:00 is the typical target, 5:00-6:00 acceptable when the coffee benefits from longer Maillard
- Over 6:30: Maillard stall, roasty/baked notes, loss of top-note expressiveness

---

## Session Position Effect

Roast position within a session meaningfully affects FC timing. First roast in a session consistently runs 10-15 seconds slower through Maillard than second or third roast due to accumulated residual drum heat.

**Practical implication:** The first roast of a session is the hardest to replicate precisely. Default behavior: do not compensate — rely on the standard thermal reset protocol (dry roast to 140°C → BBP to 120°C → charge at 117°C) and use drop temp as the primary control across all three batches. The thermal reset protocol standardizes starting drum temp batch-to-batch, so the residual session-position effect is small enough to absorb into the experiment rather than correct for. Fallback: if session-position effects are later shown to materially confound a replication session, loading the first batch at ~128°C (vs. standard 125°C) is the compensation lever — but this introduces a second variable and should not be used during V1 directional probes.

---

## Drop Temp as the Primary Drop Signal

> **Drop on temp, not on clock.** Drop temp is the primary decision gate on every roast.

**Default mechanism (as of 2026-05-04): bean temp end condition on every profile.** The Roest end condition can be set to one of: total time, dev time, dev %, or **bean temp**. Setting bean temp end condition to your target drop temp (e.g. 208°C) is the cleanest mechanism: the machine auto-drops at the threshold, no manual reaction time, no "did I catch it at 207 or 208" variance.

**Why this is the default now (was previously dev time as safety net + manual drop):**

- Drop temp becomes a first-class controlled variable on the profile, not a manual-execution variable. Reproducibility batch-to-batch tightens.
- For silent-FC coffees (Mandela XO, anaerobic naturals, XO-process), bean temp is the only meaningful drop signal. Setting it on the profile honors that directly instead of relying on the roaster watching the probe.
- Confirmed reliable on the L200 Ultra: end-condition trigger fires effectively instantly at the threshold; bean temp probe reads in 0.1°C increments and clicks up to the target cleanly with no observable lag at the drop-zone range.

**Manual drop is now the fallback:** if you want to override (e.g. roast is running unusually fast and you want to drop earlier than the profile threshold), the Roest UI provides a manual-override button — confirmed working in practice. After overriding, the rest of the roast is on you.

**Drop temp as a per-experiment-batch design variable:** because drop is now profile-set, you can design experiments that deliberately vary drop temp across A/B/C batches (e.g. v3a 208°C / v3b 210°C / v3c 212°C drop sweep on a fixed peak inlet). This was clunky under the manual-drop regime; it's clean under bean temp end condition.

**Compatibility with FC marking:** if a coffee has audible FC, mark it manually for the data record — bean temp end condition still drives the drop. If silent, do not try to mark FC; let the profile end condition do the work and log as manual-no-audio at the drop temp. See [cluster/protocols/fc-marking.md](../protocols/fc-marking.md) for the full protocol.

### Manual-override exception rules (when to override the BEAN_TEMP end condition)

The BEAN_TEMP end condition is the default mechanism, but operator override is appropriate in four specific cases. The override button is the right tool when one of these patterns is recognized in real time.

Long-end overrides (drop earlier than the auto-drop would fire):

- **RoR has stalled out and the curve is flattening before the bean temp target is reached.** If RoR drifts to ~0% with bean temp still below the auto-drop threshold and the curve isn't going to recover, holding for the auto-drop just bakes the coffee. Drop manually before the bake propagates. (Example: REDPLUM v1a / batch 180 — FC at 5:07 / 203.6°C, RoR drifted to ~0% by ~5:30, drop fired manually at 5:30 / 203.6°C rather than waiting for the 207°C BEAN_TEMP target.)
- **Past first crack but still well short of the bean temp target with no momentum.** Same shape as the stall case but framed by FC reference rather than RoR shape — if FC has happened, dev is accumulating, and bean temp isn't climbing toward the auto-drop, the dev window is going to overrun before the temp hits.
- **Total roast is approaching the 6:00-6:30 mark.** Hard time ceiling — once total roast is in the 6:00-6:30 window, operator judgment call regardless of where bean temp is. The character of the roast at that point is determined more by the long total time than by the drop temp the auto-drop would fire at.

Short-end overrides (hold past the auto-drop):

- **Bean temp blows past the end condition target but the roast is too short.** Most commonly because peak inlet was too aggressive and bean temp climbed faster than FC kinetics. If FC hasn't happened yet (or just barely happened with no dev accumulation), the auto-drop will fire pre-FC or near-pre-FC and the result is baked, not roasted. Hold past the auto-drop until FC occurs and at least minimal dev accumulates. (Example: REDPLUM v1c / batch 182 — reached 207°C bean temp at 4:15 with no FC heard; should have held past 207°C rather than letting auto-drop fire. Result was Agtron 90.8 / 10.3% weight loss — nearly green-bean territory.)
- **FC arrived hotter than expected and you want a longer development.** Less critical than the short-roast case; this is fine-tuning rather than failure-mode prevention. If FC hits the bean temp target with too little dev accumulation behind it, holding past the auto-drop for 5-10s of additional dev is a defensible operator decision.

The pattern across all five rules: **the BEAN_TEMP auto-drop optimizes for the typical case where FC arrives in window and dev accumulates normally; operator override is for the edge cases where the typical assumptions break down.** When override happens, document end_condition_type as `manual` on the roast row (not `bean_temp`) so the analysis layer can distinguish operator-initiated drops from machine-initiated drops.

---

## WB-to-Ground Agtron Delta as Development Signal

The delta between whole bean (WB) Agtron and ground Agtron is one of the most sensitive internal development signals available. **Operational vocabulary tracks magnitude, not sign** — the directional interpretation (surface ahead of core vs core ahead of surface) flips by lot family, so the scalar delta is read for magnitude and the surface-vs-interior pattern is named in prose when it matters. See [CONTEXT.md § WB→Gnd Agtron delta](../../../../../CONTEXT.md) for the canonical definition.

| Magnitude | Reading | Action |
|---|---|---|
| ≤3 points | Even development — surface and core developing at similar rates | Target zone — no profile change needed |
| 4-6 points | Working delta — surface and core out of step | Profile adjustment indicated; direction depends on lot family (see below) |
| >7 points | Wide delta — significant surface-to-core imbalance | One layer's character dominates; the other is suppressed |

**Directional interpretation by lot family.** The sign of the delta carries different meanings depending on whether fermentation cellulose is modifying the bean's outer-layer thermal behavior:

- **Conventional case (washed / no fermentation insulation)** — Ground typically reads lighter than WB (positive delta in the WB-minus-Ground convention). Surface developed ahead of the less-developed interior; the larger the delta, the more the core stalled relative to the surface. Sudan Rume Hybrid Washed sits here — winning pourover batch (#119, delta 1.0) had the tightest delta in the experiment run.
- **Heavy-ferment / fruit-layer case (anaerobic naturals, XO ferments, fruit-layer naturals)** — WB often reads lighter than Ground (negative delta in the same convention). Fermentation cellulose insulates the surface, so the interior actually develops more uniformly than the surface implies. Mandela XO #139 (WB 76 / Ground 72.4) is the case study; CGLE Sudan Rume Natural V1's 7-11-point deltas reflect the fruit layer holding the surface back rather than the core stalling.

**Operational implication.** Read the magnitude against the lot's closest anchor profile (Sudan Rume Washed CF-Light #133 = 1.0 for the washed family; Mandela XO #139 = 3.6 for the heavy-ferment family) rather than against a universal threshold. A 5-point delta on a washed lot is a different signal than a 5-point delta on an anaerobic natural — the first is core lag, the second is fermentation-layer thermal insulation working as expected. The shrinking-delta convergence signal (delta tightening across successive V-sets) is reliable in both cases.
