import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  redirectTo = ROUTES.LOGIN,
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and save the attempted location
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;