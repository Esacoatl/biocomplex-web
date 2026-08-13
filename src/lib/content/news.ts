import { bi, type Bi } from '../i18n'

export type NewsKind = 'convocatoria' | 'publicacion' | 'evento' | 'equipo' | 'premio'

export interface NewsItem {
  id: string
  date: string // ISO
  kind: NewsKind
  title: Bi
  body: Bi
  pinned?: boolean
  cta?: { label: Bi; to: string }
}

export const newsKindLabel: Record<NewsKind, Bi> = {
  convocatoria: bi('Convocatoria', 'Open call'),
  publicacion: bi('Publicación', 'Publication'),
  evento: bi('Evento', 'Event'),
  equipo: bi('Equipo', 'Team'),
  premio: bi('Reconocimiento', 'Award'),
}

export const news: NewsItem[] = [
  {
    id: 'n-2026-08-doctorado',
    date: '2026-08-04',
    kind: 'convocatoria',
    pinned: true,
    title: bi('¡Estamos reclutando estudiante de doctorado!', 'We are recruiting a PhD student!'),
    body: bi(
      'Buscamos una persona con formación en física, matemáticas, computación o biología cuantitativa para trabajar en evolución de circuitos de regulación. Convocatoria abierta hasta el 30 de septiembre.',
      'We are looking for someone trained in physics, mathematics, computing or quantitative biology to work on the evolution of regulatory circuits. Applications open until September 30.',
    ),
    cta: { label: bi('Cómo postular', 'How to apply'), to: '/contacto' },
  },
  {
    id: 'n-2026-06-preprint',
    date: '2026-06-18',
    kind: 'publicacion',
    title: bi(
      'Nuevo preprint sobre repetibilidad evolutiva',
      'New preprint on evolutionary repeatability',
    ),
    body: bi(
      'Lucía y Diego publicaron en bioRxiv el trabajo sobre qué tan seguido la evolución encuentra la misma solución dinámica desde puntos de partida distintos.',
      'Lucía and Diego posted on bioRxiv their work on how often evolution finds the same dynamic solution from different starting points.',
    ),
    cta: { label: bi('Ver publicaciones', 'See publications'), to: '/publicaciones' },
  },
  {
    id: 'n-2026-05-taller',
    date: '2026-05-09',
    kind: 'evento',
    title: bi(
      'Taller de modelado dinámico, quinta edición',
      'Dynamic modelling workshop, fifth edition',
    ),
    body: bi(
      'Cuatro días de introducción práctica al modelado de circuitos génicos. Material y cuadernos disponibles en la sección de recursos.',
      'Four days of hands-on introduction to gene circuit modelling. Slides and notebooks available in the resources section.',
    ),
    cta: { label: bi('Ir a recursos', 'Go to resources'), to: '/recursos' },
  },
  {
    id: 'n-2026-03-amara',
    date: '2026-03-02',
    kind: 'equipo',
    title: bi('Amara Okoye se une al laboratorio', 'Amara Okoye joins the lab'),
    body: bi(
      'Amara llega como investigadora posdoctoral para trabajar en teoría de la información aplicada a señalización celular.',
      'Amara joins as a postdoctoral researcher to work on information theory applied to cell signalling.',
    ),
  },
  {
    id: 'n-2025-11-premio',
    date: '2025-11-21',
    kind: 'premio',
    title: bi(
      'Mención honorífica en el congreso nacional',
      'Honourable mention at the national congress',
    ),
    body: bi(
      'El cartel de Pablo sobre simulación en GPU recibió mención honorífica en la sección de biología computacional.',
      'Pablo’s poster on GPU-based simulation received an honourable mention in the computational biology track.',
    ),
  },
  {
    id: 'n-2025-09-elife',
    date: '2025-09-15',
    kind: 'publicacion',
    title: bi('Paisajes de aptitud, publicado en eLife', 'Fitness landscapes, published in eLife'),
    body: bi(
      'Salió el trabajo sobre paisajes de aptitud de circuitos oscilatorios en alta dimensión, con todo el código y los datos abiertos.',
      'Our work on high-dimensional fitness landscapes of oscillatory circuits is out, with all code and data open.',
    ),
  },
]
