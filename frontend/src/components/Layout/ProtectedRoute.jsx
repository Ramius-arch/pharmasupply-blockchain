import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * ProtectedRoute — wraps routes that require authentication.
 * Optionally restricts by role(s).
 *
 * @param {React.ReactNode} children — the component to render if authorized
 * @param {string[]} [allowedRoles] — optional array of allowed roles (e.g., ['admin', 'supplier'])
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);

    // Wait until auth state is loaded from localStorage
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Verifying credentials...</p>
            </div>
        );
    }

    // Not logged in → redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but wrong role → redirect to home
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
