import API from "./index";

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

// ==============================
// TEACHERS LIST API (for admin/staff use)
// ==============================

// GET: Fetch all teachers (for course assignment, etc.)
export const fetchTeachers = async (params = {}) => {
  try {
    const response = await API.get("/teachers", { params });
    return response;
  } catch (error) {
    console.error("fetchTeachers error:", error);
    throw error;
  }
};

// ==============================
// TEACHER COURSES API
// ==============================

// GET: Fetch teacher's assigned courses
export const fetchTeacherCourses = async () => {
  try {
    const response = await API.get("/teacher/courses");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchTeacherCourses error:", error);
    throw error;
  }
};

// GET: Fetch course students (students enrolled in teacher's course)
export const fetchCourseStudents = async (courseId) => {
  try {
    const response = await API.get(`/teacher/courses/${courseId}/students`);
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchCourseStudents error:", error);
    throw error;
  }
};

// ==============================
// TEACHER GRADES API
// ==============================

// GET: Fetch all grades for teacher's courses
export const fetchTeacherGrades = async () => {
  try {
    const response = await API.get("/teacher/grades");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchTeacherGrades error:", error);
    throw error;
  }
};

// POST: Create grade entry
export const createTeacherGrade = async (gradeData) => {
  try {
    const response = await API.post("/teacher/grades", gradeData);
    return response;
  } catch (error) {
    console.error("createTeacherGrade error:", error);
    throw error;
  }
};

// PUT: Update grade
export const updateTeacherGrade = async (gradeId, gradeData) => {
  try {
    const response = await API.put(`/teacher/grades/${gradeId}`, gradeData);
    return response;
  } catch (error) {
    console.error("updateTeacherGrade error:", error);
    throw error;
  }
};

// DELETE: Delete grade
export const deleteTeacherGrade = async (gradeId) => {
  try {
    const response = await API.delete(`/teacher/grades/${gradeId}`);
    return response;
  } catch (error) {
    console.error("deleteTeacherGrade error:", error);
    throw error;
  }
};

// ==============================
// TEACHER ASSIGNMENTS API
// ==============================

// GET: Fetch all assignments for teacher's courses
export const fetchTeacherAssignments = async () => {
  try {
    const response = await API.get("/teacher/assignments");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchTeacherAssignments error:", error);
    throw error;
  }
};

// POST: Create assignment
export const createTeacherAssignment = async (assignmentData) => {
  try {
    const response = await API.post("/teacher/assignments", assignmentData);
    return response;
  } catch (error) {
    console.error("createTeacherAssignment error:", error);
    throw error;
  }
};

// PUT: Update assignment
export const updateTeacherAssignment = async (assignmentId, assignmentData) => {
  try {
    const response = await API.put(`/teacher/assignments/${assignmentId}`, assignmentData);
    return response;
  } catch (error) {
    console.error("updateTeacherAssignment error:", error);
    throw error;
  }
};

// DELETE: Delete assignment
export const deleteTeacherAssignment = async (assignmentId) => {
  try {
    const response = await API.delete(`/teacher/assignments/${assignmentId}`);
    return response;
  } catch (error) {
    console.error("deleteTeacherAssignment error:", error);
    throw error;
  }
};

// GET: Fetch assignment submissions
export const fetchTeacherSubmissions = async (assignmentId) => {
  try {
    const response = await API.get(`/teacher/assignments/${assignmentId}/submissions`);
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchTeacherSubmissions error:", error);
    throw error;
  }
};

// PUT: Grade submission
export const gradeTeacherSubmission = async (submissionId, gradeData) => {
  try {
    const response = await API.put(`/teacher/submissions/${submissionId}/grade`, gradeData);
    return response;
  } catch (error) {
    console.error("gradeTeacherSubmission error:", error);
    throw error;
  }
};

// ==============================
// TEACHER ATTENDANCE API
// ==============================

// GET: Fetch all attendance records for teacher's courses
export const fetchTeacherAttendance = async () => {
  try {
    const response = await API.get("/teacher/attendance");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchTeacherAttendance error:", error);
    throw error;
  }
};

// POST: Create class session
export const createTeacherClassSession = async (sessionData) => {
  try {
    const response = await API.post("/teacher/class-sessions", sessionData);
    return response;
  } catch (error) {
    console.error("createTeacherClassSession error:", error);
    throw error;
  }
};

// POST: Mark attendance
export const markTeacherAttendance = async (attendanceData) => {
  try {
    const response = await API.post("/teacher/attendance", attendanceData);
    return response;
  } catch (error) {
    console.error("markTeacherAttendance error:", error);
    throw error;
  }
};

// PUT: Update attendance status
export const updateTeacherAttendance = async (attendanceId, status) => {
  try {
    const response = await API.put(`/teacher/attendance/${attendanceId}`, { status });
    return response;
  } catch (error) {
    console.error("updateTeacherAttendance error:", error);
    throw error;
  }
};

// ==============================
// TEACHER SCHEDULES API
// ==============================

// GET: Fetch teacher's class schedules
export const fetchTeacherSchedules = async () => {
  try {
    const response = await API.get("/teacher/schedules");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchTeacherSchedules error:", error);
    throw error;
  }
};

// ==============================
// TEACHER STUDENTS API
// ==============================

// GET: Fetch all students in teacher's courses
export const fetchTeacherStudents = async () => {
  try {
    const response = await API.get("/teacher/students");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchTeacherStudents error:", error);
    throw error;
  }
};

// ==============================
// TEACHER DASHBOARD STATS API
// ==============================

// GET: Fetch teacher dashboard statistics
export const fetchTeacherDashboardStats = async () => {
  try {
    const response = await API.get("/teacher/dashboard/stats");
    const data = extractData(response);
    return {
      data: {
        data: data || {}
      }
    };
  } catch (error) {
    console.error("fetchTeacherDashboardStats error:", error);
    throw error;
  }
};

// ==============================
// TEACHER MESSAGES API
// ==============================

// GET: Fetch teacher's message conversations
export const fetchTeacherConversations = async () => {
  try {
    const response = await API.get("/teacher/messages/conversations");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchTeacherConversations error:", error);
    throw error;
  }
};

// GET: Fetch messages for a conversation
export const fetchTeacherMessages = async (conversationId) => {
  try {
    const response = await API.get(`/teacher/messages/conversations/${conversationId}`);
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchTeacherMessages error:", error);
    throw error;
  }
};

// POST: Send message
export const sendTeacherMessage = async (messageData) => {
  try {
    const response = await API.post("/teacher/messages", messageData);
    return response;
  } catch (error) {
    console.error("sendTeacherMessage error:", error);
    throw error;
  }
};
