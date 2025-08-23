import api from "../utils/api";

export const getBalancesByUser = async (userId) => {
  const response = await api.get(`/leave-balances/user/${userId}`);
  return response.data;  // <-- return only the data
};

export const getLeaveBalancesByUserId = (userId) => getBalancesByUser(userId); // alias

export const createBalance = async (data) => {
  const response = await api.post("/leave-balances", data);
  return response.data;
};

export const updateBalance = async (id, data) => {
  const response = await api.put(`/leave-balances/${id}`, data);
  return response.data;
};

export const deleteBalance = async (id) => {
  const response = await api.delete(`/leave-balances/${id}`);
  return response.data;
};

export const getBalanceById = async (id) => {
  const response = await api.get(`/leave-balances/${id}`);
  return response.data;
};
