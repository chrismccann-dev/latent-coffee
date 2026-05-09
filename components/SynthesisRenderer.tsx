// Renders the per-entity synthesis output. The 4-6 paragraph + 4-6 bullet
// shape comes out of the API as plain text with `\n\n` paragraph breaks and
// `* ` markdown bullets. This avoids a react-markdown dependency.

interface SynthesisRendererProps {
  text: string
}

type Block =
  | { type: 'paragraph'; content: string }
  | { type: 'bullets'; items: string[] }

const BULLET_LINE = /^\s*[*-]\s+/

function parseBlocks(text: string): Block[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  const paragraphs = trimmed.split(/\n\s*\n/)
  const blocks: Block[] = []

  for (const para of paragraphs) {
    const lines = para.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) continue
    const allBullets = lines.every((l) => BULLET_LINE.test(l))
    if (allBullets) {
      blocks.push({
        type: 'bullets',
        items: lines.map((l) => l.replace(BULLET_LINE, '').trim()),
      })
    } else {
      blocks.push({ type: 'paragraph', content: lines.join(' ') })
    }
  }

  return blocks
}

export default function SynthesisRenderer({ text }: SynthesisRendererProps) {
  const blocks = parseBlocks(text)
  if (blocks.length === 0) return null

  return (
    <div className="font-sans text-sm leading-relaxed space-y-3">
      {blocks.map((block, i) =>
        block.type === 'paragraph' ? (
          <p key={i}>{block.content}</p>
        ) : (
          <ul key={i} className="list-disc pl-5 space-y-1.5">
            {block.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}
