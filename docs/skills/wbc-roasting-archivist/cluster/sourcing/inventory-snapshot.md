# Latent Inventory - Lane-Lens Snapshot

**As of 2026-06-18 (38 lots in_inventory). Refresh on inventory change** (new green purchase, lot close-out, archived lot) - the refresh mandate lives HERE, not in the framework doc: [sourcing/strategy.md](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md) stays slow; this sibling is the fast half (split out 2026-07-08, pruning case 012).

This is the operational scoreboard - the abstract framework in [sourcing/strategy.md](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md) folded against actual current Latent inventory. The **live per-lot state is the DB**: `list_green_inventory` is the authoritative in_inventory roster + roast-queue rank (`get_bean_pipeline` for a single lot's full arc); the taxonomies + the roasting-historian cluster (active-lots / learnings) hold per-lot knowledge. What lives here is the only inventory view the DB can't hold: the **lane mapping** (`green_beans` has no lane column) + the **portfolio gap analysis** + the **next-buy posture**.

> **2026-06-18 inventory refresh (full turnover + Forward Panama set):** the inventory has turned over almost completely since the 2026-06-04 snapshot. The old 6-lot active set (Mount Elgon, El Paraíso Red Plum, Bukure, Wush Wush DRD, Gesha Clouds, Sudan Rume Hybrid Washed) rotated out, and a large new intake landed via the Inventory -> Claude Code project (Phases 1/B/2 shipped 2026-06-17): **38 lots now in_inventory**. The live working set + authoritative per-lot roast-queue rank live in `list_green_inventory` (read it for the current order); the lane mapping below is the sourcing-lens summary. Net effect on sourcing: **most of the named next-buy gaps are now filled** (Sidra, Chiroso, Pacamara, Pink Bourbon, Laurina, value-practice), and the inventory is **overfull** - the next-buy posture flips from "fill gaps" to "roast down the backlog; buy only genuine standouts."

## Active inventory by lane (as of 2026-06-18, 38 lots)

The center of gravity has shifted to **high-end Panama Gesha** - the apex direction ([CONTEXT-taste.md](CONTEXT-taste.md)) and the Oct-2026 Panama push materializing early. Grouped by the five-lane model ([strategy.md § 10](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md)); `list_green_inventory` holds the authoritative per-lot rank.

**Calibration clarity + Fruit-tea expression (high-end Gesha / distinctive variety - the apex lane):**
- La Palma y El Tucan Sidra Natural B-068 (Colombia, Sidra) - roast-queue #1; first Sidra, fills the named variety gap.
- Finca Deborah Geisha Natural 'Interstellar' (Panama, Jamison Savage) - #3.
- Janson Pacamara Natural Hacienda 491 (Panama) - #4.
- Caminos del Inka Anaerobic Washed Geisha (Peru) - soon band; anaerobic-washed = cleaner than AN.
- **5 Forward Coffee Panama lots (purchased 2026-06-18, single 1kg range-finders, in transit, queue 90 until they ship):** HiU Los Lajones Geisha Natural Bambu 8B (the named "more like the HiU Los Lajones" benchmark, Forward 93, aroma scored 10/10); Lamastus El Burro Geisha Natural #16 (apex-roster master producer, $160 value workhorse); Black Moon Chiroso Natural #75 (Hunter Tedman / Black Moon Farm - fills the named Chiroso gap); Iris Estate Geisha 'Nirvana' (nitrogen-macerated, red-wine cool turn); Finca Deborah Geisha Hybrid 'Elipse' (natural nitrogen + washed finish, 2024 WBC 1st place). HiU Los Lajones producer is net-new, queued for taxonomy review.

**Process learning (engineered naturals / anaerobics):**
- Fazenda Um Pink Bourbon Dark Room Natural (Brazil) - roast-queue #2; El-Paraíso-style controlled drying.
- El Paraíso Ginger Castillo K-01 (Colombia, washed + thermal shock + ginger co-ferment) - soon; **Lane C anti-target watch** (co-ferment).
- Daterra Yellow Aramosa Anaerobic Natural, Carmo SL28 Anaerobic Natural, Carmo Pacamara Anaerobic Natural (Brazil) - soon band; production-scale anaerobic-natural studies.
- Daterra Laurina Natural (Brazil) - soon; sweetness / structure component.

**Roast-learning study sets (deliberate segmentation experiments):**
- **Uganda Mountain Harvest (9 x 100g):** Rwenzori variety segmentation (Geisha / RAB C15 / Batian) + station/process segmentation (Washed Dry-Ferment, Sironko pure-natural / NAF / NAF+PK1-yeast, Kajere Washed+PK1 / Washed-Anaerobic). A matched-set variety + process study; off the WBC map but high-information.
- **Vietnam Liberica body study (3 lots):** 96B Liberica Anaerobic (5kg baseline), QT Liberica/Excelsa Anaerobic Natural (100g), Que Liberica Honey (5kg, deferred behind the 96B baseline). Off-portfolio body / variety exploration.

**Value / roast-practice:**
- PNG Mong Hagen WHP Natural (789), Marcelo Assis Bioma Peaberry Natural (788), Bioma Natural blend (782), Salomon Estela El Pino Marshell Natural (Peru, 796) - sub-premium naturals for cheap dev-ladder / rest-curve practice.

**Deep-frozen preservation (out of active queue, priority 90):**
- CoE / Taza-Dorada samples held for preservation: El Salvador La Bendicion Pacamara Honey, Ethiopia Tamru 74158 Natural, Peru Campo Verde Geisha+Bourbon Washed, Ecuador Aurum Geisha Natural, Ecuador Cofradia Sidra Bourbon CM, Ecuador Cruz Loma Typica Mejorado Honey. (Mexico CoE'25 Don Gustavo Washed sits in the active soon band, not the freeze set.)

## Recently closed lots

Per-lot sourcing retrospectives live with the lots themselves and are not duplicated here: [docs/roasting/archive.md](docs/roasting/archive.md) (closed-lot archive) + the [roasting-historian learnings capsules](docs/skills/roasting-historian/cluster/learnings/).

## Portfolio gap analysis (Latent-adjusted, 2026-06-18)

Mapping current inventory against the five-lane portfolio model in [strategy.md § 10](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md), using the Latent-adjusted priority. The headline: **the 2026-05-09 -> 2026-06-04 gaps (Mandela replacement, value coffee, Chiroso, Sidra) are closed.** The inventory's defining feature now is **breadth and overfullness** (38 lots), not coverage holes.

| Lane | Currently in inventory | Gap (Latent-adjusted) |
|---|---|---|
| **Calibration clarity** | Heavy: Deborah x2, Janson, Los Lajones, El Burro, Iris, Caminos Gesha, + frozen Geshas | **Over-covered**, not under. Clean *washed* Panama Gesha (roasting-skill upkeep) is the only thin spot, and it is the over-indexed-in-specialty lane - not urgent. |
| **Fruit-tea expression** | Los Lajones + El Burro natural Geshas, Sidra, Chiroso | Filled and then some. No gap. |
| **Process learning** | Pink Bourbon DRD, Ginger Castillo, 3x Brazil anaerobic, Iris/Elipse nitrogen, Uganda study set | Deep. No gap; watch the Lane-C co-ferment (Ginger Castillo) at the cup. |
| **Roast-learning hybrids** | Chiroso, Pacamara x2, Uganda variety-segmentation, Liberica study | Mandela / CGLE 17 / Sudan Rume no longer active, but the slot is well-covered by the Uganda + Pacamara studies. Low-priority. |
| **Value / roast-practice** | PNG Mong, Bioma x2, El Pino Marshell | Filled. Real capacity for cheap dev-ladders now exists. |

## Best next sourcing moves

The posture has flipped from "fill gaps" to **"stop buying, start roasting."** With 38 lots in_inventory and every named gap filled, the next-buy bar is high:

1. **Roast down the backlog first.** The binding constraint is no longer inventory coverage - it is roast throughput against 38 lots. Most lanes are over-covered.
2. **Only buy genuine apex standouts** - a lot that clears the temperature-swing / process-signature filter AND is distinctly better than what is already held (the 2026-06-18 Forward Panama set was exactly this test: the named Los Lajones benchmark + the Chiroso gap-fill + the apex-roster El Burro). The single-1kg range-finder posture (breadth over scaled batches) is the current deliberate mode while the apex direction is still being explored.
3. **Oct-2026 Panama push** still stands as the deliberate origin-trip buy - "more like the HiU Los Lajones," plus the non-Panama portability pull - but as a *targeted* trip, not backlog growth.
4. **Clean washed Panama Gesha** remains the only thin lane (roasting-skill upkeep), and it is the over-indexed-in-specialty lane - schedule for a future cycle, not urgent.

## Cross-references

- **Sourcing framework:** [sourcing/strategy.md](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md) - § 10 lanes, § 7 buckets, § 9 filter cascade, § 0 philosophy.
- **Canonical producer roster:** [docs/taxonomies/producers.md § Sourcing priority](docs/taxonomies/producers.md).
- **Live per-lot state:** `list_green_inventory` (roster + rank) + `get_bean_pipeline` (single-lot arc); per-lot knowledge in the [roasting-historian cluster](docs/skills/roasting-historian/cluster/active-lots/).
