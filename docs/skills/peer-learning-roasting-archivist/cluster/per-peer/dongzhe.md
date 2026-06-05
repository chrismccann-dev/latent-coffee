# Dongzhe — Peer Roaster Profile

**Same machine (Roest L200 Ultra, counterflow mode), same general practice, different cup target + different methodology.** Highest-weight directional source in the peer hierarchy; specific numbers don't transfer due to confirmed machine-level thermal differences and his looser dev / darker target. Authored as a Pattern I operator-curated profile per [ADR-0013](docs/adr/0013-self-improvement-primitives.md); next-source integration happens when Chris surfaces new long-form content (livestream, podcast, blog post).

**Tier in reference-signal hierarchy** (per Roasting Assistant intake): **Tier 2** — peer roaster on identical machine + method. Above Tier 3 (WBrC champion / Sey / Substance generic roasting wisdom, totally different machines) and below Tier 1 (Chris's own resolved roasts on this archive's coffees: Mandela XO #139, SR Washed #133, etc.).

---

## Reference roast target — Batch #249 "IT simple slow 100g"

Primary external reference for style + structure throughout the Sudan Rume Washed experiment arc.

| Parameter | Value |
|---|---|
| FC | 3:55 / 200.3°C |
| Drop | 205°C |
| Dev | 36s / 13.3% DTR |
| TP | 94.3°C |
| Charge | 112.2°C |
| Maillard | 39.1% |
| Drying | 47.6% |

**Machine differences confirmed:** Dongzhe's TP is 94.3°C vs. Chris's 78-81°C. Dongzhe's charge temp is 112.2°C vs. Chris's resolved 117°C. These differences are machine-specific and do not represent different roast philosophies — directional principles transfer, specific numbers do not.

**Process caveat:** #249 is a **washed** coffee. Profile shape is a great washed-counterflow benchmark, but naturals / anaerobics / processed lots / high-moisture greens all behave differently. Don't transfer the inlet shape directly to non-washed lots — use it as a reference for what good development cadence looks like on washed coffee, then adapt per the coffee's process + green spec.

---

## Core principles (folded from chat-history extractions)

### RoR shape over dev time as the primary lever

Don't treat dev time as the independent variable. Instead, vary the RoR curve leading into FC (how much momentum you carry through Maillard and into crack) while holding drop temp fixed. Dev time becomes the measured output of that shape decision, not the thing you're directly setting.

**Important nuance from Sudan Rume Washed resolution:** This principle governs early-stage experimentation when profile architecture is still being resolved. Once profile shape is established, dev time can be legitimately tested as the primary variable to find the ceiling and floor within a confirmed shape.

### The Maillard + dev flavor axis

Shorter Maillard + higher momentum at crack + shorter dev → more acidity and clarity. Longer Maillard + slower momentum at crack + longer dev → more sweetness and body. These are not independent dials — they move together as a function of how energy is applied through the curve.

### Naturals starting framework

Use the washed profile as the starting point. Lower inlet for early stages — gentler start. Taper heat away earlier. Primary failure mode for naturals is overdevelopment, not underdevelopment.

**Caveat from Sudan Rume Natural experience:** Sudan Rume Natural required nearly as much energy as the washed version due to the fruit layer insulating the core. Always start from the washed profile and let FC timing tell you whether to add or reduce energy.

---

## Yunnan-Hatchi livestream (2026-05-17) — full extraction

Provenance anchor for Dongzhe's operational roasting decision tree, captured from a long livestream session he ran on **2026-05-17**. Source video: <https://www.youtube.com/watch?v=9ehIioqBesE>. The five operational deltas below have been folded into Chris's roasting practice where they shape behavior; this section holds the full extraction so future Pattern A refresh cycles can re-derive the deltas if framing shifts.

### What he roasted

Three experimental Yunnan coffees from a producer who partnered with Hatchi to apply Hatchi-style advanced processing to local Yunnan varietals. All three were ~100g batches on his L200 Ultra in counterflow mode.

| Coffee | Process | Green reading | Roast direction | Cup result |
|---|---|---|---|---|
| Precursor Amplification Natural | Most funky / natural | 8.9-9% moisture, ~825 g/L density | Slower / gentler because low moisture | Tropical, dried fruit, papaya/banana, funky but not harsh |
| Cascade Fermentation | Two-stage fermentation | ~11% moisture, lower density | More drying energy to match prior momentum | Citrus, tropical, white floral, tea-like earthiness |
| Enzy Flow Honey | Cleanest on paper | ~9.3% moisture, green pepper / spice aroma | Slow enough to "see if we can taste anything" | Cleanest of the three; brown sugar, stone fruit, crisp acidity, Kenya-like as it cooled |

The Enzy Flow was his favorite of the session. He described 35-50s dev, ~6-7 min total roast length, and self-assessed one batch as "9% weight loss, too much development" — so his cup target sits darker than Chris's Sey / Substance / Big Sur reference. This matters: his momentum-at-FC framing transfers; his specific dev-time targets (50s) probably do not.

### Dongzhe's decision tree (his own words, condensed)

The single most important framing from the session, paraphrased close to verbatim: **"I look at the processing last. I look at the physical qualities first."**

His intake hierarchy when meeting a new green:

1. **Moisture** — sets early energy
2. **Density** — sets energy tolerance and FC floor expectation
3. **Bean size** — helps predict heat transfer
4. **Process intensity** — decides stretch vs compress within the energy envelope
5. **Desired expression** — clarity / sweetness / process / suppression
6. **Prior reference curve** — which existing profile to anchor on

This is **structurally different** from Chris's prior New Coffee Onboarding Protocol Step 3 logic, which implicitly led with process family (washed → SR Washed #133, natural → SR Natural, heavy ferment → Mandela XO), then density/moisture modify the energy. Dongzhe's framing is closer to: moisture/density picks the energy envelope, then process decides stretch-vs-compress within that envelope.

The practical difference shows up exactly on lots where the process-first approach gives a vague anchor — e.g. a Daterra Laurina (low altitude, low-caffeine cultivar, unfamiliar bean shape) where the process-first approach offers no good match but moisture/density still gives a defensible starting energy.

### Five operational deltas (folded into Chris's practice)

These are the actionable extracts. The full transcript has more texture, but these are the items that shape behavior in the Latent system.

#### Delta 1 — Green physics first, process second (STRUCTURAL)

Promote moisture + density (paired) to first-order intake signal alongside process and terroir/cultivar. Equal-weight four-input check at the New Coffee Onboarding Protocol Step 3, not a process-first hierarchy.

Status: Cross-referenced from [ROASTING.md § Step 3 - Anchor Profile Selection Logic](ROASTING.md).

#### Delta 2 — Momentum into FC > weight loss (CONFIRMATORY + adds proposed logged fields)

Dongzhe watches RoR at FC and wants enough momentum at crack to support 35-50s dev. He doesn't aim for a fixed weight loss target; weight loss is an outcome check, not a primary steering metric.

Chris already knows this intuitively, and the prior Peer Insights framing already said "vary RoR curve leading into FC while holding drop temp fixed; dev time is the measured output." The new operational implication is **adding logged RoR fields** that make this discipline measurable across the archive.

Chris's silent-crack archive (SR Natural, Mandela XO, Costa Rica Anaerobic, likely the incoming Untold anaerobics) makes RoR-at-FC unreliable for his lots in a way it isn't for Dongzhe (who's mostly roasting cleaner-cracking coffees). Proposal: log three fixed-time momentum marks instead.

| Proposed field | Rationale |
|---|---|
| RoR @ 2:30 | Drying-handoff check. The moment Dongzhe was watching when he raised drying energy on the Cascade after measuring 11% moisture. |
| RoR @ 4:00 | Approach-to-FC primary momentum signal. Below Chris's typical FC range (4:30-4:45) so it captures the run-up before FC's exothermic kink. |
| RoR @ FC-30s | Cross-lot comparable post-hoc anchor. Requires knowing FC after the fact, but useful for analysis. |

All three are extractable from Roest log data Chris already captures — no new measurement equipment, no live-operation burden.

Status: **Schema work parked in [PRODUCT.md § Side Quests](PRODUCT.md)** — touches `push_roast` input schema, archive-import column dependencies, and the Roest log extraction pipeline. Separable decision from "does ROASTING.md describe these as fields we track." Currently waiting on Chris's explicit go-ahead before opening that sprint.

#### Delta 3 — Honey process is a fork (INFORMATIONAL → placeholder framework)

Honey coffees can be roasted "as a washed process or as a natural process," depending on which side of the honey character is being highlighted:

- Want clarity / florals / acidity: treat closer to washed
- Want sweetness / body / fruit: treat closer to natural
- Want both characters: test one compressed profile and one stretched profile

Chris has no resolved honey lots in the archive. Currently the only honey lot in inventory is the **Cruz Loma TM Honey one-shot** (Taza Dorada 2024 #15), queued behind the Rancho Tio Emilio Typica Mejorado Washed one-shot. Useful framing to have when that lot comes up for roast.

Status: Cross-referenced from [ROASTING.md § Honey Process - Roast Direction Fork](ROASTING.md). Placeholder framework until the first honey lot resolves; then converted to lot-knowledge.

#### Delta 4 — Low-moisture and high-moisture rules (CONFIRMATORY → upgrades confidence)

- **Low moisture (≤10%):** gentler / slower early energy. Avoid overshoot. Watch for early momentum spike. Use ground color (not whole-bean visual) to verify.
- **High moisture (≥11%):** more drying energy to match the curve traced on a normal-moisture lot. **Do not conflate with more development** — moisture needs drying support, it does not automatically mean more post-crack dev.

Both rules already exist in [ROASTING.md § Green Spec → Starting Hypothesis](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#green-spec--starting-hypothesis) at Medium confidence. The REDPLUM-CAS-2026 V1 (11.2% moisture, biased upward 2°C) and BRA-BIOMA-PB1604 V1 design (9.3% moisture, biased lower than Bioma Natural) are both consistent with what Dongzhe describes — so this is partial validation of moves Chris is already making.

Status: Confidence on the two moisture rows in the Green Spec table **upgraded Medium → Medium-High** with peer-livestream confirmation.

#### Delta 5 — Counterflow visual color unreliable (CONFIRMATORY, no system change)

Dongzhe noted that in counterflow it's hard to visually see the beans during the roast, and for strange processed coffees the roasted visual color did not necessarily represent what was happening in the cup.

Chris already knows this deeply — it's why the Lighttells CM200 exists and why ground Agtron is the primary anchor. Independent same-machine confirmation, but no system change needed.

### Caveats — what NOT to import

#### Single-batch directional methodology

Dongzhe is **not running V1/V2/V3**. He's running single-batch directional roasts and tasting them fresh. His feedback loop is "did this taste good fresh?" not "did this produce a reference roast confirmed via Day 7 pourover at the optimized brew." That means his heuristics are tuned for "make a sellable production roast in one or two shots," not "find the local optimum for a lot through structured iteration."

**Risk:** importing his shortcuts as principles when they're actually compensations for not iterating. The Latent system's experiment loop is more disciplined than his and should remain so.

#### Darker target

His self-assessment "9% weight loss, too much development" and his cup descriptors (brown sugar, stone fruit, cacao, Kenya-like-when-cooled, compared to Esmeralda Gesha) point to a darker roast target than the Sey / Substance / Big Sur / Picky Chemist reference Chris is roasting toward. The momentum-at-FC framing transfers; his specific dev-time target (50s) probably doesn't, and his Maillard discipline is looser than what Chris would accept.

#### Specific numbers don't transfer

Even though the machine matches, his charge temp, BBP protocol, hopper pre-load, fan curve, and end-condition logic are all unknowns relative to Chris's set-up. Same caveat that already governs the Reference Roast Target — his TP 94°C vs. Chris's 78-81°C; his charge 112.2°C vs. Chris's 117°C. The framework transfers; the numbers don't.

#### Don't modify V1 designs already in flight

Iterations mid-stream (COL-MIL-GES-2026 V2 design, COS-HIG-BOR-2026 V3 design, REDPLUM-CAS-2026 Day 7 evaluation, CGLE-SRUME-NATURAL V3 at livestream-time) all had anchors and hypotheses already set. Adding a new reference mid-stream is exactly the cross-experiment contamination risk Chris has been disciplined about avoiding. The deltas in this doc apply to *next* lot intakes, not current iterations.

### Reflection

A line from Dongzhe's claude.ai discussion that's worth surfacing: **"Stop thinking of process as the primary profile selector. Use moisture/density to set heat-transfer strategy, then use process to decide whether to stretch or compress expression."** That's a stronger framework for the Roest counterflow method than "washed profile," "natural profile," or "anaerobic profile" naming alone — and it's the structural framing Chris's Step 3 Anchor Profile Selection Logic is now built around.

---

## Provenance + freshness

- **First long-form capture:** 2026-05-17 Yunnan-Hatchi livestream (URL above).
- **Prior chat-history integration:** Dongzhe references in ROASTING.md predate this doc; the Reference Roast Target + Core Principles sections were folded from those chat-history extractions before the livestream existed.
- **Pattern I trigger:** next session is operator-initiated when Chris surfaces another long-form content event (livestream / podcast / blog post). No autonomous external monitoring per [Peer-Learning Roasting Archivist SKILL.md](docs/skills/peer-learning-roasting-archivist/SKILL.md) Round 2 lock.
- **Refresh cadence:** episodic, not periodic. Stale-claim detection happens when a folded delta turns out to be wrong on a future Chris lot (Pattern A signal flows back up through the affected Delta entry).
