import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  CANONICAL_AXES,
  CANONICAL_AXIS_ALIASES,
  getCanonicalPayload,
  listAcceptedCanonicalAxisNames,
  resolveCanonicalAxis,
  type CanonicalAxis,
} from '@/lib/mcp/canonicals'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

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
//
// Phase 2 (#R38): read_canonical accepts the docs:// aliases (regions →
// terroirs, varieties → cultivars) in addition to the 12 canonical axis
// names. The response echoes the resolved canonical axis name.

const VALID_AXES = CANONICAL_AXES.map((m) => m.axis) as readonly CanonicalAxis[]
const ACCEPTED_AXIS_NAMES = listAcceptedCanonicalAxisNames()
const AXIS_ALIAS_PAIRS = Object.entries(CANONICAL_AXIS_ALIASES)
  .map(([alias, target]) => `${alias} → ${target}`)
  .join(', ')

const axisInput = z
  .string()
  .refine((v) => resolveCanonicalAxis(v) != null, {
    message: `Unknown canonical axis. Valid (12 canonical + 2 aliases): ${ACCEPTED_AXIS_NAMES.join(', ')}.`,
  })
  .describe(
    `One of the 12 canonical-axis names: ${VALID_AXES.join(', ')}. ` +
      `Aliases also accepted (resolved server-side): ${AXIS_ALIAS_PAIRS.replace(/→/g, '->')}. ` +
      `Run list_canonicals to discover them. The response echoes the resolved canonical axis as \`axis\`.`,
  )

export function registerCanonicalTools(server: McpServer) {
  server.registerTool(
    'list_canonicals',
    {
      title: 'List Canonical Registries',
      description:
        'List / lookup / browse / discover / enumerate the canonical-taxonomy registries the MCP server validates against. Returns an array of { axis, title, description } for the 12 axes (cultivars / terroirs / processes / roasters / producers / brewers / filters / flavors / roast-levels / grinders / extraction-strategies / modifiers). Use this BEFORE drafting any write-tool payload to discover what fields are registry-validated and what their canonical / alias coverage looks like. For the actual payload of one axis, call read_canonical. NOTE: read_canonical also accepts the docs:// aliases `regions` (-> terroirs) and `varieties` (-> cultivars) for symmetry with `docs://taxonomies/{axis}.md` URIs.',
      inputSchema: {},
    },
    withToolErrorLogging('list_canonicals', async () => {
      const axes = CANONICAL_AXES.map(({ axis, title, description }) => ({
        axis,
        title,
        description,
      }))
      return {
        content: [{ type: 'text', text: JSON.stringify({ axes }) }],
        structuredContent: { axes },
      }
    }),
  )

  server.registerTool(
    'read_canonical',
    {
      title: 'Read Canonical Registry',
      description:
        'Read / lookup / validate / find / get the full canonical-registry payload for one axis (cultivars / roasters / producers / etc.). Use this to validate a name or look up an alias before push_brew. For just the catalog of axes (without payloads), use list_canonicals. Phase 2 (#R38): also accepts the docs:// aliases `regions` (-> terroirs) and `varieties` (-> cultivars). Returns { axis, canonicals: string[], aliases: Record<string,string>, ...structural metadata } where structural metadata varies by axis (genetic family / strategy tag / grinder valid_settings / etc.) — same content the canonicals://{axis} Resource serves.',
      inputSchema: {
        axis: axisInput,
      },
    },
    withToolErrorLogging('read_canonical', async ({ axis }) => {
      const payload = getCanonicalPayload(axis)
      if (!payload) {
        // Belt-and-suspenders — refine should already reject unknown values.
        throw new Error(
          `Unknown canonical axis: ${axis}. Valid: ${ACCEPTED_AXIS_NAMES.join(', ')}.`,
        )
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload as unknown as { [k: string]: unknown },
      }
    }),
  )
}
