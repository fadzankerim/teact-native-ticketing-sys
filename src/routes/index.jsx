import { createBrowserRouter, Navigate } from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import TicketListPage from '../pages/tickets/TicketListPage';
import TicketDetailPage from '../pages/tickets/TicketDetailPage';
import CreateTicketPage from '../pages/tickets/CreateTicketPage';
import KanbanBoardPage from '../pages/tickets/KanbanBoardPage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import NotFoundPage from '../pages/NotFoundPage';



const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'tickets',
        children: [
          {
            index: true,
            element: <TicketListPage />,
          },
          {
            path: 'new',
            element: <CreateTicketPage />,
          },
          {
            path: 'board',
            element: (
              <ProtectedRoute requiredRole="AGENT">
                <KanbanBoardPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ':id',
            element: <TicketDetailPage />,
          },
        ],
      },
      {
        path: 'analytics',
        element: (
          <ProtectedRoute requiredRole="MANAGER">
            <AnalyticsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;