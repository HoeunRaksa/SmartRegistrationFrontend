import API from "./index";

// ==============================
// ATTENDANCE API
// ==============================

/**
 * Helper function to safely extract data from API response
 */
const extractData = (response) => {
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }
  if (response?.data !== undefined) {
    return response.data;
  }
  return null;
};

// GET: Fetch student's attendance records
export const fetchStudentAttendance = async () => {
  try {
    const response = await API.get("/student/attendance");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchStudentAttendance error:", error);
    throw error;
  }
};

// GET: Fetch attendance for a specific course
export const fetchCourseAttendance = async (courseId) => {
  try {
    const response = await API.get(`/student/attendance/course/${courseId}`);
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error(`fetchCourseAttendance(${courseId}) error:`, error);
    throw error;
  }
};

// GET: Fetch attendance summary
export const fetchAttendanceSummary = async () => {
  try {
    const response = await API.get("/student/attendance/summary");
    return response;
  } catch (error) {
    console.error("fetchAttendanceSummary error:", error);
    throw error;
  }
};

// POST: Mark attendance (QR code scan or manual check-in)
export const markAttendance = async (sessionId, data = {}) => {
  try {
    const response = await API.post(`/student/attendance/sessions/${sessionId}/check-in`, data);
    return response;
  } catch (error) {
    console.error(`markAttendance(${sessionId}) error:`, error);
    throw error;
  }
};

// GET: Fetch attendance statistics
export const fetchAttendanceStats = async () => {
  try {
    const response = await API.get("/student/attendance/statistics");
    return response;
  } catch (error) {
    console.error("fetchAttendanceStats error:", error);
    throw error;
  }
};
