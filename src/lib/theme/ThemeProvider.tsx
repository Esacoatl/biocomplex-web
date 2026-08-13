import type { ReactNode } from 'react'
import { ThemeContext, useThemeState } from './useTheme'

/** El tema cambia poco, así que Context es la herramienta correcta aquí. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useThemeState()
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
