> **Provenance + status.** Chris's long-form thinking on what constitutes the Latent
> sourcing targets and why, supplied 2026-06-19 during the producers sourcing-priority
> sprint. **Treat as prototype, not canon** (Chris's framing). The sprint shipped only a
> simplified slice: the `sourcingPriority?: { bucket; rationale }` registry field +
> Priority targets tab (bucket = the S/A/B/C/D action ranking below; the numeric
> fit/buy scores, riskFlags, and the separate Type axis were deferred). This doc is the
> source artifact for the deferred **canon-reconciliation grilling pass** that folds the
> model into `strategy.md § 7` + `CONTEXT-taste § Sourcing philosophy` (roadmap On deck:
> "Producer sourcing-priority canon pass"). Reproduced as authored.

# Latent Producer Sourcing Targets

## Summary

Latent's sourcing target is not "the best coffee producer" in a generic sense. The target is a producer whose coffees are likely to carry the Latent cup before roasting or brewing touches them: distinctive, multilayered, clean enough to stay legible, and able to evolve across the hot-to-warm-to-cool drinking arc.

The sourcing ranking should therefore prioritize producers with a clear production system, not merely famous names or beautiful flavor notes. The strongest producers are those whose process, cultivars, terroir, drying, and track record suggest that complexity is already latent in the green coffee.

The ranking should narrow from:

1. all known producers
2. to producers with credible process signatures
3. to producers with distinctive cultivars and high-elevation / high-quality production contexts
4. to producers with evidence of layered, legible output
5. to producers with reachable lots or useful roaster validation
6. to producers worth buying now, watching, or enriching

## North Star

Source for the Latent cup.

The ideal coffee is layered-evolving: distinctive, multilayered, and in motion. It should change across the temperature arc and across the structural arc of attack, body, and aftertaste. The anti-target is one-dimensional coffee, whether clean and flat or loud and funky.

The sourcing goal is to find beans where this complexity already exists. Roasting and brewing should reveal the latent complexity, not create it artificially.

## What I Am Looking For

### 1. Process signature

This is the hard gate.

The best producers have a repeatable, intentional production system. They are not only growing coffee; they are designing green coffee through controlled processing, drying, cultivar selection, and sensory intent.

Target signals:

- slow-controlled drying
- dark-room or cold-room drying
- dry fermentation
- oxidative processing
- controlled naturals
- clean carbonic maceration
- clean anaerobic washed
- mossto / mosto washed
- hybrid washed
- thermal shock, only when the cup stays legible
- yeast or co-ferment, only when the output avoids artificial one-note loudness

The best shorthand field for this is `processSignature: string`.

Example:

High-altitude Panama natural Gesha system built around slow controlled drying, aromatic clarity, and layered tropical-floral expression.

### 2. Layered output, not process novelty

The target is not "weird process." The target is legible complexity.

A producer should rank highly when their coffees show:

- multiple flavor layers
- temperature movement
- aromatics plus structure
- fruit plus florality
- sweetness plus acidity
- clarity without thinness
- intensity without muddiness
- process character integrated into the coffee rather than sitting on top

A producer should rank lower when their coffees tend toward:

- boozy liqueur
- vanilla / candy / dessert notes as the main event
- one-note fruit bomb
- heavy fermentation without clarity
- process novelty without cultivar, terroir, or drying support
- clean but flat washed coffee

### 3. Distinctive cultivar base

Cultivar is not the only gate, but it is an important distinctiveness floor.

High-priority cultivars:

- Gesha
- Sidra
- Chiroso
- Typica Mejorado
- Mokkita / Mokka
- Pacamara
- Sudan Rume
- Java
- Pink Bourbon
- Ombligón, selectively
- Laurina / Eugenioides, usually as sweetness or structure studies rather than default targets

The ranking should favor producers who have both distinctive genetics and a clear process system.

### 4. High-altitude / high-density prior

Elevation is not a hard gate, but it is a strong prior.

Ideal zone:

- 1700-2100m as the main competition-quality range
- 1900-2100m especially attractive for Gesha and high-clarity lots
- 2100m+ attractive, but roast-sensitive
- below 1500m only with exceptional producer, cultivar, or process evidence

Density and moisture data should become positive ranking signals when available.

### 5. Producer reputation and roaster validation

At my current buying scale, I often cannot interrogate processing protocols directly. So the ranking should treat reputation and roaster validation as useful weak signals.

Strong signals:

- repeat WBC usage
- Cup of Excellence / auction presence
- repeated sourcing by roasters I trust
- sourced by multiple high-signal roasters
- lots appearing across different roasters with consistent sensory identity
- producers already successful in my own brew or roast archive

Roaster references are especially useful for target-only producers with no personal brew data yet.

### 6. Reachability

A producer only matters operationally if I have some path to access.

Best channels:

- direct-from-farm 1kg-ish sample bags
- competition-grade importers
- specialty importers with small-format lots
- auction sample sets
- trusted roaster green releases
- relationship-gated allocations

A world-class producer with no reachable channel should still appear in the target roster, but should rank lower for "buy now" than a slightly less famous producer with a reachable 1-3kg lot.

## Target Producer Types

### Type A — Apex anchors

These are the highest-priority producers.

They combine:

- elite reputation
- clear process signature
- distinctive cultivars
- high-elevation or high-quality terroir
- strong roaster validation
- evidence of layered, temperature-evolving cups
- some plausible access path

Examples of the category:

- Lamastus / Elida / El Burro
- Altieri
- Garrido / Mama Cata
- Janson
- Finca Deborah / Jamison Savage
- Pepe Jijón / Finca Soledad
- CGLE
- Mikava / Santuario
- Wilton Benitez / Granja Paraíso 92, with risk controls

### Type B — Process-learning targets

These producers are useful because they teach how process, cultivar, and roast interact.

They might not be automatic apex producers, but they are high-information.

Target examples:

- thermal shock producers
- CM Gesha producers
- mossto washed producers
- cold-fermented natural producers
- controlled anaerobic washed producers
- producers working with Sidra, Chiroso, Sudan Rume, Java, Pacamara, or Typica Mejorado

These should rank highly when the lot has a clear learning job.

### Type C — Reference clarity producers

These producers help calibrate clean, floral, transparent roasting and brewing.

They are important, but not always urgent, because clean clarity Gesha is overrepresented in specialty coffee relative to my personal apex.

Target examples:

- washed Panama Gesha
- Bolivia Takesi-style washed Gesha
- clean Ethiopia 74158 / Gesha Village-style coffees
- washed Chiroso / Sidra / Sudan Rume

These should stay in the portfolio every few buying cycles for calibration.

### Type D — Value / roast-practice producers

These producers are not apex targets. They exist to support skill development.

Target examples:

- value washed Bourbon / Caturra
- lower-cost Brazil / Guatemala / Honduras lots
- stable coffees suitable for repeated dev ladders
- lots cheap enough to burn through on rest-curve and roast-curve tests

These should be ranked separately from apex producers so they do not pollute the main sourcing target list.

## How to Narrow the Producer List

### Step 1 — Remove low-signal skeletons from the default ranking

Keep skeleton producers in the database, but do not rank them highly until enriched.

A skeleton producer needs at least one of:

- known process style
- known cultivars
- known region / elevation
- roaster references
- importer / exporter path
- personal brew or roast evidence

Otherwise mark `sourcingStatus: "needs_enrichment"`.

### Step 2 — Assign relationship state

Each producer should have one relationship state:

```
relationshipState:
  | "target_only"
  | "brewed_purchased"
  | "sourced_green"
  | "self_roasted"
  | "resolved_reference"
```

This prevents the ranking from confusing three different kinds of evidence.

A producer with zero brews but strong registry signal, like Wilton Benitez, should still rank as a sourcing target. A producer with personal roast evidence, like Milton Monroy, should rank with higher evidence confidence.

### Step 3 — Score process signature first

Ask:

- Does this producer have a clear system?
- Is the system repeatable?
- Is it designed around controlled complexity?
- Does it lean reveal-engineering or inject-engineering?
- Does the output appear layered and legible?

No clear process signature means the producer should rarely be a top sourcing target.

### Step 4 — Score fit to the Latent cup

Ask:

- Are the coffees likely to be layered-evolving?
- Do they show aromatics, sweetness, acidity, and structure?
- Do tasting notes suggest movement across temperature?
- Are the notes varied rather than monotone?
- Is clarity present without becoming thin?
- Is intensity present without becoming artificial?

This should matter more than generic cup score.

### Step 5 — Score cultivar and lot role

Ask:

- Is this producer working with the cultivars I care about?
- Does the producer offer a coffee that fills a portfolio role?
- Is this a reference clarity lot, fruit-tea expression lot, process-learning lot, roast-learning hybrid, or value-practice lot?

Do not buy "interesting" coffees. Buy coffees with jobs.

### Step 6 — Score producer evidence

Evidence sources, strongest to weakest:

1. my own resolved roast learning
2. my own green lot and cupping data
3. my own purchased brew archive
4. repeated trusted roaster sourcing
5. WBC / competition recurrence
6. COE / auction signal
7. importer description
8. registry-only reputation

Target-only producers are allowed, but their confidence score should be lower until personal evidence exists.

### Step 7 — Score access

Ask:

- Is there a direct-from-farm option?
- Is there a 1kg or 1-5lb format?
- Is the producer reachable through Forward, Untold, Jah, Showroom, Forest, CoTrade, Falcon, or another trusted channel?
- Is there a sample set?
- Is the lot only accessible through full auction quantities?

Access should not define producer quality, but it should define buy priority.

### Step 8 — Apply risk penalties

Penalize:

- heavy anaerobic natural with boozy descriptors
- undisclosed co-ferment
- yeast-inoculated coffee marketed around dessert notes
- low elevation without exceptional producer / process evidence
- process novelty without cultivar or drying quality
- one-dimensional flavor notes
- no roaster validation
- no access path
- too much overlap with inventory already owned

## Proposed Ranking Model

Use two scores, not one.

### 1. Producer Fit Score

This answers: "How aligned is this producer with the Latent target?"

Producer Fit Score / 100:

- Process signature — 25
- Layered-evolving output signal — 20
- Producer track record — 15
- Cultivar fit — 15
- Terroir / elevation / density — 10
- Drying quality — 10
- Personal taste evidence — 5

### 2. Buy Priority Score

This answers: "Should I pursue this producer now?"

Buy Priority Score / 100:

- Producer Fit Score — 40
- Specific lot attractiveness — 20
- Portfolio need — 15
- Access / channel quality — 10
- Evidence confidence — 10
- Price / format fit — 5

This distinction matters. A producer can be a top-tier Latent fit but low buy priority if the current inventory is overfull or the only available lot is the wrong process.

## Ranking Buckets

### S Tier — Actively pursue

Definition:

- apex-aligned process signature
- strong cultivar fit
- strong evidence or roaster validation
- reachable lot or likely upcoming access
- fills a real portfolio role

Action: Buy small-format lots when they appear. Track channels and roasters closely. Add direct contact if available.

### A Tier — Watchlist

Definition:

- strong producer fit
- missing access, confidence, or current portfolio need

Action: Watch roaster references, importer drops, auctions, and direct-farm releases. Enrich registry fields.

### B Tier — Learning target

Definition:

- useful for process, cultivar, or roast learning
- not necessarily apex
- buy only when the lot has a clear experiment job

Action: Buy selectively. Assign learning role before purchase.

### C Tier — Reference / calibration

Definition:

- useful for maintaining clean coffee skill
- not urgent for Latent's personal apex

Action: Keep one in rotation every few cycles. Do not overbuy.

### D Tier — Avoid / deprioritize

Definition:

- one-dimensional
- too boozy
- too artificial
- too low-information
- no clear process signature
- weak access
- too redundant with existing inventory

Action: Hide from active sourcing views unless needed for enrichment.

## Practical Producer Card Fields

Each producer in the ranking should show:

```
name
farmName
country
region
producerSystem
processSignature
tier
relationshipState
sourcingBucket
producerFitScore
buyPriorityScore
primaryCultivars
processingStyleTags
dryingMethod
typicalFlavorProfile
knownFor
roasterReferences
importers
exporters
contact
evidenceSummary
riskFlags
nextAction
```

Example evidence summary: 4 purchased brews across 3 roasters; no self-roasted lots.

Example next action: Watch for Typica Mejorado / Sidra green releases in 1-3kg format.

## Current Buying Posture

The current posture should be conservative.

The inventory is already broad and overfull, so the ranking should not create pressure to buy every aligned producer. It should help separate:

- producers worth knowing
- producers worth watching
- producers worth buying now
- producers worth buying only when a specific lot appears

The default action should be: Roast down the backlog. Buy only genuine apex standouts or unusually useful learning lots.

## Final Rule

The sourcing ranking should not ask: Is this producer famous?

It should ask: Does this producer run a system likely to create layered-evolving green coffee, and do I have enough evidence or access to make them actionable?

That is the producer target.
