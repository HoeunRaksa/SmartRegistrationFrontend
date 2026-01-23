import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "https://study.learner-teach.online";

// remove trailing /api or /
const cleanBase = rawBase.replace(/\/api\/?$|\/+$/g, "");

const API = axios.create({
  baseURL: `${cleanBase}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
