// =====================================================
// src/api/class_group_api.jsx  ✅ FULL CLEAN NO DUPLICATE
// =====================================================
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

/* =====================================================
   CLASS GROUP CRUD (ADMIN)
   Endpoints:
   GET    /class-groups
   POST   /class-groups
   PUT    /class-groups/{id}
   DELETE /class-groups/{id}
   ===================================================== */

export const fetchAllClassGroups = async (params = {}) => {
  const res = await API.get("/class-groups", { params });
  const data = extractData(res);
  return {
    data: { data: Array.isArray(data) ? data : [] },
  };
};

export const fetchClassGroupsByMajor = async (majorId, extraParams = {}) => {
  const res = await API.get("/class-groups", {
    params: { major_id: majorId, ...extraParams },
  });
  const data = extractData(res);
  return {
    data: { data: Array.isArray(data) ? data : [] },
  };
};

export const createClassGroup = (payload) => API.post("/class-groups", payload);

export const updateClassGroup = (id, payload) =>
  API.put(`/class-groups/${id}`, payload);

export const deleteClassGroup = (id) =>
  API.delete(`/class-groups/${id}`);

/* =====================================================
   CLASS GROUP STUDENTS (NEW FLOW)
   Endpoints:
   GET  /class-groups/{classGroupId}/students?academic_year=YYYY-YYYY&semester=1|2
   ===================================================== */
export const fetchClassGroupStudents = (classGroupId, params = {}) =>
  API.get(`/class-groups/${classGroupId}/students`, { params });

/* =====================================================
   STUDENT ↔ CLASS GROUP (your existing controller)
   Endpoints:
   GET  /students/{studentId}/class-group?academic_year=YYYY-YYYY&semester=1|2
   POST /students/{studentId}/class-group/assign
   POST /students/{studentId}/class-group/auto
   ===================================================== */
export const fetchStudentClassGroup = (studentId, params = {}) =>
  API.get(`/students/${studentId}/class-group`, { params });

export const assignStudentClassGroupManual = (studentId, payload) =>
  API.post(`/students/${studentId}/class-group/assign`, payload);

export const assignStudentClassGroupAuto = (studentId, payload) =>
  API.post(`/students/${studentId}/class-group/auto`, payload);
