import API from "./index"; // ✅ shared axios instance with token

// ==============================
// STUDENT API  ✅ FULL FIX (PREVENT 429) ✅ NO ENDPOINT CHANGE
// ==============================

/**
 * Helper function to safely extract data from API response
 * Handles both { data: [...] } and { success: true, data: [...] } formats
 */
const extractData = (response) => {
  if (response?.data?.data !== undefined) return response.data.data;
  if (response?.data !== undefined) return response.data;
  return null;
};

// ------------------------------
// ✅ Anti-429 layer (dedupe + cache + retry)
// ------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const inflight = new Map(); // key -> Promise
const cache = new Map(); // key -> { time, value }
const CACHE_TTL_MS = 10_000; // 10s to survive refresh + multi pages

const makeKey = (url) => url; // fetchStudents has no params; keep simple

const getOnce = async (url, requestFn) => {
  const key = makeKey(url);

  // ✅ 1) short cache
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return cached.value;
  }

  // ✅ 2) in-flight dedupe
  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const promise = (async () => {
    let attempt = 0;

    while (true) {
      try {
        const res = await requestFn();
        cache.set(key, { time: Date.now(), value: res });
        return res;
      } catch (err) {
        const status = err?.response?.status;

        // ✅ retry only on 429, max 3 retries
        if (status === 429 && attempt < 3) {
          attempt += 1;

          const retryAfter = err?.response?.headers?.["retry-after"];
          const waitMs = retryAfter
            ? Math.min(Number(retryAfter) * 1000, 10_000)
            : 800 * attempt; // 800ms, 1600ms, 2400ms

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

// ------------------------------
// API FUNCTIONS
// ------------------------------

// GET: Fetch all students (admin / staff) ✅ dedupe+cache+retry 429
export const fetchStudents = async () => {
  try {
    const response = await getOnce("/students", () => API.get("/students"));
    const data = extractData(response);

    // Ensure we always return an array
    return {
      data: {
        data: Array.isArray(data) ? data : [],
      },
    };
  } catch (error) {
    console.error("fetchStudents error:", error);
    throw error;
  }
};

// GET: Fetch single student (no endpoint change)
export const fetchStudent = async (id) => {
  try {
    const response = await API.get(`/students/${id}`);
    return response;
  } catch (error) {
    console.error(`fetchStudent(${id}) error:`, error);
    throw error;
  }
};

// POST: Create student
export const createStudent = async (data) => {
  try {
    const response = await API.post("/students", data);
    // ✅ clear cache so next fetchStudents gets fresh list
    cache.delete("/students");
    return response;
  } catch (error) {
    console.error("createStudent error:", error);
    throw error;
  }
};

// PUT: Update student
export const updateStudent = async (id, data) => {
  try {
    const response = await API.put(`/students/${id}`, data);
    // ✅ clear cache so next fetchStudents gets fresh list
    cache.delete("/students");
    return response;
  } catch (error) {
    console.error(`updateStudent(${id}) error:`, error);
    throw error;
  }
};

// DELETE: Delete student
export const deleteStudent = async (id) => {
  try {
    const response = await API.delete(`/students/${id}`);
    // ✅ clear cache so next fetchStudents gets fresh list
    cache.delete("/students");
    return response;
  } catch (error) {
    console.error(`deleteStudent(${id}) error:`, error);
    throw error;
  }
};

// POST: Reset student password (Admin/Staff only)
export const resetStudentPassword = async (id, newPassword) => {
  try {
    const response = await API.post(`/students/${id}/reset-password`, {
      new_password: newPassword,
      new_password_confirmation: newPassword,
    });
    return response;
  } catch (error) {
    console.error(`resetStudentPassword(${id}) error:`, error);
    throw error;
  }
};

export const fetchStudentProfile = async () => {
  return await API.get("/student/profile");
};

// ✅ Optional: allow manual clear from UI after bulk actions
export const clearStudentsCache = () => {
  cache.delete("/students");
};

export const searchStudents = (params) => {
  return API.get("/admin/students/search", {
    params,
  });
};