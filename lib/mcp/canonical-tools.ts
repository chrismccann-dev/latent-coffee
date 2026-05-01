import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { CANONICAL_AXES, getCanonicalPayload, type CanonicalAxis } from '@/lib/mcp/canonicals'

// Canonical-introspection Tools (MCP feedback batch 3, 2026-04-30).
//
// Mirror of lib/mcp/doc-tools.ts. Same architectural reason: claude.ai's MCP
// client surfaces Tools as the model-callable surface; Resources are
// catalog/context but not reliably reachable as "fetch X now" by the model.
// Without Tool-shaped reads, push_brew callers were resorting to reading the
// full taxonomy markdown (133 anchors for producers!) just to validate one
// canonical name.
//
// Two Tools, both pure passthroughs to the existing CANONICAL_AXES catalog
// + getCanonicalPayload helper:
//   - list_canonicals()       → axis catalog with descriptions
//   - read_canonical(axis)    → full registry payload for one axis
//
// The Resources stay registered for clients that DO surface them.

const VALID_AXES = CANONICAL_AXES.map((m) => m.axis) as readonly CanonicalAxis[]
const AXES_TUPLE = VALID_AXES as readonly [CanonicalAxis, ...CanonicalAxis[]]

export function registerCanonicalTools(server: McpServer) {
  server.registerTool(
    'list_canonicals',
    {
      title: 'List Canonical Registries',
      description:
        'List / lookup / browse / discover / enumerate the canonical-taxonomy registries the MCP server validates against. Returns an array of { axis, title, description } for the 12 axes (cultivars / terroirs / processes / roasters / producers / brewers / filters / flavors / roast-levels / grinders / extraction-strategies / modifiers). Use this BEFORE drafting a push_brew payload to discover what fields are registry-validated and what their canonical / alias coverage looks like. For the actual payload of one axis, call read_canonical.',
      inputSchema: {},
    },
    async () => {
      const axes = CANONICAL_AXES.map(({ axis, title, description }) => ({
        axis,
        title,
        description,
      }))
      return {
        content: [{ type: 'text', text: JSON.stringify({ axes }) }],
        structuredContent: { axes },
      }
    },
  )

  server.registerTool(
    'read_canonical',
    {
      title: 'Read Canonical Registry',
      description:
        'Read / lookup / validate / find / get the full canonical-registry payload for one axis (cultivars / roasters / producers / etc.). Each payload contains the canonical name list, alias map, and any structural metadata (genetic family / strategy tag / grinder valid_settings / etc.) — same content the canonicals://{axis} Resource serves. Use this to validate a name or look up an alias before push_brew. For just the catalog of axes (without payloads), use list_canonicals.',
      inputSchema: {
        axis: z.enum(AXES_TUPLE).describe(
          `One of the 12 canonical-axis names. Run list_canonicals to discover them. Valid: ${VALID_AXES.join(', ')}.`,
        ),
      },
    },
    async ({ axis }) => {
      const payload = getCanonicalPayload(axis)
      if (!payload) {
        // Belt-and-suspenders — z.enum should already reject anything not in the tuple.
        throw new Error(
          `Unknown canonical axis: ${axis}. Valid: ${VALID_AXES.join(', ')}.`,
        )
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload as unknown as { [k: string]: unknown },
      }
    },
  )
}
