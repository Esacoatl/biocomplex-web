import type { ComponentType } from 'react'
import type { NewsKind } from '@/src/lib/content/news'
import type { ResourceKind } from '@/src/lib/content/resources'
import {
  IllBook,
  IllCell,
  IllChart,
  IllDna,
  IllEnvelope,
  IllFlask,
  IllLeaf,
  IllNetwork,
  IllPhylogeny,
  IllTerminal,
  IllWave,
  type IllustrationProps,
  type IllustrationTone,
} from './Illustrations'

export interface Art {
  illustration: ComponentType<IllustrationProps>
  tone: IllustrationTone
}

/**
 * Qué ilustración acompaña a cada contenido. Vive junto a los componentes y no
 * en `lib/content/`, porque el contenido no debe importar cosas que se pintan.
 */
export const researchArt: Record<string, Art> = {
  'dinamica-circuitos': { illustration: IllNetwork, tone: 'accent' },
  'evolucion-experimental': { illustration: IllDna, tone: 'plum' },
  'inferencia-datos': { illustration: IllChart, tone: 'accent' },
  'ruido-informacion': { illustration: IllWave, tone: 'amber' },
  'redes-comparativa': { illustration: IllPhylogeny, tone: 'plum' },
  divulgacion: { illustration: IllBook, tone: 'amber' },
}

export const resourceArt: Record<ResourceKind, Art> = {
  software: { illustration: IllTerminal, tone: 'accent' },
  curso: { illustration: IllBook, tone: 'amber' },
  datos: { illustration: IllChart, tone: 'plum' },
  protocolo: { illustration: IllFlask, tone: 'accent' },
}

export const newsArt: Record<NewsKind, Art> = {
  convocatoria: { illustration: IllEnvelope, tone: 'accent' },
  publicacion: { illustration: IllBook, tone: 'plum' },
  evento: { illustration: IllFlask, tone: 'amber' },
  equipo: { illustration: IllCell, tone: 'accent' },
  premio: { illustration: IllLeaf, tone: 'amber' },
}

export const FALLBACK_ART: Art = { illustration: IllNetwork, tone: 'accent' }
