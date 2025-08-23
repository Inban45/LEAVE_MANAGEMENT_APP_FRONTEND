import api from "../utils/api";

// Fetch all leave requests
export const getAllLeaveRequests = () => api.get("/leaves");

// Fetch a leave request by ID
export const getLeaveRequestById = (id) => api.get(`/leaves/${id}`);

// Create a new leave request
export const createLeaveRequest = (data) => api.post("/leaves", data);

// Update a leave request by ID
export const updateLeaveRequest = (id, data) => api.put(`/leaves/${id}`, data);

// Delete a leave request by ID
export const deleteLeaveRequest = (id) => api.delete(`/leaves/${id}`);

// Fetch leave requests for a specific employee
export const getLeaveRequestsByEmployee = (employeeId) => api.get(`/leaves/employee/${employeeId}`);

export const getLeaveRequestsByUserId = (userId) =>
  api.get(`/leaves/user/${userId}`);

export const updateLeaveStatus = (leaveId, status) =>
  api.put(`/leaves/${leaveId}/status?status=${status}`);

