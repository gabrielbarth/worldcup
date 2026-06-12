import { Navigate, Outlet } from 'react-router-dom'
import { useAuthState } from '../hooks/useAuth'

export function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuthState()
  if (isLoading) return <div className="flex items-center justify-center h-screen"><div className="text-brand">Carregando...</div></div>
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
