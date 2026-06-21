# Roasting Brief — Bukure Anaerobic Lot 10 (rwa-nova-an10-rb-2026)

**green_bean_id:** `50ae372d-a4ee-465e-9e54-e2dcf9189c22` · **lot_status:** waiting_for_next_roast · **Started:** 2026-06-12 · **Roest inventory:** 9962

First live dogfood of the Roasting Coordinator role ([ADR-0024](docs/adr/0024-lot-coordinator-claude-code-native.md)). Architecture friction is logged in § Open questions as it surfaces.

## Anchor

- Red Bourbon / Anaerobic Natural / Agnes Mukamushinja & Felix Hitayezu, Nova Washing Station / Rwanda Northern Province. Terroir row shared with Lot 21 (Gicumbi / Bukure meso) — deliberate, the sibling aggregation depends on it.
- Density 786 g/L / moisture 10.3% (lower density than the Lot 21 sibling — energy tapered accordingly).
- Producer notes (the verify-on-track anchor): **blackberry jam, cherry cordial, cocoa, cola, lime.** No paired roasted cup (Showroom sells green only), no external roast profile.
- Profile anchor: **Mandela XO Batch 139** (heavy-ferment family, resolved) — **mechanical anchor ONLY**: curve shape + shaped fan + silent-FC management protocol. [Learnings](docs/skills/roasting-historian/cluster/learnings/cgle-mandela-xo-2026.md). **Operator calibration (2026-06-21):** AN10's anaerobic is *much milder* than XO (XO reeked of ferment on the green + cupped extremely aggressive even on a simple cupping — a league of its own), so XO's **~205-206°C overdev ceiling + cinnamon/cardamom spice-dominance signature do NOT transfer** — AN10 has more roast headroom and overdevs conventionally. Don't draw overdev lessons from XO; AN10's own V1 + the Lot 21 sibling are the priors.
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

- **V2 — DESIGNED + STAGED** (2026-06-21, fresh Coordinator session). experiment `AN10-DEV-DEPTH-v2` (pk `490fa6a6-e2b3-4bd7-b2e6-e59ee29c1f26`); recipes v2a/v2b/v2c staged (`d5dea306` / `55d9f02c` / `5ee3a933`); Roest profiles **535418 / 535419 / 535420** pushed (named "Bukure AN - v2a/b/c"). Design intent: **push development past 216, honestly, to land the reference (no V3) and find where this anaerobic's overdev signature appears.** The single isolated variable is **bean-temp auto-drop = development depth**, laddered past 216's hand-held 207: **v2a 207 / v2b 209 / v2c 211°C**, all **honest auto-drop, NO manual hold** (fixes 216's confound — 216 conflated 242 peak with a manual hold to 207). Peak **held at 242** (the proven audible-FC threshold from V1). Curve = XO shape with a **sustained post-FC tail** (4:00/5:00/6:00 inlet lifted +2/+6/+9 vs V1c, plus a 7:00 point) so the developed window is reached by **genuine dev-phase energy, not a long low-RoR bake** — this is the "both" answer to lift-drop-ceiling-vs-add-energy (lift the drop ceiling AND sustain dev-phase heat; do NOT add peak energy). v2a = safety floor (honest 216, guarantees V2 isn't empty); v2b = the more-developed reference target; v2c = the deliberate overdev probe into untested territory above V1's clean 207 (AN10's anaerobic is much milder than the Mandela XO league, so it has real roast headroom — the XO ~205-206°C overdev ceiling does NOT transfer; expect *conventional* overdev, not XO spice). Drop rules per the authoring standard (fast: let it auto-drop, don't intervene; slow failsafe 5:45 / 6:15 / 6:45). Sequential run order v2a→v2b→v2c (floor→ceiling — lets v2c be aborted if v2b already shows overdev). **All 4 design forks operator-ratified this session:** (1) variable = drop-temp/dev-depth + lift the post-FC tail, hold peak; (2) ladder 207/209/211; (3) sequential run order; (4) eval posture xbloom-then-likely-SPG.
  · status: **STAGED — awaiting the V-Set Assistant roast.** lot_status `waiting_for_next_roast` (correct — no change; the handoff happens in this state).
  · per-slot predictions + the full design live in the recipe rows + experiment `AN10-DEV-DEPTH-v2` — pull `get_bean_pipeline`, not duplicated here.

## Current state + next step

**V2 designed + staged; awaiting roast.** `lot_status` is `waiting_for_next_roast` (correct). The next action is **operator-side**: open a fresh Claude Code session as the **V-Set Assistant** and run V2 (paste the V2 Handoff + operator-prep packet emitted this session). The Assistant reconstructs the full design from the DB — experiment `AN10-DEV-DEPTH-v2`, the 3 recipe rows, and Roest profiles 535418/535419/535420 (load by the "Bukure AN - v2a/b/c" names on the tablet). After the Day-7 xbloom cup (+ likely SPG on the finalist), a **fresh Coordinator session** consumes the V2 Results Packet and routes (declare reference / SPG-first / close-on-best). **No V3** — V2 lands the reference or closes on best-available.

The V2 Handoff + operator-prep packets (emitted 2026-06-21) are ephemeral couriers; their content lives in the recipe rows + DB and is not reproduced here (per the packet-persistence resolution).

## Open questions / carry-forward

Lot-side (for V2):

1. Where does **AN10's overdev signature** finally appear when pushed past 216? None yet — 216 was clean at the 207 manual-hold — so V2 deliberately hunts for it. Expect *conventional* overdev (flattening, bake, loss of fruit/acidity lift, dark-tea dominance), NOT the XO heavy-ferment spice-dominance — AN10 is a much milder ferment (operator, 2026-06-21).
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
- **V2 staging (2026-06-21)** hit two MCP write issues, both logged in the [process-friction log](docs/skills/roasting-coordinator/cluster/process-friction-log.md) and fix-routed: (1) the number-coercion bug *recurred* on the `mcp__latent-coffee__*` connection (stale/stripped catalog) and was cleared by retrying the recipe pushes on the sibling `mcp__eeaa2042-…` connection (schema-compat catalog) — the dual-catalog remedy from friction #1; (2) NEW — `push_roast_recipe` stored the beziers as JSON *strings* (the untyped `z.unknown()` jsonb fields publish typeless, so the CC client stringifies them — a class the schema-compat fix didn't cover). Functionally inert (the renderer shows '—' for both string and tuple-array shapes; the operator roasts from the correct Roest profiles), routed to a tracked server-side-parse + backfill fix.
- What worked (V1 design): the compose-don't-reauthor model held; the drop-rule authoring standard produced glanceable rules on the first try; ask-at-every-fork with prior-lock-as-recommended resolved all 7 forks in two rounds. V2 repeated the pattern — 4 forks ratified in one round.

## Cross-domain handoffs

- SPG: **run at V1** (Day 8, 2026-06-21 — one standing Extraction-Push pourover on finalists 214 + 216) → 216 wins outright, but assessed best-of-set, **not reference-grade** → Path B advance to V2. Cuppings in the DB (`eval_method = Simulated Pourover`). **V2 posture (operator-ratified):** xbloom Day 7 → likely SPG on the finalist(s) before declaring reference (no V3 safety net, and the V1 SPG caught the 214 brightness-inversion); route decided post-cup by the consuming Coordinator session.
- Optimized brew: not-started

## Close-out (when resolved)

—
