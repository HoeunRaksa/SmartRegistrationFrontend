import API from "./index";

/**
 * Safe extractor: supports {data:{data:...}} or {data:...}
 */
const extract = (res) => {
  if (res?.data?.data !== undefined) return res.data.data;
  if (res?.data !== undefined) return res.data;
  return null;
};

export const fetchStudentProfile = async () => {
  const res = await API.get("/student/profile"); // you must have this backend route
  return extract(res);
};

export const fetchStudentEnrolledCourses = async () => {
  const res = await API.get("/student/courses/enrolled");
  return extract(res) || [];
};

export const fetchStudentTodaySchedule = async () => {
  const res = await API.get("/student/schedule/today");
  return extract(res) || [];
};

export const fetchStudentGrades = async () => {
  const res = await API.get("/student/grades");
  return extract(res) || [];
};

export const fetchStudentGpa = async () => {
  const res = await API.get("/student/grades/gpa");
  return extract(res) || { gpa: 0 };
};

export const fetchStudentAssignments = async () => {
  const res = await API.get("/student/assignments");
  return extract(res) || [];
};

export const fetchStudentAttendanceStats = async () => {
  const res = await API.get("/student/attendance/stats");
  return extract(res) || { total: 0, present: 0, absent: 0, late: 0, excused: 0 };
};

export const fetchStudentConversations = async () => {
  const res = await API.get("/student/messages/conversations");
  return extract(res) || [];
};
