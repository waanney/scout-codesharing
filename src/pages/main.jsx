import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  ProtectedRoute,
  HaveloginRoute,
} from '../services/protectedRoutes.jsx';
import { Provider } from 'react-redux'; // Import Provider
import store from '../redux/store'; // Import store once

import HomePage from './HomePage';
import Board from './DiscussionPage/_id';
import MyProfile from './MyProfile';
import Login from './Login';
import Signup from './Signup';
import PostGetID from './UsersPost/_id';
import UserStorage from './StoragePage/UserStorage';
import Changepassword from './Changepassword';
import Forgotpassword from './Forgotpassword.jsx';
import Resetpassword from './Resetpassword.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    element: <HaveloginRoute />,
    children: [
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/forgot-password',
        element: <Forgotpassword />,
      },
      {
        path: '/reset-password/:token',
        element: <Resetpassword />,
      },
    ],
  },
  {
    element: <ProtectedRoute />, // Bảo vệ các route bên trong
    children: [
      {
        path: '/discussion',
        element: <Board />,
      },
      {
        path: '/profile/:owner',
        element: <MyProfile />,
      },
      {
        path: '/post/:boardId',
        element: <PostGetID />,
      },
      {
        path: '/storage',
        element: <UserStorage />,
      },
      {
        path: '/changepassword',
        element: <Changepassword />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
