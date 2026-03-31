import axiosClient from "./axiosClient";

const userApi = {
  getAllUsers: () => axiosClient.get("/user"),
  createUser: (data) => axiosClient.post("/user", data),
  updateUser: (id, data) => axiosClient.put(`/user/${id}`, data),
  deleteUser: (id) => axiosClient.delete(`/user/${id}`),
};

export default userApi;