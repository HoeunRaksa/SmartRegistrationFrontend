import API from "./index";

// list students in a class group (for year/semester filter)
export const fetchClassGroupStudents = (classGroupId, params = {}) =>
  API.get(`/class-groups/${classGroupId}/students`, { params });

// show student's class group in a period
export const fetchStudentClassGroup = (studentId, params = {}) =>
  API.get(`/students/${studentId}/class-group`, { params });

// manual assign (this is your backend route)
export const assignStudentClassGroupManual = (studentId, payload) =>
  API.post(`/students/${studentId}/class-group/assign`, payload);

// auto assign (optional)
export const assignStudentClassGroupAuto = (studentId, payload) =>
  API.post(`/students/${studentId}/class-group/auto`, payload);
