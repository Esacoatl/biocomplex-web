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
  cycleTheme: () => void
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
   * El ciclo avanza sobre el tema que se VE, no sobre el nombre del modo.
   *
   * Ciclar `auto → light → dark` parece correcto hasta que el sistema ya está
   * en claro: ahí el primer clic no mueve nada en pantalla y hacen falta dos
   * para llegar a oscuro. Saliendo de `auto` se salta directo al tema
   * contrario al que se está viendo, así que claro y oscuro siempre están a
   * un clic. El último paso devuelve el control al sistema operativo.
   */
  const cycleTheme = useCallback(() => {
    const opposite: ResolvedTheme = systemTheme === 'light' ? 'dark' : 'light'
    if (mode === 'auto') setMode(opposite)
    else if (mode === opposite) setMode(systemTheme)
    else setMode('auto')
  }, [mode, systemTheme, setMode])

  return { mode, resolved, setMode, cycleTheme }
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
