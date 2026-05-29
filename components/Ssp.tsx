import { Fragment, type ReactNode } from 'react'

/**
 * Ssp* primitive family — the v2 "lab-document" chrome.
 *
 * Redesign Sprint 0 (2026-05-29). React server components lifting the *visual
 * output* of the claude.ai/design v2 bundle (`subpage-system.jsx` + the `.ssp-*`
 * CSS, now in app/globals.css) — NOT the prototype's babel-mount structure.
 *
 * These are the stable base the per-surface redesign sprints compose against.
 * They coexist with the legacy SectionCard / Tag / TagLinkList through the
 * migration window; each per-surface sprint swaps its page composition over.
 *
 * Responsive behavior is driven by CSS container queries (`@container ssppage`)
 * defined alongside the `.ssp-*` classes — wrap a page in `.ssp-page` to activate.
 */

export type AccentTone = 'green' | 'coral' | 'teal' | 'amber' | 'plum'

/** Chip — v2 chip primitive in one of the 5 flavor-accent tones. */
export function Chip({ name, tone }: { name: ReactNode; tone?: AccentTone }) {
  return <span className={tone ? `chip ${tone}` : 'chip'}>{name}</span>
}

/**
 * StatusPill — dot + mono-uppercase label. Default green; `amber` for roast,
 * and the three lifecycle tones (lavender / resolved / archive) for the Sprint 2
 * green pages. Deliberately distinct from {@link Chip} — a status never reads as
 * a flavor chip.
 */
export type StatusTone = 'amber' | 'lavender' | 'resolved' | 'archive'

export function StatusPill({ label, tone }: { label: ReactNode; tone?: StatusTone }) {
  return (
    <span className={tone ? `status ${tone}` : 'status'}>
      <span className="dot" />
      {label}
    </span>
  )
}

/** TopBar — black mono strip. Optional left slots; `·` only between present slots. */
export function SspTopBar({
  brewId,
  date,
  roaster,
  kind = 'Tasting Sheet',
}: {
  brewId?: string
  date?: string
  roaster?: string
  kind?: string
}) {
  const parts = [brewId, date, roaster].filter(Boolean) as string[]
  return (
    <div className="ssp-topbar">
      <div className="l">
        {parts.map((p, i) => (
          <Fragment key={i}>
            {i > 0 ? <span>·</span> : null}
            <b>{p}</b>
          </Fragment>
        ))}
      </div>
      <div className="r">{kind}</div>
    </div>
  )
}

export type MetaPair = { label: string; value: ReactNode }

/**
 * NamePlate — plum-edged plate + sans 22px title + label-value meta + status pills.
 * `coverColor` adds a swatch beside the title (sibling pages); `edgeColor` overrides
 * the left edge. h1 is SANS per redesign ratification #2 (detail-page hero stays sans).
 */
export function SspNamePlate({
  title,
  meta,
  pills,
  coverColor,
  coverContent,
  edgeColor,
}: {
  title: ReactNode
  meta: MetaPair[]
  pills?: ReactNode[]
  coverColor?: string
  coverContent?: ReactNode
  edgeColor?: string
}) {
  const style = edgeColor
    ? ({ ['--hero-plum' as string]: edgeColor } as React.CSSProperties)
    : undefined

  const body = (
    <>
      <h1>{title}</h1>
      <div className="meta">
        {meta.map((m) => (
          <div key={m.label}>
            <b>{m.label}</b>
            {m.value}
          </div>
        ))}
      </div>
      {pills && pills.length ? <div className="pills">{pills}</div> : null}
    </>
  )

  if (!coverColor) {
    return (
      <div className="ssp-name" style={style}>
        {body}
      </div>
    )
  }

  return (
    <div className="ssp-name has-cover" style={style}>
      <div className="inner">
        <div className="swatch" style={{ background: coverColor }}>
          {coverContent}
        </div>
        <div className="content">{body}</div>
      </div>
    </div>
  )
}

/** Section head — hairline-prefixed mono label + optional right-aligned context. */
export function SspShead({ children, ct }: { children: ReactNode; ct?: ReactNode }) {
  return (
    <div className="ssp-shead">
      {children}
      {ct ? <span className="ct">{ct}</span> : null}
    </div>
  )
}

export type KVItem = { label: string; value: ReactNode }

/**
 * KVStrip — dark mono key-value strip (3-col → 6-col at container width).
 * The brew-specific Reference Brew Recipe header is the same primitive; import
 * `SspRecipeHead` (alias) when the semantic is recipe-specific.
 */
export function SspKVStrip({ items }: { items: KVItem[] }) {
  return (
    <div className="ssp-rcphead">
      {items.map((it) => (
        <div className="c" key={it.label}>
          <b>{it.label}</b>
          <span>{it.value}</span>
        </div>
      ))}
    </div>
  )
}

/** Brew-specific alias of {@link SspKVStrip} for the Reference Brew Recipe header. */
export const SspRecipeHead = SspKVStrip

export type TimelineStep = { t: ReactNode; label: ReactNode; desc: ReactNode }

/** Timeline — time / label / desc rows. Brew-specific; only for genuine time-coded data. */
export function SspTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="ssp-tl">
      {steps.map((s, i) => (
        <div className="step" key={i}>
          <div className="t">{s.t}</div>
          <div className="lbl">{s.label}</div>
          <div className="desc">{s.desc}</div>
        </div>
      ))}
    </div>
  )
}

/**
 * Modifier panel — strategy chip + modifier chips + optional prose detail row.
 * `detail` and `tastedAs` are optional; their rows omit when empty so sparse
 * brews (modifiers but no detail) don't render blank rows. `tastedAs` carries
 * Latent's `extraction_confirmed` divergence ("planned Balanced, drank like
 * Suppression") as a 4th row.
 */
export function SspModifier({
  strategy,
  modifiers,
  detail,
  tastedAs,
}: {
  strategy: ReactNode
  modifiers: string[]
  detail?: ReactNode
  tastedAs?: ReactNode
}) {
  return (
    <div className="ssp-mod">
      <div className="row">
        <div className="lbl">Extraction Strategy</div>
        <div className="val">
          <Chip name={strategy} tone="coral" />
        </div>
      </div>
      {modifiers.length > 0 && (
        <div className="row">
          <div className="lbl">Modifiers</div>
          <div className="val">
            {modifiers.map((m) => (
              <Chip key={m} name={m} tone="green" />
            ))}
          </div>
        </div>
      )}
      {detail ? (
        <div className="row prose">
          <div className="lbl">Modifier Detail</div>
          <div className="val">{detail}</div>
        </div>
      ) : null}
      {tastedAs ? (
        <div className="row prose">
          <div className="lbl">Tasted As (differs)</div>
          <div className="val">{tastedAs}</div>
        </div>
      ) : null}
    </div>
  )
}

export type AxisCat = 'floral' | 'fruit' | 'tea' | 'spice'
export type AxisFlavor = { name: string; cat: AxisCat }

/**
 * FlavorAxis — 4-cell categorical bucket (Floral / Fruit / Tea-Tannin / Spice),
 * each accent-tinted. Empty cells show `—`. Notes route via their `cat`.
 */
export function SspFlavorAxis({
  flavors,
  hints = {},
}: {
  flavors: AxisFlavor[]
  hints?: Partial<Record<AxisCat, string>>
}) {
  const cols: { key: AxisCat; label: string }[] = [
    { key: 'floral', label: 'Floral' },
    { key: 'fruit', label: 'Fruit' },
    { key: 'tea', label: 'Tea / Tannin' },
    { key: 'spice', label: 'Spice' },
  ]
  return (
    <div className="ssp-axis">
      {cols.map((c) => {
        const notes = flavors.filter((f) => f.cat === c.key)
        return (
          <div className={`col ${c.key}`} key={c.key}>
            <b>{c.label}</b>
            <div className="nlist">
              {notes.length ? (
                notes.map((f) => (
                  <div className="note" key={f.name}>
                    {f.name}
                  </div>
                ))
              ) : (
                <div className="empty">—</div>
              )}
              {hints[c.key] ? <div className="hint">({hints[c.key]})</div> : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export type StructureRow = { lbl: string; chips: { name: string; tone?: AccentTone }[] }

/** Structure — label-row + chip-row blocks. Reusable for cup characteristics. */
export function SspStructure({ rows }: { rows: StructureRow[] }) {
  return (
    <div className="ssp-struc">
      {rows.map((r) => (
        <div className="row" key={r.lbl}>
          <div className="lbl">{r.lbl}</div>
          <div className="val">
            {r.chips.map((c) => (
              <Chip key={c.name} name={c.name} tone={c.tone} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export type IdentCell = { label: string; value: ReactNode; sub?: ReactNode }

/** IdentGrid — 5-cell tabular metadata (2-col → 5-col at container width). */
export function SspIdentGrid({ cells }: { cells: IdentCell[] }) {
  return (
    <div className="ssp-ident">
      {cells.map((c) => (
        <div className="cell" key={c.label}>
          <b>{c.label}</b>
          <span className="v">{c.value}</span>
          {c.sub ? <span className="sub">{c.sub}</span> : null}
        </div>
      ))}
    </div>
  )
}
