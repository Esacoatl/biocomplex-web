import { CheckCircle2, Loader2, Mail, MapPin, Send } from 'lucide-react'
import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Container, SectionLabel } from '@/src/components/layout/Container'
import { PageHeader } from '@/src/components/layout/PageHeader'
import { IllEnvelope, IllPhylogeny } from '@/src/components/site/Illustrations'
import { Card, CardContent } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Input, Label } from '@/src/components/ui/input'
import { site } from '@/src/lib/content/site'
import { bi, useT } from '@/src/lib/i18n'
import { cn } from '@/src/lib/utils'

type Errors = Partial<Record<'name' | 'email' | 'message', string>>

const OPPORTUNITIES = [
  {
    title: bi('Doctorado', 'PhD'),
    body: bi(
      'Convocatoria abierta hasta el 30 de septiembre. Se busca formación cuantitativa y gusto por programar.',
      'Applications open until September 30. Quantitative training and a taste for programming expected.',
    ),
    open: true,
  },
  {
    title: bi('Maestría', 'MSc'),
    body: bi(
      'Recibimos solicitudes en la convocatoria institucional de febrero.',
      'We take applications through the institutional call each February.',
    ),
    open: true,
  },
  {
    title: bi('Servicio social y tesis de licenciatura', 'Undergrad projects'),
    body: bi(
      'Siempre hay proyectos cortos disponibles. Escribe con un párrafo sobre qué te interesa.',
      'Short projects are always available. Write with a paragraph on what interests you.',
    ),
    open: true,
  },
  {
    title: bi('Posdoctorado', 'Postdoc'),
    body: bi(
      'Sin plazas abiertas por ahora, pero apoyamos solicitudes a becas externas.',
      'No open positions right now, but we support applications to external fellowships.',
    ),
    open: false,
  },
]

export function Contact() {
  const t = useT()
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const next: Errors = {}
    if (!name) next.name = t(bi('Escribe tu nombre.', 'Enter your name.'))
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = t(
        bi('Revisa el correo: falta el @ o el dominio.', 'Check the email: missing @ or domain.'),
      )
    if (message.length < 10)
      next.message = t(
        bi(
          'Cuéntanos un poco más — mínimo 10 caracteres.',
          'Tell us a bit more — at least 10 characters.',
        ),
      )

    setErrors(next)

    if (Object.keys(next).length > 0) {
      // Enfocar el primer campo con error
      const first = Object.keys(next)[0]
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setStatus('sending')
    await new Promise((r) => setTimeout(r, 900)) // maqueta: aquí irá POST /api/contacto
    setStatus('sent')
  }

  return (
    <>
      <PageHeader
        eyebrow={t(bi('Contacto y oportunidades', 'Contact & opportunities'))}
        title={t(bi('Hablemos', 'Get in touch'))}
        lead={t(
          bi(
            'Si te interesa lo que hacemos, escribe. Contestamos todos los correos, aunque a veces tardamos una semana.',
            'If our work interests you, write. We answer every email, though sometimes it takes a week.',
          ),
        )}
        aside={
          <div className="space-y-4 text-sm">
            <span className="bg-accent-soft ml-auto mb-6 block size-28 rounded-2xl p-5">
              <IllEnvelope tone="accent" />
            </span>
            <a
              href={`mailto:${site.email}`}
              className="text-fg hover:text-accent flex items-center gap-2 md:justify-end"
            >
              <Mail aria-hidden="true" className="size-4" />
              <span translate="no">{site.email}</span>
            </a>
            <p className="text-fg-subtle flex items-center gap-2 md:justify-end">
              <MapPin aria-hidden="true" className="size-4" />
              {t(site.city)}
            </p>
          </div>
        }
      />

      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
        {/* --------------------------------------------------------- Oportunidades */}
        <section>
          <SectionLabel>{t(bi('Oportunidades', 'Opportunities'))}</SectionLabel>
          <div className="mt-6 flex items-start gap-5">
            <span className="bg-plum-soft hidden size-20 shrink-0 rounded-xl p-3.5 sm:block">
              <IllPhylogeny tone="plum" />
            </span>
            <p className="text-fg-muted text-sm">
              {t(
                bi(
                  'Se entra al laboratorio por alguna de estas cuatro puertas. Si ninguna encaja con tu momento, escribe de todos modos.',
                  'There are four ways into the lab. If none of them fits where you are, write anyway.',
                ),
              )}
            </p>
          </div>
          <ul className="mt-6 space-y-3">
            {OPPORTUNITIES.map((item) => (
              <li key={item.title.en}>
                <Card className={cn(!item.open && 'opacity-60')}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'size-2 rounded-full',
                          item.open ? 'bg-accent' : 'bg-fg-faint',
                        )}
                      />
                      <h2 className="text-fg font-medium">{t(item.title)}</h2>
                      <span className="label-mono text-fg-faint ml-auto">
                        {t(item.open ? bi('Abierto', 'Open') : bi('Cerrado', 'Closed'))}
                      </span>
                    </div>
                    <p className="text-fg-subtle mt-2 text-sm">{t(item.body)}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------------------- Formulario */}
        <section>
          <SectionLabel>{t(bi('Escríbenos', 'Write to us'))}</SectionLabel>

          <div aria-live="polite" className="mt-6">
            {status === 'sent' ? (
              <Card className="border-accent/40 bg-accent-soft">
                <CardContent className="flex items-start gap-3 p-6">
                  <CheckCircle2 aria-hidden="true" className="text-accent mt-0.5 size-5 shrink-0" />
                  <div>
                    <p className="text-fg font-medium">
                      {t(bi('Mensaje enviado', 'Message sent'))}
                    </p>
                    <p className="text-fg-muted mt-1 text-sm">
                      {t(
                        bi(
                          'Gracias por escribir. Te contestamos al correo que dejaste.',
                          'Thanks for writing. We will reply to the email you left.',
                        ),
                      )}
                    </p>
                    <Button
                      variant="link"
                      className="mt-3"
                      onClick={() => {
                        setStatus('idle')
                        formRef.current?.reset()
                      }}
                    >
                      {t(bi('Enviar otro mensaje', 'Send another message'))}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {status !== 'sent' ? (
            <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
              <Field id="name" label={t(bi('Nombre', 'Name'))} error={errors.name}>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder={t(bi('Tu nombre…', 'Your name…'))}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
              </Field>

              <Field id="email" label={t(bi('Correo', 'Email'))} error={errors.email}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder="nombre@institucion.mx"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </Field>

              <Field id="message" label={t(bi('Mensaje', 'Message'))} error={errors.message}>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder={t(
                    bi(
                      'Qué te interesa y en qué momento estás…',
                      'What interests you and where you are…',
                    ),
                  )}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={cn(
                    'bg-surface border-line text-fg placeholder:text-fg-faint w-full rounded-md border p-3 text-sm',
                    'transition-[border-color] duration-[var(--motion-fast)]',
                    'hover:border-line-strong focus-visible:border-accent aria-invalid:border-danger',
                  )}
                />
              </Field>

              <Button type="submit" size="lg" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <>
                    <Loader2 aria-hidden="true" className="animate-spin" />
                    {t(bi('Enviando…', 'Sending…'))}
                  </>
                ) : (
                  <>
                    <Send aria-hidden="true" />
                    {t(bi('Enviar mensaje', 'Send Message'))}
                  </>
                )}
              </Button>

              <p className="text-fg-faint text-xs">
                {t(
                  bi(
                    'Este formulario todavía no está conectado: la interfaz está lista y sólo falta el endpoint.',
                    'This form is not wired up yet: the interface is ready and only the endpoint is missing.',
                  ),
                )}
              </p>
            </form>
          ) : null}
        </section>
      </Container>
    </>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-danger text-xs">
          {error}
        </p>
      ) : null}
    </div>
  )
}
