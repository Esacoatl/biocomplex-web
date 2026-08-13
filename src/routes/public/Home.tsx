import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { Container, SectionLabel } from '@/src/components/layout/Container'
import { BiocomplexName } from '@/src/components/layout/Wordmark'
import { HeroCollage } from '@/src/components/site/HeroCollage'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardTitle } from '@/src/components/ui/card'
import { news } from '@/src/lib/content/news'
import { publications } from '@/src/lib/content/publications'
import { researchLines } from '@/src/lib/content/research'
import { affiliations, site, stats } from '@/src/lib/content/site'
import { bi, formatDate, useLang, useT } from '@/src/lib/i18n'
import { fadeUp, stagger, variantsFor } from '@/src/lib/motion'
import { FALLBACK_ART, researchArt } from '@/src/components/site/artMap'
import { IllustrationPanel } from '@/src/components/site/IllustrationPanel'
import {
  IllBook,
  IllChart,
  IllEnvelope,
  IllFlask,
  IllMicroscope,
  type IllustrationProps,
  type IllustrationTone,
} from '@/src/components/site/Illustrations'

/** Las cuatro cosas que hacemos, en el orden en que ocurren. */
const WORKFLOW: {
  illustration: ComponentType<IllustrationProps>
  tone: IllustrationTone
  title: ReturnType<typeof bi>
  body: ReturnType<typeof bi>
}[] = [
  {
    illustration: IllMicroscope,
    tone: 'accent',
    title: bi('Observamos', 'We observe'),
    body: bi(
      'Muestras, cultivos y observación sistemática. Antes de explicar algo hay que verlo bien y verlo muchas veces.',
      'Samples, cultures and systematic observation. Before explaining something you have to see it well, and see it often.',
    ),
  },
  {
    illustration: IllFlask,
    tone: 'plum',
    title: bi('Experimentamos', 'We experiment'),
    body: bi(
      'Diseñamos experimentos con controles y réplicas suficientes para que el resultado signifique algo.',
      'We design experiments with enough controls and replicates for the result to mean something.',
    ),
  },
  {
    illustration: IllChart,
    tone: 'accent',
    title: bi('Analizamos', 'We analyse'),
    body: bi(
      'Estadística y modelado sobre los datos crudos, con el código versionado y cualquier figura reproducible.',
      'Statistics and modelling on the raw data, with versioned code and every figure reproducible.',
    ),
  },
  {
    illustration: IllBook,
    tone: 'amber',
    title: bi('Compartimos', 'We share'),
    body: bi(
      'Datos, protocolos y material docente abiertos desde el primer día, no al final del proyecto.',
      'Data, protocols and teaching material open from day one, not at the end of the project.',
    ),
  },
]

export function Home() {
  const t = useT()
  const lang = useLang()
  const pinned = news.find((n) => n.pinned)
  const featured = publications.filter((p) => p.highlight).slice(0, 3)
  const latest = news.filter((n) => !n.pinned).slice(0, 3)

  return (
    <>
      {/* ------------------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-paper pointer-events-none absolute inset-0" aria-hidden="true" />
        <Container className="relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <motion.div
            variants={variantsFor(stagger)}
            initial="initial"
            animate="animate"
            className="max-w-2xl"
          >
            <motion.p variants={variantsFor(fadeUp)} className="label-mono text-fg-faint">
              {t(site.institution)}
            </motion.p>

            <motion.h1 variants={variantsFor(fadeUp)} className="mt-5">
              <BiocomplexName className="text-fg block text-[clamp(3rem,8vw,5.5rem)] leading-[0.95]" />
              <span className="font-display text-fg-muted mt-3 block text-[clamp(1.3rem,3vw,2rem)] leading-tight italic">
                {t(site.descriptor)}
              </span>
            </motion.h1>

            <motion.p
              variants={variantsFor(fadeUp)}
              className="text-fg-subtle mt-6 max-w-[54ch] text-lg"
            >
              {t(site.tagline)}
            </motion.p>

            <motion.div variants={variantsFor(fadeUp)} className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/investigacion">
                  {t(bi('Ver investigación', 'See research'))}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/personas">{t(bi('Conocer al equipo', 'Meet the team'))}</Link>
              </Button>
            </motion.div>

            <motion.dl
              variants={variantsFor(fadeUp)}
              className="border-line mt-14 grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-8 sm:grid-cols-4"
            >
              {stats.map((stat) => (
                <div key={stat.value}>
                  <dt className="label-mono text-fg-faint">{t(stat.label)}</dt>
                  <dd className="font-display text-fg tabular mt-1 text-3xl">{stat.value}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <div className="relative hidden lg:block">
            <HeroCollage className="ml-auto w-full max-w-[400px]" />
          </div>
        </Container>
      </section>

      {/* ----------------------------------------------------------- Adscripciones */}
      <section className="border-line bg-sunken border-y">
        <Container className="flex flex-wrap items-center gap-x-10 gap-y-4 py-6">
          <p className="label-mono text-fg-faint">{t(bi('Parte de', 'Part of'))}</p>
          {affiliations.map((affiliation) => (
            <a
              key={affiliation.short}
              href={affiliation.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-fg-muted hover:text-accent group flex items-baseline gap-2 text-sm"
            >
              <span className="font-display text-lg" translate="no">
                {affiliation.short}
              </span>
              <span className="text-fg-faint hidden text-xs sm:inline">{t(affiliation.name)}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </a>
          ))}
        </Container>
      </section>

      {/* -------------------------------------------------------------- Convocatoria */}
      {pinned ? (
        <section className="py-14">
          <Container>
            <Card className="border-accent/30 bg-accent-soft overflow-hidden">
              <CardContent className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex max-w-2xl items-start gap-5">
                  <span className="bg-surface/60 hidden size-20 shrink-0 rounded-xl p-3.5 sm:block">
                    <IllEnvelope tone="accent" />
                  </span>
                  <div>
                    <Badge tone="accent" mono>
                      <Sparkles aria-hidden="true" />
                      {t(bi('Convocatoria abierta', 'Open call'))}
                    </Badge>
                    <h2 className="font-display text-fg mt-3 text-2xl">{t(pinned.title)}</h2>
                    <p className="text-fg-muted mt-2 text-sm">{t(pinned.body)}</p>
                  </div>
                </div>
                {pinned.cta ? (
                  <Button asChild className="shrink-0">
                    <Link to={pinned.cta.to}>
                      {t(pinned.cta.label)}
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          </Container>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ Cómo trabajamos */}
      <section className="py-14">
        <Container>
          <SectionLabel>{t(bi('Cómo trabajamos', 'How we work'))}</SectionLabel>
          <h2 className="font-display text-fg mt-4 max-w-2xl text-3xl leading-tight sm:text-4xl">
            {t(
              bi(
                'De la muestra al dato, y del dato a algo que otros puedan usar.',
                'From the sample to the data, and from the data to something others can use.',
              ),
            )}
          </h2>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW.map((step) => (
              <li key={step.title.en}>
                <Card className="hover:border-line-strong h-full">
                  <CardContent className="p-6">
                    <IllustrationPanel
                      illustration={step.illustration}
                      tone={step.tone}
                      size="lg"
                    />
                    <h3 className="text-fg mt-5 font-medium">{t(step.title)}</h3>
                    <p className="text-fg-subtle mt-2 text-sm">{t(step.body)}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- Investigación */}
      <section className="py-14">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>{t(bi('Líneas de investigación', 'Research lines'))}</SectionLabel>
              <h2 className="font-display text-fg mt-4 max-w-xl text-3xl leading-tight sm:text-4xl">
                {t(
                  bi(
                    'Teoría evolutiva, genética de poblaciones y modelos biofísicos.',
                    'Evolutionary theory, population genetics and biophysical models.',
                  ),
                )}
              </h2>
            </div>
            <Button asChild variant="link">
              <Link to="/investigacion">
                {t(bi('Todas las líneas', 'All lines'))}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {researchLines.slice(0, 3).map((line) => {
              const art = researchArt[line.id] ?? FALLBACK_ART
              return (
                <Card
                  key={line.id}
                  className="hover:border-accent/40 group hover:shadow-[var(--shadow-2)]"
                >
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span className="label-mono text-accent">{line.index}</span>
                      <IllustrationPanel
                        illustration={art.illustration}
                        tone={art.tone}
                        className="-mt-1"
                      />
                    </div>
                    <CardTitle className="mt-4 text-xl">{t(line.title)}</CardTitle>
                    <p className="text-fg-subtle mt-3 flex-1 text-sm">{t(line.summary)}</p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {line.methods.slice(0, 3).map((method) => (
                        <Badge key={method} tone="outline" translate="no">
                          {method}
                        </Badge>
                      ))}
                    </div>
                    <Link
                      to={`/investigacion#${line.id}`}
                      className="text-accent mt-6 inline-flex items-center gap-1.5 text-sm font-medium"
                    >
                      {t(bi('Leer más', 'Read more'))}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:translate-x-1"
                      />
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- Publicaciones */}
      <section className="py-14">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionLabel>
              {t(bi('Publicaciones destacadas', 'Featured publications'))}
            </SectionLabel>
            <Button asChild variant="link">
              <Link to="/publicaciones">
                {t(bi('Todas las publicaciones', 'All publications'))}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <ul className="border-line mt-8 border-t">
            {featured.map((publication) => (
              <li key={publication.id} className="border-line border-b">
                <a
                  href={
                    publication.doi
                      ? `https://doi.org/${publication.doi}`
                      : (publication.url ?? '#')
                  }
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group grid gap-2 py-6 sm:grid-cols-[6rem_1fr_auto] sm:items-baseline sm:gap-6"
                >
                  <span className="label-mono text-fg-faint tabular">{publication.year}</span>
                  <span className="min-w-0">
                    <span className="text-fg group-hover:text-accent block font-medium text-balance transition-colors">
                      {publication.title}
                    </span>
                    <span className="text-fg-subtle mt-1 block text-sm" translate="no">
                      {publication.authors.join(' · ')}
                    </span>
                    <span className="text-fg-faint mt-1 block text-xs italic">
                      {publication.venue}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="text-fg-faint group-hover:text-accent size-4 shrink-0 transition-transform group-hover:-translate-y-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ------------------------------------------------------------------- Noticias */}
      <section className="py-14">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionLabel>{t(bi('Últimas noticias', 'Latest news'))}</SectionLabel>
            <Button asChild variant="link">
              <Link to="/noticias">
                {t(bi('Ver todas', 'See all'))}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {latest.map((item) => (
              <Card key={item.id} className="hover:border-line-strong">
                <CardContent className="p-6">
                  <time className="label-mono text-fg-faint" dateTime={item.date}>
                    {formatDate(item.date, lang)}
                  </time>
                  <h3 className="text-fg mt-3 leading-snug font-medium text-balance">
                    {t(item.title)}
                  </h3>
                  <p className="text-fg-subtle mt-2 line-clamp-3 text-sm">{t(item.body)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
