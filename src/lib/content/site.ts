import { bi, type Bi } from '../i18n'

/**
 * Identidad del sitio. Todo lo editable de marca vive aquí: cambiar estos
 * valores basta para renombrar el laboratorio en toda la app.
 */
export const site = {
  /** El nombre es la marca y no se traduce. */
  name: 'Biocomplex',
  shortName: 'Biocomplex',
  descriptor: bi(
    'Laboratorio de investigación científica biológica',
    'Biological Science Research Laboratory',
  ),
  /** Versión corta para la cabecera, donde el espacio es poco. */
  descriptorShort: bi('Investigación biológica', 'Biological research'),
  institution: bi(
    'Instituto de Ciencias Biológicas · Universidad Nacional',
    'Institute of Biological Sciences · National University',
  ),
  tagline: bi(
    'En Biocomplex investigamos los sistemas vivos: cómo se organizan, cómo responden a su entorno y cómo cambian con el tiempo. Combinamos trabajo de laboratorio, análisis de datos y modelado.',
    'At Biocomplex we investigate living systems: how they organise, how they respond to their environment and how they change over time. We combine bench work, data analysis and modelling.',
  ),
  email: 'hola@biocomplex.mx',
  handle: '@biocomplex_lab',
  city: bi('Querétaro, México', 'Querétaro, Mexico'),
  founded: 2019,
} as const

export interface NavItem {
  to: string
  label: Bi
}

export const navItems: NavItem[] = [
  { to: '/', label: bi('Inicio', 'Home') },
  { to: '/investigacion', label: bi('Investigación', 'Research') },
  { to: '/personas', label: bi('Personas', 'People') },
  { to: '/publicaciones', label: bi('Publicaciones', 'Publications') },
  { to: '/recursos', label: bi('Recursos', 'Resources') },
  { to: '/noticias', label: bi('Noticias', 'News') },
  { to: '/contacto', label: bi('Contacto', 'Contact') },
]

export const affiliations = [
  {
    name: bi(
      'Laboratorio Internacional de Investigación sobre el Genoma Humano',
      'International Laboratory for Human Genome Research',
    ),
    short: 'LIIGH',
    url: 'https://example.org/liigh',
  },
  {
    name: bi(
      'Instituto Milenio de Biología Integrativa',
      'Millennium Institute for Integrative Biology',
    ),
    short: 'iBio',
    url: 'https://example.org/ibio',
  },
  {
    name: bi('Red Mexicana de Bioinformática', 'Mexican Bioinformatics Network'),
    short: 'RMB',
    url: 'https://example.org/rmb',
  },
]

export const stats = [
  { value: '38', label: bi('Publicaciones', 'Publications') },
  { value: '12', label: bi('Integrantes', 'Members') },
  { value: '6', label: bi('Líneas activas', 'Active lines') },
  { value: '2019', label: bi('Fundación', 'Founded') },
]
