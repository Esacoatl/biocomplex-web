import { ArrowUpRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { affiliations, navItems, site } from '@/src/lib/content/site'
import { bi, useT } from '@/src/lib/i18n'
import { Container } from './Container'
import { BiocomplexName, LabMark } from './Wordmark'

export function SiteFooter() {
  const t = useT()

  return (
    <footer className="border-line bg-sunken mt-24 border-t">
      <Container className="grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <LabMark className="text-accent" />
          <p className="mt-4">
            <BiocomplexName className="text-fg text-2xl" />
          </p>
          <p className="text-fg-muted mt-1 text-sm">{t(site.descriptor)}</p>
          <p className="text-fg-subtle mt-2 max-w-sm text-sm">{t(site.institution)}</p>
          <a
            href={`mailto:${site.email}`}
            className="text-fg-muted hover:text-accent mt-5 inline-flex items-center gap-2 text-sm"
          >
            <Mail aria-hidden="true" className="size-4" />
            <span translate="no">{site.email}</span>
          </a>
        </div>

        <nav aria-label={t(bi('Pie de página', 'Footer'))}>
          <p className="label-mono text-fg-faint">{t(bi('Navegación', 'Navigation'))}</p>
          <ul className="mt-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-fg-muted hover:text-accent text-sm">
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="label-mono text-fg-faint">{t(bi('Adscripciones', 'Affiliations'))}</p>
          <ul className="mt-4 space-y-3">
            {affiliations.map((affiliation) => (
              <li key={affiliation.short}>
                <a
                  href={affiliation.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group text-fg-muted hover:text-accent flex items-start gap-1.5 text-sm"
                >
                  <span className="min-w-0">
                    <span className="text-fg font-medium" translate="no">
                      {affiliation.short}
                    </span>
                    <span className="text-fg-subtle block text-xs">{t(affiliation.name)}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-0.5 size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-line border-t">
        <Container className="text-fg-faint flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · {t(site.city)}
          </p>
          <p className="flex items-center gap-4">
            <span translate="no">{site.handle}</span>
            <Link to="/acceso" className="hover:text-accent">
              {t(bi('Acceso interno', 'Internal access'))}
            </Link>
          </p>
        </Container>
      </div>
    </footer>
  )
}
