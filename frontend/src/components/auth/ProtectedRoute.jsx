/**
 * Protected Route Component
 * 
 * LEARNING: Route Protection Pattern
 * 
 * Wraps components that require authentication.
 * Redirects to login if user is not authenticated.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    /**
     * LEARNING: Conditional Rendering
     * 
     * Show loading while checking auth status,
     * then either show content or redirect to login.
     */
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        /**
         * LEARNING: Redirect with State
         * 
         * Save current location in state so we can redirect back
         * after successful login.
         */
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
