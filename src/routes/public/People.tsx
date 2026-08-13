import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/src/components/layout/Container'
import { PageHeader } from '@/src/components/layout/PageHeader'
import { IllCell, IllPetri, type IllustrationTone } from '@/src/components/site/Illustrations'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent } from '@/src/components/ui/card'
import { people, roleLabel, roleOrder } from '@/src/lib/content/people'
import type { Role } from '@/src/lib/store/auth'
import { bi, useT } from '@/src/lib/i18n'
import { cn } from '@/src/lib/utils'

/** Un tono por rol: da color al directorio sin inventar fotos que no existen. */
const ROLE_TONE: Record<Role, IllustrationTone | 'neutral'> = {
  pi: 'accent',
  postdoc: 'plum',
  phd: 'accent',
  msc: 'amber',
  alumni: 'neutral',
}

const TONE_CLASS: Record<IllustrationTone | 'neutral', string> = {
  accent: 'bg-accent-soft text-accent border-accent/20',
  plum: 'bg-plum-soft text-plum border-plum/20',
  amber: 'bg-amber-soft text-amber border-amber/20',
  neutral: 'bg-sunken text-fg-subtle border-line',
}

function Initials({
  value,
  role,
  large = false,
}: {
  value: string
  role: Role
  large?: boolean
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'font-display grid shrink-0 place-items-center rounded-full border',
        TONE_CLASS[ROLE_TONE[role]],
        large ? 'size-20 text-2xl' : 'size-12 text-base',
      )}
    >
      {value}
    </span>
  )
}

export function People() {
  const t = useT()
  const pi = people.find((p) => p.role === 'pi')

  return (
    <>
      <PageHeader
        eyebrow={t(bi('Personas', 'People'))}
        title={t(bi('Quiénes hacen el trabajo', 'Who does the work'))}
        lead={t(
          bi(
            'Un grupo pequeño, con formación mezclada entre física, matemáticas, cómputo y biología. Se aprende en el seminario y en el pasillo.',
            'A small group with mixed training across physics, mathematics, computing and biology. We learn in the seminar and in the hallway.',
          ),
        )}
        aside={
          <div className="flex justify-center gap-4 md:justify-end">
            <span className="bg-accent-soft size-24 rounded-2xl p-4">
              <IllCell tone="accent" />
            </span>
            <span className="bg-amber-soft mt-6 size-24 rounded-2xl p-4">
              <IllPetri tone="amber" />
            </span>
          </div>
        }
      />

      <Container className="py-14">
        {pi ? (
          <Card className="mb-14">
            <CardContent className="flex flex-col gap-6 p-7 sm:flex-row sm:items-start">
              <Initials value={pi.initials} role={pi.role} large />
              <div className="min-w-0">
                <Badge tone="accent" mono>
                  {t(roleLabel.pi)}
                </Badge>
                <h2 className="font-display text-fg mt-3 text-2xl">{pi.name}</h2>
                <p className="text-fg-muted mt-3 max-w-[60ch]">{t(pi.focus)}</p>
                {pi.links ? (
                  <ul className="mt-5 flex flex-wrap gap-4">
                    {pi.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-accent hover:text-accent-hover inline-flex items-center gap-1 text-sm"
                        >
                          {link.label}
                          <ArrowUpRight aria-hidden="true" className="size-3.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {roleOrder
          .filter((role) => role !== 'pi')
          .map((role) => {
            const group = people.filter((p) => p.role === role)
            if (group.length === 0) return null

            return (
              <section key={role} className="border-line border-t py-10 first:border-t-0">
                <h2 className="label-mono text-fg-faint">
                  {t(roleLabel[role])} · <span className="tabular">{group.length}</span>
                </h2>

                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((person) => (
                    <li key={person.id}>
                      <Card className="hover:border-line-strong h-full">
                        <CardContent className="flex gap-4 p-5">
                          <Initials value={person.initials} role={person.role} />
                          <div className="min-w-0">
                            <p className="text-fg leading-snug font-medium">{person.name}</p>
                            <p className="text-fg-faint mt-0.5 text-xs">
                              {t(person.title)} · {t(bi('desde', 'since'))}{' '}
                              <span className="tabular">{person.since}</span>
                            </p>
                            <p className="text-fg-subtle mt-2 text-sm">{t(person.focus)}</p>
                            {person.alumni ? (
                              <p className="text-fg-faint mt-2 text-xs italic">
                                {t(bi('Ahora', 'Now'))}: {t(person.alumni.now)}
                              </p>
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
      </Container>
    </>
  )
}
