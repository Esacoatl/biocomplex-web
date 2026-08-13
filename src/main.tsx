import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'

// Prefijos consistentes para poder filtrar cuando alguien manda una captura
window.addEventListener('error', (event) =>
  console.error('[global:error]', event.message, event.filename, event.lineno, event.colno),
)
window.addEventListener('unhandledrejection', (event) =>
  console.error('[global:rejection]', event.reason),
)

const container = document.getElementById('root')
if (!container) throw new Error('No se encontró #root en el documento')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
