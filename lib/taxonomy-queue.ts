// Taxonomy overrides queue — shared insert + lookup helpers.
//
// Phase 3 (sprint, 2026-05-05). Queue is the canonical-side analog of
// doc_proposals: claude.ai pushes a brew/green_bean/roast with an
// allowOverride flag → persistBrew / persistGreenBean / persistRoast collect
// override-resolution results from the 5 text-only findOrCreate* helpers →
// post-insert, this module fires queue rows. Chris-as-arbiter walks
// list_taxonomy_queue + Edits the registry + calls resolve_queue_entry.
//
// Inserts are best-effort: the queue is a side-channel signal, not a
// load-bearing transactional dependency. If the queue insert fails (RLS
// drift, transient DB error), the brew row stays committed; the failure is
// logged. Auto-collapse on (user, axis, lower(raw_value)) duplicate via the
// EXCLUDE constraint shipped in migration 045 — duplicate-key violations
// surface as a duplicate insert and are caught here so the caller still gets
// the existing pending row's id.

import type { SupabaseClient } from '@supabase/supabase-js'

export type QueueAxis =
  | 'producer'
  | 'roaster'
  | 'brewer'
  | 'filter'
  | 'grinder'
  | 'terroir'
  | 'cultivar'
  // Sprint 12 / MCP-1 (2026-05-21, migration 063): signature_method joins as
  // the 8th override-eligible axis. push_brew.signature_method_override is the
  // override-flag path; propose_canonical_addition is the manual_propose path.
  | 'signature_method'

export type QueueSourceKind = 'brew' | 'green_bean' | 'roast' | 'manual'

export type QueueSubmissionPath = 'override_flag' | 'manual_propose'

export interface QueueInsertInput {
  axis: QueueAxis
  raw_value: string
  submission_path: QueueSubmissionPath
  source_kind: QueueSourceKind
  source_id: string | null
  evidence?: Record<string, unknown> | null
}

export interface QueuedEntry {
  axis: QueueAxis
  raw_value: string
  queue_id: string
}

/**
 * Insert a single queue row. Returns the inserted (or existing duplicate's)
 * row id. The DB has an EXCLUDE constraint on
 * (user_id, axis, lower(raw_value)) WHERE status='pending', so a second push
 * of the same net-new value either finds the existing row (we look up first)
 * or fails on the constraint (we re-look up and return that id).
 */
export async function insertQueueRow(
  supabase: SupabaseClient,
  userId: string,
  input: QueueInsertInput,
): Promise<{ ok: true; queue_id: string; created: boolean } | { ok: false; error: string }> {
  const trimmed = input.raw_value.trim()
  if (!trimmed) return { ok: false, error: 'raw_value is empty' }

  // Look up first to avoid relying on duplicate-violation exception parsing
  // (supabase-js doesn't expose constraint codes uniformly across drivers).
  const { data: existing, error: lookupErr } = await supabase
    .from('taxonomy_overrides_queue')
    .select('id')
    .eq('user_id', userId)
    .eq('axis', input.axis)
    .eq('status', 'pending')
    .ilike('raw_value', trimmed)
    .maybeSingle()
  if (lookupErr) return { ok: false, error: lookupErr.message }
  if (existing?.id) return { ok: true, queue_id: existing.id as string, created: false }

  const { data: inserted, error: insertErr } = await supabase
    .from('taxonomy_overrides_queue')
    .insert({
      user_id: userId,
      axis: input.axis,
      raw_value: trimmed,
      submission_path: input.submission_path,
      source_kind: input.source_kind,
      source_id: input.source_id,
      evidence: input.evidence ?? null,
    })
    .select('id')
    .single()
  if (insertErr || !inserted) {
    // Race: another concurrent insert won the EXCLUDE check. Re-lookup.
    const { data: retry } = await supabase
      .from('taxonomy_overrides_queue')
      .select('id')
      .eq('user_id', userId)
      .eq('axis', input.axis)
      .eq('status', 'pending')
      .ilike('raw_value', trimmed)
      .maybeSingle()
    if (retry?.id) return { ok: true, queue_id: retry.id as string, created: false }
    return { ok: false, error: insertErr?.message ?? 'insert + retry both failed' }
  }
  return { ok: true, queue_id: inserted.id as string, created: true }
}

/**
 * Fire queue rows for every (axis, value) where override was taken AND the
 * value didn't resolve canonically. Best-effort: failures are logged, never
 * thrown. Returns the queued entries shaped for the push tool's response
 * echo (queued_for_taxonomy_review[]).
 *
 * Use after a brew / green_bean / roast row has landed — the source_id
 * needs to point at a real row.
 */
export async function fireQueueInserts(
  supabase: SupabaseClient,
  userId: string,
  candidates: ReadonlyArray<{
    axis: QueueAxis
    raw_value: string | null | undefined
    needsQueue: boolean
  }>,
  source: { kind: QueueSourceKind; id: string | null },
  submission_path: QueueSubmissionPath = 'override_flag',
): Promise<QueuedEntry[]> {
  const queued: QueuedEntry[] = []
  for (const c of candidates) {
    if (!c.needsQueue) continue
    const value = (c.raw_value ?? '').trim()
    if (!value) continue
    const result = await insertQueueRow(supabase, userId, {
      axis: c.axis,
      raw_value: value,
      submission_path,
      source_kind: source.kind,
      source_id: source.id,
    })
    if (!result.ok) {
      console.error(
        `[taxonomy_queue] insert failed for ${c.axis}="${value}" (source_kind=${source.kind}, source_id=${source.id}): ${result.error}`,
      )
      continue
    }
    queued.push({ axis: c.axis, raw_value: value, queue_id: result.queue_id })
  }
  return queued
}
