import { motion } from 'motion/react'
import { useMemo } from 'react'
import { getPrefersReducedMotion } from '@/src/lib/motion'

/**
 * Retrato de fase: dos trayectorias que caen a un ciclo límite.
 * Se genera en el cliente para no cargar una imagen; es decorativo.
 */
function spiral(turns: number, startRadius: number, endRadius: number, steps = 220) {
  const points: string[] = []
  for (let i = 0; i <= steps; i++) {
    const p = i / steps
    const angle = p * turns * Math.PI * 2
    const radius = startRadius + (endRadius - startRadius) * (1 - Math.pow(1 - p, 2.2))
    const x = 100 + radius * Math.cos(angle)
    const y = 100 + radius * Math.sin(angle)
    points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return points.join(' ')
}

export function HeroFigure({ className }: { className?: string }) {
  const reduced = getPrefersReducedMotion()
  const inner = useMemo(() => spiral(3.2, 8, 52), [])
  const outer = useMemo(() => spiral(2.6, 92, 58), [])

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Retrato de fase de un circuito que converge a un ciclo límite"
    >
      <defs>
        <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--prim-signal)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--prim-signal)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="96" fill="url(#hero-glow)" />

      {/* Retícula del plano de fase */}
      <g stroke="var(--prim-line)" strokeWidth="0.5">
        {[20, 60, 100, 140, 180].map((v) => (
          <line key={`h${v}`} x1="10" y1={v} x2="190" y2={v} />
        ))}
        {[20, 60, 100, 140, 180].map((v) => (
          <line key={`v${v}`} x1={v} y1="10" x2={v} y2="190" />
        ))}
      </g>

      {/* Ciclo límite */}
      <circle
        cx="100"
        cy="100"
        r="52"
        fill="none"
        stroke="var(--prim-signal)"
        strokeWidth="1.6"
        strokeDasharray="4 4"
        opacity="0.55"
      />

      {[inner, outer].map((d, index) => (
        <motion.path
          key={index}
          d={d}
          fill="none"
          stroke="var(--prim-ink-500)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity={0.7}
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={
            reduced ? { duration: 0 } : { duration: 2.4, delay: index * 0.35, ease: 'easeInOut' }
          }
        />
      ))}

      {/* Estado actual del sistema, recorriendo el ciclo */}
      <motion.g
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        style={{ transformBox: 'view-box', transformOrigin: '100px 100px' }}
      >
        <circle cx="152" cy="100" r="4.5" fill="var(--prim-signal)" />
      </motion.g>

      <circle cx="100" cy="100" r="2" fill="var(--prim-ink-300)" />
    </svg>
  )
}
