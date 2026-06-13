# Roasting Brief — Bukure Anaerobic Lot 10 (rwa-nova-an10-rb-2026)

**green_bean_id:** `50ae372d-a4ee-465e-9e54-e2dcf9189c22` · **lot_status:** waiting_for_next_roast · **Started:** 2026-06-12 · **Roest inventory:** 9962

First live dogfood of the Roasting Coordinator role ([ADR-0024](docs/adr/0024-lot-coordinator-claude-code-native.md)). Architecture friction is logged in § Open questions as it surfaces.

## Anchor

- Red Bourbon / Anaerobic Natural / Agnes Mukamushinja & Felix Hitayezu, Nova Washing Station / Rwanda Northern Province. Terroir row shared with Lot 21 (Gicumbi / Bukure meso) — deliberate, the sibling aggregation depends on it.
- Density 786 g/L / moisture 10.3% (lower density than the Lot 21 sibling — energy tapered accordingly).
- Producer notes (the verify-on-track anchor): **blackberry jam, cherry cordial, cocoa, cola, lime.** No paired roasted cup (Showroom sells green only), no external roast profile.
- Profile anchor: **Mandela XO Batch 139** (heavy-ferment family, resolved) — curve shape + shaped fan + silent-FC management protocol. [Learnings](docs/skills/roasting-historian/cluster/learnings/cgle-mandela-xo-2026.md).
- Behavioral sibling: **Bukure Natural Lot 21** (RWA-NOVA-NAT21-RB-2026, closed 2026-06-06, reference Batch 194) — same beans, same station, clean-natural baseline. Carry-forward in force: FC temp anchors ~203-206°C and arrives late; **short dev is the cup-winning lever, not a flaw**; **widest WB→Gnd Agtron delta wins**; **dark-tea body is inherent, not a roast defect — do not design against it**; **xbloom misranks dark-tea-prone naturals** (2-lot pattern, Medium). [Learnings](docs/skills/roasting-historian/cluster/learnings/rwa-nova-nat21-rb-2026.md).

## Strategic arc

This lot is the **fermentation A/B against Lot 21** — same producer/station/cultivar, the anaerobic step the only major variable, the highest-value A/B in the Showroom inventory. The headline question every cupping answers: *what does the anaerobic ferment add or change on a Red Bourbon base we already know?* Cup with Lot 21's profile fresh in memory.

Budget discipline shapes the whole arc: 907g ≈ 9 batches → **V1 (map) + V2 (confirm) + brew session, no V3 room.** If V1 yields a clean winner, be open to routing to SPG early rather than spending V2 on exploration.

Three patterns get their third data point here: widest-delta-wins (Nova Red Bourbon), xbloom-misranks-dark-tea-prone-naturals (would promote toward Confirmed), and FC-audibility-under-anaerobic (Lot 21 gave a markable 1-snap subtle FC; the ferment may kill it).

Evaluation posture (locked at intake): Day 7 xbloom gate as usual, but **escalate to SPG (April Brewer + April Paper, Balanced Intensity) readily** — that's been the pattern on dark-tea-prone naturals. No UFO for primary evaluation. Lot 21's winning Hybrid Intensity-Clarity Split on the April Switch (late cut) is the starting point for the eventual optimized brew.

## V-set log (the plan-state)

- **V1** — design intent: peak-inlet **mapping pass at 236 / 239 / 242°C** on the Mandela XO curve shape (charge inlet 195°C, XO shaped fan, RPM flat, preheat 210°C), centered ~2°C below the XO anchor peak for the lower density. **BEAN_TEMP auto-drop 204°C uniform** (mid heavy-ferment ceiling, just above Lot 21's winning drop; doubles as the honest-trigger replication test of Batch 194's provisional manual pull). Slow-clock 6:00 uniform. Sequential run order v1a→v1b→v1c (operator-ratified divergence from the protocol's midpoint-first default — trusts the thermal-reset BBP). Expect silent-to-subtle FC; dual-threshold manual mark only; 208°C record-keeping fallback. v1a is the deliberate lower-bound probe (sub-FC is a usable data point per Lot 21's cup-floor-below-FC-floor finding). All design forks operator-ratified 2026-06-12 (structure / anchor / FC posture / spread / drop temp / slow clock).
  · status: **designed + fully staged** (2026-06-12: experiment `AN10-PEAK-INLET-v1`, recipes v1a/b/c with frozen predictions + drop rules, Roest profiles **"Bukure AN - v1a/b/c"** = 530685 / 530686 / 530687, share-enabled)
  · leading slot: — · what it proved: — · delta resolution: — · route taken: —

## Current state + next step

**V1 is staged end-to-end; the ball is at the roaster.** V1 Handoff Packet + operator prep packet emitted 2026-06-12 (reproduced below). Next Coordinator action: consume the V1 Results Packet in a fresh session — reconstruct from this Brief + `get_bean_pipeline` (use `since:`), resolve the three-point deltas, then route (V2 design vs early SPG; with no V3 room, prefer whichever spends fewer batches answering the ferment question).

### V1 Handoff Packet (emitted 2026-06-12)

```
V-SET HANDOFF — rwa-nova-an10-rb-2026 V1
- green_bean_id: 50ae372d-a4ee-465e-9e54-e2dcf9189c22
- experiment_id: fb8b4330-5b27-4c77-b0d3-d628a954db7e   (recipe rows v1a/b/c in DB; Roest profiles staged + shared)
- focus: peak-inlet mapping pass on the first anaerobic East African — where does the
  energy center sit, and what does the ferment change vs Lot 21's clean natural?
- not in the recipe rows: nothing. Reconstruct everything from get_bean_pipeline.
```

### Operator prep packet (emitted 2026-06-12)

- **Run order:** v1a → v1b → v1c, sequential. One session, one lot.
- **Profiles on the tablet:** "Bukure AN - v1a" / "Bukure AN - v1b" / "Bukure AN - v1c" (also loadable via the share URLs on the recipe rows).
- **Per batch:** 100g. Standard operator-fixed routine (10-min warm-up dry run to 140°C, BBP, hopper load at 125°C, charge at 117°C).
- **FC protocol:** expect silent-to-subtle. Mark manually only on a snap above 202°C in the expected window (~4:45-5:45 depending on slot); single snap is enough when temp + timing agree. If fully silent, 208°C fallback mark for the record — bean temp runs the drop either way. Record fc_audibility per batch.
- **Drop rules (all three slots):**
  - If running fast: **Let it auto-drop at 204°C. Don't intervene.**
  - If running slow: **Drop at 6:00 regardless.**
- **Record:** drop attribution honestly (auto vs manual pull) — Batch 194's provisional attribution is exactly what this V-set cleans up. Document any manual override explicitly; dev time is a measured output, not a target.

## Open questions / carry-forward

Lot-side:

1. FC audibility under anaerobic — Lot 21's natural gave a legitimate 1-snap subtle mark; does the ferment silence it? Feeds the audibility-window hypothesis and future anaerobic-East-African anchoring.
2. v1a sub-FC outcome is designed-in, not a failure — read it as "how far does 236 get," per the FC-threshold ≠ drinkability-threshold reframe.
3. Lot 21's lingonberry never surfaced on any brew angle; this lot's spec swaps it for lime — watch whether the bright-edge note survives the ferment at any slot.
4. Purchase date recorded as 2026-04-15 (mirrored from Lot 21's Showroom order) — correct via patch if the order record says otherwise.

Process notes:

- Workflow-level friction from this session lives in the [process-friction log](docs/skills/roasting-coordinator/cluster/process-friction-log.md) (entries dated 2026-06-12): the MCP nullable-schema publication bug (fix spun off as a background task; in-process persist fallback documented there) and the sibling-lot terroir FK near-miss at intake (registry collision flagged for the grilling queue).
- Lot-side residue of the schema bug: Roest inventory 9962 is missing structured moisture/density/elevation/price (values packed into its notes + live in the DB) — patch after the fix ships.
- What worked: the compose-don't-reauthor model held — onboarding protocol + Roest Knowledge + Historian + Lot 21 learnings answered every design question; the drop-rule authoring standard produced glanceable rules on the first try; ask-at-every-fork with prior-lock-as-recommended resolved all 7 forks in two question rounds.

## Cross-domain handoffs

- SPG: not-run
- Optimized brew: not-started

## Close-out (when resolved)

—
