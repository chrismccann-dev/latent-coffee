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

import { buildMcpServer } from '@/lib/mcp/server'
import {
  checkToolDiscoverability,
  formatDiscoverabilityFailures,
  type ToolDescriptor,
} from '@/lib/mcp/discoverability-check'

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

function main(): void {
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
  if (failures.length === 0) {
    console.log(
      `MCP tool discoverability check passed for ${tools.length} tool(s):`,
    )
    for (const t of tools) {
      console.log(`  - ${t.name}`)
    }
    process.exit(0)
  }

  console.error(formatDiscoverabilityFailures(failures))
  process.exit(1)
}

main()
