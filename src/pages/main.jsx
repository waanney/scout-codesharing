import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './HomePage';
import Discussion from './Discussion';
import MyProfile from './MyProfile';
import Post from './Post';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Post />,
  },
  {
    path: '/discussion',
    element: <Discussion />,
  },
  {
    path: '/myprofile',
    element: <MyProfile />,
  },
  {
    path: '/post=',
    element: <HomePage />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
