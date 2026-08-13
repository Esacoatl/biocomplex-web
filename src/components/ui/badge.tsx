import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type * as React from 'react'
import { cn } from '@/src/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ' +
    "[&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      tone: {
        neutral: 'border-line bg-sunken text-fg-subtle',
        accent: 'border-accent/25 bg-accent-soft text-accent',
        amber: 'border-amber/25 bg-amber-soft text-amber',
        plum: 'border-plum/25 bg-plum-soft text-plum',
        danger: 'border-danger/25 bg-danger-soft text-danger',
        outline: 'border-line-strong text-fg-subtle bg-transparent',
      },
      mono: { true: 'label-mono px-2 py-1 leading-none', false: '' },
    },
    defaultVariants: { tone: 'neutral', mono: false },
  },
)

export type BadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }

export function Badge({ className, tone, mono, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : 'span'
  return (
    <Comp
      data-slot="badge"
      data-tone={tone ?? 'neutral'}
      className={cn(badgeVariants({ tone, mono, className }))}
      {...props}
    />
  )
}

export { badgeVariants }
