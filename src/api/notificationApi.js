// src/api/notificationApi.js
import api from "../utils/api";

export const getNotificationsByUserId = (userId) => {
  return api.get(`/notifications/user/${userId}`);
};

export const markNotificationAsRead = (notificationId) => {
  return api.put(`/notifications/${notificationId}/read`);
};
