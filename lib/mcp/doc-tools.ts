import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { isKnownDoc, listDocs, listDocSections, readDoc, readDocSection } from '@/lib/mcp/docs'

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
        'Enumerate every prose / taxonomy doc the MCP server can read. Returns an array of { uri, name, title, mimeType }. Use this first when you need to discover what `docs://` URIs are available before calling `read_doc` / `list_doc_sections` / `read_doc_section`. The catalog covers BREWING.md, ROASTING.md, docs/brewing/roasters.md, and the 10 taxonomy markdown files.',
      inputSchema: {},
    },
    async () => {
      const docs = listDocs()
      return {
        content: [{ type: 'text', text: JSON.stringify({ docs }) }],
        structuredContent: { docs },
      }
    },
  )

  server.registerTool(
    'list_doc_sections',
    {
      title: 'List Doc Sections',
      description:
        'Return every header anchor in a doc, in document order. Use this to discover valid `section_anchor` values for `propose_doc_changes` citations BEFORE drafting them — anchor matching is case-sensitive exact match against `## ` / `### ` headers, no fuzzy resolution. If your intended anchor isn\'t in the returned list, the section either doesn\'t exist or has been renamed.',
      inputSchema: {
        uri: z.string().describe(
          'Doc URI to enumerate. One of the values returned by `list_docs` (e.g. `docs://brewing.md`, `docs://brewing/roasters.md`, `docs://taxonomies/processes.md`).',
        ),
      },
    },
    async ({ uri }) => {
      if (!isKnownDoc(uri)) {
        throw new Error(
          `Unknown doc URI: ${uri}. Call list_docs to discover valid URIs.`,
        )
      }
      const anchors = await listDocSections(uri)
      return {
        content: [{ type: 'text', text: JSON.stringify({ uri, anchors }) }],
        structuredContent: { uri, anchors },
      }
    },
  )

  server.registerTool(
    'read_doc',
    {
      title: 'Read Doc',
      description:
        'Return the full text of a doc by URI. Use this when you need the entire file (e.g. orienting before a multi-citation proposal touches several sections). For just one section by anchor, prefer `read_doc_section` — it returns less context and is cheaper to read.',
      inputSchema: {
        uri: z.string().describe(
          'Doc URI to fetch. One of the values returned by `list_docs` (e.g. `docs://brewing.md`, `docs://brewing/roasters.md`, `docs://taxonomies/flavors.md`).',
        ),
      },
    },
    async ({ uri }) => {
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
    },
  )

  server.registerTool(
    'read_doc_section',
    {
      title: 'Read Doc Section',
      description:
        'Return the body of one section by header text. Use this BEFORE drafting `propose_doc_changes` citations so your `current_text` (for replace ops) is verbatim from the live doc — the arbiter uses `current_text` to detect drift between when the proposal was written and when it gets applied. Anchor matching is case-sensitive exact match (no leading `#`). If the anchor doesn\'t resolve, call `list_doc_sections` to see what actually exists.',
      inputSchema: {
        uri: z.string().describe(
          'Doc URI to fetch from. One of the values returned by `list_docs`.',
        ),
        anchor: z.string().describe(
          'Header text WITHOUT the leading `#` characters. E.g. "By Process", "Coffees That Needed Balanced Intensity", "Hydrangea Coffee". Case-sensitive exact match against `## ` / `### ` headers.',
        ),
      },
    },
    async ({ uri, anchor }) => {
      if (!isKnownDoc(uri)) {
        throw new Error(
          `Unknown doc URI: ${uri}. Call list_docs to discover valid URIs.`,
        )
      }
      const body = await readDocSection(uri, anchor)
      if (body == null) {
        const available = await listDocSections(uri)
        throw new Error(
          `Section not found in ${uri}: "${anchor}". Available anchors (${available.length}): ${available.join(' | ')}.`,
        )
      }
      return {
        content: [{ type: 'text', text: body }],
        structuredContent: { uri, anchor, body },
      }
    },
  )
}
