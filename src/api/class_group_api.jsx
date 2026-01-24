import API from "./index";

// ==============================
// ANTI-429 LAYER (dedupe + cache + retry)
// ==============================
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const inflight = new Map();
const cache = new Map();
const CACHE_TTL_MS = 10_000;

const makeKey = (url, params = {}) =>
  `${url}?${JSON.stringify(params || {})}`;

const getOnce = async (url, params = {}) => {
  const key = makeKey(url, params);

  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return cached.value;
  }

  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const promise = (async () => {
    let attempt = 0;
    while (true) {
      try {
        const res = await API.get(url, { params });
        cache.set(key, { time: Date.now(), value: res });
        return res;
      } catch (err) {
        if (err?.response?.status === 429 && attempt < 3) {
          attempt += 1;
          const retryAfter = err?.response?.headers?.["retry-after"];
          const waitMs = retryAfter
            ? Math.min(Number(retryAfter) * 1000, 10_000)
            : 800 * attempt;
          await sleep(waitMs);
          continue;
        }
        throw err;
      }
    }
  })();

  inflight.set(key, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(key);
  }
};

// ==============================
// DATA HELPER
// ==============================
const extractData = (res) => {
  if (res?.data?.data !== undefined) return res.data.data;
  if (res?.data !== undefined) return res.data;
  return null;
};

// ==============================
// CLASS GROUP CRUD
// ==============================
export const fetchAllClassGroups = async (params = {}) => {
  const res = await getOnce("/class-groups", params);
  const data = extractData(res);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

export const fetchClassGroupsByMajor = async (majorId, extraParams = {}) => {
  const res = await getOnce("/class-groups", {
    major_id: majorId,
    ...extraParams,
  });
  const data = extractData(res);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

export const createClassGroup = async (payload) => {
  const res = await API.post("/class-groups", payload);
  cache.clear();
  return res;
};

export const updateClassGroup = async (id, payload) => {
  const res = await API.put(`/class-groups/${id}`, payload);
  cache.clear();
  return res;
};

export const deleteClassGroup = async (id) => {
  const res = await API.delete(`/class-groups/${id}`);
  cache.clear();
  return res;
};

// ==============================
// CLASS GROUP STUDENTS
// ==============================
export const fetchClassGroupStudents = async (classGroupId, params = {}) => {
  return await getOnce(`/class-groups/${classGroupId}/students`, params);
};

// ==============================
// STUDENT ↔ CLASS GROUP
// ==============================
export const fetchStudentClassGroup = async (studentId, params = {}) => {
  return await getOnce(`/students/${studentId}/class-group`, params);
};

export const assignStudentClassGroupManual = async (studentId, payload) => {
  const res = await API.post(
    `/students/${studentId}/class-group/assign`,
    payload
  );
  cache.clear();
  return res;
};

export const assignStudentClassGroupAuto = async (studentId, payload) => {
  const res = await API.post(
    `/students/${studentId}/class-group/auto`,
    payload
  );
  cache.clear();
  return res;
};
