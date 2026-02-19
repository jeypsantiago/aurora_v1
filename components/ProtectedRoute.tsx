import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRbac } from '../RbacContext';
import { Permission } from '../types';
import { useDialog } from '../DialogContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requires?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requires }) => {
    const { can } = useRbac();
    const { alert } = useDialog();
    const location = useLocation();

    const hasAccess = !requires || can(requires);

    useEffect(() => {
        if (!hasAccess) {
            alert("Access Denied: You do not have the required permissions to view this page.");
        }
    }, [hasAccess, alert]);

    if (!hasAccess) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
