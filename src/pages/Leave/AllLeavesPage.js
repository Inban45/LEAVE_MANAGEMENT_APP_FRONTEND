

// Enhanced AllLeavesPage
import React, { useEffect, useState } from "react";
import { getAllLeaveRequests } from "../../api/leaveRequestApi";
import Loader from "../../components/common/Loader";
import Layout from "../../components/common/Layout";

const AllLeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    getAllLeaveRequests()
      .then((res) => setLeaves(res.data || []))
      .catch((err) => console.error("Failed to fetch leave requests", err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'APPROVED': return 'bg-success';
      case 'REJECTED': return 'bg-danger';
      case 'PENDING': return 'bg-warning text-dark';
      default: return 'bg-secondary';
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
                      All Leave Requests
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
                {!filteredLeaves.length ? (
                  <div className="text-center py-5">
                    <i className="bi bi-calendar-x fs-1 text-muted d-block mb-3"></i>
                    <h5 className="text-muted">No leave requests found</h5>
                    <p className="text-muted">Try adjusting your filters</p>
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
                            <i className="bi bi-flag me-1"></i>Status
                          </th>
                          <th className="fw-bold">
                            <i className="bi bi-chat-text me-1"></i>Reason
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
                              <span className="badge bg-info text-white px-3 py-2">
                                <i className="bi bi-calendar-event me-1"></i>
                                {leave.leaveType}
                              </span>
                            </td>
                            <td>
                              <i className="bi bi-calendar-check text-success me-1"></i>
                              {new Date(leave.startDate).toLocaleDateString()}
                            </td>
                            <td>
                              <i className="bi bi-calendar-x text-danger me-1"></i>
                              {new Date(leave.endDate).toLocaleDateString()}
                            </td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(leave.status)} px-3 py-2`}>
                                {leave.status}
                              </span>
                            </td>
                            <td>
                              <span className="text-truncate d-inline-block" style={{maxWidth: '200px'}} title={leave.reason}>
                                {leave.reason || 'No reason provided'}
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
                <div className="card-footer bg-light text-muted">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <small>
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

export default AllLeavesPage;