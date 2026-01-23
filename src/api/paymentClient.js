import axios from "axios";

const MAX_CONCURRENT = 2;
const MAX_RETRIES_429 = 2;
const BASE_DELAY_MS = 800;
const MAX_DELAY_MS = 15000;

const PaymentAPI = axios.create({
  baseURL: "https://study.learner-teach.online/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isIdempotent = (method) => {
  const m = String(method || "get").toLowerCase();
  return m === "get" || m === "head" || m === "options";
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

// token attach
PaymentAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

const rawRequest = PaymentAPI.request.bind(PaymentAPI);

const runWithRetry = async (config) => {
  let attempt = 0;
  while (true) {
    try {
      return await rawRequest(config);
    } catch (err) {
      const status = err?.response?.status;

      if (status === 429 && isIdempotent(config.method) && attempt < MAX_RETRIES_429) {
        attempt += 1;
        const retryAfter = getRetryAfterMs(err);
        const backoff = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        const waitMs = Math.min(retryAfter ?? backoff, MAX_DELAY_MS);
        await sleep(waitMs);
        continue;
      }

      throw err;
    }
  }
};

PaymentAPI.request = async function wrappedRequest(config) {
  await acquire();
  try {
    return await runWithRetry(config);
  } finally {
    release();
  }
};

export default PaymentAPI;
