
// Enhanced Login Component
import React, { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await api.post("/auth/login", { username, password });
      console.log(response);
      localStorage.setItem("token", response.data.token);
      // Store full user details instead of just username
      const user = {
        id: response.data.id,
        name: response.data.username,
        email: response.data.email,
        role: response.data.role
      };
      localStorage.setItem("user", JSON.stringify(user));
      console.log("logged in");
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
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
                  <i className="bi bi-box-arrow-in-right fs-1"></i>
                </div>
                <h3 className="mb-0">Welcome Back</h3>
                <p className="mb-0 opacity-75">Sign in to your account</p>
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
                      <i className="bi bi-envelope me-1"></i>Email Address
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter your email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      <i className="bi bi-lock me-1"></i>Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-muted">
                    Don't have an account?{" "}
                    <span
                      className="text-primary fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/register")}
                    >
                      <i className="bi bi-person-plus me-1"></i>
                      Register here
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <div className="row text-muted small">
                <div className="col-4">
                  <i className="bi bi-shield-check fs-4 d-block mb-1"></i>
                  Secure
                </div>
                <div className="col-4">
                  <i className="bi bi-lightning fs-4 d-block mb-1"></i>
                  Fast
                </div>
                <div className="col-4">
                  <i className="bi bi-people fs-4 d-block mb-1"></i>
                  Trusted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;