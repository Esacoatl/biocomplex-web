import { bi, type Bi } from '../i18n'
import type { Role } from '../store/auth'

export interface Person {
  id: string
  name: string
  initials: string
  role: Role
  title: Bi
  focus: Bi
  since: number
  links?: { label: string; url: string }[]
  alumni?: { year: number; now: Bi }
}

export const roleLabel: Record<Role, Bi> = {
  pi: bi('Investigadora principal', 'Principal Investigator'),
  postdoc: bi('Posdoctorado', 'Postdoc'),
  phd: bi('Doctorado', 'PhD'),
  msc: bi('Maestría', 'MSc'),
  alumni: bi('Egresados', 'Alumni'),
}

export const roleOrder: Role[] = ['pi', 'postdoc', 'phd', 'msc', 'alumni']

export const people: Person[] = [
  {
    id: 'r-alvarado',
    name: 'Dra. Renata Alvarado',
    initials: 'RA',
    role: 'pi',
    title: bi('Investigadora principal', 'Principal Investigator'),
    focus: bi(
      'Evolución de la dinámica en redes de regulación génica. Física estadística aplicada a sistemas vivos.',
      'Evolution of dynamics in gene regulatory networks. Statistical physics applied to living systems.',
    ),
    since: 2019,
    links: [
      { label: 'ORCID', url: 'https://orcid.org' },
      { label: 'Scholar', url: 'https://scholar.google.com' },
    ],
  },
  {
    id: 'j-mena',
    name: 'Dr. Julián Mena',
    initials: 'JM',
    role: 'postdoc',
    title: bi('Investigador posdoctoral', 'Postdoctoral Researcher'),
    focus: bi(
      'Inferencia bayesiana de parámetros cinéticos a partir de datos de célula única.',
      'Bayesian inference of kinetic parameters from single-cell data.',
    ),
    since: 2023,
  },
  {
    id: 'a-okoye',
    name: 'Dra. Amara Okoye',
    initials: 'AO',
    role: 'postdoc',
    title: bi('Investigadora posdoctoral', 'Postdoctoral Researcher'),
    focus: bi(
      'Teoría de la información aplicada a señalización celular.',
      'Information theory applied to cell signalling.',
    ),
    since: 2024,
  },
  {
    id: 'l-fuentes',
    name: 'Lucía Fuentes',
    initials: 'LF',
    role: 'phd',
    title: bi('Estudiante de doctorado', 'PhD Student'),
    focus: bi(
      'Repetibilidad evolutiva en poblaciones simuladas de circuitos.',
      'Evolutionary repeatability in simulated circuit populations.',
    ),
    since: 2022,
  },
  {
    id: 'd-rios',
    name: 'Diego Ríos',
    initials: 'DR',
    role: 'phd',
    title: bi('Estudiante de doctorado', 'PhD Student'),
    focus: bi(
      'Paisajes de aptitud en espacios de parámetros de alta dimensión.',
      'Fitness landscapes in high-dimensional parameter spaces.',
    ),
    since: 2023,
  },
  {
    id: 'n-tapia',
    name: 'Naomi Tapia',
    initials: 'NT',
    role: 'phd',
    title: bi('Estudiante de doctorado', 'PhD Student'),
    focus: bi(
      'Reconstrucción de estados ancestrales de redes reguladoras.',
      'Ancestral state reconstruction of regulatory networks.',
    ),
    since: 2024,
  },
  {
    id: 'p-serrano',
    name: 'Pablo Serrano',
    initials: 'PS',
    role: 'msc',
    title: bi('Estudiante de maestría', 'MSc Student'),
    focus: bi(
      'Simulación estocástica eficiente en GPU.',
      'Efficient GPU-based stochastic simulation.',
    ),
    since: 2025,
  },
  {
    id: 'm-quintero',
    name: 'Mariel Quintero',
    initials: 'MQ',
    role: 'msc',
    title: bi('Estudiante de maestría', 'MSc Student'),
    focus: bi(
      'Visualización interactiva de espacios de bifurcación.',
      'Interactive visualisation of bifurcation spaces.',
    ),
    since: 2025,
  },
  {
    id: 's-bermudez',
    name: 'Dr. Samuel Bermúdez',
    initials: 'SB',
    role: 'alumni',
    title: bi('Doctorado, 2024', 'PhD, 2024'),
    focus: bi(
      'Adaptación perfecta en circuitos de retroalimentación integral.',
      'Perfect adaptation in integral feedback circuits.',
    ),
    since: 2020,
    alumni: { year: 2024, now: bi('Posdoc, ETH Zúrich', 'Postdoc, ETH Zurich') },
  },
  {
    id: 'k-navarro',
    name: 'Karen Navarro',
    initials: 'KN',
    role: 'alumni',
    title: bi('Maestría, 2023', 'MSc, 2023'),
    focus: bi(
      'Ruido intrínseco y extrínseco en promotores.',
      'Intrinsic and extrinsic promoter noise.',
    ),
    since: 2021,
    alumni: {
      year: 2023,
      now: bi('Data scientist, sector salud', 'Data scientist, health sector'),
    },
  },
]
