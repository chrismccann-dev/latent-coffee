# One-shot calibrations in process

*Coffee Research · Latent · Roasting Historian cluster*

Migrated from ROASTING.md § Lot Knowledge > One-Shot Calibrations in Process in Wave 4 PR 4b (2026-05-21).

One-shot calibration lots (`green_beans.is_one_shot=true`, single-batch samples ~100-120g, no iteration possible) have a different shape than the V1/V2/V3 iteration arc — they don't carry a "next-session hypothesis" because the lot is being roasted to answer a single point question (machine calibration, single-bean sanity check, bean-system comparison test).

When a one-shot is in process, author a per-lot file `<lot-slug>.md` here with: status (in-process / awaiting cupping), single-batch parameters, and the specific question the calibration was built to answer. On close-out, move to [`../learnings/<lot>.md`](../learnings/) like any other lot.

## Current roster

**(empty)** — Rancho Tio Emilio (ECU-TD24-RANCHOTIO-TM-WASHED) was the most recent one-shot, closed 2026-05-11; its lessons live at [`../learnings/rancho-tio-emilio.md`](../learnings/rancho-tio-emilio.md). The Cruz Loma TM Honey one-shot (Taza Dorada 2024 #15) is queued behind the next active-lot resolution; an in-process file will land here once it intakes.

## Related

- [`../active-lots/`](../active-lots/) — V-set lots currently in iteration
- [`../learnings/`](../learnings/) — closed lots (including closed one-shots)
- [`../patterns/by-process/honey.md`](../patterns/by-process/honey.md) — placeholder framework for the queued Cruz Loma TM Honey one-shot
- [`../../../../prompts/one-shot.md`](../../../../prompts/one-shot.md) — operational prompt covering STAGES 1-4 (intake/design/roast/cupping)
- [`../../../../prompts/one-shot-closeout.md`](../../../../prompts/one-shot-closeout.md) — operational prompt covering STAGE 5 (close-out with constrained carry-forward writes)
