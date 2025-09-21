'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const RoleGuard = ({ 
  children, 
  allowedRoles = [], 
  fallback = null, 
  requireAll = false 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!isAuthenticated) {
    return fallback || <div>Access denied: Please log in</div>;
  }

  const userRole = user?.role;
  
  // Check if user has required role(s)
  const hasAccess = requireAll 
    ? allowedRoles.every(role => userRole === role)
    : allowedRoles.includes(userRole);

  if (!hasAccess) {
    return fallback || (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-600 mt-2">
          You don't have permission to view this content.
        </p>
      </div>
    );
  }

  return children;
};

export default RoleGuard;
