import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/src/lib/theme/useTheme'
import { bi, useT } from '@/src/lib/i18n'
import { Button } from '@/src/components/ui/button'

/**
 * Interruptor de dos estados. El icono muestra a dónde lleva el clic, no dónde
 * se está: en tema claro se ve una luna, porque pulsar lleva a oscuro.
 */
export function ThemeToggle({ size = 'icon-sm' }: { size?: 'icon' | 'icon-sm' }) {
  const { resolved, toggleTheme } = useTheme()
  const t = useT()

  const goingDark = resolved === 'light'
  const Icon = goingDark ? Moon : Sun
  const label = t(
    goingDark
      ? bi('Cambiar a tema oscuro', 'Switch to dark theme')
      : bi('Cambiar a tema claro', 'Switch to light theme'),
  )

  return (
    <Button variant="ghost" size={size} onClick={toggleTheme} aria-label={label} title={label}>
      <Icon aria-hidden="true" />
    </Button>
  )
}
