import api from "../utils/api";

export const getAllUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post("/users", data);
export const updateUser = (id, data) => {
  const payload = {
    name: data.name,
    email: data.email,
    role: data.role
  };
  return api.put(`/users/${id}`, payload);
};

export const deleteUser = (id) => api.delete(`/users/${id}`);
