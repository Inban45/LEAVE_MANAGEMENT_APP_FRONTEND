// Enhanced LeaveRequestList Component
import React, { useEffect, useState } from "react";
import { getLeavesByUser } from "../../api/leaveApi"; // make sure this matches your API
import Loader from "../common/Loader";
import { getCurrentUser } from "../../utils/auth";
import Layout from "../common/Layout";

const LeaveRequestList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const currentUser = getCurrentUser();
        const response = await getLeavesByUser(currentUser.id);
        if (!response.data || response.data.length === 0) {
          setLeaves([]); // no leave requests
        } else {
          setLeaves(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch leave requests", error);
        setLeaves([]); // fallback to empty
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

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
                         leave.id?.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="card shadow border-0">
              <div className="card-header bg-primary text-white">
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <h4 className="mb-0">
                      <i className="bi bi-calendar-event me-2"></i>
                      My Leave Requests
                    </h4>
                  </div>
                  <div className="col-md-4">
                    <select 
                      className="form-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="ALL">All Status</option>
                      <option value="PENDING">Pending</option>
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
                        placeholder="Search leaves..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                {filteredLeaves.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-calendar-x fs-1 text-muted d-block mb-3"></i>
                    <h5 className="text-muted">No leave requests found</h5>
                    <p className="text-muted">
                      {leaves.length === 0 ? 
                        "You haven't submitted any leave requests yet." : 
                        "Try adjusting your search criteria."}
                    </p>
                    {leaves.length === 0 && (
                      <button 
                        onClick={() => window.location.href = '/apply-leave'}
                        className="btn btn-primary"
                      >
                        <i className="bi bi-plus-circle me-1"></i>
                        Apply for Leave
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="fw-bold">#</th>
                          <th className="fw-bold">
                            <i className="bi bi-calendar-event me-1"></i>Type
                          </th>
                          <th className="fw-bold">
                            <i className="bi bi-calendar-check me-1"></i>Start Date
                          </th>
                          <th className="fw-bold">
                            <i className="bi bi-calendar-x me-1"></i>End Date
                          </th>
                          <th className="fw-bold">
                            <i className="bi bi-chat-text me-1"></i>Reason
                          </th>
                          <th className="fw-bold">
                            <i className="bi bi-flag me-1"></i>Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeaves.map((leave) => (
                          <tr key={leave.id}>
                            <td>
                              <span className="badge bg-light text-dark">{leave.id}</span>
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
                              <div className="d-flex align-items-center">
                                <i className="bi bi-calendar-check text-success me-1"></i>
                                {new Date(leave.startDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-calendar-x text-danger me-1"></i>
                                {new Date(leave.endDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td>
                              <span className="text-truncate d-inline-block" style={{maxWidth: '200px'}} title={leave.reason}>
                                {leave.reason || 'No reason provided'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(leave.status)} px-3 py-2`}>
                                <i className={`bi bi-${leave.status === 'APPROVED' ? 'check-circle' : 
                                               leave.status === 'REJECTED' ? 'x-circle' : 'clock'} me-1`}></i>
                                {leave.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {filteredLeaves.length > 0 && (
                <div className="card-footer bg-light">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Showing {filteredLeaves.length} of {leaves.length} leave requests
                      </small>
                    </div>
                    <div className="col-md-6 text-end">
                      <div className="d-inline-flex gap-2">
                        <span className="badge bg-success">Approved</span>
                        <span className="badge bg-warning text-dark">Pending</span>
                        <span className="badge bg-danger">Rejected</span>
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

export default LeaveRequestList;
