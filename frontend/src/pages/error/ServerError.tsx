/**
 * Server Error Page
 */

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function ServerError() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <h1 className="text-6xl font-bold text-error-600 mb-4">500</h1>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-2">Server Error</h2>
            <p className="text-secondary-600 mb-8 text-center max-w-md">
                Something went wrong on the server. Please try again later.
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
