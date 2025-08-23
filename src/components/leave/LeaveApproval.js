
// Enhanced LeaveApproval Component
import React, { useEffect, useState } from "react";
import { getAllLeaveRequests, updateLeaveStatus } from "../../api/leaveRequestApi";
import Loader from "../common/Loader";
import Layout from "../common/Layout";

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('PENDING');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await getAllLeaveRequests();
      setLeaves(res.data || []);
    } catch (err) {
      console.error("Failed to fetch leave requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusChange = async (id, status) => {
    setProcessingId(id);
    try {
      await updateLeaveStatus(id, status);
      fetchLeaves(); // refresh list
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'APPROVED': return 'bg-success';
      case 'REJECTED': return 'bg-danger';
      case 'PENDING': return 'bg-warning text-dark';
      default: return 'bg-secondary';
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

  const filteredLeaves = leaves.filter(leave => {
    const matchesStatus = filterStatus === 'ALL' || leave.status === filterStatus;
    const matchesSearch = leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.employeeId?.toString().includes(searchTerm) ||
                         leave.id?.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = leaves.filter(l => l.status === 'PENDING').length;
  const approvedCount = leaves.filter(l => l.status === 'APPROVED').length;
  const rejectedCount = leaves.filter(l => l.status === 'REJECTED').length;

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="container-fluid py-4">
        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm bg-warning bg-opacity-10">
              <div className="card-body text-center">
                <i className="bi bi-clock-history fs-2 text-warning d-block mb-2"></i>
                <h3 className="text-warning mb-1">{pendingCount}</h3>
                <h6 className="text-muted mb-0">Pending Requests</h6>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm bg-success bg-opacity-10">
              <div className="card-body text-center">
                <i className="bi bi-check-circle fs-2 text-success d-block mb-2"></i>
                <h3 className="text-success mb-1">{approvedCount}</h3>
                <h6 className="text-muted mb-0">Approved Requests</h6>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm bg-danger bg-opacity-10">
              <div className="card-body text-center">
                <i className="bi bi-x-circle fs-2 text-danger d-block mb-2"></i>
                <h3 className="text-danger mb-1">{rejectedCount}</h3>
                <h6 className="text-muted mb-0">Rejected Requests</h6>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow border-0">
              <div className="card-header bg-primary text-white">
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <h4 className="mb-0">
                      <i className="bi bi-list-check me-2"></i>
                      Leave Approval Dashboard
                    </h4>
                  </div>
                  <div className="col-md-4">
                    <select 
                      className="form-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="ALL">All Status</option>
                      <option value="PENDING">Pending Only</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                {!filteredLeaves.length ? (
                  <div className="text-center py-5">
                    <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                    <h5 className="text-muted">No leave requests found</h5>
                    <p className="text-muted">
                      {filterStatus === 'PENDING' ? 
                        "No pending requests at the moment" : 
                        "Try adjusting your filters"}
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="fw-bold">#</th>
                          <th className="fw-bold">
                            <i className="bi bi-person me-1"></i>Employee
                          </th>
                          <th className="fw-bold">
                            <i className="bi bi-calendar-event me-1"></i>Type
                          </th>
                          <th className="fw-bold">
                            <i className="bi bi-calendar3 me-1"></i>Duration
                          </th>
                          <th className="fw-bold">
                            <i className="bi bi-chat-text me-1"></i>Reason
                          </th>
                          <th className="fw-bold text-center">
                            <i className="bi bi-flag me-1"></i>Status
                          </th>
                          <th className="fw-bold text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeaves.map((leave) => {
                          const duration = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;
                          return (
                            <tr key={leave.id}>
                              <td>
                                <span className="badge bg-light text-dark">{leave.id}</span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                                       style={{width: '32px', height: '32px', fontSize: '12px'}}>
                                    E
                                  </div>
                                  <div>
                                    <div className="fw-semibold">Employee #{leave.employeeId}</div>
                                    <small className="text-muted">ID: {leave.employeeId}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="bg-info bg-opacity-10 rounded-circle p-2 me-2">
                                    <i className={`${getLeaveTypeIcon(leave.leaveType)} text-info`}></i>
                                  </div>
                                  <span className="fw-semibold">{leave.leaveType}</span>
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <span className="badge bg-secondary px-2 py-1">
                                    {duration} day{duration > 1 ? 's' : ''}
                                  </span>
                                  <div className="small text-muted mt-1">
                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="text-truncate d-inline-block" style={{maxWidth: '150px'}} title={leave.reason}>
                                  {leave.reason || 'No reason provided'}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className={`badge ${getStatusBadgeClass(leave.status)} px-3 py-2`}>
                                  {leave.status}
                                </span>
                              </td>
                              <td className="text-center">
                                {leave.status === "PENDING" && (
                                  <div className="btn-group btn-group-sm">
                                    <button 
                                      onClick={() => handleStatusChange(leave.id, "APPROVED")}
                                      className="btn btn-success"
                                      disabled={processingId === leave.id}
                                    >
                                      {processingId === leave.id ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                      ) : (
                                        <>
                                          <i className="bi bi-check-lg me-1"></i>
                                          Approve
                                        </>
                                      )}
                                    </button>
                                    <button 
                                      onClick={() => handleStatusChange(leave.id, "REJECTED")}
                                      className="btn btn-danger"
                                      disabled={processingId === leave.id}
                                    >
                                      <i className="bi bi-x-lg me-1"></i>
                                      Reject
                                    </button>
                                  </div>
                                )}
                                {leave.status !== "PENDING" && (
                                  <span className="text-muted small">
                                    <i className={`bi bi-${leave.status === 'APPROVED' ? 'check' : 'x'}-circle me-1`}></i>
                                    Processed
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {filteredLeaves.length > 0 && (
                <div className="card-footer bg-light">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Showing {filteredLeaves.length} of {leaves.length} leave requests
                      </small>
                    </div>
                    <div className="col-md-4 text-end">
                      <div className="d-inline-flex gap-2">
                        <span className="badge bg-warning text-dark">Pending: {pendingCount}</span>
                        <span className="badge bg-success">Approved: {approvedCount}</span>
                        <span className="badge bg-danger">Rejected: {rejectedCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveApproval;