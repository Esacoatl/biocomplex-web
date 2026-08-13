# Prompt de integración — Biocomplex

Este archivo es el encargo completo para el equipo que integra el sitio de Biocomplex con
su infraestructura. Está escrito para pegarse tal cual en Claude Code (u otro agente) desde
la raíz del repositorio de trabajo del equipo.

---

## Prompt

```text
Vas a integrar un front-end ya terminado con nuestra infraestructura existente.

REPOSITORIO DEL FRONT
https://github.com/Esacoatl/biocomplex-web

Clónalo y trabájalo como base:

    git clone https://github.com/Esacoatl/biocomplex-web.git
    cd biocomplex-web && pnpm install && pnpm dev   # http://localhost:3005

QUÉ ES
El sitio público de Biocomplex, un laboratorio de investigación científica biológica, más
un área privada tras login que muestra la bóveda de Obsidian del equipo. React 19 + Vite 6
+ Tailwind v4 + react-router 7, TypeScript estricto, SPA sin SSR que compila a estáticos.

Está completo a nivel de interfaz y vacío a nivel de backend: todas las pantallas, estados,
transiciones, temas e idiomas funcionan con datos de ejemplo. Léelo como la primera versión
del producto, no como un contrato inmutable: si algo choca con nuestra infraestructura,
cámbialo. Lo que sí es contrato son las invariantes de la FASE 4.

Tu objetivo final: el sitio corriendo en nuestra infraestructura, leyendo nuestra bóveda
real, con nuestro inicio de sesión real, probado y desplegado.

────────────────────────────────────────────────────────────────────────
FASE 0 — DESCUBRIMIENTO. No escribas código todavía.
────────────────────────────────────────────────────────────────────────

Antes de tocar nada, levanta el inventario de lo que YA tenemos y escríbelo en
`docs/INTEGRACION.md` dentro del repo. Necesito respuestas concretas, con rutas de archivo
y nombres de servicio reales, a esto:

1. HOSTING DEL FRONT
   - ¿Dónde se sirve un estático hoy? (Cloudflare Pages / Workers / S3+CloudFront / Vercel
     / nginx propio…) ¿Con qué comando o pipeline se despliega?
   - ¿Cómo se configuran las cabeceras y el reescribido de rutas en ese hosting?
   - ¿Hay dominio o subdominio ya asignado para este sitio? ¿Certificado?

2. LA BÓVEDA DE OBSIDIAN
   - ¿Dónde vive? (repositorio git, Obsidian Sync, Syncthing, un bucket, un NAS…)
   - ¿Cómo se accede a ella desde un proceso automatizado? ¿Hay credenciales, token o
     lectura por API?
   - ¿Cuántas notas tiene hoy y cuánto pesa? ¿Cuántas se añaden por semana?
   - ¿Qué trae el frontmatter YAML de las notas? Pega el frontmatter de tres notas reales.
   - ¿Se usan `[[wikilinks]]`, alias `[[ruta|texto]]`, embeds `![[nota]]`, etiquetas
     `#tag`, callouts `> [!note]`, tareas `- [ ]`, tablas, LaTeX, plugins de comunidad?
   - ¿Hay notas que NO deben publicarse ni siquiera tras login? ¿Cómo se marcan?

3. ARCHIVOS GENERALES Y ADJUNTOS
   - ¿Dónde viven las imágenes y adjuntos de las notas, y con qué URL se sirven?
   - ¿Hay un bucket o CDN ya definido para archivos estáticos del sitio?
   - ¿Los adjuntos son públicos o requieren sesión? (Esto cambia el diseño de la FASE 2.)

4. IDENTIDAD Y SESIÓN
   - ¿Cómo se autentica el equipo hoy? (Google Workspace, Entra ID, Authelia, Keycloak,
     un backend propio…)
   - ¿Hay SSO disponible? ¿Preferimos OIDC, cookie de sesión, o token en cabecera?
   - ¿Quién decide quién es «miembro del laboratorio»: un grupo del IdP, una lista, la
     bóveda misma?

5. BACKEND Y DATOS
   - ¿Hay ya un API donde colgar `/api/*`? ¿Mismo dominio que el front o dominio aparte?
   - ¿Hay servicio de correo o de formularios para el contacto?

Cuando tengas el inventario, escribe en el mismo documento el PLAN DE INTEGRACIÓN: qué
costura de la FASE 2 resuelves con qué pieza nuestra, y qué decisiones tomas. Si alguna
respuesta cambia el diseño de forma importante —por ejemplo, que la bóveda solo sea
accesible desde la red interna— dilo explícitamente en el plan en lugar de improvisar.

Pausa aquí y muéstrame el plan antes de seguir.

────────────────────────────────────────────────────────────────────────
FASE 1 — LEVANTAR EL FRONT TAL CUAL
────────────────────────────────────────────────────────────────────────

Antes de modificar nada, comprueba que corre en tu máquina y recórrelo entero:

- Las siete rutas públicas: `/`, `/investigacion`, `/personas`, `/publicaciones`,
  `/recursos`, `/noticias`, `/contacto`.
- El login en `/acceso` (usa el botón «Usar credenciales de demo») y toda el área privada:
  `/boveda`, `/boveda/nota/*`, `/boveda/grafo`, `/boveda/etiquetas`.
- El botón de tema (claro ↔ oscuro) y el conmutador de idioma (ES/EN).
- Móvil, tablet y escritorio.

Así sabes cómo debe verse y comportarse el resultado final. Cualquier diferencia visual al
terminar la integración es una regresión, no una mejora, salvo que la hayamos acordado.

────────────────────────────────────────────────────────────────────────
FASE 2 — LAS CUATRO COSTURAS
────────────────────────────────────────────────────────────────────────

Todo lo que es maqueta está aislado en un archivo por tema. Sustituir cada uno NO debe
obligarte a tocar componentes. Si te obliga, es señal de que la abstracción está mal puesta:
arréglala ahí, no repartas lógica por la interfaz.

── 2.1 AUTENTICACIÓN — `src/lib/store/auth.ts`

Hoy: `signIn(email, password)` simula 600 ms y acepta cualquier correo con contraseña de
4+ caracteres. La sesión se guarda en `localStorage` bajo la clave `lab.auth.v1`, con
`partialize` que solo persiste `user`.

    interface Member {
      email: string
      name: string
      role: 'pi' | 'postdoc' | 'phd' | 'msc' | 'alumni'
      initials: string
    }

Qué hacer: conectar `signIn` con nuestro sistema real de identidad, y `signOut` con el
cierre de sesión correspondiente. Reglas:

- El store de Zustand sigue siendo la ÚNICA superficie que muta la sesión. Los componentes
  leen con selectores; nadie llama al IdP directamente desde una pantalla.
- Si el flujo real es OIDC con redirección, `/acceso` pasa a ser el punto de entrada al
  proveedor y el formulario de correo/contraseña desaparece o queda como alternativa. Está
  bien: adapta la pantalla, conserva su composición visual (panel de marca + panel de
  acción).
- Mantén el comportamiento de `RequireAuth` en `src/routes/vault/RequireAuth.tsx`: guarda
  la ruta pedida en `state.from` y regresa a ella después de entrar.
- No dejes que un token de sesión largo entre a `localStorage` si nuestra política dice
  cookie `HttpOnly`. Si cambia el mecanismo, sube la clave a `lab.auth.v2` para que las
  sesiones viejas se ignoren en vez de hidratar mal.

── 2.2 LA BÓVEDA — `src/lib/vault/data.ts`

Hoy: un arreglo estático de 13 notas de ejemplo.

    interface VaultNote {
      path: string      // ruta dentro de la bóveda, sin extensión; es el identificador
      title: string
      tags: string[]
      updated: string   // ISO
      created: string   // ISO
      author: string
      status: 'borrador' | 'en-progreso' | 'revisado' | 'archivado'
      body: string      // Markdown crudo, con [[wikilinks]]
    }

TODO lo demás se deriva de ese arreglo en `src/lib/vault/index.ts`: `buildTree`,
`getNote`, `resolveLink`, `outgoingLinks`, `backlinks`, `allTags`, `notesByTag`,
`recentNotes`, `searchNotes`, `buildGraph`. Si respetas la forma de `VaultNote`, el árbol
de archivos, los enlaces entrantes, el buscador y el grafo siguen funcionando sin cambios.

Qué hacer: sustituir el arreglo estático por nuestra bóveda real. Decide entre las dos
estrategias según lo que hayas averiguado en la FASE 0, y justifica la elección:

  a) SINCRONIZACIÓN EN BUILD — un script lee la bóveda, la convierte a JSON y el sitio se
     recompila cuando hay cambios. Más simple, más rápido, sin backend. Sirve si la bóveda
     cambia pocas veces al día y su contenido puede vivir dentro del bundle.
  b) API EN TIEMPO DE EJECUCIÓN — `GET /api/vault/notes` autenticado. Necesario si las
     notas son sensibles: en la opción (a) el contenido queda dentro del JavaScript
     descargable por cualquiera, aunque la interfaz pida login. Si hay algo confidencial en
     la bóveda, la opción (a) NO es aceptable.

Adaptaciones que vas a necesitar con una bóveda real, y que debes resolver:

- FRONTMATTER. Las notas reales traen YAML. Parséalo y mapéalo a los campos de `VaultNote`.
  `status` es nuestro vocabulario: si el equipo usa otro, cambia el tipo y actualiza el mapa
  de colores en `src/routes/vault/NoteRoute.tsx`. Si una nota no trae `author` o fechas,
  decide el respaldo (autor del último commit, fecha de modificación del archivo) y
  documéntalo.
- IMÁGENES Y EMBEDS. El lector de Markdown está en
  `src/components/vault/Markdown.tsx` y hoy soporta: encabezados, párrafos, negritas,
  cursivas, código en línea y en bloque, enlaces, `[[wikilinks]]` con alias, listas,
  tareas `- [ ]`, citas, callouts `> [!note|tip|question|warning|danger]`, tablas y
  separadores. NO soporta imágenes, embeds `![[nota]]`, notas al pie, LaTeX, listas
  anidadas ni HTML embebido. Extiéndelo con lo que use nuestra bóveda de verdad; empieza
  por imágenes y embeds, que es lo que aparecerá primero. Las imágenes necesitan `width` y
  `height` explícitos o `aspect-ratio` para no provocar saltos de maquetación.
- VOLUMEN. Con más de ~200 notas hay que virtualizar el árbol lateral y la lista de
  resultados, y mover la búsqueda fuera del hilo principal o al backend. `searchNotes` hoy
  recorre todo el cuerpo de todas las notas en memoria: sirve para 13, no para 2000.
- NOTAS PRIVADAS. Si hay notas que no deben salir, fíltralas en el origen —al generar el
  JSON o en el API—, nunca en el cliente.
- ENLACES ROTOS. `resolveLink` ya degrada con elegancia: un `[[wikilink]]` sin destino se
  pinta como texto subrayado punteado. Verifica que se vea así y no como enlace muerto.

── 2.3 CONTACTO — `src/routes/public/Contact.tsx`

Hoy: valida en el cliente (nombre, formato de correo, longitud mínima), enfoca el primer
campo con error, muestra estado de envío y una tarjeta de éxito. No envía nada.

Qué hacer: conectar el envío con nuestro servicio de correo o de formularios. Conserva la
validación en línea, el foco al primer error, el botón habilitado hasta que arranca la
petición, y el `aria-live` del resultado. Añade manejo de fallo: hoy solo existe el camino
feliz, y un error de red debe decir qué pasó y qué hacer.

── 2.4 CONTENIDO — `src/lib/content/*`

`site.ts` ya tiene la identidad real de Biocomplex: nombre, descriptor, lema. Correo,
handle, ciudad y adscripciones son de relleno: confírmalos con el cliente.

`research.ts`, `people.ts`, `publications.ts`, `news.ts` y `resources.ts` son material de
EJEMPLO, escrito alrededor de biología de sistemas para poder ver la interfaz llena. Hay que
sustituirlos por el trabajo real del laboratorio. Todo el texto es bilingüe con la forma
`bi('español', 'english')`; si añades campos, añádelos en los dos idiomas.

Decide con el cliente si este contenido se queda versionado en el repo —lo más simple, y
razonable si lo actualizan pocas veces al año— o si va a un CMS. Si va a un CMS, mantén los
mismos tipos y cambia solo el origen.

────────────────────────────────────────────────────────────────────────
FASE 3 — HOSTING Y DESPLIEGUE
────────────────────────────────────────────────────────────────────────

- El build es estático: `pnpm build` deja `dist/`. El hosting debe reescribir cualquier ruta
  desconocida a `index.html`, o `/investigacion` dará 404 al recargar.
- `public/_headers` trae CSP, cabeceras de seguridad y `Cache-Control: immutable` para
  `/assets/*` y `/fonts/*`, en el formato de Cloudflare Pages. Si nuestro hosting es otro,
  tradúcelas: no las pierdas.
- La CSP actual es estricta y asume que todo es del mismo origen. Si el API vive en otro
  dominio, agrégalo a `connect-src`. Preferimos colgar el API del mismo dominio bajo
  `/api/*` para no abrir CORS ni tocar la CSP.
- Las fuentes están auto-hospedadas en `public/fonts/`. No las muevas a un CDN externo: la
  CSP declara `font-src 'self'` y romperlo deja el sitio sin tipografía.
- Hoy no hay variables de entorno. Si necesitas una URL base de API, créala en un módulo de
  configuración tipado y no la escribas en línea en los componentes.
- Añade el build y el typecheck al pipeline como paso obligatorio antes de desplegar.

────────────────────────────────────────────────────────────────────────
FASE 4 — INVARIANTES. Esto no se rompe.
────────────────────────────────────────────────────────────────────────

1. SISTEMA DE DISEÑO. `src/index.css` tiene tres capas: primitivos `--prim-*`, semánticos
   en `@theme inline`, y tokens de sistema. Ningún componente escribe un color literal. Un
   cambio de identidad se hace editando la capa 1; si te ves escribiendo `#fff` en un
   componente, estás rompiendo el rebrand futuro.
2. TEMA. El botón alterna claro ↔ oscuro en un solo clic. Al entrar, el sitio sigue al
   sistema operativo (modo `auto`, disponible en `useTheme` con `setMode('auto')` pero
   fuera del recorrido del botón: un tercer estado obliga a un clic que no cambia nada).
   El script en `index.html` fija el atributo antes del primer pintado; si cambias la clave
   `lab.theme.v1`, cámbiala en los dos lugares o reaparece el parpadeo.
3. BILINGÜE. Todo texto visible se declara con `bi('es', 'en')`. Nada de cadenas sueltas en
   un solo idioma.
4. ACCESIBILIDAD. Foco visible con `:focus-visible` —nunca `outline: none`—, respeto a
   `prefers-reduced-motion` por CSS y por variants de motion, objetivos táctiles de 44 px,
   campos de 16 px en móvil, HTML semántico, iconos decorativos con `aria-hidden`.
5. ESTADO EN LA URL. Los filtros viven en query params (`?tipo=`, `?tag=`) para poder
   compartirlos y sobrevivir a un recargado. Cualquier filtro nuevo, igual.
6. CARGA DIFERIDA. El área de la bóveda se carga con `lazy()` en su propio chunk. Quien
   nunca inicia sesión no debe descargarla.
7. PERSISTENCIA. Los stores de Zustand usan `partialize` como lista blanca y clave
   versionada. Un campo nuevo no se persiste por accidente.
8. TYPESCRIPT ESTRICTO. `strict` y `noUncheckedIndexedAccess` están activos. No los apagues
   ni siembres `any` para avanzar.

────────────────────────────────────────────────────────────────────────
FORMA DE TRABAJO
────────────────────────────────────────────────────────────────────────

- Rama `feat/integracion-biocomplex`, commits pequeños y descriptivos, un PR al final.
- No rediseñes. Si crees que algo visual debe cambiar, propónlo por separado.
- Cuando un supuesto tuyo choque con nuestra infraestructura, para y pregunta en vez de
  inventar una solución que después haya que deshacer.
- Documenta en `docs/INTEGRACION.md` cada decisión que tomes y cada cosa que hayas
  cambiado del front original, con el porqué.

────────────────────────────────────────────────────────────────────────
FASE 5 — PRUEBAS. Al terminar la integración, antes de desplegar.
────────────────────────────────────────────────────────────────────────

No des la integración por terminada hasta que todo esto pase. Si algo falla, arréglalo o
repórtalo; no lo dejes pasar en silencio.

AUTOMÁTICAS
- `pnpm lint` (typecheck) y `pnpm build` en verde, sin advertencias nuevas.
- Playwright en tres viewports —móvil (iPhone 14), tablet (768×1024) y escritorio
  (1440×900)—, cubriendo al menos:
  · Cada ruta pública carga, responde 200 y muestra su encabezado.
  · Iniciar sesión con una cuenta real entra y redirige a la ruta que se había pedido.
  · Sin sesión, `/boveda` redirige a `/acceso` y no filtra contenido de la bóveda.
  · Cerrar sesión limpia el estado y bloquea de nuevo el área privada.
  · Una nota real abre, su Markdown se renderiza y sus enlaces entrantes son correctos.
  · Un `[[wikilink]]` navega a la nota destino.
  · El buscador (⌘K) encuentra una nota por título y por texto del cuerpo.
  · Los filtros de `/publicaciones` y `/boveda/etiquetas` sobreviven a un recargado.
  · El tema alterna en un clic, y tema e idioma persisten tras recargar.
- Revisión de accesibilidad automatizada (axe o Lighthouse) en portada, una nota y el
  formulario de contacto: cero incidencias críticas.

MANUALES
- Recorrido completo en un teléfono real, no solo en el emulador.
- Una nota larga y una nota con imágenes y embeds, para confirmar que el lector aguanta el
  contenido de verdad.
- Comprobar que ninguna nota privada aparece en el bundle ni en las respuestas del API:
  busca en `dist/` texto que solo exista en una nota confidencial.
- Verificar las cabeceras del hosting ya desplegado: CSP activa, `immutable` en los assets,
  rutas profundas recargando sin 404.

────────────────────────────────────────────────────────────────────────
FASE 6 — DESPLIEGUE. En cuanto la integración esté terminada y probada.
────────────────────────────────────────────────────────────────────────

Con la FASE 5 en verde, despliega el sitio a nuestra infraestructura:

1. Despliega primero a preview o staging y haz ahí las pruebas de humo.
2. Despliega a producción con el pipeline, no a mano desde una laptop.
3. Prueba de humo sobre la URL desplegada: portada carga, login real funciona, una nota de
   la bóveda abre, tema e idioma responden, y una ruta profunda recarga sin 404.
4. Repórtame al terminar: la URL desplegada, el commit exacto que quedó en producción, qué
   cambiaste respecto al front original y por qué, y qué quedó pendiente.

Si alguna prueba de la FASE 5 no pasa, NO despliegues: detente y dime qué falló.
```

---

## Cómo usarlo

1. Copia todo lo que está dentro del bloque de arriba y pégalo en Claude Code, desde la raíz
   del repositorio donde el equipo trabaja su infraestructura.
2. El agente clona el front, levanta el inventario de la infraestructura existente y se
   detiene a mostrar el plan antes de escribir código. Ese es el punto natural para
   revisarlo.
3. A partir de ahí ejecuta la integración, prueba y despliega.

El repositorio del front es <https://github.com/Esacoatl/biocomplex-web>.
