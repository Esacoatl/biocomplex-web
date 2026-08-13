import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { safeStateStorage } from './storage'

export type Role = 'pi' | 'postdoc' | 'phd' | 'msc' | 'alumni'

export interface Member {
  email: string
  name: string
  role: Role
  initials: string
}

interface AuthState {
  user: Member | null
  status: 'idle' | 'pending' | 'error'
  error: string | null
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => void
  clearError: () => void
}

/**
 * Maqueta de autenticación: sólo simula latencia y guarda la sesión.
 * Cuando exista el backend, `signIn` pasa a llamar POST /api/auth/login y el
 * resto de la app no cambia — el store sigue siendo la única superficie.
 */
const DEMO_DIRECTORY: Record<string, { password: string; member: Member }> = {
  'demo@lab.mx': {
    password: 'demo',
    member: { email: 'demo@lab.mx', name: 'Invitada Demo', role: 'phd', initials: 'ID' },
  },
}

const initialState: AuthState = { user: null, status: 'idle', error: null }

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      signIn: async (email, password) => {
        set({ status: 'pending', error: null })
        await new Promise((r) => setTimeout(r, 600))

        const normalized = email.trim().toLowerCase()
        const entry = DEMO_DIRECTORY[normalized]

        // Maqueta: cualquier correo del dominio entra; el directorio sólo
        // sirve para tener un usuario con nombre bonito en la demo.
        if (entry && entry.password === password) {
          set({ user: entry.member, status: 'idle', error: null })
          return true
        }
        if (normalized.includes('@') && password.length >= 4) {
          const handle = normalized.split('@')[0] ?? 'miembro'
          const name = handle
            .split(/[._-]/)
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
          set({
            user: {
              email: normalized,
              name: name || 'Miembro del laboratorio',
              role: 'phd',
              initials: (name || 'ML')
                .split(' ')
                .map((w) => w.charAt(0))
                .slice(0, 2)
                .join('')
                .toUpperCase(),
            },
            status: 'idle',
            error: null,
          })
          return true
        }

        set({ status: 'error', error: 'credentials' })
        return false
      },

      signOut: () => set({ ...initialState }),
      clearError: () => set({ status: 'idle', error: null }),
    }),
    {
      name: 'lab.auth.v1', // clave versionada desde el día 1
      storage: createJSONStorage(() => safeStateStorage),
      // Lista blanca explícita: un campo nuevo no se persiste por accidente.
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
