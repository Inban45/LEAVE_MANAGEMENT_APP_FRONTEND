import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import ApplyLeavePage from "./pages/Leave/ApplyLeavePage";
import LeaveRequestsPage from "./pages/Leave/LeaveRequestsPage";
import LeaveRequestDetails from "./components/leave/LeaveRequestDetails";
import AllLeavesPage from "./pages/Leave/AllLeavesPage";
import LeaveApproval from "./components/leave/LeaveApproval";
import UsersPage from "./pages/Users/UsersPage";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Sidebar />

        <div className="dashboard-container">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                
                  <Dashboard />
              }
            />
            <Route
              path="/apply-leave"
              element={
                <ProtectedRoute>
                  <ApplyLeavePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leave-requests"
              element={
                <ProtectedRoute>
                  <LeaveRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leavedetails/:leaveId"
              element={
                <ProtectedRoute>
                  <LeaveRequestDetails onClose={() => window.history.back()} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/all-leaves"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <AllLeavesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leave-approvals"
              element={
                <ProtectedRoute roles={["MANAGER"]}>
                  <LeaveApproval />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
