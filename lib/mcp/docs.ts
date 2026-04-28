import { readFile } from 'fs/promises'
import path from 'path'

const DOC_FILES: Record<string, string> = {
  'docs://brewing.md': 'BREWING.md',
}

// Vercel serverless filesystem is read-only and per-deploy immutable, so doc
// content is invariant across the lifetime of one warm container. Cache after
// first read; deploys reset the container which reloads on next call.
const DOC_CACHE = new Map<string, string>()

export function isKnownDoc(uri: string): boolean {
  return uri in DOC_FILES
}

export function listDocs(): { uri: string; name: string; title: string; mimeType: string }[] {
  return [
    {
      uri: 'docs://brewing.md',
      name: 'docs/brewing.md',
      title: 'Brewing Master Reference',
      mimeType: 'text/markdown',
    },
  ]
}

export async function readDoc(uri: string): Promise<string> {
  const cached = DOC_CACHE.get(uri)
  if (cached !== undefined) return cached
  const filename = DOC_FILES[uri]
  if (!filename) throw new Error(`Unknown doc URI: ${uri}`)
  const text = await readFile(path.join(process.cwd(), filename), 'utf-8')
  DOC_CACHE.set(uri, text)
  return text
}
