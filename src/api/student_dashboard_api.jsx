import API from "./index";

/**
 * Safe extractor: supports { data: { data: ... } } or { data: ... }
 */
const extract = (res) => {
  if (res?.data?.data !== undefined) return res.data.data;
  if (res?.data !== undefined) return res.data;
  return null;
};

// ==============================
// STUDENT PROFILE & DASHBOARD API
// ==============================

// GET: student profile
export const fetchStudentProfile = async () => {
  const res = await API.get("/student/profile");
  return extract(res);
};

// GET: enrolled courses
export const fetchStudentEnrolledCourses = async () => {
  const res = await API.get("/student/courses/enrolled");
  const data = extract(res);
  return Array.isArray(data) ? data : [];
};

// GET: today schedule
export const fetchStudentTodaySchedule = async () => {
  const res = await API.get("/student/schedule/today");
  const data = extract(res);
  return Array.isArray(data) ? data : [];
};

// GET: grades
export const fetchStudentGrades = async () => {
  const res = await API.get("/student/grades");
  const data = extract(res);
  return Array.isArray(data) ? data : [];
};

// GET: GPA
export const fetchStudentGpa = async () => {
  const res = await API.get("/student/grades/gpa");
  const data = extract(res);
  return data ?? { gpa: 0 };
};

// GET: assignments
export const fetchStudentAssignments = async () => {
  const res = await API.get("/student/assignments");
  const data = extract(res);
  return Array.isArray(data) ? data : [];
};

// GET: attendance statistics
export const fetchStudentAttendanceStats = async () => {
  const res = await API.get("/student/attendance/stats");
  const data = extract(res);
  return (
    data ?? {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    }
  );
};

// GET: message conversations
export const fetchStudentConversations = async () => {
  const res = await API.get("/student/messages/conversations");
  const data = extract(res);
  return Array.isArray(data) ? data : [];
};
