import type * as React from 'react'
import { cn } from '@/src/lib/utils'

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn(
        'bg-surface border-line text-fg placeholder:text-fg-faint h-11 w-full rounded-md border px-3 text-sm',
        'transition-[border-color,box-shadow] duration-[var(--motion-fast)]',
        'hover:border-line-strong focus-visible:border-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-danger',
        className,
      )}
      {...props}
    />
  )
}

export function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn('text-fg-muted block text-sm font-medium', className)}
      {...props}
    />
  )
}

export function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'border-line bg-sunken text-fg-subtle inline-flex h-5 min-w-5 items-center justify-center',
        'rounded-sm border px-1.5 font-mono text-[10px] font-medium',
        className,
      )}
      {...props}
    />
  )
}
