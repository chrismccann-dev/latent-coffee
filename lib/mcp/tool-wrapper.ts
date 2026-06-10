// Sprint 3.2 (item #11) — defensive error wrapper for MCP Tool handlers.
//
// Today some handlers throw bare errors; the MCP SDK marshals the throw into
// a JSON-RPC error response (good for claude.ai) but production logs lose the
// "which Tool failed" attribution. Wrap each handler through this to add a
// `[tool_name] <err>` log line, then re-throw so the SDK's existing
// JSON-RPC error path still runs. Re-throw is non-negotiable: swallowing
// would turn a failure into a silent success.

export function withToolErrorLogging<H extends (...args: any[]) => any>(
  toolName: string,
  handler: H,
): H {
  return (async (...args: Parameters<H>) => {
    try {
      return await handler(...args)
    } catch (err) {
      console.error(`[${toolName}]`, err instanceof Error ? err.message : err)
      throw err
    }
  }) as H
}

// Audit-06 candidate 4 — the shared tool-tail helpers. Every push/patch Tool
// used to hand-roll the same three blocks; the error-message strings below are
// load-bearing (claude.ai parses them to decide its retry behavior), so any
// change here propagates to every Tool at once — deliberately.

// The fail variants of PersistFail (validation | db_error) and
// PatchResult (validation | no_op | not_found | db_error) both narrow here.
export type ToolFailResult =
  | { ok: false; code: 'validation'; errors: string[] }
  | { ok: false; code: 'db_error' | 'no_op' | 'not_found'; message: string }

// Declared `never` so callers get control-flow narrowing:
// `if (!result.ok) throwToolFail(result)` leaves `result` narrowed to ok.
export function throwToolFail(result: ToolFailResult): never {
  if (result.code === 'validation') {
    throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
  }
  if (result.code === 'no_op' || result.code === 'not_found') {
    throw new Error(result.message)
  }
  throw new Error(`Database error: ${result.message}`)
}

// The standard MCP success envelope: JSON text content + structuredContent.
export function toolJson<T extends Record<string, unknown>>(out: T) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(out) }],
    structuredContent: out,
  }
}

// Patch-tool diff echo (Round-5 dogfood symmetry sweep, 2026-05-10): report
// which of the entity's PATCH_FIELDS were actually present in the payload.
export function echoUpdatedFields(payload: object, fields: readonly string[]): string[] {
  const obj = payload as Record<string, unknown>
  return fields.filter((k) => k in obj && obj[k] !== undefined)
}
