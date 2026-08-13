import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SiteFooter } from '@/src/components/layout/SiteFooter'
import { SiteHeader } from '@/src/components/layout/SiteHeader'
import { bi, useT } from '@/src/lib/i18n'
import { pageVariants, variantsFor } from '@/src/lib/motion'

/** Shell público: contiene el chrome persistente; cada página ignora el marco. */
export function PublicShell() {
  const location = useLocation()
  const t = useT()

  // Cada navegación arranca arriba
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenido"
        className="bg-accent text-on-accent sr-only rounded-md px-4 py-2 focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100"
      >
        {t(bi('Saltar al contenido', 'Skip to content'))}
      </a>

      <SiteHeader />

      <main id="contenido" className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={variantsFor(pageVariants)}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteFooter />
    </div>
  )
}
