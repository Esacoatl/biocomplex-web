import { bi, type Bi } from '../i18n'

export type ResourceKind = 'software' | 'curso' | 'datos' | 'protocolo'

export interface Resource {
  id: string
  kind: ResourceKind
  name: string
  description: Bi
  meta: string
  url: string
}

export const resourceKindLabel: Record<ResourceKind, Bi> = {
  software: bi('Software', 'Software'),
  curso: bi('Curso', 'Course'),
  datos: bi('Datos', 'Data'),
  protocolo: bi('Protocolo', 'Protocol'),
}

export const resources: Resource[] = [
  {
    id: 'circuitdynamics',
    kind: 'software',
    name: 'CircuitDynamics.jl',
    description: bi(
      'Simulación estocástica de circuitos de regulación génica con soporte para análisis de bifurcaciones.',
      'Stochastic simulation of gene regulatory circuits with bifurcation analysis support.',
    ),
    meta: 'Julia · MIT · v2.4',
    url: 'https://example.org/circuitdynamics',
  },
  {
    id: 'promoterfit',
    kind: 'software',
    name: 'promoterfit',
    description: bi(
      'Inferencia bayesiana de tasas de conmutación promotora desde datos de célula única.',
      'Bayesian inference of promoter switching rates from single-cell data.',
    ),
    meta: 'Python · BSD-3 · v0.9',
    url: 'https://example.org/promoterfit',
  },
  {
    id: 'curso-modelado',
    kind: 'curso',
    name: 'Introducción al modelado dinámico',
    description: bi(
      'Curso de 24 horas para licenciatura: ecuaciones, estocasticidad y ajuste a datos. Cuadernos ejecutables.',
      '24-hour undergraduate course: equations, stochasticity and fitting to data. Executable notebooks.',
    ),
    meta: 'Jupyter · CC BY 4.0 · 2026',
    url: 'https://example.org/curso-modelado',
  },
  {
    id: 'dataset-oscillators',
    kind: 'datos',
    name: 'oscillators-2024',
    description: bi(
      'Trayectorias simuladas de 12 000 circuitos oscilatorios con sus parámetros y clasificación dinámica.',
      'Simulated trajectories of 12,000 oscillatory circuits with parameters and dynamic classification.',
    ),
    meta: 'HDF5 · 4.2 GB · Zenodo',
    url: 'https://example.org/oscillators-2024',
  },
  {
    id: 'protocolo-reproducible',
    kind: 'protocolo',
    name: 'Protocolo de reproducibilidad',
    description: bi(
      'Cómo estructuramos un proyecto para que cualquier figura se pueda regenerar con un comando.',
      'How we structure a project so any figure can be regenerated with a single command.',
    ),
    meta: 'Markdown · CC BY 4.0',
    url: 'https://example.org/protocolo',
  },
  {
    id: 'seminario',
    kind: 'curso',
    name: 'Seminario semanal',
    description: bi(
      'Sesiones abiertas de discusión de artículos, martes 11:00. Calendario y lecturas públicos.',
      'Open paper-discussion sessions, Tuesdays 11:00. Public calendar and readings.',
    ),
    meta: 'Martes 11:00 · Híbrido',
    url: 'https://example.org/seminario',
  },
]
