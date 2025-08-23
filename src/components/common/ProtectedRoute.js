// src/components/common/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../../utils/auth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = getToken();

  let user = null;

  try {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      user = JSON.parse(userData);
    }
  } catch (err) {
    console.error("Failed to parse user from localStorage:", err);
    user = null;
  }


  // If no token or user, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are restricted and user role not allowed, redirect to dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Everything ok, render children
  return children;
};

export default ProtectedRoute;
