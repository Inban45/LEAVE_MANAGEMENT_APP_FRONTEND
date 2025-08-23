// Enhanced Layout Component
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} user={user} />
      
      {/* Sidebar */}
      <Sidebar user={user} isOpen={sidebarOpen} />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 999, top: '60px' }}
        ></div>
      )}
      
      {/* Main Content */}
      <main 
        className="flex-grow-1"
        style={{
          marginTop: '60px',
          transition: 'margin-left 0.3s ease',
          backgroundColor: '#f8f9fa'
        }}
      >
        <div className="container-fluid">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;