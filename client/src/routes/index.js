import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config';
//
import {
  LoginPage,
  RegisterPage,
  
  GeneralAppPage,

  GalleryPage,
  
  TodoListPage,
  TodoCreatePage,
  TodoEditPage,
  
  LocationPage,
  LocationCreatePage,
  
  TransactionPage,
  TransactionCreatePage,

  ChatPage,

  CalendarPage,

  Page404
  
} from './elements';

export default function Router() {
  return useRoutes([
    // Auth
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        }
      ],
    },

    // Dashboard
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralAppPage /> },
        { path: 'gallery', element: <GalleryPage /> },
        {
          path: 'todos',
          children: [
            { element: <Navigate to="/dashboard/todos/list" replace />, index: true },
            { path: 'list', element: <TodoListPage /> },
            { path: 'new', element: <TodoCreatePage /> },
            { path: ':todo/edit', element: <TodoEditPage /> },
          ],
        },
        {
          path: 'locations',
          children: [
            { element: <Navigate to="/dashboard/locations/list" replace />, index: true },
            { path: 'list', element: <LocationPage /> },
            { path: 'new', element: <LocationCreatePage /> },
          ]
        },
        {
          path: 'transactions',
          children: [
            { element: <Navigate to="/dashboard/transactions/list" replace />, index: true },
            { path: 'list', element: <TransactionPage /> },
            { path: 'new', element: <TransactionCreatePage /> },
          ]
        },
        {
          path: 'chat',
          children: [
            { element: <ChatPage />, index: true },
          ],
        },
        {
          path: 'events',
          children: [
            { element: <CalendarPage />, index: true },
          ],
        }]
    },
    { path: '/404', element: <Page404 />, index: true },
    { path: '/', element: <Navigate to="/dashboard" replace /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
