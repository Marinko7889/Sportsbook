export const getToken = () => localStorage.getItem("token");
export const getUserName = () => localStorage.getItem("userName");
export const getUserId = () => localStorage.getItem("userId");
export const logout = () => localStorage.clear();
