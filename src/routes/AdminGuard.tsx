import { Navigate, Outlet } from 'react-router-dom'
import { useAuthState } from '../hooks/useAuth'

export function AdminGuard() {
  const { appUser, isLoading } = useAuthState()
  if (isLoading) return <div className="flex items-center justify-center h-screen"><div className="text-brand">Carregando...</div></div>
  return appUser?.role === 'admin' ? <Outlet /> : <Navigate to="/matches" replace />
}
