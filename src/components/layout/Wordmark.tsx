import { Link } from 'react-router-dom'
import { site } from '@/src/lib/content/site'
import { useT } from '@/src/lib/i18n'
import { cn } from '@/src/lib/utils'

/** Marca: un circuito de tres nodos con retroalimentación — el objeto de estudio. */
export function LabMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn('size-7', className)}>
      <path
        d="M9 10.5 L23 10.5 M23 10.5 L16 22 M16 22 L9 10.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.45"
      />
      <circle cx="9" cy="10.5" r="3" fill="currentColor" />
      <circle cx="23" cy="10.5" r="3" fill="currentColor" opacity="0.55" />
      <circle cx="16" cy="22" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

/**
 * El nombre se escribe a dos tonos: «Bio» en tinta y «complex» en el acento.
 * Es el único lugar donde el nombre se parte; en texto corrido va entero.
 */
export function BiocomplexName({ className }: { className?: string }) {
  return (
    <span className={cn('font-display tracking-tight', className)} translate="no">
      Bio<span className="text-accent">complex</span>
    </span>
  )
}

export function Wordmark({ to = '/', compact = false }: { to?: string; compact?: boolean }) {
  const t = useT()
  return (
    <Link to={to} className="group flex items-center gap-2.5" aria-label={site.name}>
      <LabMark className="text-accent transition-transform duration-[var(--motion-base)] group-hover:rotate-[120deg]" />
      <span className="flex flex-col leading-none">
        <BiocomplexName className="text-fg text-xl" />
        {!compact && (
          <span className="label-mono text-fg-faint mt-1 hidden whitespace-nowrap sm:block">
            {t(site.descriptorShort)}
          </span>
        )}
      </span>
    </Link>
  )
}
