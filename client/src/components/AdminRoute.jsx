import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { user, isAdmin } = useAuth();
  
  // Si no hay usuario o no es admin, redirigir al home
  return user && isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}