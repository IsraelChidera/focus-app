import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthStatus, selectUser } from '../../store/features/userSlice';
import FullPageLoader from './FullPageLoader';
import AppShell from './AppShell';

/** Signed-in area. Unauthenticated visitors go to login, which returns them here afterwards. */
const ProtectedRoute = () => {
  const user = useSelector(selectUser);
  const status = useSelector(selectAuthStatus);
  const location = useLocation();

  if (status === 'loading') return <FullPageLoader label="Checking your session" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export default ProtectedRoute;
