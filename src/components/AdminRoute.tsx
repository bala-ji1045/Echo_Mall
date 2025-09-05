import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { ADMIN_SECRET_KEY } from '../lib/supabase';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const key = searchParams.get('key');

  if (key !== ADMIN_SECRET_KEY) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};