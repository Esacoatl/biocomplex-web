import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/src/components/layout/Container'
import { PageHeader } from '@/src/components/layout/PageHeader'
import { IllustrationPanel } from '@/src/components/site/IllustrationPanel'
import { newsArt } from '@/src/components/site/artMap'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { news, newsKindLabel, type NewsKind } from '@/src/lib/content/news'
import { bi, formatDate, useLang, useT } from '@/src/lib/i18n'

const TONE: Record<NewsKind, 'accent' | 'amber' | 'plum' | 'neutral'> = {
  convocatoria: 'accent',
  publicacion: 'plum',
  evento: 'amber',
  equipo: 'neutral',
  premio: 'amber',
}

export function News() {
  const t = useT()
  const lang = useLang()
  const ordered = [...news].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageHeader
        eyebrow={t(bi('Noticias', 'News'))}
        title={t(bi('Qué está pasando', 'What is going on'))}
        lead={t(
          bi(
            'Convocatorias, publicaciones, seminarios y quién se suma al laboratorio.',
            'Open calls, publications, seminars and who joins the lab.',
          ),
        )}
      />

      <Container className="py-14">
        <ol className="divide-line divide-y">
          {ordered.map((item) => {
            const art = newsArt[item.kind]
            return (
            <li key={item.id} className="py-8 first:pt-0">
              <article className="grid gap-4 md:grid-cols-[10rem_1fr] md:gap-10">
                <div className="flex items-start gap-3 md:flex-col md:gap-3">
                  <IllustrationPanel illustration={art.illustration} tone={art.tone} />
                  <time className="label-mono text-fg-faint" dateTime={item.date}>
                    {formatDate(item.date, lang)}
                  </time>
                  <Badge tone={TONE[item.kind]} mono>
                    {t(newsKindLabel[item.kind])}
                  </Badge>
                </div>

                <div className="max-w-[62ch]">
                  <h2 className="font-display text-fg text-2xl leading-tight text-balance">
                    {t(item.title)}
                  </h2>
                  <p className="text-fg-muted mt-3">{t(item.body)}</p>
                  {item.cta ? (
                    <Button asChild variant="link" className="mt-4">
                      <Link to={item.cta.to}>
                        {t(item.cta.label)}
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </article>
            </li>
            )
          })}
        </ol>
      </Container>
    </>
  )
}
