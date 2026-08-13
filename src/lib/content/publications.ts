import { bi, type Bi } from '../i18n'

export type PubType = 'article' | 'preprint' | 'chapter' | 'software'

export interface Publication {
  id: string
  year: number
  type: PubType
  title: string
  authors: string[]
  venue: string
  doi?: string
  url?: string
  note?: Bi
  highlight?: boolean
}

export const pubTypeLabel: Record<PubType, Bi> = {
  article: bi('Artículo', 'Article'),
  preprint: bi('Preprint', 'Preprint'),
  chapter: bi('Capítulo', 'Book chapter'),
  software: bi('Software', 'Software'),
}

export const publications: Publication[] = [
  {
    id: 'p-2026-repeatability',
    year: 2026,
    type: 'preprint',
    title: 'Repeatability of dynamic phenotypes under recurrent selection in gene circuits',
    authors: ['Fuentes, L.', 'Ríos, D.', 'Alvarado, R.'],
    venue: 'bioRxiv',
    doi: '10.1101/2026.02.14.000000',
    highlight: true,
    note: bi(
      'En revisión en Nature Ecology & Evolution.',
      'Under review at Nature Ecology & Evolution.',
    ),
  },
  {
    id: 'p-2025-capacity',
    year: 2025,
    type: 'article',
    title: 'Energetic cost bounds the information capacity of transcriptional channels',
    authors: ['Okoye, A.', 'Alvarado, R.'],
    venue: 'PLOS Computational Biology 21(4), e1012345',
    doi: '10.1371/journal.pcbi.1012345',
    highlight: true,
  },
  {
    id: 'p-2025-inference',
    year: 2025,
    type: 'article',
    title: 'Approximate Bayesian inference of promoter switching rates from scRNA-seq',
    authors: ['Mena, J.', 'Quintero, M.', 'Alvarado, R.'],
    venue: 'Bioinformatics 41(2), btaf021',
    doi: '10.1093/bioinformatics/btaf021',
  },
  {
    id: 'p-2025-circuitjl',
    year: 2025,
    type: 'software',
    title: 'CircuitDynamics.jl — stochastic simulation of gene regulatory circuits',
    authors: ['Serrano, P.', 'Mena, J.', 'Alvarado, R.'],
    venue: 'Journal of Open Source Software 10(105), 6421',
    url: 'https://example.org/circuitdynamics',
  },
  {
    id: 'p-2024-landscapes',
    year: 2024,
    type: 'article',
    title: 'High-dimensional fitness landscapes of oscillatory gene circuits',
    authors: ['Ríos, D.', 'Bermúdez, S.', 'Alvarado, R.'],
    venue: 'eLife 13:e91234',
    doi: '10.7554/eLife.91234',
    highlight: true,
  },
  {
    id: 'p-2024-adaptation',
    year: 2024,
    type: 'article',
    title: 'Integral feedback and the evolutionary accessibility of perfect adaptation',
    authors: ['Bermúdez, S.', 'Alvarado, R.'],
    venue: 'Cell Systems 15(3), 210–224',
    doi: '10.1016/j.cels.2024.02.003',
  },
  {
    id: 'p-2023-noise',
    year: 2023,
    type: 'article',
    title: 'Decomposing intrinsic and extrinsic noise without dual reporters',
    authors: ['Navarro, K.', 'Alvarado, R.'],
    venue: 'Physical Review E 108, 044402',
    doi: '10.1103/PhysRevE.108.044402',
  },
  {
    id: 'p-2023-chapter',
    year: 2023,
    type: 'chapter',
    title: 'Modelling gene regulation: a practical introduction',
    authors: ['Alvarado, R.'],
    venue: 'In: Methods in Systems Biology, Springer',
  },
  {
    id: 'p-2022-topology',
    year: 2022,
    type: 'article',
    title: 'Network topology constrains the dynamic repertoire of small gene circuits',
    authors: ['Alvarado, R.', 'Tapia, N.'],
    venue: 'Journal of Theoretical Biology 545, 111143',
    doi: '10.1016/j.jtbi.2022.111143',
  },
  {
    id: 'p-2021-review',
    year: 2021,
    type: 'article',
    title: 'What evolutionary systems biology can and cannot tell us about regulation',
    authors: ['Alvarado, R.'],
    venue: 'Current Opinion in Systems Biology 27, 100352',
    doi: '10.1016/j.coisb.2021.100352',
  },
]
