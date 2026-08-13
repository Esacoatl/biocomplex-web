import { ArrowLeft, ArrowUpRight, CornerUpLeft, FileWarning, Link2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Markdown } from '@/src/components/vault/Markdown'
import { bi, formatDate, useLang, useT } from '@/src/lib/i18n'
import { backlinks, getNote, outgoingLinks } from '@/src/lib/vault'

const STATUS_TONE = {
  borrador: 'amber',
  'en-progreso': 'accent',
  revisado: 'neutral',
  archivado: 'outline',
} as const

export function NoteRoute() {
  const t = useT()
  const lang = useLang()
  const { '*': splat } = useParams()
  const path = decodeURIComponent(splat ?? '')
  const note = getNote(path)

  if (!note) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <FileWarning aria-hidden="true" className="text-fg-faint mx-auto size-8" />
        <h1 className="font-display text-fg mt-5 text-2xl">
          {t(bi('Esta nota no existe', 'This note does not exist'))}
        </h1>
        <p className="text-fg-subtle mt-2 text-sm">
          {t(bi('Ruta buscada', 'Path requested'))}: <code className="font-mono">{path}</code>
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/boveda">
            <ArrowLeft aria-hidden="true" />
            {t(bi('Volver al resumen', 'Back to overview'))}
          </Link>
        </Button>
      </div>
    )
  }

  const incoming = backlinks(note)
  const outgoing = outgoingLinks(note)
  const folder = note.path.split('/').slice(0, -1).join(' / ')

  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <div className="grid gap-10 xl:grid-cols-[1fr_16rem]">
        <div className="min-w-0">
          <nav aria-label={t(bi('Ubicación', 'Location'))} className="label-mono text-fg-faint">
            {folder || t(bi('Raíz', 'Root'))}
          </nav>

          <h1 className="font-display text-fg mt-3 text-3xl leading-tight text-balance sm:text-4xl">
            {note.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Badge tone={STATUS_TONE[note.status]} mono>
              {note.status}
            </Badge>
            {note.tags.map((tag) => (
              <Link key={tag} to={`/boveda/etiquetas?tag=${encodeURIComponent(tag)}`}>
                <Badge tone="outline" className="hover:text-accent hover:border-accent/40">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>

          <dl className="text-fg-faint border-line mt-5 flex flex-wrap gap-x-6 gap-y-1 border-y py-3 text-xs">
            <div className="flex gap-1.5">
              <dt>{t(bi('Autoría', 'Author'))}:</dt>
              <dd className="text-fg-subtle" translate="no">
                {note.author}
              </dd>
            </div>
            <div className="flex gap-1.5">
              <dt>{t(bi('Creada', 'Created'))}:</dt>
              <dd className="text-fg-subtle">{formatDate(note.created, lang)}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt>{t(bi('Actualizada', 'Updated'))}:</dt>
              <dd className="text-fg-subtle">{formatDate(note.updated, lang)}</dd>
            </div>
          </dl>

          <Markdown source={note.body} className="mt-8 max-w-[var(--measure)]" />
        </div>

        {/* ------------------------------------------------------------- Rail lateral */}
        <aside className="xl:sticky xl:top-20 xl:self-start">
          <section>
            <h2 className="label-mono text-fg-faint flex items-center gap-2">
              <CornerUpLeft aria-hidden="true" className="size-3.5" />
              {t(bi('Enlaces entrantes', 'Backlinks'))}
              <span className="tabular">{incoming.length}</span>
            </h2>
            {incoming.length === 0 ? (
              <p className="text-fg-faint mt-3 text-sm">
                {t(bi('Ninguna nota apunta aquí todavía.', 'No note points here yet.'))}
              </p>
            ) : (
              <ul className="mt-3 space-y-1.5">
                {incoming.map((linked) => (
                  <li key={linked.path}>
                    <Link
                      to={`/boveda/nota/${encodeURIComponent(linked.path)}`}
                      className="text-fg-muted hover:text-accent hover:bg-sunken block truncate rounded-sm px-2 py-1.5 text-sm"
                    >
                      {linked.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-8">
            <h2 className="label-mono text-fg-faint flex items-center gap-2">
              <Link2 aria-hidden="true" className="size-3.5" />
              {t(bi('Enlaces salientes', 'Outgoing links'))}
              <span className="tabular">{outgoing.length}</span>
            </h2>
            {outgoing.length === 0 ? (
              <p className="text-fg-faint mt-3 text-sm">
                {t(bi('Esta nota no enlaza a otras.', 'This note links nowhere.'))}
              </p>
            ) : (
              <ul className="mt-3 space-y-1.5">
                {outgoing.map((linked) => (
                  <li key={linked.path}>
                    <Link
                      to={`/boveda/nota/${encodeURIComponent(linked.path)}`}
                      className="text-fg-muted hover:text-accent hover:bg-sunken flex items-center gap-1.5 truncate rounded-sm px-2 py-1.5 text-sm"
                    >
                      <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0 opacity-50" />
                      {linked.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </article>
  )
}
