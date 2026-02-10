import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../Stores/authStore';
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Check if user role has sufficient permissions
    const roleHierarchy = {
      'CUSTOMER': 0,
      'AGENT': 1,
      'MANAGER': 2,
      'ADMIN': 3,
    };

    const userLevel = roleHierarchy[user?.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    if (userLevel < requiredLevel) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;