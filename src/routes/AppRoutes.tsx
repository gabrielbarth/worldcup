import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthGuard } from './AuthGuard'
import { AdminGuard } from './AdminGuard'
import { AppShell } from '../components/layout/AppShell'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { ProfilePage } from '../pages/ProfilePage'
import { MatchesPage } from '../pages/MatchesPage'
import { GroupsPage } from '../pages/GroupsPage'
import { NewGroupPage } from '../pages/NewGroupPage'
import { JoinGroupPage } from '../pages/JoinGroupPage'
import { GroupDetailPage } from '../pages/GroupDetailPage'
import { RankingPage } from '../pages/RankingPage'
import { AdminMatchesPage } from '../pages/AdminMatchesPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <Navigate to="/matches" replace /> },
          { path: '/matches', element: <MatchesPage /> },
          { path: '/groups', element: <GroupsPage /> },
          { path: '/groups/new', element: <NewGroupPage /> },
          { path: '/groups/join', element: <JoinGroupPage /> },
          { path: '/groups/:id', element: <GroupDetailPage /> },
          { path: '/ranking', element: <RankingPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
      {
        element: <AdminGuard />,
        children: [
          { path: '/admin/matches', element: <AdminMatchesPage /> },
        ],
      },
    ],
  },
])
