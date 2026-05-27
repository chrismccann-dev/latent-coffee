-- Sprint 3.5 — Roest pull-side audit + /datapoints/ parity.
--
-- The Roest API exposes a /datapoints/?log={log_id} endpoint with raw
-- temperature time-series (bt, et, inlet_temp, drum_temp + msec offsets,
-- plus data_type 0=Event / 1=Data and event_type 0-8 incl. auto-detected
-- FC/Dryend/Drop). Discovered 2026-05-26 during the audit via the
-- Kaffebrenner/roest-api-example OpenAPI schema. lib/roest-client.ts +
-- lib/mcp/pull-roest-log.ts wire the new endpoint; this migration adds the
-- columns the normalizer now populates.
--
-- Three pull-side capabilities unlocked:
--   - Server-side TP + yellowing_temp compute (existing roasts.tp_time +
--     roasts.tp_temp + roasts.yellowing_temp columns from migration 039
--     were NULL-only until /datapoints/ was wired; this migration adds no
--     new columns for them — only the normalizer changes).
--   - Three RoR anchors at fixed-clock + FC-relative timestamps
--     (ror_at_2_30 / ror_at_4_00 / ror_at_fc_minus_30s). 30-second windows
--     centered on the target msec; NULL when the bt curve doesn't span the
--     window (e.g. ror_at_4_00 on a roast dropped at 3:45).
--   - As-recorded inlet_curve sampled from /datapoints/ inlet_temp series,
--     complementing the existing inlet_curve column (which captures the
--     as-DESIGNED RoestProfile.temperature_bezier template — they diverge
--     when the operator nudges inlet temp mid-roast).
--
-- Plus the #R57 data backfill: historical roasts that have roest_notes
-- populated and color_description NULL get their Roest comment routed into
-- color_description (Chris uses the Roest notes field to record the actual
-- color descriptor post-CM200 measurement; the previous roest_notes routing
-- treated it as generic operator prose). The roasts.roest_notes column is
-- left in place for back-compat — future cleanup sprint may drop it.

ALTER TABLE roasts
  ADD COLUMN IF NOT EXISTS ror_at_2_30 numeric,
  ADD COLUMN IF NOT EXISTS ror_at_4_00 numeric,
  ADD COLUMN IF NOT EXISTS ror_at_fc_minus_30s numeric,
  ADD COLUMN IF NOT EXISTS inlet_curve_recorded text;

COMMENT ON COLUMN roasts.ror_at_2_30 IS
  'Rate of rise in °C/min at 2:30 since charge. Computed from /datapoints/ bt curve with a 30-second window centered on msec=150000 (bt at 2:45 - bt at 2:15) / 30 * 60. Drying-handoff check per Yunnan livestream (Dongzhe) Δ2 framing. NULL when datapoints data unavailable or drop_time < 2:45. Sprint 3.5.';
COMMENT ON COLUMN roasts.ror_at_4_00 IS
  'Rate of rise in °C/min at 4:00 since charge. Computed from /datapoints/ bt curve with a 30-second window centered on msec=240000 (bt at 4:15 - bt at 3:45) / 30 * 60. Approach-to-FC check. NULL when datapoints data unavailable or drop_time < 4:15. Sprint 3.5.';
COMMENT ON COLUMN roasts.ror_at_fc_minus_30s IS
  'Rate of rise in °C/min at FC-30s. Computed from /datapoints/ bt curve with a 30-second window centered on (firstcrack_event_msec - 30000). Cross-lot comparable post-hoc anchor that ignores when FC actually fires. NULL when firstcrack_event_msec is null, datapoints data unavailable, or the window straddles charge. Sprint 3.5.';
COMMENT ON COLUMN roasts.inlet_curve_recorded IS
  'As-recorded inlet temp curve sampled from /datapoints/ inlet_temp series. Display string mirroring inlet_curve format ("210°C at 0:00 -> 205°C at 1:00 -> ..."). Sister column to roasts.inlet_curve (which captures the as-DESIGNED RoestProfile.temperature_bezier template). The two columns diverge when the operator overrode the designed inlet during the roast. NULL when /datapoints/ data unavailable. Sprint 3.5.';

-- #R57 — historical color descriptors stored in roest_notes route into
-- color_description where the latter is NULL. Idempotent: COALESCE preserves
-- already-populated color_description values; only NULL targets are touched.
UPDATE roasts
SET color_description = roest_notes
WHERE roest_notes IS NOT NULL
  AND TRIM(roest_notes) <> ''
  AND color_description IS NULL;
