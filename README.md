# Biocomplex — sitio web

Front-end del sitio de **Biocomplex**, laboratorio de investigación científica biológica.
Incluye el sitio público bilingüe (ES/EN) y un área privada que muestra la bóveda de
Obsidian del equipo.

Está **terminado a nivel de interfaz y vacío a nivel de backend**: todas las pantallas,
estados y transiciones existen y funcionan con datos de ejemplo. Implementar consiste en
sustituir cuatro fuentes de datos por llamadas reales, sin tocar componentes.

---

## Arranque

Requiere Node 20+ y pnpm 10 (`npm i -g pnpm`). También funciona con npm o yarn.

```bash
pnpm install
pnpm dev        # http://localhost:3005
```

| Comando                   | Qué hace                                     |
| ------------------------- | -------------------------------------------- |
| `pnpm dev`                | Servidor de desarrollo con recarga en caliente |
| `pnpm build`              | Compila a `dist/` (estáticos, listos para CDN) |
| `pnpm preview`            | Sirve el build de producción                  |
| `pnpm lint`               | `tsc --noEmit` — TypeScript en modo estricto  |
| `pnpm format`             | Prettier con orden automático de clases Tailwind |
| `pnpm build:singlefile`   | Genera `preview.html`, un HTML autocontenido para compartir sin servidor |

Para entrar al área privada: botón **«Usar credenciales de demo»**, o cualquier correo con
una contraseña de 4 o más caracteres.

---

## Stack

| Capa            | Elección                                                |
| --------------- | ------------------------------------------------------- |
| Framework       | React 19, sin SSR — compila a estáticos                 |
| Bundler         | Vite 6                                                  |
| Lenguaje        | TypeScript 5.8 estricto (`noUncheckedIndexedAccess`)    |
| Estilos         | Tailwind CSS v4 — configuración en CSS, sin `tailwind.config.js` |
| Primitivas      | Estilo shadcn/ui (`new-york`) sobre Radix, copiadas al repo |
| Variantes       | `class-variance-authority` + `clsx` + `tailwind-merge`  |
| Iconos          | `lucide-react`                                          |
| Ilustraciones   | SVG propios, en `src/components/site/Illustrations.tsx` |
| Animación       | `motion` (ex Framer Motion)                             |
| Routing         | `react-router-dom` 7                                    |
| Estado          | Zustand con `persist`                                   |

No hay dependencias de red en tiempo de ejecución: las fuentes son `.woff2`
auto-hospedadas y las imágenes son SVG en el bundle.

---

## Estructura

```
src/
├─ main.tsx            # createRoot + manejadores globales de error
├─ App.tsx             # router; el área privada se carga con lazy()
├─ index.css           # sistema de diseño completo (ver abajo)
├─ routes/
│  ├─ public/          # las siete pantallas públicas + shell + 404
│  ├─ auth/            # login
│  └─ vault/           # área privada: shell, resumen, nota, grafo, etiquetas
├─ components/
│  ├─ ui/              # primitivas: button, card, badge, input
│  ├─ layout/          # cabecera, pie, marca, conmutadores de tema e idioma
│  ├─ site/            # ilustraciones y piezas decorativas
│  └─ vault/           # árbol de archivos, lector Markdown, buscador, grafo
└─ lib/
   ├─ content/         # TODO el texto del sitio público
   ├─ vault/           # notas de ejemplo + utilidades de enlaces
   ├─ store/           # Zustand: sesión y almacenamiento tolerante a fallos
   ├─ theme/           # claro / oscuro / automático
   ├─ ui/              # breakpoints
   ├─ i18n.ts          # bilingüe ES/EN
   └─ motion.ts        # duraciones y variants compartidos
```

**Regla de ubicación:** lo que se renderiza va en `components/`, lo que no (lógica pura,
IO, tipos) va en `lib/`. Eso permite probar la lógica sin montar React.

---

## Rutas

| Ruta                | Pantalla                                              |
| ------------------- | ----------------------------------------------------- |
| `/`                 | Inicio: portada, cómo trabajamos, convocatoria, destacados |
| `/investigacion`    | Líneas de investigación (enlace directo por `#id`)    |
| `/personas`         | Equipo agrupado por rol, con egresados                |
| `/publicaciones`    | Listado por año; el filtro vive en `?tipo=`           |
| `/recursos`         | Software, datos, cursos, protocolos                   |
| `/noticias`         | Cronología de novedades                               |
| `/contacto`         | Oportunidades + formulario                            |
| `/acceso`           | Inicio de sesión                                      |
| `/boveda`           | Resumen de la bóveda (requiere sesión)                |
| `/boveda/nota/*`    | Lectura de nota con enlaces entrantes y salientes     |
| `/boveda/grafo`     | Grafo de enlaces internos                             |
| `/boveda/etiquetas` | Notas por etiqueta (`?tag=`)                          |

El área de la bóveda va en su propio chunk: quien nunca inicia sesión no la descarga.

---

## Para el equipo de integración

El encargo completo —descubrimiento de la infraestructura existente, las cuatro costuras,
invariantes, pruebas y despliegue— está en [`docs/PROMPT-INTEGRACION.md`](docs/PROMPT-INTEGRACION.md),
escrito para pegarse directamente en un agente de código.

---

## Qué falta conectar

Cada maqueta está aislada en un solo archivo. Sustituirla no cambia ningún componente.

| Pieza         | Hoy                                            | Qué hacer                                 |
| ------------- | ---------------------------------------------- | ----------------------------------------- |
| Autenticación | `src/lib/store/auth.ts` simula latencia         | Llamar al backend dentro de `signIn`      |
| Bóveda        | `src/lib/vault/data.ts`, notas estáticas        | Sincronizador de Obsidian con la misma forma de datos |
| Contacto      | `src/routes/public/Contact.tsx` valida y muestra éxito | Enviar el formulario al backend    |
| Contenido     | `src/lib/content/*`                             | Dejarlo en el repo o mover a un CMS       |

El sitio es un SPA estático, así que el hosting solo necesita servir `dist/` y reescribir
las rutas desconocidas a `index.html`. `public/_headers` ya trae CSP y cache para
Cloudflare Pages; en otro hosting hay que traducir esas reglas.

---

## Sistema de diseño

Todo vive en `src/index.css`, en tres capas:

1. **Primitivos** (`--prim-*`) — los valores crudos de color.
2. **Semánticos** (`@theme inline`) — Tailwind genera de aquí `bg-*`, `text-*`, `border-*`.
3. **Tokens de sistema** — radios, sombras, duraciones de animación, anillo de foco.

**Ningún componente escribe un color literal.** Un cambio de identidad se hace editando la
capa 1; el resto del código no se toca.

- Tipografías auto-hospedadas en `public/fonts/`: Instrument Serif (títulos), Inter
  (texto), JetBrains Mono (etiquetas y cifras).
- La marca se escribe a dos tonos con `<BiocomplexName />`: «Bio» en tinta, «complex» en el
  acento. En texto corrido el nombre va entero.
- Tema claro y oscuro. Arranca siguiendo al sistema operativo y un script en `index.html`
  fija el atributo antes del primer pintado para evitar el parpadeo; en cuanto alguien usa
  el botón, su elección manda y se guarda. El botón es un interruptor de dos estados: el
  modo `auto` existe en `useTheme` (`setMode('auto')`) pero no está en el recorrido del
  botón, porque un tercer estado obliga a un clic que no cambia nada en pantalla.
- Idioma ES/EN: el contenido se declara como `bi('español', 'english')` y el conmutador
  está en la cabecera.
- Ilustraciones en `src/components/site/Illustrations.tsx` — catorce piezas con un mismo
  estilo (trazo de 2 px, lienzo 120×120, tres tonos) que toman su color de los primitivos y
  por eso se adaptan solas al tema. Qué ilustración acompaña a qué contenido se decide en
  `src/components/site/artMap.ts`.

### Accesibilidad y responsive

Piso aplicado en todo el sitio: HTML semántico, foco visible con `:focus-visible`, respeto a
`prefers-reduced-motion` (por CSS y por variants), objetivos táctiles de 44 px, campos de
16 px en móvil para evitar el auto-zoom de iOS, y contraste verificado en la capa de
primitivos.

---

## Contenido editable

| Archivo                           | Qué controla                              |
| --------------------------------- | ----------------------------------------- |
| `src/lib/content/site.ts`         | Nombre, descriptor, institución, correo, menú, cifras |
| `src/lib/content/research.ts`     | Líneas de investigación                   |
| `src/lib/content/people.ts`       | Integrantes y egresados                   |
| `src/lib/content/publications.ts` | Publicaciones                             |
| `src/lib/content/news.ts`         | Noticias                                  |
| `src/lib/content/resources.ts`    | Recursos                                  |
| `src/lib/vault/data.ts`           | Notas de ejemplo de la bóveda             |

> **Aviso sobre el contenido.** La identidad —nombre, descriptor, lema— ya es la de
> Biocomplex. Todo lo demás es material de ejemplo: personas, publicaciones, líneas de
> investigación y notas están inventados y escritos alrededor de biología de sistemas, para
> poder ver la interfaz llena. Hay que sustituirlos por el trabajo real del laboratorio
> antes de publicar.
