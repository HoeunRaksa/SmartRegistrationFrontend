// ==============================
// ✅ department_api.js (NO ENDPOINT CHANGES)
// src/api/department_api.js
// ==============================
import API from "../api/index";
import { cachedGet, invalidateCache } from "../utils/requestCache";

// PUBLIC - Fetch departments with optional filters
export const fetchDepartments = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.faculty) params.append("faculty", filters.faculty);
  if (filters.sort_by) params.append("sort_by", filters.sort_by);
  if (filters.sort_order) params.append("sort_order", filters.sort_order);
  if (filters.with_stats) params.append("with_stats", "true");

  const queryString = params.toString();
  const url = `/departments${queryString ? `?${queryString}` : ""}`;

  // ✅ cache key includes full URL (filters)
  return cachedGet(() => API.get(url), `GET:${url}`, 5 * 60_000);
};

export const fetchDepartmentById = (id) => {
  const url = `/departments/${id}`;
  return cachedGet(() => API.get(url), `GET:${url}`, 5 * 60_000);
};

export const fetchMajorsByDepartment = (id) => {
  const url = `/departments/${id}/majors`;
  return cachedGet(() => API.get(url), `GET:${url}`, 5 * 60_000);
};

// Get unique faculties for filter dropdown
export const fetchFaculties = () => {
  const url = "/departments/faculties";
  return cachedGet(() => API.get(url), `GET:${url}`, 10 * 60_000);
};

// Get department statistics
export const fetchDepartmentStatistics = () => {
  const url = "/departments/statistics";
  return cachedGet(() => API.get(url), `GET:${url}`, 30_000);
};

// STAFF / ADMIN - Create department
export const createDepartment = async (formData) => {
  const res = await API.post("/departments", formData);
  // ✅ invalidate department related caches
  invalidateCache("GET:/departments");
  return res;
};

// STAFF / ADMIN - Update department
export const updateDepartment = async (id, formData) => {
  formData.append("_method", "PUT");
  const res = await API.post(`/departments/${id}`, formData);
  // ✅ invalidate department related caches
  invalidateCache("GET:/departments");
  invalidateCache(`GET:/departments/${id}`);
  return res;
};

// STAFF / ADMIN - Delete department
export const deleteDepartment = async (id) => {
  const res = await API.delete(`/departments/${id}`);
  // ✅ invalidate department related caches
  invalidateCache("GET:/departments");
  invalidateCache(`GET:/departments/${id}`);
  return res;
};
