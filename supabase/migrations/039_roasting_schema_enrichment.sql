-- Sprint 2.5 — Roasting MCP tools + ROASTING.md (2026-04-30)
--
-- Extends `roasts` and `green_beans` to capture V4-doc control signals + Roest
-- API cross-references. Closes the schema gap between Chris's authored roasting
-- reference (Coffee_Roasting_Master_Reference_Guide_V4.md) and the DB shape, so
-- push_roast Tool inputs map 1:1 onto stored columns instead of being squashed
-- into free-text `what_worked` / `what_to_change`.
--
-- Roasts additions (8 cols):
--   - roast_profile_name: the Roest profile template name (e.g. "Sudan Rume Washed - 119"
--     vs. distinct from profile_link which is the data-graph URL).
--   - tp_time, tp_temp: Turning Point time + temp. V4 doc: TP probe reads consistently
--     low (78-81°C) and is not actionable as primary diagnostic, but worth capturing
--     for diagnostic-trend analysis.
--   - yellowing_temp: pairs with existing yellowing_time. V4 standard 165°C.
--   - hopper_load_temp: V4 standard 125°C (was 120°C pre-Sudan-Rume-Washed). Primary
--     control lever per V4 retro on Sudan Rume Washed FC timing discovery.
--   - fan_curve, inlet_curve: shaped curves from Roest profile_data.fan_bezier /
--     temperature_bezier. Stored as text (display string from the bezier array)
--     since the structured form lives in the linked Roest profile.
--   - roest_log_id: cross-reference to api.roestcoffee.com /logs/{id}/. Lets the
--     pull_roest_log Tool round-trip (insert from Roest, later refresh fields).
--
-- Green_beans additions (6 cols):
--   - seller: distinct from importer (Roest API has both; spreadsheet has Seller +
--     Importer columns).
--   - exporter: supply chain origin party.
--   - elevation_m: integer meters. Roest /inventories/ returns this as `elevation`
--     numeric; we store as integer to match the existing terroirs.elevation_min/max
--     pattern.
--   - producer_tasting_notes: V2 onboarding protocol promoted this from optional to
--     required intake field per Roasting.md V2 retro (April 2026).
--   - additional_notes: catch-all for "Additional Notes from Producer" spreadsheet
--     column + Roest inventory long-form notes.
--   - roest_inventory_id: cross-reference to api.roestcoffee.com /inventories/{id}/.
--
-- Both Roest cross-ref columns are nullable (existing 4 green_beans + 61 roasts have
-- no Roest pairing recorded). Non-unique BTREE index for lookup; no unique constraint
-- because in theory the same Roest log/inventory could be pushed to multiple user
-- accounts (current single-tenant reality doesn't enforce this, but the column is
-- meant for cross-reference, not as a primary key).

ALTER TABLE roasts
  ADD COLUMN roast_profile_name text,
  ADD COLUMN tp_time text,
  ADD COLUMN tp_temp numeric,
  ADD COLUMN yellowing_temp numeric,
  ADD COLUMN hopper_load_temp numeric,
  ADD COLUMN fan_curve text,
  ADD COLUMN inlet_curve text,
  ADD COLUMN roest_log_id integer;

COMMENT ON COLUMN roasts.roast_profile_name IS
  'Roest profile template name (e.g. "Sudan Rume Washed - 119"). Distinct from profile_link (data-graph URL). Sprint 2.5.';
COMMENT ON COLUMN roasts.tp_time IS
  'Turning Point time as mm:ss text. V4 doc treats TP as not-actionable on this machine but captures for trend.';
COMMENT ON COLUMN roasts.tp_temp IS
  'Turning Point temp °C. V4: probe reads 78-81°C consistently — measurement artifact, not a primary lever.';
COMMENT ON COLUMN roasts.yellowing_temp IS
  'Bean temp at yellowing event. V4 standard target ~165°C. Pairs with yellowing_time.';
COMMENT ON COLUMN roasts.hopper_load_temp IS
  'Drum temp °C at hopper pre-load. V4 standard: 125°C. Primary control lever discovered during Sudan Rume Washed lot.';
COMMENT ON COLUMN roasts.fan_curve IS
  'Shaped fan curve as display string (e.g. "80% at 0:00 → 70% at 1:45 → 65% at 2:30 → 72% at 4:15 → 75% at 5:30"). Source: Roest profile fan_bezier.';
COMMENT ON COLUMN roasts.inlet_curve IS
  'Shaped inlet temp curve as display string (e.g. "200°C at 0:00 → 238°C at 1:15 → ..."). Source: Roest profile temperature_bezier.';
COMMENT ON COLUMN roasts.roest_log_id IS
  'Cross-reference to api.roestcoffee.com /logs/{id}/. Set by pull_roest_log Tool. Sprint 2.5.';

CREATE INDEX roasts_roest_log_id_idx ON roasts (roest_log_id) WHERE roest_log_id IS NOT NULL;

ALTER TABLE green_beans
  ADD COLUMN seller text,
  ADD COLUMN exporter text,
  ADD COLUMN elevation_m integer,
  ADD COLUMN producer_tasting_notes text,
  ADD COLUMN additional_notes text,
  ADD COLUMN roest_inventory_id integer;

COMMENT ON COLUMN green_beans.seller IS
  'Direct seller (e.g. Sweet Maria''s, Cafe Imports). Distinct from importer (often the same but not always). Sprint 2.5.';
COMMENT ON COLUMN green_beans.exporter IS
  'Supply chain exporter (often the producer or producer''s exporting cooperative). Sprint 2.5.';
COMMENT ON COLUMN green_beans.elevation_m IS
  'Lot elevation in meters. Sourced from green bean spec sheet or Roest /inventories/{id}/.elevation.';
COMMENT ON COLUMN green_beans.producer_tasting_notes IS
  'Producer/seller-supplied tasting notes. V2 onboarding protocol promoted this from optional to required intake field.';
COMMENT ON COLUMN green_beans.additional_notes IS
  'Catch-all for additional producer / processing / history notes that don''t fit other fields.';
COMMENT ON COLUMN green_beans.roest_inventory_id IS
  'Cross-reference to api.roestcoffee.com /inventories/{id}/. Set by push_green_bean Tool when populated from Roest. Sprint 2.5.';

CREATE INDEX green_beans_roest_inventory_id_idx ON green_beans (roest_inventory_id) WHERE roest_inventory_id IS NOT NULL;
