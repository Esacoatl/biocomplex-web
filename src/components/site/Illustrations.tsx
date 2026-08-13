import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/src/lib/utils'

/* --------------------------------------------------------------------------
   Ilustraciones vectoriales del laboratorio.

   Un solo estilo para todas: trazo de 2 px con extremos redondeados, relleno
   suave de un tono, lienzo de 120×120. Los colores salen de los primitivos,
   así que se adaptan al tema claro/oscuro sin tocar el dibujo.

   Son decorativas: siempre `aria-hidden`. Si una ilustración necesita
   comunicar algo, el texto va al lado.
   -------------------------------------------------------------------------- */

export type IllustrationTone = 'accent' | 'amber' | 'plum'

export interface IllustrationProps {
  className?: string
  tone?: IllustrationTone
}

const TONES: Record<IllustrationTone, { soft: string; line: string }> = {
  accent: { soft: 'var(--prim-signal-soft)', line: 'var(--prim-signal)' },
  amber: { soft: 'var(--prim-amber-soft)', line: 'var(--prim-amber)' },
  plum: { soft: 'var(--prim-plum-soft)', line: 'var(--prim-plum)' },
}

function Spot({
  children,
  tone = 'accent',
  className,
}: IllustrationProps & { children: ReactNode }) {
  const palette = TONES[tone]
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-full', className)}
      style={
        {
          '--ill-soft': palette.soft,
          '--ill-line': palette.line,
        } as CSSProperties
      }
    >
      {children}
    </svg>
  )
}

const soft = 'var(--ill-soft)'
const line = 'var(--ill-line)'

/** Microscopio — trabajo de banco. */
export function IllMicroscope(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <rect
        x="24"
        y="96"
        width="72"
        height="11"
        rx="5.5"
        fill={soft}
        stroke={line}
        strokeWidth="2"
      />
      <path d="M78 96c14-12 16-42 2-56" stroke={line} strokeWidth="2" opacity="0.6" />
      <path d="M30 78h48" stroke={line} strokeWidth="2" opacity="0.45" />
      <rect x="30" y="70" width="48" height="9" rx="3" fill={soft} stroke={line} strokeWidth="2" />
      <g transform="rotate(-16 58 44)">
        <rect
          x="48"
          y="20"
          width="18"
          height="34"
          rx="5"
          fill={soft}
          stroke={line}
          strokeWidth="2"
        />
        <rect
          x="50"
          y="10"
          width="14"
          height="11"
          rx="5"
          fill={soft}
          stroke={line}
          strokeWidth="2"
        />
        <path d="M52 54h10l-2 9h-6z" fill={soft} stroke={line} strokeWidth="2" />
      </g>
      <circle cx="84" cy="66" r="5" fill={soft} stroke={line} strokeWidth="2" />
      <path d="M40 96v-9" stroke={line} strokeWidth="2" opacity="0.4" />
    </Spot>
  )
}

/** Doble hélice — evolución y herencia. */
export function IllDna(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <path d="M32 20C32 33 88 33 88 46S32 59 32 72s56 13 56 26" stroke={line} strokeWidth="2" />
      <path
        d="M88 20c0 13-56 13-56 26s56 13 56 26-56 13-56 26"
        stroke={line}
        strokeWidth="2"
        opacity="0.55"
      />
      <path d="M32 20h56M32 46h56M32 72h56M32 98h56" stroke={line} strokeWidth="2" opacity="0.7" />
      <path d="M50 33h20M50 59h20M50 85h20" stroke={line} strokeWidth="2" opacity="0.35" />
      <circle cx="32" cy="20" r="4" fill={line} />
      <circle cx="88" cy="98" r="4" fill={line} opacity="0.6" />
    </Spot>
  )
}

/** Matraz — experimentación. */
export function IllFlask(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <path d="M33 74h54l8 17c3 7-1 13-8 13H33c-7 0-11-6-8-13z" fill={soft} stroke="none" />
      <path
        d="M51 16v29L25 91c-3 7 1 13 8 13h54c7 0 11-6 8-13L69 45V16"
        stroke={line}
        strokeWidth="2"
      />
      <path d="M45 16h30" stroke={line} strokeWidth="2" />
      <path d="M33 74h54" stroke={line} strokeWidth="2" opacity="0.55" />
      <circle cx="49" cy="87" r="3.5" fill={line} opacity="0.55" />
      <circle cx="63" cy="94" r="2.5" fill={line} opacity="0.4" />
      <circle cx="73" cy="86" r="2" fill={line} opacity="0.5" />
    </Spot>
  )
}

/** Caja de Petri — cultivo y observación. */
export function IllPetri(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <ellipse cx="60" cy="62" rx="44" ry="31" fill={soft} stroke={line} strokeWidth="2" />
      <ellipse cx="60" cy="62" rx="35" ry="23" stroke={line} strokeWidth="2" opacity="0.35" />
      <path d="M16 62c0 8 20 14 44 14s44-6 44-14" stroke={line} strokeWidth="2" opacity="0.25" />
      <circle cx="46" cy="55" r="6" fill={line} opacity="0.55" />
      <circle cx="70" cy="52" r="4" fill={line} opacity="0.4" />
      <circle cx="76" cy="68" r="5" fill={line} opacity="0.5" />
      <circle cx="52" cy="72" r="3" fill={line} opacity="0.35" />
      <circle cx="61" cy="62" r="2.5" fill={line} opacity="0.45" />
    </Spot>
  )
}

/** Célula — el sistema que estudiamos. */
export function IllCell(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <circle cx="60" cy="60" r="43" fill={soft} stroke={line} strokeWidth="2" />
      <circle cx="53" cy="54" r="16" stroke={line} strokeWidth="2" />
      <circle cx="53" cy="54" r="5.5" fill={line} opacity="0.7" />
      <ellipse
        cx="80"
        cy="72"
        rx="10"
        ry="5"
        stroke={line}
        strokeWidth="2"
        opacity="0.6"
        transform="rotate(-28 80 72)"
      />
      <ellipse
        cx="40"
        cy="84"
        rx="8"
        ry="4"
        stroke={line}
        strokeWidth="2"
        opacity="0.45"
        transform="rotate(20 40 84)"
      />
      <circle cx="78" cy="42" r="3" fill={line} opacity="0.5" />
      <circle cx="34" cy="60" r="2.5" fill={line} opacity="0.4" />
    </Spot>
  )
}

/** Circuito de regulación — nodos y retroalimentación. */
export function IllNetwork(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <path d="M36 40h48M84 40 60 84M60 84 36 40" stroke={line} strokeWidth="2" opacity="0.45" />
      <path
        d="M92 52a34 34 0 0 1-8 30"
        stroke={line}
        strokeWidth="2"
        strokeDasharray="4 5"
        opacity="0.5"
      />
      <circle cx="36" cy="40" r="13" fill={soft} stroke={line} strokeWidth="2" />
      <circle cx="84" cy="40" r="11" fill={soft} stroke={line} strokeWidth="2" />
      <circle cx="60" cy="84" r="15" fill={soft} stroke={line} strokeWidth="2" />
      <circle cx="36" cy="40" r="4" fill={line} />
      <circle cx="60" cy="84" r="4" fill={line} opacity="0.55" />
    </Spot>
  )
}

/** Oscilación — comportamiento dinámico en el tiempo. */
export function IllWave(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <rect
        x="14"
        y="24"
        width="92"
        height="72"
        rx="12"
        fill={soft}
        stroke={line}
        strokeWidth="2"
      />
      <path d="M14 60h92" stroke={line} strokeWidth="2" strokeDasharray="3 6" opacity="0.4" />
      <path
        d="M24 74c8-30 16-30 24 0s16 30 24 0 16-30 24 0"
        stroke={line}
        strokeWidth="2"
        transform="translate(0 -14)"
      />
      <circle cx="96" cy="46" r="4.5" fill={line} />
    </Spot>
  )
}

/** Cuaderno con datos — análisis y reproducibilidad. */
export function IllChart(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <rect
        x="26"
        y="16"
        width="70"
        height="88"
        rx="10"
        fill={soft}
        stroke={line}
        strokeWidth="2"
      />
      <path d="M20 34h12M20 52h12M20 70h12" stroke={line} strokeWidth="2" opacity="0.5" />
      <path d="M42 32h30M42 42h20" stroke={line} strokeWidth="2" opacity="0.45" />
      <rect x="42" y="72" width="10" height="18" rx="3" fill={line} opacity="0.35" />
      <rect x="58" y="60" width="10" height="30" rx="3" fill={line} opacity="0.55" />
      <rect x="74" y="66" width="10" height="24" rx="3" fill={line} opacity="0.4" />
    </Spot>
  )
}

/** Hoja — el organismo detrás del modelo. */
export function IllLeaf(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <path
        d="M60 104C26 90 22 44 60 18c38 26 34 72 0 86z"
        fill={soft}
        stroke={line}
        strokeWidth="2"
      />
      <path d="M60 104V26" stroke={line} strokeWidth="2" opacity="0.6" />
      <path
        d="M60 48c-8-4-14-6-19-6M60 48c8-4 14-6 19-6M60 68c-8-4-15-7-20-8M60 68c8-4 15-7 20-8M60 86c-6-3-11-6-15-7M60 86c6-3 11-6 15-7"
        stroke={line}
        strokeWidth="2"
        opacity="0.35"
      />
    </Spot>
  )
}

/** Árbol filogenético — historia compartida entre linajes. */
export function IllPhylogeny(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <path
        d="M18 60h18M36 60V32h20M36 60v28h20M56 32V20h22M56 32v20h22M56 88V76h22M56 88v14h22"
        stroke={line}
        strokeWidth="2"
      />
      <circle cx="18" cy="60" r="5" fill={soft} stroke={line} strokeWidth="2" />
      <circle cx="82" cy="20" r="6" fill={soft} stroke={line} strokeWidth="2" />
      <circle cx="82" cy="52" r="6" fill={soft} stroke={line} strokeWidth="2" />
      <circle cx="82" cy="76" r="6" fill={soft} stroke={line} strokeWidth="2" />
      <circle cx="82" cy="102" r="6" fill={soft} stroke={line} strokeWidth="2" />
      <circle cx="82" cy="52" r="2.5" fill={line} />
      <circle cx="82" cy="76" r="2.5" fill={line} opacity="0.5" />
    </Spot>
  )
}

/** Libro abierto — docencia y divulgación. */
export function IllBook(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <path
        d="M60 34c-8-7-19-10-32-10-4 0-6 2-6 6v54c0 4 2 6 6 6 13 0 24 3 32 10 8-7 19-10 32-10 4 0 6-2 6-6V30c0-4-2-6-6-6-13 0-24 3-32 10z"
        fill={soft}
        stroke={line}
        strokeWidth="2"
      />
      <path d="M60 34v66" stroke={line} strokeWidth="2" opacity="0.6" />
      <path
        d="M34 46h16M34 60h16M34 74h12M70 46h16M70 60h16M70 74h12"
        stroke={line}
        strokeWidth="2"
        opacity="0.35"
      />
    </Spot>
  )
}

/** Terminal — el software que publicamos. */
export function IllTerminal(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <rect
        x="14"
        y="26"
        width="92"
        height="68"
        rx="12"
        fill={soft}
        stroke={line}
        strokeWidth="2"
      />
      <path d="M14 44h92" stroke={line} strokeWidth="2" opacity="0.45" />
      <circle cx="27" cy="35" r="3" fill={line} opacity="0.5" />
      <circle cx="38" cy="35" r="3" fill={line} opacity="0.35" />
      <path d="M30 60l10 8-10 8" stroke={line} strokeWidth="2" />
      <path d="M52 76h26" stroke={line} strokeWidth="2" opacity="0.5" />
    </Spot>
  )
}

/** Sobre — correspondencia y convocatorias. */
export function IllEnvelope(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <rect
        x="16"
        y="32"
        width="88"
        height="60"
        rx="12"
        fill={soft}
        stroke={line}
        strokeWidth="2"
      />
      <path d="M20 40l35 26c3 2 7 2 10 0l35-26" stroke={line} strokeWidth="2" />
      <path d="M16 88l30-24M104 88L74 64" stroke={line} strokeWidth="2" opacity="0.35" />
      <circle cx="92" cy="34" r="9" fill={soft} stroke={line} strokeWidth="2" />
      <circle cx="92" cy="34" r="3" fill={line} />
    </Spot>
  )
}

/** Brújula — para pantallas vacías y errores. */
export function IllCompass(props: IllustrationProps) {
  return (
    <Spot {...props}>
      <circle cx="60" cy="60" r="42" fill={soft} stroke={line} strokeWidth="2" />
      <circle cx="60" cy="60" r="32" stroke={line} strokeWidth="2" opacity="0.3" />
      <path d="M74 46 66 66l-20 8 8-20z" fill={line} opacity="0.45" stroke={line} strokeWidth="2" />
      <circle cx="60" cy="60" r="3" fill={line} />
      <path d="M60 18v6M60 96v6M18 60h6M96 60h6" stroke={line} strokeWidth="2" opacity="0.5" />
    </Spot>
  )
}
