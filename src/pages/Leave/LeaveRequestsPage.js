// src/pages/Leave/LeaveRequestsPage.js
import React, { useState, useEffect } from "react";
import LeaveRequestList from "../../components/leave/LeaveRequestList";
import { getCurrentUser } from "../../utils/auth";

const LeaveRequestsPage = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const currentUser = getCurrentUser(); // Fetch current user info from token
    setUser(currentUser);
  }, []);

  if (!user) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center mb-4">
              <i className="bi bi-calendar-event fs-2 text-primary me-3"></i>
              <h1 className="mb-0">Leave Requests</h1>
            </div>
          </div>
        </div>
        <LeaveRequestList userId={user.id} status={null} />
      </div>
    </div>
  );
};

export default LeaveRequestsPage;
