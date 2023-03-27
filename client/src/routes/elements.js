import { Suspense, lazy } from 'react';
import LoadingScreen from '../components/loading-screen';

const Loadable = (Component) => (props) =>
(
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);


export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
export const RegisterPage = Loadable(lazy(() => import('../pages/auth/RegisterPage')));

export const GeneralAppPage = Loadable(lazy(() => import('../pages/dashboard/GeneralAppPage')));

export const GalleryPage = Loadable(lazy(() => import('../pages/dashboard/GalleryPage')));

export const TodoListPage = Loadable(lazy(() => import('../pages/dashboard/TodoListPage')));
export const TodoCreatePage = Loadable(lazy(() => import('../pages/dashboard/TodoCreatePage')));
export const TodoEditPage = Loadable(lazy(() => import('../pages/dashboard/TodoEditPage')));

export const LocationPage = Loadable(lazy(() => import('../pages/dashboard/LocationPage')));
export const LocationCreatePage = Loadable(lazy(() => import('../pages/dashboard/LocationCreatePage')));

export const TransactionPage = Loadable(lazy(() => import('../pages/dashboard/TransactionPage')));
export const TransactionCreatePage = Loadable(lazy(() => import('../pages/dashboard/TransactionCreatePage')));

export const ChatPage = Loadable(lazy(() => import('../pages/dashboard/ChatPage')));

export const CalendarPage = Loadable(lazy(() => import('../pages/dashboard/CalendarPage')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));

