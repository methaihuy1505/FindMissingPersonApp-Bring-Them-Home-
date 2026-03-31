import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/login", data),
  register: (data) => axiosClient.post("/register", data),
  getMe: () => axiosClient.get("/me"),
  logout: () => axiosClient.post("/logout"),
};

export default authApi;