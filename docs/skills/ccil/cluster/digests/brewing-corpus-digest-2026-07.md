# Brewing Corpus Digest — 2026-07

*CCIL cluster · point-in-time full-corpus read · authored 2026-07-08*

## What this is

The first full read of the brewing corpus: **102 `brews` rows (2026-01-19 → 2026-07-02) + all 13 `roast_learnings` rows**, pulled directly from the DB on 2026-07-08 (re-measured, not folklore). It answers the question no single session had ever asked: *what does the whole archive say when read at once?*

It is a **digest, not a pattern layer**. The per-anchor rules live in the Brewing Historian cluster ([cross-coffee-insights.md](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md) + the by-strategy / by-cultivar / by-coffee-family capsules) and stay canonical there — nothing here overrides them. What a full-corpus read adds that the incremental pattern layer structurally cannot see: **time-shape** (how the practice itself drifted), **corpus-wide distributions**, and **cross-source correlations** (brews × roast_learnings). Refresh cadence: re-run this read when the corpus roughly doubles (~200 brews) or when a roadmap decision needs the whole-corpus view; do not maintain it incrementally.

Corpus shape at snapshot: 50 purchased + 13 self-roasted (Latent) roaster rows lead the distribution — Moonwake 18, Latent 13, Picolot 10, Hydrangea 9, Dongzhe 8, Strait 6, Sey 4, long tail of 1-3s. Strategy totals: Clarity-First 40 · Balanced Intensity 30 · Hybrid 15 (7 intensity_clarity_split / 4 temperature_staged / 4 sequential) · Full Expression 8 · Extraction Push 5 · Suppression 4. Prose coverage is excellent: 99/102 carry `what_i_learned`, 100/102 carry `temperature_evolution`. Structured coverage is thin where the roadmap already suspected: `cooling_curve_target` set on only 17/102 (all since 2026-05-07), `water_recipe` on 14/102 (all since 2026-05-22).

## 1. The strategy drift arc — the single biggest finding

The corpus is not a flat archive; it has a clear three-era shape that no per-brew read surfaces:

| Era | Months | Signature |
|---|---|---|
| **Single-mode parameter era** | Jan–Mar (44 brews) | Clarity-First/Balanced only (26/14), Orea + FAST dominant, iteration = grind/temp/pour tweaks within one mode. Zero Hybrid, zero modifiers. |
| **Valve-vocabulary era** | Apr–May (45 brews) | SWORKS arrives (office); valve structure becomes a named lever (Picolot fast/fast/slow vs slow/slow/open inversion); Suppression + first Hybrids (sequential) + first modifiers (late cut, Aroma Capture) appear. |
| **Structural era** | Jun–Jul (13 brews) | **Hybrid is the plurality strategy (8/13)**; every one arrived as a *pivot from a failed single-mode plan*, never chosen at brief. Temperature-Staged emerges (4 confirmations: Component Terra 06-05 → Gesha Clouds 06-14 → Red Plum 06-25 → Glitch 74165 07-02). Water chemistry enters as a live lever. |

Read against [CONTEXT-taste.md](CONTEXT-taste.md): this is the **clarify-stage toolkit maturing in real time**. The brewing philosophy's toolkit list (intensity/clarity split, thermal staging, valve modulation, output selection) was aspirational in April; by July every item has multiple confirmed archive instances. The express-then-clarify couple is now operational practice, not doctrine.

Two structural mechanics the era shift produced, both already promoted into the Historian cluster but worth naming as the arc's engine:

- **The simultaneous under-AND-over signal is the era's diagnostic.** 9 brews carry explicit strategy-divergence records; nearly all resolve to Hybrid or Extraction Push, and the trigger is always the same shape — hollow/under-expressed front + heavy/over-extracted back at once, which no even-extraction lever can fix.
- **The escalation ladder is now 2 rungs:** single-mode fails → ICS (phase separation); ICS fixes the front but the two phases want different temperatures → Temperature-Staged. Confirmed 4× (above). The ladder was discovered rung by rung; the archive now supports teaching it as a ladder at brief time.

## 2. Recipe drift per roaster

Supportable for the 6 roasters with n≥4; the long tail (n≤3) can't carry a drift claim.

- **Latent (self-roasted, 13)** — the cleanest drift line in the corpus and a proxy for the whole system's learning: Clarity-First one-shots (Jan–Mar) → Balanced Intensity on ferment lots (May) → Suppression + late cut (Higuito, 05-22) → Hybrid ICS (Mt Elgon 06-03, Bukure 06-06) → Temperature-Staged (Gesha Clouds 06-14, Red Plum 06-25). Since June, **every Latent optimized brew is a Hybrid** — consistent with the roasting philosophy's develop-fully-then-brew-suppress: self-roasts increasingly *require* the clarify-stage structural toolkit, and that is by design, not drift.
- **Moonwake (18)** — no strategy drift (Balanced/Clarity alternating by lot) but a clear **temperature drift**: early brews at 88–93°C; from May onward 94–96°C after their "higher temps for washed" guidance was tested and confirmed (El Oasis 96°C, Ngoma 94°C). Their guidance is now trusted as a real signal, not roaster copy.
- **Picolot (10)** — drift is in *valve vocabulary*, not strategy: April-brewer Balanced (Jan) → the SWORKS era where the house fast/fast/slow structure was learned, then inverted (slow/slow/open) for yeast-anaerobic lots, then extended to Suppression templates (Dial 6/6/6) and a contact-time-forward 5→5→7 for Mokkita Cold Room. The durable output is the *extraction-ceiling-determines-valve-structure* principle, plus the roaster-signature rule: evaluate every Picolot lot through the 55→45°C window.
- **Dongzhe (8)** — two distinct regimes, not drift: the **12.5g small-pouch vehicle** (V60 + CONE B3 + 6.5 + label-temp+1°C, 6 confirmations, Clarity-First locked) vs the 2026-06/07 **Syrina set**, where both variants needed Extraction Push at 5.6/96°C and still hit a roast-development ceiling. The lesson is per-green, not per-roaster: Dongzhe's low-development house style caps processed lots.
- **Sey (4)** — the sharpest single reversal: three textbook Clarity-First brews (Jan–Mar, 92°C) → the Ruarai SL28 requiring the most extreme push in the archive (100°C, grind floor 5.0, manual lever-staged immersion). Bean color is not a roast-level proxy on Sey; expect high-EY behavior from Brew 1.
- **Hydrangea (9)** — Clarity-First (washed/natural Gesha, Jan–Mar) → Balanced Intensity across the El Paraíso yeast/thermal-shock family (Apr), with the El Paraíso recipe spectrum (Lychee 6.4/94 · Luna between · Letty 6.3/95) as the per-lot dial. Drift here tracked *what was bought* (cleaner lots → engineered lots), a sourcing shift visible in the brew log.

The roadmap's hypothesized "started Balanced, drifted to Suppression" per-roaster pattern is **not** what the data shows — the real drifts are temperature (Moonwake), valve structure (Picolot), and strategy-era (Latent). Worth knowing before building any recipe-drift visualizer.

## 3. What reference roasts and repeat-buys share

Cross-source read: 13 roast_learnings × their optimized brews, plus the purchased lots bought repeatedly (Picolot comp editions, Hydrangea El Paraíso family, Dongzhe pouches, Moonwake standing rotation).

**Reference roasts (self-roasted side) share, with striking consistency:**
- **Narrow roast windows** — 11/13 lots say "Narrow" or "Narrow-to-moderate" outright. Nothing Latent has roasted has a wide window. Corollary: brewing tolerance, not window width, is the variable that differentiates lots (High: Surma, Mandela XO, SR Hybrid Washed · Low: Bukure, El Socorro, Gesha Clouds).
- **The Day-7+ real-pourover gate is load-bearing everywhere** — Day-4 cupping actively misled on Surma, Oma, SR Washed, Aurelio; the xBloom gate inverted rankings on Higuito, Bukure, Gesha Clouds. Every reference call that stuck was confirmed on a real pourover.
- **Bean-temp end condition beats dev-time / drop-clock** on every silent-or-ambiguous-FC lot (Mandela XO, SR Natural, Gesha Clouds, Bukure) — and the Mt Elgon one-shot's absolute-clock drop cap is the named counterexample that proved the rule.
- **WB→ground Agtron delta polarity** is the best single roast-quality predictor (Red Plum: negative delta = surface-blast, not brew-rescuable) — but the *magnitude* rule is lot-family-specific: tight delta wins on washed Colombians, wide-positive delta wins on Bukure-class East African naturals. The CCIL "tight delta = good" candidate in [observing.md](docs/skills/ccil/cluster/observing.md) should not be promoted as-is.
- **Their optimized brews increasingly land on Hybrid.** Of the 6 reference cups dialed since May, 5 are Hybrid (ICS or Temperature-Staged) and 1 is Suppression + late cut. The roast side deliberately develops fully; the brew side does the clarify work. This is the couple, measured.

**Repeat-buy purchased lots share:** an engineered-process signature (Garrido DRD/Cold Room, El Paraíso thermal shock, Janson yeast-anaerobic, Altieri NASD) + a cool-peak cooling arc + a roaster whose intent is legible enough to follow (Picolot's precision-over-volume comp roasts, Moonwake's trustworthy brew guidance). That matches the sourcing philosophy's process-signature gate almost exactly — the buying behavior already implements the canon.

## 4. Cooling / temperature-arc behavior

The whole-arc frame is the corpus's most consistent discipline. Classifying the 101 brews with arc prose (approximate — prose-classified, not structured data):

- **~80% peak cool or warm-to-cool (≤50–55°C).** The cool peak is the *default*, not a pattern to keep re-discovering. The three cooling modes (integration / transformation / damage-control) from [cross-coffee-insights.md § 5](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md) hold across the full corpus with no counterexamples.
- **~15 peak warm (~51–60°C)**, and the warm-peakers are not random: (a) **structurally-light/underdeveloped washed roasts** (Rancho Tio Emilio, Mt Elgon — the 2-lot warm-peak hypothesis holds corpus-wide with no third member yet), (b) **Aroma Capture brews** (modifier shifts peak warmer, by design), (c) a few **very-light clean lots** (Helm El Burro peaks ~54°C with a jam note — logged as counter to the raised-bed Panama Gesha cool-peak prior).
- **~6 peak hot/early** — almost all *washed Panama/Colombia Gesha with early aromatics* (Magma, Finca Faith, GV-Oma) from the Jan era. Genuinely hot-peaking coffees exist but are rare and variety-specific.
- **The reversal diagnostic is corpus-confirmed:** "prefers hot over cool" on a coffee with cool-peak precedent = extraction overshoot (Luna Bermúdez, Newbery washed). No false positives in the corpus.

Substrate note for the roadmap's cooling-behavior tracking idea: the data is *rich but unstructured* — 100 prose `temperature_evolution` fields vs 17 structured `cooling_curve_target`s. Any tracking surface needs the whole-arc tasting-capture brainstorm (roadmap § Brainstorms) resolved first; the prose cannot be queried per-station today. That brainstorm, not a new viz, is the gating move.

## 5. Time-window view — what the last ~60-90 days taught vs the archive

**The archive (Jan–Apr) taught coffee-level rules:** cooling discipline, agitation sensitivity, temperature primacy on anaerobic naturals, the yeast-inoculated → Balanced Intensity default, vehicle integration (April vs fast cones), the Dongzhe small-pouch vehicle. Mostly *which single mode and where in it*.

**The recent window (May–Jul, ~24 brews) taught system-level mechanics** — a different kind of learning:
1. The Hybrid trigger vocabulary + the ICS → Temperature-Staged escalation ladder (§1).
2. **Light-roast vs dark-roast ICS open-phase asymmetry:** on dark/developed roasts the open phase is a *rinse* and the tail gets cut tight (Untold ×2, Newbery, Bukure); on light roasts the tail carries balancing depth — do NOT cut (Snite El Mango's rejected cut, Glitch 74165, Mt Elgon). One architecture, opposite tail handling, keyed to roast level.
3. **Roast-ceiling literacy:** the recent window repeatedly *stopped iterating* on time — recognizing roast-development ceilings (FanHua/YinXue, Newbery late-fraction, Mt Elgon back-half) instead of chasing them with extraction. Earlier eras would have kept dialing.
4. **Cupping-muted as an intake override** (Terraform Clara Luz) and **roast-level-leads-strategy** (Untold ×2) — both brief-time signals that would have saved 2-3 brews each in the archive era.
5. **Water as a live lever** (§6) — entirely a recent-window development.
6. EG-1 mechanics: the 6.0–6.3 D50 compression plateau (grind moves inside it are no-ops; cross below 6.0 for a real reach change).

Implication for /brew sessions: the archive's coffee-level rules are well-encoded in the Historian capsules already; what the recent window's system-level mechanics need is *brief-time* surfacing (trigger vocabulary, escalation ladder, tail asymmetry), which is exactly what the capsules' Coffee Brief Read Order now carries. No gap found requiring new substrate beyond this digest.

## 6. Water lens — what the archive already implies for the water research

27 brews mention water somewhere in their fields; 14 carry a structured `water_recipe`, all since 2026-05-22 — water went from unrecorded to a first-class recipe field in six weeks. What the archive supports, ranked by evidence weight:

1. **Mineral load × roast level is the confirmed interaction.** Office tap (Palo Alto municipal) fills out an already-heavy body on roast-forward lots — pushed the Newbery Khun Lao from manageable to "punishing oversteeped black tea"; moving to Third Wave Water Light resolved it *before* any strategy change. Conversely, on light/very-light roasts office tap is repeatedly confirmed *fine* (FanHua, YinXue, El Oasis, Zarza — all explicitly noted). The archive's rule: **water strength matters in proportion to roast development**; on the apex register (light, WB ~71-83) tap is tolerable and low-mineral is insurance, on developed roasts it is load-bearing.
2. **Zero/low mineral as suppression:** Newbery's published recipe used ZeroWater TDS 000 — identified in-session as non-replicable suppression work. Low-mineral water is a suppression lever on the same axis as temperature, confirming the v8.5 WBC water-strength flag with a lived case.
3. **Apax drops as a mid-palate/body lever orthogonal to grind and temp** — the newest and most apex-relevant lead. Three brews: Red Plum (Tonik+Jamm held mid-palate sweetness the converged recipe left compressed — explicitly "not a brewing lever"), Glitch 74165 (distilled + Jamm under a Temperature-Staged split), Helm El Burro (distilled + Jamm under Extraction Push). In all three, water carried a register (mid-palate body/sweetness) that the exhausted brewing-parameter space could not. This is reveal-not-inject in water form: the phase is in the bean; the mineral gates whether it lands.
4. **Confound to design around:** the Jamm brews never isolated the water variable (always co-moved with strategy). The archive implies the *first controlled experiment*: one converged recipe (Red Plum or 74165), water as the only variable, plain-TWW vs +Jamm A/B.
5. **Home/office split is a water split in disguise.** Office = tap + SWORKS valve templates; home = TWW/distilled + the full vehicle kit. Several "office recipe vs home recipe" deltas in the archive (e.g. Lovely Vuelta's office Dial-5 restriction) bundle a water delta that has never been unbundled.

Handoff note for the water-research review session: the archive gives water research a **measured starting map** — mineral-load × roast-level (confirmed), anion-drops × mid-palate (three-brew lead, unisolated), zero-TDS suppression (one external case) — and one designed experiment ready to run. It does not yet contain a single controlled water A/B; that is the gap the research project closes. Mechanism substrate: [water.md](docs/skills/brewing-equipment-expert/cluster/water.md).

## 7. Ranked against the apex

[CONTEXT-taste.md](CONTEXT-taste.md): the target is **layered-evolving**, clarity as carrier, reveal-not-inject; honest baseline — no Latent roast→brew had reached the PicoLot bar as of 2026-06-14.

- **The corpus's center of gravity is already apex-shaped.** The whole-arc evaluation frame is applied in 100/102 brews; the dominant learning mode is "which structure reveals what the bean carries" — the anti-pattern (injecting via over-extraction, chasing absent registers) appears mainly as *named, rejected failure modes*.
- **Explicit apex sightings in the archive:** Ilde Burbano El Pilón (06-17, "exactly the layered-evolving behavior we want from an apex-selected lot", one-brew landing), Snite El Mango ("opens into new layers as it cools — layered-evolving"), Gesha Clouds Forest (holds producer notes across the full arc — the first Latent roast whose optimized brew was judged to hold at real pourover). The recent window produces these sightings at a visibly higher rate than the archive era.
- **Highest-leverage insights ranked against the apex:** (1) the Hybrid structural toolkit — it is *the* mechanism by which develop-fully roasts become layered-evolving cups, and it matured this quarter; (2) water's mid-palate lever — the named #1 frontier, now with archive evidence; (3) roast-ceiling literacy — knowing when the arc is capped at the roast protects iteration budget for lots that can reach the apex; (4) cool-peak discipline — necessary but now fully internalized, no longer where the gains are.
- **What the corpus cannot yet measure:** layered-evolving itself. There is no structured per-station capture, so "did the cup evolve?" lives only in prose. The whole-arc tasting-capture brainstorm is the apex's measurement gap, and this digest's evidence (100 prose arcs, 17 structured targets) quantifies it.

## Sections attempted and dropped

- **Cross-dimensional query examples** (roadmap's "all Clarity-First Gesha from the Central Andean Cordillera"): computable but produced no insight beyond what the by-cultivar capsules already hold — dropped rather than pad.
- **Per-producer drift:** below n≥4 for every producer except those already covered via roaster/lot reads — data can't support it.
- **EY/TDS quantification:** the corpus contains zero refractometer readings; extraction claims are sensory throughout. Any future quantitative extraction lens needs new capture, not a re-read.

## Follow-up seeds (not commitments)

1. **Water A/B experiment** (§6.4) — the digest's most concrete next move; feeds RP6 directly.
2. **Whole-arc tasting-capture brainstorm** is the gating move for both the cooling-tracking and layered-evolving-scoring roadmap ideas (§4, §7) — this digest supplies its evidence base.
3. **Observing-list candidates with new corpus N** (for the next arbiter pass, not edited here): temperature-primacy on traditional naturals (SR Natural + FanHua reach-direction + 74165 = the 2-3 confirmations its promotion trigger asks for); the "tight delta = good" pattern's Bukure-class counterevidence (§3).
