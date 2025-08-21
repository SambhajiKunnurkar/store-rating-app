import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from './common/Loader';

const RouteGuard = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader />; 
    }

    if (!user) {
        
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RouteGuard;