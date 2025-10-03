import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from '@/hooks/redux';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';

export function AuthLayout() {
  const isAuthenticated = useIsAuthenticated();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/reports/games" replace />;
  }

  return (
    <div className="min-h-screen flex justify-center bg-background">
      <Outlet />
    </div>
  );
}
