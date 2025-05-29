import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { token, currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  if (!token || !currentUser) {
    // Redirect to login page with return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute; 