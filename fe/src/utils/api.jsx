import axios from "axios";

const api = axios.create({
  baseURL: "https://findmissingpersonapp-bring-them-home.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
