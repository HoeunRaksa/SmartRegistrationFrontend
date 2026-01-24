// ==============================
// ✅ requestCache.js (ADD THIS FILE)
// src/utils/requestCache.js
// ==============================
const cache = new Map();     // key -> { data, expiry }
const inflight = new Map();  // key -> Promise

const now = () => Date.now();

export async function cachedGet(fn, key, ttlMs = 60_000) {
  const hit = cache.get(key);
  if (hit && hit.expiry > now()) return hit.data;

  const running = inflight.get(key);
  if (running) return running;

  const p = (async () => {
    try {
      const res = await fn();
      cache.set(key, { data: res, expiry: now() + ttlMs });
      return res;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, p);
  return p;
}

export function invalidateCache(prefix = "") {
  for (const key of cache.keys()) {
    if (!prefix || key.startsWith(prefix)) cache.delete(key);
  }
}
