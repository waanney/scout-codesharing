import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Post from './post/post.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Post />
  </StrictMode>,
);
