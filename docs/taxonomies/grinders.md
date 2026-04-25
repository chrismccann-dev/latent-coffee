# Grinders

**Enforcement bar:** Strict (sprint 1k — enforcement lands with adoption)
**Canonical registry:** [lib/grinder-registry.ts](../../lib/grinder-registry.ts) (validation mirror)
**Last adopted:** 2026-04-25
**Adoption path:** Authored taxonomy (Chris, 2026-04-25). Per-setting D50 / Zone / Extraction Behavior / Use Case content sourced from Chris's "Taxonomy Reference - Grinder and Grind Setting" CSV (15 measured settings on the EG-1 with ULTRA SSP burrs). 6.6 included with `status: 'needs_fresh_measurement'` to preserve historical brew data while flagging the contaminated reading. 7.0 included with `status: 'anomalous'` (reads finer than 6.9 — bailout setting). All other settings in the 3.0-8.0 dial range are canonical but carry no measurement yet.

**Not a comprehensive registry.** Unlike Region / Variety / Process, this taxonomy captures only the grinders Chris owns and uses. **One grinder today: the Weber Workshop EG-1.** Adding a new grinder is a deliberate edit (registry + this doc + a migration if existing brews need reclassification).

**Two-axis decomposition on `brews`:**
- **`brews.grinder`** — canonical grinder name, strict registry, text column with no FK
- **`brews.grind_setting`** — canonical setting value (per-grinder enumerated). Strict — must match one of the grinder's `validSettings`.

Legacy `brews.grind` retained as denormalized display through a follow-up sprint, mirror of the Process 1e.2 -> 1e.4 cadence. Both PATCH route and `persistBrew` recompose via `composeGrind(structuredGrind)` on write.

**Future-flexibility shape:** `GrinderEntry` carries `burrs` (e.g. `'ULTRA (SSP)'`), `burrShape` (`'Flat'`/`'Conical'`), `burrSize` (`'80mm'`), `scaleType` (`'decimal_dial'`/`'click_count'`/`'numeric_notch'`), and a `validSettings` enum. If burrs ever swap, that's a registry edit. If a future grinder uses a different scale (clicks / notches), `scaleType` + `validSettings` adapt.

---

## Canonical list

| Grinder | Manufacturer | Burrs | Burr Shape | Burr Size | Scale | Range | Typical Use Range |
|---|---|---|---|---|---|---|---|
| **EG-1** | Weber Workshop | ULTRA (SSP) | Flat | 80mm | decimal dial, 0.1 steps | 3.0–8.0 | 5.0–7.0 |

---

## EG-1 — Settings reference

51 enumerated settings (3.0 to 8.0 in 0.1 steps). 16 carry measured content; 35 are valid but unmeasured (Chris dials in finer / coarser than typical only rarely). The picker's autocomplete surfaces the 16 measured settings; all 51 are accepted by the strict save-gate.

### Measured settings (D50 / Zone / Behavior / Use Case)

| Setting | D50 (µm) | Zone | Extraction Behavior | Use Case |
|---|---|---|---|---|
| **7.0** | ~1116 | A - Clarity | Very coarse — anomalous (reads finer than 6.9) | Bailout setting; remeasured March 2026 |
| **6.9** | 1216 | A - Clarity | Very high clarity / low extraction | Delicate washed Gesha; highest aromatic separation |
| **6.8** | 1133 | A - Clarity | Balanced clarity-coarse | Washed Ethiopians; high-end washed coffees |
| **6.7** | 1103 | A - Clarity | Balanced clarity + sweetness | Default washed starting point |
| **6.6** | — | — | — | Past brews used this; D50 reading contaminated and needs fresh session |
| **6.5** | 1083 | B - Transition | Balanced extraction | General washed; balanced cups |
| **6.4** | 977 | B - Transition | High extraction onset | Honey, light naturals, denser coffees |
| **6.3** | 1050 | C - Compression | Strong extraction / compression begins | Natural, anaerobic washed |
| **6.2** | 1023 | C - Compression | Similar to 6.3 | Functionally same as 6.3; adjust for flow |
| **6.1** | 1001 | C - Compression | High extraction | Dense high elevation; heavy processing |
| **6.0** | 1061 | C - Compression | Full expression entry | Sey / high extraction styles |
| **5.5** | 842 | D - Plateau | Sharp extraction increase (step change) | Key transition into heavy extraction |
| **5.0** | 882 | D - Plateau | Compressed extraction | Full expression; risk of heaviness |
| **4.5** | 867 | D - Plateau | Minimal change | Little benefit vs 5.0 |
| **4.0** | 874 | D - Plateau | Plateau confirmed | Redundant range |
| **3.5** | 819 | D - Floor | Fines-driven / unstable | Edge case testing only |
| **3.0** | 816 | D - Floor | Floor confirmed | Lower bound of filter grinding |

### Status flags

- **`needs_fresh_measurement`** — setting is canonical and existing brews use it, but the D50 reading was contaminated. Surface in the picker as a small caveat ("measurement pending"). Resolves when Chris runs a fresh session.
- **`anomalous`** — measured value disagrees with the dial position's expected behavior (e.g. 7.0 reads finer than 6.9 due to burr artifact). Setting stays canonical; the picker surfaces the caveat.

### Structural findings (from Brewing.md)

- Settings 6.0-6.3 produce D50 in the ~1000-1060 µm band (burr-geometry compression).
- 6.0 → 5.5 is the steepest meaningful step (~95 µm drop).
- Below 5.0 the burr hits a D50 floor of ~820-880 µm regardless of dial setting.
- High-EY roasters (Picky Chemist, Sey, Flower Child) target ~450 µm D50 on different burr geometry. **Physically unachievable on the EG-1.** Compensate via temperature (boiling), agitation, filter (T-92), and brew time (4-5 minutes) — not via dial.

---

## Aliases

Grinder-name drift observed in DB (pre-sprint 1k audit) + `<input>` hyphenation/case variants. Decimal-setting drift (e.g. `EG-1 6.5`, `Weber EG-1: 6.5`, `6.5 (Weber EG-1)`) is decomposed at migration / save time via the regex set in `lib/brew-import.ts`; the grinder portion resolves through this map.

| Drift form | Resolves to |
|---|---|
| `Weber EG-1` | EG-1 |
| `Weber Workshop EG-1` | EG-1 |
| `Weber EG1` / `Weber Workshop EG1` | EG-1 |
| `EG1` / `Eg-1` / `Eg1` | EG-1 |

---

## Excluded

**Other grinders.** Comandante / Ode 2 / ZP6 / Niche Zero / Lagom P64 / Mahlkönig EK / etc. — Chris doesn't own them. Add as a new entry when a grinder enters his actual rotation, not before. Registry stays at the size of the actual brewing kit.

**Espresso vs filter mode separation.** EG-1 has espresso and filter modes; Chris's corpus is all filter. Espresso reference data lives outside this taxonomy.

**Settings outside 3.0-8.0.** EG-1 dials below 3.0 are mechanical edge cases (burr contact zone) and above 8.0 produce D50 readings that aren't useful. Out of scope.

---

## Adoption retro

See [memory/project_grinder_taxonomy_adoption.md](../../memory/project_grinder_taxonomy_adoption.md) for the sprint 1k retro covering the EG-1 monoculture audit finding, the enumerated-vs-free-text setting decision (revised after Chris shared the Taxonomy Reference CSV), and the rework that followed.
