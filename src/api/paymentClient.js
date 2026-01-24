// ==============================
// api/paymentClient.js (FULL ✅ NO CUT)
// ==============================

import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "https://study.learner-teach.online";
const cleanBase = String(rawBase).replace(/\/api\/?$|\/+$/g, "");

// --- tiny helpers ---
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const stableStringify = (obj) => {
  if (!obj || typeof obj !== "object") return String(obj ?? "");
  const keys = Object.keys(obj).sort();
  const out = {};
  for (const k of keys) out[k] = obj[k];
  return JSON.stringify(out);
};

const buildKey = (config) => {
  const method = (config.method || "get").toUpperCase();
  const url = config.baseURL ? `${config.baseURL}${config.url || ""}` : (config.url || "");
  const params = stableStringify(config.params || {});
  const data = typeof config.data === "string" ? config.data : stableStringify(config.data || {});
  return `${method}::${url}::params=${params}::data=${data}`;
};

// in-flight + cache
const inflight = new Map(); // key -> Promise
const cache = new Map();    // key -> { t, v }
const DEFAULT_TTL = 5000;

const PaymentAPI = axios.create({
  baseURL: `${cleanBase}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// attach token
PaymentAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // defaults
  config.__retryCount = config.__retryCount ?? 0;
  config.__dedupe = config.__dedupe ?? true;
  config.__cacheTtl = config.__cacheTtl ?? DEFAULT_TTL;

  return config;
});

// dedupe + cache for GET only
PaymentAPI.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase();
  if (method !== "get" || config.__dedupe === false) return config;

  const key = buildKey(config);

  // cache hit
  const ttl = Number(config.__cacheTtl || 0);
  if (ttl > 0) {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.t < ttl) {
      config.adapter = async () => ({
        ...hit.v,
        config,
        request: undefined,
        headers: hit.v.headers || {},
      });
      return config;
    }
  }

  // inflight dedupe
  if (inflight.has(key)) {
    config.adapter = () => inflight.get(key);
    return config;
  }

  const originalAdapter = config.adapter || axios.defaults.adapter;

  config.adapter = async (cfg) => {
    const p = originalAdapter(cfg)
      .then((res) => {
        const ttl2 = Number(cfg.__cacheTtl || 0);
        if (ttl2 > 0) cache.set(key, { t: Date.now(), v: res });
        return res;
      })
      .finally(() => {
        inflight.delete(key);
      });

    inflight.set(key, p);
    return p;
  };

  return config;
});

// retry once on 429 (Too Many Requests)
PaymentAPI.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const config = error?.config;

    if (!config) throw error;

    if (status === 429 && (config.__retryCount ?? 0) < 1) {
      config.__retryCount = (config.__retryCount ?? 0) + 1;

      const retryAfterHeader =
        error?.response?.headers?.["retry-after"] ??
        error?.response?.headers?.["Retry-After"];

      let waitMs = 1000;
      const retryAfter = Number(retryAfterHeader);
      if (!Number.isNaN(retryAfter) && retryAfter > 0) waitMs = retryAfter * 1000;

      await sleep(waitMs);
      return PaymentAPI.request(config);
    }

    throw error;
  }
);

export default PaymentAPI;
