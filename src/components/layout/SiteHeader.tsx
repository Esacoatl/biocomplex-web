import { AnimatePresence, motion } from 'motion/react'
import { LockKeyhole, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Button } from '@/src/components/ui/button'
import { navItems } from '@/src/lib/content/site'
import { bi, useT } from '@/src/lib/i18n'
import { useAuthStore } from '@/src/lib/store/auth'
import { cn } from '@/src/lib/utils'
import { Container } from './Container'
import { LangToggle } from './LangToggle'
import { ThemeToggle } from './ThemeToggle'
import { Wordmark } from './Wordmark'

export function SiteHeader() {
  const t = useT()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const user = useAuthStore((s) => s.user)

  // El menú móvil se cierra al navegar
  useEffect(() => setOpen(false), [location.pathname])

  // Bloquear el scroll del fondo mientras el panel está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="border-line bg-bg/80 sticky top-0 z-50 border-b backdrop-blur-xl">
      <Container className="flex h-[var(--header-h)] items-center justify-between gap-4">
        <Wordmark />

        <nav aria-label={t(bi('Principal', 'Main'))} className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative rounded-sm px-3 py-2 text-sm transition-colors duration-[var(--motion-fast)]',
                  isActive ? 'text-fg' : 'text-fg-subtle hover:text-fg',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {t(item.label)}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="bg-accent absolute inset-x-3 -bottom-px h-0.5 rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle className="hidden sm:flex" />
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            variant={user ? 'soft' : 'primary'}
            className="hidden sm:inline-flex"
          >
            <Link to={user ? '/boveda' : '/acceso'}>
              <LockKeyhole aria-hidden="true" />
              {user ? t(bi('Bóveda', 'Vault')) : t(bi('Acceder', 'Sign in'))}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={t(open ? bi('Cerrar menú', 'Close menu') : bi('Abrir menú', 'Open menu'))}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="border-line bg-bg overflow-hidden border-t lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex h-11 items-center rounded-md px-3 text-[15px]',
                      isActive ? 'bg-sunken text-fg font-medium' : 'text-fg-muted',
                    )
                  }
                >
                  {t(item.label)}
                </NavLink>
              ))}
              <div className="border-line mt-3 flex items-center justify-between border-t pt-4">
                <LangToggle />
                <Button asChild size="sm">
                  <Link to={user ? '/boveda' : '/acceso'}>
                    <LockKeyhole aria-hidden="true" />
                    {user ? t(bi('Ir a la bóveda', 'Go to vault')) : t(bi('Acceder', 'Sign in'))}
                  </Link>
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
