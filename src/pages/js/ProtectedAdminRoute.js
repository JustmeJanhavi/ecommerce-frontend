// src/components/ProtectedAdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');      // Set during shop owner login
//   const userType = localStorage.getItem('userType');    // Optional, but useful to distinguish

  if (!token ) {
    return <Navigate to="/login" replace />;            // Redirect to shop owner login
  }

  return children;
};

export default ProtectedAdminRoute;
