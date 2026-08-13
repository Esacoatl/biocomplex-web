import { AnimatePresence, motion } from 'motion/react'
import { Hash, LayoutGrid, LogOut, Network, PanelLeft, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { LangToggle } from '@/src/components/layout/LangToggle'
import { ThemeToggle } from '@/src/components/layout/ThemeToggle'
import { BiocomplexName, LabMark } from '@/src/components/layout/Wordmark'
import { Button } from '@/src/components/ui/button'
import { Kbd } from '@/src/components/ui/input'
import { SearchPalette } from '@/src/components/vault/SearchPalette'
import { VaultTree } from '@/src/components/vault/VaultTree'
import { site } from '@/src/lib/content/site'
import { bi, useT } from '@/src/lib/i18n'
import { useAuthStore } from '@/src/lib/store/auth'
import { cn } from '@/src/lib/utils'
import { vaultNotes } from '@/src/lib/vault'

const SECTIONS = [
  { to: '/boveda', end: true, icon: LayoutGrid, label: bi('Resumen', 'Overview') },
  { to: '/boveda/grafo', end: false, icon: Network, label: bi('Grafo', 'Graph') },
  { to: '/boveda/etiquetas', end: false, icon: Hash, label: bi('Etiquetas', 'Tags') },
]

export function VaultShell() {
  const t = useT()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => setDrawerOpen(false), [location.pathname])

  // Atajo global de búsqueda
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const sidebar = (
    <div className="flex h-full flex-col">
      <nav aria-label={t(bi('Secciones', 'Sections'))} className="space-y-px p-3">
        {SECTIONS.map((section) => (
          <NavLink
            key={section.to}
            to={section.to}
            end={section.end}
            className={({ isActive }) =>
              cn(
                'flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm',
                isActive ? 'bg-sunken text-fg font-medium' : 'text-fg-subtle hover:text-fg',
              )
            }
          >
            <section.icon aria-hidden="true" className="size-4" />
            {t(section.label)}
          </NavLink>
        ))}
      </nav>

      <div className="border-line mx-3 border-t" />

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <p className="label-mono text-fg-faint px-2 pb-2">
          {t(bi('Bóveda', 'Vault'))} · <span className="tabular">{vaultNotes.length}</span>
        </p>
        <VaultTree />
      </div>

      <div className="border-line border-t p-3">
        <div className="flex items-center gap-2.5 px-1 py-1">
          <span
            aria-hidden="true"
            className="bg-accent-soft text-accent grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold"
          >
            {user?.initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-fg block truncate text-sm font-medium">{user?.name}</span>
            <span className="text-fg-faint block truncate text-xs">{user?.email}</span>
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={signOut}
            aria-label={t(bi('Cerrar sesión', 'Sign out'))}
            title={t(bi('Cerrar sesión', 'Sign out'))}
          >
            <LogOut aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-dvh flex-col">
      {/* ------------------------------------------------------------------ Barra */}
      <header className="border-line bg-bg/85 sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="flex h-14 items-center gap-3 px-4">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label={t(bi('Abrir navegación', 'Open navigation'))}
          >
            <PanelLeft aria-hidden="true" />
          </Button>

          <Link to="/" className="flex items-center gap-2" aria-label={site.name}>
            <LabMark className="text-accent size-5" />
            <BiocomplexName className="text-fg hidden text-lg sm:block" />
          </Link>

          <span className="text-fg-faint hidden text-sm sm:block">/</span>
          <span className="text-fg-muted hidden text-sm sm:block">
            {t(bi('Bóveda de notas', 'Notes vault'))}
          </span>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="border-line bg-surface text-fg-faint hover:border-line-strong ml-auto flex h-9 max-w-xs flex-1 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm"
          >
            <Search aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">{t(bi('Buscar…', 'Search…'))}</span>
            <Kbd className="ml-auto hidden sm:inline-flex">⌘&nbsp;K</Kbd>
          </button>

          <LangToggle className="hidden sm:flex" />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1">
        {/* --------------------------------------------------------- Barra lateral */}
        <aside className="border-line bg-bg sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-72 shrink-0 border-r lg:block">
          {sidebar}
        </aside>

        <AnimatePresence>
          {drawerOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            >
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                onClick={(event) => event.stopPropagation()}
                className="bg-bg border-line h-full w-80 max-w-[85vw] border-r"
                style={{ overscrollBehavior: 'contain' }}
              >
                <div className="border-line flex h-14 items-center justify-between border-b px-4">
                  <span className="font-display text-fg">{t(bi('Bóveda', 'Vault'))}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDrawerOpen(false)}
                    aria-label={t(bi('Cerrar navegación', 'Close navigation'))}
                  >
                    <X aria-hidden="true" />
                  </Button>
                </div>
                <div className="h-[calc(100%-3.5rem)]">{sidebar}</div>
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      <SearchPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}
