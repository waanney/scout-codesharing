import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Component ProtectedRoute

export const ProtectedRoute = () => {
  const currentUser =
    useSelector(state => state.auth.login.currentUser) ||
    JSON.parse(localStorage.getItem('currentUser')); // Lấy currentUser từ Redux hoặc từ localStorage

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
