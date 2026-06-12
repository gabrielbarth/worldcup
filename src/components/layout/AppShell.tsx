import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <div className="min-h-screen bg-navy-900 pb-16">
      <Outlet />
      <BottomNav />
    </div>
  )
}
