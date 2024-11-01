import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated} from '../app/slice/authSlice'
export const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector((state) => state.auth.user?.role);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.includes(userRole)) {
    return children;
  } 
  else {
    return <Navigate to="/unauthorized" replace />;
  }
};
