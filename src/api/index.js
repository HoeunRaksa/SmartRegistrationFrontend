// ==============================
// api/index.js (FULL FIX ✅ NO CUT)
// - Safe baseURL
// - Adds Bearer token like PaymentAPI
// - Better error handling
// ==============================

import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "https://study.learner-teach.online";

// ensure: no trailing slash
const cleanBase = String(rawBase).replace(/\/+$/, "");

// final API baseURL => https://domain/api
const API = axios.create({
  baseURL: `${cleanBase}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ ADD TOKEN (THIS IS THE MAIN FIX)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ OPTIONAL: handle common auth failures cleanly
API.interceptors.response.use(
  (res) => res,
  (error) => {
    // If backend returns 401/419, token is invalid/expired
    const status = error?.response?.status;
    if (status === 401 || status === 419) {
      // keep your app behavior; only clear token (no redirect here)
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default API;
