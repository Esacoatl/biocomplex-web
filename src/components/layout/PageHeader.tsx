import type { ReactNode } from 'react'
import { Container } from './Container'

export function PageHeader({
  eyebrow,
  title,
  lead,
  aside,
}: {
  eyebrow: string
  title: string
  lead?: string
  aside?: ReactNode
}) {
  return (
    <header className="border-line border-b">
      <Container className="grid gap-8 py-14 md:grid-cols-[1.6fr_1fr] md:py-20">
        <div>
          <p className="label-mono text-accent">{eyebrow}</p>
          <h1 className="font-display text-fg mt-4 text-4xl leading-[1.05] sm:text-5xl">{title}</h1>
          {lead ? (
            <p className="text-fg-subtle mt-5 max-w-[52ch] text-base sm:text-lg">{lead}</p>
          ) : null}
        </div>
        {aside ? <div className="md:justify-self-end md:text-right">{aside}</div> : null}
      </Container>
    </header>
  )
}
