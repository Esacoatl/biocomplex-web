import { AlertTriangle, Flame, HelpCircle, Info, Lightbulb, Link2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { resolveLink } from '@/src/lib/vault'
import { cn } from '@/src/lib/utils'

/* --------------------------------------------------------------------------
   Renderizador de Markdown mínimo, suficiente para las notas de la bóveda.
   Se escribe a mano en vez de traer una dependencia porque el conjunto de
   sintaxis que usamos es cerrado y necesitamos control sobre los [[wikilinks]].
   -------------------------------------------------------------------------- */

const INLINE_RE = /(\[\[[^\]]+\]\])|(\[[^\]]+\]\([^)]+\))|(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g

function InlineWikilink({ raw }: { raw: string }) {
  const inner = raw.slice(2, -2)
  const [target = '', alias] = inner.split('|')
  const note = resolveLink(target)
  const label = alias ?? note?.title ?? target

  if (!note) {
    return (
      <span
        className="cursor-help underline decoration-dotted underline-offset-3 opacity-60"
        title="Nota inexistente en la bóveda"
      >
        {label}
      </span>
    )
  }

  return (
    <Link
      to={`/boveda/nota/${encodeURIComponent(note.path)}`}
      className="text-accent hover:text-accent-hover inline-flex items-baseline gap-1 rounded-[3px] underline decoration-dashed underline-offset-3"
    >
      <Link2 aria-hidden="true" className="size-3 self-center opacity-70" />
      {label}
    </Link>
  )
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let i = 0

  for (const match of text.matchAll(INLINE_RE)) {
    const at = match.index ?? 0
    if (at > last) out.push(text.slice(last, at))
    const raw = match[0]
    const key = `${keyPrefix}-i${i++}`

    if (raw.startsWith('[[')) {
      out.push(<InlineWikilink key={key} raw={raw} />)
    } else if (raw.startsWith('[')) {
      const label = raw.slice(1, raw.indexOf(']'))
      const href = raw.slice(raw.indexOf('](') + 2, -1)
      out.push(
        <a key={key} href={href} target="_blank" rel="noreferrer noopener">
          {label}
        </a>,
      )
    } else if (raw.startsWith('`')) {
      out.push(<code key={key}>{raw.slice(1, -1)}</code>)
    } else if (raw.startsWith('**')) {
      out.push(
        <strong key={key} className="text-fg font-semibold">
          {raw.slice(2, -2)}
        </strong>,
      )
    } else {
      out.push(<em key={key}>{raw.slice(1, -1)}</em>)
    }
    last = at + raw.length
  }

  if (last < text.length) out.push(text.slice(last))
  return out
}

const CALLOUTS = {
  note: { icon: Info, className: 'border-accent bg-accent-soft', label: 'Nota' },
  tip: { icon: Lightbulb, className: 'border-accent bg-accent-soft', label: 'Tip' },
  question: { icon: HelpCircle, className: 'border-plum bg-plum-soft', label: 'Pregunta' },
  warning: { icon: AlertTriangle, className: 'border-amber bg-amber-soft', label: 'Atención' },
  danger: { icon: Flame, className: 'border-danger bg-danger-soft', label: 'Importante' },
} as const

type CalloutKind = keyof typeof CALLOUTS

function Callout({
  kind,
  title,
  children,
}: {
  kind: CalloutKind
  title: string
  children: ReactNode
}) {
  const { icon: Icon, className, label } = CALLOUTS[kind]
  return (
    <aside className={cn('rounded-md border-l-2 px-4 py-3', className)}>
      <p className="text-fg m-0 flex items-center gap-2 text-sm font-semibold">
        <Icon aria-hidden="true" className="size-4" />
        {title || label}
      </p>
      <div className="mt-1 text-sm">{children}</div>
    </aside>
  )
}

function TaskItem({ done, children }: { done: boolean; children: ReactNode }) {
  return (
    <li className="-ml-5 flex list-none items-start gap-2">
      <span
        aria-hidden="true"
        className={cn(
          'mt-[5px] grid size-4 shrink-0 place-items-center rounded-[4px] border text-[10px]',
          done ? 'bg-accent border-accent text-on-accent' : 'border-line-strong',
        )}
      >
        {done ? '✓' : ''}
      </span>
      <span className={cn('min-w-0', done && 'text-fg-faint line-through')}>
        <span className="sr-only">{done ? 'Completado: ' : 'Pendiente: '}</span>
        {children}
      </span>
    </li>
  )
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const lines = source.split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  const nextKey = () => `b${key++}`

  while (i < lines.length) {
    const line = lines[i] ?? ''

    // Línea en blanco
    if (!line.trim()) {
      i++
      continue
    }

    // Bloque de código
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const buf: string[] = []
      i++
      while (i < lines.length && !(lines[i] ?? '').startsWith('```')) {
        buf.push(lines[i] ?? '')
        i++
      }
      i++ // cierre
      blocks.push(
        <pre key={nextKey()} data-lang={lang || undefined}>
          <code>{buf.join('\n')}</code>
        </pre>,
      )
      continue
    }

    // Encabezados
    const heading = /^(#{1,4})\s+(.*)$/.exec(line)
    if (heading) {
      const level = (heading[1] ?? '#').length
      const text = heading[2] ?? ''
      const id = text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .trim()
        .replace(/\s+/g, '-')
      const Tag = (level === 1 ? 'h2' : level === 2 ? 'h3' : 'h4') as 'h2' | 'h3' | 'h4'
      blocks.push(
        <Tag key={nextKey()} id={id}>
          {renderInline(text, nextKey())}
        </Tag>,
      )
      i++
      continue
    }

    // Separador
    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr key={nextKey()} />)
      i++
      continue
    }

    // Cita / callout
    if (line.startsWith('>')) {
      const buf: string[] = []
      while (i < lines.length && (lines[i] ?? '').startsWith('>')) {
        buf.push((lines[i] ?? '').replace(/^>\s?/, ''))
        i++
      }
      const first = buf[0] ?? ''
      const callout = /^\[!(\w+)\]\s*(.*)$/.exec(first)
      const inner = (
        <Markdown source={(callout ? buf.slice(1) : buf).join('\n')} className="contents" />
      )

      if (callout) {
        const kind = (callout[1] ?? 'note').toLowerCase() as CalloutKind
        blocks.push(
          <Callout key={nextKey()} kind={kind in CALLOUTS ? kind : 'note'} title={callout[2] ?? ''}>
            {inner}
          </Callout>,
        )
      } else {
        blocks.push(<blockquote key={nextKey()}>{inner}</blockquote>)
      }
      continue
    }

    // Tabla
    if (line.trim().startsWith('|')) {
      const rows: string[] = []
      while (i < lines.length && (lines[i] ?? '').trim().startsWith('|')) {
        rows.push((lines[i] ?? '').trim())
        i++
      }
      const cells = (row: string) =>
        row
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => c.trim())
      const header = cells(rows[0] ?? '')
      const body = rows.slice(2).map(cells)
      blocks.push(
        <div key={nextKey()} className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                {header.map((cell, ci) => (
                  <th key={ci}>{renderInline(cell, `th${ci}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{renderInline(cell, `td${ri}-${ci}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }

    // Listas
    const bullet = /^[-*]\s+/
    const ordered = /^\d+\.\s+/
    if (bullet.test(line) || ordered.test(line)) {
      const isOrdered = ordered.test(line)
      const items: string[] = []
      while (i < lines.length) {
        const current = lines[i] ?? ''
        if (!(bullet.test(current) || ordered.test(current))) break
        items.push(current.replace(bullet, '').replace(ordered, ''))
        i++
      }
      const ListTag = isOrdered ? 'ol' : 'ul'
      blocks.push(
        <ListTag key={nextKey()}>
          {items.map((item, ii) => {
            const task = /^\[([ xX])\]\s+(.*)$/.exec(item)
            if (task) {
              return (
                <TaskItem key={ii} done={(task[1] ?? ' ').toLowerCase() === 'x'}>
                  {renderInline(task[2] ?? '', `t${ii}`)}
                </TaskItem>
              )
            }
            return <li key={ii}>{renderInline(item, `li${ii}`)}</li>
          })}
        </ListTag>,
      )
      continue
    }

    // Párrafo
    const paragraph: string[] = []
    while (i < lines.length) {
      const current = lines[i] ?? ''
      if (
        !current.trim() ||
        current.startsWith('#') ||
        current.startsWith('>') ||
        current.startsWith('```') ||
        current.trim().startsWith('|') ||
        bullet.test(current) ||
        ordered.test(current)
      )
        break
      paragraph.push(current)
      i++
    }
    blocks.push(<p key={nextKey()}>{renderInline(paragraph.join(' '), nextKey())}</p>)
  }

  return <div className={cn('prose-lab', className)}>{blocks}</div>
}
