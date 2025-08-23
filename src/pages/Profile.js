import React, { useState, useEffect } from "react";
import { getUserById, updateUser } from "../api/userApi";
import Layout from "../components/common/Layout";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    role: ""
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      getUserById(user.id)
        .then((res) => {
          const data = res.data || res;
          setProfile({
            id: data.id,
            name: data.name || "",
            email: data.email || "",
            role: data.role || ""
          });
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateUser(profile.id, { name: profile.name })
      .then(res => {
        const updatedProfile = {
          ...profile,
          name: res.data?.name || profile.name
        };
        setProfile(updatedProfile);
        localStorage.setItem("user", JSON.stringify(updatedProfile));
        setEditMode(false);
      });
  };

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
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow border-0">
              {/* Profile Header */}
              <div className="card-header bg-gradient-primary text-black text-center py-4">
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <div className="avatar-lg bg-white text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                         style={{width: '100px', height: '100px', fontSize: '48px'}}>
                      <i className="bi bi-person-fill"></i>
                    </div>
                  </div>
                  <div className="col-md-9 text-md-start text-center mt-3 mt-md-0">
                    <h3 className="mb-2">{profile.name || 'User Name'}</h3>
                    <p className="mb-2 opacity-75">
                      <i className="bi bi-envelope me-2"></i>
                      {profile.email}
                    </p>
                    <span className={`badge bg-${getRoleColor(profile.role)} fs-6 px-3 py-2`}>
                      <i className={`${getRoleIcon(profile.role)} me-1`}></i>
                      {profile.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-12">
                    <h5 className="card-title mb-4">
                      <i className="bi bi-person-lines-fill me-2 text-primary"></i>
                      Profile Information
                    </h5>

                    {!editMode ? (
                      /* View Mode */
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="info-item p-3 bg-light rounded">
                            <label className="form-label fw-bold text-muted small mb-1">
                              <i className="bi bi-person me-1"></i>FULL NAME
                            </label>
                            <div className="fw-semibold text-dark fs-5">{profile.name}</div>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="info-item p-3 bg-light rounded">
                            <label className="form-label fw-bold text-muted small mb-1">
                              <i className="bi bi-envelope me-1"></i>EMAIL ADDRESS
                            </label>
                            <div className="fw-semibold text-dark fs-6">{profile.email}</div>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="info-item p-3 bg-light rounded">
                            <label className="form-label fw-bold text-muted small mb-1">
                              <i className="bi bi-briefcase me-1"></i>ROLE
                            </label>
                            <div>
                              <span className={`badge bg-${getRoleColor(profile.role)} fs-6 px-3 py-2`}>
                                <i className={`${getRoleIcon(profile.role)} me-1`}></i>
                                {profile.role}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="info-item p-3 bg-light rounded">
                            <label className="form-label fw-bold text-muted small mb-1">
                              <i className="bi bi-hash me-1"></i>USER ID
                            </label>
                            <div className="fw-semibold text-dark fs-6">#{profile.id}</div>
                          </div>
                        </div>
                        
                        <div className="col-12 text-center mt-4">
                          <button 
                            onClick={() => setEditMode(true)}
                            className="btn btn-primary btn-lg px-4"
                          >
                            <i className="bi bi-pencil me-2"></i>
                            Edit Profile
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Edit Mode */
                      <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="bi bi-person me-1"></i>Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              className="form-control form-control-lg"
                              value={profile.name || ""}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="bi bi-envelope me-1"></i>Email Address
                            </label>
                            <input 
                              type="email" 
                              className="form-control form-control-lg bg-light" 
                              value={profile.email} 
                              disabled 
                            />
                            <div className="form-text">
                              <i className="bi bi-info-circle me-1"></i>
                              Email cannot be changed
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              <i className="bi bi-briefcase me-1"></i>Role
                            </label>
                            <input 
                              type="text" 
                              className="form-control form-control-lg bg-light" 
                              value={profile.role} 
                              disabled 
                            />
                            <div className="form-text">
                              <i className="bi bi-info-circle me-1"></i>
                              Role is managed by administrators
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="d-flex gap-3 justify-content-center mt-4">
                              <button 
                                type="submit" 
                                className="btn btn-success btn-lg px-4"
                              >
                                <i className="bi bi-check-lg me-2"></i>
                                Save Changes
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setEditMode(false)}
                                className="btn btn-outline-secondary btn-lg px-4"
                              >
                                <i className="bi bi-x-lg me-2"></i>
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="card shadow border-0 mt-4">
              <div className="card-body text-center py-4">
                <h6 className="text-muted mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Account Information
                </h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="p-2">
                      <i className="bi bi-calendar-check text-primary fs-4 d-block mb-2"></i>
                      <small className="text-muted">Member Since</small>
                      <div className="fw-semibold">2024</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-2">
                      <i className="bi bi-shield-check text-success fs-4 d-block mb-2"></i>
                      <small className="text-muted">Account Status</small>
                      <div className="fw-semibold text-success">Active</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-2">
                      <i className="bi bi-gear text-secondary fs-4 d-block mb-2"></i>
                      <small className="text-muted">Last Updated</small>
                      <div className="fw-semibold">Today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;