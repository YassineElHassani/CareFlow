/**
 * Forbidden Page
 */

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <h1 className="text-6xl font-bold text-warning-600 mb-4">403</h1>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-2">Access Forbidden</h2>
            <p className="text-secondary-600 mb-8 text-center max-w-md">
                You do not have permission to access this resource.
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
