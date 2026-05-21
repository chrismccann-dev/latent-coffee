# Coffees That Confirmed Hybrid

*Coffee Research · Latent · Brewing Historian cluster · by-strategy*

**Strategy definition:** see [BREWING.md § Axis 1 - Extraction Strategy](../../../../../../BREWING.md#axis-1---extraction-strategy) for the canonical Hybrid definition (used when the brew is structured around phase boundaries with different jobs assigned to each phase, rather than a single extraction logic running throughout). Hybrid is the 6th first-class strategy (promoted v8.4, 2026-05-06) and ships with 5 sub-forms: Sequential / Phase-Mapped / Selective Bloom / Intensity-Clarity Split / Temperature-Staged. Hardware: Hario Switch at home (canonical) or SWORKS Bottomless Dripper at office when valve transitions are doing strategic work.

Migrated from [BREWING.md § Cross-Coffee Insight Layer > Coffees That Confirmed Hybrid](../../../../../../BREWING.md#coffees-that-confirmed-hybrid) in Wave 2 PR 2 (2026-05-26) per [ADR-0011](../../../../../adr/0011-composable-sub-skills-architecture.md).

---

Hybrid was promoted to the 6th first-class strategy in v8.4 (2026-05-06). Three brews previously archived as "Balanced Intensity + Immersion modifier" reclassified to **Hybrid (Sequential)** at promotion - all three are SWORKS slow/slow/open recipes (closed bloom + restricted main pours + Dial 7 open finish "to rinse rather than steep") that fit the Sequential sub-form's "immersion phase then percolation phase, each doing one job" definition. The 4 other sub-forms (Phase-Mapped, Selective Bloom, Intensity-Clarity Split, Temperature-Staged) are empty at promotion - candidate experiments below.

Confirmed Hybrid (Sequential):

- *Picolot Comp Edition Janson Green-Tip Gesha Anaerobic 1010*. SWORKS Bottomless Dripper. Dial 0 closed bloom (20s), Dial 5 restricted Pours 1-2 (aromatic-extraction window), Dial 7 open final pour (rinse, not steep). Slow/slow/open inversion of Picolot's usual fast/fast/slow house structure - the inversion is what makes this a Sequential Hybrid rather than a standard Balanced Intensity. The Dial 7 finish is doing a different job from the Dial 5 main pours: cutting tannic/over-extracted finish without compromising body that the immersion-like restricted main pours built. Reference recipe for heavy yeast-anaerobic naturals on the SWORKS at the office.

- *Sebastian Ramirez White Honey Gesha (Moonwake)*. SWORKS slow/slow/open same as Janson 1010 - restricted main pours through immersion-like contact window + opened finish to drain. Reference confirmed across two yeast-inoculated Geshas (this lot + Janson 1010), suggesting the Sequential Hybrid template is the right fit for SWORKS yeast-inoculated lots when contact-time control matters more than intensity tuning.

- *Finca La Reserva Gesha Anaerobic Honey (Colibri)*. Same SWORKS slow/slow/open template - Dial 0 closed bloom, Dial 5 restricted Pour 1, crack to Dial 6 (Half-Open) once bed drops in Pour 2. Aromatic floral extraction (jasmine, lavender) preserved by the immersion-like contact phase; sweetness integration via the controlled drawdown finish. Three data points now suggest this is the canonical Sequential Hybrid template for the SWORKS: anaerobic-natural / yeast-anaerobic-honey / anaerobic-honey lots all converge on the same valve sequence.

Candidate (untested) - other sub-forms:

- **Hybrid (Phase-Mapped) re-framing of the Tamarind reference.** Take the existing *Moonwake El Eden Tamarind Washed* Full Expression recipe (Dial 5 through main pours, crack to Dial 6 midway through Pour 3) and re-document it as Phase-Mapped: Pour 1 = saturation, Pour 2 = body building (near-immersion), Pour 3 transition = clarity finish. Same execution; sharper framing. Hypothesis: explicit role-mapping at brief time surfaces failure modes (premature transition → thin body) earlier than implicit valve-state framing did. Compare iteration efficiency on the next heavy co-ferment lot.

- **Hybrid (Selective Bloom) on aromatic Clarity-First lot.** Eline Ferket 2025 pattern. Bloom liquid separated from main brew, evaluated independently, recombined or discarded. Highest-leverage candidate: Esmeralda climate-controlled natural or clean washed Gesha where bloom likely carries different aromatic character from main extraction.

- **Hybrid (Intensity-Clarity Split) on heavy co-ferment lot.** Goal: structured extraction without muddiness. Immersion phase builds body, percolation phase recovers clarity. Phase order matters (intensity first). Candidate: next heavy anaerobic washed Colombian Gesha (Jeferson Motta family).

- **Hybrid (Temperature-Staged) on a coffee that reads thin at 95°C and bitter at 96°C.** Phase boundary coincides with temperature change. Distinct from a standalone Inverted Temperature Staging modifier because the temperature change is bound to the phase boundary.

> The Picolot Emerald PL#015 Mokka Natural reference recipe is **NOT classified as Hybrid** despite its Dial 0 / Dial 7 / Dial 7 / Dial 5 fast/fast/slow valve work. The bloom-immersion phase and the slow restricted finish are recipe details (already documented in Pour Structure / What I Learned), not phase boundaries that change extraction logic mid-brew - the brew is fundamentally Full Expression at fast-flow extraction parameters with a brief restricted finish to round out the tail. Strategy classification is about intent (Full Expression = push extraction on a clean coffee) rather than about whether any single valve transition exists.
