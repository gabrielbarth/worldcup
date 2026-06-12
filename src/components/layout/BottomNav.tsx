import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/matches', label: 'Jogos', icon: '⚽' },
  { to: '/groups', label: 'Grupos', icon: '👥' },
  { to: '/ranking', label: 'Ranking', icon: '🏆' },
  { to: '/profile', label: 'Perfil', icon: '👤' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-navy-600 border-t border-brand flex justify-around z-50">
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-4 text-xs ${isActive ? 'text-brand' : 'text-gray-400'}`
          }
        >
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
