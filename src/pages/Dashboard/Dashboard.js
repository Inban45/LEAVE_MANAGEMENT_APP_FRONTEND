// src/pages/Dashboard/Dashboard.js
import React, { useEffect, useState } from "react";
import { getNotificationsByUserId } from "../../api/notificationApi";
import { getAllLeaveRequests, getLeaveRequestsByEmployee } from "../../api/leaveRequestApi";
import LeaveCalendar from "../../components/dashboard/LeaveCalendar";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_EMPLOYEE } from "../../utils/constants";
import Layout from "../../components/common/Layout";
import { parseISO, differenceInDays } from "date-fns";

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Fetch notifications for the current user
    getNotificationsByUserId(user.id)
      .then((res) => setNotifications(res.data || []))
      .catch((err) => console.error(err));

    // For employees: total leaves
    getLeaveRequestsByEmployee(user.id)
      .then((res) => {
        const approvedLeaves = (res.data || []).filter(
          (leave) => leave.status === "APPROVED"
        );
        const totalDays = approvedLeaves.reduce((sum, leave) => {
          const start = parseISO(leave.startDate);
          const end = parseISO(leave.endDate);
          return sum + (differenceInDays(end, start) + 1);
        }, 0);
        setTotalLeaves(totalDays);
      })
      .catch((err) => console.error(err));

    // For managers/admins: pending leave approvals
    if (user.role === ROLE_MANAGER || user.role === ROLE_ADMIN) {
      getAllLeaveRequests()
        .then((res) => {
          const pending = (res.data || []).filter((lr) => lr.status === "PENDING");
          setPendingApprovals(pending.length);
        })
        .catch((err) => console.error(err));
    }
  }, [user.id, user.role]);

  const getRoleColor = (role) => {
    switch(role) {
      case 'ADMIN': return 'danger';
      case 'MANAGER': return 'warning';
      case 'EMPLOYEE': return 'success';
      default: return 'secondary';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'ADMIN': return 'bi-shield-fill';
      case 'MANAGER': return 'bi-person-badge';
      case 'EMPLOYEE': return 'bi-person';
      default: return 'bi-person';
    }
  };

  return (
    <Layout>
      <div className="container-fluid py-4">
        {/* Welcome Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card bg-gradient-primary text-black border-0 shadow">
              <div className="card-body py-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center">
                      <div className="avatar-lg bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-4" 
                           style={{width: '80px', height: '80px', fontSize: '36px'}}>
                        <i className={getRoleIcon(user?.role)}></i>
                      </div>
                      <div>
                        <h2 className="mb-1">Welcome back, {user?.name}!</h2>
                        <p className="mb-0 opacity-75">
                          <span className={`badge bg-${getRoleColor(user?.role)} me-2`}>
                            {user?.role}
                          </span>
                          Ready to manage your day?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="text-white-50">
                      <i className="bi bi-calendar3 me-1"></i>
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row mb-4">
          {user.role === ROLE_EMPLOYEE && (
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '60px', height: '60px'}}>
                    <i className="bi bi-calendar-check fs-3 text-success"></i>
                  </div>
                  <h3 className="text-success mb-1">{totalLeaves}</h3>
                  <h6 className="text-muted mb-0">Total Leave Days</h6>
                  <small className="text-muted">Approved this year</small>
                </div>
              </div>
            </div>
          )}

          {(user.role === ROLE_MANAGER || user.role === ROLE_ADMIN) && (
            <>
              <div className="col-lg-4 col-md-6 mb-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center">
                    <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                         style={{width: '60px', height: '60px'}}>
                      <i className="bi bi-clock-history fs-3 text-warning"></i>
                    </div>
                    <h3 className="text-warning mb-1">{pendingApprovals}</h3>
                    <h6 className="text-muted mb-0">Pending Approvals</h6>
                    <small className="text-muted">Require your attention</small>
                  </div>
                </div>
              </div>

              <div className="col-lg-8 col-md-6 mb-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-transparent border-0">
                    <h6 className="mb-0">
                      <i className="bi bi-bell me-2 text-primary"></i>
                      Recent Notifications
                    </h6>
                  </div>
                  <div className="card-body">
                    {notifications.length === 0 ? (
                      <div className="text-center text-muted py-3">
                        <i className="bi bi-bell-slash fs-4 d-block mb-2"></i>
                        <p className="mb-0">No new notifications</p>
                      </div>
                    ) : (
                      <div className="list-group list-group-flush">
                        {notifications.slice(0, 3).map((n) => (
                          <div key={n.id} className="list-group-item border-0 px-0">
                            <div className="d-flex align-items-start">
                              <div className="flex-shrink-0">
                                <div className={`bg-${n.read ? 'secondary' : 'primary'} bg-opacity-10 rounded-circle p-2`}>
                                  <i className={`bi bi-${n.read ? 'check' : 'exclamation'}-circle text-${n.read ? 'secondary' : 'primary'}`}></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <p className="mb-1 small">{n.message}</p>
                                {!n.read && <span className="badge bg-danger rounded-pill">New</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0">
                <h5 className="mb-0">
                  <i className="bi bi-lightning me-2 text-primary"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {user.role === ROLE_EMPLOYEE && (
                    <div className="col-lg-3 col-md-6">
                      <button 
                        onClick={() => (window.location.href = "/apply-leave")}
                        className="btn btn-outline-primary w-100 py-3"
                      >
                        <i className="bi bi-plus-circle fs-4 d-block mb-2"></i>
                        Apply for Leave
                      </button>
                    </div>
                  )}
                  
                  <div className="col-lg-3 col-md-6">
                    <button
                      onClick={() =>
                        (window.location.href =
                          user.role === ROLE_EMPLOYEE ? "/leave-requests" : "/leave-approvals")
                      }
                      className="btn btn-outline-success w-100 py-3"
                    >
                      <i className="bi bi-list-check fs-4 d-block mb-2"></i>
                      {user.role === ROLE_EMPLOYEE ? "My Leave Requests" : "View Leave Requests"}
                    </button>
                  </div>

                  {user.role === ROLE_ADMIN && (
                    <div className="col-lg-3 col-md-6">
                      <button 
                        onClick={() => (window.location.href = "/users")}
                        className="btn btn-outline-warning w-100 py-3"
                      >
                        <i className="bi bi-people fs-4 d-block mb-2"></i>
                        Manage Users
                      </button>
                    </div>
                  )}

                  <div className="col-lg-3 col-md-6">
                    <button 
                      onClick={() => (window.location.href = "/profile")}
                      className="btn btn-outline-info w-100 py-3"
                    >
                      <i className="bi bi-person-gear fs-4 d-block mb-2"></i>
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Calendar for Employees */}
        {user.role === ROLE_EMPLOYEE && (
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent border-0">
                  <h5 className="mb-0">
                    <i className="bi bi-calendar3 me-2 text-primary"></i>
                    Leave Calendar
                  </h5>
                </div>
                <div className="card-body">
                  <LeaveCalendar employeeId={user.id} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;