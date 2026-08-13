import { AnimatePresence, motion } from 'motion/react'
import { CornerDownLeft, FileText, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Kbd } from '@/src/components/ui/input'
import { bi, useT } from '@/src/lib/i18n'
import { recentNotes, searchNotes } from '@/src/lib/vault'
import { cn } from '@/src/lib/utils'

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    if (query.trim().length < 2) {
      return recentNotes(6).map((note) => ({ note, snippet: note.path }))
    }
    return searchNotes(query)
  }, [query])

  useEffect(() => setCursor(0), [query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  const go = (path: string) => {
    navigate(`/boveda/nota/${encodeURIComponent(path)}`)
    onClose()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setCursor((c) => Math.min(c + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const hit = results[cursor]
      if (hit) go(hit.note.path)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
          className="fixed inset-0 z-100 flex items-start justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t(bi('Buscar en la bóveda', 'Search the vault'))}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={onKeyDown}
            className="bg-surface border-line w-full max-w-xl overflow-hidden rounded-xl border shadow-[var(--shadow-2)]"
            style={{ overscrollBehavior: 'contain' }}
          >
            <div className="border-line flex items-center gap-3 border-b px-4">
              <Search aria-hidden="true" className="text-fg-faint size-4 shrink-0" />
              <input
                ref={inputRef}
                type="search"
                name="vault-search"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t(bi('Buscar notas, etiquetas, texto…', 'Search notes, tags, text…'))}
                aria-label={t(bi('Buscar en la bóveda', 'Search the vault'))}
                className="text-fg placeholder:text-fg-faint h-13 flex-1 bg-transparent text-[15px] outline-none"
              />
              <Kbd>esc</Kbd>
            </div>

            <div
              className="max-h-[52vh] overflow-y-auto p-2"
              style={{ overscrollBehavior: 'contain' }}
            >
              {results.length === 0 ? (
                <p className="text-fg-subtle px-3 py-8 text-center text-sm">
                  {t(bi('Sin resultados para', 'No results for'))} “{query}”
                </p>
              ) : (
                <>
                  <p className="label-mono text-fg-faint px-3 py-2">
                    {query.trim().length < 2
                      ? t(bi('Notas recientes', 'Recent notes'))
                      : t(bi('Resultados', 'Results'))}
                  </p>
                  <ul>
                    {results.map((hit, index) => (
                      <li key={hit.note.path}>
                        <button
                          type="button"
                          onMouseEnter={() => setCursor(index)}
                          onClick={() => go(hit.note.path)}
                          className={cn(
                            'flex w-full cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 text-left',
                            index === cursor ? 'bg-sunken' : '',
                          )}
                        >
                          <FileText
                            aria-hidden="true"
                            className="text-fg-faint mt-0.5 size-4 shrink-0"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="text-fg block truncate text-sm font-medium">
                              {hit.note.title}
                            </span>
                            <span className="text-fg-faint mt-0.5 block truncate text-xs">
                              {hit.snippet}
                            </span>
                          </span>
                          {index === cursor ? (
                            <CornerDownLeft
                              aria-hidden="true"
                              className="text-fg-faint mt-1 size-3.5 shrink-0"
                            />
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
