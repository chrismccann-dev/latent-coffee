# FC Marking Protocol

**FC marking is now decoupled from drop control.** As of 2026-05-04, drop is controlled by bean temp end condition on the profile (see [cluster/machine/counterflow-observations.md § Drop Temp as the Primary Drop Signal](../machine/counterflow-observations.md#drop-temp-as-the-primary-drop-signal)). FC marking is a data-recording event, not a drop-trigger event.

Migrated from ROASTING.md § FC Marking Protocol in Wave 3 PR 1 (2026-05-26).

---

## Roest auto-detect mechanism

The Roest machine has an auto-detect first-crack feature that listens for crack events and marks FC on the graph when criteria are met. Reference: [https://www.roestcoffee.com/support/getting-started/first-crack-detection-v2](https://www.roestcoffee.com/support/getting-started/first-crack-detection-v2). Current configuration on the Latent machine:

- **Activation threshold: 195°C bean temp** — the auto-detect does not listen below this temperature, to avoid false positives from random clicks early in the roast.
- **Sensitivity: 75%** — the audio threshold the machine uses to register a snap. Tunable in the machine settings.
- **Confirmation rule: two-or-more snaps** — the machine waits for a second crack before marking FC, which lessens false-positive risk from a single defect-bean snap.

When the machine confirms a two-snap event, it renders a **band** on the graph spanning from the first heard snap to the confirming snap (the orange tick marks in the bottom-of-graph crack row visually show each individual snap, plus the larger vertical line that marks the auto-confirmed FC event). When the operator manually marks FC, a single vertical line renders at the timestamp instead.

**Operator override pattern:** the operator can manually mark FC at any moment by pressing the on-screen button. Manual marking is preferred for the data record when the operator hears a clear single snap above ~202°C, because the auto-detect's two-snap confirmation rule introduces a 5-15 second lag from the actual onset.

**Manual-mark discipline (dual-threshold rule)**: the operator-mark is legitimate when **both** dimensions cross threshold simultaneously — temperature window (bean temp above 200-202°C) AND timing window (typically approaching the expected FC time, e.g. near 4:30 for a Latent-style profile). A single snap in the wrong temperature zone (below 200°C) is almost always a defect bean and must NOT be marked. A single snap in the wrong timing window (very early or very late vs the curve shape) is suspect even if in the right temperature zone. When both dimensions agree, a single snap is real — the operator does NOT have to wait for the machine's two-crack confirmation in this window, because the joint temperature + timing constraint is more discriminating than the machine's audio-only two-snap rule. This is how `subtle`-audibility batches end up with a legitimate fc_start timestamp: 1 snap heard in the right temperature + timing window is sufficient to mark, and the recorded timestamp is real data (lived example: Bukure v2b 5:27 manual mark with 1 snap and 18s computed dev — past 200°C, near expected 4:30-5:30 FC window for the profile, so the snap was the event even though the canonical multi-snap signature didn't fire). See [CONTEXT.md § FC audibility state § 2. Subtle](../../../../../CONTEXT.md) for the data-layer corollary (trust the timestamp on subtle when a specific fc_start fired).

**Why this matters for the `did_not_fire` state:** when neither the machine auto-detect nor the operator marks FC, AND the bean topped out below the 200-205°C FC window, the `roasts.fc_audibility = 'did_not_fire'` value is the right read (event structurally did not happen). If the bean DID reach the FC window but neither mechanism fired, the state is `silent` (snap physically didn't fire, e.g. heavy-anaerobic cell-wall modification) or `ambiguous` (operator hedging on whether they faintly heard something). See [CONTEXT.md § FC audibility state](../../../../../CONTEXT.md) for the full 5-value semantics + disambiguation rule.

**Recipe-construction implication:** dev-time-anchored recipes (where drop fires N seconds after FC) depend on a reliable FC mark to count dev from. On `did_not_fire` lots, the dev-time end condition produces an unanchored count and the drop fires at an arbitrary time. Drop-at-bean-temp recipes (Latent's current default per [counterflow-observations.md § Drop Temp as the Primary Drop Signal](../machine/counterflow-observations.md#drop-temp-as-the-primary-drop-signal)) are robust to FC-detection failures because the drop trigger is independent of the FC mark — the bean-temp end condition fires whether or not FC was detected.

**Roest UI behavior on no-FC batches:** when neither the machine auto-detect nor the operator marks FC, the Roest log UI displays the FC-related fields as N/A — First crack time: N/A / N/A, Dev time: N/A — and the phase breakdown bar at the bottom of the graph shows only **drying + Maillard** segments summing to 100%, with no development segment (lived example: Red Plum v2a batch #196, 2026-05-23, 02:05 drying 41.7% + 02:55 Maillard 58.3% + no dev). The Roest machine's own UI behavior is the model the Latent data layer mirrors — the `did_not_fire` enum value + triple-null co-rule on `fc_start` / `fc_temp` / `dev_time_s` (enforced via [migration 068](../../../../../supabase/migrations/068_did_not_fire_null_co_rule.sql) DB CHECK constraint `roasts_did_not_fire_nulls_check`) keeps the DB read in lockstep with what the Roest machine itself recorded. The Maillard %-N/A prose convention on did_not_fire batches (see [CONTEXT.md § Maillard % § Computation rule on `did_not_fire` batches](../../../../../CONTEXT.md)) mirrors the same — the Roest UI shows no dev % on these batches because there is no dev phase to attribute time to.

---

## Manual marking discipline

**Manual marking at first audible crack above 202°C** is the standard for the data record. This gives the earliest reliable signal and is more consistent than waiting for the Roest auto-mark (which fires after a second crack, lagging actual onset by 5-15 seconds).

**Cases:**

- **Audible FC above 202°C:** mark manually for the data record. Drop is controlled by the bean temp end condition on the profile, not by FC.
- **False positive below 202°C:** a single crack below 202°C is almost certainly a defect bean — do not mark. Wait for confirmation above 202°C.
- **High-volume crack:** if the Roest auto-marks due to a dense, vigorous crack event, accept the auto-mark.
- **Silent crack coffees (e.g. Mandela XO, anaerobic naturals, XO process):** do not attempt to mark. Log as manual-no-audio at the drop temp (which the profile end condition will fire at automatically). FC timestamp is null; drop temp is the only meaningful event. This was previously called out as an exception requiring bean temp end condition; with bean temp end condition now the default on every profile, silent-crack coffees are no longer an exception — they're just the case where the FC mark is null.

**Why dev time as end condition is retired:** dev time anchored to an inaudible or machine-estimated FC timestamp produces unpredictable Maillard overrun — confirmed across V4 of Mandela XO where Maillard reached 51-58% instead of the target 44%. Bean temp end condition removes this failure mode entirely. Dev time is now a measured output, not an end condition.

Record FC method in the Roast log (manual / auto / manual-no-audio) on every batch.

---

## Related fields

- `roasts.fc_audibility` (Sprint 11, migration 061; 5th value `did_not_fire` added Group 3 / Item 31 / migration 066 / 2026-05-24) — 5-value enum (audible / subtle / silent / ambiguous / did_not_fire). Four of five values (subtle / silent / ambiguous / did_not_fire) trigger the same downstream protocol (bean-temp end condition + drop-ceiling-primary + Agtron as proxies); the distinction matters for cause attribution and for predicting audibility on future similar lots. See [CONTEXT.md § FC audibility state](../../../../../CONTEXT.md) for the full 5-value semantics + disambiguation rule + protocol-stack notes.
