# Black Moon Chiroso Natural #75 (PAN-BLACKMOON-CHIROSO-NAT-2026)

*Coffee Research · Latent · Roasting Historian cluster · active-lots*

**Status:** Waiting for next cupping (V1 roasted 2026-11-05, batches 241/242/243; Day 7 cupping target 2026-11-12)
**Green:** Panama / Alto Quiel, Boquete, Chiriquí / Hunter Tedman (Black Moon Farm) / Chiroso / Natural, 2025 harvest, Forward Coffee lot P250271 (Forward score 92). 1kg single range-finder unit. Density 802 g/L (high), moisture 11.1% (high). First Chiroso in the archive - fills the named variety gap.
**Producer context:** Hunter Tedman is a Tier-1 canonical anchor producer, dark-drying pioneer (Multi-stage Dark Drying, Anaerobic Slow Dry System); Chiroso is listed as his experimental cultivar. Expect Wush-Wush-DRD-style fruit-layer / dark-dry thermal insulation beyond what the green specs capture.

## Substrate IDs

- green_bean_id: `5e5d8b81-5ab2-4c8c-a763-f7aca1bb7c48` · Roest inventory 12338
- V1 experiment `PAN-BLACKMOON-CHIROSO-NAT-2026-V1`: `c2b3dede-6a59-4246-b548-c91fd36f3890`
- Recipes: v1a `83c9c8a0` (Roest profile 628175) / v1b `7bd8672d` (628176) / v1c `abbada48` (628177)

## Working hypothesis

Dark-fruit natural with a real hot->cool turn (blackberry/black cherry/violet/maple hot -> peach/tangerine/orange-blossom cool). Range-finder lot: learning intent is find-out-what-it-wants, not optimize-toward-expression. Anchor confidence Medium-Low - no Chiroso prior; design anchored on the natural-family FC-temp constraint (FC fixed ~204-206°C regardless of peak inlet) + SR Natural's energy finding (247°C peak needed at 791 g/L / 10.3%), scaled up slightly for the denser (802 g/L) + wetter (11.1%) green.

## V1 design (2026-11-05)

Coupled gentle-to-pushed sweep bracketing the development space - peak inlet AND drop ceiling move together (deliberate V1-width multi-variable; attribution sharpens in V2):

| Slot | Peak inlet | Drop (bean_temp) | Probes |
|---|---|---|---|
| v1a | 245°C | 205.5°C | FC-onset solution (Wush Wush DRD pattern) |
| v1b | 248°C | 206.5°C | Central estimate; the producer's hot->cool turn |
| v1c | 251°C | 208°C | More-development solution (AN10/Deborah pattern) |

Shared: standard 7-timestamp inlet template (curves scale proportionally: 200 -> peak-19 -> peak-6 -> peak -> peak-4 -> peak-14 -> peak-20), charge 117 / hopper 125 / preheat 210, fan 80/69/65/71/74 (high-moisture-biased natural floor), RPM 65, 100g batches. Drying support raised at 01:15 / 02:30 for the 11.1% moisture (drying support, NOT more development - Dongzhe peer confirmation).

**The fork V1 decides:** is this lot FC-onset-behaved (Wush Wush family) or more-development-behaved (AN10/Deborah ferment family)? v1c's cup is the discriminator - maple/syrup deepening = development-behaved; dark tea / flat attack = ceiling is lower, V2 ladders down.

## V1 actuals (2026-11-05, batches 241/242/243)

| Slot | Batch | Executed | FC | Drop | Dev | WB / WL |
|---|---|---|---|---|---|---|
| v1a | 241 | v1a profile, honest auto-drop | unmarked (cracks audible session-wide) | 205.5°C @ 4:40 | n/a | 93.5 / 10.8% |
| v1b slot | 242 | **v1a profile re-run by mistake**, manual hold | 4:23 / 202.8°C audible | 207.0°C @ 5:07 | 44s | 85.5 / 11.7% |
| v1c | 243 | v1c profile, manual hold past 208 | 4:23 / 207.4°C audible | 211.1°C @ 4:55 | 32s | 83.4 / 12.3% |

Cupping-independent V1 findings:

- **Lot runs fast**: all slots dropped 35-55s ahead of the family-derived model despite 11.1% moisture - the high-moisture-delays-FC prior did not hold here. V2 timing model should anchor on FC ~4:23 at these energies.
- **FC-temp anchor counterexample (Low-Medium confidence, marking-lag caveat)**: FC marked 202.8°C on the 245°C curve vs 207.4°C on the 251°C curve at the identical 4:23 mark time - first natural in the archive where FC TEMP moved with peak energy. Watch on V2 before touching the cross-coffee constraint.
- **Colors very light for drop temp**: 211.1°C drop -> WB 83.4; 207.0°C -> 85.5. The playable ceiling may sit above the family's 205-208°C cluster.
- **Designed v1b (248°C peak, profile 628176) never executed** - still on the tablet if V2 wants the higher-energy curve. Batch 242's accidental 245-peak + 207-drop + 44s-dev middle may be the real window center.
- Operator holds on 242/243 recorded as end_condition manual; recipes preserve designed bean_temp targets (intent-vs-execution divergence is deliberate).

## Carry-forward being tested

- FC-temp anchored ~205°C on naturals (3-for-3 on Wush Wush DRD) - predicts all three slots FC 204-206°C with peak moving FC time only.
- Drop ceiling as the entire development lever on naturals; ladder in ~1°C steps from V2 on (slow post-FC climb ~1°C/30s).
- Dark-dry fruit-layer thermal insulation may demand more early energy than specs suggest (SR Natural lesson: let FC timing tell you).
- Trust ground Agtron + the real-pourover arbiter over WB + the xbloom gate on ferment-family naturals (Deborah/AN10 gate inversions) - plan the SPG before any reference call.
