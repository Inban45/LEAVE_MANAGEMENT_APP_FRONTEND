// Enhanced Register Component
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/authApi";
import { setToken } from "../../utils/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE", // default role
    username: "", // optional, backend ignores if using email
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await register(formData);
      setToken(response.data.message); // JWT token
      navigate("/login"); // redirect after register
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card shadow border-0">
              <div className="card-header bg-primary text-white text-center py-4">
                <div className="mb-3">
                  <i className="bi bi-person-plus-fill fs-1"></i>
                </div>
                <h3 className="mb-0">Create Account</h3>
                <p className="mb-0 opacity-75">Join our Leave Management System</p>
              </div>
              
              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <i className="bi bi-person me-1"></i>Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <i className="bi bi-envelope me-1"></i>Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <i className="bi bi-lock me-1"></i>Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      <i className="bi bi-briefcase me-1"></i>Role
                    </label>
                    <select 
                      name="role" 
                      className="form-select form-select-lg"
                      value={formData.role} 
                      onChange={handleChange}
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-muted">
                    Already have an account?{" "}
                    <span
                      className="text-primary fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/login")}
                    >
                      <i className="bi bi-box-arrow-in-right me-1"></i>
                      Sign in here
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-muted small">
                <i className="bi bi-shield-check me-1"></i>
                Your information is secure and protected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
