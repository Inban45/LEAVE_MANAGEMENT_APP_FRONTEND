// Enhanced Sidebar Component
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_EMPLOYEE } from "../../utils/constants";

const Sidebar = ({ user, isOpen }) => {
  const navigate = useNavigate();

  if (!user) return null;

  // Base link: Dashboard always visible
  const links = [];

  // Role-based links
  if (user.role === ROLE_EMPLOYEE) {
    links.push(
      { to: "/profile", label: "Profile", icon: "bi-person" },
      { to: "/apply-leave", label: "Apply Leave", icon: "bi-calendar-plus" },
      { to: "/leave-requests", label: "My Leave Requests", icon: "bi-calendar-event" }
    );
  }

  if (user.role === ROLE_MANAGER) {
    links.push(
      { to: "/profile", label: "Profile", icon: "bi-person" },
      { to: "/leave-approvals", label: "Leave Requests", icon: "bi-list-check" }
    );
  }

  if (user.role === ROLE_ADMIN) {
    links.push(
      { to: "/profile", label: "Profile", icon: "bi-person" },
      { to: "/users", label: "Manage Employees", icon: "bi-people" },
      { to: "/all-leaves", label: "Leave Requests", icon: "bi-calendar-event" }
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
    <>
      <aside className={`sidebar bg-dark text-white ${isOpen ? "open" : ""}`} 
             style={{
               width: '280px',
               height: '100vh',
               position: 'fixed',
               top: '60px',
               left: isOpen ? '0' : '-280px',
               transition: 'left 0.3s ease',
               zIndex: 1000,
               overflowY: 'auto'
             }}>
        
        {/* User Profile Section */}
        <div className="p-4 border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <div className={`bg-${getRoleColor(user.role)} rounded-circle d-flex align-items-center justify-content-center me-3`}
                 style={{width: '50px', height: '50px', fontSize: '20px'}}>
              <i className={getRoleIcon(user.role)}></i>
            </div>
            <div>
              <h6 className="mb-1 text-white">{user.name}</h6>
              <span className={`badge bg-${getRoleColor(user.role)} small`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="py-3">
          <ul className="list-unstyled px-3">
            {/* Dashboard at the top */}
            <li className="mb-2">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center p-3 rounded text-decoration-none ${
                    isActive ? 'bg-primary text-white' : 'text-light hover-bg-secondary'
                  }`
                }
                style={({isActive}) => ({
                  backgroundColor: isActive ? '#0d6efd' : 'transparent'
                })}
              >
                <i className="bi bi-speedometer2 me-3 fs-5"></i>
                Dashboard
              </NavLink>
            </li>

            {/* Role-based links */}
            {links.map((link) => (
              <li key={link.to} className="mb-2">
                <NavLink
                  to={link.to}
                  className={({ isActive }) => 
                    `nav-link d-flex align-items-center p-3 rounded text-decoration-none ${
                      isActive ? 'bg-primary text-white' : 'text-light hover-bg-secondary'
                    }`
                  }
                  style={({isActive}) => ({
                    backgroundColor: isActive ? '#0d6efd' : 'transparent'
                  })}
                >
                  <i className={`${link.icon} me-3 fs-5`}></i>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick Stats (for admins/managers) */}
        {(user.role === ROLE_ADMIN || user.role === ROLE_MANAGER) && (
          <div className="px-3 py-3 border-top border-secondary">
            <h6 className="text-muted small mb-3">QUICK STATS</h6>
            <div className="row g-2 text-center">
              <div className="col-6">
                <div className="bg-warning bg-opacity-20 rounded p-2">
                  <i className="bi bi-clock text-warning d-block mb-1"></i>
                  <small className="text-light">Pending</small>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-success bg-opacity-20 rounded p-2">
                  <i className="bi bi-check-circle text-success d-block mb-1"></i>
                  <small className="text-light">Approved</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-auto p-3 border-top border-secondary">
          <button
            onClick={handleLogout}
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
          >
            <i className="bi bi-box-arrow-left me-2"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Custom styles for hover effects */}
      <style jsx>{`
        .hover-bg-secondary:hover {
          background-color: rgba(108, 117, 125, 0.2) !important;
        }
      `}</style>
    </>
  );
};

export default Sidebar;