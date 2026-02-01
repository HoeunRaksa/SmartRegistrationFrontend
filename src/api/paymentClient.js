// ==============================
// api/paymentClient.js (FIXED ✅)
// ==============================

import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "https://study.learner-teach.online";
const cleanBase = String(rawBase).replace(/\/api\/?$|\/+$/g, "");

const PaymentAPI = axios.create({
  baseURL: `${cleanBase}/api`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token
PaymentAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simple 429 Retry
PaymentAPI.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const config = error?.config;

    if (status === 429 && config && !config._retry) {
      config._retry = true;
      const retryAfter = error?.response?.headers?.["retry-after"];
      const waitMs = retryAfter ? Number(retryAfter) * 1000 : 1500;

      await new Promise(r => setTimeout(r, waitMs));
      return PaymentAPI(config);
    }
    throw error;
  }
);

export default PaymentAPI;
