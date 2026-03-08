import axios from "axios";

// Thiết lập cầu nối đến địa chỉ Backend
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động đính kèm token bảo mật vào mọi yêu cầu gửi đi
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("af_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
