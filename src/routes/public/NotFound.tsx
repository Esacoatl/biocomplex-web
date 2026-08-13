import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/src/components/layout/Container'
import { IllCompass } from '@/src/components/site/Illustrations'
import { Button } from '@/src/components/ui/button'
import { bi, useT } from '@/src/lib/i18n'

export function NotFound() {
  const t = useT()
  return (
    <Container className="py-28 text-center">
      <span className="bg-accent-soft mx-auto mb-8 block size-32 rounded-3xl p-6">
        <IllCompass tone="accent" />
      </span>
      <p className="label-mono text-accent">404</p>
      <h1 className="font-display text-fg mt-4 text-4xl">
        {t(bi('Esta página no existe', 'This page does not exist'))}
      </h1>
      <p className="text-fg-subtle mx-auto mt-3 max-w-md">
        {t(
          bi(
            'Puede que el enlace esté mal escrito o que la página se haya movido.',
            'The link may be mistyped, or the page may have moved.',
          ),
        )}
      </p>
      <Button asChild className="mt-8">
        <Link to="/">
          <ArrowLeft aria-hidden="true" />
          {t(bi('Volver al inicio', 'Back to Home'))}
        </Link>
      </Button>
    </Container>
  )
}
