import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // redirect to their own dashboard if role mismatch
    switch (user.role) {
      case 'Admin':
        return <Navigate to="/hr" replace />;
      case 'Manager':
        return <Navigate to="/manager" replace />;
      case 'TL':
        return <Navigate to="/tl" replace />;
      case 'Employee':
      default:
        return <Navigate to="/employee" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;


