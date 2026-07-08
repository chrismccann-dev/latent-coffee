# Brewer (Dripper) Archive — Not-Owned Candidates

Preserves the **not-owned** brewer entries that used to live inline in
[docs/skills/brewing-equipment-expert/cluster/brewers.md](docs/skills/brewing-equipment-expert/cluster/brewers.md).
Split out 2026-07-08 (pruning case 010, on the case-004 ownership-axis
template) so the live equipment registry loads only what Chris actually owns.

**Do NOT load this file for live brewer selection.** The brewing expert
selects from the owned registry in `brewers.md`. Use this archive only when
the operator explicitly asks about a not-owned brewer, or buys one and wants
it promoted.

`lib/brewer-registry.ts` remains the full canonical validator for **all** 47
brewers (owned + not-owned), so every entry below still resolves for
`brews.brewer`. This archive is the *prose* home for the 34 not-owned rows —
the doc↔registry mirror is preserved across the two doc files. All aliases in
`brewers.md` § Aliases target owned brewers, so no alias resolution touches
this file.

**Promotion procedure** (a not-owned brewer enters inventory): set
`owned: true` on its `lib/brewer-registry.ts` row, move the entry from here
into `brewers.md` under its geometry group, add Location + Primary use case
lines, and remove it from this archive.

---

## Cone filter drippers

### Brewista Tornado

- Manufacturer: Brewista
- Paper type: Conical (Cafec Abaca+ or folded V60)
- Dose size: 10g to 25g
- Bed geometry: Conical / medium
- Bypass profile: Medium
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Clarity cone
- Accessories: Drip tray base

### Cafec Deep27

- Manufacturer: Cafec
- Paper type: Conical (Cafec Abaca+ / V60)
- Dose size: 10g to 15g
- Bed geometry: Conical / very deep
- Bypass profile: Medium
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Clarity cone
- Accessories: None

### Cafec Deep45

- Manufacturer: Cafec
- Paper type: Conical (Cafec Abaca+)
- Dose size: 15g to 25g
- Bed geometry: Conical / deep
- Bypass profile: Medium
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Clarity cone
- Accessories: None

### Cafec Deep45 Arita Pro

- Manufacturer: Cafec
- Paper type: Conical (Cafec Abaca+)
- Dose size: 15g to 25g+
- Bed geometry: Conical / deep
- Bypass profile: Medium
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Clarity cone
- Accessories: None

### Cafec Flower

- Manufacturer: Cafec
- Paper type: Conical (V60 01-02)
- Dose size: 10g to 25g
- Bed geometry: Conical / medium
- Bypass profile: Medium
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Clarity cone
- Accessories: None

### Chemex

- Manufacturer: Chemex
- Paper type: Square paper folded cone
- Dose size: 15g to 25g+
- Bed geometry: Conical / deep
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Paper-limited
- Agitation tolerance: Low
- Brew archetype: Clarity cone
- Accessories: None

### Hario Alpha

- Manufacturer: Hario
- Paper type: Conical (V60 02)
- Dose size: 10g to 25g
- Bed geometry: Conical / medium
- Bypass profile: Medium
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Clarity cone
- Accessories: None

### Hario Flow

- Manufacturer: Hario
- Paper type: Wave (Kalita 155)
- Dose size: 15g to 25g
- Bed geometry: Flat / shallow
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Stability flat
- Accessories: None

### Hario Mugen

- Manufacturer: Hario
- Paper type: Conical (V60 02)
- Dose size: 15g to 25g
- Bed geometry: Conical / deep
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Low
- Brew archetype: Clarity cone (low bypass variant)
- Accessories: None

### Hario Suiren

- Manufacturer: Hario
- Paper type: Conical (V60 02)
- Dose size: 15g to 25g
- Bed geometry: Conical / open
- Bypass profile: High
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: High
- Brew archetype: Clarity cone
- Accessories: Custom rib attachments

### Hario Switch RAN

- Manufacturer: Hario
- Paper type: Conical (V60 02)
- Dose size: 15g to 25g
- Bed geometry: Conical / deep
- Bypass profile: Medium
- Flow control: Valve (immersion hybrid)
- Restriction source: Valve-controlled
- Agitation tolerance: High
- Brew archetype: Immersion hybrid
- Accessories: Switch base

### Hario V60 NEO

- Manufacturer: Hario
- Paper type: Conical (01-02)
- Dose size: 10g to 25g
- Bed geometry: Conical / medium
- Bypass profile: Medium
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Clarity cone
- Accessories: Switch base compatibility

### Hario W60

- Manufacturer: Hario
- Paper type: Conical + mesh hybrid (V60 02)
- Dose size: 15g to 25g
- Bed geometry: Hybrid / suspended bed
- Bypass profile: High
- Flow control: Hybrid (mesh + paper)
- Restriction source: Mesh + paper
- Agitation tolerance: High
- Brew archetype: Clarity cone (hybrid high bypass)
- Accessories: None

### Melodrip Colum

- Manufacturer: Melodrip
- Paper type: Conical (custom trimmed papers)
- Dose size: 10g to 25g
- Bed geometry: Conical / shallow
- Bypass profile: Low
- Flow control: Two-stage percolation
- Restriction source: Device-controlled
- Agitation tolerance: Low
- Brew archetype: Stability flat (two-stage assist)
- Accessories: None

### Normcore 2-in-1

- Manufacturer: Normcore
- Paper type: Conical (V60 01) + Wave (155)
- Dose size: 10g to 25g
- Bed geometry: Hybrid / variable
- Bypass profile: Variable (low–medium)
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Hybrid (variable archetype)
- Accessories: None

### Orea v4

- Manufacturer: Orea
- Paper type: Flat (Kalita 155-185) + Apex cone option
- Dose size: 10g to 25g
- Bed geometry: Flat / shallow
- Bypass profile: Low
- Flow control: Modular (base-dependent)
- Restriction source: Base-controlled
- Agitation tolerance: Medium
- Brew archetype: Stability flat (modular)
- Accessories: Negotiator / interchangeable bases

### Origami Pinn

- Manufacturer: Origami
- Paper type: Conical (V60 / 55°)
- Dose size: 10g to 25g
- Bed geometry: Conical / shallow
- Bypass profile: High
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: High
- Brew archetype: Clarity cone
- Accessories: Folding template

## Wave Filter Drippers

### Espro

- Manufacturer: Espro
- Paper type: Proprietary tall wave
- Dose size: 15g to 25g
- Bed geometry: Flat / medium
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Paper-limited
- Agitation tolerance: Medium
- Brew archetype: Stability flat
- Accessories: None

### Fellow Stagg X/XF

- Manufacturer: Fellow
- Paper type: Flat (Kalita 155/185)
- Dose size: 15g to 25g+
- Bed geometry: Flat / medium
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Stability flat
- Accessories: Funnel

### Kalita Mino

- Manufacturer: Kalita
- Paper type: Wave (185)
- Dose size: 15g to 25g
- Bed geometry: Flat / medium
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Stability flat
- Accessories: None

### Kalita Wave

- Manufacturer: Kalita
- Paper type: Wave (155-185)
- Dose size: 10g to 25g
- Bed geometry: Flat / medium
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Stability flat
- Accessories: None

### Orea Big Boy

- Manufacturer: Orea
- Paper type: Flat (custom large)
- Dose size: 25g+
- Bed geometry: Flat / shallow
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Stability flat
- Accessories: Negotiator

### Origami

- Manufacturer: Origami
- Paper type: Wave (Kalita 155-185)
- Dose size: 10g to 25g
- Bed geometry: Flat / shallow
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Stability flat
- Accessories: Base

## Trapezoid filter drippers

### Cafec Oval

- Manufacturer: Cafec
- Paper type: Trapezoid
- Dose size: 10g to 25g+
- Bed geometry: Trapezoid / medium
- Bypass profile: Medium
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Stability flat
- Accessories: None

### Clever

- Manufacturer: Clever
- Paper type: Trapezoid / folded cone
- Dose size: 15g to 25g+
- Bed geometry: Conical / deep
- Bypass profile: Low
- Flow control: Valve (immersion)
- Restriction source: Valve-controlled
- Agitation tolerance: High
- Brew archetype: Immersion hybrid
- Accessories: None

### Melitta

- Manufacturer: Melitta
- Paper type: Trapezoid
- Dose size: 10g to 25g+
- Bed geometry: Trapezoid / medium
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Low
- Brew archetype: Stability flat
- Accessories: None

### OXO

- Manufacturer: OXO
- Paper type: Trapezoid (Cafec 102)
- Dose size: 15g to 25g
- Bed geometry: Trapezoid / medium
- Bypass profile: Low
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Low
- Brew archetype: Stability flat
- Accessories: None

### Palatti Terra

- Manufacturer: Palatti
- Paper type: Trapezoid (Cafec 102)
- Dose size: 15g to 25g
- Bed geometry: Trapezoid / medium
- Bypass profile: Medium
- Flow control: Passive percolation
- Restriction source: Geometry-limited
- Agitation tolerance: Medium
- Brew archetype: Stability flat
- Accessories: Drip stand

## Round/circle filter drippers

### Aeropress

- Manufacturer: AeroPress
- Paper type: Disc (64mm)
- Dose size: 10g to 30g
- Bed geometry: Cylindrical / immersion
- Bypass profile: Low
- Flow control: Pressure / immersion
- Restriction source: Filter + pressure
- Agitation tolerance: High
- Brew archetype: Pressure / vacuum system
- Accessories: Prismo / Puckpuck

### Next Level LVL-10

- Manufacturer: NextLevel
- Paper type: Round filter
- Dose size: 25g+
- Bed geometry: Flat / deep
- Bypass profile: None (zero bypass)
- Flow control: Zero-bypass percolation
- Restriction source: Paper-limited
- Agitation tolerance: Low
- Brew archetype: Zero-bypass push
- Accessories: Drip assist lid

### Next Level Pulsar

- Manufacturer: NextLevel
- Paper type: Round filter
- Dose size: 15g to 25g+
- Bed geometry: Flat / deep
- Bypass profile: None (zero bypass)
- Flow control: Valve (immersion + percolation)
- Restriction source: Valve-controlled
- Agitation tolerance: High
- Brew archetype: Zero-bypass push (hybrid valve)
- Accessories: Filter discs / drip assist lid

### Orea Z1

- Manufacturer: Orea
- Paper type: Round (70mm Sibarist)
- Dose size: 10g to 25g
- Bed geometry: Flat / shallow
- Bypass profile: None (zero bypass)
- Flow control: Immersion hybrid
- Restriction source: Valve-controlled
- Agitation tolerance: High
- Brew archetype: Zero-bypass push
- Accessories: Immersion base / travel case

## Self-filtering drippers

### Fellow Duo

- Manufacturer: Fellow
- Paper type: None (metal mesh)
- Dose size: 15g to 25g+
- Bed geometry: Flat / medium
- Bypass profile: None
- Flow control: Valve (immersion)
- Restriction source: Metal mesh
- Agitation tolerance: High
- Brew archetype: Immersion hybrid
- Accessories: None

### Phin

- Manufacturer: Generic
- Paper type: None or optional round paper
- Dose size: 10g to 15g
- Bed geometry: Cylindrical / deep
- Bypass profile: None
- Flow control: Gravity / immersion
- Restriction source: Metal screen
- Agitation tolerance: Low
- Brew archetype: Immersion hybrid
- Accessories: None
