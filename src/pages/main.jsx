import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './HomePage';
import Board from './DiscussionPage/_id';
import MyProfile from './MyProfile';
import PostGetID from './UsersPost/_id';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/discussion',
    element: <Board />,
  },
  {
    path: '/myprofile',
    element: <MyProfile />,
  },
  {
    path: '/post/:boardId',
    element: <PostGetID />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
