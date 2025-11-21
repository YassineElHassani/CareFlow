import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import { routeConfigs, RouteConfig } from './routes.config';
import { ROUTES } from '../constants/routes';
import Spinner from '@/components/atoms/Spinner';

interface AppRouterProps {
  isAuthenticated: boolean;
  userRole: string | null;
}

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Build route elements with protection
const buildRouteElement = (
  config: RouteConfig,
  isAuthenticated: boolean,
  userRole: string | null
): React.ReactNode => {
  let element = config.element;

  // Wrap with Suspense for lazy loaded components
  element = <Suspense fallback={<LoadingFallback />}>{element}</Suspense>;

  // Apply role-based protection
  if (config.allowedRoles && config.allowedRoles.length > 0) {
    element = (
      <RoleBasedRoute allowedRoles={config.allowedRoles} userRole={userRole as any}>
        {element}
      </RoleBasedRoute>
    );
  }

  // Apply authentication protection
  if (config.isProtected) {
    element = <ProtectedRoute isAuthenticated={isAuthenticated}>{element}</ProtectedRoute>;
  }

  return element;
};

// Recursively build routes
const buildRoutes = (
  configs: RouteConfig[],
  isAuthenticated: boolean,
  userRole: string | null
): any[] => {
  return configs.map((config) => ({
    path: config.path,
    element: buildRouteElement(config, isAuthenticated, userRole),
    children: config.children
      ? buildRoutes(config.children, isAuthenticated, userRole)
      : undefined,
  }));
};

const AppRouter: React.FC<AppRouterProps> = ({ isAuthenticated, userRole }) => {
  // Add root redirect based on authentication
  const rootRoute = {
    path: '/',
    element: isAuthenticated ? (
      <Navigate to={ROUTES.DASHBOARD} replace />
    ) : (
      <Navigate to={ROUTES.LOGIN} replace />
    ),
  };

  const routes = buildRoutes(routeConfigs, isAuthenticated, userRole);
  const router = createBrowserRouter([rootRoute, ...routes]);

  return <RouterProvider router={router} />;
};

export default AppRouter;