export const getToken = () => localStorage.getItem("token");

export const setToken = (token) => localStorage.setItem("token", token);

export const removeToken = () => localStorage.removeItem("token"); // 🔥 add this

export const logout = () => {
  removeToken();
  localStorage.removeItem("user"); // optional if you store user info
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null; // 🔥 add this
};

export const setCurrentUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user)); // 🔥 add this
};

