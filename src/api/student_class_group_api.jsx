import API from "./index";

export const fetchStudentClassGroup = (studentId, params = {}) =>
  API.get(`/students/${studentId}/class-group`, { params });

export const assignStudentClassGroupManual = (studentId, payload) =>
  API.post(`/students/${studentId}/class-group/assign`, payload);

export const assignStudentClassGroupAuto = (studentId, payload) =>
  API.post(`/students/${studentId}/class-group/auto`, payload);

// ✅ NEW: click class group -> list students
export const fetchClassGroupStudents = (classGroupId, params = {}) =>
  API.get(`/class-groups/${classGroupId}/students`, { params });
