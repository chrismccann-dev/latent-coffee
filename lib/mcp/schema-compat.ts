// Published-catalog schema compat (Lot Coordinator dogfood, 2026-06-12).
//
// Every `.optional().nullable()` zod field converts to JSON Schema as
// `anyOf: [{type: T}, {type: "null"}]` — valid, and claude.ai's MCP client
// handles it. Claude Code's client does NOT: it strips `anyOf` unions it
// can't flatten, presenting the property to the model as an untyped `{}`.
// The model then serializes numbers/objects as strings and the server-side
// zod validation rejects with -32602 (push_green_bean + push_roast_recipe
// were fully blocked in the first Claude-Code-native write session, lot
// RWA-NOVA-AN10-RB-2026).
//
// Fix: post-process the published tools/list response so every union that
// CAN carry a top-level `type` keyword does. Three rewrites, applied
// recursively (nested object properties like terroir.admin_region count):
//
//   1. anyOf [T, null]        -> { ...T, type: [T.type, "null"] }
//      (enum branches also get null appended to the enum value list so the
//      published schema still admits explicit null)
//   2. anyOf [unknown, null]  -> { } (z.unknown() jsonb fields — "any"
//      already admits null; drop the union wrapper, keep the description)
//   3. any other anyOf/oneOf without a top-level type gets one hoisted from
//      its branch types when derivable (e.g. worth_repeating's
//      boolean|enum|null -> type: ["boolean", "string", "null"]; const-only
//      unions like evidence.tier collapse to { type, enum }), keeping the
//      original union alongside for full-fidelity validators.
//
// The transform never changes what the server ACCEPTS (zod validates tool
// calls, not this JSON) — it only changes how the contract is advertised.
// scripts/check-mcp-tools.ts gates the result: every published property must
// carry a resolvable type unless its zod source is z.unknown()/z.any().

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export type SchemaNode = Record<string, unknown>

const SCHEMA_MAP_KEYS = ['properties', 'patternProperties', '$defs', 'definitions'] as const
const SCHEMA_CHILD_KEYS = ['items', 'additionalProperties', 'prefixItems', 'contains', 'not'] as const
const UNION_KEYS = ['anyOf', 'oneOf'] as const

export function isSchemaNode(v: unknown): v is SchemaNode {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

// A branch that is exactly {type: "null"} (zod's nullable marker).
function isNullBranch(b: unknown): boolean {
  return isSchemaNode(b) && b.type === 'null' && Object.keys(b).every((k) => k === 'type')
}

// A branch with no constraints at all (z.unknown()/z.any() emission),
// possibly carrying a description.
function isAnyBranch(b: unknown): boolean {
  return isSchemaNode(b) && Object.keys(b).every((k) => k === 'description')
}

function jsonTypeOf(v: unknown): string {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  return typeof v
}

// Derive the union's member types from its branches; null when any branch
// is untypable (so we don't publish a lying `type`).
function branchTypes(branches: SchemaNode[]): string[] | null {
  const types: string[] = []
  const push = (t: string) => {
    if (!types.includes(t)) types.push(t)
  }
  for (const b of branches) {
    if (typeof b.type === 'string') push(b.type)
    else if (Array.isArray(b.type)) b.type.forEach((t) => typeof t === 'string' && push(t))
    else if ('const' in b) push(jsonTypeOf(b.const))
    else if (Array.isArray(b.enum) && b.enum.length > 0) b.enum.forEach((v) => push(jsonTypeOf(v)))
    else return null
  }
  return types
}

export function liftNullableUnions(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(liftNullableUnions)
  if (!isSchemaNode(node)) return node

  // Recurse into child schemas first so nested unions are already lifted.
  const out: SchemaNode = {}
  for (const [k, v] of Object.entries(node)) {
    if ((UNION_KEYS as readonly string[]).includes(k) || (SCHEMA_CHILD_KEYS as readonly string[]).includes(k)) {
      out[k] = liftNullableUnions(v)
    } else if ((SCHEMA_MAP_KEYS as readonly string[]).includes(k) && isSchemaNode(v)) {
      out[k] = Object.fromEntries(Object.entries(v).map(([pk, pv]) => [pk, liftNullableUnions(pv)]))
    } else {
      out[k] = v
    }
  }

  const unionKey = UNION_KEYS.find((k) => Array.isArray(out[k]))
  if (!unionKey || 'type' in out) return out
  const branches = out[unionKey] as SchemaNode[]
  const { [unionKey]: _union, ...outer } = out

  const rest = branches.filter((b) => !isNullBranch(b))

  if (rest.length === 1 && rest.length < branches.length) {
    const inner = rest[0]
    // Case 2: z.unknown().nullable() — "any" admits null already.
    if (isAnyBranch(inner)) return { ...inner, ...outer }
    // Case 1: single typed branch — merge and publish a type array.
    if (typeof inner.type === 'string' || Array.isArray(inner.type)) {
      const types = Array.isArray(inner.type) ? (inner.type as string[]) : [inner.type as string]
      const merged: SchemaNode = {
        ...inner,
        ...outer,
        type: types.includes('null') ? types : [...types, 'null'],
      }
      if (Array.isArray(inner.enum) && !inner.enum.includes(null)) {
        merged.enum = [...inner.enum, null]
      }
      // If the branch was itself a (already-lifted) union carrying a hoisted
      // type, its anyOf/oneOf must also admit null or strict validators
      // reject explicit nulls that the type array advertises.
      for (const uk of UNION_KEYS) {
        const u = merged[uk]
        if (Array.isArray(u) && !u.some(isNullBranch)) merged[uk] = [...u, { type: 'null' }]
      }
      return merged
    }
    // Inner is itself a union (e.g. worth_repeating) — flatten null into it.
    const innerUnionKey = UNION_KEYS.find((k) => Array.isArray(inner[k]))
    if (innerUnionKey && Object.keys(inner).every((k) => k === innerUnionKey || k === 'description')) {
      const flat = [...(inner[innerUnionKey] as SchemaNode[]), { type: 'null' }]
      const hoisted = branchTypes(flat)
      return { ...outer, ...(hoisted ? { type: hoisted } : {}), [unionKey]: flat }
    }
  }

  // Case 3: const-only unions collapse to enum; everything else keeps the
  // union but gets a hoisted type when derivable.
  if (branches.every((b) => 'const' in b && Object.keys(b).every((k) => k === 'const' || k === 'type' || k === 'description'))) {
    const hoisted = branchTypes(branches)
    const values = branches.map((b) => b.const)
    if (hoisted) {
      return { ...outer, type: hoisted.length === 1 ? hoisted[0] : hoisted, enum: values }
    }
  }
  const hoisted = branchTypes(branches)
  return {
    ...outer,
    ...(hoisted ? { type: hoisted.length === 1 ? hoisted[0] : hoisted } : {}),
    [unionKey]: branches,
  }
}

// Wraps the SDK's tools/list handler so the catalog every MCP client sees is
// the lifted form. The SDK keeps its handlers in the private
// Protocol._requestHandlers map — same single-point private access the
// discoverability guard already makes for _registeredTools, with the same
// drift alarm: scripts/check-mcp-tools.ts asserts the published catalog
// through a real client, so an SDK rename that breaks this hook fails
// check:mcp (and its daily CI cron) immediately.
export function installPublishedSchemaCompat(server: McpServer): void {
  const internal = server.server as unknown as {
    _requestHandlers?: Map<string, (req: unknown, extra: unknown) => Promise<unknown>>
  }
  const handlers = internal._requestHandlers
  const inner = handlers?.get('tools/list')
  if (!handlers || !inner) {
    const msg =
      '[mcp/schema-compat] could not wrap tools/list (SDK private _requestHandlers moved?) — ' +
      'published catalog will regress to anyOf nullable unions, which Claude Code clients drop'
    if (process.env.NODE_ENV === 'development') throw new Error(msg)
    console.error(msg)
    return
  }
  handlers.set('tools/list', async (req, extra) => {
    const result = (await inner(req, extra)) as { tools?: Array<Record<string, unknown>> }
    if (Array.isArray(result?.tools)) {
      for (const tool of result.tools) {
        if (tool.inputSchema) tool.inputSchema = liftNullableUnions(tool.inputSchema)
        if (tool.outputSchema) tool.outputSchema = liftNullableUnions(tool.outputSchema)
      }
    }
    return result
  })
}
