import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './HomePage/HomePage.jsx';
import Discussion from './Discussion/Discussion.jsx';
import MyProfile from './MyProfile/MyProfile.jsx';
import Post from './Posts/Post.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
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
    element: <Post />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
