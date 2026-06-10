import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  getRedirectTargets,
  isKnownDoc,
  isRedirectStub,
  listDocs,
  listDocSections,
  readDoc,
  readDocSection,
} from '@/lib/mcp/docs'
import { withToolErrorLogging, toolJson } from '@/lib/mcp/tool-wrapper'

// Doc-introspection Tools (MCP feedback batch 2, 2026-04-30).
//
// Why Tools when Resources already exist:
// SYNC_V2.md's design assumed `docs://` Resources would be model-callable from
// claude.ai. In practice, claude.ai's MCP client surfaces Tools as the on-demand
// model surface; Resources are catalog/context but not reliably reachable as
// "fetch X now" by the model. The propose_doc_changes flow needs the model to
// fetch live doc content before drafting `current_text` (drift detection
// depends on it), which means we need Tool-shaped reads.
//
// These four are pure passthroughs to the existing `lib/mcp/docs.ts` helpers
// (listDocs / listDocSections / readDoc / readDocSection). Same on-disk cache,
// same parsing, same error semantics — just exposed as Tools instead of (or
// in addition to) Resources. Resources stay registered for clients that DO
// surface them and for general MCP convention.

export function registerDocTools(server: McpServer) {
  server.registerTool(
    'list_docs',
    {
      title: 'List Docs',
      description:
        'List / browse / discover / enumerate every prose / taxonomy / prompt doc the MCP server can read. Use this first when you need to discover what `docs://` URIs are available before calling `read_doc` / `list_doc_sections` / `read_doc_section` — each entry carries a one-line "use when..." description so you can route to the right doc without fetching first. Catalog covers BREWING.md, ROASTING.md, the 10 taxonomy markdown files, the 10 operational prompt files, the composable sub-skills (Master Coordinator + Brewing Equipment Expert from Wave 1, WBC Brewing + Roasting Archivists from Wave 2 PR 1 including the migrated WBC reference / WBC recipes / WBC roasting / sourcing strategy docs in their cluster paths under docs/skills/), and split-out subdocs (docs/brewing/roasters.md, docs/roasting/archive.md). Returns { docs: [{ uri, name, title, mimeType, description }] }. Optional `prefix` parameter filters the catalog to URIs that start with the given path — accepts either bare path (`"skills/roasting-historian/cluster/active-lots/"`) or full `docs://`-prefixed URI; the bare path form is normalized to `docs://{prefix}` for matching. Use the prefix arg when you want a subset (e.g. just the active-lots files) rather than the full ~100-entry catalog.',
      inputSchema: {
        prefix: z
          .string()
          .optional()
          .describe(
            'Optional URI-prefix filter. Returns only docs whose URI starts with the given prefix. Accepts bare paths (`"skills/roasting-historian/cluster/active-lots/"`) — normalized to `docs://{prefix}` — or full `docs://`-prefixed URIs.',
          ),
      },
    },
    withToolErrorLogging('list_docs', async ({ prefix }) => {
      const docs = listDocs()
      const filtered = prefix
        ? (() => {
            const normalized = prefix.startsWith('docs://') ? prefix : `docs://${prefix}`
            return docs.filter((d) => d.uri.startsWith(normalized))
          })()
        : docs
      return toolJson({ docs: filtered })
    }),
  )

  server.registerTool(
    'list_doc_sections',
    {
      title: 'List Doc Sections',
      description:
        'List / browse / discover / find every header anchor in a doc, in document order. Use this to discover valid `section_anchor` values BEFORE drafting change proposals — anchor matching is case-sensitive exact match against `## ` / `### ` headers, no fuzzy resolution. If your intended anchor isn\'t in the returned list, the section either doesn\'t exist or has been renamed. Returns { uri, anchors: string[], redirect_to?: string[] }. **`redirect_to` field** (Sub-sprint 2 Item 18, 2026-05-27): when the requested URI is a redirect-stub doc (BREWING.md / ROASTING.md / migrated taxonomy paths / CONTEXT.md / wbc-* stubs), the response also carries `redirect_to: string[]` listing the canonical destination URI(s) where content actually lives. The bare `anchors` list still returns (it parses the stub body — usually just an h1 plus the pointer table headers, which is rarely useful for routing live edits). Treat the presence of `redirect_to` as the signal to re-target your read / write at one of the listed cluster paths instead.',
      inputSchema: {
        uri: z.string().describe(
          'Doc URI to enumerate. One of the values returned by `list_docs` (e.g. `docs://brewing.md`, `docs://brewing/roasters.md`, `docs://taxonomies/processes.md`).',
        ),
      },
    },
    withToolErrorLogging('list_doc_sections', async ({ uri }) => {
      if (!isKnownDoc(uri)) {
        throw new Error(
          `Unknown doc URI: ${uri}. Call list_docs to discover valid URIs.`,
        )
      }
      const anchors = await listDocSections(uri)
      const redirectTo = isRedirectStub(uri) ? getRedirectTargets(uri) : null
      const payload: { uri: string; anchors: string[]; redirect_to?: string[] } = {
        uri,
        anchors,
      }
      if (redirectTo) payload.redirect_to = redirectTo
      return toolJson(payload)
    }),
  )

  server.registerTool(
    'read_doc',
    {
      title: 'Read Doc',
      description:
        'Read / fetch / get / load the full text of a doc by URI. Use this when you need the entire file (e.g. orienting before a multi-citation proposal touches several sections). For just one section by anchor, prefer `read_doc_section` — it returns less context and is cheaper to read. Returns { uri, text } where text is the raw markdown body.',
      inputSchema: {
        uri: z.string().describe(
          'Doc URI to fetch. One of the values returned by `list_docs` (e.g. `docs://brewing.md`, `docs://brewing/roasters.md`, `docs://taxonomies/flavors.md`).',
        ),
      },
    },
    withToolErrorLogging('read_doc', async ({ uri }) => {
      if (!isKnownDoc(uri)) {
        throw new Error(
          `Unknown doc URI: ${uri}. Call list_docs to discover valid URIs.`,
        )
      }
      const text = await readDoc(uri)
      return {
        content: [{ type: 'text', text }],
        structuredContent: { uri, text },
      }
    }),
  )

  server.registerTool(
    'read_doc_section',
    {
      title: 'Read Doc Section',
      description:
        'Read / fetch / get / load the body of one section by header text. Use this BEFORE drafting change proposals so your `current_text` (for replace ops) is verbatim from the live doc — the arbiter uses `current_text` to detect drift between when the proposal was written and when it gets applied. Anchor matching is case-sensitive exact match (no leading `#`). If the anchor doesn\'t resolve, call `list_doc_sections` to see what actually exists. Returns { uri, anchor, body } where body is the section text from below the header up to (but not including) the next header of equal or higher level.',
      inputSchema: {
        uri: z.string().describe(
          'Doc URI to fetch from. One of the values returned by `list_docs`.',
        ),
        anchor: z.string().describe(
          'Header text WITHOUT the leading `#` characters. E.g. "By Process", "Coffees That Needed Balanced Intensity", "Hydrangea Coffee". Case-sensitive exact match against `## ` / `### ` headers.',
        ),
      },
    },
    withToolErrorLogging('read_doc_section', async ({ uri, anchor }) => {
      if (!isKnownDoc(uri)) {
        throw new Error(
          `Unknown doc URI: ${uri}. Call list_docs to discover valid URIs.`,
        )
      }
      const body = await readDocSection(uri, anchor)
      if (body == null) {
        const available = await listDocSections(uri)
        const redirectTo = isRedirectStub(uri) ? getRedirectTargets(uri) : null
        // Sub-sprint 2 Item 18 (2026-05-27): when the section-miss is against
        // a redirect-stub doc, the "Available anchors" list is usually a
        // dead-end (just the h1 + pointer-table headers). Front-load the
        // redirect destinations so the caller can re-issue against the real
        // cluster doc without an extra round-trip.
        const redirectMsg = redirectTo
          ? ` This URI is a redirect-stub doc — content has migrated to: ${redirectTo.join(' | ')}. Re-issue read_doc_section against one of those cluster paths instead.`
          : ''
        throw new Error(
          `Section not found in ${uri}: "${anchor}".${redirectMsg} Available anchors (${available.length}): ${available.join(' | ')}.`,
        )
      }
      return {
        content: [{ type: 'text', text: body }],
        structuredContent: { uri, anchor, body },
      }
    }),
  )
}
