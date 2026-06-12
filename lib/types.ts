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
  short_form_capsule: string | null
  synthesis_input_max_updated_at: string | null
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
  short_form_capsule: string | null
  synthesis_input_max_updated_at: string | null
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
  // Producer/seller-supplied intake fields (migration 039). All typed here as
  // of the 2026-06-05 schema-vs-type drift scan. Standing rule (reversing the
  // old "type as a consumer adopts them" policy): every DB column on a modeled
  // table is typed here — enforced by `npm run check:types-vs-schema`.
  producer_tasting_notes: string | null
  seller: string | null
  exporter: string | null
  elevation_m: number | null
  additional_notes: string | null
  roest_inventory_id: number | null
  // One-shot lot flag (migration 054): single-batch sample (~100-120g, no
  // iteration possible). Drives the one-shot prompt family + the
  // lever-attribution guardrails on roast_learnings. NOT NULL, defaults false.
  is_one_shot: boolean
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
  // Phase 2 Item 17 (migration 069, 2026-05-24): nullable FK to brews(id)
  // for the peer-roasted reference brew of the same green-bean lot.
  // ~25-30%+ of lots have one (calibration anchor for the roasting side).
  // ON DELETE SET NULL on the FK constraint.
  peer_reference_brew_id: string | null
  // Cluster A / MB-7 (migration 075, 2026-06-01): nullable FK to brews(id)
  // for the lot's own canonical optimized brew. Sibling to
  // peer_reference_brew_id; set at close-lot, replaces the pickOptimizedBrew
  // heuristic. ON DELETE SET NULL. See ADR-0019.
  optimized_brew_id: string | null
  // Lot Coordinator dogfood (migration 080, ADR-0024 § 6): stored lifecycle
  // status. NULL = pre-080 row, renders via the derived fallback
  // (lib/lifecycle-state.ts resolveLifecycleState). Maintained by the MCP
  // write path only (single-write-path guardrail); value set mirrors
  // LOT_STATUS_VALUES.
  lot_status: string | null
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
  // Schema sprint S2 (migration 056, 2026-05-18): forward-looking quality flag
  // during V-set iteration. TRUE on leading slots that could plausibly become
  // the lot reference at close-out. Distinct from is_reference (lot-level
  // final, set at close-out — candidate does NOT auto-flip to is_reference).
  // Distinct from worth_repeating (judgment axis on the recipe).
  is_reference_candidate: boolean
  drum_direction: string | null
  charge_temp: number | null
  // Phase 2 enrichments (migration 044)
  roest_notes: string | null
  end_condition_type: 'bean_temp' | 'dev_time' | 'manual' | null
  end_condition_target: number | null
  fc_total_cracks: number | null
  // Sprint 11 (migration 061, 2026-05-20): 4-value enum capturing FC audibility.
  // Three of four (subtle / silent / ambiguous) trigger the same downstream
  // protocol (bean-temp end condition + drop-ceiling-primary + Agtron as
  // proxies); the distinction matters for cause attribution. See CONTEXT-roasting.md
  // § FC audibility state. Historical 135 roasts left NULL per RO-CP-3.
  fc_audibility: 'audible' | 'subtle' | 'silent' | 'ambiguous' | null
  // Sub Pages 6.1 (migration 052, 2026-05-13): FK to roast_recipes — the
  // design intent that this roast executed. Nullable through Phase 3 of the
  // roasting-redesign migration plan. See docs/roasting/redesign.md § 4.4.
  recipe_id: string | null
  // Roest-pull server-populated curves + timeline, written by pull_roest_log.
  // Typed here as of the 2026-06-05 schema-vs-type drift scan. fan_curve /
  // inlet_curve / tp_temp / tp_time / yellowing_temp / roest_log_id /
  // roast_profile_name / hopper_load_temp = migration 039; inlet_curve_recorded
  // + the three ror_at_* sample points = migration 070 (Roest datapoints parity).
  fan_curve: string | null
  inlet_curve: string | null
  inlet_curve_recorded: string | null
  roast_profile_name: string | null
  roest_log_id: number | null
  hopper_load_temp: number | null
  tp_temp: number | null
  tp_time: string | null
  yellowing_temp: number | null
  ror_at_2_30: number | null
  ror_at_4_00: number | null
  ror_at_fc_minus_30s: number | null
  created_at: string
  updated_at: string
  // Joined data
  cuppings?: Cupping[]
  recipe?: RoastRecipe
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
  // Migration 050 (Round-4 dogfood): unstructured-prose + open-questions +
  // confidence on key_insight. All nullable, backfill not required.
  additional_notes: string | null
  open_questions: string | null
  key_insight_confidence: string | null
  // Sub Pages 6.1 (migration 052, 2026-05-13): 16 cross-batch fields for the
  // four temporal write moments of the iterative roasting workflow. See
  // docs/roasting/redesign.md § 4.2. updated_cup_prediction_* written between
  // roast and cupping (post-roast actuals inform the cup prediction).
  // taste_for_* are the cupping-table questions per batch. delta_from_roast_*
  // reconcile recipe-predicted vs roast-actual. delta_from_cup_* reconcile
  // updated-cup-prediction vs cup-actual. Legacy observed_outcome_a-d +
  // expected_outcomes stay populated through Phase 3 — semantic relabel
  // happens at cleanup, not now.
  updated_cup_prediction_a: string | null
  updated_cup_prediction_b: string | null
  updated_cup_prediction_c: string | null
  updated_cup_prediction_d: string | null
  taste_for_a: string | null
  taste_for_b: string | null
  taste_for_c: string | null
  taste_for_d: string | null
  delta_from_roast_a: string | null
  delta_from_roast_b: string | null
  delta_from_roast_c: string | null
  delta_from_roast_d: string | null
  delta_from_cup_a: string | null
  delta_from_cup_b: string | null
  delta_from_cup_c: string | null
  delta_from_cup_d: string | null
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
  // Free-text recipe-variant label (migration 041) — distinguishes cuppings of
  // the same roast evaluated under different brew/prep variants.
  recipe_variant: string | null
  ground_agtron: number | null
  ground_color_description: string | null
  aroma: string | null
  flavor: string | null
  acidity: string | null
  // Migration 046 (2026-05-07, cupping_sweetness_temperature_behavior): distinct
  // axis from body / overall. Surfaced via MCP in Schema sprint S3 (2026-05-18).
  sweetness: string | null
  body: string | null
  finish: string | null
  overall: string | null
  // Migration 046: parallel to brews.temperature_evolution — direction / when /
  // what changes prose across the cooling arc. Surfaced via MCP in Schema sprint S3.
  temperature_behavior: string | null
  // Schema sprint S1 (migration 055, 2026-05-18): WB→Ground delta queryability.
  // wb_agtron snapshots roasts.agtron at push_cupping time (drift-tolerant per
  // patch_cupping override). wb_to_ground_delta is a generated column (STORED)
  // from (wb_agtron - ground_agtron) — read-only on writes.
  wb_agtron: number | null
  wb_to_ground_delta: number | null
  // Sprint 11 (migration 062, 2026-05-20): two prose axes relocated from
  // roast_learnings per ADR-0008. They describe what a cup IS (per-tasting
  // observation), not what a lot TAUGHT (lot-aggregate lesson). 7 closed
  // lots backfilled to the canonical pourover cupping on each lot's
  // best_roast_id. See CONTEXT-roasting.md § Cup character.
  aromatic_behavior: string | null
  structural_behavior: string | null
  // Cluster 2 (migration 078, 2026-06-04): canonical cooling-arc shape enum,
  // independent of the temperature_behavior prose. Lets cross-lot "which lots
  // cooling-arc degrade vs hold" be queryable. Historical cuppings left NULL.
  cooling_arc_pattern: 'degrade' | 'hold' | 'improve' | 'flat' | null
  created_at: string
  updated_at: string
}

export interface RoastLearning {
  id: string
  user_id: string
  green_bean_id: string
  // Legacy free-text identifier (e.g. "133", "Batch 139"). Kept populated
  // through Phase 3 of the roasting-redesign migration; new writes should
  // prefer best_roast_id (typed FK) below.
  best_batch_id: string | null
  // Sub Pages 6.1 (migration 052, 2026-05-13): typed FK to the winning roast
  // execution. Per docs/roasting/redesign.md § 9.3, the reference points at
  // a specific execution, not the design intent. Backfilled cleanly from
  // best_batch_id via regex strip + JOIN; new writes populate both fields
  // until Phase 3 drops the text column.
  best_roast_id: string | null
  why_this_roast_won: string | null
  // Sprint 11 (migration 062, 2026-05-20): aromatic_behavior + structural_behavior
  // relocated to cuppings per ADR-0008 — they describe a cup, not a lot.
  brewing_tolerance: string | null
  roast_window_width: string | null
  primary_lever: string | null
  secondary_levers: string | null
  what_didnt_move_needle: string | null
  underdevelopment_signal: string | null
  overdevelopment_signal: string | null
  cultivar_takeaway: string | null
  terroir_takeaway: string | null
  general_takeaway: string | null
  reference_roasts: string | null
  starting_hypothesis: string | null
  rest_behavior: string | null
  // Sprint 12 (migration 064, 2026-05-21): per-field scope_tags arrays.
  // Loose-canonical prefix convention (process:washed / variety:sudan-rume /
  // country:colombia / etc.) lets cross-lot queries surface "what applies to
  // washed Colombians" without scraping prose. See ADR-0009.
  cultivar_takeaway_scope_tags: string[]
  terroir_takeaway_scope_tags: string[]
  general_takeaway_scope_tags: string[]
  starting_hypothesis_scope_tags: string[]
  created_at: string
  updated_at: string
}

// Sub Pages 6.1 (migration 052, 2026-05-13): first-class entity for per-batch
// design intent. One row per Roest profile pushed (each batch execution = one
// recipe, even when curves are identical — matches how the Roest tablet stores
// profiles). See docs/roasting/redesign.md § 4.3 for the full field rationale.
export interface RoastRecipe {
  id: string
  user_id: string
  green_bean_id: string
  // Nullable so calibration / one-off recipes outside the V-set framing can
  // still create a recipe row.
  experiment_id: string | null
  // Lineage pointer: "v3a replicates v2b" → parent_recipe_id = v2b's id.
  // Not constrained; some recipes are genuinely novel, others are pure
  // replication. See § 8 of the redesign doc.
  parent_recipe_id: string | null
  recipe_name: string | null
  // "v1a" / "v2b" / "v3c" within its experiment set; null for one-off recipes.
  batch_slot: string | null
  // Per-batch Hypothesis prose (mockup "Hypothesis" row). Distinct from
  // notes — rationale is the "why this specific recipe" reasoning.
  rationale: string | null
  // General free-text catch-all for per-recipe notes.
  notes: string | null
  // Curve definition (bezier jsonb — same shape as push_roast_profile).
  temperature_bezier: unknown | null
  fan_bezier: unknown | null
  rpm_bezier: unknown | null
  power_bezier: unknown | null
  end_condition_type: string | null
  end_condition_target: number | null
  preheat_temperature_c: number | null
  charge_temp: number | null
  hopper_load_temp: number | null
  // Design-time predictions (frozen at recipe creation, not updated post-roast).
  predicted_fc_temp: number | null
  predicted_fc_time: string | null
  predicted_total_time: string | null
  predicted_maillard_pct: number | null
  predicted_agtron_wb: number | null
  // Frozen design-time cup prediction. The post-roast update goes to
  // experiments.updated_cup_prediction_* — see § 4.2 of the redesign doc for
  // the two-moment storage rationale.
  predicted_cup: string | null
  // Mockup "Drop Rules" card (two rows × N batches).
  drop_rule_if_fast: string | null
  drop_rule_if_slow: string | null
  // Roest linkage — populated when push_roast_profile sends the recipe to
  // the Roest tablet. Phase 2 of the redesign doc § 7 wires push_roast_profile
  // to set these fields on the matching roast_recipes row.
  roest_profile_id: number | null
  roest_share_url: string | null
  roest_profile_name: string | null
  pushed_to_roest_at: string | null
  // Schema sprint S4 (migration 057, 2026-05-18): provenance for backfilled
  // recipes. was_backfilled TRUE when the row was authored as backfill (design
  // intent recovered after the roast — log-cupping.md STAGE 0 inline-backfill,
  // operational backfill prompts, or migration 052's 1:1 legacy backfill).
  // backfill_notes captures source + date prose. FALSE for design-time recipes
  // pushed via push_roast_recipe before the roast.
  was_backfilled: boolean
  backfill_notes: string | null
  created_at: string
  updated_at: string
  // Joined data
  experiment?: Experiment
  parent_recipe?: RoastRecipe
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
  // Orthogonal annotations on fermentation modifiers (e.g. Anoxic on Anaerobic).
  // Sprint T3 / CR-5 migration 059 / 2026-05-18. Canonical today: ['Anoxic'].
  fermentation_qualifiers: string[]
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
  // data-model session (migration 074, 2026-05-30 / BS-1): structured pour
  // steps. Canonical forward shape; /brews/[id] renders this when present,
  // else falls back to parsing legacy bloom + pour_structure. NULL = legacy
  // row not yet re-pushed structured. See lib/pour-structure.ts PourStep.
  pours: import('./pour-structure').PourStep[] | null
  // Sub-sprint 4c Bundle A (migration 071, 2026-05-28): free-text water formula
  // / source ("Third Wave Water Light Roast ~1:3 concentrate:distilled", "office
  // tap"). No canonical registry today; renders as a labeled line under the
  // 6-cell SspRecipeHead strip on /brews/[id].
  water_recipe: string | null
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
  // Sub-sprint 4c Bundle A (2026-05-28): MODIFIER_TYPES grew to 5. Added
  // `equipment` (persistent/timed gear beyond brewer+filter — Melodrip / booster
  // / Paragon ball; {name, scope?} where scope is free-text "throughout" /
  // "bloom + P1"). Also renamed `inverted_temperature_staging` -> `thermal_staging`
  // (alias-safe: cleanModifiers normalizes the legacy type; it now covers both
  // kettle thermal stance — off-after-bloom natural drop — and active ramps).
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
export type InsertRoast = Omit<Roast, 'id' | 'created_at' | 'updated_at' | 'cuppings' | 'recipe'>
export type InsertBrew = Omit<Brew, 'id' | 'created_at' | 'updated_at' | 'green_bean' | 'roast' | 'terroir' | 'cultivar'>
export type InsertCupping = Omit<Cupping, 'id' | 'created_at' | 'updated_at'>
export type InsertExperiment = Omit<Experiment, 'id' | 'created_at' | 'updated_at'>
export type InsertTerroir = Omit<Terroir, 'id' | 'created_at' | 'updated_at'>
export type InsertCultivar = Omit<Cultivar, 'id' | 'created_at' | 'updated_at'>
export type InsertRoastLearning = Omit<RoastLearning, 'id' | 'created_at' | 'updated_at'>
export type InsertRoastRecipe = Omit<RoastRecipe, 'id' | 'created_at' | 'updated_at' | 'experiment' | 'parent_recipe'>
