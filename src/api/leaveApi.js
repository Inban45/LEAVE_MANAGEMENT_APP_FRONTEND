import api from "../utils/api";

export const getLeavesByUser = (userId) => api.get(`/leaves/user/${userId}`);
export const getAllLeaves = () => api.get("/leaves");
export const getLeaveById = (id) => api.get(`/leaves/${id}`);
export const createLeave = (data) => api.post("/leaves", data);
export const updateLeave = (id, data) => api.put(`/leaves/${id}`, data);
export const deleteLeave = (id) => api.delete(`/leaves/${id}`);
export const getLeaveTypes = () => api.get("/leave-types"); // add this if used in LeaveRequestForm
export const createLeaveRequest = (data) => createLeave(data); // alias if your component uses this
