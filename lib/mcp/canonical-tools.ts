import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  CANONICAL_AXES,
  CANONICAL_AXIS_ALIASES,
  getCanonicalEntries,
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
// terroirs, varieties → cultivars) in addition to the 13 canonical axis
// names. The response echoes the resolved canonical axis name.

const VALID_AXES = CANONICAL_AXES.map((m) => m.axis) as readonly CanonicalAxis[]
const ACCEPTED_AXIS_NAMES = listAcceptedCanonicalAxisNames()
const AXIS_ALIAS_PAIRS = Object.entries(CANONICAL_AXIS_ALIASES)
  .map(([alias, target]) => `${alias} → ${target}`)
  .join(', ')

const axisInput = z
  .string()
  .refine((v) => resolveCanonicalAxis(v) != null, {
    message: `Unknown canonical axis. Valid (13 canonical + 2 aliases): ${ACCEPTED_AXIS_NAMES.join(', ')}.`,
  })
  .describe(
    `One of the 13 canonical-axis names: ${VALID_AXES.join(', ')}. ` +
      `Aliases also accepted (resolved server-side): ${AXIS_ALIAS_PAIRS.replace(/→/g, '->')}. ` +
      `Run list_canonicals to discover them. The response echoes the resolved canonical axis as \`axis\`.`,
  )

export function registerCanonicalTools(server: McpServer) {
  server.registerTool(
    'list_canonicals',
    {
      title: 'List Canonical Registries',
      description:
        'List / lookup / browse / discover / enumerate the canonical-taxonomy registries the MCP server validates against. Returns an array of { axis, title, description } for the 13 axes (cultivars / terroirs / processes / roasters / producers / brewers / filters / flavors / roast-levels / grinders / extraction-strategies / modifiers / hybrid-subforms). Use this BEFORE drafting any write-tool payload to discover what fields are registry-validated and what their canonical / alias coverage looks like. For the actual payload of one axis, call read_canonical. NOTE: read_canonical also accepts the docs:// aliases `regions` (-> terroirs) and `varieties` (-> cultivars) for symmetry with `docs://taxonomies/{axis}.md` URIs.',
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
        'Read / lookup / validate / find / get canonical-registry content for one axis (cultivars / roasters / producers / etc.). Use this to validate a name or look up an alias against the strict canonical vocabulary BEFORE composing any write payload that includes the value. ' +
        'TWO MODES: ' +
        '(1) Single-entry lookup — pass `name` (or `names: string[]`) when you already know the value(s) you want to validate. Returns ONLY the resolved entry(ies) + their aliases, not the whole registry. STRONGLY PREFER THIS — the full payload for a large axis (flavors ~20K tokens, filters, brewers) is the #1 context-window sink, and a typical session uses ~5% of it. Each match is { query, group?, resolved, matchType: canonical|alias|fuzzy|unresolved, entry, aliases[] }. `resolved` is the canonical (title-case) form; `matchType` tells you whether you wrote it canonically, hit an alias, got a fuzzy guess, or it is unknown; `group` names the sub-registry for composite axes (processes: base / fermentation_modifiers / signature / etc.; flavors: base / modifier / structure_tag / alias). A composite axis can return multiple matches per name. ' +
        '(2) Full-registry dump — omit `name`/`names` to get the entire payload (back-compat) for browsing an axis you do not yet know the vocabulary of. ' +
        'Phase 2 (#R38): also accepts the docs:// aliases `regions` (-> terroirs) and `varieties` (-> cultivars). Full-dump shape: { axis, notes, data: { canonicals, aliases, ...structural metadata } } — same content the canonicals://{axis} Resource serves. Single-entry shape: { axis, notes, query: string[], matches: [...] }.',
      inputSchema: {
        axis: axisInput,
        name: z
          .string()
          .optional()
          .describe(
            'Optional single name to resolve against the axis (canonical / alias / fuzzy). When provided (alone or with `names`), the response returns only the matched entry(ies) instead of the full registry. Omit for the full-registry dump.',
          ),
        names: z
          .array(z.string())
          .max(50)
          .optional()
          .describe(
            'Optional batch of names to resolve in one call (combined with `name` if both supplied). Each resolves independently; composite axes may emit multiple matches per name. Up to 50.',
          ),
      },
    },
    withToolErrorLogging('read_canonical', async ({ axis, name, names }) => {
      const queryNames = [...(name ? [name] : []), ...(names ?? [])]

      if (queryNames.length > 0) {
        const entries = getCanonicalEntries(axis, queryNames)
        if (!entries) {
          throw new Error(
            `Unknown canonical axis: ${axis}. Valid: ${ACCEPTED_AXIS_NAMES.join(', ')}.`,
          )
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(entries) }],
          structuredContent: entries as unknown as { [k: string]: unknown },
        }
      }

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
