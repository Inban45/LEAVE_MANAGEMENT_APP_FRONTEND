// Enhanced EmployeeList Component
import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../api/userApi";
import Loader from "../common/Loader";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getAllUsers();
        setEmployees(res.data.filter(user => user.role === "EMPLOYEE"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow border-0">
            <div className="card-header bg-success text-white">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h4 className="mb-0">
                    <i className="bi bi-people-fill me-2"></i>
                    Employee Directory
                  </h4>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              {!filteredEmployees.length ? (
                <div className="text-center py-5">
                  <i className="bi bi-people fs-1 text-muted d-block mb-3"></i>
                  <h5 className="text-muted">No employees found</h5>
                  <p className="text-muted">Try adjusting your search criteria</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-bold">
                          <i className="bi bi-person me-1"></i>Name
                        </th>
                        <th className="fw-bold">
                          <i className="bi bi-envelope me-1"></i>Email
                        </th>
                        <th className="fw-bold">
                          <i className="bi bi-briefcase me-1"></i>Role
                        </th>
                        <th className="fw-bold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map(emp => (
                        <tr key={emp.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                                   style={{width: '40px', height: '40px', fontSize: '16px'}}>
                                {emp.name?.charAt(0)?.toUpperCase() || 'E'}
                              </div>
                              <div>
                                <div className="fw-semibold">{emp.name}</div>
                                <small className="text-muted">ID: #{emp.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-muted">
                              <i className="bi bi-envelope-fill me-1"></i>
                              {emp.email}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-success px-3 py-2">
                              <i className="bi bi-person me-1"></i>
                              {emp.role}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle me-1"></i>
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {filteredEmployees.length > 0 && (
              <div className="card-footer bg-light">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Showing {filteredEmployees.length} of {employees.length} employees
                    </small>
                  </div>
                  <div className="col-md-6 text-end">
                    <small className="text-muted">
                      <span className="badge bg-success me-1">Active</span>
                      All employees are currently active
                    </small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
