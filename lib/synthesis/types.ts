// Shared scaffolding for the per-entity directed synthesis pipeline.
// See app/api/{terroirs,cultivars,processes,roasters}/synthesize/route.ts
// for the consumers and lib/synthesis/adapters/* for the per-entity layer.

export type WeightTier = 'highest' | 'high' | 'medium' | 'low'

export interface WeightingEntry {
  weight: WeightTier
  label: string
  description: string
}

export interface EntityAdapter<TEntity = unknown> {
  type: 'terroir' | 'cultivar' | 'process' | 'roaster'

  // Noun for the entity itself ("roaster", "terroir region", "process style", "cultivar lineage").
  entityNoun: string

  // Noun for the synthesis output ("living roaster knowledge capsule", etc.).
  capsuleNoun: string

  // Render the registry / DB anchor as markdown injected into the prompt.
  // Returning null means no documented context exists yet.
  renderAnchor: (entity: TEntity) => string | null

  // Ordered weighting guidance (highest → low). Mirrors the weighting tables
  // in the four sample-output files Chris authored.
  weighting: WeightingEntry[]

  // Numbered output-format steps. Each becomes a numbered instruction in the
  // prompt; the model writes a paragraph per step plus a final bullet list.
  outputFormat: string[]

  // Entity-specific rules appended to SHARED_RULES in buildPrompt.
  extraRules?: string[]

  // Map a brew row to the JSON dict included in the prompt's data block.
  // Lets each adapter pull its own subset (cultivar includes cultivar_connection,
  // terroir includes terroir_connection, etc.).
  formatLearningRow: (brew: Record<string, unknown>) => Record<string, unknown>

  // SYN-6: optional cross-source companion. When present, runSynthesis pulls
  // roast_learnings rows joined through green_beans for the axis and passes
  // them through this formatter into a second JSON block in the prompt.
  // Process adapter intentionally omits this (the signature-join lift is
  // structurally zero today; see ADR-0010).
  formatRoastLearningRow?: (rl: Record<string, unknown>) => Record<string, unknown>
}

export interface BuildPromptInput<TEntity = unknown> {
  adapter: EntityAdapter<TEntity>
  entity: TEntity
  entityName: string
  brews: Record<string, unknown>[]
  // SYN-6: present when the adapter is cross-source (terroir / cultivar /
  // roaster). Omitted for process adapters and on empty axes.
  roastLearnings?: Record<string, unknown>[]
}
