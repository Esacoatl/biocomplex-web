import { Link, useSearchParams } from 'react-router-dom'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent } from '@/src/components/ui/card'
import { bi, formatDate, useLang, useT } from '@/src/lib/i18n'
import { allTags, notesByTag, vaultNotes } from '@/src/lib/vault'
import { cn } from '@/src/lib/utils'

export function TagsRoute() {
  const t = useT()
  const lang = useLang()
  // La etiqueta seleccionada vive en la URL para poder compartir la vista.
  const [params, setParams] = useSearchParams()
  const active = params.get('tag')
  const tags = allTags()
  const notes = active ? notesByTag(active) : vaultNotes

  const select = (tag: string | null) => {
    const next = new URLSearchParams(params)
    if (tag) next.set('tag', tag)
    else next.delete('tag')
    setParams(next, { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <p className="label-mono text-fg-faint">{t(bi('Bóveda', 'Vault'))}</p>
      <h1 className="font-display text-fg mt-3 text-3xl sm:text-4xl">
        {t(bi('Etiquetas', 'Tags'))}
      </h1>

      <div
        role="group"
        aria-label={t(bi('Filtrar por etiqueta', 'Filter by tag'))}
        className="mt-8 flex flex-wrap gap-2"
      >
        <button
          type="button"
          onClick={() => select(null)}
          aria-pressed={!active}
          className={cn(
            'h-8 cursor-pointer rounded-md border px-3 text-[13px]',
            !active
              ? 'border-accent bg-accent text-on-accent'
              : 'border-line text-fg-muted hover:border-line-strong',
          )}
        >
          {t(bi('Todas', 'All'))}
        </button>
        {tags.map((tag) => (
          <button
            key={tag.tag}
            type="button"
            onClick={() => select(tag.tag)}
            aria-pressed={active === tag.tag}
            className={cn(
              'flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-[13px]',
              active === tag.tag
                ? 'border-accent bg-accent text-on-accent'
                : 'border-line text-fg-muted hover:border-line-strong',
            )}
          >
            #{tag.tag}
            <span className="tabular opacity-60">{tag.count}</span>
          </button>
        ))}
      </div>

      <p className="text-fg-faint mt-8 text-sm">
        <span className="tabular">{notes.length}</span>{' '}
        {t(notes.length === 1 ? bi('nota', 'note') : bi('notas', 'notes'))}
        {active ? ` · #${active}` : ''}
      </p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {notes.map((note) => (
          <li key={note.path}>
            <Link to={`/boveda/nota/${encodeURIComponent(note.path)}`} className="block h-full">
              <Card className="hover:border-accent/40 h-full">
                <CardContent className="p-5">
                  <p className="text-fg font-medium">{note.title}</p>
                  <p className="text-fg-faint mt-1 truncate text-xs">{note.path}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {note.tags.map((tag) => (
                      <Badge key={tag} tone={tag === active ? 'accent' : 'outline'}>
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-fg-faint mt-3 text-xs">
                    {t(bi('Actualizada', 'Updated'))} {formatDate(note.updated, lang)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
