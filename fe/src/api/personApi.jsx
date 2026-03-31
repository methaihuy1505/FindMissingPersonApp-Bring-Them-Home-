import axiosClient from "./axiosClient";

const personApi = {
  // Public
  getAll: () => axiosClient.get("/missing-persons"),
  getDetail: (id) => axiosClient.get(`/missing-persons/${id}`),

  // Cần Token
  create: (data) => axiosClient.post("/missing-persons", data),
  update: (id, data) => axiosClient.put(`/missing-persons/${id}`, data),
  updateStatus: (id) => axiosClient.put(`/missing-persons/${id}/status`),

  // Admin
  delete: (id) => axiosClient.delete(`/missing-persons/${id}`),

  // Quản lý ảnh lẻ
  addImage: (data) => axiosClient.post("/images", data),
  deleteImage: (id) => axiosClient.delete(`/images/${id}`),
};

export default personApi;
