import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { UserRole, hasRole } from '../constants/roles';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  userRole: UserRole | null;
  redirectTo?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  userRole,
  redirectTo = ROUTES.FORBIDDEN,
}) => {
  // If no user role (not authenticated), this should be handled by ProtectedRoute
  if (!userRole) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check if user has the required role
  if (!hasRole(userRole, allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;