// Enhanced Loader Component
import React from "react";

const Loader = ({ message = "Loading...", size = "large" }) => {
  const getSpinnerSize = () => {
    switch(size) {
      case 'small': return 'spinner-border-sm';
      case 'large': return '';
      default: return '';
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        {/* Main Spinner */}
        <div className={`spinner-border text-primary mb-3 ${getSpinnerSize()}`} 
             role="status" 
             style={{ width: size === 'small' ? '2rem' : '3rem', 
                      height: size === 'small' ? '2rem' : '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        
        {/* Loading Text */}
        <h5 className="text-muted mb-2">{message}</h5>
        
        {/* Loading Animation Dots */}
        <div className="d-flex justify-content-center align-items-center">
          <div className="loading-dots">
            <span className="dot1 bg-primary rounded-circle me-1 d-inline-block"></span>
            <span className="dot2 bg-primary rounded-circle me-1 d-inline-block"></span>
            <span className="dot3 bg-primary rounded-circle d-inline-block"></span>
          </div>
        </div>

        {/* Optional Progress Indicator */}
        <div className="mt-4 w-100" style={{ maxWidth: '300px' }}>
          <div className="progress" style={{ height: '4px' }}>
            <div className="progress-bar progress-bar-animated bg-primary" 
                 role="progressbar" 
                 style={{ width: '100%' }}>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        .loading-dots {
          animation: loading-dots 1.5s infinite ease-in-out;
        }
        
        .dot1, .dot2, .dot3 {
          width: 8px;
          height: 8px;
          animation: dot-pulse 1.5s infinite ease-in-out;
        }
        
        .dot1 {
          animation-delay: 0s;
        }
        
        .dot2 {
          animation-delay: 0.2s;
        }
        
        .dot3 {
          animation-delay: 0.4s;
        }
        
        @keyframes dot-pulse {
          0%, 60%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          30% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes loading-dots {
          0%, 20% {
            color: transparent;
          }
          40% {
            color: #0d6efd;
          }
          100% {
            color: transparent;
          }
        }
      `}</style>
    </div>
  );
};

// Alternative Card Loader for inline loading
export const CardLoader = ({ message = "Loading..." }) => {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h6 className="text-muted">{message}</h6>
        <div className="mt-3">
          <div className="progress" style={{ height: '2px' }}>
            <div className="progress-bar progress-bar-animated bg-primary" 
                 role="progressbar" 
                 style={{ width: '100%' }}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Table Skeleton Loader
export const TableLoader = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index}>
                <div className="placeholder-glow">
                  <div className="placeholder col-8"></div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex}>
                  <div className="placeholder-glow">
                    <div className="placeholder col-6"></div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Button Loader
export const ButtonLoader = ({ loading = false, children, className = "btn btn-primary", ...props }) => {
  return (
    <button 
      className={`${className} ${loading ? 'disabled' : ''}`} 
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Loader;