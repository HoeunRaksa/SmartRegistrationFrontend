import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "https://study.learner-teach.online";
const cleanBase = rawBase.replace(/\/api\/?$|\/+$/g, "");

const API = axios.create({
  baseURL: `${cleanBase}/api`,
  withCredentials: true, // Supported for HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000,
});

// -----------------------------
// ✅ 1) Auth header
// -----------------------------
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -----------------------------
// ✅ 2) Request DEDUPE (same GET same params -> 1 request only)
// -----------------------------
const inFlight = new Map();

const makeKey = (config) => {
  const method = (config.method || "get").toLowerCase();
  const base = config.baseURL || "";
  const url = config.url || "";
  const params = config.params ? JSON.stringify(config.params) : "";
  // NOTE: don’t include data for GET; for POST/PUT we won't dedupe
  return `${method}|${base}${url}|${params}`;
};

// -----------------------------
// ✅ 3) Small GET cache (prevents spam on refresh)
// -----------------------------
const cache = new Map();
// cache TTL in ms (adjust: 3s-10s is usually perfect)
const CACHE_TTL = 5000;

const getCacheKey = (config) => makeKey(config);

API.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase();

  // Only apply to GET
  if (method !== "get") return config;

  // Allow opt-out per request
  if (config.noCache === true) return config;

  // ✅ return cached response instantly
  const cKey = getCacheKey(config);
  const cached = cache.get(cKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    // axios supports adapter override
    config.adapter = async () => ({
      data: cached.data,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      request: null,
    });
    return config;
  }

  // ✅ DEDUPE: if same GET in progress, reuse promise (NO new request)
  const dKey = makeKey(config);
  if (inFlight.has(dKey)) {
    config.adapter = async () => {
      const res = await inFlight.get(dKey);
      return {
        data: res.data,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        config,
        request: res.request,
      };
    };
    return config;
  }

  return config;
});

// Track real network request only
API.interceptors.response.use(
  (response) => {
    const method = (response.config.method || "get").toLowerCase();

    // ✅ Save GET into cache
    if (method === "get" && response.config.noCache !== true) {
      const cKey = getCacheKey(response.config);
      cache.set(cKey, { time: Date.now(), data: response.data });
    }

    // ✅ Clear inflight
    const key = makeKey(response.config);
    inFlight.delete(key);

    return response;
  },
  async (error) => {
    const config = error.config || {};
    const key = makeKey(config);
    inFlight.delete(key);

    // -----------------------------
    // ✅ 4) Handle 401 (Cookie expired/invalid) -> Force Logout
    // -----------------------------
    if (status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // -----------------------------
    // ✅ 5) Optional retry on 429 with backoff (small + safe)
    // -----------------------------
    if (status === 429 && !config.__retry429) {
      config.__retry429 = true;

      // If server sends Retry-After header, respect it
      const retryAfter = Number(error.response.headers?.["retry-after"]);
      const waitMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : 1200;

      await new Promise((r) => setTimeout(r, waitMs));
      return API.request(config);
    }

    return Promise.reject(error);
  }
);

// -----------------------------
// ✅ In-flight tracking for REAL GET requests
// (must be after interceptors above)
// -----------------------------
API.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase();
  if (method !== "get") return config;

  // don't dedupe cached adapters OR already internal requests
  if (config.adapter || config.__skipDedupe) return config;

  const key = makeKey(config);
  const promise = API.request({ ...config, __skipDedupe: true }); // real request
  inFlight.set(key, promise);

  // Replace current request with adapter that waits for the stored promise
  config.adapter = async () => {
    const res = await promise;
    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      config,
      request: res.request,
    };
  };

  return config;
});

export const extractData = (res) => res?.data?.data || res?.data;

export default API;
