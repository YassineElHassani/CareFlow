/**
 * Error Boundary Component
 * Catches React component errors and displays fallback UI
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    errorCount: number;
}

class ErrorBoundary extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null, errorCount: 0 };
    }

    public static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState((prevState) => ({
            errorInfo,
            errorCount: prevState.errorCount + 1,
        }));

        console.error('Error caught by boundary:', error, errorInfo);

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);

        // Log to error tracking service (Sentry, LogRocket, etc.)
        // errorTrackingService.captureException(error, { errorInfo });
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    private handleReload = () => {
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        <div className="bg-white rounded-lg shadow-xl p-8">
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="bg-red-100 p-4 rounded-full">
                                    <AlertCircle className="text-red-600" size={32} />
                                </div>
                            </div>

                            {/* Error Message */}
                            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                                Something Went Wrong
                            </h1>
                            <p className="text-gray-600 text-center mb-6">
                                We encountered an unexpected error. Please try again or contact support if the problem persists.
                            </p>

                            {/* Error Details (Development Only) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm font-mono text-red-800 break-words">
                                        {this.state.error.message}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="mt-2">
                                            <summary className="cursor-pointer text-sm font-semibold text-red-700">
                                                Stack Trace
                                            </summary>
                                            <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* Error Count */}
                            {this.state.errorCount > 3 && (
                                <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        Multiple errors detected ({this.state.errorCount}). Please reload the page.
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={this.handleReset}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
                                >
                                    <RotateCcw size={18} />
                                    Try Again
                                </button>
                                <button
                                    onClick={this.handleReload}
                                    className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2 font-medium"
                                >
                                    <Home size={18} />
                                    Go to Home
                                </button>
                            </div>

                            {/* Support Message */}
                            <p className="text-xs text-gray-500 text-center mt-6">
                                If the problem continues, please contact support at support@careflow.com
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
