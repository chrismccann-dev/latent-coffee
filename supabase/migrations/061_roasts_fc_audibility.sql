-- Sprint 11 (2026-05-20) — RO-CP-3 schema add: roasts.fc_audibility
--
-- 4-value enum capturing the audible expression of first crack for a single
-- roast batch. Surfaced in the 2026-05-17 cross-party grilling round 4 — today
-- the audibility state is captured in roast prose; structuring it as a column
-- lets claude.ai set Roest profile expectations programmatically and lets
-- cuppings be filtered correctly by FC audibility on the lot.
--
--   audible    — multi-snap canonical FC, clear audible cracking; bean-property
--                cell-wall structure intact.
--   subtle     — partial audibility, some snaps detectable but not the canonical
--                multi-snap signature; operationally treated as not-audible.
--   silent     — no audibility detected; cell-wall structure modified (heavy
--                anaerobic, fermentation cellulose degradation, etc.) such that
--                no snap fires. FC structurally happened (detectable via RoR
--                flattening + bean temp climbing through FC range). "inaudible"
--                is a near-synonym used when hedging on detection vs asserting
--                bean-property silence.
--   ambiguous  — operator-property uncertainty; couldn't tell whether FC
--                happened, missed it, or it's still upcoming.
--
-- Three of the four (subtle / silent / ambiguous) trigger the same downstream
-- protocol stack: bean-temp end condition, drop-ceiling-primary, Agtron + WB→Gnd
-- delta as proxies, peak inlet hedging on heavy-ferment lots. The distinction
-- matters for cause attribution and for predicting audibility on future similar
-- lots. See CONTEXT.md § FC audibility state.
--
-- No backfill: of 135 historical roasts, only 6 (4.4%) have fc_total_cracks
-- populated, and even those 6 carry ambiguity between "cracks=0 means silent"
-- and "didn't record." Historical roasts stay NULL; populate going forward via
-- push_roast / patch_roast.
--
-- Idempotent: re-applying is safe (IF NOT EXISTS guard on column add).

ALTER TABLE roasts ADD COLUMN IF NOT EXISTS fc_audibility text
  CHECK (fc_audibility IN ('audible', 'subtle', 'silent', 'ambiguous'))
  DEFAULT NULL;
