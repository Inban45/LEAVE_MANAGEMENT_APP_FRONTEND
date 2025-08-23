import { ROLES } from "./constants";

// Check if user has a specific role
export const hasRole = (user, role) => {
  if (!user || !user.role) return false;
  return user.role === role;
};

// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Check if leave status matches
export const isStatus = (leave, status) => {
  if (!leave || !leave.status) return false;
  return leave.status === status;
};

// Example: Filter leaves by status
export const filterLeavesByStatus = (leaves, status) => {
  if (!leaves) return [];
  return leaves.filter((leave) => leave.status === status);
};

// Example: Map role to display text
export const getRoleName = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "Admin";
    case ROLES.MANAGER:
      return "Manager";
    case ROLES.EMPLOYEE:
      return "Employee";
    default:
      return "Unknown";
  }
};
