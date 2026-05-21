# Fan Strategy + Standard Inlet Curve Template

Counterflow-specific shaped-curve discipline for the Roest L200 Ultra. Two related controls bundled into one doc: the fixed 7-timestamp inlet curve template (V1 design infrastructure) + the fan strategy (counterflow second axis of control). Both are machine-conditioned; the conventional drum-mode flat-fan default does not apply.

Migrated from ROASTING.md § Standard Inlet Curve Template + § Fan Strategy in Wave 3 PR 1 (2026-05-26).

---

## Standard Inlet Curve Template

All V1 roast profiles on this machine use the same seven inlet stage timestamps. Only the inlet temperature values change across experimental batches. Fixing the timestamps reduces design overhead and makes A/B/C batches within an experiment set strictly comparable.

| Timestamp | Phase Role | What This Point Controls |
|---|---|---|
| **00:00** | Charge / start inlet | Starting energy at bean contact. Default 200°C across all experiments unless there is a specific reason to vary. |
| **01:15** | Mid-drying ramp | Drying phase aggressiveness. Earlier and higher here = faster drying, shorter overall roast. |
| **02:30** | Late drying / early Maillard | Transition into Maillard. This is where drying phase ends and browning reactions begin. Typically 5-8°C below peak. |
| **03:15** | **Peak inlet (late Maillard)** | **The energy lever. This is typically the primary variable in V1 experiments. Peak occurs 45-60 seconds before expected FC so the curve can decline into crack.** |
| **04:00** | Into FC (post-peak decline) | RoR momentum into crack. Typically 4-6°C below peak. Steeper decline here compresses dev time; gentler decline extends it. |
| **05:00** | Development phase | Continued decline through dev. Usually 8-12°C below peak. Drop typically fires before this point if managing by temp. |
| **06:00** | Safety floor / overrun buffer | Terminal value if the roast overruns target drop time. Usually 12-16°C below peak. Drop should always fire before this. |

**Design rules for V1 experiments:**

- Hold all seven timestamps constant across A/B/C. Only inlet temperature values change.
- **V1 is a mapping pass** — go wider on the inlet variance across A/B/C than feels comfortable. The point is to bracket the strategy space, not to find the answer in V1. After cupping, V2 narrows toward where the signal is.
- When varying peak inlet, scale the full curve proportionally: the entire shape shifts up or down while preserving relative ratios between stages.
- Later experiment sets (V2, V3) may deliberately shift timestamps to test Maillard length or post-peak decline steepness as isolated variables. When that happens, note the deviation explicitly in the Experiment record.
- Reference for V1 batches A/B/C: 200 → [low/mid/high] → [low/mid/high] → peak → peak-4 → peak-14 → peak-20°C. The low/mid/high row is the only row that changes across batches.

---

## Fan Strategy (Counterflow — Shaped Curves Required)

Flat fan is a blunt instrument in counterflow mode. Fan speed controls convective heat transfer alongside inlet temp. A shaped fan curve gives a second axis of control and meaningfully affects how the Maillard and development phases behave.

> **All profiles should use a shaped fan curve, not flat fan.**

### General Fan Framework

- **Drying phase** (charge through yellow): 78-82% — supports moisture removal without over-driving bean temp
- **Maillard phase** (yellow through FC): step down to 63-70% — slows convective heat transfer, extends the phase
- **Development phase** (FC through drop): gentle step back up to 70-75% — maintains momentum through crack without spiking RoR

### Fan Curves by Coffee Type

- Washed / higher density / higher moisture: Maillard floor 65-70%
- Natural / lower density / lower moisture: Maillard floor 63-67%
- Heavy fermentation / XO process: Maillard floor 63-65%

### Current Reference Fan Curves

| Profile | Fan Curve |
|---|---|
| **Sudan Rume Washed (CF-Light — confirmed)** | 80% at 0:00 → 70% at 1:45 → 65% at 2:30 → 72% at 4:15 → 75% at 5:30 |
| **Sudan Rume Natural (working hypothesis, V2 not confirmed)** | 80% at 0:00 → 68% at 1:45 → 63% at 2:30 → 70% at 4:15 → 73% at 5:30 |
| **Mandela XO (confirmed — Batch 139 reference roast)** | 80% at 0:00 → 68% at 1:45 → 63% at 2:30 → 70% at 4:15 → 73% at 5:30 |

Fan curve changes count as a changed variable and should be isolated in experiment design.
