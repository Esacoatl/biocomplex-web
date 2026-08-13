/**
 * Empaqueta el build de `dist-single/` en un solo archivo HTML autocontenido:
 * CSS y JS en línea, y las fuentes .woff2 embebidas como data URI.
 *
 * Sirve para compartir una vista previa navegable sin servidor.
 *
 *   VITE_HASH_ROUTER=1 vite build --outDir dist-single --emptyOutDir
 *   node scripts/make-singlefile.mjs [destino.html]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist-single')
const out = resolve(process.argv[2] ?? join(root, 'preview.html'))

const html = readFileSync(join(dist, 'index.html'), 'utf8')

const cssHref = /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/.exec(html)
const jsSrc = /<script[^>]+type="module"[^>]+src="([^"]+)"[^>]*><\/script>/.exec(html)
if (!cssHref?.[1] || !jsSrc?.[1]) throw new Error('No se encontró el CSS o el JS en index.html')

let css = readFileSync(join(dist, cssHref[1].replace(/^\//, '')), 'utf8')
const js = readFileSync(join(dist, jsSrc[1].replace(/^\//, '')), 'utf8')

// Fuentes auto-hospedadas → data URI (public/ no pasa por el pipeline de Vite)
css = css.replace(/url\(["']?\/fonts\/([^"')]+)["']?\)/g, (_match, file) => {
  const bytes = readFileSync(join(root, 'public', 'fonts', file))
  return `url(data:font/woff2;base64,${bytes.toString('base64')})`
})

// El anfitrión de artefactos envuelve el archivo en su propio <html><body>,
// así que se entrega sólo el contenido: título, estilos, raíz y script.
const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? 'Laboratorio'
const themeScript = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1] ?? ''

writeFileSync(
  out,
  `<meta charset="utf-8" />
<title>${title}</title>
<style>
${css}
</style>
<div id="root"></div>
<script>${themeScript}</script>
<script type="module">
${js}
</script>
`,
  'utf8',
)

const size = Buffer.byteLength(readFileSync(out))
console.log(`[singlefile] ${out} — ${(size / 1024).toFixed(0)} kB`)
