// Database types - generated from schema
// These match your Supabase tables

export interface Profile {
  id: string
  email: string | null
  display_name: string | null
  created_at: string
  updated_at: string
}

export interface Terroir {
  id: string
  user_id: string
  country: string
  admin_region: string | null
  macro_terroir: string | null
  meso_terroir: string | null
  elevation_min: number | null
  elevation_max: number | null
  climate_stress: string | null
  soil: string | null
  context: string | null
  cup_profile: string | null
  why_it_stands_out: string | null
  acidity_character: string | null
  body_character: string | null
  farming_model: string | null
  dominant_varieties: string[] | null
  typical_processing: string[] | null
  synthesis: string | null
  synthesis_brew_count: number | null
  created_at: string
  updated_at: string
}

export interface Cultivar {
  id: string
  user_id: string
  species: string
  genetic_family: string | null
  lineage: string | null
  cultivar_name: string
  cultivar_raw: string | null
  cultivar_notes: string | null
  cultivar_confidence: string | null
  cultivar_source: string | null
  genetic_background: string | null
  typical_origins: string[] | null
  limiting_factors: string[] | null
  altitude_sensitivity: string | null
  terroir_transparency: string | null
  common_processing_methods: string[] | null
  typical_flavor_notes: string[] | null
  acidity_style: string | null
  body_style: string | null
  aromatics: string | null
  extraction_sensitivity: string | null
  roast_tolerance: string | null
  brewing_tendencies: string | null
  common_pitfalls: string[] | null
  roast_behavior: string | null
  resting_behavior: string | null
  market_context: string | null
  synthesis: string | null
  synthesis_brew_count: number | null
  created_at: string
  updated_at: string
}

export interface GreenBean {
  id: string
  user_id: string
  lot_id: string
  name: string
  producer: string | null
  origin: string | null
  region: string | null
  variety: string | null
  process: string | null
  importer: string | null
  source_type: string | null
  link: string | null
  purchase_date: string | null
  price_per_kg: number | null
  quantity_g: number | null
  moisture: string | null
  density: string | null
  terroir_id: string | null
  cultivar_id: string | null
  // Phase 3 (migration 045): canonical-vs-auto_created flag for FK rows.
  // 'canonical' = lookup hit an existing row; 'auto_created' = this insert
  // materialized the FK row. Forward-looking; historical rows default to
  // 'canonical' (we don't retro-flag pre-Phase-3 auto-creates).
  terroir_provenance: 'canonical' | 'auto_created'
  cultivar_provenance: 'canonical' | 'auto_created'
  // Bumped whenever terroir_id / cultivar_id changes via patch_green_bean
  // or future canonical re-resolution. NULL on rows whose canonicals have
  // not been re-resolved post-original-insert.
  canonicals_updated_at: string | null
  created_at: string
  updated_at: string
  // Joined data
  terroir?: Terroir
  cultivar?: Cultivar
  roasts?: Roast[]
  roast_learnings?: RoastLearning
}

export interface Roast {
  id: string
  user_id: string
  green_bean_id: string
  batch_id: string
  roast_date: string | null
  coffee_name: string | null
  profile_link: string | null
  batch_size_g: number | null
  roasted_weight_g: number | null
  weight_loss_pct: number | null
  agtron: number | null
  color_description: string | null
  yellowing_time: string | null
  fc_start: string | null
  fc_temp: number | null
  drop_time: string | null
  drop_temp: number | null
  dev_time_s: number | null
  dev_ratio: string | null
  what_worked: string | null
  what_didnt: string | null
  what_to_change: string | null
  // Phase 2 (#R62, migration 044): tristate text. Use 'yes' | 'no' | 'pending'.
  // Pre-migration data was boolean; migration coerced true -> 'yes', false -> 'no'.
  worth_repeating: 'yes' | 'no' | 'pending' | null
  is_reference: boolean
  drum_direction: string | null
  charge_temp: number | null
  // Phase 2 enrichments (migration 044)
  roest_notes: string | null
  end_condition_type: 'bean_temp' | 'dev_time' | 'manual' | null
  end_condition_target: number | null
  fc_total_cracks: number | null
  created_at: string
  updated_at: string
  // Joined data
  cuppings?: Cupping[]
}

export interface Experiment {
  id: string
  user_id: string
  green_bean_id: string
  experiment_id: string
  batch_ids: string | null
  context: string | null
  primary_question: string | null
  control_baseline: string | null
  shared_constants: string | null
  variable_changed: string | null
  levels_tested: string | null
  expected_outcomes: string | null
  failure_boundary: string | null
  observed_outcome_a: string | null
  observed_outcome_b: string | null
  observed_outcome_c: string | null
  observed_outcome_d: string | null
  winner: string | null
  key_insight: string | null
  what_changes_going_forward: string | null
  created_at: string
  updated_at: string
}

export interface Cupping {
  id: string
  user_id: string
  roast_id: string
  cupping_date: string | null
  rest_days: number | null
  eval_method: string | null
  ground_agtron: number | null
  ground_color_description: string | null
  aroma: string | null
  flavor: string | null
  acidity: string | null
  body: string | null
  finish: string | null
  overall: string | null
  created_at: string
  updated_at: string
}

export interface RoastLearning {
  id: string
  user_id: string
  green_bean_id: string
  best_batch_id: string | null
  why_this_roast_won: string | null
  aromatic_behavior: string | null
  structural_behavior: string | null
  elasticity: string | null
  roast_window_width: string | null
  primary_lever: string | null
  secondary_levers: string | null
  what_didnt_move_needle: string | null
  underdevelopment_signal: string | null
  overdevelopment_signal: string | null
  cultivar_takeaway: string | null
  general_takeaway: string | null
  reference_roasts: string | null
  starting_hypothesis: string | null
  rest_behavior: string | null
  created_at: string
  updated_at: string
}

export interface Brew {
  id: string
  user_id: string
  source: 'self-roasted' | 'purchased'
  green_bean_id: string | null
  roast_id: string | null
  terroir_id: string | null
  cultivar_id: string | null
  coffee_name: string
  roaster: string | null
  producer: string | null
  variety: string | null
  process: string | null
  base_process: string
  subprocess: string | null
  fermentation_modifiers: string[]
  drying_modifiers: string[]
  intervention_modifiers: string[]
  experimental_modifiers: string[]
  decaf_modifier: string | null
  signature_method: string | null
  roast_level: string | null
  flavor_notes: string[] | null
  flavors: import('./flavor-registry').FlavorChip[]
  structure_tags: string[]
  brewer: string | null
  filter: string | null
  dose_g: number | null
  water_g: number | null
  ratio: string | null
  grind: string | null
  grinder: string | null
  grind_setting: string | null
  temp_c: number | null
  bloom: string | null
  pour_structure: string | null
  total_time: string | null
  extraction_strategy: string | null
  // v8.4 (migration 046, 2026-05-06): conditional sub-form. Required (text
  // value, code-side enforced) when extraction_strategy = 'Hybrid'; NULL
  // otherwise. Canonical: see lib/hybrid-subform.ts.
  hybrid_subform: string | null
  extraction_confirmed: string | null
  // Free-text within-strategy gradient + miscellaneous recipe nuance that
  // does not fit the canonical extraction_strategy enum (e.g. "lower edge
  // of Balanced Intensity"). Distinct from extraction_confirmed (cross-
  // strategy divergence). Migration 038, 2026-04-29.
  strategy_notes: string | null
  // v8.4 (migration 046): free-text Step-1d named consideration. Default
  // null = normal cooling progression. Populated when peak evaluation
  // window IS the strategy (e.g. "40-45°C peak", "evaluate below 50°C").
  cooling_curve_target: string | null
  // Sprint Extraction Strategy v2 (2026-04-27): Axis 2 modifier array.
  // jsonb column on brews; default []. See lib/extraction-modifiers.ts for shape.
  // v8.4 (2026-05-06): MODIFIER_TYPES dropped from 4 -> 3 (Immersion absorbed
  // into the Hybrid strategy; remaining: output_selection, inverted_temperature_staging,
  // aroma_capture).
  // v8.5 (2026-05-08): MODIFIER_TYPES grew back from 3 -> 4 with the addition
  // of role_based_pulse for assigning per-pour sensory roles on
  // percolation-only brewers (Justin Bull 2025 Phase-Mapped Hybrid analog
  // when no immersion phase is involved). The shape mirrors aroma_capture:
  // type + free-text "roles" field. OUTPUT_SELECTION_FORMS also grew 3 -> 4
  // with `dilution` (post-brew dilution; carries optional `dilution_g` on
  // OutputSelectionModifier).
  modifiers: import('./extraction-modifiers').Modifier[]
  aroma: string | null
  attack: string | null
  mid_palate: string | null
  body: string | null
  finish: string | null
  temperature_evolution: string | null
  peak_expression: string | null
  key_takeaways: string[] | null
  classification: string | null
  terroir_connection: string | null
  cultivar_connection: string | null
  roast_connection: string | null
  is_process_dominant: boolean
  process_category: string | null
  process_details: string | null
  what_i_learned: string | null
  // Phase 3 (migration 045): canonical-vs-auto_created flag for FK rows.
  terroir_provenance: 'canonical' | 'auto_created'
  cultivar_provenance: 'canonical' | 'auto_created'
  created_at: string
  updated_at: string
  // Joined data
  green_bean?: GreenBean
  roast?: Roast
  terroir?: Terroir
  cultivar?: Cultivar
}

// Insert types (omit auto-generated fields)
export type InsertGreenBean = Omit<GreenBean, 'id' | 'created_at' | 'updated_at' | 'terroir' | 'cultivar' | 'roasts' | 'roast_learnings'>
export type InsertRoast = Omit<Roast, 'id' | 'created_at' | 'updated_at' | 'cuppings'>
export type InsertBrew = Omit<Brew, 'id' | 'created_at' | 'updated_at' | 'green_bean' | 'roast' | 'terroir' | 'cultivar'>
export type InsertCupping = Omit<Cupping, 'id' | 'created_at' | 'updated_at'>
export type InsertExperiment = Omit<Experiment, 'id' | 'created_at' | 'updated_at'>
export type InsertTerroir = Omit<Terroir, 'id' | 'created_at' | 'updated_at'>
export type InsertCultivar = Omit<Cultivar, 'id' | 'created_at' | 'updated_at'>
export type InsertRoastLearning = Omit<RoastLearning, 'id' | 'created_at' | 'updated_at'>
