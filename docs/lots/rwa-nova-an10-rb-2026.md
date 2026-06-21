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
  · status: **CLOSED** — roasted 2026-06-13 (batches 214/215/216), xbloom Day 7 (2026-06-20), SPG Day 8 (2026-06-21).
  · **leading slot: V1C (Batch 216, 242 peak) — best of set, NOT the lot reference.**
  · what it proved: (1) **FC audibility is a momentum threshold on this anaerobic** — 236 did_not_fire / 239 one boundary pop (subtle) / 242 audible (2 cracks, 4:31); the ferment raised the audible-FC bar vs Lot 21's clean natural. (2) **Bimodal response surface** — the developed end (216) decisively beats the bright-but-hollow low end (214), and the center (215, 239) is the *weakest* slot, not a compromise. (3) **SPG inverted the xbloom read on 214** — the gate over-amplified its brightness; under a real Extraction-Push pourover 214 is flat/nutty/hollow, so the 214-front + 216-back blend idea is dropped. (4) **216 is closest to producer notes** (cherry-cola / jam / cocoa) but under-built (flat-ish, disintegrated mid-palate) **with zero overdev signature even at the 207 manual-hold** → real roast headroom. (5) **widest WB→Gnd delta won again** (216 +6.9), 3rd consecutive on Nova Red Bourbon.
  · delta resolution + full numbers live in the experiment row `AN10-PEAK-INLET-v1` (`key_insight` / `what_changes_going_forward` / `delta_from_cup_*` / `delta_from_roast_*`) — pull `get_bean_pipeline`, not duplicated here.
  · route taken: **SPG (Path B) → advance to V2.**

- **V2 — direction set, not yet designed.** The V1 Assistant's recommended direction (input-not-canon; the V2 Coordinator session owns the actual design + forks): **push development PAST 216** (216 = 242 peak / FC 4:31 / 44s dev / drop 207 manual-hold / Agtron 83.7 / +6.9), with an **honest bean-temp auto-drop (no manual hold)** so the developed window is repeatable; the old >206°C failure boundary is provisionally too low (216 hit 207 clean, no spice/overhang) so **deliberately probe past 206** watching for the heavy-ferment overdev signature (spice/cinnamon creep, roast overhang); **narrow-variance** (1-2 variables around the developed end), not a wide V1-style map. Budget: ~600g left = 3×100g + a brew session — **NO V3, so V2 must land the reference** (or close on best-available); be open to an SPG again at V2.
  · status: not yet designed — fresh session (see Current state).

## Current state + next step

**V1 closed; V2 not yet designed.** `lot_status` is `waiting_for_next_roast` (correct — ready for the next roast). **V2 design is a fresh-session job** per Model B + [process-friction entry #1](docs/skills/roasting-coordinator/cluster/process-friction-log.md): the warm session that ran V1 should not roll straight into designing the next phase. Open a fresh Claude Code session, say *"design AN10 V2,"* and it reconstructs everything from this Brief + `get_bean_pipeline(50ae372d-a4ee-465e-9e54-e2dcf9189c22)` — the V1 paste-block / Results Packet is **not needed** (its entire content is already in the DB; see § Process notes). V2 has the direction set (above) but the specifics — exact dev target, whether to lift the drop ceiling vs add energy, the 1-2 isolated variables — are forks for that session to walk.

The V1 Handoff + operator-prep packets (emitted 2026-06-12) were ephemeral couriers; their content lives in the recipe rows + DB and is not reproduced here.

## Open questions / carry-forward

Lot-side (for V2):

1. Where does the **heavy-ferment overdev signature** finally appear when pushed past 216? None yet — 216 was clean at the 207 manual-hold — so V2 deliberately hunts for it.
2. Does the **under-built / disintegrated mid-palate** resolve with more roast development, or is it partly a brew-extraction issue? Brew-side note from the SPG: an Intensity-Clarity Split pulls more into 216's under-built front.
3. FC audibility is a **momentum threshold** here (236 none / 239 one pop / 242 audible) — the anaerobic step raised the audible-FC bar vs Lot 21. V2 lives at 242+, so an audible FC is expected; confirm it holds.
4. **Lingonberry→lime watch:** 216 carries "a touch of lime," 214 most overtly — the bright edge survives the ferment at the developed end; track whether it persists in the reference recipe.

CCIL candidates held (not promoted — need V2 corroboration):

- **widest WB→Gnd delta wins** — 3rd consecutive on Nova Red Bourbon (216 +6.9); cleaner at N=4 after V2.
- **xbloom gate over-amplifies brightness / can invert vs a real pourover on bright anaerobics** — N=1 (214 this lot); watch for a 2nd instance before promoting.

Process notes:

- Workflow friction from the V1 arc lives in the [process-friction log](docs/skills/roasting-coordinator/cluster/process-friction-log.md): the MCP nullable-schema publication bug (**resolved 2026-06-13**, `lib/mcp/schema-compat.ts`), the sibling-lot terroir FK near-miss, and (2026-06-21) the **V-set packet-persistence resolution**.
- **Packet persistence resolved (2026-06-21):** V-set Handoff/Results Packets are **ephemeral couriers, not artifacts** — no file home. Confirmed empirically this session: the full V1 close reconstructed from `get_bean_pipeline` alone, and the paste-block carried nothing the DB didn't already hold (the Assistant had written `key_insight` / `what_changes_going_forward` / `delta_from_cup_*` into the experiment row). Durable content lands in the DB (numbers + Assistant interpretation) + this Brief (Coordinator narrative); the Brief's git history is the audit trail.
- Lot-side residue of the schema bug closed 2026-06-13 (Roest 9962 structured fields patched + verified).
- The MCP write notes the V1 Results Packet carried (`#57` `patch_green_bean` over-requires fields / clobbers `roast_priority`; `#58` SPG-lifecycle prompt drift) are already filed in the [feedback backlog](docs/product/feedback-backlog.md) via route-feedback Round 25 (#499/#500) — issue-tracked, not re-logged here.
- What worked (V1 design): the compose-don't-reauthor model held; the drop-rule authoring standard produced glanceable rules on the first try; ask-at-every-fork with prior-lock-as-recommended resolved all 7 forks in two rounds.

## Cross-domain handoffs

- SPG: **run at V1** (Day 8, 2026-06-21 — one standing Extraction-Push pourover on finalists 214 + 216) → 216 wins outright, but assessed best-of-set, **not reference-grade** → Path B advance to V2. Cuppings in the DB (`eval_method = Simulated Pourover`).
- Optimized brew: not-started

## Close-out (when resolved)

—
