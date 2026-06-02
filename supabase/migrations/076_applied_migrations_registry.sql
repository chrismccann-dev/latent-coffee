-- 076_applied_migrations_registry.sql
-- Migration-drift gate baseline (repairs Sprint 3.2 #5).
--
-- WHY: migrations on this project are applied MANUALLY via the Supabase SQL
-- Editor, never via the Supabase CLI. So supabase_migrations.schema_migrations
-- (CLI-only) is empty and was always the wrong baseline for drift detection.
-- This table is the manual-apply flow's own receipt: each migration records
-- itself here as its last statement, and `npm run check:migrations` compares the
-- files on disk against this table.
--
-- CONVENTION (every migration NNN >= 076): end the file with --
--   INSERT INTO public.applied_migrations (filename) VALUES ('NNN_name.sql')
--   ON CONFLICT (filename) DO NOTHING;
-- A migration committed/merged but never pasted never runs its INSERT, so it
-- stays absent here and the gate flags it as pending. The check script also
-- statically lints that every >= 076 file contains its own self-register line.

CREATE TABLE IF NOT EXISTS public.applied_migrations (
  filename    text PRIMARY KEY,
  applied_at  timestamptz NOT NULL DEFAULT now()
);

-- Meta table, not user data. Lock it down: service_role (used by the gate)
-- bypasses RLS; anon / authenticated get no policy, so no access.
ALTER TABLE public.applied_migrations ENABLE ROW LEVEL SECURITY;

-- Backfill the currently-applied set (all 76 files through 075 verified applied
-- in prod at 2026-06-02: 074 brews.pours + 075 green_beans.optimized_brew_id
-- both present; 001-073 implied by a working app). Idempotent.
INSERT INTO public.applied_migrations (filename) VALUES
  ('001_initial_schema.sql'),
  ('002_add_cultivar_synthesis.sql'),
  ('003_add_cultivar_extended_fields.sql'),
  ('004_add_terroir_synthesis.sql'),
  ('005_backfill_brew_terroir_ids.sql'),
  ('006_data_integrity_cleanup.sql'),
  ('007_align_names_to_registry.sql'),
  ('008_add_missing_fields_and_consolidate_huila.sql'),
  ('009_backfill_terroir_character_fields.sql'),
  ('010_backfill_cultivar_behavior_fields.sql'),
  ('011_add_brews_producer.sql'),
  ('012_processes_aggregation.sql'),
  ('013_canonicalize_flavor_notes.sql'),
  ('014_roasters_aggregation.sql'),
  ('015_terroir_guatemala_reclassification.sql'),
  ('016_cultivar_canonicalization.sql'),
  ('017_cultivar_extended_field_backfill.sql'),
  ('018_canonicalize_producer.sql'),
  ('019_experiments_import.sql'),
  ('020_srh_washed_import.sql'),
  ('021_cultivar_registry_reconciliation.sql'),
  ('022_cultivar_content_backfill.sql'),
  ('023_terroir_registry_reconciliation.sql'),
  ('024_terroir_content_backfill.sql'),
  ('025_process_registry_decomposition.sql'),
  ('026_moonshadow_washed_correction.sql'),
  ('027_roaster_canonicalization.sql'),
  ('028_roast_level_canonicalization.sql'),
  ('029_grinder_taxonomy.sql'),
  ('030_grind_setting_canonicalization.sql'),
  ('031_producer_canonicalization.sql'),
  ('032_brewer_filter_canonicalization.sql'),
  ('033_flavor_taxonomy.sql'),
  ('034_cafec_packaging_names.sql'),
  ('035_extraction_strategy_v2_modifiers.sql'),
  ('036_api_keys.sql'),
  ('037_doc_proposals.sql'),
  ('038_strategy_notes.sql'),
  ('039_roasting_schema_enrichment.sql'),
  ('040_widen_roast_weights_to_numeric.sql'),
  ('041_cupping_recipe_variant.sql'),
  ('042_terroir_unique_includes_meso.sql'),
  ('043_oauth_authorization_codes.sql'),
  ('044_phase2_roast_schema.sql'),
  ('045_taxonomy_overrides_queue.sql'),
  ('046_cupping_sweetness_temperature_behavior.sql'),
  ('046_extraction_strategy_v8_4.sql'),
  ('047_track_2_bucket_a_fixes.sql'),
  ('048_track_2_pr3_drift_cleanup.sql'),
  ('049_track_2_pr4_cuppings_and_references.sql'),
  ('050_experiments_unstructured_fields.sql'),
  ('051_process_aggregation_syntheses.sql'),
  ('052_roast_recipes_and_experiments_redesign.sql'),
  ('053_green_beans_cleanup_backfill.sql'),
  ('054_one_shot_flag.sql'),
  ('055_cuppings_wb_agtron_delta.sql'),
  ('056_roasts_reference_candidate.sql'),
  ('057_roast_recipes_backfill_provenance.sql'),
  ('058_signature_method_hybrid_washed_deprecation.sql'),
  ('059_brews_fermentation_qualifiers.sql'),
  ('060_brewing_tolerance_rename_and_terroir_takeaway.sql'),
  ('061_roasts_fc_audibility.sql'),
  ('062_cuppings_character_relocation.sql'),
  ('063_taxonomy_queue_signature_method.sql'),
  ('064_roast_learnings_scope_tags.sql'),
  ('065_synthesis_cross_source_and_short_form.sql'),
  ('066_fc_audibility_did_not_fire.sql'),
  ('067_brews_filter_flat_2_fast_correction.sql'),
  ('068_did_not_fire_null_co_rule.sql'),
  ('069_green_beans_peer_reference_brew.sql'),
  ('070_roest_datapoints_parity.sql'),
  ('071_brew_water_recipe.sql'),
  ('072_bourbon_cultivar_content_backfill.sql'),
  ('073_blend_cultivar_rename.sql'),
  ('074_brews_pours_jsonb.sql'),
  ('075_green_beans_optimized_brew.sql')
ON CONFLICT (filename) DO NOTHING;

-- Self-register (the >= 076 convention).
INSERT INTO public.applied_migrations (filename) VALUES ('076_applied_migrations_registry.sql')
ON CONFLICT (filename) DO NOTHING;
