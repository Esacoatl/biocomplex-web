import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/src/lib/store/auth'

/** Guarda de acceso. Recuerda a dónde iba el usuario para volver tras el login. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/acceso" replace state={{ from: location.pathname + location.search }} />
  }
  return <>{children}</>
}
