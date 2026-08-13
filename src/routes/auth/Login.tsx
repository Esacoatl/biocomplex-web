import { ArrowLeft, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { BiocomplexName, LabMark } from '@/src/components/layout/Wordmark'
import { IllDna, IllMicroscope, IllPetri } from '@/src/components/site/Illustrations'
import { LangToggle } from '@/src/components/layout/LangToggle'
import { ThemeToggle } from '@/src/components/layout/ThemeToggle'
import { Button } from '@/src/components/ui/button'
import { Input, Label } from '@/src/components/ui/input'
import { site } from '@/src/lib/content/site'
import { bi, useT } from '@/src/lib/i18n'
import { useAuthStore } from '@/src/lib/store/auth'

export function Login() {
  const t = useT()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const status = useAuthStore((s) => s.status)
  const error = useAuthStore((s) => s.error)
  const signIn = useAuthStore((s) => s.signIn)
  const clearError = useAuthStore((s) => s.clearError)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const from = (location.state as { from?: string } | null)?.from ?? '/boveda'

  useEffect(() => clearError, [clearError])

  if (user) return <Navigate to={from} replace />

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const ok = await signIn(email, password)
    if (ok) navigate(from, { replace: true })
  }

  const fillDemo = () => {
    setEmail('demo@lab.mx')
    setPassword('demo')
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      {/* ------------------------------------------------------------ Panel de marca */}
      <aside className="bg-sunken border-line relative hidden flex-col justify-between border-r p-10 lg:flex">
        <div
          className="grid-paper pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <div className="relative">
          <LabMark className="text-accent size-8" />
          <p className="mt-6">
            <BiocomplexName className="text-fg text-4xl" />
          </p>
          <p className="text-fg-muted mt-2 max-w-sm">{t(site.descriptor)}</p>
          <p className="text-fg-subtle mt-1 max-w-sm text-sm">{t(site.institution)}</p>

          <div className="mt-10 flex gap-4" aria-hidden="true">
            <span className="bg-accent-soft size-24 rounded-2xl p-4">
              <IllMicroscope tone="accent" />
            </span>
            <span className="bg-plum-soft mt-6 size-24 rounded-2xl p-4">
              <IllDna tone="plum" />
            </span>
            <span className="bg-amber-soft size-24 rounded-2xl p-4">
              <IllPetri tone="amber" />
            </span>
          </div>
        </div>

        <blockquote className="relative max-w-md">
          <p className="font-display text-fg-muted text-xl leading-snug italic">
            {t(
              bi(
                '«Una duda resuelta en el canal del laboratorio le sirve a tres personas; la misma duda resuelta en privado, a una.»',
                '“A question answered in the lab channel helps three people; the same question answered in private helps one.”',
              ),
            )}
          </p>
          <footer className="label-mono text-fg-faint mt-4">
            {t(bi('Protocolo de incorporación', 'Onboarding protocol'))}
          </footer>
        </blockquote>

        <p className="text-fg-faint relative flex items-center gap-2 text-xs">
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          {t(
            bi(
              'Acceso restringido a integrantes del laboratorio.',
              'Access restricted to lab members.',
            ),
          )}
        </p>
      </aside>

      {/* ---------------------------------------------------------------- Formulario */}
      <main className="flex flex-col">
        <div className="flex items-center justify-between p-5">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft aria-hidden="true" />
              {t(bi('Volver al sitio', 'Back to site'))}
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-16">
          <div className="w-full max-w-sm">
            <span className="bg-accent-soft text-accent grid size-11 place-items-center rounded-lg">
              <LockKeyhole aria-hidden="true" className="size-5" />
            </span>

            <h1 className="font-display text-fg mt-6 text-3xl">
              {t(bi('Acceso interno', 'Internal access'))}
            </h1>
            <p className="text-fg-subtle mt-2 text-sm">
              {t(
                bi(
                  'Entra con tu cuenta del laboratorio para abrir la bóveda de notas.',
                  'Sign in with your lab account to open the notes vault.',
                ),
              )}
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t(bi('Correo institucional', 'Institutional email'))}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="username"
                  spellCheck={false}
                  required
                  placeholder="nombre@biocomplex.mx"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(error)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t(bi('Contraseña', 'Password'))}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'login-error' : undefined}
                />
              </div>

              <div aria-live="polite">
                {error ? (
                  <p id="login-error" className="text-danger text-sm">
                    {t(
                      bi(
                        'No pudimos entrar con esos datos. Revisa el correo y la contraseña.',
                        'We could not sign you in. Check the email and password.',
                      ),
                    )}
                  </p>
                ) : null}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={status === 'pending'}>
                {status === 'pending' ? (
                  <>
                    <Loader2 aria-hidden="true" className="animate-spin" />
                    {t(bi('Entrando…', 'Signing in…'))}
                  </>
                ) : (
                  t(bi('Entrar', 'Sign In'))
                )}
              </Button>
            </form>

            <div className="border-line mt-8 rounded-md border border-dashed p-4">
              <p className="label-mono text-fg-faint">{t(bi('Modo demostración', 'Demo mode'))}</p>
              <p className="text-fg-subtle mt-2 text-sm">
                {t(
                  bi(
                    'La autenticación todavía es una maqueta: cualquier correo con una contraseña de 4 caracteres entra.',
                    'Authentication is still a mock-up: any email with a 4-character password gets in.',
                  ),
                )}
              </p>
              <Button variant="link" className="mt-2" onClick={fillDemo}>
                {t(bi('Usar credenciales de demo', 'Use demo credentials'))}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
