import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Container } from '@/src/components/layout/Container'
import { PageHeader } from '@/src/components/layout/PageHeader'
import { Badge } from '@/src/components/ui/badge'
import { HeroFigure } from '@/src/components/site/HeroFigure'
import { IllustrationPanel } from '@/src/components/site/IllustrationPanel'
import { FALLBACK_ART, researchArt } from '@/src/components/site/artMap'
import { researchLines } from '@/src/lib/content/research'
import { bi, useT } from '@/src/lib/i18n'

const STATUS_TONE = {
  active: 'accent',
  exploratory: 'plum',
  closing: 'neutral',
} as const

const STATUS_LABEL = {
  active: bi('Activa', 'Active'),
  exploratory: bi('Exploratoria', 'Exploratory'),
  closing: bi('En cierre', 'Wrapping up'),
}

export function Research() {
  const t = useT()
  const { hash } = useLocation()

  // Deep-link a una línea concreta: /investigacion#dinamica-circuitos
  useEffect(() => {
    if (!hash) return
    const target = document.getElementById(hash.slice(1))
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  return (
    <>
      <PageHeader
        eyebrow={t(bi('Investigación', 'Research'))}
        title={t(bi('Qué preguntamos y cómo', 'What we ask, and how'))}
        lead={t(
          bi(
            'Seis líneas de trabajo, del banco de laboratorio al modelo computacional. Los temas de esta página son de ejemplo: aquí van las líneas reales del laboratorio.',
            'Six lines of work, from the lab bench to the computational model. The topics on this page are placeholders: the real research lines go here.',
          ),
        )}
        aside={<HeroFigure className="text-accent mx-auto w-52 md:mx-0 md:ml-auto" />}
      />

      <Container className="py-14">
        <ol className="divide-line divide-y">
          {researchLines.map((line) => {
            const art = researchArt[line.id] ?? FALLBACK_ART
            return (
            <li key={line.id} id={line.id} className="py-12 first:pt-0">
              <article className="grid gap-8 lg:grid-cols-[auto_1fr_16rem]">
                <div className="flex items-center gap-5 lg:block">
                  <p className="font-display text-fg-faint tabular text-4xl leading-none">
                    {line.index}
                  </p>
                  <IllustrationPanel
                    illustration={art.illustration}
                    tone={art.tone}
                    size="lg"
                    className="lg:mt-5"
                  />
                </div>

                <div className="max-w-[62ch]">
                  <h2 className="font-display text-fg text-2xl leading-tight sm:text-3xl">
                    {t(line.title)}
                  </h2>
                  <p className="text-fg-muted mt-4">{t(line.summary)}</p>
                  <p className="text-fg-subtle mt-4 text-sm">{t(line.detail)}</p>
                </div>

                <div className="lg:pl-6">
                  <Badge tone={STATUS_TONE[line.status]} mono>
                    {t(STATUS_LABEL[line.status])}
                  </Badge>
                  <p className="label-mono text-fg-faint mt-6">{t(bi('Métodos', 'Methods'))}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {line.methods.map((method) => (
                      <li key={method}>
                        <Badge tone="outline" translate="no">
                          {method}
                        </Badge>
                      </li>
                    ))}
                  </ul>
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
