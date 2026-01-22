import API from './index';

// ==============================
// BASIC MAJOR CRUD (EXISTING)
// ==============================
export const fetchMajors = () => API.get("/majors");

export const fetchMajor = (id) => API.get(`/majors/${id}`);

export const createMajor = (data) => {
  const config = data instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  return API.post("/majors", data, config);
};

export const updateMajor = (id, data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  formData.append("_method", "PUT");

  return API.post(`/majors/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const deleteMajor = (id) => API.delete(`/majors/${id}`);

// =====================================================
// ✅ NEW: MAJOR CAPACITY / QUOTA (LONG-LIFE, SAFE)
// =====================================================

/**
 * ✅ PUBLIC
 * Check if a major is available for registration
 * Used BEFORE showing full register form
 *
 * backend:
 * GET /api/majors/{id}/capacity?academic_year=2026-2027
 */
export const checkMajorCapacity = (majorId, academicYear) =>
  API.get(`/majors/${majorId}/capacity`, {
    params: { academic_year: academicYear },
  });

/**
 * ✅ ADMIN / STAFF
 * Create or update quota for a major per academic year
 *
 * backend:
 * POST /api/admin/majors/{id}/quota
 *
 * payload example:
 * {
 *   academic_year: "2026-2027",
 *   limit: 120,
 *   opens_at: "2026-01-01 08:00:00",
 *   closes_at: "2026-03-31 23:59:59"
 * }
 */
export const saveMajorQuota = (majorId, payload) =>
  API.post(`/admin/majors/${majorId}/quota`, payload);

/**
 * ✅ ADMIN / STAFF
 * Get all quotas for a major (all years)
 *
 * backend:
 * GET /api/admin/majors/{id}/quotas
 */
export const fetchMajorQuotas = (majorId) =>
  API.get(`/admin/majors/${majorId}/quotas`);
