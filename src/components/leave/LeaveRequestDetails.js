// Enhanced LeaveRequestDetails Component
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getLeaveRequestById } from "../../api/leaveRequestApi";
import Layout from "../common/Layout";

const LeaveRequestDetails = ({ onClose }) => {
  const { leaveId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeave = async () => {
      if (!leaveId) return;
      setLoading(true);
      setError("");
      try {
        const response = await getLeaveRequestById(leaveId);
        setRequest(response.data);
      } catch (err) {
        console.error("Failed to fetch leave request", err);
        setError("Failed to load leave request details.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeave();
  }, [leaveId]);

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'APPROVED': return 'bg-success';
      case 'REJECTED': return 'bg-danger';
      case 'PENDING': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'APPROVED': return 'bi-check-circle';
      case 'REJECTED': return 'bi-x-circle';
      case 'PENDING': return 'bi-clock-history';
      default: return 'bi-question-circle';
    }
  };

  const getLeaveTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'sick': return 'bi-heart-pulse';
      case 'vacation': return 'bi-sun';
      case 'personal': return 'bi-person';
      default: return 'bi-calendar-event';
    }
  };

  const calculateDuration = () => {
    if (request?.startDate && request?.endDate) {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  if (!leaveId) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="card border-0 shadow">
                <div className="card-body py-5">
                  <i className="bi bi-calendar-x fs-1 text-muted d-block mb-3"></i>
                  <h4 className="text-muted">No Leave Selected</h4>
                  <p className="text-muted">Please select a leave request to view details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading leave details...</p>
              </div>
            )}

            {error && (
              <div className="card border-0 shadow">
                <div className="card-body text-center py-5">
                  <i className="bi bi-exclamation-triangle fs-1 text-danger d-block mb-3"></i>
                  <h4 className="text-danger">Error</h4>
                  <p className="text-muted">{error}</p>
                  <button 
                    onClick={() => window.history.back()} 
                    className="btn btn-primary"
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Go Back
                  </button>
                </div>
              </div>
            )}

            {request && (
              <div className="card border-0 shadow">
                {/* Header */}
                <div className={`card-header text-white py-4 ${
                  request.status === 'APPROVED' ? 'bg-success' : 
                  request.status === 'REJECTED' ? 'bg-danger' : 
                  'bg-warning'
                }`}>
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="d-flex align-items-center">
                        <div className="bg-white bg-opacity-20 rounded-circle p-3 me-3">
                          <i className={`${getLeaveTypeIcon(request.leaveType)} fs-3`}></i>
                        </div>
                        <div>
                          <h3 className="mb-1">Leave Request #{request.id}</h3>
                          <p className="mb-0 opacity-75">
                            {request.leaveType} Leave Application
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-end">
                      <span className={`badge bg-white text-dark fs-6 px-3 py-2`}>
                        <i className={`${getStatusIcon(request.status)} me-1`}></i>
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="card-body p-4">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="info-card p-4 bg-light rounded h-100">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-calendar-event text-primary fs-5"></i>
                          </div>
                          <div>
                            <h6 className="mb-0 text-muted">Leave Type</h6>
                            <div className="fw-semibold fs-5 d-flex align-items-center">
                              <i className={`${getLeaveTypeIcon(request.leaveType)} me-2`}></i>
                              {request.leaveType}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="info-card p-4 bg-light rounded h-100">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-calendar3 text-info fs-5"></i>
                          </div>
                          <div>
                            <h6 className="mb-0 text-muted">Duration</h6>
                            <div className="fw-semibold fs-5">
                              {calculateDuration()} day{calculateDuration() > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="info-card p-4 bg-light rounded h-100">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-calendar-check text-success fs-5"></i>
                          </div>
                          <div>
                            <h6 className="mb-0 text-muted">Start Date</h6>
                            <div className="fw-semibold fs-5">
                              {new Date(request.startDate).toLocaleDateString('en-US', { 
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

                    <div className="col-md-6">
                      <div className="info-card p-4 bg-light rounded h-100">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-calendar-x text-danger fs-5"></i>
                          </div>
                          <div>
                            <h6 className="mb-0 text-muted">End Date</h6>
                            <div className="fw-semibold fs-5">
                              {new Date(request.endDate).toLocaleDateString('en-US', { 
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

                    {/* Status Details */}
                    <div className="col-12">
                      <div className="info-card p-4 bg-light rounded">
                        <div className="d-flex align-items-start mb-3">
                          <div className={`bg-${request.status === 'APPROVED' ? 'success' : 
                                              request.status === 'REJECTED' ? 'danger' : 
                                              'warning'} bg-opacity-10 rounded-circle p-2 me-3`}>
                            <i className={`${getStatusIcon(request.status)} text-${
                              request.status === 'APPROVED' ? 'success' : 
                              request.status === 'REJECTED' ? 'danger' : 
                              'warning'
                            } fs-5`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <h6 className="mb-0 text-muted">Current Status</h6>
                              <span className={`badge ${getStatusBadgeClass(request.status)} px-3 py-2`}>
                                {request.status}
                              </span>
                            </div>
                            <div className="text-muted small">
                              {request.status === 'PENDING' && "Your request is under review"}
                              {request.status === 'APPROVED' && "Your leave request has been approved"}
                              {request.status === 'REJECTED' && "Your leave request has been rejected"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="col-12">
                      <div className="info-card p-4 bg-light rounded">
                        <div className="d-flex align-items-start">
                          <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-chat-text text-secondary fs-5"></i>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-2 text-muted">Reason for Leave</h6>
                            <p className="mb-0 text-dark">
                              {request.reason || 'No specific reason provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    {request.status === "REJECTED" && request.rejectionReason && (
                      <div className="col-12">
                        <div className="alert alert-danger d-flex align-items-start">
                          <i className="bi bi-exclamation-triangle me-3 fs-5"></i>
                          <div>
                            <h6 className="mb-2">Rejection Reason</h6>
                            <p className="mb-0">{request.rejectionReason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="card-footer bg-light text-center py-3">
                  <div className="btn-group" role="group">
                    <button 
                      onClick={() => window.history.back()} 
                      className="btn btn-outline-secondary"
                    >
                      <i className="bi bi-arrow-left me-1"></i>
                      Back to List
                    </button>
                    {onClose && (
                      <button 
                        onClick={onClose}
                        className="btn btn-primary"
                      >
                        <i className="bi bi-x-lg me-1"></i>
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveRequestDetails;