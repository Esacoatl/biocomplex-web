import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type * as React from 'react'
import { cn } from '@/src/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap ' +
    'transition-[background-color,color,border-color,box-shadow,transform] duration-[var(--motion-fast)] ' +
    'outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.985] ' +
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-accent hover:bg-accent-hover shadow-[var(--shadow-1)]',
        outline:
          'border-line-strong text-fg hover:bg-sunken hover:border-fg-faint border bg-transparent',
        ghost: 'text-fg-muted hover:bg-sunken hover:text-fg',
        soft: 'bg-accent-soft text-accent hover:brightness-[0.97]',
        link: 'text-accent hover:text-accent-hover h-auto p-0 underline-offset-4 hover:underline',
        danger: 'bg-danger text-white hover:brightness-110',
      },
      size: {
        sm: 'h-8 gap-1.5 px-3 text-[13px]',
        md: 'h-11 px-5 text-sm', // 44 px: objetivo táctil mínimo
        lg: 'h-12 px-7 text-[15px]',
        icon: 'size-11',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? 'primary'}
      data-size={size ?? 'md'}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { buttonVariants }
