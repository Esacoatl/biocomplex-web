import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export type ThemeMode = 'auto' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'lab.theme.v1' // debe coincidir con el script inline de index.html

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function readStored(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* localStorage puede lanzar en Safari privado */
  }
  return 'auto' // por defecto manda el dispositivo
}

export interface ThemeContextValue {
  mode: ThemeMode
  resolved: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useThemeState(): ThemeContextValue {
  const [mode, setModeState] = useState<ThemeMode>(readStored)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)

  const resolved: ResolvedTheme = mode === 'auto' ? systemTheme : mode

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved)
  }, [resolved])

  // En modo auto hay que reaccionar si el usuario cambia el tema del SO en vivo
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const handler = () => setSystemTheme(mq.matches ? 'light' : 'dark')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    try {
      if (next === 'auto') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* sin persistencia: el tema sigue funcionando durante la sesión */
    }
  }, [])

  /**
   * Alterna claro ↔ oscuro. Siempre en un solo clic.
   *
   * El botón tuvo tres estados (automático, claro, oscuro) y eso obligaba a un
   * clic que no cambiaba nada en pantalla: pasar por `auto` en un equipo cuyo
   * sistema ya está en ese tema se ve idéntico. `auto` sigue siendo el estado
   * inicial —mientras nadie toque el botón, el sitio sigue al sistema
   * operativo— pero deja de formar parte del recorrido del botón. Quien quiera
   * devolverlo puede llamar a `setMode('auto')`.
   */
  const toggleTheme = useCallback(() => {
    setMode(resolved === 'light' ? 'dark' : 'light')
  }, [resolved, setMode])

  return { mode, resolved, setMode, toggleTheme }
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
