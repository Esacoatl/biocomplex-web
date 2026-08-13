import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme, type ThemeMode } from '@/src/lib/theme/useTheme'
import { useT, bi } from '@/src/lib/i18n'
import { Button } from '@/src/components/ui/button'

const ICONS: Record<ThemeMode, typeof Sun> = { auto: Monitor, light: Sun, dark: Moon }

const LABELS: Record<ThemeMode, ReturnType<typeof bi>> = {
  auto: bi('Tema: automático', 'Theme: automatic'),
  light: bi('Tema: claro', 'Theme: light'),
  dark: bi('Tema: oscuro', 'Theme: dark'),
}

export function ThemeToggle({ size = 'icon-sm' }: { size?: 'icon' | 'icon-sm' }) {
  const { mode, cycleTheme } = useTheme()
  const t = useT()
  const Icon = ICONS[mode]

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={cycleTheme}
      aria-label={t(LABELS[mode])}
      title={t(LABELS[mode])}
    >
      <Icon aria-hidden="true" />
    </Button>
  )
}
