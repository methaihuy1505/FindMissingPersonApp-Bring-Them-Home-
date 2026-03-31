import axiosClient from "./axiosClient";

const sightingApi = {
  // Lấy manh mối theo hồ sơ
  getByPerson: (personId) => axiosClient.get(`/sightings/${personId}`),
  
  // Gửi manh mối mới
  create: (data) => axiosClient.post("/sightings", data),
  update: (id, data) => axiosClient.put(`/sightings/${id}`, data),
  delete: (id) => axiosClient.delete(`/sightings/${id}`),

  // Báo cáo vi phạm (Reports)
  sendReport: (data) => axiosClient.post("/reports", data),
  getAllReports: () => axiosClient.get("/reports"), // Chỉ Admin
  deleteReport: (id) => axiosClient.delete(`/reports/${id}`), // Chỉ Admin
};

export default sightingApi;