**COFFEE BREWING MASTER REFERENCE**

*Coffee Research · Latent*

Brew Prompt · Roaster Reference · Archive Patterns · Grind Reference

Last updated: April 2026

Version 7.0 · Updated from v6.0 · Promoted Coffee with Dongze from ASSESS PER COFFEE to CLARITY-FIRST — confirmed across 4 brews at 12.5g/200g on V60 Glass + Sibarist B3; label 92°C under-extracts at 12.5g bed depth and must be corrected upward (93–94°C by process) · Added Hacienda La Esmeralda El Velo climate-controlled (“NC”) naturals to Archive Patterns Clarity-First section — Valle 3NC confirmed at 6.5/93.5°C, sits between washed and standard natural in extraction need · Refined By Variety — Gesha (Panamanian) entry to distinguish climate-controlled naturals from standard naturals · Added Process/Variety Signal Table note: Esmeralda “NC” climate-controlled naturals are Clarity-First, not Balanced · Added sensory evaluation principle: variety-intrinsic light body at high elevation (Panama Gesha ≥1,900m) is not a grind signal — check aromatic integration and cooling behavior before adjusting grind · April 2026

Version 7.1 · Updated from v7.0 · **Archive recipe format restructured for Latent Coffee app sync.** The single "Coffee" row has been split into 7 discrete fields (Roaster / Coffee Name / Lot Code / Producer / Roast Date / Roast Machine / Roaster Tasting Notes) so each field can be validated independently against the canonical registries. Added **Terroir** (Country / Macro Terroir / Meso Terroir) and **Cultivar** as explicit rows — the Latent app's sync enforces canonical terroir and cultivar names, and these fields are required for the resolved brew to archive without manual backfill. Reason: drift prevention requires per-field canonical enforcement, which the blob format made impossible. No changes elsewhere in the doc. · April 2026

# SECTION 1 — BREW PROMPT

*Coffee Research · Latent*

## How to Use This Document

This is your master brewing reference. Paste it into a new Claude chat each time you start a new coffee, or store it as a project doc so it loads automatically. Then at the top of your message, add:

- The coffee product URL

- Dose: 15g or 18g

- Brewing location: Home or Office

- Reference experience (optional): any tasting notes from a café or elsewhere for this specific coffee

- Roaster brew guide URL (optional): paste if you have it

Claude will work through the Coffee Brief, confirm the extraction strategy with you, and output a full recipe. Do not skip the strategy confirmation step — this is intentional.

## Location Constraints

## Office (Downtown Palo Alto)

| **Field**                     | **Details**                                                                                                                                                                                                                                                                                                                                                                               |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Brewers**                   | April Brewer Glass, Kalita Wave Tsubame 155, SWORKS Bottomless Dripper. (XBLOOM available but manual preferred.)                                                                                                                                                                                                                                                                          |
| **Filters**                   | Espro Bloom Flat only (compatible with both Kalita Wave 155 and Bottomless Dripper).                                                                                                                                                                                                                                                                                                      |
| **Water**                     | Tap water — Downtown Palo Alto municipal supply. Do not assume soft or mineralized water. No water adjustments available.                                                                                                                                                                                                                                                                 |
| **April Brewer**              | Drains consistently fast (~2:30) regardless of grind or agitation — not suitable for Full Expression. Reserve for Clarity-First office brews only.                                                                                                                                                                                                                                        |
| **Kalita Wave 155**           | Reliable 3:00–3:30 drawdown with Espro Bloom. Pour structure and rest timing are the primary extraction levers. NOTE: runs faster than expected even at finer grind — use Bottomless Dripper when precise flow control is needed.                                                                                                                                                         |
| **SWORKS Bottomless Dripper** | Variable-flow valve dripper. Cone geometry, uses 155 flat or wave filters (Espro Bloom Flat at office). Valve dial restricts or opens flow mid-brew — each pour phase can have an independent valve state (Restricted / Half-Open / Open). Primary office brewer for Balanced Intensity and Full Expression when contact time management is critical. See Valve Position Reference below. |

## Home

| **Field**     | **Details**                                                                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Equipment** | Full equipment inventory as listed in the Equipment Reference below.                                                                                            |
| **Water**     | Distilled + remineralized with Third Wave Water packs (Light Roast packet diluted ~1:3 concentrate-to-distilled, topped up with pure distilled to brew volume). |

## Step 1 — Coffee Brief (Claude runs this automatically)

Before selecting any equipment or parameters, Claude must complete a Coffee Brief by reasoning through the following in order:

**1a. Web search for roaster brew guide**

Search for a brew guide from this roaster for this coffee. If found, note the key parameters (ratio, grind direction, temperature, agitation level). Do not follow it blindly — use it as a signal about the roaster's extraction intent for this coffee. If not found, note that and proceed.

**1b. Process and variety risk flags**

Evaluate the coffee's process and variety against the Process / Variety Signal table in this document. Explicitly state whether any flags apply. This determines whether the default Clarity-First strategy is appropriate or whether a different extraction strategy should be considered from the start.

**1c. Brief summary**

In 3–5 sentences: what is this coffee, what does the terroir and cultivar suggest about likely expression, what does the process tell you about extraction behavior, and what does the roaster's positioning (if known) suggest about intent?

**1d. Proposed extraction strategy + modifiers**

Based on the above, propose one of the **five extraction strategies** below (Axis 1) and explain why. Then propose any **modifiers** (Axis 2) if the coffee warrants them — most coffees do not. Pause and ask for confirmation before proceeding to the recipe.

**Axis 1 — Extraction Strategy** (5 canonical, intent-distinct):

| **Strategy**                | **Grind Range**    | **Typical Agitation**                                                | **Ratio Tendency** | **Best For**                                                                                                                                                                                                                                                                             |
|-----------------------------|--------------------|----------------------------------------------------------------------|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Suppression**             | 6.8–6.5            | Low — Melodrip, gentle spiral                                        | 1:16–1:17          | Heavy co-ferments, anaerobic naturals where fermentation harshness would surface if extracted normally. Same coarse-low-temp-low-agitation mechanics as Clarity-First, opposite intent: hold an over-expressive coffee back, not protect a delicate one. Temperature is the primary lever. Confirmed pattern: anaerobic naturals (Hydrangea Finca Inmaculada). |
| **Clarity-First (default)** | 6.8–6.5            | Low — Melodrip, gentle spiral                                        | 1:16–1:17          | Washed Gesha, Ethiopian landraces, delicate light roasts. Default when the coffee's expressive ceiling is moderate and the goal is preserving aromatic and structural transparency.                                                                                                       |
| **Balanced Intensity**      | 6.5–6.3            | Moderate — controlled spiral, some bed exposure                      | 1:15–1:16          | Honey lots, natural washed hybrids, denser high-elevation coffees. Sits between Clarity-First's gentleness and Full Expression's force.                                                                                                                                                   |
| **Full Expression**         | 6.3–5.5 (or finer) | **Higher** — active spiral, multiple pours, boiling or near-boiling temp | 1:13–1:17          | Heavy anaerobic, experimental fermentation, very expressive lots, and high-EY roasters (Sey, Flower Child, Picky Chemist, Dak) where the coffee won't open up without force. Note: on the EG-1, grind below 5.5 changes distribution shape but not D50 — temperature, agitation, filter choice, and brew time are the primary levers. |
| **Extraction Push**         | 6.3–5.5 (or finer) | **Low — Melodrip** (clarity-preserving)                              | 1:15–1:17          | Push yield on a *clean* coffee (washed Gesha, washed Ethiopian, transparent processed lots) without losing transparency. Mechanically Full Expression's fine grind + high temp, but Melodrip controls turbulence so clarity survives. Reference WBC recipes: Wölfl, Tran, Giachgia.        |

**Mechanics-vs-intent symmetry:** Suppression and Clarity-First share mechanics, differ in intent. Full Expression and Extraction Push share fine-grind + high-temp mechanics, differ in agitation (and therefore in the coffee class they serve). Pick the strategy by intent at strategy-selection time, not by mechanics.

**Axis 2 — Modifiers** (optional, stackable, layered on any strategy). Most brews have none — only propose when the notes or coffee profile clearly warrant them:

| **Modifier**                       | **Sub-data**                                              | **When to use**                                                                                                                                                                                  |
|------------------------------------|-----------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Output Selection**               | form (early_cut / late_cut / both), brew_weight, cup_yield | Discard portions of the extraction curve to reshape the cup. Heavy co-ferments where the bitter tail is geographically concentrated in the late fraction; processed lots where the early fraction reads salty/sharp. Carlos Escobar 2025: keep middle band only.  |
| **Inverted Temperature Staging**   | phases (e.g. "86°C → 92°C")                               | Start low, end high — opposite of natural decline. Low-temp opens up sweetness/aromatics without phenolics; raising temp on a partially-extracted bed builds structure. Ryan Wibawa 2024.        |
| **Aroma Capture**                  | application (e.g. "Paragon ball on bloom + Pour 1")       | Mid-brew cooling of the early extract fraction to preserve aromatics. Highly aromatic coffees (washed Geshas, Esmeralda climate-controlled naturals). Giacomo Vannelli, Wataru Iidaka.           |
| **Immersion**                      | application (e.g. "SWORKS valve-modulated staging — restricted main pours, opened late to drain"; "Hario Switch staged: closed bloom + open pour") | Modulate flow restriction across phases to engage immersion behavior on a percolation system, or run a true immersion brewer with staged dumps. SWORKS Bottomless valve modulation, Hario Switch staged immersion, Ryan Wibawa multi-stage immersion, Garam Victor Um sequential hybrid.            |

Grind range 6.8–6.5 is the default. Going below 6.3 is intentional and must be justified by the extraction strategy — it is not a tweak, it is a different philosophy. For the highest-EY roasters, going below 5.5 may be required — but see Grinder Notes.

## Step 2 — Recipe Output (after strategy is confirmed)

Once the extraction strategy is confirmed, select the brewer and filter based on the brewing location, then output a full recipe using the format below.

## Output Format

| **Field**             | **Value**                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------|
| **Coffee**            |                                                                                                      |
| **Brewer**            | \[brewer + valve position note if Bottomless Dripper\]                                               |
| **Filter**            |                                                                                                      |
| **Dose**              |                                                                                                      |
| **Water**             |                                                                                                      |
| **Grind**             |                                                                                                      |
| **Temp**              |                                                                                                      |
| **Bloom**             | \[weight\], \[pour time\], wait \[time\]                                                             |
| **Pour Structure**    | \[list each pour with weight, duration, wait, and — for Bottomless Dripper — valve state per phase\] |
| **Target Total Time** |                                                                                                      |

After the recipe table, provide two short sections:

- Why this brewer and filter combination was selected (2–3 sentences referencing the confirmed extraction strategy and brewing location constraints)

- What to watch for in the first brew — specific risk flags given this coffee's profile

- If Bottomless Dripper is selected: include a Valve Strategy note explaining the rationale for valve state at each pour phase, and what to adjust if the cup reads bitter (open earlier) or flat/sour (stay restricted longer).

## Step 3 — Iteration Loop

After each brew, provide tasting notes covering aroma, attack, mid-palate, body, and finish. Note how it changes as it cools.

Claude will respond with adjusted parameters. At each iteration, Claude must also assess:

- Are we making incremental progress, or does something feel structurally wrong (consistently sour, flat, hollow, or one-dimensional despite multiple tweaks)?

- If 2–3 iterations in and the cup still feels off structurally, Claude should flag this explicitly and ask whether to pivot extraction strategy rather than continue tweaking parameters within the current one.

- If the confirmed extraction strategy seems mismatched to what you are tasting, Claude should recommend a strategy shift and explain what that would change about the approach.

- For Bottomless Dripper brews: valve position is always adjusted before grind. Thin or sharp → close valve more (more restriction), do not go finer. Muddy or flat → open valve earlier (less restriction), do not go coarser; also check if closed bloom exceeded ~25s. Bitter → shorten contact time by opening sooner in the final pour. Only adjust grind after valve position has been optimized.

The goal of iteration is not parameter optimization within a fixed approach. It is finding the right neighborhood first, then dialing within it.

## Step 4 — Resolved Brew Output Format

Once a recipe is confirmed as the reference brew for a coffee (iteration complete, extraction strategy validated, cup meets roaster tasting notes), output the resolved brew in the format below. This is the archive-ready format — the Latent Coffee app's Claude-authored sync reads this block directly and validates each field against the canonical registries (roasters, producers, terroirs, cultivars, processes, extraction strategies). Drift is caught at sync time, not after, so field-level precision matters.

**Required fields (single table):**

*Coffee identity (7 fields — do not smash into one):*

- Roaster — canonical roaster name (e.g. Picolot, Hydrangea, Moonwake Coffee Roasters). If Section 2 has a card for this roaster, use exactly that name. If this is a new roaster, propose the form and note it — the sync will flag it for a canonical-registry entry.

- Coffee Name — the roaster's name for the coffee (e.g. Emerald, El Velo Natural, Blooms Coffee, Peach Oolong). Do not include producer, lot code, or variety in this field.

- Lot Code — if the coffee has one (e.g. PL#015, 74158, CF10). Omit if none.

- Producer — "Person, Farm" convention (e.g. "Gissell & Lily Garrido, Emerald Farm", "Pepe Jijón, Finca Soledad", "Diego Bermúdez, Finca El Paraíso"). Person name first, comma, farm name. If farm is absent or unknown, just the person. If only the farm is known, just the farm.

- Roast Date — YYYY-MM-DD.

- Roast Machine — if disclosed (e.g. S7X, Loring S15, Probat P12). Omit if unknown.

- Roaster Tasting Notes — the descriptors the roaster published for this lot (e.g. "bright green grape, honeydew candy, passionfruit, hint of rosemary, crisp body"). This is the roaster's intent — Chris's own tasting notes go in Aroma / Attack / Mid-Palate / Body / Finish below.

*Origin (required for sync — the Latent app enforces canonical terroir and cultivar names):*

- Terroir — Country / Macro Terroir / Meso Terroir (e.g. "Panama / Chiriquí Highlands / Boquete", "Colombia / Central Andean Cordillera / Huila", "Ethiopia / Ethiopian Southern Highlands / Sidama"). If unsure of the exact macro or meso name, write your best guess — the sync step will flag drift and suggest the canonical match.

- Cultivar — canonical variety name (e.g. Mokka, Mokkita, Gesha, Typica Mejorado, Pink Bourbon, 74158, Sidra, Catuai, Laurina). Distinguish sibling varieties precisely (Mokka ≠ Mokkita, Gesha ≠ Sidra, Pink Bourbon ≠ Rosado). If the lot is a blend of varieties, list each one comma-separated.

*Recipe:*

- Brewer — include valve structure note if SWORKS Bottomless

- Filter

- Dose

- Water — weight, ratio, and water type (home remineralized / office tap)

- Grind — EG-1 setting

- Extraction Strategy — Clarity-First / Balanced Intensity / Full Expression

- Temp — include kettle management (on base / off base / declining)

- Bloom — weight, technique, duration; include valve state for SWORKS

- Pour Structure — each pour with cumulative weight, duration, technique (center / spiral / melodrip), valve state if SWORKS

- Total Time

*Tasting:*

- Aroma — sensory observation

- Attack

- Mid-Palate

- Body

- Finish

- Temperature Evolution — how the cup changes as it cools

- Peak Expression — hot / warm / cool / specific temperature

*Learnings:*

- What I Learned from This Coffee — specific, testable bullet points covering: levers tested and which ones mattered, extraction ceiling or floor observed, cooling behavior, reference-point determination (is this the reference recipe for a coffee type?), any strategy drift from the initial hypothesis

- Extraction Strategy Confirmed — closing line stating which strategy the brew validated

## End-of-coffee document review:

After producing the resolved brew, assess whether the learnings should propagate back to the master reference. Candidate sections to update: Roaster Reference (new roaster data or strategy tag refinement), Archive Patterns (add coffee to appropriate Balanced / Full / Unclear section), By Variety (new variety data point), By Process (process row exception or confirmation), Office Brewing Notes (equipment-specific principle), Open Questions (resolve or add question). Propose specific edits rather than generic “should update” observations.

## Process / Variety Signal Table

*Used in Step 1b. Flags that should trigger a non-default extraction strategy.*

| **Process / Variety Signal**                                | **Default Risk**                                        | **Recommended Start**                                                 | **Watch For**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|-------------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Washed Gesha / Ethiopian landrace                           | Fine — Clarity-First is correct                         | Clarity-First                                                         | Turbulence flattening acidity; don't over-agitate                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Honey (light / white)                                       | Fine — slight extraction bump helpful                   | Clarity-First → Balanced                                              | Sweetness can read thin at coarser grind                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Natural (controlled / DRD)                                  | Mild risk                                               | Balanced Intensity                                                    | Vinous/wine character needs support, not suppression. Exception: Hacienda La Esmeralda “NC” climate-controlled naturals are clean enough to stay Clarity-First — do not apply Balanced default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Anaerobic natural                                           | Moderate risk — Clarity-First will likely under-extract | Balanced Intensity                                                    | Bitter finish is temperature-driven, not grind-driven — drop temp before coarsening. Evaluate cool; cup integrates significantly below 50°C.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Anaerobic washed (clean / lighter fermentation)             | Moderate risk                                           | Balanced Intensity                                                    | Phenolic sharpness if pushed too hard; sour if too coarse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Anaerobic washed (heavy / Colombian Huila / Cauca)          | High risk — Clarity-First will under-extract            | Full Expression                                                       | Confirmed pattern: Colombian anaerobic washed Geshas from Huila/Cauca reliably need Full Expression.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Anoxic natural (sealed container fermentation)              | High risk — Clarity-First will under-extract            | Full Expression                                                       | Process overrides variety signal — do not apply Pink Bourbon/Rosado variety ceiling logic to anoxic natural lots. Temperature taper resolves bitter tail.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Heavy anaerobic / co-ferment                                | High risk                                               | Full Expression                                                       | Confirm roaster brew guide; these coffees want heat + agitation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Experimental fermentation (thermal shock, yeast-inoculated) | High risk                                               | Balanced Intensity — confirm with roaster guide before escalating     | Yeast-inoculated lots confirmed Balanced Intensity across four subtypes: anaerobic natural (Moonwake Peach Oolong), thermal shock washed (Hydrangea El Paraíso), white honey (Moonwake Sebastian Ramirez El Placer Gesha, Quindío), and yeast-inoculated natural with washed finish (Hydrangea Gesha Horizon Don Eduardo, Panama). Do not assume Full Expression. Let flavor targets and roaster guide drive. When variety is transparency-driven (Sydra, Typica Mejorado, Gesha) and flavor targets are bright/citric/floral, variety signal reinforces Balanced Intensity — it does not push toward Full Expression. Temperature is the primary extraction lever for yeast-inoculated lots; grind is secondary. Note: for yeast-inoculated naturals with washed finish, start at the finer end of the Balanced Intensity grind range (6.4, not 6.5) — the washed finish moderates fermentation density and requires additional grind support to express fruit fully. |
| Dense high-elevation cultivar (Pacamara, Mokka, Mokkita)    | Mild risk                                               | Balanced Intensity                                                    | Large bean needs slightly more energy to extract evenly                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| High-EY roaster (Sey, Flower Child, Picky Chemist, Dak)     | High risk — EG-1 cannot reach their target D50          | Full Expression + 5.5 grind + boiling water + T-92 filter + slow draw | These roasters target ~450 µm D50 on different burr geometry. On EG-1, compensate via temp, agitation, filter, and brew time rather than grind. Start at 5.5.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

## Equipment Reference

**Brewer System**

| **Brewer**                    | **Geometry**           | **Flow**                    | **Cup Tendency**                          | **Notes**                                                                                                                                                                                                                |
|-------------------------------|------------------------|-----------------------------|-------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **UFO Ceramic**               | Cone                   | Very Fast                   | Extreme clarity, high aromatic separation | Delicate high-aroma coffees. Home only. ★ Rotate more deliberately — has been over-relied on.                                                                                                                            |
| **Orea Glass**                | Flat                   | Fast                        | Bright fruit clarity, clean finish        | Washed African coffees, expressive light roasts. Home only.                                                                                                                                                              |
| **Orea Porcelain**            | Flat                   | Fast-Medium                 | Slightly sweeter and rounder than glass   | Fruit-forward coffees needing balance. Home only.                                                                                                                                                                        |
| **Hario V60 Glass**           | Cone                   | Medium-Fast                 | Classic clarity, balanced extraction      | Baseline dialing brewer. Home only.                                                                                                                                                                                      |
| **April Brewer Glass**        | Flat                   | Medium                      | High sweetness, rounded acidity           | Home + Office. OFFICE: drains ~2:30 regardless of grind — not suitable for Full Expression. Use Kalita 155 or Bottomless Dripper instead.                                                                                |
| **Kalita Wave 155**           | Wave Flat              | Medium-Slow                 | Fuller body, strong sweetness             | Home + Office. OFFICE DEFAULT for Full Expression/Balanced Intensity: 3:00–3:30 with Espro Bloom. NOTE: runs faster than expected even at finer grinds.                                                                  |
| **SWORKS Bottomless Dripper** | Cone (variable)        | Variable — valve-controlled | Flexible depending on valve state         | Home + Office. Primary variable-flow brewer. Valve dial adjusts flow restriction per pour phase. Key advantage: solves fast-drain problem by restricting flow independently of grind size. See Valve Position Reference. |
| **Hario Switch Glass**        | Cone Hybrid            | Variable                    | Round sweetness, controlled extraction    | Difficult coffees, extraction experiments. Home only.                                                                                                                                                                    |
| **Weber Bird**                | Immersion              | Restricted                  | Dense sweetness, uniform extraction       | Controlled extraction studies. Home only.                                                                                                                                                                                |
| **XBLOOM**                    | Automated Flat         | Programmable                | Highly repeatable                         | Testing repeatable recipes. Home + Office (manual preferred at office).                                                                                                                                                  |
| **Oxo Rapid Brewer**          | Pressure + Percolation | Fast                        | Very concentrated                         | Travel, co-ferments, experimental coffees. Home only.                                                                                                                                                                    |

## Valve Position Reference — SWORKS Bottomless Dripper

| **Valve State**            | **Flow Behavior**                      | **Use When**                                   | **Notes**                                                                                                                                                                                                                                                                                      |
|----------------------------|----------------------------------------|------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Fully Closed (Dial: 0)** | Zero flow — true immersion             | Bloom phase only (~20 seconds)                 | Pour to target weight, close fully, saturate 20s, then crack to Restricted. Do NOT hold beyond ~25s — cup starts reading muddy. Dial positions 0–1 both behave as fully closed with real coffee bed.                                                                                           |
| **Restricted (Dial: 5)**   | Very slow controlled drip              | Early main pours (Pour 1 and sometimes Pour 2) | Core extraction lever — most of your brew time happens here. Artificially slows drawdown without finer grind. CALIBRATED: Dial 5 = ~60 sec/100g with Espro Bloom + real coffee bed at EG-1 6.0. Dial positions 1–4 are dead zones with real coffee bed resistance — do not use for extraction. |
| **Half-Open (Dial: 6)**    | Moderate — controlled percolation      | Later pours, transitioning to faster drain     | Starting position for Clarity-First where full restriction would over-extract. CALIBRATED: Dial 6 = ~45 sec/100g with Espro Bloom + real coffee bed at EG-1 6.0.                                                                                                                               |
| **Open (Dial: 7)**         | Fast — bottomless baseline (very fast) | Final flush or end extraction cleanly          | Open is faster than most open brewers. Open is NOT a ‘normal’ setting — it is a fast setting. CALIBRATED: Dial 7 = ~30 sec/100g with Espro Bloom + real coffee bed at EG-1 6.0. Full turn past 7 (back to 0) = ~20 sec/100g maximum flow.                                                      |

Adjustment logic (valve-first): Thin or sharp → close valve more. Muddy or flat → open valve earlier (also check if closed bloom ran \>25s). Bitter → shorten contact time by opening sooner in the final pour. Adjust grind only after valve position is optimized.

## Filter System

| **Filter**              | **Type**    | **Flow**    | **Behavior**                    | **Cup Impact / Notes**                                                                                                                                                                    |
|-------------------------|-------------|-------------|---------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Sibarist UFO Fast Cone  | Cone        | Very Fast   | Extreme fines reduction         | Extremely clean cups. Home only (UFO Ceramic).                                                                                                                                            |
| Sibarist FAST Cone (01) | Cone        | Very Fast   | Very low fines retention        | High clarity, bright acidity. Home only.                                                                                                                                                  |
| Sibarist B3 Cone        | Cone        | Medium-Fast | Balanced extraction             | Clarity with slightly more body. Home only.                                                                                                                                               |
| Cafec Abaca+            | Cone        | Medium-Slow | Holds fines slightly more       | Sweeter cups, more body. Home only.                                                                                                                                                       |
| Cafec T-90              | Cone        | Medium-Slow | More extraction energy          | Fuller cups. Home only.                                                                                                                                                                   |
| Cafec T-92 Light Roast  | Cone        | Slow        | High fines retention            | Heavy extraction, tannin risk if pushed. Pair with boiling water for Full Expression. Home only.                                                                                          |
| Cafec T-83              | Cone        | Very Slow   | Maximum extraction              | High body, highest tannin risk. Home only.                                                                                                                                                |
| Sibarist FAST Flat      | Flat Bottom | Very Fast   | Extremely permeable             | Very high clarity. Home only.                                                                                                                                                             |
| Sibarist B3 Flat        | Flat Bottom | Medium-Fast | Balanced flat-bottom extraction | Sweet + clear. Home only.                                                                                                                                                                 |
| **Espro Bloom Flat**    | Flat Bottom | Medium      | Thicker paper, moderate flow    | ★ Home + Office. ONLY filter option at office (compatible with Kalita 155 and SWORKS). NOTE: runs faster than spec suggests — on Bottomless Dripper, use valve restriction to compensate. |
| Sibarist B3 Wave        | Wave        | Medium-Fast | Stable bed geometry             | Sweet and clean. Home only.                                                                                                                                                               |
| April Brewer Paper      | Wave        | Medium-Slow | Thick and controlled            | Sweet and round cups. Home only.                                                                                                                                                          |
| Hario V60 Standard      | Cone        | Medium      | Balanced baseline               | Classic V60 extraction. Home only.                                                                                                                                                        |

**Additional Tools**

| **Tool**              | **Purpose**                    | **Effect**                                                                           |
|-----------------------|--------------------------------|--------------------------------------------------------------------------------------|
| Melodrip              | Reduces agitation during pours | Cleaner extraction, less fines movement — use for Clarity-First strategy. Home only. |
| Paragon chilling ball | Rapid cooling of extraction    | Preserves aromatics, boosts perceived sweetness — use at end of brew. Home only.     |

**Practical Brewer Rotation Framework**

*Rotate by cup structure goal. Do not default to the same brewer repeatedly. Note: office brewers are limited to April, Kalita Wave 155, and SWORKS Bottomless Dripper.*

| **Desired Cup**                | **Home Brewers**            | **Office Brewers**                                    | **Notes**                                                   |
|--------------------------------|-----------------------------|-------------------------------------------------------|-------------------------------------------------------------|
| Maximum clarity                | UFO, Orea Glass             | — not available                                       | Home only for this profile                                  |
| Balanced fruit sweetness       | April, Kalita               | Kalita 155, Bottomless Dripper (Half-Open)            | Bottomless Dripper gives more control at office.            |
| Full Expression / contact time | Switch (hybrid), Weber Bird | Bottomless Dripper (Restricted→Half-Open), Kalita 155 | Bottomless Dripper preferred office Full Expression brewer. |
| Maximum intensity              | Oxo Soup Shot               | — not available                                       | Home only                                                   |

**Grinder: Weber EG-1**

Large flat burr, tight particle distribution, low fines. One EG-1 at home (distilled + remineralized water), one at office (tap water, Downtown Palo Alto). Both calibrated to the same grind settings. Key structural finding: settings 6.0–6.3 all produce D50 values in the ~1000–1060 µm range due to burr geometry compression. Below 6.0, D50 continues to drop but at a diminishing rate — the steepest meaningful drop is 6.0→5.5 (~95 µm). Below 5.0, the EG-1 hits a D50 floor at ~820–880 µm regardless of dial setting.

Critical implication for high-EY roasters: Picky Chemist, Sey, and Flower Child target ~450 µm D50 on their equipment (98mm SSP or similar). This is physically unachievable on the EG-1 at any dial setting. For these roasters, the primary levers are temperature (boiling water), agitation, filter choice (T-92), and brew time (4–5 minutes).

| **Setting** | **S1** | **S2** | **S3** | **D50 Avg** | **Status**                           | **Brew Context**                                | **Distribution**                                                                | **Use When / Notes**                                                                                        |
|-------------|--------|--------|--------|-------------|--------------------------------------|-------------------------------------------------|---------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| **7**       | 1114   | 1118   | 916    | ~1116       | measured — reliable center confirmed | very coarse — anomalous vs 6.9                  | 916 persistent outlier — burr artifact. True D50 ~1116.                         | Anomalous: 7.0 reads FINER than 6.9. Not simply coarser. Remeasured March 2026. Bailout setting.            |
| **6.9**     | 1209   | 1263   | 1176   | 1216        | measured                             | coarse — upper clarity range                    | Clean stable cluster, 87 µm spread. Best-measured setting.                      | Maximize aromatic separation. Delicate washed coffees. Highest-clarity starting point.                      |
| **6.8**     | 1159   | 1135   | 1106   | 1133        | measured                             | balanced-coarse — default washed entry          | 53 µm spread. Original session contaminated; remeasurement confirmed.           | Good entry point for high-end washed Geshas and Ethiopians.                                                 |
| **6.7**     | 1119   | 1147   | 1044   | 1103        | measured                             | standard — stable reference zone                | 103 µm spread. Reliable.                                                        | Balanced clarity and sweetness. Reliable starting point for washed coffees.                                 |
| **6.6**     | 925    | 1052   | 1170   | ~1100–1150  | ⚠️ NEEDS FRESH MEASUREMENT           | increased sweetness and extraction              | All 3 original samples trending upward — clear purge contamination.             | Slightly finer than 6.7. True D50 unconfirmed — original session contaminated.                              |
| **6.5**     | 1056   | 1092   | 1083   | ~1083       | measured                             | balanced extraction — previous default          | Two clean sessions: avg ~1083 µm across six readings.                           | Starting point for washed Gesha and clean Ethiopians. Many processed coffees will taste thin here.          |
| **6.4**     | 957    | 997    | 1149   | ~977        | measured                             | high extraction — Balanced Intensity begins     | Two tight readings (957/997) with one high outlier (1149).                      | Honey lots, controlled naturals, Pacamara, Mokka, Mokkita. Often correct starting point for processed lots. |
| **6.3**     | 1062   | 1068   | 1048   | ~1050       | measured                             | strong extraction — compression begins          | Two sessions confirm ~1050 µm. Original 944 µm was wrong.                       | Natural-process, anaerobic washed. Note: nearly same D50 as 6.2 and 6.1.                                    |
| **6.2**     | 1057   | 999    | 1014   | ~1023       | measured                             | overlapping band                                | Overlaps with 6.3 and 6.1 — all within ~60 µm band.                             | Functionally equivalent to 6.3 on EG-1.                                                                     |
| **6.1**     | 1016   | 1049   | 1014   | ~1001       | measured                             | overlapping band                                | Session 1: tightest in dataset (35 µm spread). True D50 ~1001 µm.               | Dense high-elevation coffees, heavy anaerobic.                                                              |
| **6**       | 1043   | 1078   | 1061   | ~1061       | measured                             | Full Expression entry — distribution tightening | Low outlier (891) is purge artifact. Reliable cluster ~1061 µm.                 | Full Expression strategy. Sey/Flower Child/Dak territory.                                                   |
| **5.5**     | 930    | 835    | 849    | ~842        | measured                             | sub-6.0 — steepest step in survey               | Most significant single D50 drop: ~95 µm from 6.0. True center ~842.            | Key transition zone. 6.0→5.5 is where the most meaningful D50 change occurs.                                |
| **5**       | 893    | 871    | 962    | ~882        | measured                             | sub-6.0 — compression resuming                  | Reliable 893/871 cluster. Only ~60 µm below 5.5.                                | Full Expression. Fines fraction increasing.                                                                 |
| **4.5**     | 877    | 850    | 873    | ~867        | measured                             | sub-6.0 — plateau zone                          | 27 µm spread — cleanest sub-6.0 measurement. Curve nearly flat.                 | D50 changes minimal from here down.                                                                         |
| **4**       | 876    | 784    | 871    | ~874        | measured                             | sub-6.0 — plateau confirmed                     | Virtually identical to 4.5. Curve completely flat.                              | D50 floor confirmed at ~850–880 µm.                                                                         |
| **3.5**     | 764    | 873    | 996    | ~819        | measured                             | floor zone                                      | Wide spread after long fine-grinding session; 764 likely truest.                | D50 floor ~820–880 µm.                                                                                      |
| **3**       | 813    | 853    | 819    | ~816        | measured                             | floor confirmed                                 | 813/819 cluster tightly. Two full dial rotations (5.0→3.0) = ~66 µm D50 change. | EG-1 D50 floor definitively confirmed. Cannot reach sub-700 µm in filter mode.                              |

## Example Outputs

## Standard Recipe (Home)

| **Field**       | **Value**                               |
|-----------------|-----------------------------------------|
| **Coffee**      | Pepe Jijón Sidra — Flower Child         |
| **Brewer**      | UFO Ceramic Dripper                     |
| **Filter**      | Sibarist UFO Fast Cone                  |
| **Dose**        | 15g                                     |
| **Water**       | 255g                                    |
| **Grind**       | EG-1 6.6                                |
| **Temp**        | 92°C                                    |
| **Bloom**       | 50g pour for 8s, wait 40s               |
| **Pour 1**      | 0:40 → pour to 150g, 15s pour, wait 20s |
| **Pour 2**      | 1:15 → pour to 255g, 12s pour           |
| **Target Time** | 2:00–2:15                               |

## Bottomless Dripper Recipe (Office, Full Expression)

| **Field**       | **Value**                                                                                                                                                                                                                                                                           |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Coffee**      | \[Example: Colombian Anaerobic Washed — Full Expression\]                                                                                                                                                                                                                           |
| **Brewer**      | SWORKS Bottomless Dripper                                                                                                                                                                                                                                                           |
| **Filter**      | Espro Bloom Flat (155)                                                                                                                                                                                                                                                              |
| **Dose**        | 15g                                                                                                                                                                                                                                                                                 |
| **Water**       | 225g                                                                                                                                                                                                                                                                                |
| **Grind**       | EG-1 6.3                                                                                                                                                                                                                                                                            |
| **Temp**        | 97°C                                                                                                                                                                                                                                                                                |
| **Bloom**       | 45g pour, 10s — Valve: Fully Closed (Dial 0). Hold 20s, then crack to Restricted (Dial 5).                                                                                                                                                                                          |
| **Pour 1**      | 0:50 → pour to 140g, 15s — Valve: Restricted (Dial 5)                                                                                                                                                                                                                               |
| **Pour 2**      | 1:40 → pour to 225g, 15s — Valve: Restricted (Dial 5) → Half-Open (Dial 6) as bed drops                                                                                                                                                                                             |
| **Target Time** | ~3:00. If over 3:30, open valve earlier on Pour 2. If under 2:30, hold Restricted longer.                                                                                                                                                                                           |
| **Valve Note**  | Bitter finish → open to Half-Open (Dial 6) earlier in Pour 2, not grind coarser. Thin/flat → extend Restricted (Dial 5) phase. Muddy → shorten closed bloom to 15s. NOTE: Dial positions 1–4 are dead zones with real coffee bed — usable range is 5 (Restricted) through 7 (Open). |

# SECTION 2 — ROASTER REFERENCE

*Coffee Research · Latent*

Use this reference during the Coffee Brief (Step 1). The strategy tag on each roaster tells you whether your default Clarity-First approach is appropriate or whether you should expect a different extraction strategy from the start.

| **Tag**               | **Meaning**                                                                                    |
|-----------------------|------------------------------------------------------------------------------------------------|
| **CLARITY-FIRST**     | Compatible with your default approach. Start at 6.8–6.5 with low agitation.                    |
| **BALANCED**          | Moderate extraction. Start at 6.5–6.3, moderate agitation.                                     |
| **BALANCED → FULL**   | Extraction-forward. Treat as Balanced Intensity minimum; many lots need Full Expression.       |
| **FULL EXPRESSION**   | Intentionally pushes high extraction. Start at 6.3–6.0, higher temp, more agitation.           |
| **VARIES**            | Strategy depends on the specific coffee's process and variety. Check Process Signal Table.     |
| **ASSESS PER COFFEE** | No guide found or too small/new. Let process/variety drive strategy. Start Balanced Intensity. |

**Moonwake Coffee Roasters** ★ **VARIES**

|                         |                                                                                                                                                                       |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | San Francisco, CA (local)                                                                                                                                             |
| **Strategy Tag**        | VARIES                                                                                                                                                                |
| **EG-1 Starting Range** | 6.6–6.4 for most. Processed lots: consider 6.4–6.2 with higher temp.                                                                                                  |
| **House Style**         | Clarity-to-Balanced. V60 focused. 15g / 240g / 1:16. Multiple pours with bed exposure. Notes that lighter temps suit processed lots.                                  |
| **Brew Guide**          | Official — moonwakecoffeeroasters.com/pages/brew-guide                                                                                                                |
| **Notes**               | Their processed/anaerobic lots (e.g. Jeferson Motta) consistently need Full Expression — Full Expression at EG-1 6.0 / 98°C confirmed. Café reference available here. |

**Dak Coffee Roasters** ★ **FULL EXPRESSION**

|                         |                                                                                                                                                                                                               |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Netherlands                                                                                                                                                                                                   |
| **Strategy Tag**        | FULL EXPRESSION                                                                                                                                                                                               |
| **EG-1 Starting Range** | 6.4–6.2                                                                                                                                                                                                       |
| **House Style**         | High extraction, high temperature, long brew. 15g / 270g / 1:18. 99°C. 75g bloom for 60s. Two pours. Target 4:00 total.                                                                                       |
| **Brew Guide**          | Reddit thread (from Dak directly) — reddit.com/r/pourover/comments/1j89aw7                                                                                                                                    |
| **Notes**               | Dak roasts competition-adjacent and exotic lots. Their 99°C / 4 minute target is a strong signal. Default Clarity-First will under-extract. Start Balanced Intensity minimum; many lots want Full Expression. |

**Sey Coffee** ★ **FULL EXPRESSION**

|                         |                                                                                                                                                                         |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Brooklyn, NY                                                                                                                                                            |
| **Strategy Tag**        | FULL EXPRESSION                                                                                                                                                         |
| **EG-1 Starting Range** | 6.2–6.0                                                                                                                                                                 |
| **House Style**         | No official guide. Uses Aeropress in-café. Collab recipe: 20g / 340g / boiling water. Grind as fine as possible. Long bloom (60s), Melodrip, multiple aggressive spins. |
| **Brew Guide**          | No official guide. Reddit thread + Fellow collab recipe.                                                                                                                |
| **Notes**               | Sey targets very high EY (24%+). Their boiling water temp is intentional. Approach every Sey coffee expecting Full Expression. Rest 3–4 weeks minimum before brewing.   |

**Hydrangea Coffee Roasters** ★ **CLARITY-FIRST to BALANCED**

|                         |                                                                                                                                                                                                                                                                  |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Berkeley, CA                                                                                                                                                                                                                                                     |
| **Strategy Tag**        | CLARITY-FIRST to BALANCED                                                                                                                                                                                                                                        |
| **EG-1 Starting Range** | 6.7–6.5 for washed. 6.6–6.4 for naturals.                                                                                                                                                                                                                        |
| **House Style**         | V60, 15g / 250g. 93°C / ~50ppm soft water. 4-pour structure: 50g / 130g / 190g / 250g. Target 2:30.                                                                                                                                                              |
| **Brew Guide**          | Official — hydrangea.coffee/pages/faq                                                                                                                                                                                                                            |
| **Notes**               | Close to default approach. Finca El Paraíso thermal shock lots: start 6.4 / 94°C, push to 6.3 / 95°C only if thin. Cooling behavior extreme on these lots — evaluate near 40°C for rose/floral targets. Counterflow roasting style (very light, fast structure). |

**Leaves Coffee Roasters** ★ **CLARITY-FIRST**

|                         |                                                                                                                                                                                                    |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Japan                                                                                                                                                                                              |
| **Strategy Tag**        | CLARITY-FIRST                                                                                                                                                                                      |
| **EG-1 Starting Range** | 6.8–6.7                                                                                                                                                                                            |
| **House Style**         | V60, 15g / 240g / 92°C. 4 pours: 40g bloom at 0:00, +110g at 0:30, +50g at 1:10, +40g at 1:40. Target 2:15–2:30. No agitation.                                                                     |
| **Brew Guide**          | Official printed guide (confirmed first-party).                                                                                                                                                    |
| **Notes**               | 40g bloom (2.7:1 ratio) is notably lower than typical. Conservative, clarity-first style. Start 6.7–6.8 / 92°C following their pour structure before adjusting. If thin, coarsen rather than fine. |

**Strait Coffee Roasters** ★ **BALANCED / VARIES**

|                         |                                                                                                                                                                                    |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | San Jose, CA (local — farmers market Sunday)                                                                                                                                       |
| **Strategy Tag**        | BALANCED / VARIES                                                                                                                                                                  |
| **EG-1 Starting Range** | Switch: 6.4–6.2. V60: 6.6–6.5.                                                                                                                                                     |
| **House Style**         | Switch recipe: 15g / 250g / 95°C. Split dose method. Bloom 30g / 40s then close lever. Open at 2:30, finish 4:00. V60: standard parameters.                                        |
| **Brew Guide**          | V60 page + Switch recipe shared directly.                                                                                                                                          |
| **Notes**               | Focuses on terroir expression. Switch recipe is immersion-forward. For percolation brewers, Balanced Intensity is safer default than Clarity-First, especially for processed lots. |

**The Picky Chemist** ★ **FULL EXPRESSION**

|                         |                                                                                                                                                                                                       |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                                                                                               |
| **Strategy Tag**        | FULL EXPRESSION                                                                                                                                                                                       |
| **EG-1 Starting Range** | 6.2–6.0 (their ~450µm target; EG-1 compensates via temp/agitation)                                                                                                                                    |
| **House Style**         | V60-02, Cafec Abaca. 15g / 250g / 95°C. Soft water. Grind ~450µm. Target 3:30–3:50. Bloom 60g / 50s rest. High extraction intent — 24%+ EY targets.                                                   |
| **Brew Guide**          | Embedded on product pages.                                                                                                                                                                            |
| **Notes**               | Targets very high extraction. Their 450 µm target is unachievable on EG-1 — compensate via temp (boiling), agitation, T-92 filter, and brew time. Treat all Picky Chemist coffees as Full Expression. |

**Flower Child Coffee** ★ **FULL EXPRESSION**

|                         |                                                                                                                                                          |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Oakland, CA                                                                                                                                              |
| **Strategy Tag**        | FULL EXPRESSION                                                                                                                                          |
| **EG-1 Starting Range** | 6.2–6.0                                                                                                                                                  |
| **House Style**         | V60, Cafec T-92, Melodrip. 16g / 288g / 1:18+. Boiling water (210–211°F / 99°C). Medium-fine. Target 4–5+ min. Bloom 2–3x coffee weight. 25–27% EY goal. |
| **Brew Guide**          | Official — flowerchildcoffee.com/blogs/brewing-tips-guides-extrapolation/brew-guides                                                                     |
| **Notes**               | Among most extraction-forward roasters. T-92 filter + boiling water + 5 min + 25–27% EY. Full Expression from the start.                                 |

**Substance Café** ★ **BALANCED → FULL**

|                         |                                                                                                                                                      |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Paris, France                                                                                                                                        |
| **Strategy Tag**        | BALANCED → FULL                                                                                                                                      |
| **EG-1 Starting Range** | 6.5–6.3                                                                                                                                              |
| **House Style**         | V60-01, Cafec Abaca. 12g / 200g / ~91°C. 90GH / 40KH water. 5 pours with big horizontal spirals to bed edge. Target 3:00–3:15. High agitation.       |
| **Brew Guide**          | Official — substancecafe.com/our-techniques/                                                                                                         |
| **Notes**               | One of the most deliberate technical roasters. High-agitation + specific mineral water are intentional extraction tools. Balanced Intensity minimum. |

**Picolot (Brian Quan)** ★ **BALANCED → FULL**

|                         |                                                                                                                                                                                                                          |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                                                                                                                  |
| **Strategy Tag**        | BALANCED → FULL                                                                                                                                                                                                          |
| **EG-1 Starting Range** | 6.3–6.0                                                                                                                                                                                                                  |
| **House Style**         | Orea Z1. 15g / 250g / 95°C (natural decline). Diluted Third Wave Water 1:3–1:4. 3-pour: fast/fast/slow structure. Target 2:30–3:00. Grind ref: ~300 µm on M98V.                                                          |
| **Brew Guide**          | Official YouTube video.                                                                                                                                                                                                  |
| **Notes**               | Coffees described as 'loud.' Fast/fast/slow: acidity → sweetness → clarity. Orea Z1 not in inventory — translate to Orea Glass/Porcelain, April, Kalita 155. Kettle-off temp management (95°C declining) smooths finish. |

**Big Sur Coffee** ★ **FULL EXPRESSION**

|                         |                                                                                                       |
|-------------------------|-------------------------------------------------------------------------------------------------------|
| **Location**            | Big Sur, CA                                                                                           |
| **Strategy Tag**        | FULL EXPRESSION                                                                                       |
| **EG-1 Starting Range** | 6.4–6.2                                                                                               |
| **House Style**         | V60. 1:17. 99°C. Medium-fine. Extremely light roast profile.                                          |
| **Brew Guide**          | YouTube video (no official guide).                                                                    |
| **Notes**               | 99°C + extremely light roast = maximum extraction intent. Will read thin/sour at Clarity-First temps. |

**Shoebox Coffee** ★ **BALANCED**

|                         |                                                                                                                                                                                                                                                                              |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                                                                                                                                                                      |
| **Strategy Tag**        | BALANCED                                                                                                                                                                                                                                                                     |
| **EG-1 Starting Range** | 6.5–6.3                                                                                                                                                                                                                                                                      |
| **House Style**         | Primary: UFO brewer, 1:16.67, 95°C. Secondary: V60, 1:16.7, 92°C.                                                                                                                                                                                                            |
| **Brew Guide**          | YouTube video.                                                                                                                                                                                                                                                               |
| **Notes**               | UFO as primary at 95°C is higher than Clarity-First default. Secondary V60 at 92°C used to accentuate brightness. Lean Balanced Intensity. Your archive now has multiple Shoebox washed lots confirmed at Clarity-First — strategy tag may need re-evaluation toward Varies. |

**Scenery Coffee Roasters** ★ **VARIES**

|                         |                                                                                                                                                                                                                                |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | London, UK                                                                                                                                                                                                                     |
| **Strategy Tag**        | VARIES                                                                                                                                                                                                                         |
| **EG-1 Starting Range** | Washed / lightly processed: 6.6–6.4. Anoxic naturals: 6.0 confirmed (Pikudo's Rosado).                                                                                                                                         |
| **House Style**         | Roasts lighter than Nordic but slightly more developed. House recipe: low-bypass flat-bottom, long bloom (1 min), pulse pours, no agitation. 62–64g/L. 92–96°C.                                                                |
| **Brew Guide**          | Official — scenery.coffee + per-coffee lot archive pages (check these before brewing).                                                                                                                                         |
| **Notes**               | Always check lot archive page before brewing. House guide conservative — anoxic naturals needed Full Expression despite their restrained guide. Washed lots compatible with Clarity-First to Balanced. Rest 3–4 weeks minimum. |

**Luminous Coffee** ★ **FULL EXPRESSION**

|                         |                                                                                                                                             |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                                     |
| **Strategy Tag**        | FULL EXPRESSION                                                                                                                             |
| **EG-1 Starting Range** | 6.2–6.0                                                                                                                                     |
| **House Style**         | 17g / 288g / 1:17. 93°C. 5 pours × 50g. Target 3:30. Grind: 490–575µm D50.                                                                  |
| **Brew Guide**          | Official — loveluminous.coffee/pages/coffee-extraction-calculator                                                                           |
| **Notes**               | Distinctive in providing a specific µm target — 490–575µm is a real extraction signal. 5-pour pulse with 17g dose = Full Expression intent. |

**Subtext Coffee** ★ **BALANCED → FULL**

|                         |                                                                                                                                                                        |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                                                                |
| **Strategy Tag**        | BALANCED → FULL                                                                                                                                                        |
| **EG-1 Starting Range** | 6.4–6.2 for V60 and Switch. 6.5–6.3 for Kalita/Orea.                                                                                                                   |
| **House Style**         | Three recipes: V60 (16g/265g/97°C, TDS 1.41–1.45%, EY 21–21.7%), Switch (16g/240g/97°C, EY 21.9–22.7%), Kalita/Orea (14g/230g/96°C, EY 20.8–21.85%).                   |
| **Brew Guide**          | Official — three recipes provided.                                                                                                                                     |
| **Notes**               | Most data-rich roaster on this list. 97°C across all recipes. EY targets meaningfully above Clarity-First range. Kalita/Orea recipe directly relevant to office setup. |

**September Coffee** ★ **BALANCED → FULL**

|                         |                                                                                                                                                                                           |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                                                                                   |
| **Strategy Tag**        | BALANCED → FULL                                                                                                                                                                           |
| **EG-1 Starting Range** | 6.3–6.0 for 3-pour track                                                                                                                                                                  |
| **House Style**         | Extra-light specialists. 3-pour track (uniform grinders): 40–50g bloom, two main pours. 93–98°C depending on rest. ZP6 4.5–5.0 reference. Heavy agitation.                                |
| **Brew Guide**          | Reddit thread (roaster-sourced).                                                                                                                                                          |
| **Notes**               | Roasts extremely light and compensates with temperature (up to 98°C rested) and heavy agitation. Do not apply Clarity-First defaults. Temperature should track rest time per their guide. |

**normlppl / minmax** ★ **CLARITY-FIRST**

|                         |                                                                                                                                                                 |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown (small independent)                                                                                                                                     |
| **Strategy Tag**        | CLARITY-FIRST                                                                                                                                                   |
| **EG-1 Starting Range** | 6.8–6.6                                                                                                                                                         |
| **House Style**         | V60 01, Cafec Abaca. 12.5g / 200g / 91–93°C. 5 pours of 40g every ~30s. Target 2:45–4:00. Coarse grind. Extensive rest recommended (2–5 weeks, up to 3 months). |
| **Brew Guide**          | Wayback Machine archived guide.                                                                                                                                 |
| **Notes**               | Deeply clarity-oriented. Lower dose (12.5g) + long rest = patience over intensity. Rest timing is important.                                                    |

**Tim Wendelboe** ★ **CLARITY-FIRST**

|                         |                                                                                        |
|-------------------------|----------------------------------------------------------------------------------------|
| **Location**            | Oslo, Norway                                                                           |
| **Strategy Tag**        | CLARITY-FIRST                                                                          |
| **EG-1 Starting Range** | 6.8–6.5                                                                                |
| **House Style**         | Precision pour-over. Ultra-light Nordic roasts. Explicit clarity-first intent.         |
| **Brew Guide**          | Official — timwendelboe.no                                                             |
| **Notes**               | Canonical Nordic clarity roaster. Reference point for precision clarity-first brewing. |

**April Coffee Roasters** ★ **CLARITY-FIRST**

|                         |                                                                                                                                 |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Copenhagen, Denmark                                                                                                             |
| **Strategy Tag**        | CLARITY-FIRST                                                                                                                   |
| **EG-1 Starting Range** | 6.8–6.5                                                                                                                         |
| **House Style**         | Named after the April Brewer. Recipes designed around that brewer's behavior. Per-coffee recipes available on site.             |
| **Brew Guide**          | Official — aprilcoffeeroasters.com/pages/coffee-inf-recipes                                                                     |
| **Notes**               | Retrieve per-coffee recipe before brewing. Note April Brewer at office drains fast (~2:30) — adjust pour structure accordingly. |

**Glitch Coffee** ★ **BALANCED**

|                         |                                                                                                            |
|-------------------------|------------------------------------------------------------------------------------------------------------|
| **Location**            | Tokyo, Japan                                                                                               |
| **Strategy Tag**        | BALANCED                                                                                                   |
| **EG-1 Starting Range** | 6.5–6.4                                                                                                    |
| **House Style**         | 260g / 86°C / 15g. Bloom 70g, stir 3x. Pour 1: 0:30 to 140g. Pour 2: 1:20, 50g. Target 2:30.               |
| **Brew Guide**          | Official (via Reddit).                                                                                     |
| **Notes**               | 86°C is standout signal — deliberately low. If cups taste flat, step up to 88–90°C before adjusting grind. |

**Tanat Coffee** ★ **CLARITY-FIRST**

|                         |                                                                                                                                            |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                                    |
| **Strategy Tag**        | CLARITY-FIRST                                                                                                                              |
| **EG-1 Starting Range** | 6.8–6.6 for V60. 6.7–6.5 for Orea.                                                                                                         |
| **House Style**         | V60: 12g / 200g / 92°C, Cafec Abaca+. Orea: 15g / 240g / 94°C, flat-bottom filter. Both target ~2:30. Controlled even pours, no agitation. |
| **Brew Guide**          | Official — two recipe tracks on site.                                                                                                      |
| **Notes**               | Clearly clarity-first intent. Orea recipe references Sibarist flat filters — same as inventory. Start EG-1 6.6 / 94°C for Orea.            |

**Kurasu** ★ **CLARITY-FIRST**

|                         |                                                                                                                                                                |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Kyoto, Japan                                                                                                                                                   |
| **Strategy Tag**        | CLARITY-FIRST                                                                                                                                                  |
| **EG-1 Starting Range** | 6.7–6.8                                                                                                                                                        |
| **House Style**         | V60, 15g / 240g / 92°C. Identical pour structure to Leaves Coffee Roasters. Low agitation by design. Explicit 'neutral baseline' recipe.                       |
| **Brew Guide**          | Official.                                                                                                                                                      |
| **Notes**               | Positions recipe explicitly as a low-agitation moderate-extraction baseline for comparing roasts. Useful as cross-roaster comparison tool against Leaves lots. |

**Prodigal Coffee** ★ **BALANCED**

|                         |                                                                                                                |
|-------------------------|----------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                        |
| **Strategy Tag**        | BALANCED                                                                                                       |
| **EG-1 Starting Range** | 6.5–6.3                                                                                                        |
| **House Style**         | Links to Scott Rao's blog — no proprietary recipe. Technically grounded, process-aware philosophy.             |
| **Brew Guide**          | scottrao.com/blog                                                                                              |
| **Notes**               | Start Balanced Intensity and apply normal Coffee Brief process signal logic. No strong extraction push signal. |

**Daturra Coffee** ★ **BALANCED**

|                         |                                                                                                           |
|-------------------------|-----------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                   |
| **Strategy Tag**        | BALANCED                                                                                                  |
| **EG-1 Starting Range** | 6.5–6.3                                                                                                   |
| **House Style**         | No direct brew guide. Paris-adjacent (Dayglow collab). Quality-focused positioning.                       |
| **Brew Guide**          | Referenced via Dayglow Coffee collab.                                                                     |
| **Notes**               | Insufficient data for strong signal. Start Balanced Intensity and be ready to pivot after the first brew. |

**Thankfully Coffee** ★ **ASSESS PER COFFEE**

|                         |                                                                                                                           |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                   |
| **Strategy Tag**        | ASSESS PER COFFEE                                                                                                         |
| **EG-1 Starting Range** | 6.6–6.4 (Typica Mejorado/Sydra-adjacent lots)                                                                             |
| **House Style**         | No official guide. Sources Pepe Jijón lots. Third-party recipe for Typica Oxidator lot suggests clarity-oriented brewing. |
| **Notes**               | Given Pepe Jijón sourcing, expect variety-driven strategy. Variety can override process flag for Typica Mejorado/Sidra.   |

**Aviary Coffee** ★ **ASSESS PER COFFEE**

|                         |                                                                                    |
|-------------------------|------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                            |
| **Strategy Tag**        | ASSESS PER COFFEE                                                                  |
| **EG-1 Starting Range** | 6.4–6.3 (anaerobic Ethiopian lots)                                                 |
| **House Style**         | No official guide. Sources anaerobic Ethiopian lots (Bekele Yutute).               |
| **Notes**               | No first-party guide. For anaerobic Ethiopian lots, Balanced Intensity as default. |

**Coffee with Dongze** ★ **CLARITY-FIRST**

|                         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown (micro roaster; SF-adjacent per industry connection to Hydrangea)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Strategy Tag**        | CLARITY-FIRST                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **EG-1 Starting Range** | 6.5 at 12.5g (confirmed across 4 brews at home). Primary dial is temperature, not grind: 93–94°C depending on process.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **House Style**         | Ultralight micro roaster (Steven), Substance-inspired. Small-pouch format: 12.5g / 200g (1:16). Label guide: V60 / ~21 clicks on his grinder / 92°C / 4 pours (30/70/70/30). Friends with Hydrangea’s Bill; shares lots (incl. Hacienda La Esmeralda). Direct-ship through coffee-with-dongze.myshopify.com.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Brew Guide**          | Per-pouch label (QR code + printed recipe). No centralized brew guide page; per-coffee label is the source.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Notes**               | Confirmed CLARITY-FIRST across 4 brews (Longboard Misty Mountain, Finca Nuguo Natural, Finca Sophia Heritage Washed, HLE Valle 3NC Natural) — all at 12.5g / 200g / V60 Glass + Sibarist B3 Cone at home. Key principle: the label’s 92°C under-extracts at 12.5g bed depth — correct upward. Washed lots: 93°C. Standard natural: 94°C. Esmeralda climate-controlled (“NC”) natural: 93.5°C (cleaner than raised-bed naturals). Grind stays at 6.5 regardless of process — at 12.5g, coarser than 6.5 produces hollow body despite the Clarity-First strategy. Pulse-pour structure from the label guide (collapsed to 3 pours on V60): 30g bloom → 100g → 170g → 200g. V60 Glass + Sibarist B3 is the confirmed vehicle; stop experimenting with brewer on Dongze small-format pouches. Peak expression cool (45–50°C). Evaluate below 50°C on all Dongze naturals. |

**Exposure Therapy Coffee** ★ **ASSESS PER COFFEE**

|                         |                                                                                                                          |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                  |
| **Strategy Tag**        | ASSESS PER COFFEE                                                                                                        |
| **EG-1 Starting Range** | Assess per process/variety signal. Start Balanced Intensity.                                                             |
| **House Style**         | No brew guide found.                                                                                                     |
| **Notes**               | No documentation available. Small independent roasters often source competition-adjacent lots that want more extraction. |

**Archers Coffee** ★ **ASSESS PER COFFEE**

|                         |                                                                                                                                  |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                          |
| **Strategy Tag**        | ASSESS PER COFFEE                                                                                                                |
| **EG-1 Starting Range** | Assess per process/variety signal.                                                                                               |
| **House Style**         | No brew guide found. Sourced: Ethiopia Elto Elora Station River Flow Washed CF10 (74158 landrace).                               |
| **Notes**               | No documentation available. Apply Coffee Brief process/variety signal logic. Ethiopian washed landraces → Clarity-First default. |

**Colibri Coffee Roasters ★ BALANCED**

|                         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Camano Island, WA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Strategy Tag**        | BALANCED                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **EG-1 Starting Range** | 6.5–6.4 for honey/anaerobic lots; 6.7–6.5 for washed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **House Style**         | Small family-owned roaster. Single-origin focus. No public brew guide found.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Brew Guide**          | No public guide found. Note: kolibricoffee.com is a different Dutch roaster — do not confuse with colibricoffeeroasters.com.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Notes**               | First confirmed lot: Finca La Reserva Gesha Anaerobic Honey (Antioquia, Colombia) — Balanced Intensity confirmed first-pass. EG-1 6.4 / 93°C / SWORKS Bottomless Dripper Restricted (Dial 5) through Pour 1, crack to Half-Open (Dial 6) once bed drops in Pour 2. 18g / 288g (1:16). Anaerobic honey process amplifies florals without adding heavy fermentation weight — Gesha variety and honey process together signal Balanced Intensity, not Full Expression. Cup peaks cool (45–50°C); green apple, fresh grape, honeyed white tea. Evaluate below 50°C. |

# SECTION 3 — ARCHIVE PATTERNS

*Coffee Research · Latent*

This section captures strategy-level learnings from the brew archive. It is NOT a recipe log — the app handles that. This is about extraction strategy patterns: what approaches work for which types of coffees, and what corrections have been needed.

*Rule: Don't add a pattern until you have seen it in at least 2 coffees. One coffee is a data point. Two is the beginning of a pattern.*

## How to Use This Section

Reference this during the Coffee Brief (Step 1) when designing a recipe for a new coffee. Scan relevant entries based on the coffee's process, variety, and origin — not to copy past recipes, but to flag whether a non-default strategy has historically been needed for similar coffees.

Update this section after archiving a new best brew. Ask: did this coffee teach something about extraction strategy that applies to future coffees of this type? If yes, add it here.

## By Extraction Strategy

## Coffees That Confirmed Clarity-First

These coffee types have consistently worked well at the default approach (EG-1 6.8–6.5, low agitation, fast-flow filters):

- Washed Gesha from Panama / Colombia highlands — consistent peak at Clarity-First. UFO or Orea Glass with Sibarist FAST is the reliable setup.

- Ethiopian washed landraces (74110, 74112, 74158) from Sidama/Bensa — Clarity-First works well but cups consistently improve cooling. Don't judge the brew until it's below 50°C.

- Typica Mejorado / Sydra from Ecuador (e.g. Finca Soledad TyOxidator, Finca Soledad Sydra Cold Fermented Washed DRD) — Clarity-First with longer bloom and uninterrupted pour. Savory if over-bloomed or agitation too high. Key finding (Sydra): variety signal dominates over experimental process flag when flavor targets are bright and citric. UFO + Sibarist Fast Cone + Melodrip at EG-1 6.5 / 92°C confirmed first-pass. Fast drawdown (~1:35) did not require compensation.

- Washed Laurina — intrinsically light body; forcing extraction does not add weight, it adds tannin. Stay Clarity-First.

- Panama Gesha Natural from Hacienda La Esmeralda El Velo — climate-controlled drying (“NC” designation, Peterson family’s indoor drying room) produces a cleaner, more restrained natural than traditional raised-bed sun-dried lots. Confirmed Clarity-First across two data points: Hydrangea El Velo Natural (15g, UFO Ceramic + Sibarist UFO Fast, EG-1 6.7 / 91°C) and Coffee with Dongze HLE Valle 3NC (12.5g, V60 Glass + Sibarist B3 Cone, EG-1 6.5 / 93.5°C). Dose determines grind: 6.7 works at 15g but produces hollow body at 12.5g; 6.5 is the correct setting for small-pouch 12.5g format. Climate-controlled drying preserves variety transparency — do not push toward Balanced Intensity despite the natural process. Cup peaks cool (45–50°C); expect rose, bergamot, stone fruit, wildflower honey, tea-like silky body.

## Coffees That Needed Balanced Intensity

These types consistently under-performed at Clarity-First and improved with moderate extraction increase:

- Honey-process lots (confirmed: Buncho Honey, Finca La Reserva Honey Anaerobic Gesha — Colibri) — benefit from bed exposure between pours and slightly finer grind (6.5–6.4). Sweetness reads thin at coarser settings. Anaerobic honey process amplifies florals without adding heavy fermentation weight; Gesha variety and honey process together signal Balanced Intensity, not Full Expression. Two data points.

- Natural Pacamara (Rio Cristal) — larger bean needs slightly more extraction energy. 6.4 and continuous gentle spiral.

- Mokkita Natural (Garrido) — wine fruit character needs extraction support. 6.6 was appropriate but body stayed medium. Could push to 6.4 to test.

- Colombian washed Pink Bourbon (e.g. Tolima Anaerobic Washed) — NOTE: this lot preferred moderate extraction, NOT high. 6.3 pushed into phenolic sharpness. Pink Bourbon is transparency-driven, not weight-driven. Balanced is the ceiling, not the floor.

- Colombian natural Gesha with anaerobic fermentation (e.g. Hydrangea Finca Inmaculada Gesha Natural, Valle del Cauca) — confirmed Balanced Intensity. EG-1 6.4, 93°C, Kalita Wave 155 + Espro Bloom. Bitter finish is temperature-driven, not grind-driven — dropping temp from 95°C to 93°C resolved it. Coarsening grind was the wrong lever. Cup peaks cool; evaluate below 50°C.

- Yeast-inoculated anaerobic natural (e.g. Moonwake Project One Light Peach Oolong, Catimor, Yunnan) — confirmed Balanced Intensity. Counter-example to the Full Expression default for experimental fermentation. The yeast engineering carries the expressive weight; extraction strategy here is about not getting in the way. EG-1 6.3, 96°C, Kalita Wave 155 + Espro Bloom (office). Cup resolves best cold — do not evaluate before 45°C.

- Yeast-inoculated thermal shock washed lots from Finca El Paraíso (Diego Bermúdez, Cauca, Colombia) — confirmed Balanced Intensity across two lots and two varieties. (1) Hydrangea Letty Bermúdez Gesha, 1930 masl: EG-1 6.3 / 95°C, UFO Ceramic + Sibarist UFO Fast Cone. (2) Hydrangea El Paraíso ‘Lychee’ Castillo, 1960 masl: EG-1 6.4 / 94°C — confirmed first pass. Cooling behavior extreme: rose character absent above 50°C, only emerges near 40°C. Start at 6.4 / 94°C and push to 6.3 / 95°C only if thin.

Yeast-inoculated white honey Gesha from Colombia (Sebastian Ramirez El Placer, Quindío, 1800m) — confirmed Balanced Intensity. Third confirmed subtype for yeast-inoculated Balanced Intensity, alongside anaerobic natural (Peach Oolong) and thermal shock washed (El Paraíso). Key finding: the Gesha variety and white honey process individually signal Clarity-First, but yeast inoculation adds enough complexity to require Balanced Intensity extraction support. Temperature is the primary lever — moving from 93°C to 95°C unlocked fruit where there had been none; grind (6.4→6.3) was secondary. SWORKS Bottomless Dripper (Restricted valve through Pours 1–2) solved the fast-drain problem the Kalita Wave 155 could not at the office. Natural kettle-off-base taper delivers ~2°C drop across the brew (95°C bloom → ~93°C by final pour) — effective at softening bitter tail without compromising mid-brew extraction. Cup peaks cool (~45–50°C); what reads as bitter finish when hot is the cardamom/spice note resolving. Do not iterate on the finish above 50°C. Yeast-inoculated natural with washed finish (Hydrangea Gesha Horizon Don Eduardo, Boquete, Panama, 1800 masl) — confirmed Balanced Intensity. Fourth confirmed subtype. Key finding: the washed finish moderates fermentation density compared to a straight inoculated natural — grind support at the finer end of Balanced Intensity range (6.4, not 6.5) is required to express fruit fully. At 6.5, attack ended abruptly and fruit was thin and disconnected; 6.4 resolved both. The washed finish also produces a structurally clean, non-lingering finish — do not attempt to extend aftertaste by pushing extraction further; it is a process characteristic. Temperature: 94°C kettle-on-base throughout was correct; no taper needed. Cooling behavior: significant improvement below ~50°C (passion fruit / white plum integrates), but not extreme — 45–50°C is the accurate evaluation window, not near room temperature. Passion fruit and white plum are more accurate descriptors than strawberry/plum for this lot in this recipe; the washed finish shifts red fruit toward brighter tropical character.

## Coffees That Needed Full Expression

These coffees under-extracted or tasted one-dimensional until pushed significantly beyond the default:

- Moonwake Jeferson Motta (Anaerobic Washed Gesha, Huila, Colombia) — confirmed Full Expression. Clarity-First produced sour, flat cup. Kalita Wave 155 + Espro Bloom (office) resolved structural flatness that April Brewer could not. EG-1 6.0, 98°C, 1:15. Cup must be evaluated below 50°C — roast note at high temp fully resolves cool. Candied strawberry, orange, hibiscus at peak. Pattern confirmed: anaerobic washed Colombian Geshas from Huila/Cauca are a reliable Full Expression signal regardless of cultivar.

- Scenery Pikudo's Rosado (Anoxic Natural, Rosado variety, Palestina, Huila, Colombia) — confirmed Full Expression. Balanced Intensity at EG-1 6.4 / 92°C produced underdeveloped cup. Pivoting to EG-1 6.0 / 95°C unlocked candied strawberry, Earl Grey body. Notable: Rosado (Pink Bourbon family) is transparency-driven — Balanced would normally be the ceiling — but the anoxic fermentation process overrode the variety signal entirely. Do not apply Pink Bourbon/Rosado variety logic to anoxic natural lots. Temperature taper (95°C → natural ~94°C on final pour) resolved bitter tail.

- Moonwake Blooms Coffee (Washed Catuai, Abel Dominguez, Honduras) — confirmed Full Expression despite clean washed process. Dense variety with fruit-forward roaster intent (pomelo, apricot, pear) required EG-1 6.0 / 95°C / 1:15. Kettle-on-base temperature management is a hard requirement. One data point — flag for confirmation on next dense washed variety with fruit-forward expression intent.

- Moonwake El Eden Tamarind Washed (Tamarind + Red Fruit Co-Ferment Washed, Purple Caturra + Bourbon, Finca El Edén, Huila Colombia, 1500m) — confirmed Full Expression. Heavy co-ferment washed (150-hour sealed fermentation, lactobacillus + saccharomyces cerevisiae + tamarind/red fruit culture) reliably follows same pattern as Jeferson Motta anaerobic washed. EG-1 6.0, 96°C kettle-on-base, SWORKS Bottomless Dripper Dial 5 (Restricted) through all main pours, crack to Dial 6 (Half-Open) midway through final pour. 18g / 288g (1:16). Contact time is the primary finishing lever — valve transition timing, not grind or temperature, was the only dial across three brews. Brew 1 (too fast): thin body, perfumy unresolved note. Brew 2 (Dial 5 through full Pour 3): body filled, rose dominant, lychee receded. Brew 3 (crack to Dial 6 midway Pour 3): all three targets balanced — lychee, baklava, rose. Ginger-spice finish is a tamarind process characteristic, not an extraction artifact — do not attempt to dial out. Evaluate below 50°C; lychee and baklava integration both happen late. This coffee is the reference recipe for heavy co-ferment washed lots on the SWORKS at the office. Extraction Strategy Confirmed: Full Expression.

- Picolot Emerald PL#015 (Garrido Panama Mokka Natural, Boquete, Gissell & Lily Garrido) — confirmed Full Expression on Picolot roast. Balanced Intensity at EG-1 6.2 with Dial 5 through Pours 1–2 produced tea-like cup with no fruit development. Shifting to EG-1 6.0 / 95°C kettle-off with Picolot fast/fast/slow valve structure (Dial 7 Open → Dial 7 Open → Dial 5 Restricted on final pour) unlocked green grape attack, candied honeydew sweetness, and rosemary on cooling. 15g / 250g (1:16.7 — Picolot ratio). Two key findings: (1) Grind was the correct lever for fruit development, NOT longer mid-pour contact time. Restricting valve during Pours 1–2 starved the bed of fresh water and reduced extraction. Only restrict on the final integration pour. (2) Mokka expresses distinctly from Mokkita (same Garrido producer, related variety name): cleaner, transparency-driven, structured acidity with herbal lift; wine character absent. “Crisp body” on the Picolot label is a real descriptor — tea-like body is intentional to the variety, not a recipe deficiency. Cup peaks warm to cool (~55°C and below); rosemary and candied sweetness integrate on cooling. Reference recipe for Picolot Mokka Natural lots on the SWORKS at the office. Extraction Strategy Confirmed: Full Expression.

**Coffees Where Strategy Was Unclear (needs more data)**

- Dark Room Dry Natural Gesha (Panama Elida, Garrido Mokkita) — natural with controlled drying. Responded to Balanced Intensity but may want more. Flag for re-evaluation.

- Brazil washed Geisha (Daterra Borem) — April Glass + Espro Bloom was the right setup but Brazil terroir is unusual for the rotation. More data needed.

## By Process

| **Process**                                        | **Default Strategy**     | **Observed Exceptions**                                                                                                                                                                 | **Key Risk**                                                                                       |
|----------------------------------------------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Washed                                             | Clarity-First            | Dense varieties with fruit-forward expression intent (Catuai, Honduras) may need Full Expression. One data point.                                                                       | Turbulence flattens acidity; don't over-agitate                                                    |
| White / Light Honey                                | Clarity-First → Balanced | Some need 6.5 not 6.7                                                                                                                                                                   | Thin sweetness at coarse end                                                                       |
| Honey (medium)                                     | Balanced Intensity       | Pink Bourbon prefers Balanced, not Full                                                                                                                                                 | Heavy honey can push toward sweetness overload                                                     |
| Controlled Natural (DRD, raised bed)               | Balanced Intensity       | Mokka confirmed Full Expression on Picolot roast (fast/fast/slow structure). Mokkita still under-tested — may want more.                                                                | Wine character needs support, not suppression                                                      |
| Anaerobic Natural                                  | Balanced Intensity       | Confirmed Hydrangea Finca Inmaculada (Valle del Cauca). Two data points.                                                                                                                | Bitter finish is temperature-driven, not grind-driven. Coarsening strips fruit; drop temp instead. |
| Anoxic Natural (sealed container)                  | Full Expression          | Confirmed Scenery Pikudo's Rosado. One data point.                                                                                                                                      | Process overrides variety signal. Temperature taper resolves bitter tail.                          |
| Anaerobic Washed (clean / lighter)                 | Balanced Intensity       | Heavy anaerobic / Colombian Huila/Cauca needs Full Expression                                                                                                                           | Phenolic sharpness if over-extracted; sour if too coarse                                           |
| Anaerobic Washed (heavy / Colombian Huila / Cauca) | Full Expression          | Confirmed — see Jeferson Motta entry                                                                                                                                                    | Sour if under; roast/bitter at high temp resolves cooling                                          |
| Heavy Anaerobic / Co-ferment                       | Full Expression          | None — confirm with roaster guide                                                                                                                                                       | Sour if under; boozy if over                                                                       |
| Experimental (thermal shock, yeast-inoculated)     | Balanced Intensity       | Confirmed Balanced Intensity across four subtypes: anaerobic natural, thermal shock washed, white honey, and yeast-inoculated natural with washed finish. Don’t assume Full Expression. | Let flavor intent and roaster guide drive strategy.                                                |

## By Variety

- Gesha (Panamanian) — reliable at Clarity-First for washed and clean natural lots. Loses florals with turbulence. Don’t over-extract. Climate-controlled naturals from Hacienda La Esmeralda (“NC” designation) stay Clarity-First — do not assume Balanced Intensity despite the natural process. Confirmed: Hydrangea El Velo Natural (15g / 6.7 / 91°C) and Dongze HLE Valle 3NC (12.5g / 6.5 / 93.5°C). Grind setting is dose-dependent, not variety-dependent: 6.7 works at 15g but produces hollow body at 12.5g. Exception: yeast-inoculated natural with washed finish (confirmed: Hydrangea Don Eduardo) requires Balanced Intensity at EG-1 6.4 — the inoculation overrides the Clarity-First default even for Panama Gesha. Start at the finer end of Balanced Intensity; the washed finish moderates fermentation density but does not eliminate the extraction need.

- Gesha (Colombian, washed) — slightly more body than Panama types. Still Clarity-First for clean washed lots.

- Gesha (Colombian, anaerobic honey) — confirmed Balanced Intensity. Finca La Reserva (Antioquia, Colibri): EG-1 6.4 / 93°C / SWORKS Bottomless Dripper Restricted (Dial 5) through Pour 1, crack to Half-Open (Dial 6) once bed drops in Pour 2. 18g / 288g. Anaerobic honey process amplifies florals (jasmine, lavender) without adding heavy fermentation weight — does not push toward Full Expression. Cup peaks cool (45–50°C): green apple, fresh grape, honeyed white tea. Evaluate below 50°C; tart edge softens and flavors cohere as cup cools. One data point.

- Gesha (Colombian, anaerobic washed) — process overrides variety entirely. Full Expression confirmed for Huila/Cauca anaerobic washed lots. Note: Colombian anaerobic NATURAL Gesha (e.g. Hydrangea Finca Inmaculada, Valle del Cauca) is a different profile — Balanced Intensity, not Full Expression.

- Finca El Paraíso thermal shock lots (Colombian, yeast-inoculated) — Balanced Intensity confirmed across two lots and two varieties. Flavor targets are aromatic and transparency-driven. Do not apply the Huila/Cauca Full Expression pattern to these lots. Start 6.4 / 94°C; push to 6.3 / 95°C only if thin.

- Ethiopian Landraces (74110/74112/74158) — Clarity-First works but cups consistently improve cooling. Don't evaluate before 45–50°C.

- Pink Bourbon — transparency-driven, not weight-driven. Balanced is the ceiling. Does not benefit from Full Expression.

- Rosado (Pink Bourbon family, Colombia) — transparency-driven like Pink Bourbon. Balanced normally the ceiling. However, anoxic natural processing overrides the variety signal entirely — do not apply Rosado/Pink Bourbon ceiling logic to anoxic natural lots.

- Pacamara — slightly larger extraction energy needed due to bean density. Balanced Intensity default.

- Mokka (Bourbon Family, classic Bourbon lineage) — ancient Yemen-origin dwarf Bourbon-type. Small beans, low yield, high aromatic intensity. Genetically distinct from Mokkita despite name similarity — do NOT classify as the same variety. One data point confirmed: Picolot Garrido Panama Mokka Natural (Emerald PL#015) — Full Expression at EG-1 6.0 / 95°C kettle-off / SWORKS fast/fast/slow (Dial 7 → 7 → 5). Transparency-driven cup structure with “crisp body” intentional to the variety; tea-like body is not a recipe deficiency. Pair with roaster Full Expression guidance rather than variety ceiling logic. Distinct from Mokkita: cleaner, more structured acidity with herbal lift; wine character absent.

- Mokkita (Modern Hybrids, multi-parent hybrid lineage) — modern selection/hybrid line, often tied to specific farms (e.g. Garrido). Pedigree not fully disclosed; classify conservatively. Broader brew tolerance than Gesha. Can handle Balanced and may benefit from it. Distinct from Mokka: wine-structured naturals with dark plum fruit and structural weight; responds to extraction support but less extraction-forward than Mokka on the same roaster house style (based on Mokkita DRD archive). Do NOT treat Mokka and Mokkita as interchangeable.

- Typica Mejorado / Sydra — moderate extraction, long bloom, uninterrupted pour. Savory if bloom is too long or agitation too high. Variety signal overrides experimental process flag when flavor targets are bright and citric.

- Catuai (washed, Honduras) — dense variety that exceeded Clarity-First's extraction ceiling despite clean washed process. One data point; flag variety density and expression intent on future washed Catuai lots.

**Cooling Behavior Observations**

Several cultivars and processes show dramatically different cup quality at different temperatures. Track this — it affects how you evaluate brews.

- Ethiopian washed landraces — consistently peak at warm-to-cool (45–50°C). Don't judge until cooled.

- Honey lots — frequently improve cooling. Sweetness integration increases below 50°C. Confirmed: Finca La Reserva Gesha Anaerobic Honey (Colibri, Antioquia) — tart edge reads brighter hot; cup integrates as green apple / fresh grape / honeyed white tea at 45–50°C. Evaluate below 50°C on all honey-process lots.

- Washed Gesha — peaks hot-to-warm. Expression fades gracefully; doesn't dramatically improve cool.

- Sydra / cold fermented washed (Finca Soledad) — improves progressively cooling. White grape and pear clarity increase below ~55°C.

- Anaerobic Washed Gesha (Jeferson Motta, Moonwake) — do not evaluate before 50°C. Roast note and muted attack present at high temp are heat masking, not extraction defects. Cup transforms dramatically below 50°C.

- Colombian natural Gesha with anaerobic fermentation (Hydrangea Finca Inmaculada) — peaks cool. Fruit integrates significantly below 50°C.

- Anoxic natural (Scenery Pikudo's Rosado, Palestina, Huila) — peaks below 50°C. Mild bitter tail present at serving temperature resolves cleanly as cup cools.

- Finca El Paraíso thermal shock lots (Hydrangea, Cauca) — extreme cooling behavior. Letty Bermúdez (Gesha): rose character absent above 50°C, only emerges near 40°C. Lychee Castillo: peaks below 50°C. Evaluate well below 50°C — possibly closer to 40°C for rose/floral targets.

- Yeast-inoculated anaerobic natural (Moonwake Peach Oolong) — resolves best cold. Do not evaluate before 45°C.

Yeast-inoculated white honey Gesha (Moonwake Sebastian Ramirez El Placer, Quindío) — peaks cool (~45–50°C). What reads as bitter finish when hot is the cardamom/spice note resolving. Cup integrates and sweetness increases significantly below 50°C. Do not evaluate or iterate on the finish above 50°C. Yeast-inoculated natural with washed finish (Hydrangea Don Eduardo Gesha, Panama) — improves meaningfully below ~50°C as fruit integrates and spikiness resolves. Not extreme cooling behavior — 45–50°C is the accurate evaluation window. Does not require near-room-temperature evaluation. Heavy co-ferment washed (Moonwake El Eden Tamarind Washed, Purple Caturra + Bourbon, Huila Colombia) — follows same cooling pattern as Jeferson Motta anaerobic washed. All three flavor targets (lychee, baklava, rose water) read muted or unresolved above 50°C. Lychee integration in particular happens late. Do not evaluate before 50°C. Ginger-spice finish present across all brews is a tamarind process characteristic — it softens and integrates at cool but does not disappear entirely; treat as intended complexity, not an extraction defect.

**Body intuition is not always a grind signal.** Light, tea-like body on high-elevation Panama Gesha (≥1,900 masl) is variety-intrinsic, not an extraction deficit. Confirmed across Hydrangea El Velo Natural and Dongze HLE Valle 3NC: cups showing full aromatic expression (florals, citrus, stone fruit), integrated tart-sweet structure, and cool-peak behavior are fully extracted even when body reads silky/light. Before adjusting grind on the basis of body alone, check: (1) aromatic integration — are the roaster’s target notes present and layered? (2) cooling behavior — does the cup peak cool rather than collapse? (3) finish — is there drying tannin, or a clean close? If all three pass, the body is the variety, not the recipe. Pushing finer will compress florals before it adds weight.

## Office Brewing Notes (Palo Alto)

- Kalita Wave 155 + Espro Bloom drains consistently at 3:00–3:30 at the office. Pour structure and rest timing between pours are the primary extraction levers, not grind size. NOTE: on some coffees (confirmed: Sebastian Ramirez White Honey Gesha) the Kalita still drains too fast for Balanced Intensity — switch to SWORKS Bottomless Dripper with Restricted valve when contact time is critical.

- Espro Bloom Flat runs faster than its paper weight suggests even at home — do not assume slower drawdown based on filter spec alone.

- SWORKS Bottomless Dripper valve calibration confirmed (Espro Bloom + EG-1 6.0, real coffee bed): Dial 0–1 = Fully Closed (no flow). Dial 1–4 = dead zones (near-zero flow with real coffee bed — do not use for extraction). Dial 5 = Restricted (~60 sec/100g). Dial 6 = Half-Open (~45 sec/100g). Dial 7 = Open (~30 sec/100g). Full turn past 7 back to 0 = maximum flow (~20 sec/100g). Calibration may shift slightly at coarser grind settings — recheck if using above EG-1 6.5.

- SWORKS valve restriction timing principle (confirmed: Picolot Emerald Garrido Mokka Natural). Restricting the valve to Dial 5 during mid-extraction pours (Pours 1–2) can REDUCE fruit and sugar development by starving the bed of fresh water. Extraction depends on the concentration gradient of fresh water meeting saturated grounds, not just contact time — holding a restricted valve through the extraction-critical window slows flow when you want water renewal. Reserve Dial 5 restriction for the final integration pour (the slow phase). For fast/fast/slow roaster structures (e.g. Picolot): Dial 7 Open → Dial 7 Open → Dial 5 Restricted, not Dial 5 throughout. Exception: heavy co-ferment washed lots (e.g. Moonwake El Eden Tamarind) need Dial 5 through all main pours because the extraction ceiling is much higher — valve timing for those is about WHEN to crack open, not WHEN to restrict. Diagnostic: tea-like body with subtle attack + no sweetness = under-extraction from over-restriction of mid-pours. Fix by opening Pours 1–2 and going finer on grind, not by restricting more.

- Tap water only at the office (Downtown Palo Alto municipal supply). Recipe parameters may differ slightly from home results on the same coffee.

## Open Questions

Things to test across future brews:

- Does finer grind (6.0 vs 6.1) consistently trade body clarity for attack intensity on anaerobic washed lots, or is this specific to Jeferson Motta?

- Mokkita Natural DRD: would pushing to 6.4 and higher agitation improve or muddle the wine character? Note: Mokka Natural (sibling variety, same Garrido producer) confirmed Full Expression at EG-1 6.0 on Picolot roast — but Mokka is cleaner/transparency-driven while Mokkita is wine-structured, so the answer may not transfer. Test Mokkita DRD specifically.

- Does the anoxic natural Full Expression signal hold regardless of variety, or was Pikudo's Rosado result driven by Huila terroir specifically? Test on a non-Huila anoxic natural.

- Is temperature the primary finishing lever for bitter tail on Colombian naturals generally? Partially confirmed across two lots. Test on a non-Colombian anaerobic natural.

- Is the extreme (~40°C) evaluation threshold on El Paraíso thermal shock lots specific to rose/floral-target varieties (Gesha), or does it apply to all Diego Bermúdez lots? Lychee Castillo peaks closer to ~50°C — suggesting it may be flavor-target-driven.

- Does the April Brewer at home (remineralized water) drain significantly slower than at the office (tap water)?

- Has a Flower Child coffee been tried with T-92 filter + boiling water? Their guide specifies this — worth a direct test.

## End-of-Coffee Workflow

After each coffee is finished, run through this checklist before starting the next:

- Review this document — did the extraction strategy behave as expected? Did anything new emerge?

- Update Archive Patterns if the coffee confirmed an existing pattern (add a data point) or revealed a new one.

- Update Roaster Reference if you learned something about this roaster's style that wasn't captured before.

- File the best brew in the app with a complete 'What I Learned' entry — specific, testable bullet points and a closing 'Extraction Strategy Confirmed' line. Note: office coffees do not go through the home inventory or Agtron workflow. Two separate inventories are maintained — home (full tracking: Agtron color, spreadsheet entry, bean cellar doses) and office (no color reading, no spreadsheet tracking). Only home coffees require the Agtron step at dose-out.

- Note brewer rotation — were you relying on the same brewer repeatedly? If so, plan to rotate next coffee.

# SECTION 4 — WBC REFERENCE

Reference layer derived from Chris's "World Brewers Cup Champion - Recipes and Extraction Taxonomy" research (18 finalists/champions across 2023-2025). The five-axis foundational framework + eight strategy families below describe how competition brewers think about extraction. Latent's live taxonomy (Section 1, Step 1d) intentionally folds these into a smaller, single-origin-friendly shape (5 strategies + 3 modifiers) — this section is the comprehensive reference for "what was the WBC competitor doing" lookups, not the live registry.

## Foundational Control Axes (5)

| **Axis**              | **Definition**                                | **Main Levers**                                          |
|-----------------------|-----------------------------------------------|----------------------------------------------------------|
| Extraction Intensity  | How much is extracted                         | grind, ratio, temp, water chemistry                      |
| Time Distribution     | When extraction happens                       | pours, pulse timing, immersion duration                  |
| Physical System       | Where/how extraction occurs in the bed        | geometry, layering, PSD, grind separation                |
| External Control      | Stabilizing or shaping the process externally | tools, flow devices, thermal handling                    |
| Output Selection      | Which parts of extraction are kept            | discarding early/late fractions, yield cutoff            |

Latent's live taxonomy maps onto axes 1 (Strategy) and partially onto axes 2 / 4 / 5 (Modifiers). Axis 3 (Physical System) is mostly blend-engineering and not in scope for single-origin home brewing.

## Core Strategy Families (8)

| **Family**                            | **Subtypes**                                                                                                  | **Definition**                                                                                                                              | **Representative**                                       | **Failure Mode**                              |
|---------------------------------------|---------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|-----------------------------------------------|
| Extraction Push (High-Yield Clarity)  | -                                                                                                             | Maximize extraction yield while preserving clarity. Fine grind, fast filters, high or stable temp, moderate-high ppm.                       | Savina Giachgia, Jackie Tran, Martin Wölfl               | Astringency, drying finish, loss of structure |
| Suppression Systems                   | -                                                                                                             | Intentionally limit extraction to avoid harshness while maintaining structure. Lower temp, coarser grind, low agitation.                    | Carlos Medina                                            | Naturals / co-ferments + slightly developed roasts |
| Time-Distributed Systems              | Pulse-based (Carlos), Parametric (George, Bayu), Selective Output (Escobar)                                   | Shape extraction by controlling timing or selecting portions of the curve. Fixed intervals, repeated pulses, programmable final phase.      | Carlos Medina, George Peng, Bayu Prawiro, Carlos Escobar | Over-complexity, timing sensitivity           |
| Structural Systems                    | Dual grind (Luca), Layered bed (Wataru), Pre-brew alignment (Elysia), Ratio-engineered blends (Andrea), Roast-based structure (George 2025) | Engineer the inputs or physical structure before/during brewing. Multi-grind, layering, blend ratio, roast-level differentiation.           | Luca Croce, Wataru Iidaka, Elysia Tan, Andrea Batacchi   | Disjointed cup, poor integration              |
| Thermal Systems                       | Staged temp (Garam, Giacomo), Inverted temp (Ryan), Continuous blending (Tom)                                 | Use temperature actively to shape extraction. Multi-kettle workflows, temperature staging or inversion, cooling / aroma locking.            | Giacomo Vannelli, Tom Hutchins, Ryan Wibawa              | Over-engineering, instability                 |
| Flow / Stability Systems              | -                                                                                                             | Stabilize flow and reduce variability. Melodrip / drip assist, needling / bed prep, flat-bottom or controlled geometry.                     | Martin Wölfl, Jackie Tran (partial)                      | Over-smoothing, reduced character             |
| Immersion Systems                     | -                                                                                                             | Use immersion to equalize extraction across components. Switch-style, multi-stage immersion, low agitation.                                 | Ryan Wibawa, Charity Cheung                              | Flat or muted cup, loss of separation         |
| Hybrid Systems                        | Sequential (Garam), Immersion staging (Ryan), Parametric (Bayu), Phase-mapped (Justin)                        | Combine percolation and immersion in distinct phases to assign different extraction roles. Hybrid brewer, phase-mapped extraction.          | Garam Victor Um, Ryan Wibawa, Bayu Prawiro, Justin Bull  | Poor phase balance, transition instability    |

## How the families map onto Latent's live taxonomy

| **WBC family**           | **Latent slot**                                       |
|--------------------------|-------------------------------------------------------|
| Extraction Push          | Strategy: Extraction Push (clean coffees)             |
| Suppression Systems      | Strategy: Suppression                                 |
| Time-Distributed (Selective Output sub-type) | Modifier: Output Selection         |
| Time-Distributed (other sub-types — Pulse, Parametric)        | Implicit in pour structure; not a separate slot |
| Structural Systems       | Out of scope (single-origin context)                  |
| Thermal (Inverted)       | Modifier: Inverted Temperature Staging                |
| Thermal (Aroma capture sub-type) | Modifier: Aroma Capture                       |
| Flow / Stability         | Implicit (Melodrip is a primary tool, not a strategy) |
| Immersion                | Modifier: Immersion (SWORKS valve-modulated; Hario Switch when experimented) |
| Hybrid                   | Modifier: Immersion captures the SWORKS-as-percolation-immersion-hybrid case; true sequential hybrid out of scope |

## Consciously not pursuing

Techniques present in the WBC dataset that Chris has decided not to pursue, with the reason. This list exists so the decision is legible and the next "should we do this?" question has a recorded answer.

- **Mid-pour temperature blending** (Tom Hutchins 2024). Two kettles at different temps, mixed in real time during the pour. Over-engineered for home/office context; hardware overhead is significant for marginal gain.
- **Roast-based structuring on single origin** (George Peng 2025). One coffee roasted at three different end temps, blended in the brewer. Latent does roast (Sprint 1k+ self-roasted track) but the structural-blending application is parked — too many variables to dial in without competition pressure.
- **Mesh-then-paper transitions** (Garam Victor Um 2023). Switch filter type mid-brew. Requires brewer geometry not currently in the equipment set.
- **Solubility alignment via roast matching** (Elysia Tan 2024). Match roast development across multiple coffees in a blend so they extract together. Blend-specific; no single-origin transfer.
- **Layered bed by component** (Wataru Iidaka 2024). Spatially place different coffees within the bed. Blend-specific.
- **Triangle variable thinking** (Bayu Prawiro 2025). Treat agitation / flow / contact time as linked variables that move together. Useful as a mental model but already implicit in Chris's grind-vs-valve thinking on the SWORKS bottomless dripper. Not a new technique, just a name for what he already does.

