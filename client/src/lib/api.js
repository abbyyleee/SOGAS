// src/lib/api.js
import axios from "axios";

let base = import.meta.env.VITE_API_BASE || "";
if (base.endsWith("/")) base = base.slice(0, -1);

const api = axios.create({
  baseURL: `${base}/api`,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
