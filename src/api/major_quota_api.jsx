// ==============================
// ✅ major_quota_api.js (NO ENDPOINT CHANGES)
// src/api/major_quota_api.js
// ==============================
import API from "./index";
import { cachedGet, invalidateCache } from "../utils/requestCache";

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

  // ✅ build stable key (sorted)
  const keyObj = { ...query };
  const key = `GET:/major-quotas?${new URLSearchParams(Object.entries(keyObj).sort()).toString()}`;

  return cachedGet(() => API.get("/major-quotas", { params: query }), key, 30_000);
};

export const createMajorQuota = async (payload) => {
  const res = await API.post("/major-quotas", payload);
  invalidateCache("GET:/major-quotas");
  return res;
};

export const updateMajorQuota = async (id, payload) => {
  const res = await API.put(`/major-quotas/${id}`, payload);
  invalidateCache("GET:/major-quotas");
  return res;
};

export const deleteMajorQuota = async (id) => {
  const res = await API.delete(`/major-quotas/${id}`);
  invalidateCache("GET:/major-quotas");
  return res;
};

export const fetchLatestQuotaForMajorYear = async (majorId, academicYear) => {
  const res = await fetchMajorQuotas({ major_id: majorId, academic_year: academicYear });
  const list = res?.data?.data || [];
  return { res, quota: list?.[0] || null };
};
