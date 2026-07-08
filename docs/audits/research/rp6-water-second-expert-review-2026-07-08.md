# RP6 Water Research - Second-Expert Review + Water Taxonomy Pre-Draft

**Date:** 2026-07-08. **Session shape:** report-only (Handoff 2 brief) - findings + recommendations + a NOT-CANONICAL taxonomy pre-draft. **Nothing in this doc changes substrate**; every fix is a recommendation for Chris to accept or reject. Chris is actively working this substrate - do not race his edits.

**Reviewed substrate** (abbreviations used in citations):
- **W** = [water.md](docs/skills/brewing-equipment-expert/cluster/water.md) (knowledge doc, Phase A)
- **WI** = [water-inventory.md](docs/skills/brewing-equipment-expert/cluster/water-inventory.md) (physical inventory, PRs #543-545)
- **T1** = [water-concentrate-postbrew-screen.md](docs/research-projects/water-concentrate-postbrew-screen.md) (Track 1 archive)
- **T2** = [water-single-mineral-isolation.md](docs/research-projects/water-single-mineral-isolation.md) (Track 2 archive)
- **RR** = [research roadmap § Now / RP6](docs/skills/research-coordinator/cluster/roadmap.md)
- **OG** = [operational-guide.md § Step 2](docs/skills/brewing-assistant/cluster/operational-guide.md) (the /brew wiring, PR #541)
- **PR** = [docs/product/roadmap.md § Future Directions](docs/product/roadmap.md) (the canonical-promotion trigger, line 162)
- **WBC** = [wbc-2026-water-handoff.md](docs/research-projects/wbc-2026-water-handoff.md)

---

## § 0 - Verdict (TLDR)

1. **The chemistry is solid.** Every mineral factor in WI §§ 2-4 and every starter recipe in W § 4 was independently re-derived from molar masses in this review - all check out, including a subtle detail the doc gets *right* (the § 3 dosing keys are computed on the true 1-g-in-101-g concentration, ~9,901 ppm, while the "10,000 ppm" label is nominal). WI § 4 was re-verified against the accessible source sheet (the "Coffee Water Equipment" Google spreadsheet's Water Concentrates table) - every composition, drop key, and dose rate matches.
2. **The experimental honesty is good at the archive layer and mostly good downstream, with three specific overclaims** (findings R1-R3). The archives are unusually self-aware (brew faults retracted, mis-doses logged, confounds flagged), and W stamps its values PROVISIONAL prominently. But essentially **every headline result rests on n=1 cups**, the peak-cup margin (MgCl₂ 3.1 vs blend 3.0) is inside the dataset's own observed repeat spread (MgCl₂ itself scored 3.1 then 3.0 across sittings, T2:696), and the distilled control the built waters "beat" is documented as drifting flatter within each sitting (T2:482, 519).
3. **The /brew home-suggestion wiring matches the research's shape** (home-only, offer-not-mandate, provisional stamping) **with two content-level gaps**: it routes *floral* coffees to MgCl₂ despite florality being the explicitly held RP6-vs-WBC-field divergence (R6), and it omits the research's own "must beat distilled" bar (R7).
4. **One safety-adjacent item worth acting on before anything else:** the salt behind both the peak-cup finding and the standing /brew home suggestion - MgCl₂ - is the one salt in the kit flagged **reagent grade, NOT food grade, "confirm suitability for drinking"** (WI:29, WI:38). See R5.
5. **Distance to the canonical-promotion trigger: not close.** The trigger (PR:162) needs the research to "complete and produce enough data to define canonical entries." Today: Phase 2b (2nd-coffee values verification) has not started (coffee in hand, awaiting dial-in), the recipe library has exactly 1 provisional row, and the phase vocabulary is still moving. Realistic minimum before promotion: Phase 2b complete + project close/retro + ≥3 verified recipe-library rows (§ 4 below proposes making that trigger numeric).

---

## § 1 - Chemistry verification (all pass)

Re-derived independently in this review from standard molar masses; not trusted from the docs.

| Claim | Source | Check |
|---|---|---|
| § 2 dry-salt 1 g/L factors (all 9 rows: Mg/Ca/K/Na cation mg/L, anion mg/L, GH/alkalinity as CaCO₃) | WI:28-36 | **PASS.** e.g. MgSO₄·7H₂O (246.47 g/mol): 98.6 mg/L Mg, 389.7 sulfate, 405.7 GH vs doc's ~99/390/~406. CaCl₂·2H₂O (147.01): 272.6/482.3/680 vs 273/482/680. KHCO₃ (100.115): 390.5 K / 609.5 HCO₃ / 499.4 alkalinity vs 391/610/499. |
| § 3 per-1-g-stock dosing keys (all 6 stocks) | WI:46-51 | **PASS, exactly.** The keys assume 1 g salt + 100 g water = 9,901 ppm true concentration (e.g. NaHCO₃: 9.901 mg salt/g stock → 2.710 Na / 7.191 HCO₃ / 5.893 KH vs doc's 2.71/7.19/5.89). The "10,000 ppm" label is nominal (~1% high); the dosing math is not fooled by it. |
| § 3 worked example (GH 44 from MgCl₂ stock = 44/4.87 ≈ 9 g/L) | WI:42 | **PASS** (9.03). |
| W § 4 starter recipes (GH 44 = 0.44 mmol/L × hydrate MW; KH 20 = 0.4 mmol/L HCO₃) | W:78-84 | **PASS** all six: 108.4 / 89.5 / 75.8 / 64.7 mg/L salts; 33.6 NaHCO₃ / 40.0 KHCO₃. |
| APAX drop keys (0.065 g/drop @ 30,000 ppm → ~2 ppm/L/drop; 45 drops ≈ 3 g ≈ 90 ppm/L) | WI:57 | **PASS** (1.95 ppm/drop; 45 × 0.065 = 2.93 g) and matches the source sheet's booklet table verbatim. |
| GH arithmetic note ("the anion carries no GH") | W:31 | **PASS** - correct, and it is the load-bearing fact that makes the anion-isolation design clean. |

**Minor notes (not errors):**
- **WI § 2 NaHCO₃ row mixes units** - its "~2.71 mg/L Na + 7.19 bicarbonate" is the *per-gram-of-stock* key, not the per-1-g/L-dry factor every other § 2 row uses (dry NaHCO₃ at 1 g/L gives ~274 Na / ~726 HCO₃). The row does say "(see § 3 stock)" (WI:36), so it's flagged, but it's the one row where a reader porting the § 2 column into a build would be off by ~100×. Recommendation R9.
- **SBL's "GH 44 / KH 20" is a vendor claim, not independently derivable** - the disclosed recipe (WI:68) computes to KH 20.1 (PASS) but GH ~40 with hydrated salts or ~55 anhydrous; hydration forms are undisclosed. Consistent with T2's HT5 measuring the bottle "~1 drop low" (T2:701). No action; just don't treat GH 44 as exact.
- **DAK "~10 ppm/L per drop (both bottles together)"** (WI:57) - the source sheet says 10 drops *each* ≈ 99 ppm, i.e. ~10 ppm per drop-*pair* (~5 ppm per individual drop). The WI parenthetical carries the right meaning but the phrasing is ambiguous. Recommendation R9.

## § 2 - The "verified against all four source TSVs" claim (partially reproducible)

Per the gate-currency rule, this review re-ran the verification rather than trusting it:

- **WI § 4 (concentrates): RE-VERIFIED.** The "Coffee Water Equipment" Google spreadsheet (Drive, modified 2026-07-07) contains the Water Concentrates table; every WI § 4 composition, form, size, drop key, and dose rate matches it - TWW (MgSO₄ + calcium citrate + NaCl, ~1.5 g/stick, ~150 ppm/gal), DAK two-part A/B split, KONFLUX/NÉMO/TONIK/JAMM/LYLAC ingredient lists, SBL disclosed recipe verbatim, Sooper 12-12.5 g/L.
- **WI §§ 2-3 and § 5 (minerals, stocks, gear): source sheets NOT locatable from this session.** The "Water Minerals" / "Water Mineral Concentrates" TSVs are not in Drive under those titles, not in the Dropbox paths, and not in the repo or the PR #544-545 commits (doc-only diffs). The verification presumably ran against TSVs pasted into the PR #544-545 session. **Compensating check:** this review independently re-derived all §§ 2-3 numbers from molar masses (§ 1 above) - which is a *stronger* verification of the math than TSV-matching, but cannot confirm the physical facts (grades, sizes, purchase dates, two-bottles-of-MgCl₂). Those rest on the PR #544-545 session's claim. Recommendation R10: link the source TSVs (or their Drive URLs) from WI's update log so the claim is re-runnable.

## § 3 - Experimental-design rigor review

### What the archives do well (credit where due)

- **Faults are retracted, not buried.** Sitting-2's "KH brightens" surprise was flagged as a brew-fault confound the same day (T2:586) and retired on a clean matched-temp re-brew (T2:694). The Sitting-1 SBL mis-dose (F10) was formally withdrawn ("That conclusion is WRONG," T2:312) and re-run correctly in Sitting 3.
- **Builds were measured, and misses are logged with causes** - five documented off-target builds (MgSO₄ KH ~1 drop high, SBL recon GH 60 vs 40, blend GH ~65, settled-gypsum under-target, bottled-SBL precipitation loss now *measured*) (T2:228-229, 507, 546, 701).
- **The methodology crown is real:** HT3's pre-vs-post divergence (post-brew screen got coarse ranking but inverted the mechanism - MgSO₄ muddy→body, CaCl₂ bright→lactic) is a genuine, well-documented finding (T2:533, 613), and Track 1 had *pre-declared* the post-brew screen as "a screening tool, not final proof" (T1:79) before the divergence was observed.
- **Blinding leaks are self-reported** - Lane C heat-signature identity leak (T1:308), tap-cup temperature mismatch (T1:272), control-from-memory in the Sitting-1 SBL bonus (T2:314).

### The structural weaknesses (what a second expert must say out loud)

1. **n=1 per condition, everywhere.** Every scored cell in both tracks is a single cup; Lane B cups are additionally separate full brews, exposing them to brew-to-brew variance the archive itself flags (T2:590, L-c #8 at T2:638). The only deliberate repeat in the entire project is the HT4 re-brew plus one accidental cross-sitting repeat of MgCl₂/KH0.
2. **The headline margin is inside the observed repeat spread.** MgCl₂ "peak" beat the best blend 3.1 vs 3.0 (T2:616), and MgCl₂ itself scored 3.1 then 3.0 across sittings (T2:696) - the doc calls that stability "validating the dataset's repeatability," but it equally means the peak-vs-blend gap is indistinguishable from repeat noise. The ranking's own "≈" signs concede this (T2:616: "3.0 ≈ 3.0... 2.5 ≈ 2.5"). The *robust* Track 2 result is the big-gap structure: chloride-on-Mg ≫ chloride-on-Ca (3.1 vs 1.5) and everything-beats-nothing-much; the 0.1-margin "solo beats blend" call is soft.
3. **The distilled control drifts flatter within a sitting** ("tasted noticeably FLATTER after the mineral cups," T2:482; "feels flatter each round," T2:519), which mechanically inflates late-sitting "beats distilled" margins. MgCl₂'s "beats distilled: YES" (T2:483) is real but was read against a shared drifting control in an A/B-vs-control design, never as a dedicated MgCl₂-vs-distilled pairing.
4. **Semi-blind is thin for a single operator.** "Operator codes/shuffles cups, un-blinds at recording" (T2:143) - the same person designs, builds, brews, codes, and scores; the identity *set* is always known, and the archive shows at least one mid-taste identity inference (recognizing "A is the anomaly" because A was the known prior peak, T2:587-588). The naive-palate-as-asset argument (T2:338) is a fair mitigation for *directional* priors but not for cup-level expectation effects.
5. **The 1-5 scale has no rubric and no variance estimate** beyond control-pinned-at-2 and the single n=2 cross-check. Per-axis directional scoring (the WBC fold, T2:460) was the right fix for the *structure* question; the overall numbers remain soft.
6. **The florality axis - the field's highest-value claim - is untestable on this coffee** ("the Pink Bourbon is not a heavily floral coffee... the WBC 'MgSO₄ = florality' claim may need a genuinely floral coffee to adjudicate," T2:489). Correctly held as a divergence - but see R6 for where downstream wiring quietly un-holds it.
7. **Track 1's Lane C ("distilled > TWW > spring > tap") is 4 cups, one sitting, with a partial identity leak and a temperature-mismatched tap cup** (T1:309, 314, 308, 272). It is bounded honestly in the archive; treat it as a screening read, not a law.

**Net:** the *interaction structure* (anion sets a phase, cation gates it; pre-brew ≠ post-brew) is corroborated from multiple directions (big margins, WBC field convergence, HT3's clean inversion) and deserves its "confirmed pre-brew" status as structure-on-this-coffee. The *specific values and micro-rankings* are one-cup, one-coffee reads - which W's provisional stamps mostly say, except where the findings below note otherwise.

## § 4 - Findings (inconsistencies + overclaims), each with a recommendation

**R1 - "All 5 HTs resolved" overstates two of them.** HT1 was *reframed*, not answered (T2:729 - the original "does sulfate reveal more than chloride?" was superseded); HT4 resolved with a "small margin... not a cliff" after one confounded sitting (T2:694, 732); HT5's recon-vs-bottled pair was deliberately NOT GH-matched (T2:701), partially confounding build-method with strength. RR:43/57 and W:8 carry "all 5 HTs resolved" as a clean sweep. *Recommendation:* soften to "all 5 HTs adjudicated (HT1 reframed; HT4 small-margin; HT5 strength-confounded by design)" wherever the phrase appears.

**R2 - W's preamble claims more coffee-independence than its own § 2 supports.** W:8 says "the framework is validated - the anion→phase mechanism (§ 2)... coffee-independent and confirmed pre-brew," and W § 6 calls the mechanism "a physical constant" (W:115). But § 2's own WBC cross-reference concedes "the *role-labels are coffee-dependent*" (W:51) - the field assigns sulfate=florality / CaCl₂=body and RP6 got the reverse. What is actually corroborated coffee-independently is the *shape* (the anion axis matters as much as the cation; it's an interaction). Which phase each anion delivers is exactly the held divergence. *Recommendation:* in W:8 and W:115, downgrade "coffee-independent mechanism / physical constant" to "the interaction structure is corroborated across RP6 + the 2026 WBC field; the phase→anion role assignments are coffee-dependent until the 2nd-coffee replication."

**R3 - W § 5's "Most builds don't [beat distilled]" is contradicted by Track 2's own Lane B.** In the extraction-valid pre-brew arm, 5 of 7 built waters beat the distilled control (MgCl₂ 3.1, MgSO₄ 3.0, both Mg blends 3.0/2.5, CaSO₄ 2.5 vs control 2.0 - T2:616); only CaCl₂ and the SBL variants lost. The "distilled beat every built + natural water" result is Track 1 Lane C (TWW/spring/tap - no single-salt builds in that flight) plus the 5-salt SBL. *Recommendation:* reword W § 5 bullet 1 to "distilled beat every *commercial/finished* water tested (TWW, spring, tap, both SBL forms); clean single-salt Mg builds are the only waters that have beaten it - the bar stands, and CaCl₂/full-blend builds have failed it."

**R4 - The research roadmap's future-track anchor cites a superseded result.** RR:71 anchors the next test on "the two-chloride best cup ≈ Delgado's formula minus his sulfate+silica" - but T2:533/561 explicitly undercut the Sitting-1 two-chloride pointer (it rested on CaCl₂'s post-brew artifact; in-blend the CaCl₂ contribution reads as an *injected* back-sweetness, T2:563). The current best cup is straight MgCl₂. *Recommendation:* update RR:71 to anchor on "the MgCl₂ base + a touch of sulfate + silica" (which is also closer to Delgado's actual formula logic).

**R5 - Safety/priority: the headline salt is the one non-food-grade reagent in the kit.** WI:29 flags MgCl₂ as "98%+ reagent (NOT food-grade)... confirm suitability for drinking" (repeated WI:38), and MgCl₂-forward is now both the § 6 recipe seed and the standing /brew home suggestion for clarity coffees. The stocks Chris doses from were made from this reagent (WI:47). *Recommendation:* buy food-grade MgCl₂ (or verify the current lot's CoA for drinking use) before the /brew suggestion becomes routine; until then, note the caveat in the OG home branch or prefer the MgSO₄/CaSO₄ rows for repeated daily use.

**R6 - The /brew wiring routes "floral" to MgCl₂, quietly resolving the held divergence in RP6's favor.** OG:109 ("clarity / floral → MgCl₂-forward") and W § 3's chloride row ("acidity / attack / clarity / florality") fold florality into chloride - but florality is precisely the axis RP6 could not test (T2:489) and the axis on which the field says *sulfate* (WBC:17, W:51 "held, not resolve[d]"). A genuinely floral coffee (Gesha!) suggested MgCl₂-forward by this rule is betting against the field on the exact contested axis - and Phase 2b's coffee is a Gesha Natural. *Recommendation:* in OG:109 and W § 3, split the trigger: "clarity/citrus → MgCl₂-forward (RP6-verified on this profile); floral → contested axis (RP6 says chloride, the 2026 field says sulfate) - flag it as the open experiment rather than defaulting either way." This is also exactly what Phase 2b can adjudicate.

**R7 - The /brew wiring omits the research's own success bar.** W § 5's first guardrail is "a built water must clear a real bar: beat distilled" - but the OG Step 2 home branch (OG:107-110) never mentions it, so a suggested build has no verification loop. *Recommendation:* add one line to the home branch: when Chris accepts a built-water suggestion for a deliberate dial-in, offer the distilled (or standing-comp) control cup as the Brew-1 A/B - it's the cheapest possible rigor carry-over from RP6 into daily brewing, and it feeds honest rows to the § 6 library fold-back.

**R8 - W § 3's "not in the kit" rows are stale against the inventory.** The silica row says "Not in the RP6 kit yet" and the potassium row "Not in the kit" (W:63-64), but WI § 2 shows Eidon Liquid Silica (bought Jun 29) and KCl 8 oz (Jun 29) in hand (WI:33, 35), and RR:71 says "KCl IN HAND... Eidon silica IN HAND." W predates the arrivals (adopted 2026-07-04; WI reconciled 2026-07-05). *Recommendation:* update the two W § 3 caveat cells to "in hand, not yet tested (future track)" - the hypothesis stamp stays, the availability changes.

**R9 - Two small WI wording fixes** (from § 1 above): (a) make § 2's NaHCO₃ row carry the per-1-g/L dry factors like its neighbors (~274 mg/L Na + ~726 HCO₃ + ~595 alkalinity), keeping the § 3 pointer; (b) reword the DAK dosing key to "~10 ppm/L per drop-pair (one drop from each bottle)."

**R10 - Make the four-TSV verification re-runnable.** Add the Drive URLs (or export the four TSVs into the repo/Drive under their cited names) to WI's update log. Today only the Water Concentrates table is locatable; §§ 2-3/5 verification can't be reproduced by a future session.

**R11 - Naming drift in the promotion trigger.** PR:162 promises a "`brews.water` text canonical," but the column that exists (migration 071) is `brews.water_recipe` - free-text by design, with the migration comment already anticipating lazy promotion. *Recommendation:* when the Future Directions entry is next touched, rename its column reference to `water_recipe` so the promotion sprint doesn't spec a phantom column (the migration-069 lesson).

**R12 - (observation, no action needed) The Step 2 home branch doesn't cite the inventory directly.** OG:109 consults W §§ 3+6 but not WI; coverage is indirect via W's preamble pointer ("check it before building or suggesting a recipe," W:13). Since /brew fetches W anyway, this works today; if suggestions ever start naming unstocked salts (KCl/NaCl stocks are explicitly "Not yet stocked," WI:53), add the WI check to OG:109 explicitly.

## § 5 - Does the /brew home-only suggestion match what the research supports?

**Shape: yes.** Home-only (office has no adjustments - OG:110, operational-reference Location Constraints), offer-not-mandate with the crushable comp as default (OG:109), values stamped provisional with the structure/values split stated (OG:109), structured taxonomy vocabulary for the `water_recipe` field (base + GH + KH + cation/anion). All of that is exactly what a single-coffee-verified substrate supports.

**Content: two gaps** - the florality routing (R6) and the missing beat-distilled loop (R7). One latent risk: the "body-wanting → provisionally sulfate-forward" branch is a *prediction* (correctly labeled), and Phase 2b's Gesha Natural is the designed test of it - suggestions issued on that branch before Phase 2b lands should stay clearly experiment-framed.

## § 6 - Distance to the canonical-promotion trigger

The trigger (PR:162): promotion of water to the 11th canonical axis (`lib/water-registry.ts` + `docs/taxonomies/water.md` + `brews.water_recipe` canonical + the "Water Design" Step 1d gate) fires "when the water research project completes and produces enough data to define canonical entries." RP6's own completion shape (RR:65-74):

| Gate | Status 2026-07-08 |
|---|---|
| Phases 1-2 (both tracks) | CLOSED |
| Codification Phase A + B | SHIPPED 2026-07-04 |
| **Phase 2b - 2nd-coffee VALUES verification** | **NOT STARTED** - Hydrangea Gesha Natural in hand, resting, awaiting operator dial-in; then ~15-20 brews (RR:70) |
| Project close + retro | Not run (per process-retro, close only after retro; RP6 is still § Now) |
| Recipe library depth | **1 provisional row** (W § 6) |
| Future tracks (K-finish, silica, stage-split, NaCl) | Queued, explicitly *not* on the critical path (RR:71) |

**Assessment:** the promotion trigger is at minimum **Phase 2b + project close away** - call it one full research track plus a retro. And "enough data to define canonical entries" is currently undefined; 1 provisional row is clearly not it. *Recommendation (R13):* make the trigger numeric now, borrowing the parked recipe-variant precedent (promote at 5+ distinct values across 3+ beans): **promote the water canonical when the § 6 recipe library holds ≥3 verified (re-tasted, not ported) per-coffee rows spanning both phase directions** (at least one chloride-forward and one sulfate-forward), so the registry is born with real entries instead of one coffee's row plus placeholders. That is achievable via Phase 2b + the queued recipe-library fold-back (RR:73) without any extra research track.

---

## § 7 - Water taxonomy pre-draft

> **STATUS: DRAFT ONLY - NOT CANONICAL. NOT for docs/taxonomies/ or lib/ yet.** Promotion is gated per CONTEXT-taste.md decision 15 + PR:162 (see § 6). This section exists so the promotion sprint is a paste-in, not a cold start. Everything below is shaped from the RP6 substrate as it stands and must be re-checked against Phase 2b's outcome before adoption.

### 7.1 - Axis shape

Water is unlike the other 10 axes: an entry is a *recipe/profile* (a composition), not a name from a closed world. The registry should therefore mirror the **brewers/filters equipment-cluster pattern** (typed entries with behavior fields, soft alias lookup) rather than the strict terroir-macro pattern. Two-level structure:

- **Level 1 - water_type (closed enum, the canonical axis):** `distilled` · `built-single-salt` · `built-multi-salt` · `commercial-concentrate` · `finished-water` · `tap/source`. This is the aggregation level (the analog of macro/cultivar): stable, small, complete today.
- **Level 2 - named water entries (open registry, lazy-grown):** individual recipes/products, promoted from `brews.water_recipe` free-text the way producers were canonicalized from text-equality.

### 7.2 - Entry schema (`WaterEntry`, draft)

```ts
interface WaterEntry {
  name: string;                 // canonical display name, e.g. "MgCl2 Bright Peak GH44"
  waterType: WaterType;         // the Level-1 enum
  base: 'distilled' | 'RO' | 'spring' | 'tap';
  targetGH: number | null;      // ppm as CaCO3; null = as-source (tap)
  targetKH: number | null;
  cations: { mg?: number; ca?: number; na?: number; k?: number };   // mg/L
  anions:  { sulfate?: number; chloride?: number; bicarbonate?: number; silica?: number };
  bufferSource: 'NaHCO3' | 'KHCO3' | 'none' | 'unknown';
  build: string;                // human recipe: salts mg/L or stock mL/L or product dose key
  phaseDirection: string[];     // controlled vocab: 'attack' | 'body' | 'finish' | 'texture' | 'buffer'
  status: 'verified' | 'provisional' | 'hypothesis';
  verifiedCoffees: string[];    // the coffees the values were re-tasted on (empty = provisional)
  notes?: string;               // cation-gating caveats, safety flags, precipitation discipline
  aliases: string[];
}
```

Design choices worth locking early: (a) the **anion split is first-class** (the RP6 finding - GH alone under-determines the water); (b) `phaseDirection` reuses W § 2's phase vocabulary rather than inventing sensory adjectives; (c) `status`/`verifiedCoffees` carry the coffee-dependence gate into the registry itself, so a provisional entry can exist without lying; (d) hydration-form lives in `build` prose (load-bearing for the math per W:85, but not a query axis).

### 7.3 - Candidate seed entries (from the inventory + W § 4/§ 6, all restatements of existing substrate)

| Name (draft) | Type | Key values | Status at draft time |
|---|---|---|---|
| Distilled | distilled | GH 0 / KH 0 | verified (the Track-1 Lane C bar) |
| MgCl2 Bright Peak GH44 | built-single-salt | GH 44 / KH 0 · Mg+Cl · attack | provisional (Pink Bourbon only; **reagent-grade caveat R5**) |
| MgSO4 Body GH44 | built-single-salt | GH 44 / KH 0 · Mg+SO4 · body | provisional |
| CaSO4 Savory GH44 | built-single-salt | GH 44 · Ca+SO4 · body(+umami note) | provisional |
| MgCl2+MgSO4 Blend GH44 | built-multi-salt | attack+body pairing | provisional |
| TWW Classic Light ~1/3 (house comp) | finished-water | ~50 ppm effective | verified-as-daily-default |
| SBL Juicy & Sweet (stock build) | built-multi-salt | GH ~44 / KH 20 disclosed | provisional (lost to distilled on clarity coffee) |
| DAK Hydro Drops / TONIK / JAMM / LYLAC / KONFLUX / NÉMO / Sooper | commercial-concentrate | per WI § 4 dose keys | hypothesis/product (Track-1 post-brew reads only) |
| Palo Alto office tap | tap/source | unknown; no adjustments | verified-as-constraint (roast-forward amplification note) |

Deliberately NOT entries: the six § 3 stocks (they are *ingredients*, not waters - they belong in the inventory, not the registry); per-coffee recipe-library rows (those live in W § 6 / the future library and *reference* a WaterEntry, the same way brews reference a brewer).

### 7.4 - Alias considerations

Existing free-text in `brews.water_recipe` that the alias map must catch: "Third Wave Water Light Roast ~1:3 concentrate:distilled" (and "TWW 1/3", "house TWW"), "office tap" / "Palo Alto office tap", "home remineralized", bare product names ("Jamm", "Lylac"), and build shorthand ("MgCl2 GH44", "straight MgCl2"). Two standing lessons apply: the **canonical-prefix attractor** (a new "MgCl2..." canonical will attract every MgCl2-blend free-text - add defensive aliases for the blends when adding the solo entry) and **find-or-create lookups filter every column of the unique constraint** (name alone is not unique once GH variants exist - key on name, not composition).

### 7.5 - What the Step 1d "Water Design" gate needs (draft contract)

A peer gate to brewer/filter/temp in the Coffee Brief, firing AFTER strategy confirmation (water direction depends on the confirmed strategy, per the OG home branch):

1. **Location check** - office → record source, no design (the existing branch, unchanged).
2. **Phase target** - derive desired phase (attack/body/finish/texture) from the coffee's character + confirmed strategy; on the contested floral axis, surface BOTH candidate directions until the divergence resolves (R6).
3. **Registry pick** - match a `WaterEntry` (recipe-library row first, then chart-derived entry); stamp its `status` into the suggestion verbatim.
4. **Stock check** - confirm ingredients against water-inventory.md (R12).
5. **Offer-not-mandate + control** - comp stays the default; on an accepted build, offer the distilled/comp control cup as Brew-1 A/B (R7) and record the result so the library row's `verifiedCoffees` can grow.
6. **Write** - structured `water_recipe` string in taxonomy vocabulary (base + GH + KH + cation/anion + entry name), same field as today; canonicalization happens lazily at promotion, zero schema change needed (migration 071's design intent).

Pre-promotion dependency list for the sprint that ships this: `lib/water-registry.ts` mirror + `docs/taxonomies/water.md` authored source + alias map + OG Step 1d insertion + W § 6 library re-pointing at entries + the six-actor audit (MCP Resource description for water.md already exists; `read_canonical(axis: "water")` wiring; prompts vocabulary check).

---

*Review conducted 2026-07-08 on branch `claude/water-research-expert-review-735196`. Method: all §§ 1-2 chemistry re-derived independently; archive claims extracted with line citations by two read-only subagent passes over T1/T2 and spot-checked directly (T2:483-486, 533, 561-564, 616, 694-696, 712, 745); WI § 4 re-verified against the Drive source sheet; no substrate edited.*
