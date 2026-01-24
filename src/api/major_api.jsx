import API from "./index";

/**
 * Helper to safely extract backend data
 * Supports:
 *  - { data: { data: [...] } }
 *  - { data: [...] }
 *  - { data: { ... } }
 */
const extractData = (res) => {
  if (res?.data?.data !== undefined) return res.data.data;
  if (res?.data !== undefined) return res.data;
  return null;
};

// ==============================
// BASIC MAJOR CRUD (NO ENDPOINT CHANGE)
// ==============================

// GET: all majors
export const fetchMajors = async () => {
  const res = await API.get("/majors");
  const data = extractData(res);
  return {
    data: { data: Array.isArray(data) ? data : [] },
  };
};

// GET: single major
export const fetchMajor = (id) => API.get(`/majors/${id}`);

// POST: create major (supports FormData or JSON)
export const createMajor = (data) => {
  const config =
    data instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  return API.post("/majors", data, config);
};

// PUT: update major (Laravel-friendly _method)
export const updateMajor = (id, data) => {
  const formData = new FormData();

  Object.entries(data || {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  formData.append("_method", "PUT");

  return API.post(`/majors/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE: delete major
export const deleteMajor = (id) => API.delete(`/majors/${id}`);

// =====================================================
// MAJOR CAPACITY / QUOTA (NO ENDPOINT CHANGE)
// =====================================================

/**
 * PUBLIC
 * Check if a major is available for registration
 *
 * GET /majors/{id}/capacity?academic_year=YYYY-YYYY
 */
export const checkMajorCapacity = (majorId, academicYear) =>
  API.get(`/majors/${majorId}/capacity`, {
    params: { academic_year: academicYear },
  });

/**
 * ADMIN / STAFF
 * Create or update quota for a major per academic year
 *
 * POST /admin/majors/{id}/quota
 */
export const saveMajorQuota = (majorId, payload) =>
  API.post(`/admin/majors/${majorId}/quota`, payload);

/**
 * ADMIN / STAFF
 * Get all quotas for a major (all years)
 *
 * GET /admin/majors/{id}/quotas
 */
export const fetchMajorQuotas = async (majorId) => {
  const res = await API.get(`/admin/majors/${majorId}/quotas`);
  const data = extractData(res);
  return {
    data: { data: Array.isArray(data) ? data : [] },
  };
};
