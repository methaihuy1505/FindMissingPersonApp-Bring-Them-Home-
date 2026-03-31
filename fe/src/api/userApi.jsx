import axiosClient from "./axiosClient";

const userApi = {
  updateProfile: (id, data) => axiosClient.put(`/user/${id}`, data),
  updatePassword: (id, data) => axiosClient.put(`/user/${id}/password`, data),
  getAllUsers: () => axiosClient.get("/user"),
  createUser: (data) => axiosClient.post("/user", data),
  updateUser: (id, data) => axiosClient.put(`/user/${id}`, data),
  deleteUser: (id) => axiosClient.delete(`/user/${id}`),
};

export default userApi;
