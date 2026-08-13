/**
 * Instantánea de la bóveda de Obsidian.
 *
 * Hoy es contenido estático para poder construir la interfaz sin backend.
 * Cuando exista el sincronizador, este módulo se reemplaza por una llamada a
 * `GET /api/vault/notes` con la misma forma de datos — ningún componente cambia.
 */

export interface VaultNote {
  /** Ruta dentro de la bóveda, sin extensión. Es también el identificador. */
  path: string
  title: string
  tags: string[]
  updated: string // ISO
  created: string // ISO
  author: string
  status: 'borrador' | 'en-progreso' | 'revisado' | 'archivado'
  body: string
}

export const vaultNotes: VaultNote[] = [
  {
    path: '01 Proyectos/Repetibilidad evolutiva/Índice',
    title: 'Repetibilidad evolutiva — índice',
    tags: ['proyecto', 'evolución', 'activo'],
    updated: '2026-08-12',
    created: '2025-11-03',
    author: 'Lucía Fuentes',
    status: 'en-progreso',
    body: `# Repetibilidad evolutiva

Nota raíz del proyecto. Todo lo demás cuelga de aquí.

> [!question] Pregunta central
> Si volvemos a correr la evolución desde el mismo circuito ancestral, ¿cuántas veces llegamos al mismo fenotipo dinámico?

## Estado

| Bloque | Estado | Responsable |
| --- | --- | --- |
| Diseño experimental | Cerrado | Lucía |
| Barrido de parámetros | Corriendo | Diego |
| Análisis de convergencia | Pendiente | Lucía |
| Escritura | Borrador 2 | Renata |

## Notas hijas

- [[01 Proyectos/Repetibilidad evolutiva/Diseño experimental|Diseño experimental]]
- [[01 Proyectos/Repetibilidad evolutiva/Resultados preliminares|Resultados preliminares]]
- [[03 Protocolos/Reproducibilidad|Protocolo de reproducibilidad]]

## Siguientes pasos

- [x] Fijar el conjunto de circuitos ancestrales
- [x] Correr 500 réplicas por condición
- [ ] Definir la métrica de distancia entre fenotipos dinámicos
- [ ] Figura 3 con el mapa de convergencia

El preprint asociado está descrito en [[04 Literatura/Fuentes 2026 — bioRxiv|Fuentes 2026]].`,
  },
  {
    path: '01 Proyectos/Repetibilidad evolutiva/Diseño experimental',
    title: 'Diseño experimental',
    tags: ['proyecto', 'métodos'],
    updated: '2026-07-30',
    created: '2025-11-10',
    author: 'Lucía Fuentes',
    status: 'revisado',
    body: `# Diseño experimental

## Condiciones

Cruzamos tres factores, 500 réplicas independientes por celda:

1. **Tamaño poblacional** — \`N ∈ {10², 10³, 10⁴}\`
2. **Tasa de mutación** — \`μ ∈ {10⁻⁴, 10⁻³}\`
3. **Ambiente** — constante, periódico, ruidoso

Total: \`3 × 2 × 3 × 500 = 27 000\` corridas.

## Circuito ancestral

Todas las réplicas parten del mismo circuito de tres nodos con retroalimentación negativa, en régimen monoestable lejos de la bifurcación de Hopf.

\`\`\`julia
using CircuitDynamics

ancestral = Circuit(
    nodes = 3,
    edges = [(1,2,:activation), (2,3,:activation), (3,1,:repression)],
    kinetics = default_kinetics(),
)
\`\`\`

## Criterio de parada

Se detiene cuando la aptitud media no mejora más de \`1e-4\` durante 200 generaciones consecutivas, o al llegar a 20 000 generaciones.

> [!warning] Ojo con el sesgo
> El criterio por estancamiento favorece a las poblaciones grandes, que se estancan más tarde. En el análisis hay que reportar también la generación de parada.

Ver [[01 Proyectos/Repetibilidad evolutiva/Índice|el índice del proyecto]] para el estado global.`,
  },
  {
    path: '01 Proyectos/Repetibilidad evolutiva/Resultados preliminares',
    title: 'Resultados preliminares',
    tags: ['proyecto', 'resultados', 'wip'],
    updated: '2026-08-11',
    created: '2026-04-22',
    author: 'Diego Ríos',
    status: 'borrador',
    body: `# Resultados preliminares

Corte al 11 de agosto. **No citar todavía**: falta el tercio de las corridas con ambiente ruidoso.

## Lo que se ve

- En ambiente **constante**, el 82 % de las réplicas converge al mismo fenotipo dinámico.
- En ambiente **periódico**, la convergencia cae a 41 % y aparecen dos atractores claramente separados.
- El tamaño poblacional importa menos de lo que esperábamos: la diferencia entre \`N=10³\` y \`N=10⁴\` está dentro del error.

## Duda abierta

La métrica de distancia actual pesa demasiado la amplitud y casi nada la fase. Con una métrica basada en la frecuencia dominante, la convergencia en ambiente periódico sube a ~60 %. Hay que decidir cuál reportamos **antes** de mirar más datos.

> [!note] Acordado en seminario
> Se fija la métrica de fase el 2026-08-18 y se congela antes de correr el resto.

Relacionado: [[02 Seminarios/2026-08-11 Journal club|el journal club del lunes]].`,
  },
  {
    path: '01 Proyectos/Inferencia scRNA/Índice',
    title: 'Inferencia scRNA — índice',
    tags: ['proyecto', 'inferencia', 'activo'],
    updated: '2026-08-05',
    created: '2024-09-16',
    author: 'Julián Mena',
    status: 'en-progreso',
    body: `# Inferencia desde scRNA-seq

Estimar tasas de conmutación promotora a partir de distribuciones de expresión, con barras de error honestas.

## Componentes

- Modelo generativo: promotor de dos estados + traducción + degradación.
- Inferencia: ABC-SMC, con \`promoterfit\` como implementación de referencia.
- Validación: datos sintéticos primero, luego el conjunto público de 2024.

## Pendiente

- [ ] Reescribir el kernel de perturbación — el actual colapsa cuando la posterior es multimodal
- [x] Publicar \`promoterfit\` v0.9
- [ ] Comparar contra el método de momentos

Método detallado en [[01 Proyectos/Inferencia scRNA/Notas de método|las notas de método]].`,
  },
  {
    path: '01 Proyectos/Inferencia scRNA/Notas de método',
    title: 'Notas de método',
    tags: ['métodos', 'bayesiano'],
    updated: '2026-06-27',
    created: '2024-10-02',
    author: 'Julián Mena',
    status: 'revisado',
    body: `# Notas de método

## Modelo

Promotor de dos estados con tasas \`k_on\`, \`k_off\`, transcripción \`k_m\` y degradación \`γ\`. La distribución estacionaria del mRNA es una beta-Poisson.

## Por qué ABC y no verosimilitud exacta

La verosimilitud es tratable para el modelo de dos estados, pero deja de serlo en cuanto se añade un tercer estado o retroalimentación. ABC nos deja mantener el mismo pipeline cuando el modelo crece.

\`\`\`python
from promoterfit import ABCSMC, TwoStatePromoter

posterior = ABCSMC(
    model=TwoStatePromoter(),
    data=counts,
    n_particles=2000,
    epsilon_schedule="adaptive",
).run()
\`\`\`

## Trampas conocidas

1. **Dropout técnico** — si no se modela, empuja \`k_on\` hacia abajo de forma sistemática.
2. **Normalización** — nunca normalizar antes de inferir; el modelo espera conteos crudos.
3. **Identificabilidad** — \`k_m\` y \`γ\` sólo se identifican por separado si hay datos temporales.`,
  },
  {
    path: '02 Seminarios/2026-08-11 Journal club',
    title: 'Journal club — 11 ago 2026',
    tags: ['seminario', 'notas'],
    updated: '2026-08-11',
    created: '2026-08-11',
    author: 'Naomi Tapia',
    status: 'revisado',
    body: `# Journal club — 11 de agosto

**Presenta:** Diego · **Artículo:** convergencia fenotípica en evolución experimental de levaduras.

## Puntos de la discusión

- La definición de "mismo fenotipo" del artículo es más laxa que la nuestra; con su criterio nuestra convergencia subiría artificialmente.
- Renata insiste en que la métrica se congele antes de ver el resto de los datos. Acordado.
- Amara nota que el argumento de canalización se parece al de capacidad de canal: vale la pena revisar si es el mismo resultado en otro lenguaje.

## Acciones

- [ ] Diego: fijar métrica de fase y documentarla en [[01 Proyectos/Repetibilidad evolutiva/Diseño experimental|Diseño experimental]]
- [ ] Amara: media página comparando canalización y capacidad
- [x] Naomi: subir estas notas a la bóveda`,
  },
  {
    path: '02 Seminarios/2026-07-28 Journal club',
    title: 'Journal club — 28 jul 2026',
    tags: ['seminario', 'notas'],
    updated: '2026-07-28',
    created: '2026-07-28',
    author: 'Pablo Serrano',
    status: 'archivado',
    body: `# Journal club — 28 de julio

**Presenta:** Amara · **Artículo:** límites termodinámicos de la precisión en sensado celular.

La discusión se fue casi entera a si el límite aplica cuando el receptor tiene memoria. Conclusión: aplica, pero la cota se vuelve tan floja que deja de ser informativa.

> [!tip] Idea suelta
> Reproducir la figura 2 con nuestros parámetros y ver dónde cae nuestro circuito de tres nodos.`,
  },
  {
    path: '03 Protocolos/Reproducibilidad',
    title: 'Protocolo de reproducibilidad',
    tags: ['protocolo', 'obligatorio'],
    updated: '2026-05-19',
    created: '2023-02-08',
    author: 'Renata Alvarado',
    status: 'revisado',
    body: `# Protocolo de reproducibilidad

Regla del laboratorio: **cualquier figura de cualquier artículo se regenera con un comando.** Si no se puede, no está lista para enviarse.

## Estructura mínima de proyecto

\`\`\`
proyecto/
├─ data/raw/        # sólo lectura, nunca se edita a mano
├─ data/derived/    # generado, se puede borrar sin miedo
├─ src/             # código
├─ figures/         # salida, versionada con git-lfs
└─ Makefile         # 'make figures' regenera todo
\`\`\`

## Reglas

1. Ningún dato derivado se versiona sin la receta que lo produjo.
2. Toda semilla aleatoria se fija y se escribe en el nombre del archivo de salida.
3. El entorno se declara: \`Project.toml\` para Julia, \`environment.yml\` para Python.
4. Antes de enviar: \`make clean && make figures\` en una máquina limpia.

> [!danger] No negociable
> Nada de datos derivados en carpetas personales de la nube. Todo entra al repositorio o al almacén de datos del laboratorio.

Ver también [[03 Protocolos/Onboarding|el protocolo de incorporación]].`,
  },
  {
    path: '03 Protocolos/Onboarding',
    title: 'Incorporación al laboratorio',
    tags: ['protocolo', 'equipo'],
    updated: '2026-03-02',
    created: '2022-08-30',
    author: 'Renata Alvarado',
    status: 'revisado',
    body: `# Incorporación

Lista para las dos primeras semanas de alguien nuevo.

## Semana 1

- [ ] Cuenta institucional y acceso a la bóveda
- [ ] Acceso al clúster (pedirlo a cómputo, tarda ~3 días)
- [ ] Leer [[03 Protocolos/Reproducibilidad|el protocolo de reproducibilidad]]
- [ ] Reunión de 30 min con cada integrante del laboratorio

## Semana 2

- [ ] Correr el tutorial de \`CircuitDynamics.jl\` de principio a fin
- [ ] Presentar 10 minutos en el seminario: quién eres y qué te interesa
- [ ] Elegir un artículo del laboratorio y reproducir una figura

## Cultura

Preguntar temprano y en público. Una duda resuelta en el canal del laboratorio le sirve a tres personas; la misma duda resuelta en privado, a una.`,
  },
  {
    path: '04 Literatura/Fuentes 2026 — bioRxiv',
    title: 'Fuentes 2026 — bioRxiv',
    tags: ['literatura', 'propio'],
    updated: '2026-06-18',
    created: '2026-06-18',
    author: 'Lucía Fuentes',
    status: 'revisado',
    body: `# Fuentes 2026 — bioRxiv

**Repeatability of dynamic phenotypes under recurrent selection in gene circuits**
Fuentes L., Ríos D., Alvarado R. · \`10.1101/2026.02.14.000000\`

## Resumen en una línea

La repetibilidad evolutiva del fenotipo dinámico depende más de la estructura del ambiente que del tamaño poblacional.

## Notas del revisor 2

- Pide comparar contra un modelo nulo de deriva pura. Razonable, se puede hacer con las corridas que ya tenemos.
- Duda sobre la métrica de distancia — la misma que salió en [[02 Seminarios/2026-08-11 Journal club|el journal club]].

Datos y código en [[01 Proyectos/Repetibilidad evolutiva/Índice|el proyecto]].`,
  },
  {
    path: '04 Literatura/Okoye 2025 — PLOS CB',
    title: 'Okoye 2025 — PLOS CB',
    tags: ['literatura', 'propio', 'información'],
    updated: '2025-11-04',
    created: '2025-08-01',
    author: 'Amara Okoye',
    status: 'archivado',
    body: `# Okoye 2025 — PLOS Computational Biology

**Energetic cost bounds the information capacity of transcriptional channels**

## Resultado

Existe un punto donde gastar más energía en reducir el ruido deja de comprar información: la capacidad satura mientras el costo sigue creciendo linealmente.

## Qué quedó fuera

El tratamiento asume estado estacionario. Con señales transitorias la cota no aplica tal cual, y ese es el siguiente artículo.`,
  },
  {
    path: '99 Diario/2026-08-13',
    title: '2026-08-13',
    tags: ['diario'],
    updated: '2026-08-13',
    created: '2026-08-13',
    author: 'Renata Alvarado',
    status: 'borrador',
    body: `# 2026-08-13

- Revisión del borrador 2 del preprint. La introducción sigue larga: sobra el párrafo de contexto histórico.
- Diego dejó corriendo el barrido de ambiente ruidoso, ~40 h de clúster.
- Recordatorio: la convocatoria de doctorado cierra el 30 de septiembre, hay que difundirla otra vez en septiembre.

Pendiente de leer: [[01 Proyectos/Repetibilidad evolutiva/Resultados preliminares|resultados preliminares]].`,
  },
  {
    path: '00 Entrada/Ideas sueltas',
    title: 'Ideas sueltas',
    tags: ['ideas'],
    updated: '2026-08-09',
    created: '2024-01-15',
    author: 'Renata Alvarado',
    status: 'borrador',
    body: `# Ideas sueltas

Bandeja de entrada. Nada de aquí está pensado todavía.

- ¿Y si la repetibilidad se mide como entropía sobre el conjunto de atractores en vez de por pares?
- Un curso corto sólo de "cómo leer una figura de bifurcación". Media mañana, para primer año.
- Revisar si \`CircuitDynamics.jl\` puede correr en GPU sin reescribir el kernel — preguntarle a Pablo.
- Colaboración posible con el grupo de microfluídica: tendríamos datos temporales reales y eso resolvería la identificabilidad de [[01 Proyectos/Inferencia scRNA/Notas de método|k_m y γ]].`,
  },
]
