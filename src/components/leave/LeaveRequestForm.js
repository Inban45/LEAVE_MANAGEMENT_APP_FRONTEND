// Enhanced LeaveRequestForm Component
import React, { useState, useEffect } from "react";
import { createLeaveRequest } from "../../api/leaveRequestApi";
import Layout from "../common/Layout";
import { useNavigate } from "react-router-dom";

const LeaveRequestForm = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const leaveTypes = [
    { value: "Sick", icon: "bi-heart-pulse", color: "danger" },
    { value: "Vacation", icon: "bi-sun", color: "warning" },
    { value: "Personal", icon: "bi-person", color: "info" }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createLeaveRequest({ ...form, employeeId: user.id, status: "PENDING" });
      setSuccess("Leave request submitted successfully.");
      setForm({ leaveType: "", startDate: "", endDate: "", reason: "" });

      // ✅ Navigate after showing success for 2-3 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear success/error after 3 seconds (only clears message, not navigation)
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const calculateDaysDifference = () => {
    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="card shadow border-0">
      <div className="card-header bg-primary text-white text-center py-4">
        <h4 className="mb-0">
          <i className="bi bi-calendar-plus me-2"></i>
          Leave Application Form
        </h4>
        <p className="mb-0 opacity-75">Fill out the form below to request leave</p>
      </div>
      
      <div className="card-body p-4">
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
            <i className="bi bi-check-circle me-2"></i>
            <div>{success}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Leave Type Selection */}
            <div className="col-12">
              <label className="form-label fw-bold">
                <i className="bi bi-calendar-event me-1"></i>Leave Type
              </label>
              <div className="row g-3">
                {leaveTypes.map((type) => (
                  <div key={type.value} className="col-md-4">
                    <input
                      type="radio"
                      className="btn-check"
                      name="leaveType"
                      id={`leave-${type.value}`}
                      value={type.value}
                      checked={form.leaveType === type.value}
                      onChange={handleChange}
                      required
                    />
                    <label 
                      className={`btn btn-outline-${type.color} w-100 py-3`} 
                      htmlFor={`leave-${type.value}`}
                    >
                      <i className={`${type.icon} fs-4 d-block mb-2`}></i>
                      {type.value}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                <i className="bi bi-calendar-check me-1"></i>Start Date
              </label>
              <input
                type="date"
                name="startDate"
                className="form-control form-control-lg"
                value={form.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                <i className="bi bi-calendar-x me-1"></i>End Date
              </label>
              <input
                type="date"
                name="endDate"
                className="form-control form-control-lg"
                value={form.endDate}
                onChange={handleChange}
                min={form.startDate || new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Duration Display */}
            {form.startDate && form.endDate && (
              <div className="col-12">
                <div className="alert alert-info d-flex align-items-center">
                  <i className="bi bi-info-circle me-2"></i>
                  <div>
                    <strong>Duration:</strong> {calculateDaysDifference()} day{calculateDaysDifference() > 1 ? 's' : ''}
                    <small className="d-block text-muted">
                      From {new Date(form.startDate).toLocaleDateString()} to {new Date(form.endDate).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Reason */}
            <div className="col-12">
              <label className="form-label fw-bold">
                <i className="bi bi-chat-text me-1"></i>Reason (Optional)
              </label>
              <textarea
                name="reason"
                className="form-control"
                rows="4"
                placeholder="Please provide a brief reason for your leave request..."
                value={form.reason}
                onChange={handleChange}
              />
              <div className="form-text">
                <i className="bi bi-info-circle me-1"></i>
                A detailed reason helps in faster approval
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-12 text-center">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg px-5"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Submit Leave Request
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Footer with Guidelines */}
      <div className="card-footer bg-light">
        <div className="row text-center text-muted small">
          <div className="col-md-4">
            <i className="bi bi-clock-history text-warning d-block mb-1"></i>
            <strong>Processing Time</strong>
            <div>Usually within 24-48 hours</div>
          </div>
          <div className="col-md-4">
            <i className="bi bi-calendar-week text-info d-block mb-1"></i>
            <strong>Advance Notice</strong>
            <div>Submit at least 3 days prior</div>
          </div>
          <div className="col-md-4">
            <i className="bi bi-bell text-success d-block mb-1"></i>
            <strong>Notification</strong>
            <div>You'll be notified of status changes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestForm;
