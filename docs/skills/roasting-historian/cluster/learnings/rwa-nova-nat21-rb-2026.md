# Bukure Natural Lot 21 (Red Bourbon, Rwanda Northern Province) - closed-lot learnings

*Coffee Research · Latent · Roasting Historian cluster · learnings*

**Lot:** RWA-NOVA-NAT21-RB-2026  
**Status:** Closed (2026-06-06)  
**Cultivar:** Red Bourbon  
**Terroir:** Rwanda / Northern Province / Virunga foothills / Nova Washing Station (Agnes Mukamushinja & Felix Hitayezu)  
**Process:** Natural  
**Reference roast:** Batch 194 (V2 v2b) · 238°C peak inlet · FC 05:27 / 203.1°C (1 crack, subtle) · dev 18s / 5.2% · drop 203.1°C / 05:45 (end_condition_type=manual, drop-attribution provisional) · WB Agtron 79.6 / ground 73.5 / delta +6.1  
**Optimized brew:** Hybrid (Intensity-Clarity Split) on April Switch · 15g · 1:16 poured / late cut at 185g in cup (~1:12.3 effective) · EG-1 6.7 · 91°C steady · TWW Light · closed-valve bloom 45g/40s · Phase 1 closed immersion to 150g/steep to 1:30 · Phase 2 open percolation to 240g/close valve at 185g

## Substrate pointers

- **roast_learnings row:** `c264e7b9-6258-479e-b383-e5f4cccd3425` (UPSERT on green_bean_id 9f7e586d-0d1e-47fd-bbe0-d3792b5a1c0e). All structured carry-forward fields populated; rest_behavior NULL.  
- **Experiments:**  
  - V1: `058d1175-6735-4d0c-a61a-f2b4baf493e5` (peak inlet 240/244/248°C; winner V1B Batch 177; key insight: "darker than what it says" across all 3 slots → V2 downward energy shift)  
  - V2: `727187bb-7608-44b6-99a9-d1ffa1584bdf` (peak inlet 234/238/242°C; winner V2B Batch 194; key insight at Medium-High confidence: 18s dev IS the lever, NOT a structural flaw, only resolvable at non-dark brew)  
- **Roasts:**  
  - V1: Batch 176 (`5adaf2a3-…`), Batch 177 (`beb21a54-…`, V1 winner), Batch 178 (`e0e6e9de-…`, ceiling breach 209°C)  
  - V2: Batch 193 (`f4ef106f-…`, sub-FC), Batch 194 (`f8718428-…`, **reference roast** is_reference=true), Batch 195 (`8e52e500-…`, SPG declined)  
- **Cuppings:**  
  - V1 xbloom (Day 7, 2026-05-11): `f0adae36-…` (176), `71b8ca6b-…` (177, V1 winner), `6fd5f852-…` (178, disliked)  
  - V2 xbloom (Day 7, 2026-05-30): `fa398902-…` (193), `29420db2-…` (194), `da8754c5-…` (195)  
  - V2 SPG (2026-06-04, Balanced Intensity gate that resolved the V2 winner): `a3946b27-…` (194, SPG winner), `d8f814c8-…` (195, SPG declined)  
- **Brews:**  
  - Optimized brew (`c6b699ae-d6db-4f34-8ebb-c69727572d12`) - dialed 2026-06-06; April Switch Hybrid Intensity-Clarity Split; honeycomb on cooling  
- **Active-lot doc:** [`active-lots/rwa-nova-nat21-rb-2026.md`](docs/skills/roasting-historian/cluster/active-lots/rwa-nova-nat21-rb-2026.md) - soft-retired; H2 sections preserved as historical record + cross-ref anchors

## Why Batch 194 won as the lot reference

Batch 194 sits at the lot's structurally narrowest sweet spot: the FC floor (238°C peak inlet just barely reaches FC at 05:27 / 203.1°C, 1 crack subtle) paired with the project's shortest dev (18s / 5.2%). At log-roast time this looked like a structural flaw - "the bean barely cracked before the drop... cup may read green/grassy/hollow." The opposite resolved at the SPG: under Balanced Intensity / clarity-preserving extraction, the 18s dev IS the cup-winning lever. Black tea + honey + caramel + prominent sweetness, balanced not body-heavy, held pleasant through tasting with no cool-collapse; only flaw a slight roast-heads tail at the finish (brew-side fixable via output selection). At the optimized brew dial-in (Hybrid Intensity-Clarity Split on April Switch), the cup reaches black tea + honey + caramel + cranberry up front + **honeycomb on cooling** - 4/5 producer notes (lingonberry still absent).

Critically, the structurally-complete 195 (v2c, 41s dev, WB 74) lost cleanly under the same SPG brew - smoke + bitter + body-centric + sweetness gone - confirming that on this lot the longer dev surfaces as overdevelopment once the brew stops amplifying dark-tea. The minimal dev IS the lever, not a structural flaw to correct.

## Cross-lot framing - the load-bearing findings

### xbloom-misranks-dark-tea-prone-naturals (2-lot working hypothesis, Medium confidence)

The xbloom Brian Quan gate (1:17.5 / 94°C) amplifies dark-tea overhang on naturals with a dark-tea-prone character, masking the lighter-dev side and inverting the leading-slot ranking. Two confirmed instances:  
- Costa Rica Higuito V1 SPG (COS-HIG-BOR-2026)  
- Bukure V2 SPG (this lot)

Both lots' xbloom-gate rankings didn't match real-pourover rankings under Balanced Intensity. **Protocol implication on East African / natural lots:** the Simulated Pourover Gate step is load-bearing, not optional - confirm reference-roast selection under a non-dark extraction BEFORE locking. Promotion path: third dark-tea-prone natural showing same xbloom-inversion → Confirmed Pattern.

### WB→Gnd-delta-widest-wins (within-lot N=3 cleanly-developed, single-lot pattern)

Within Bukure: v1b +6.6 (V1 winner), v2b +6.1 (V2 SPG winner), v2c +3.1 (V2 SPG declined). The CCIL "tight delta \= good cup" pattern fails consistently on this lot. **Implication:** don't optimize for tight delta on East African Red Bourbon natural at high altitude. Holding for similar-cultivar cross-lot validation before CCIL promotion - next test is Bukure Anaerobic Lot 10 (RWA-NOVA-AN10-RB-2026) from the same producer/station.

### FC-threshold ≠ drinkability-threshold (reframe - Single-lot Medium confidence)

v2a (Batch 193, 234°C peak) never reached FC (bean topped 199.9°C, 0 cracks at 6:00 profile terminus) but cupped as flat-with-brightness, NOT catastrophically green/grassy as predicted from sub-FC structural underdev. **The cup floor sits BELOW the FC floor on this lot.** Useful counter for future low-energy probes on similar lots: don't assume sub-FC \= unusable cup. Underdevelopment on this cultivar/process manifests as structural FLATNESS (missing acidity/body/finish staging), not off-flavor.

### Dev-time-as-cup-winning-lever (and the SPG inversion of structural-completeness)

At log-roast time, structural inference said: v2b's 18s dev is too short, needs more dev (toward 25-35s). SPG inverted this. Roast-side "what to change" inferences from structure alone misled here - the cup-side resolution requires a non-dark brew gate. **Carry:** on cultivar/process combinations with brewing-tolerance risk, don't trust roast-structure-only inferences for forward direction; the SPG is non-optional, not just a sanity check.

### Two-stage Hybrid brew architecture for dark-tea-prone naturals (discovered at optimized-brew dial-in)

Balanced Intensity / clarity-preserving alone resolves the SPG question (lights up sweet/caramel/black tea register, removes the xbloom cool-collapse) but does NOT reach the deep producer-note register - honeycomb stayed absent across all Balanced Intensity brews on this lot. **Hybrid Intensity-Clarity Split on a valve brewer** (April Switch: closed-immersion Phase 1 for intensity, fast open-percolation Phase 2 + tight late cut for clarity) surfaces honeycomb on cooling for the first time across the project. The two-opposing-goals shape (reach buried sweetness AND drain dark-tea overhang) maps to the Hybrid strategy's structural advantage: phase boundaries where the brewer changes mode, rather than a single-mode logic running throughout. **The tighter late-cut clamp (185g vs first-pass 195g) was the decisive lever** - discard glass confirmed the dark-tea/roasty fraction concentrates in the tail. Cut tighter, not later.

### Dark-tea-is-inherent-not-defect (reframe at resolution)

The dark-tea characteristic on Red Bourbon Rwandan natural is INHERENT to the cultivar/origin pairing - producer's first listed note across this lot, the Higuito sibling, and likely the broader cultivar/origin pairing per the cultivar synthesis prose (2-lot aggregation). It's not a defect to extract AWAY from. Output selection strips the roasty / over-extracted OVERHANG on top of the legitimate black-tea body; it doesn't (and shouldn't) eliminate black tea. **Brew progression should preserve black-tea body, not eliminate it.**

## Related closed-lot pointers

- [**COS-HIG-BOR-2026** (Costa Rica Higuito Bourbon Anaerobic, sibling)](docs/skills/roasting-historian/cluster/learnings/cos-hig-bor-2026.md) - first dark-tea-prone natural to demonstrate xbloom-misranks pattern; together with Bukure forms the 2-lot working hypothesis.  
- [**CGLE-SRUME-NATURAL-2026** (Sudan Rume Natural V1-V5, anchor)](docs/skills/roasting-historian/cluster/learnings/cgle-srume-natural-2026.md) - anchor calibration for naturals at CGLE farm; the SR Natural V3 winner direction (244°C peak / EG-1 6.4 / April Glass 89°C) was Bukure V1's starting framework; V2 shifted downward to 238°C after V1's "darker than what it says" feedback. Useful contrast: SR Natural's reference roast at 242°C peak / 205°C drop / inaudible-FC management; Bukure's reference at 238°C peak / 203°C drop / subtle-audibility FC. Different cultivars/origins, different process intensities, similar bean_temp-end-condition management protocol.

## Open questions / hypotheses for next lot

1. **How much of the 18s-dev-is-the-lever finding is terroir-driven vs cultivar-driven?** Would need a same-terroir-different-cultivar OR same-cultivar-different-terroir lot to disambiguate. Bukure Anaerobic Lot 10 (RWA-NOVA-AN10-RB-2026, same producer/station/cultivar, different process) is the obvious cross-process control.  
2. **Does the Hybrid two-stage architecture finding generalize beyond this specific cultivar/origin?** Higuito's optimized brew (when dialed) would be the obvious next test - same dark-tea-prone profile, different cultivar + terroir.  
3. **Is lingonberry ever recoverable on this lot?** Honeycomb surfaced at Hybrid + cool; lingonberry never surfaced across any brew angle tested. Either the producer note is aspirational on the spec sheet OR the brew angle to surface it wasn't explored. Worth testing on the next bag of beans (~300g remaining? or already consumed).  
4. **Drop-attribution on Batch 194 is still PROVISIONAL** - recorded end_condition_type="manual" with target nulled, but actual drop fired 4°C under the 207°C bean_temp trigger. Operator early-pull vs auto machine-drop? Affects replication strategy on the next similar lot (timed pull at 05:45 vs bean_temp end-condition ~203-204°C).

## Cluster-doc updates promoted from this lot's close-out

- `cross-coffee-insights.md § Varietal Aromatic Fingerprints` - Red Bourbon Rwanda natural entry (proposal `82ee8a6e-…`)  
- `cross-coffee-insights.md § FC Floor & Ceiling by Processing Method` - Red Bourbon Rwanda natural data point + FC-threshold-vs-drinkability-threshold reframe (proposal `aa922b44-…`)  
- `cross-coffee-insights.md § Working Hypotheses / Confirmed Patterns` - xbloom-misranks-dark-tea-prone-naturals promotion to Medium confidence (proposal `ad56c531-…`, queued from log-cupping V2 SPG resolution)  
