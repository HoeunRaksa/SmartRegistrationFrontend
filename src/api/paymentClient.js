// ==============================
// api/paymentClient.js (FULL ✅ NO CUT)
// ==============================

import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "https://study.learner-teach.online";
const cleanBase = String(rawBase).replace(/\/+$/, "");

const PaymentAPI = axios.create({
  baseURL: `${cleanBase}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

PaymentAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default PaymentAPI;
