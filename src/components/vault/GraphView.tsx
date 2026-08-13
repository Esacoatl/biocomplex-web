import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildGraph } from '@/src/lib/vault'
import { cn } from '@/src/lib/utils'

const W = 800
const H = 520

interface Placed {
  id: string
  title: string
  degree: number
  x: number
  y: number
}

/**
 * Disposición determinista: se parte de un círculo y se relaja con un
 * force-directed sencillo. Sin dependencias y sin animación por frame:
 * el grafo se calcula una vez y se dibuja como SVG estático.
 */
function layout(): { nodes: Placed[]; edges: { a: Placed; b: Placed }[] } {
  const { nodes, edges } = buildGraph()
  const placed: Placed[] = nodes.map((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2
    return {
      ...node,
      x: W / 2 + Math.cos(angle) * 190,
      y: H / 2 + Math.sin(angle) * 150,
    }
  })

  const byId = new Map(placed.map((p) => [p.id, p]))

  for (let iteration = 0; iteration < 240; iteration++) {
    // Repulsión entre todos los pares
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        const a = placed[i]!
        const b = placed[j]!
        const dx = b.x - a.x
        const dy = b.y - a.y
        const distance = Math.max(Math.hypot(dx, dy), 1)
        const push = 2600 / (distance * distance)
        const ux = (dx / distance) * push
        const uy = (dy / distance) * push
        a.x -= ux
        a.y -= uy
        b.x += ux
        b.y += uy
      }
    }
    // Atracción por arista
    for (const edge of edges) {
      const a = byId.get(edge.source)
      const b = byId.get(edge.target)
      if (!a || !b) continue
      const dx = b.x - a.x
      const dy = b.y - a.y
      const distance = Math.max(Math.hypot(dx, dy), 1)
      const pull = (distance - 120) * 0.012
      const ux = (dx / distance) * pull
      const uy = (dy / distance) * pull
      a.x += ux
      a.y += uy
      b.x -= ux
      b.y -= uy
    }
    // Contención dentro del lienzo
    for (const node of placed) {
      node.x = Math.min(W - 40, Math.max(40, node.x))
      node.y = Math.min(H - 30, Math.max(30, node.y))
    }
  }

  return {
    nodes: placed,
    edges: edges
      .map((edge) => ({ a: byId.get(edge.source), b: byId.get(edge.target) }))
      .filter((edge): edge is { a: Placed; b: Placed } => Boolean(edge.a && edge.b)),
  }
}

export function GraphView({ className }: { className?: string }) {
  const { nodes, edges } = useMemo(layout, [])
  const [active, setActive] = useState<string | null>(null)
  const navigate = useNavigate()

  const neighbours = useMemo(() => {
    if (!active) return new Set<string>()
    const set = new Set<string>()
    for (const edge of edges) {
      if (edge.a.id === active) set.add(edge.b.id)
      if (edge.b.id === active) set.add(edge.a.id)
    }
    return set
  }, [active, edges])

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn('w-full', className)}
      role="group"
      aria-label="Grafo de conexiones entre notas"
    >
      <g>
        {edges.map((edge, index) => {
          const lit = active === edge.a.id || active === edge.b.id
          return (
            <line
              key={index}
              x1={edge.a.x}
              y1={edge.a.y}
              x2={edge.b.x}
              y2={edge.b.y}
              stroke={lit ? 'var(--prim-signal)' : 'var(--prim-line-strong)'}
              strokeWidth={lit ? 1.4 : 0.8}
              opacity={active && !lit ? 0.25 : 0.85}
            />
          )
        })}
      </g>

      {nodes.map((node) => {
        const radius = 5 + Math.min(node.degree, 6) * 1.6
        const dim = Boolean(active) && active !== node.id && !neighbours.has(node.id)
        return (
          <g
            key={node.id}
            transform={`translate(${node.x} ${node.y})`}
            opacity={dim ? 0.28 : 1}
            className="cursor-pointer"
            onMouseEnter={() => setActive(node.id)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(node.id)}
            onBlur={() => setActive(null)}
            onClick={() => navigate(`/boveda/nota/${encodeURIComponent(node.id)}`)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                navigate(`/boveda/nota/${encodeURIComponent(node.id)}`)
              }
            }}
            tabIndex={0}
            role="link"
            aria-label={node.title}
          >
            <circle
              r={radius}
              fill={active === node.id ? 'var(--prim-signal)' : 'var(--prim-paper-1)'}
              stroke={active === node.id ? 'var(--prim-signal)' : 'var(--prim-line-strong)'}
              strokeWidth="1.5"
            />
            <text
              y={radius + 13}
              textAnchor="middle"
              className="pointer-events-none"
              fill={active === node.id ? 'var(--prim-ink-900)' : 'var(--prim-ink-500)'}
              fontSize="10"
              fontFamily="var(--font-sans)"
            >
              {node.title.length > 26 ? `${node.title.slice(0, 24)}…` : node.title}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
