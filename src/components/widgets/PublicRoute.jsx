import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthStatus, selectUser } from '../../store/features/userSlice';
import FullPageLoader from './FullPageLoader';

/**
 * Login/signup screens. Signed-in users are sent on to the page they originally
 * asked for (set by ProtectedRoute), or the dashboard.
 */
const PublicRoute = () => {
  const user = useSelector(selectUser);
  const status = useSelector(selectAuthStatus);
  const location = useLocation();

  if (status === 'loading') return <FullPageLoader />;
  if (user) {
    const from = location.state?.from;
    const target = from ? `${from.pathname}${from.search || ''}` : '/home';
    return <Navigate to={target} replace />;
  }
  return <Outlet />;
};

export default PublicRoute;
