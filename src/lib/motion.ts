import type { Variants } from 'motion/react'

/** Una sola fuente de verdad para el ritmo de la app. */
export const DURATION = { fast: 0.14, base: 0.22, slow: 0.38 } as const
export const EASE_OUT = [0.16, 1, 0.3, 1] as const

export const fadeUp: Variants = {
  initial: { y: 12, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: DURATION.slow, ease: EASE_OUT } },
  exit: { y: -8, opacity: 0, transition: { duration: DURATION.fast } },
}

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
  exit: { opacity: 0, y: -4, transition: { duration: DURATION.fast } },
}

export const stagger: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
  exit: {},
}

/**
 * Variants "vacíos": el intercambio es instantáneo pero AnimatePresence sigue
 * funcionando, así no se rompe el ciclo de montaje.
 */
export const reducedVariants: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
}

export function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function variantsFor(variants: Variants): Variants {
  return getPrefersReducedMotion() ? reducedVariants : variants
}
