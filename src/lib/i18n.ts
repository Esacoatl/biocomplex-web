import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { safeStateStorage } from './store/storage'

export type Lang = 'es' | 'en'

/** Texto bilingüe. Todo el contenido del sitio se declara con esta forma. */
export interface Bi {
  es: string
  en: string
}

export function bi(es: string, en: string): Bi {
  return { es, en }
}

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

function detect(): Lang {
  if (typeof navigator === 'undefined') return 'es'
  return navigator.languages?.some((l) => l.toLowerCase().startsWith('en')) ? 'en' : 'es'
}

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: detect(),
      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === 'es' ? 'en' : 'es' }),
    }),
    {
      name: 'lab.lang.v1',
      storage: createJSONStorage(() => safeStateStorage),
      partialize: (state) => ({ lang: state.lang }),
    },
  ),
)

/** Selector fino: el componente sólo se re-renderiza si cambia el idioma. */
export function useLang(): Lang {
  return useLangStore((s) => s.lang)
}

/** `const t = useT()` → `t(bi('Hola', 'Hello'))` */
export function useT(): (text: Bi) => string {
  const lang = useLang()
  return (text: Bi) => text[lang]
}

/**
 * Formato de fecha por locale — nunca formatos escritos a mano.
 *
 * `new Date('2026-08-13')` se interpreta como medianoche UTC y, al oeste de
 * Greenwich, se imprime como el día anterior. Se le añade la hora local para
 * que una fecha sin hora signifique ese día en el huso del usuario.
 */
export function formatDate(iso: string, lang: Lang, opts?: Intl.DateTimeFormatOptions): string {
  const value = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00` : iso
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...opts,
  }).format(new Date(value))
}
