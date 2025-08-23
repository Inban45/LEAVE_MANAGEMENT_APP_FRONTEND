
// Enhanced EmployeeDetails Component
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../api/userApi";
import Loader from "../common/Loader";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await getUserById(id);
        setEmployee(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

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

  if (loading) return <Loader />;

  if (!employee) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card border-0 shadow">
              <div className="card-body py-5">
                <i className="bi bi-person-x fs-1 text-muted d-block mb-3"></i>
                <h4 className="text-muted">Employee Not Found</h4>
                <p className="text-muted">The requested employee could not be found.</p>
                <button 
                  onClick={() => window.history.back()} 
                  className="btn btn-primary"
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0">
            {/* Employee Header */}
            <div className="card-header bg-gradient-primary text-white text-center py-4">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <div className="avatar-xl bg-white text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                       style={{width: '120px', height: '120px', fontSize: '60px'}}>
                    {employee.name?.charAt(0)?.toUpperCase() || 'E'}
                  </div>
                </div>
                <div className="col-md-9 text-md-start text-center mt-3 mt-md-0">
                  <h2 className="mb-2">{employee.name}</h2>
                  <p className="mb-2 opacity-75">
                    <i className="bi bi-envelope me-2"></i>
                    {employee.email}
                  </p>
                  <span className={`badge bg-${getRoleColor(employee.role)} fs-6 px-3 py-2`}>
                    <i className={`${getRoleIcon(employee.role)} me-1`}></i>
                    {employee.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Employee Details */}
            <div className="card-body p-4">
              <h5 className="card-title mb-4">
                <i className="bi bi-person-lines-fill me-2 text-primary"></i>
                Employee Details
              </h5>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="info-card p-4 bg-light rounded">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="bi bi-person text-primary fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 text-muted">Full Name</h6>
                        <div className="fw-semibold fs-5">{employee.name}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="info-card p-4 bg-light rounded">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="bi bi-envelope text-success fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 text-muted">Email Address</h6>
                        <div className="fw-semibold">{employee.email}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="info-card p-4 bg-light rounded">
                    <div className="d-flex align-items-center mb-3">
                      <div className={`bg-${getRoleColor(employee.role)} bg-opacity-10 rounded-circle p-2 me-3`}>
                        <i className={`${getRoleIcon(employee.role)} text-${getRoleColor(employee.role)} fs-5`}></i>
                      </div>
                      <div>
                        <h6 className="mb-0 text-muted">Role</h6>
                        <span className={`badge bg-${getRoleColor(employee.role)} fs-6 px-3 py-2`}>
                          {employee.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="info-card p-4 bg-light rounded">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="bi bi-hash text-info fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 text-muted">Employee ID</h6>
                        <div className="fw-semibold">#{employee.id}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card-footer bg-light text-center py-3">
              <div className="btn-group" role="group">
                <button 
                  onClick={() => window.history.back()} 
                  className="btn btn-outline-secondary"
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Back
                </button>
                <button className="btn btn-primary">
                  <i className="bi bi-pencil me-1"></i>
                  Edit Employee
                </button>
                <button className="btn btn-info">
                  <i className="bi bi-calendar-event me-1"></i>
                  View Leave History
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="card shadow border-0 mt-4">
            <div className="card-body text-center py-4">
              <h6 className="text-muted mb-3">
                <i className="bi bi-info-circle me-2"></i>
                Quick Stats
              </h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="p-2">
                    <i className="bi bi-calendar-check text-success fs-4 d-block mb-2"></i>
                    <small className="text-muted">Status</small>
                    <div className="fw-semibold text-success">Active</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-2">
                    <i className="bi bi-clock text-warning fs-4 d-block mb-2"></i>
                    <small className="text-muted">Last Login</small>
                    <div className="fw-semibold">Today</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-2">
                    <i className="bi bi-calendar3 text-primary fs-4 d-block mb-2"></i>
                    <small className="text-muted">Join Date</small>
                    <div className="fw-semibold">2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;