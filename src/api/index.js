import axios from "axios";

/**
 * =========================================================
 *  API CLIENT (BROWSER-SAFE FIX FOR 429)
 *  - Concurrency limit (queue) WITHOUT adapter hacks
 *  - Dedupe in-flight GET requests (same url+params -> same promise)
 *  - Retry 429 with Retry-After / exponential backoff
 *  - Keep 401 redirect logic
 * =========================================================
 */

// ---------------------------
// Config (tune if needed)
// ---------------------------
const MAX_CONCURRENT = 3;         // how many requests run at once
const MAX_RETRIES_429 = 2;        // retry count for 429 (only for GET/HEAD/OPTIONS)
const BASE_DELAY_MS = 800;        // backoff base
const MAX_DELAY_MS = 15000;       // cap

// ---------------------------
// Axios instance
// ---------------------------
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ---------------------------
// Token attach (request interceptor)
// ---------------------------
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

// ---------------------------
// Helpers
// ---------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isIdempotent = (method) => {
  const m = String(method || "get").toLowerCase();
  return m === "get" || m === "head" || m === "options";
};

const stableStringify = (obj) => {
  if (!obj) return "";
  try {
    const keys = Object.keys(obj).sort();
    const out = {};
    for (const k of keys) out[k] = obj[k];
    return JSON.stringify(out);
  } catch {
    return String(obj);
  }
};

const buildKey = (config) => {
  const method = String(config.method || "get").toUpperCase();
  const url = `${config.baseURL || ""}${config.url || ""}`;
  const params = stableStringify(config.params);
  return `${method}::${url}::${params}`;
};

const getRetryAfterMs = (err) => {
  const ra =
    err?.response?.headers?.["retry-after"] ??
    err?.response?.headers?.["Retry-After"];

  if (!ra) return null;

  const seconds = Number(ra);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;

  const dateMs = new Date(ra).getTime();
  if (Number.isFinite(dateMs)) {
    const diff = dateMs - Date.now();
    return diff > 0 ? diff : null;
  }

  return null;
};

// ---------------------------
// 1) Concurrency Queue (no adapter needed)
// ---------------------------
let active = 0;
const waiters = [];

const acquire = async () => {
  if (active < MAX_CONCURRENT) {
    active += 1;
    return;
  }
  await new Promise((resolve) => waiters.push(resolve));
  active += 1;
};

const release = () => {
  active -= 1;
  if (active < 0) active = 0;
  const next = waiters.shift();
  if (next) next();
};

// ---------------------------
// 2) In-flight GET dedupe map
// ---------------------------
const inflight = new Map(); // key -> Promise

// ---------------------------
// 3) Real request runner with 429 retry + 401 handling
// ---------------------------
const rawRequest = API.request.bind(API);

const runWithRetry = async (config) => {
  let attempt = 0;

  while (true) {
    try {
      const res = await rawRequest(config);
      return res;
    } catch (err) {
      const status = err?.response?.status;

      // 401 handling (your original behavior)
      if (status === 401) {
        console.log("❌ 401 Unauthorized - Token expired or invalid");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        throw err;
      }

      // Retry 429 only for idempotent requests (safe)
      if (status === 429 && isIdempotent(config.method) && attempt < MAX_RETRIES_429) {
        attempt += 1;

        const retryAfter = getRetryAfterMs(err);
        const backoff = BASE_DELAY_MS * Math.pow(2, attempt - 1); // 800, 1600, 3200...
        const waitMs = Math.min(retryAfter ?? backoff, MAX_DELAY_MS);

        await sleep(waitMs);
        continue;
      }

      throw err;
    }
  }
};

// ---------------------------
// 4) Wrap API.request to apply queue + dedupe
// ---------------------------
API.request = async function wrappedRequest(config) {
  const method = String(config?.method || "get").toLowerCase();

  // Dedupe GET requests (same key)
  if (method === "get") {
    const key = buildKey(config);

    if (inflight.has(key)) {
      return inflight.get(key);
    }

    const p = (async () => {
      await acquire();
      try {
        return await runWithRetry(config);
      } finally {
        release();
      }
    })();

    inflight.set(key, p);

    try {
      return await p;
    } finally {
      inflight.delete(key);
    }
  }

  // Non-GET: queue only (no dedupe)
  await acquire();
  try {
    return await runWithRetry(config);
  } finally {
    release();
  }
};

// IMPORTANT:
// Axios helpers (get/post/put/delete) call request internally,
// so overriding request is enough for all of them.

export default API;
