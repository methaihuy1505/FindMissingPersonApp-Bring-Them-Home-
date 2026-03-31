import axios from "axios";

// Ưu tiên lấy link local
// hoặc dùng link Render nếu biến môi trường bị thiếu (trên production)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
