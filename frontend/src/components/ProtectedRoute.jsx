// src/components/ProtectedRoute.jsx
import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ element, roles, ...rest }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect if user role is not authorized
    return <Navigate to="/unauthorized" />;
  }

  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
