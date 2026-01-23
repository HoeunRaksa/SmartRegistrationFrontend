import API from "./index";

/**
 * Get quotas (optionally filtered by major_id and/or academic_year)
 * @param {{ major_id?: number|string, academic_year?: string }} params
 */
export const fetchMajorQuotas = (params = {}) => {
  const { major_id, academic_year } = params;

  const query = {};
  if (major_id !== undefined && major_id !== null && String(major_id) !== "") query.major_id = major_id;
  if (academic_year !== undefined && academic_year !== null && String(academic_year).trim() !== "")
    query.academic_year = String(academic_year).trim();

  return API.get("/major-quotas", { params: query });
};

/**
 * Create or update quota row (your controller uses updateOrCreate)
 * Body fields: major_id, academic_year, limit, opens_at?, closes_at?
 * @param {{
 *  major_id: number|string,
 *  academic_year: string,
 *  limit: number|string,
 *  opens_at?: string|null,
 *  closes_at?: string|null
 * }} payload
 */
export const createMajorQuota = (payload) => {
  return API.post("/major-quotas", payload);
};

/**
 * Update quota by id
 * Body fields: limit, opens_at?, closes_at?
 * @param {number|string} id
 * @param {{
 *  limit: number|string,
 *  opens_at?: string|null,
 *  closes_at?: string|null
 * }} payload
 */
export const updateMajorQuota = (id, payload) => {
  return API.put(`/major-quotas/${id}`, payload);
};

/**
 * Delete quota by id
 * @param {number|string} id
 */
export const deleteMajorQuota = (id) => {
  return API.delete(`/major-quotas/${id}`);
};

/**
 * Convenience helper: get latest quota row for a major + academic year.
 * Your backend returns latest('id')->get(), so we pick first item.
 * @param {number|string} majorId
 * @param {string} academicYear
 */
export const fetchLatestQuotaForMajorYear = async (majorId, academicYear) => {
  const res = await fetchMajorQuotas({ major_id: majorId, academic_year: academicYear });
  const list = res?.data?.data || [];
  return { res, quota: list?.[0] || null };
};
