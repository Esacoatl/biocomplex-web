/** Fuente única de cortes. Para *estilos* se usan las utilidades de Tailwind. */
export const BP = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
} as const

export type Breakpoint = keyof typeof BP
