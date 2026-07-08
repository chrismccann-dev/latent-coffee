# Brewer (Dripper) Taxonomy — Owned

Authoritative authored content for the brewer canonical registry.
Mirror file: [lib/brewer-registry.ts](lib/brewer-registry.ts).

Total canonical brewers: **47** (13 owned + 34 not-owned).

This is the prose home for the **13 owned** brewers - what the Brewing
Equipment Expert selects from for live recipe construction. Not-owned
candidates live in
[docs/taxonomies/brewers-not-owned-archive.md](docs/taxonomies/brewers-not-owned-archive.md)
(promotion pool - do not load for live selection; split out in pruning case
010, 2026-07-08, on the case-004 ownership-axis template).
`lib/brewer-registry.ts` stays the full canonical validator for **all** 47
brewers (owned + not-owned), so every `brews.brewer` value still resolves.

Material axis (Glass / Porcelain / Ceramic) intentionally not carried — strips on canonicalize. Orea v3 vs v4 ambiguity defaults to v4.

## Cone filter drippers

### Chemex Funnex — Owned

- Manufacturer: Chemex
- Paper type: Proprietary cone filter
- Dose size: 5g to 15g
- Bed geometry: Conical / deep
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Paper-limited
- Agitation tolerance: Low
- Brew archetype: Clarity cone
- Accessories: None
- Location: Home
- Primary use case: I primarily use for small odd dose size (less than 15g)

### Hario Switch — Owned

- Manufacturer: Hario
- Paper type: Conical (V60 01-03)
- Dose size: 10g to 25g+
- Bed geometry: Conical / deep
- Bypass profile: Medium
- Flow control: Valve (immersion hybrid)
- Restriction source: Valve-controlled
- Agitation tolerance: High
- Brew archetype: Immersion hybrid
- Accessories: Switch base / Goodswitch lever
- Location: Home
- Primary use case: Full immersion control (valve-driven extraction)

### Hario V60 — Owned

- Manufacturer: Hario
- Paper type: Conical (all sizes)
- Dose size: 10g to 25g+
- Bed geometry: Conical / deep
- Bypass profile: Medium
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: High
- Brew archetype: Clarity cone
- Accessories: Hario drip assist
- Location: Home
- Primary use case: Peak clarity (high-bypass separation)

### Sibarist Brewing System — Owned

- Manufacturer: Sibarist
- Paper type: System-specific (CONE BS FAST / B3)
- Dose size: 15g to 25g
- Bed geometry: Conical / deep (precision-controlled)
- Bypass profile: None (perfect seal)
- Flow control: Passive percolation (system-controlled)
- Restriction source: Paper + system-integrated geometry
- Agitation tolerance: Medium
- Brew archetype: Clarity cone (system-level)
- Accessories: HALO – Minimalist holder for effortless filter handling from grinder to brew to disposal. No rinsing needed, no dripper adaptation required.
BREWING CHAMBER – Hand-blown borosilicate glass chamber that locks in heat an aromas. Its inner tower design minimizes heat loss and maximizes flavor capture.
EXCHANGER – Temperature-control insert for the BREWING CHAMBER. Fill with cold or warm water to adjust serving temperature while preserving aroma and flavor richness.
- Location: Home
- Primary use case: System-level precision clarity (eliminate fit variability and isolate extraction variables)

### UFO — Owned

- Manufacturer: UFO
- Paper type: Conical (custom 80°)
- Dose size: 10g to 25g
- Bed geometry: Conical / open
- Bypass profile: High
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: High
- Brew archetype: Clarity cone
- Accessories: Folding template / base
- Location: Home
- Primary use case: Extreme clarity (max bypass cone)

## Wave Filter Drippers

### April — Owned

(Standard April Brewer — passive flat percolation. The April Hybrid Brewer is a separate model with an immersion valve base; it's kept as its own entry directly below — Chris owns both. Don't conflate.)

- Manufacturer: April
- Paper type: Flat (April small / Kalita 155 compatible)
- Dose size: 15g to 25g
- Bed geometry: Flat / shallow
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Stability flat
- Accessories: None
- Location: Home, Office
- Primary use case: Mid-palate integration (round sweetness, controlled clarity)

### April Hybrid Brewer — Owned

(Acquired 2026-06-01. The standard April flatbed with an added immersion valve base — switch between immersion steep and flow-rate-controlled percolation. Same flat April / Kalita-155 paper bed as the standard April: April x Sibarist FAST or April Large. Separate model from the standard April above.)

- Manufacturer: April
- Paper type: Flat (April small / Kalita 155 compatible)
- Dose size: 15g to 25g
- Bed geometry: Flat / shallow
- Bypass profile: Low
- Flow control: Valve (immersion + percolation)
- Restriction source: Valve-controlled
- Agitation tolerance: Medium
- Brew archetype: Immersion hybrid
- Accessories: Immersion valve base
- Location: Home
- Primary use case: Flow-rate control + immersion/percolation switching (finer grinds, higher doses)

### Kalita Tsubame — Owned

- Manufacturer: Kalita
- Paper type: Wave (155)
- Dose size: 10g to 25g
- Bed geometry: Flat / medium
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Stability flat
- Accessories: None
- Location: Home, Office
- Primary use case: Neutral flat baseline (geometry reference)

### Orea v1-3 — Owned

- Manufacturer: Orea
- Paper type: Flat (Kalita 155-185)
- Dose size: 10g to 25g
- Bed geometry: Flat / shallow
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Stability flat
- Accessories: Negotiator
- Location: Home
- Primary use case: Clarity-balanced flat (low-bypass stability)

### Sworks Bottomless — Owned

- Manufacturer: Sworks
- Paper type: Wave / flat (Kalita 155-sized; any small flat-bottom paper except April Brewer paper)
- Dose size: 10g to 25g
- Bed geometry: Flat / shallow
- Bypass profile: Low
- Flow control: Valve (immersion hybrid)
- Restriction source: Valve-controlled
- Agitation tolerance: High
- Brew archetype: Immersion hybrid
- Accessories: Interchangeable bases
- Location: Home, Office
- Primary use case: Hybrid manipulation (open + valve control)

## Round/circle filter drippers

### Oxo Rapid Brewer (ORB) — Owned

- Manufacturer: OXO
- Paper type: Round (Aeropress-like)
- Dose size: 15g to 25g
- Bed geometry: Cylindrical / shallow
- Bypass profile: Low
- Flow control: Pressure / pump
- Restriction source: Pressure
- Agitation tolerance: High
- Brew archetype: Pressure / vacuum system
- Accessories: None
- Location: Home
- Primary use case: I primarily use for traveling for making "soup", especially good with very expressive/funky coffees

### Weber Workshops Bird — Owned

- Manufacturer: Weber Workshops
- Paper type: Round filter
- Dose size: 15g to 25g
- Bed geometry: Cylindrical / deep
- Bypass profile: None (zero bypass)
- Flow control: Vacuum / piston
- Restriction source: Vacuum-controlled
- Agitation tolerance: Low
- Brew archetype: Zero-bypass push
- Accessories: None
- Location: Home
- Primary use case: Max extraction pressure (zero-bypass vacuum)

### xBloom — Owned

- Manufacturer: xBloom
- Paper type: Flat (Kalita 155-185)
- Dose size: 15g to 25g
- Bed geometry: Flat / shallow
- Bypass profile: Low
- Flow control: Automated percolation
- Restriction source: Device-controlled
- Agitation tolerance: Low
- Brew archetype: Stability flat (automated)
- Accessories: xBloom Studio (smart base)
- Location: Home, Office
- Primary use case: Automated stability baseline (smart-controlled flat extraction)

## Aliases

Drift variants observed in legacy DB rows. Resolve to canonical via `BREWER_LOOKUP.canonicalize()`.

- `Orea Glass` → **Orea v4**
- `OREA Glass` → **Orea v4**
- `Orea Glass (open bottom, no negotiator)` → **Orea v4**
- `Orea (glass or porcelain)` → **Orea v4**
- `Orea (porcelain or glass)` → **Orea v4**
- `Orea Porcelain` → **Orea v4**
- `Orea porcelain` → **Orea v4**
- `April Glass` → **April**
- `April glass` → **April**
- `April Brewer (glass)` → **April**
- `April Glass Brewer` → **April**
- `April Brewer` → **April**
- `April Brewer Glass` → **April**
- `April Hybrid` → **April Hybrid Brewer**
- `April Hybrid Dripper` → **April Hybrid Brewer**
- `Hario V60 (glass)` → **Hario V60**
- `Hario V60 Glass` → **Hario V60**
- `Hario V60 glass` → **Hario V60**
- `Hario Switch (glass)` → **Hario Switch**
- `UFO Ceramic` → **UFO**
- `UFO Ceramic Dripper` → **UFO**
- `Brewer: UFO Ceramic` → **UFO**
- `Kalita Wave Tsubame 155` → **Kalita Tsubame**
- `SWORKS Bottomless Dripper` → **Sworks Bottomless**
- `Sworks Bottomless Dripper` → **Sworks Bottomless**
- `xBloom (flat-bottom percolation)` → **xBloom**

## Sources

- Chris's authored CSV: `Registry - Taxonomy - Drippers and filter papers - Drippers.csv` (49 rows, 80% comprehensive per Chris's framing).
- xBloom net-new entry: missing from CSV but Chris owns + 1 legacy brew used it.

## Changelog

- 2026-04-26 — initial registry built from authored CSV (Sprint 1f).
