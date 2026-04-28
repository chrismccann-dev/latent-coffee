import { readFile } from 'fs/promises'
import path from 'path'

const DOC_FILES: Record<string, string> = {
  'docs://brewing.md': 'BREWING.md',
}

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
  const filename = DOC_FILES[uri]
  if (!filename) throw new Error(`Unknown doc URI: ${uri}`)
  const filePath = path.join(process.cwd(), filename)
  return readFile(filePath, 'utf-8')
}
