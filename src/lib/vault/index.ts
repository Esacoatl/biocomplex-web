import { vaultNotes, type VaultNote } from './data'

export type { VaultNote } from './data'
export { vaultNotes } from './data'

export const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

/** Un nodo del árbol de archivos: carpeta con hijos o nota hoja. */
export type TreeNode =
  | { kind: 'folder'; name: string; path: string; children: TreeNode[] }
  | { kind: 'note'; name: string; path: string; note: VaultNote }

export function buildTree(notes: VaultNote[] = vaultNotes): TreeNode[] {
  const root: TreeNode[] = []

  for (const note of notes) {
    const parts = note.path.split('/')
    const fileName = parts[parts.length - 1] ?? note.path
    let level = root
    let acc = ''

    for (const segment of parts.slice(0, -1)) {
      acc = acc ? `${acc}/${segment}` : segment
      let folder = level.find((n) => n.kind === 'folder' && n.name === segment)
      if (!folder) {
        folder = { kind: 'folder', name: segment, path: acc, children: [] }
        level.push(folder)
      }
      level = (folder as Extract<TreeNode, { kind: 'folder' }>).children
    }

    level.push({ kind: 'note', name: fileName, path: note.path, note })
  }

  const sort = (nodes: TreeNode[]): TreeNode[] => {
    nodes.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1
      return a.name.localeCompare(b.name, 'es')
    })
    for (const node of nodes) if (node.kind === 'folder') sort(node.children)
    return nodes
  }

  return sort(root)
}

export function getNote(path: string): VaultNote | undefined {
  return vaultNotes.find((n) => n.path === path)
}

/** Resuelve un destino de wikilink por ruta exacta o, si no, por título. */
export function resolveLink(target: string): VaultNote | undefined {
  const clean = target.trim()
  return (
    vaultNotes.find((n) => n.path === clean) ??
    vaultNotes.find((n) => n.title.toLowerCase() === clean.toLowerCase()) ??
    vaultNotes.find((n) => n.path.endsWith(`/${clean}`))
  )
}

export function outgoingLinks(note: VaultNote): VaultNote[] {
  const found = new Map<string, VaultNote>()
  for (const match of note.body.matchAll(WIKILINK_RE)) {
    const target = resolveLink(match[1] ?? '')
    if (target && target.path !== note.path) found.set(target.path, target)
  }
  return [...found.values()]
}

export function backlinks(note: VaultNote): VaultNote[] {
  return vaultNotes.filter(
    (candidate) =>
      candidate.path !== note.path &&
      outgoingLinks(candidate).some((linked) => linked.path === note.path),
  )
}

export function allTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const note of vaultNotes) {
    for (const tag of note.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'es'))
}

export function notesByTag(tag: string): VaultNote[] {
  return vaultNotes.filter((n) => n.tags.includes(tag))
}

export function recentNotes(limit = 6): VaultNote[] {
  return [...vaultNotes].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, limit)
}

export interface SearchHit {
  note: VaultNote
  snippet: string
}

export function searchNotes(query: string, limit = 12): SearchHit[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []

  const hits: SearchHit[] = []
  for (const note of vaultNotes) {
    const haystack = `${note.title}\n${note.path}\n${note.tags.join(' ')}\n${note.body}`
    const at = haystack.toLowerCase().indexOf(q)
    if (at === -1) continue

    const from = Math.max(0, at - 40)
    const snippet = haystack
      .slice(from, at + q.length + 60)
      .replace(/\s+/g, ' ')
      .trim()

    hits.push({ note, snippet: (from > 0 ? '…' : '') + snippet + '…' })
    if (hits.length >= limit) break
  }
  return hits
}

/** Grafo plano para la vista de conexiones. */
export interface GraphData {
  nodes: { id: string; title: string; degree: number; tags: string[] }[]
  edges: { source: string; target: string }[]
}

export function buildGraph(): GraphData {
  const edges: GraphData['edges'] = []
  const degree = new Map<string, number>()

  for (const note of vaultNotes) {
    degree.set(note.path, degree.get(note.path) ?? 0)
    for (const target of outgoingLinks(note)) {
      edges.push({ source: note.path, target: target.path })
      degree.set(note.path, (degree.get(note.path) ?? 0) + 1)
      degree.set(target.path, (degree.get(target.path) ?? 0) + 1)
    }
  }

  return {
    nodes: vaultNotes.map((n) => ({
      id: n.path,
      title: n.title,
      degree: degree.get(n.path) ?? 0,
      tags: n.tags,
    })),
    edges,
  }
}
