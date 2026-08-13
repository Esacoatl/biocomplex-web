import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// VITE_HASH_ROUTER=1 builds a portable bundle (hash routing + everything inlined)
// so the whole SPA can be dropped into a single HTML file for previews.
const singleFile = process.env.VITE_HASH_ROUTER === '1'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: singleFile
    ? {
        assetsInlineLimit: 100 * 1024 * 1024,
        cssCodeSplit: false,
        modulePreload: { polyfill: false },
        rollupOptions: { output: { inlineDynamicImports: true } },
      }
    : {},
})
