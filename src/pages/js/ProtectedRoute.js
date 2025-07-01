import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('customerToken');
  const storedStoreId = localStorage.getItem('storeId');
  const { storeId } = useParams();

  // If not logged in or wrong store
  if (!token || storedStoreId !== storeId) {
    return <Navigate to={`/store/${storeId}/login`} replace />;
  }

  return children;
};

export default ProtectedRoute;
