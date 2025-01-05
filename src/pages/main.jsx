import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Provider
import store from '../redux/store'; // Import store once

import HomePage from './HomePage';
import Discussion from './Discussion';
import MyProfile from './MyProfile';
import Post from './Post';
import Login from './Login';
import Signup from './Signup';
import HomePage_after from './HomePage_after';

const router = createBrowserRouter([
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
    path: '/homepage_after',
    element: <HomePage_after />,
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
    path: '/post',
    element: <Post />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> 
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
