import API from "./index";

/**
 * Helper: safely extract backend data
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
// CLASS GROUP ↔ STUDENT (NO ENDPOINT CHANGE)
// ==============================

// GET: list students in a class group (filter by academic_year / semester)
export const fetchClassGroupStudents = async (classGroupId, params = {}) => {
  const res = await API.get(`/class-groups/${classGroupId}/students`, { params });
  const data = extractData(res);
  return {
    data: { data: Array.isArray(data) ? data : [] },
  };
};

// GET: show student's class group in a specific period
export const fetchStudentClassGroup = async (studentId, params = {}) => {
  const res = await API.get(`/students/${studentId}/class-group`, { params });
  const data = extractData(res);
  return {
    data: data ?? null,
  };
};

// POST: manual assign (backend route unchanged)
export const assignStudentClassGroupManual = (studentId, payload) =>
  API.post(`/students/${studentId}/class-group/assign`, payload);

// POST: auto assign (optional, backend route unchanged)
export const assignStudentClassGroupAuto = (studentId, payload) =>
  API.post(`/students/${studentId}/class-group/auto`, payload);
