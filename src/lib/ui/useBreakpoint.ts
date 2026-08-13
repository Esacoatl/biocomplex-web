import { useEffect, useState } from 'react'
import { BP, type Breakpoint } from './breakpoints'

function current(): Breakpoint {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'desktop'
  if (window.matchMedia(BP.mobile).matches) return 'mobile'
  if (window.matchMedia(BP.tablet).matches) return 'tablet'
  return 'desktop'
}

/**
 * Sólo para *lógica* (montar o no un componente pesado, cambiar el número de
 * elementos que se piden). Nunca para duplicar en JS lo que el CSS ya resuelve.
 */
export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(current)

  useEffect(() => {
    const queries = Object.values(BP).map((q) => window.matchMedia(q))
    const handler = () => setBp(current())
    queries.forEach((q) => q.addEventListener('change', handler))
    return () => queries.forEach((q) => q.removeEventListener('change', handler))
  }, [])

  return bp
}
