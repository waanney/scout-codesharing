import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
import LoadingAnimation from '../components/loading';

const router = createBrowserRouter([
  {
    path: '/LoadingAnimation',
    element: <LoadingAnimation />,
  },
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/discussion',
    element: <Board />,
  },
  {
    path: '/profile',
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
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
