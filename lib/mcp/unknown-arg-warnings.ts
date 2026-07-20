// Silent-drop guardrail for MCP Tool arguments (brew-session friction, 2026-07-20).
//
// The MCP SDK validates each tool call's `arguments` against the tool's zod
// input schema, and zod's default object parse STRIPS unknown keys rather than
// erroring. So a mistyped field name — e.g. `extraction_strategy_notes` for the
// real `strategy_notes` — is silently dropped: push_brew returns success, an
// empty `warnings[]`, and the value never lands. The typo cost a real brew its
// strategy_notes before it was caught by eye.
//
// The handler never sees the stripped key (zod removed it before the callback
// runs), so the ONLY place to catch it is at the tools/call boundary, before the
// strip. This wraps the SDK's private tools/call request handler — the same
// single-point private access installPublishedSchemaCompat makes for tools/list
// and collectToolDescriptors makes for _registeredTools — and, on a SUCCESSFUL
// call that carried top-level argument keys absent from the tool's schema,
// appends a warning:
//   - into structuredContent.warnings when that surface exists (every push_* /
//     patch_* tool returns a stable warnings[] array for exactly this signal),
//     keeping the toolJson JSON-mirror text block in sync, and
//   - as a visible ⚠️ text content block otherwise, so any client surfaces it.
//
// It never changes what the server ACCEPTS or whether a call succeeds/fails — it
// only annotates. Drift in the SDK-private surfaces fails loud in dev (install
// canary) and no-ops in prod (a missing warning must never take down /api/mcp);
// scripts/check-mcp-tools.ts gates the same access path in CI.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

type ContentBlock = { type: string; text?: string; [k: string]: unknown }
type ToolResult = {
  content?: ContentBlock[]
  structuredContent?: Record<string, unknown>
  isError?: boolean
  [k: string]: unknown
}

// Minimal registered-tool shape we read. The zod shape lives under
// `inputSchema._zod.def.shape` in zod v4 (the access path check-mcp-tools.ts
// already relies on); `.shape` is kept as a fallback for the public getter.
type RegisteredToolLike = {
  inputSchema?: {
    _zod?: { def?: { shape?: Record<string, unknown> } }
    shape?: Record<string, unknown>
  }
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isTextBlock(v: unknown): v is { type: string; text: string } {
  return isPlainObject(v) && v.type === 'text' && typeof v.text === 'string'
}

function safeStringify(v: unknown): string | null {
  try {
    return JSON.stringify(v)
  } catch {
    return null
  }
}

// The set of top-level field names a tool's schema declares, or null when the
// zod shape can't be reached (SDK/zod internal moved).
export function knownKeysFor(tool: RegisteredToolLike | undefined): Set<string> | null {
  const shape = tool?.inputSchema?._zod?.def?.shape ?? tool?.inputSchema?.shape
  return isPlainObject(shape) ? new Set(Object.keys(shape)) : null
}

// Top-level argument keys not present in the tool's known field set.
export function unknownArgKeys(
  args: Record<string, unknown>,
  knownKeys: ReadonlySet<string>,
): string[] {
  return Object.keys(args).filter((k) => !knownKeys.has(k))
}

// Append the dropped-field warning to a tool result, IN PLACE. Populates
// structuredContent.warnings when present AND keeps a toolJson-style JSON mirror
// (a text block whose text === JSON.stringify(structuredContent)) in sync;
// otherwise prepends a standalone ⚠️ text block so the signal is always visible.
export function annotateUnknownArgs(
  result: unknown,
  toolName: string,
  unknownKeys: string[],
): void {
  if (unknownKeys.length === 0 || !isPlainObject(result)) return
  const message =
    `${toolName}: ignored unknown field(s) not in the tool schema — ` +
    `${unknownKeys.join(', ')}. These were dropped and NOT persisted; ` +
    `check for a mistyped field name.`

  const res = result as ToolResult
  const sc = res.structuredContent
  const scIsObj = isPlainObject(sc)
  const content = res.content

  // Find the canonical toolJson mirror (single/among text blocks whose text is
  // exactly JSON.stringify(structuredContent)) BEFORE mutating sc, so the
  // equality compares against the original serialization.
  const mirrorIndex =
    scIsObj && Array.isArray(content)
      ? content.findIndex((b) => isTextBlock(b) && b.text === safeStringify(sc))
      : -1

  if (scIsObj) {
    const existing = Array.isArray(sc.warnings) ? (sc.warnings as unknown[]) : []
    sc.warnings = [...existing, message]
  }

  if (Array.isArray(content)) {
    if (mirrorIndex >= 0 && scIsObj) {
      const restr = safeStringify(sc)
      if (restr !== null) (content[mirrorIndex] as { text: string }).text = restr
    } else {
      content.unshift({ type: 'text', text: `⚠️ ${message}` })
    }
  }
}

// Wraps the SDK's tools/call handler so a successful call carrying unknown
// top-level argument keys comes back with a dropped-field warning. Must run
// AFTER every registerTool call (needs the populated _registeredTools map).
export function installUnknownArgWarnings(server: McpServer): void {
  const mcp = server as unknown as {
    _registeredTools?: Record<string, RegisteredToolLike>
  }
  const lowLevel = server.server as unknown as {
    _requestHandlers?: Map<string, (req: unknown, extra: unknown) => Promise<unknown>>
  }
  const registered = mcp._registeredTools
  const handlers = lowLevel._requestHandlers
  const inner = handlers?.get('tools/call')

  // Canary: prove we can both wrap the handler AND derive known keys from a
  // known tool. If either SDK-private surface moved, the guardrail would
  // silently do nothing — fail loud in dev, no-op in prod.
  const canaryKeys = knownKeysFor(registered?.['push_brew'])
  if (!handlers || !inner || !registered || !canaryKeys || canaryKeys.size === 0) {
    const msg =
      '[mcp/unknown-arg-warnings] could not wrap tools/call or derive known keys ' +
      '(SDK private _requestHandlers / _registeredTools[*].inputSchema shape moved?) — ' +
      "typo'd tool fields will be silently dropped without a warning"
    if (process.env.NODE_ENV === 'development') throw new Error(msg)
    console.error(msg)
    return
  }

  handlers.set('tools/call', async (req, extra) => {
    const result = await inner(req, extra)
    try {
      const params = (req as { params?: { name?: unknown; arguments?: unknown } }).params
      const name = typeof params?.name === 'string' ? params.name : undefined
      const args = params?.arguments
      const res = result as ToolResult | undefined
      // Only annotate successful calls — a failed call already gives the caller
      // feedback, and keeping error responses clean avoids noise.
      if (name && isPlainObject(args) && res && res.isError !== true) {
        const known = knownKeysFor(registered[name])
        if (known) {
          const keys = unknownArgKeys(args, known)
          if (keys.length > 0) annotateUnknownArgs(result, name, keys)
        }
      }
    } catch (err) {
      // Never let the guardrail break a real tool result.
      console.error('[mcp/unknown-arg-warnings]', err instanceof Error ? err.message : err)
    }
    return result
  })
}
