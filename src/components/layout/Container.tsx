import type * as React from 'react'
import { cn } from '@/src/lib/utils'

export function Container({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8', className)} {...props} />
}

/** Etiqueta corta en mono sobre una sección. Ancla visual del sistema. */
export function SectionLabel({
  children,
  index,
  className,
}: {
  children: React.ReactNode
  index?: string
  className?: string
}) {
  return (
    <p className={cn('label-mono text-fg-faint flex items-center gap-2', className)}>
      {index ? <span className="text-accent">{index}</span> : null}
      <span className="bg-line h-px w-6" aria-hidden="true" />
      {children}
    </p>
  )
}
