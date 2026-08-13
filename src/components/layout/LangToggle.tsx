import { useLangStore } from '@/src/lib/i18n'
import { cn } from '@/src/lib/utils'

/** Conmutador ES/EN. El sitio de referencia es bilingüe; este lo hace explícito. */
export function LangToggle({ className }: { className?: string }) {
  const lang = useLangStore((s) => s.lang)
  const setLang = useLangStore((s) => s.setLang)

  return (
    <div
      role="group"
      aria-label="Idioma / Language"
      className={cn('border-line bg-sunken flex rounded-md border p-0.5', className)}
    >
      {(['es', 'en'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            'label-mono cursor-pointer rounded-[5px] px-2 py-1 transition-colors duration-[var(--motion-fast)]',
            lang === code
              ? 'bg-surface text-fg shadow-[var(--shadow-1)]'
              : 'text-fg-faint hover:text-fg-muted',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
