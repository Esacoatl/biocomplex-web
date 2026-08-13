import { bi, type Bi } from '../i18n'

export interface ResearchLine {
  id: string
  index: string
  title: Bi
  summary: Bi
  detail: Bi
  methods: string[]
  status: 'active' | 'exploratory' | 'closing'
}

export const researchLines: ResearchLine[] = [
  {
    id: 'dinamica-circuitos',
    index: '01',
    title: bi('Dinámica de circuitos de regulación', 'Gene Regulatory Circuit Dynamics'),
    summary: bi(
      'Modelos biofísicos de circuitos génicos y cómo su comportamiento dinámico depende de la arquitectura de la red.',
      'Biophysical models of gene circuits and how their dynamic behaviour depends on network architecture.',
    ),
    detail: bi(
      'Construimos modelos estocásticos de expresión génica para relacionar la topología de un circuito con su repertorio dinámico: biestabilidad, oscilaciones, adaptación perfecta. El objetivo es distinguir qué propiedades son accesibles por mutación y cuáles requieren reorganizaciones profundas de la red.',
      'We build stochastic models of gene expression to link circuit topology to its dynamic repertoire: bistability, oscillations, perfect adaptation. The goal is to tell apart which properties are reachable by mutation and which demand deep network rewiring.',
    ),
    methods: ['Gillespie SSA', 'Bifurcation analysis', 'Julia', 'Sensitivity analysis'],
    status: 'active',
  },
  {
    id: 'evolucion-experimental',
    index: '02',
    title: bi('Evolución experimental in silico', 'In Silico Experimental Evolution'),
    summary: bi(
      'Poblaciones simuladas de circuitos que evolucionan bajo distintos regímenes de selección y deriva.',
      'Simulated populations of circuits evolving under different regimes of selection and drift.',
    ),
    detail: bi(
      'Evolucionamos poblaciones de circuitos in silico variando tamaño poblacional, tasa de mutación y estructura del ambiente. Medimos qué tan seguido la evolución encuentra una misma solución dinámica desde puntos de partida distintos —una lectura directa de la repetibilidad evolutiva.',
      'We evolve circuit populations in silico while varying population size, mutation rate and environment structure. We measure how often evolution finds the same dynamic solution from different starting points — a direct read-out of evolutionary repeatability.',
    ),
    methods: ['Wright–Fisher', 'Fitness landscapes', 'HPC', 'Python'],
    status: 'active',
  },
  {
    id: 'inferencia-datos',
    index: '03',
    title: bi('Inferencia a partir de datos de célula única', 'Inference from Single-Cell Data'),
    summary: bi(
      'Métodos bayesianos para estimar parámetros cinéticos desde distribuciones de expresión.',
      'Bayesian methods to estimate kinetic parameters from expression distributions.',
    ),
    detail: bi(
      'Las distribuciones de expresión en célula única contienen información sobre la cinética subyacente. Desarrollamos inferencia bayesiana aproximada para recuperar tasas de transcripción y de conmutación promotora, y para poner barras de error honestas sobre esas estimaciones.',
      'Single-cell expression distributions carry information about the underlying kinetics. We develop approximate Bayesian inference to recover transcription and promoter-switching rates, and to put honest error bars on those estimates.',
    ),
    methods: ['MCMC', 'ABC', 'scRNA-seq', 'Stan'],
    status: 'active',
  },
  {
    id: 'ruido-informacion',
    index: '04',
    title: bi('Ruido e información en la célula', 'Noise and Information in the Cell'),
    summary: bi(
      'Cuánta información puede transmitir un circuito ruidoso y qué arquitecturas lo hacen mejor.',
      'How much information a noisy circuit can transmit, and which architectures do it best.',
    ),
    detail: bi(
      'Tratamos al circuito como un canal de comunicación y calculamos su capacidad bajo restricciones biofísicas realistas. Nos interesa el punto donde el costo energético de reducir el ruido deja de compensar la ganancia en información.',
      'We treat the circuit as a communication channel and compute its capacity under realistic biophysical constraints. We focus on the point where the energetic cost of reducing noise stops paying for the gain in information.',
    ),
    methods: ['Information theory', 'Channel capacity', 'Thermodynamics'],
    status: 'exploratory',
  },
  {
    id: 'redes-comparativa',
    index: '05',
    title: bi('Genómica comparativa de redes', 'Comparative Network Genomics'),
    summary: bi(
      'Comparación de redes reguladoras entre linajes para reconstruir su historia.',
      'Comparing regulatory networks across lineages to reconstruct their history.',
    ),
    detail: bi(
      'Reconstruimos estados ancestrales de redes reguladoras a partir de genomas de linajes cercanos, para preguntarnos qué cambió primero: la topología o los parámetros cinéticos.',
      'We reconstruct ancestral states of regulatory networks from closely related genomes, asking what changed first: topology or kinetic parameters.',
    ),
    methods: ['Phylogenetics', 'Ancestral reconstruction', 'Comparative genomics'],
    status: 'exploratory',
  },
  {
    id: 'divulgacion',
    index: '06',
    title: bi('Herramientas abiertas y formación', 'Open Tools and Training'),
    summary: bi(
      'Software libre, cursos y material docente para modelado en biología.',
      'Open-source software, courses and teaching material for modelling in biology.',
    ),
    detail: bi(
      'Todo lo que producimos es reproducible y público: paquetes de simulación, cuadernos de práctica y un curso anual de introducción al modelado dinámico para estudiantes de licenciatura.',
      'Everything we produce is reproducible and public: simulation packages, hands-on notebooks and a yearly intro course on dynamic modelling for undergraduates.',
    ),
    methods: ['Open source', 'Jupyter', 'Talleres'],
    status: 'active',
  },
]
