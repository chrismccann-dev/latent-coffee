// Standalone MCP tool discoverability check (MCP feedback batch 4, 2026-05-01).
//
// Builds the McpServer with a stub auth context, walks every registered tool's
// description, and asserts each first sentence contains >= 2 user-vocabulary
// action synonyms (see lib/mcp/discoverability-check.ts for the rule).
//
// Run via:
//   npm run check:mcp
//
// Exits 0 on success, 1 on any failure. Safe to wire into CI when CI lands.
//
// The stub auth context is fine here because tool *descriptions* are static
// strings captured at register time — the auth fields are only accessed when a
// tool's handler actually runs.

import { statSync } from 'node:fs'
import { join } from 'node:path'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { buildMcpServer } from '@/lib/mcp/server'
import {
  checkToolDiscoverability,
  formatDiscoverabilityFailures,
  type ToolDescriptor,
} from '@/lib/mcp/discoverability-check'
import { isSchemaNode, type SchemaNode } from '@/lib/mcp/schema-compat'
import {
  annotateUnknownArgs,
  knownKeysFor,
  unknownArgKeys,
} from '@/lib/mcp/unknown-arg-warnings'

function collectToolDescriptors(server: ReturnType<typeof buildMcpServer>): ToolDescriptor[] {
  const internal = server as unknown as {
    _registeredTools?: Record<string, { description?: string }>
  }
  const map = internal._registeredTools ?? {}
  return Object.entries(map).map(([name, tool]) => ({
    name,
    description: tool.description ?? '',
  }))
}

// Sprint 3.3 / #R90: tool-list cache visibility. When a new Tool ships,
// claude.aiʼs MCP client may cache its tool catalog. Print the count + each
// toolʼs source-file mtime so the count delta + recency are visible at a
// glance after a registration edit.
function sourcePathForTool(name: string): string {
  // Convention: push_brew → lib/mcp/push-brew.ts. Holds for all tools today.
  return join(process.cwd(), 'lib', 'mcp', `${name.replace(/_/g, '-')}.ts`)
}

function fileMtime(path: string): string {
  try {
    return statSync(path).mtime.toISOString().slice(0, 10)
  } catch {
    return '????-??-??'
  }
}

// --- Published-catalog type coverage (Lot Coordinator dogfood, 2026-06-12) ---
//
// Fetches tools/list through a real in-memory MCP client — the same path
// claude.ai / Claude Code hit — so it exercises lib/mcp/schema-compat.ts's
// tools/list wrapper end-to-end. Three assertions:
//
//   1. Every top-level input property publishes resolvable type info
//      (type / enum / const / $ref) UNLESS its zod source is z.unknown() /
//      z.any() (jsonb passthrough fields like the bezier blobs). The zod
//      cross-check is what makes this a "type info LOST in conversion" gate
//      rather than a heuristic — a regression that strips a z.number() to {}
//      fails even though {} looks like a legitimate any-field.
//   2. No anyOf/oneOf node anywhere in the catalog lacks a sibling hoisted
//      `type` — bare unions are exactly what Claude Code's client drops
//      (the -32602 "received string" class that blocked push_green_bean +
//      push_roast_recipe in the first Claude-Code-native write session).
//   3. Canary: push_green_bean.price_per_kg publishes type ["number","null"].
//   4. Required-axis (backlog #57, 2026-07-15): no zod-optional field may
//      appear in a published `required` array. The preprocess-wrapped
//      numField/boolField coercers used to bury `.optional()` INSIDE
//      z.preprocess, so patch_green_bean published 6 required fields instead
//      of just green_bean_id (a lot_status-only patch forced collateral
//      writes + a roast_priority null-clobber). Optionality is detected via
//      safeParse(undefined) on the zod source — wrapper-agnostic, so any
//      future wrapping (preprocess/pipe/default) stays gated.
//      Canary: patch_green_bean.required must be exactly ["green_bean_id"].

// Unwrap zod v4 optional/nullable/default/describe wrappers to the core def type.
function zodCoreType(schema: unknown): string | undefined {
  let def = (schema as { _zod?: { def?: { type?: string; innerType?: unknown } } })?._zod?.def
  for (let i = 0; i < 20 && def; i++) {
    if (def.type === 'optional' || def.type === 'nullable' || def.type === 'default') {
      def = (def.innerType as { _zod?: { def?: { type?: string; innerType?: unknown } } })?._zod?.def
    } else {
      return def.type
    }
  }
  return undefined
}

function hasTypeInfo(node: SchemaNode): boolean {
  return 'type' in node || 'enum' in node || 'const' in node || '$ref' in node
}

async function checkPublishedCatalog(server: ReturnType<typeof buildMcpServer>): Promise<string[]> {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  const client = new Client({ name: 'check-mcp-tools', version: '0.0.0' })
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])
  const { tools } = await client.listTools()
  const problems: string[] = []

  const internal = server as unknown as {
    _registeredTools?: Record<string, { inputSchema?: { _zod?: { def?: { shape?: Record<string, unknown> } } } }>
  }

  for (const tool of tools) {
    const pubProps = (tool.inputSchema as SchemaNode | undefined)?.properties
    const zodShape = internal._registeredTools?.[tool.name]?.inputSchema?._zod?.def?.shape ?? {}
    if (!isSchemaNode(pubProps)) continue

    // 1. Top-level properties: typed unless the zod source is unknown/any.
    for (const [key, prop] of Object.entries(pubProps)) {
      if (!isSchemaNode(prop)) continue
      const core = zodCoreType(zodShape[key])
      const deliberatelyAny = core === 'unknown' || core === 'any' || core === undefined
      if (!hasTypeInfo(prop) && !deliberatelyAny) {
        problems.push(`${tool.name}.${key}: published without type info (zod core: ${core})`)
      }
    }

    // 4. Required-axis: a zod-optional field must not publish as required.
    const published = tool.inputSchema as SchemaNode | undefined
    const requiredArr = Array.isArray(published?.required) ? (published.required as string[]) : []
    for (const key of requiredArr) {
      const src = zodShape[key] as { safeParse?: (v: unknown) => { success: boolean } } | undefined
      if (src?.safeParse && src.safeParse(undefined).success) {
        problems.push(
          `${tool.name}.${key}: zod-optional field published in \`required\` (optionality lost in conversion — check wrapper order, e.g. .optional() inside z.preprocess)`,
        )
      }
    }

    // 2. No bare unions anywhere (recursive).
    const walk = (node: unknown, path: string): void => {
      if (Array.isArray(node)) {
        node.forEach((n, i) => walk(n, `${path}[${i}]`))
        return
      }
      if (!isSchemaNode(node)) return
      if ((Array.isArray(node.anyOf) || Array.isArray(node.oneOf)) && !('type' in node)) {
        problems.push(`${tool.name}${path}: anyOf/oneOf union without hoisted type (Claude Code drops these)`)
      }
      for (const [k, v] of Object.entries(node)) {
        if (k !== 'description') walk(v, `${path}.${k}`)
      }
    }
    walk(tool.inputSchema, '')
  }

  // 3. Canary.
  const greenBean = tools.find((t) => t.name === 'push_green_bean')
  const price = ((greenBean?.inputSchema as SchemaNode | undefined)?.properties as SchemaNode | undefined)
    ?.price_per_kg as SchemaNode | undefined
  if (JSON.stringify(price?.type) !== JSON.stringify(['number', 'null'])) {
    problems.push(
      `canary: push_green_bean.price_per_kg published as ${JSON.stringify(price)} — expected type ["number","null"]`,
    )
  }

  // 4. Required-axis canary: patch_green_bean's true identity key is exactly
  // green_bean_id — every other field is a field-level patch and must be
  // optional in the published contract.
  const patchGreenBean = tools.find((t) => t.name === 'patch_green_bean')
  const pgbRequired = (patchGreenBean?.inputSchema as SchemaNode | undefined)?.required
  if (JSON.stringify(pgbRequired) !== JSON.stringify(['green_bean_id'])) {
    problems.push(
      `canary: patch_green_bean.required published as ${JSON.stringify(pgbRequired)} — expected ["green_bean_id"]`,
    )
  }

  return problems
}

// --- Unknown-argument guardrail integrity (brew-session friction, 2026-07-20) ---
//
// lib/mcp/unknown-arg-warnings.ts wraps tools/call so a typo'd top-level field
// (which zod silently strips before the handler) comes back with a warning
// instead of vanishing. Two gates:
//   1. Drift canary — the guardrail derives each tool's known keys from the
//      SDK-private `inputSchema` zod shape (`_zod.def.shape`). If that access
//      path moves, the guardrail no-ops silently. Assert push_brew still yields
//      a non-empty known-key set that contains a sentinel field + excludes a
//      known typo target.
//   2. Behavior — annotateUnknownArgs must (a) sync the toolJson JSON-mirror
//      block + structuredContent.warnings, and (b) prepend a ⚠️ text block when
//      there is no structuredContent mirror.
function checkUnknownArgGuardrail(server: ReturnType<typeof buildMcpServer>): string[] {
  const problems: string[] = []
  const internal = server as unknown as {
    _registeredTools?: Record<string, Parameters<typeof knownKeysFor>[0]>
  }
  const known = knownKeysFor(internal._registeredTools?.['push_brew'])
  if (!known || known.size === 0) {
    problems.push(
      'unknown-arg guardrail: cannot derive push_brew known keys (SDK inputSchema._zod.def.shape moved?) — the guardrail would silently no-op',
    )
  } else {
    if (!known.has('strategy_notes')) {
      problems.push("unknown-arg guardrail canary: expected 'strategy_notes' in push_brew known keys")
    }
    const bogus = unknownArgKeys({ strategy_notes: 'x', extraction_strategy_notes: 'y' }, known)
    if (JSON.stringify(bogus) !== JSON.stringify(['extraction_strategy_notes'])) {
      problems.push(
        `unknown-arg guardrail canary: expected only ['extraction_strategy_notes'] flagged, got ${JSON.stringify(bogus)}`,
      )
    }
  }

  // (2a) toolJson-shaped result: JSON mirror + structuredContent kept in sync.
  const sc = { brew_id: 'abc', warnings: [] as string[] }
  const mirrored = {
    content: [{ type: 'text', text: JSON.stringify(sc) }],
    structuredContent: sc,
  }
  annotateUnknownArgs(mirrored, 'push_brew', ['typo_field'])
  if (mirrored.structuredContent.warnings.length !== 1) {
    problems.push('unknown-arg guardrail: structuredContent.warnings not populated on toolJson result')
  }
  if (mirrored.content[0].text !== JSON.stringify(mirrored.structuredContent)) {
    problems.push('unknown-arg guardrail: JSON mirror text block drifted from structuredContent after annotate')
  }

  // (2b) plain-content result (no structuredContent): a ⚠️ block is prepended.
  const plain = { content: [{ type: 'text', text: 'ok' }] }
  annotateUnknownArgs(plain, 'some_tool', ['typo_field'])
  if (plain.content.length !== 2 || !plain.content[0].text.startsWith('⚠️')) {
    problems.push('unknown-arg guardrail: expected a prepended ⚠️ text block on a plain-content result')
  }

  return problems
}

async function main(): Promise<void> {
  // Stub auth context — descriptions don't touch supabase/userId.
  const stubAuth = {
    supabase: null as unknown as never,
    userId: 'check-mcp-tools-stub',
    apiKeyId: 'check-mcp-tools-stub',
  }
  const server = buildMcpServer(stubAuth as never)
  const tools = collectToolDescriptors(server)

  if (tools.length === 0) {
    console.error('No tools registered — buildMcpServer returned an empty tool map.')
    console.error('This likely means the SDK private field _registeredTools changed shape.')
    process.exit(1)
  }

  const failures = checkToolDiscoverability(tools)
  if (failures.length > 0) {
    console.error(formatDiscoverabilityFailures(failures))
    process.exit(1)
  }

  const catalogProblems = await checkPublishedCatalog(server)
  if (catalogProblems.length > 0) {
    console.error(`Published-catalog type coverage FAILED (${catalogProblems.length} problem(s)):`)
    for (const p of catalogProblems) console.error(`  - ${p}`)
    process.exit(1)
  }

  const guardrailProblems = checkUnknownArgGuardrail(server)
  if (guardrailProblems.length > 0) {
    console.error(`Unknown-argument guardrail check FAILED (${guardrailProblems.length} problem(s)):`)
    for (const p of guardrailProblems) console.error(`  - ${p}`)
    process.exit(1)
  }

  console.log(`MCP tool discoverability check passed for ${tools.length} tool(s):`)
  const serverMtime = fileMtime(join(process.cwd(), 'lib', 'mcp', 'server.ts'))
  for (const t of tools) {
    console.log(`  - ${t.name}  (source mtime: ${fileMtime(sourcePathForTool(t.name))})`)
  }
  console.log(`\nTOTAL: ${tools.length} tools registered.`)
  console.log(`lib/mcp/server.ts last modified: ${serverMtime}`)
  console.log('Published-catalog type coverage passed (no untyped properties, no bare unions, no optional-field-in-required; price_per_kg + patch_green_bean.required canaries OK).')
  console.log('Unknown-argument guardrail passed (known-key derivation + annotate behavior OK).')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
