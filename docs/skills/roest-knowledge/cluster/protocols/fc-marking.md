# FC Marking Protocol

**FC marking is now decoupled from drop control.** As of 2026-05-04, drop is controlled by bean temp end condition on the profile (see [cluster/machine/counterflow-observations.md § Drop Temp as the Primary Drop Signal](../machine/counterflow-observations.md#drop-temp-as-the-primary-drop-signal)). FC marking is a data-recording event, not a drop-trigger event.

Migrated from ROASTING.md § FC Marking Protocol in Wave 3 PR 1 (2026-05-26).

---

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

- `roasts.fc_audibility` (Sprint 11, migration 061) — 4-value enum (audible / subtle / silent / ambiguous). Three of four values (subtle / silent / ambiguous) trigger the same downstream protocol (bean-temp end condition + drop-ceiling-primary + Agtron as proxies); the distinction matters for cause attribution and for predicting audibility on future similar lots. See [CONTEXT.md § FC audibility state](../../../../../CONTEXT.md) for the full 4-value semantics + protocol-stack notes.
