import { lazy, Suspense } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/src/lib/theme/ThemeProvider'
import { Login } from '@/src/routes/auth/Login'
import { Contact } from '@/src/routes/public/Contact'
import { Home } from '@/src/routes/public/Home'
import { News } from '@/src/routes/public/News'
import { NotFound } from '@/src/routes/public/NotFound'
import { People } from '@/src/routes/public/People'
import { Publications } from '@/src/routes/public/Publications'
import { PublicShell } from '@/src/routes/public/PublicShell'
import { Research } from '@/src/routes/public/Research'
import { Resources } from '@/src/routes/public/Resources'
import { RequireAuth } from '@/src/routes/vault/RequireAuth'

// El área interna se carga aparte: la mayoría de las visitas nunca la abre.
// `lazy()` exige default export y el proyecto usa named exports en todo.
const VaultShell = lazy(() =>
  import('@/src/routes/vault/VaultShell').then((m) => ({ default: m.VaultShell })),
)
const VaultHome = lazy(() =>
  import('@/src/routes/vault/VaultHome').then((m) => ({ default: m.VaultHome })),
)
const NoteRoute = lazy(() =>
  import('@/src/routes/vault/NoteRoute').then((m) => ({ default: m.NoteRoute })),
)
const GraphRoute = lazy(() =>
  import('@/src/routes/vault/GraphRoute').then((m) => ({ default: m.GraphRoute })),
)
const TagsRoute = lazy(() =>
  import('@/src/routes/vault/TagsRoute').then((m) => ({ default: m.TagsRoute })),
)

// El build de un solo archivo usa rutas con hash: no hay servidor que reescriba.
const Router = import.meta.env.VITE_HASH_ROUTER === '1' ? HashRouter : BrowserRouter

export function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={null}>
          <Routes>
            {/* ------------------------------------------------------ Sitio público */}
            <Route element={<PublicShell />}>
              <Route index element={<Home />} />
              <Route path="investigacion" element={<Research />} />
              <Route path="personas" element={<People />} />
              <Route path="publicaciones" element={<Publications />} />
              <Route path="recursos" element={<Resources />} />
              <Route path="noticias" element={<News />} />
              <Route path="contacto" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* -------------------------------------------------------------- Acceso */}
            <Route path="/acceso" element={<Login />} />

            {/* ------------------------------------------------------ Área protegida */}
            <Route
              path="/boveda"
              element={
                <RequireAuth>
                  <VaultShell />
                </RequireAuth>
              }
            >
              <Route index element={<VaultHome />} />
              <Route path="nota/*" element={<NoteRoute />} />
              <Route path="grafo" element={<GraphRoute />} />
              <Route path="etiquetas" element={<TagsRoute />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  )
}
