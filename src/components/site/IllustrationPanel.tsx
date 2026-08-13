import type { ComponentType } from 'react'
import type { IllustrationProps, IllustrationTone } from './Illustrations'
import { cn } from '@/src/lib/utils'

const PANEL_TINT: Record<IllustrationTone, string> = {
  accent: 'bg-accent-soft',
  amber: 'bg-amber-soft',
  plum: 'bg-plum-soft',
}

/**
 * Marco estándar para una ilustración: panel redondeado con tinte suave.
 * Mantiene el mismo aire en todas las páginas sin repetir clases.
 */
export function IllustrationPanel({
  illustration: Illustration,
  tone = 'accent',
  size = 'md',
  className,
}: {
  illustration: ComponentType<IllustrationProps>
  tone?: IllustrationTone
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const box = { sm: 'size-14 p-2.5', md: 'size-20 p-3.5', lg: 'size-28 p-5' }[size]

  return (
    <span className={cn('block shrink-0 rounded-xl', PANEL_TINT[tone], box, className)}>
      <Illustration tone={tone} />
    </span>
  )
}
