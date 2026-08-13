import { motion } from 'motion/react'
import { IllDna, IllLeaf, IllMicroscope, IllPetri } from './Illustrations'
import { getPrefersReducedMotion } from '@/src/lib/motion'
import { cn } from '@/src/lib/utils'

const TILES = [
  { Ill: IllMicroscope, tint: 'bg-accent-soft', tone: 'accent', rotate: -3 },
  { Ill: IllPetri, tint: 'bg-amber-soft', tone: 'amber', rotate: 2.5 },
  { Ill: IllDna, tint: 'bg-plum-soft', tone: 'plum', rotate: 2 },
  { Ill: IllLeaf, tint: 'bg-accent-soft', tone: 'accent', rotate: -2 },
] as const

/**
 * Collage de la portada: cuatro viñetas del trabajo del laboratorio, apoyadas
 * unas sobre otras como fichas sobre la mesa. Es decorativo.
 */
export function HeroCollage({ className }: { className?: string }) {
  const reduced = getPrefersReducedMotion()

  return (
    <div className={cn('grid grid-cols-2 gap-4 sm:gap-5', className)} aria-hidden="true">
      {TILES.map(({ Ill, tint, tone, rotate }, index) => (
        <motion.div
          key={index}
          initial={reduced ? false : { opacity: 0, y: 16, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate }}
          transition={{
            duration: 0.5,
            delay: 0.1 + index * 0.09,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={reduced ? undefined : { rotate: 0, y: -4 }}
          className={cn(
            'border-line/70 aspect-square rounded-2xl border p-5 shadow-[var(--shadow-1)] sm:p-7',
            tint,
            index % 2 === 1 && 'mt-6',
          )}
        >
          <Ill tone={tone} />
        </motion.div>
      ))}
    </div>
  )
}
