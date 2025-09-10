import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@/features/auth/hooks/useSession';

export const RestrictedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoading, authenticated } = useSession();

  if (isLoading) return <div>Loading...</div>;
  if (!authenticated) return <Navigate to="/login" replace />;

  return children;
};
