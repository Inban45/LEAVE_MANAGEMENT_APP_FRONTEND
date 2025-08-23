
// src/pages/Leave/ApplyLeavePage.js
import React from "react";
import LeaveRequestForm from "../../components/leave/LeaveRequestForm";
import Layout from "../../components/common/Layout";

const ApplyLeavePage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-4">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{width: '80px', height: '80px'}}>
                  <i className="bi bi-calendar-plus fs-2"></i>
                </div>
                <h2 className="mt-3 mb-2">Apply for Leave</h2>
                <p className="text-muted">Submit your leave request for approval</p>
              </div>
              <LeaveRequestForm />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApplyLeavePage;