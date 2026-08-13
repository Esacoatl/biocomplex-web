import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container } from '@/src/components/layout/Container'
import { PageHeader } from '@/src/components/layout/PageHeader'
import { Badge } from '@/src/components/ui/badge'
import { publications, pubTypeLabel, type PubType } from '@/src/lib/content/publications'
import { bi, useT } from '@/src/lib/i18n'
import { cn } from '@/src/lib/utils'

const TYPES: PubType[] = ['article', 'preprint', 'chapter', 'software']

export function Publications() {
  const t = useT()
  // El filtro vive en la URL: se puede compartir y sobrevive al recargar.
  const [params, setParams] = useSearchParams()
  const active = params.get('tipo')

  const filtered = active ? publications.filter((p) => p.type === active) : publications
  const years = [...new Set(filtered.map((p) => p.year))].sort((a, b) => b - a)

  const setFilter = (type: PubType | null) => {
    const next = new URLSearchParams(params)
    if (type) next.set('tipo', type)
    else next.delete('tipo')
    setParams(next, { replace: true })
  }

  return (
    <>
      <PageHeader
        eyebrow={t(bi('Publicaciones', 'Publications'))}
        title={t(bi('Lo que hemos publicado', 'What we have published'))}
        lead={t(
          bi(
            'Todo el código y los datos de nuestros artículos son públicos. Si algo no se puede reproducir, avísanos y lo arreglamos.',
            'All code and data behind our papers are public. If something cannot be reproduced, tell us and we will fix it.',
          ),
        )}
      />

      <Container className="py-12">
        <div
          role="group"
          aria-label={t(bi('Filtrar por tipo', 'Filter by type'))}
          className="flex flex-wrap gap-2"
        >
          <FilterChip active={!active} onClick={() => setFilter(null)}>
            {t(bi('Todo', 'All'))} <span className="tabular">({publications.length})</span>
          </FilterChip>
          {TYPES.map((type) => {
            const count = publications.filter((p) => p.type === type).length
            return (
              <FilterChip key={type} active={active === type} onClick={() => setFilter(type)}>
                {t(pubTypeLabel[type])} <span className="tabular">({count})</span>
              </FilterChip>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="text-fg-subtle mt-12 text-sm">
            {t(
              bi('No hay publicaciones de este tipo todavía.', 'No publications of this type yet.'),
            )}
          </p>
        ) : (
          years.map((year) => (
            <section key={year} className="mt-12">
              <h2 className="label-mono text-fg-faint border-line tabular border-b pb-3">{year}</h2>
              <ul className="divide-line divide-y">
                {filtered
                  .filter((p) => p.year === year)
                  .map((publication) => (
                    <li key={publication.id}>
                      <article className="grid gap-3 py-6 sm:grid-cols-[1fr_9rem] sm:gap-8">
                        <div className="min-w-0">
                          <h3 className="text-fg leading-snug font-medium text-balance">
                            {publication.doi || publication.url ? (
                              <a
                                href={
                                  publication.doi
                                    ? `https://doi.org/${publication.doi}`
                                    : publication.url
                                }
                                target="_blank"
                                rel="noreferrer noopener"
                                className="hover:text-accent group inline-flex items-start gap-1.5"
                              >
                                {publication.title}
                                <ArrowUpRight
                                  aria-hidden="true"
                                  className="mt-1 size-3.5 shrink-0 opacity-40 group-hover:opacity-100"
                                />
                              </a>
                            ) : (
                              publication.title
                            )}
                          </h3>
                          <p className="text-fg-subtle mt-1.5 text-sm" translate="no">
                            {publication.authors.join(' · ')}
                          </p>
                          <p className="text-fg-faint mt-1 text-xs italic">{publication.venue}</p>
                          {publication.note ? (
                            <p className="text-amber mt-2 text-xs">{t(publication.note)}</p>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap items-start gap-2 sm:justify-end">
                          <Badge tone={publication.type === 'preprint' ? 'amber' : 'neutral'} mono>
                            {t(pubTypeLabel[publication.type])}
                          </Badge>
                          {publication.doi ? (
                            <span className="text-fg-faint w-full font-mono text-[10px] break-all sm:text-right">
                              {publication.doi}
                            </span>
                          ) : null}
                        </div>
                      </article>
                    </li>
                  ))}
              </ul>
            </section>
          ))
        )}
      </Container>
    </>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'h-9 cursor-pointer rounded-md border px-3.5 text-[13px] transition-colors duration-[var(--motion-fast)]',
        active
          ? 'border-accent bg-accent text-on-accent'
          : 'border-line text-fg-muted hover:border-line-strong hover:text-fg',
      )}
    >
      {children}
    </button>
  )
}
