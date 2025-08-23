import React from "react";
import { useLocation } from "react-router-dom";

const Header = ({ onMenuClick, user }) => {
  const location = useLocation();
  
  // hide user + menu on login/register pages
  const hideHeaderContent =
    location.pathname === "/login" || location.pathname === "/register";

  const getRoleColor = (role) => {
    switch(role) {
      case 'ADMIN': return 'danger';
      case 'MANAGER': return 'warning';
      case 'EMPLOYEE': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
      <div className="container-fluid">
        {/* Hamburger Menu Button */}
        {!hideHeaderContent && (
          <button
            onClick={onMenuClick}
            className="btn btn-outline-light me-3 d-flex align-items-center justify-content-center"
            style={{width: '40px', height: '40px'}}
            type="button"
          >
            <i className="bi bi-list fs-5"></i>
          </button>
        )}

        {/* Brand/Logo */}
        <a className="navbar-brand d-flex align-items-center fw-bold" href="/">
          <div className="" 
               style={{width: '35px', height: '35px'}}>
            <i className="bi bi-calendar-check text-white"></i>
          </div>
          <span className="d-none d-md-inline">Leave Management System</span>
          <span className="d-md-none">LMS</span>
        </a>

        {/* User Info */}
        {!hideHeaderContent && user && (
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center text-light" 
                 href="#" 
                 role="button" 
                 data-bs-toggle="dropdown">
                <div className={`bg-${getRoleColor(user.role)} rounded-circle d-flex align-items-center justify-content-center me-2`}
                     style={{width: '32px', height: '32px', fontSize: '14px'}}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="d-none d-md-block text-end">
                  <div className="fw-semibold">{user.name}</div>
                  <small className="opacity-75">{user.role}</small>
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="/profile">
                    <i className="bi bi-person me-2"></i>Profile
                  </a>
                </li>
                <li><hr className="dropdown-divider"/></li>
                <li>
                  <a className="dropdown-item text-danger" 
                     href="#" 
                     onClick={() => {
                       localStorage.removeItem("token");
                       localStorage.removeItem("user");
                       window.location.href = "/login";
                     }}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;