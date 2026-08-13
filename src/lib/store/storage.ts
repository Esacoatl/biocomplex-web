import type { StateStorage } from 'zustand/middleware'

/**
 * Safari iOS en navegación privada lanza QuotaExceededError en setItem aunque
 * el almacenamiento esté vacío. Se degrada a sessionStorage antes de fallar.
 */
export const safeStateStorage: StateStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key)
    } catch {
      try {
        return sessionStorage.getItem(key)
      } catch {
        return null
      }
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch {
      try {
        sessionStorage.setItem(key, value)
      } catch {
        /* ningún almacenamiento disponible — no sobrevive al reload */
      }
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
    } catch {
      try {
        sessionStorage.removeItem(key)
      } catch {
        /* nada que limpiar */
      }
    }
  },
}
