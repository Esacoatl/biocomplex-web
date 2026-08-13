import { ArrowRight, CircleDashed, Clock, FileText, Hash, Link2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent } from '@/src/components/ui/card'
import { GraphView } from '@/src/components/vault/GraphView'
import { bi, formatDate, useLang, useT } from '@/src/lib/i18n'
import { useAuthStore } from '@/src/lib/store/auth'
import { allTags, buildGraph, recentNotes, vaultNotes, WIKILINK_RE } from '@/src/lib/vault'

interface OpenTask {
  text: string
  notePath: string
  noteTitle: string
}

/** Deja el texto legible: [[ruta|alias]] → alias, `código` → código. */
function plainText(markdown: string): string {
  return markdown
    .replace(WIKILINK_RE, (_match, target: string, alias?: string) => alias ?? target)
    .replace(/[`*]/g, '')
}

function collectOpenTasks(): OpenTask[] {
  const tasks: OpenTask[] = []
  for (const note of vaultNotes) {
    for (const line of note.body.split('\n')) {
      const match = /^[-*]\s+\[ \]\s+(.*)$/.exec(line.trim())
      if (match?.[1]) {
        tasks.push({ text: plainText(match[1]), notePath: note.path, noteTitle: note.title })
      }
    }
  }
  return tasks
}

export function VaultHome() {
  const t = useT()
  const lang = useLang()
  const user = useAuthStore((s) => s.user)
  const recent = recentNotes(5)
  const tags = allTags().slice(0, 10)
  const tasks = collectOpenTasks()
  const graph = buildGraph()

  const stats = [
    { icon: FileText, value: vaultNotes.length, label: bi('Notas', 'Notes') },
    { icon: Link2, value: graph.edges.length, label: bi('Enlaces', 'Links') },
    { icon: Hash, value: allTags().length, label: bi('Etiquetas', 'Tags') },
    { icon: CircleDashed, value: tasks.length, label: bi('Pendientes', 'Open tasks') },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <p className="label-mono text-fg-faint">{t(bi('Espacio interno', 'Internal space'))}</p>
      <h1 className="font-display text-fg mt-3 text-3xl sm:text-4xl">
        {t(bi('Hola,', 'Hi,'))} {user?.name.split(' ')[0]}
      </h1>
      <p className="text-fg-subtle mt-2 max-w-[60ch]">
        {t(
          bi(
            'Esta es la bóveda del laboratorio: notas de proyecto, seminarios, protocolos y literatura, con los mismos enlaces internos que en Obsidian.',
            'This is the lab vault: project notes, seminars, protocols and literature, with the same internal links as in Obsidian.',
          ),
        )}
      </p>

      <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label.en}>
            <CardContent className="p-4">
              <dt className="text-fg-faint flex items-center gap-2 text-xs">
                <stat.icon aria-hidden="true" className="size-3.5" />
                {t(stat.label)}
              </dt>
              <dd className="font-display text-fg tabular mt-2 text-3xl">{stat.value}</dd>
            </CardContent>
          </Card>
        ))}
      </dl>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* ------------------------------------------------------------- Recientes */}
        <section>
          <h2 className="label-mono text-fg-faint flex items-center gap-2">
            <Clock aria-hidden="true" className="size-3.5" />
            {t(bi('Editadas recientemente', 'Recently edited'))}
          </h2>

          <ul className="divide-line border-line mt-4 divide-y border-t">
            {recent.map((note) => (
              <li key={note.path}>
                <Link
                  to={`/boveda/nota/${encodeURIComponent(note.path)}`}
                  className="group flex items-baseline gap-4 py-3.5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="text-fg group-hover:text-accent block truncate font-medium">
                      {note.title}
                    </span>
                    <span className="text-fg-faint block truncate text-xs">{note.path}</span>
                  </span>
                  <time className="label-mono text-fg-faint shrink-0" dateTime={note.updated}>
                    {formatDate(note.updated, lang, { month: 'short', day: 'numeric' })}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------------------- Pendientes */}
        <section>
          <h2 className="label-mono text-fg-faint flex items-center gap-2">
            <CircleDashed aria-hidden="true" className="size-3.5" />
            {t(bi('Pendientes abiertos', 'Open tasks'))}
          </h2>

          {tasks.length === 0 ? (
            <p className="text-fg-subtle mt-4 text-sm">
              {t(bi('No hay pendientes abiertos.', 'No open tasks.'))}
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {tasks.slice(0, 6).map((task, index) => (
                <li key={`${task.notePath}-${index}`}>
                  <Card className="hover:border-line-strong">
                    <CardContent className="p-3.5">
                      <p className="text-fg-muted text-sm">{task.text}</p>
                      <Link
                        to={`/boveda/nota/${encodeURIComponent(task.notePath)}`}
                        className="text-fg-faint hover:text-accent mt-1.5 block truncate text-xs"
                      >
                        {task.noteTitle}
                      </Link>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ---------------------------------------------------------------- Etiquetas */}
      <section className="mt-12">
        <h2 className="label-mono text-fg-faint flex items-center gap-2">
          <Hash aria-hidden="true" className="size-3.5" />
          {t(bi('Etiquetas más usadas', 'Most used tags'))}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag.tag}>
              <Link to={`/boveda/etiquetas?tag=${encodeURIComponent(tag.tag)}`}>
                <Badge
                  tone="neutral"
                  className="hover:border-accent/40 hover:text-accent h-7 px-2.5"
                >
                  #{tag.tag}
                  <span className="text-fg-faint tabular">{tag.count}</span>
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------------------------------------------------------- Grafo */}
      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="label-mono text-fg-faint">{t(bi('Conexiones', 'Connections'))}</h2>
          <Link
            to="/boveda/grafo"
            className="text-accent hover:text-accent-hover inline-flex items-center gap-1.5 text-sm"
          >
            {t(bi('Abrir el grafo', 'Open the graph'))}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <Card className="mt-4 overflow-hidden">
          <GraphView className="max-h-[360px]" />
        </Card>
      </section>
    </div>
  )
}
