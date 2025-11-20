/**
 * Not Found Page
 */

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <h1 className="text-6xl font-bold text-error-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-2">Page Not Found</h2>
            <p className="text-secondary-600 mb-8 text-center max-w-md">
                Sorry, the page you are looking for does not exist or has been moved.
            </p>
            <button
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
                Back to Dashboard
            </button>
        </div>
    );
}
