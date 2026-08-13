import { Card } from '@/src/components/ui/card'
import { GraphView } from '@/src/components/vault/GraphView'
import { bi, useT } from '@/src/lib/i18n'
import { buildGraph } from '@/src/lib/vault'

export function GraphRoute() {
  const t = useT()
  const graph = buildGraph()
  const hubs = [...graph.nodes].sort((a, b) => b.degree - a.degree).slice(0, 5)

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <p className="label-mono text-fg-faint">{t(bi('Bóveda', 'Vault'))}</p>
      <h1 className="font-display text-fg mt-3 text-3xl sm:text-4xl">
        {t(bi('Grafo de conexiones', 'Connection graph'))}
      </h1>
      <p className="text-fg-subtle mt-2 max-w-[60ch]">
        {t(
          bi(
            'Cada punto es una nota; cada línea, un enlace interno. Pasa el cursor para aislar una nota y haz clic para abrirla.',
            'Each dot is a note; each line, an internal link. Hover to isolate a note and click to open it.',
          ),
        )}
      </p>

      <Card className="mt-8 overflow-hidden">
        <GraphView />
      </Card>

      <section className="mt-10">
        <h2 className="label-mono text-fg-faint">
          {t(bi('Notas más conectadas', 'Most connected notes'))}
        </h2>
        <ol className="divide-line border-line mt-4 divide-y border-t">
          {hubs.map((node) => (
            <li key={node.id} className="flex items-center gap-4 py-3">
              <span className="tabular text-fg-faint w-8 font-mono text-sm">{node.degree}</span>
              <span className="text-fg min-w-0 flex-1 truncate text-sm">{node.title}</span>
              <span className="text-fg-faint hidden truncate text-xs sm:block">{node.id}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
