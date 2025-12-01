import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    const { isAuth, userRole } = useSelector(state => state.auth);

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    if (userRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
