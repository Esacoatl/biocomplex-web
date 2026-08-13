import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/src/components/layout/Container'
import { IllustrationPanel } from '@/src/components/site/IllustrationPanel'
import { resourceArt } from '@/src/components/site/artMap'
import { PageHeader } from '@/src/components/layout/PageHeader'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent } from '@/src/components/ui/card'
import { resourceKindLabel, resources } from '@/src/lib/content/resources'
import { bi, useT } from '@/src/lib/i18n'

export function Resources() {
  const t = useT()

  return (
    <>
      <PageHeader
        eyebrow={t(bi('Recursos', 'Resources'))}
        title={t(bi('Software, datos y material docente', 'Software, data and teaching material'))}
        lead={t(
          bi(
            'Todo lo que producimos es abierto. Úsalo, cítalo y avísanos si algo se rompe.',
            'Everything we produce is open. Use it, cite it, and tell us if something breaks.',
          ),
        )}
      />

      <Container className="py-14">
        <ul className="grid gap-4 md:grid-cols-2">
          {resources.map((resource) => {
            const art = resourceArt[resource.kind]
            return (
              <li key={resource.id}>
                <Card className="hover:border-accent/40 group h-full hover:shadow-[var(--shadow-2)]">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <IllustrationPanel
                        illustration={art.illustration}
                        tone={art.tone}
                        size="lg"
                      />
                      <Badge tone="outline" mono>
                        {t(resourceKindLabel[resource.kind])}
                      </Badge>
                    </div>

                    <h2 className="text-fg mt-5 text-lg font-semibold" translate="no">
                      {resource.name}
                    </h2>
                    <p className="text-fg-subtle mt-2 flex-1 text-sm">{t(resource.description)}</p>

                    <div className="border-line mt-5 flex items-center justify-between gap-4 border-t pt-4">
                      <span className="label-mono text-fg-faint" translate="no">
                        {resource.meta}
                      </span>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-accent hover:text-accent-hover inline-flex items-center gap-1 text-sm font-medium"
                      >
                        {t(bi('Abrir', 'Open'))}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-3.5 transition-transform group-hover:-translate-y-0.5"
                        />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      </Container>
    </>
  )
}
