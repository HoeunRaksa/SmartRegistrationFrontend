// src/api/teacher_api.jsx
import API from "./index";

/**
 * Helper function to safely extract data from API response
 */
const extractData = (response) => {
  if (response?.data?.data !== undefined) return response.data.data;
  if (response?.data !== undefined) return response.data;
  return null;
};

// ==============================
// TEACHERS LIST API (admin/staff)
// ==============================

// GET: Fetch all teachers
export const fetchTeachers = async (params = {}) => {
  try {
    return await API.get("/teachers", { params });
  } catch (error) {
    console.error("fetchTeachers error:", error);
    throw error;
  }
};

// GET: Fetch teacher by ID
export const fetchTeacherById = async (id) => {
  try {
    return await API.get(`/teachers/${id}`);
  } catch (error) {
    console.error("fetchTeacherById error:", error);
    throw error;
  }
};

// POST: Create new teacher (multipart)
export const createTeacher = async (teacherData) => {
  try {
    const formData = new FormData();

    Object.entries(teacherData || {}).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      // ✅ Generic file support (handles 'image' or 'profile_image')
      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      // support arrays/objects safely
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
        return;
      }

      formData.append(key, String(value));
    });

    return await API.post("/teachers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error("createTeacher error:", error);
    throw error;
  }
};

// PUT: Update teacher (Laravel: POST + _method=PUT)
export const updateTeacher = async (id, teacherData) => {
  try {
    const formData = new FormData();

    Object.entries(teacherData || {}).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      // ✅ Generic file support
      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
        return;
      }

      formData.append(key, String(value));
    });

    formData.append("_method", "PUT");

    return await API.post(`/teachers/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error("updateTeacher error:", error);
    throw error;
  }
};

// DELETE: Delete teacher
export const deleteTeacher = async (id) => {
  try {
    return await API.delete(`/teachers/${id}`);
  } catch (error) {
    console.error("deleteTeacher error:", error);
    throw error;
  }
};

// ==============================
// TEACHER COURSES API
// ==============================

export const fetchTeacherCourses = async () => {
  try {
    const response = await API.get("/teacher/courses");
    const data = extractData(response);
    return { data: { data: Array.isArray(data) ? data : [] } };
  } catch (error) {
    console.error("fetchTeacherCourses error:", error);
    throw error;
  }
};

export const fetchCourseStudents = async (courseId) => {
  try {
    const response = await API.get(`/teacher/courses/${courseId}/students`);
    const data = extractData(response);
    return { data: { data: Array.isArray(data) ? data : [] } };
  } catch (error) {
    console.error("fetchCourseStudents error:", error);
    throw error;
  }
};

// ==============================
// TEACHER GRADES API
// ==============================

export const fetchTeacherGrades = async () => {
  try {
    const response = await API.get("/teacher/grades");
    const data = extractData(response);
    return { data: { data: Array.isArray(data) ? data : [] } };
  } catch (error) {
    console.error("fetchTeacherGrades error:", error);
    throw error;
  }
};

export const createTeacherGrade = async (gradeData) => {
  try {
    return await API.post("/teacher/grades", gradeData);
  } catch (error) {
    console.error("createTeacherGrade error:", error);
    throw error;
  }
};

export const updateTeacherGrade = async (gradeId, gradeData) => {
  try {
    return await API.put(`/teacher/grades/${gradeId}`, gradeData);
  } catch (error) {
    console.error("updateTeacherGrade error:", error);
    throw error;
  }
};

export const deleteTeacherGrade = async (gradeId) => {
  try {
    return await API.delete(`/teacher/grades/${gradeId}`);
  } catch (error) {
    console.error("deleteTeacherGrade error:", error);
    throw error;
  }
};

// ==============================
// TEACHER ASSIGNMENTS API
// ==============================

export const fetchTeacherAssignments = async () => {
  try {
    const response = await API.get("/teacher/assignments");
    const data = extractData(response);
    return { data: { data: Array.isArray(data) ? data : [] } };
  } catch (error) {
    console.error("fetchTeacherAssignments error:", error);
    throw error;
  }
};

export const createTeacherAssignment = async (assignmentData) => {
  try {
    return await API.post("/teacher/assignments", assignmentData);
  } catch (error) {
    console.error("createTeacherAssignment error:", error);
    throw error;
  }
};

export const updateTeacherAssignment = async (assignmentId, assignmentData) => {
  try {
    return await API.put(`/teacher/assignments/${assignmentId}`, assignmentData);
  } catch (error) {
    console.error("updateTeacherAssignment error:", error);
    throw error;
  }
};

export const deleteTeacherAssignment = async (assignmentId) => {
  try {
    return await API.delete(`/teacher/assignments/${assignmentId}`);
  } catch (error) {
    console.error("deleteTeacherAssignment error:", error);
    throw error;
  }
};

export const fetchTeacherSubmissions = async (assignmentId) => {
  try {
    const response = await API.get(`/teacher/assignments/${assignmentId}/submissions`);
    const data = extractData(response);
    return { data: { data: Array.isArray(data) ? data : [] } };
  } catch (error) {
    console.error("fetchTeacherSubmissions error:", error);
    throw error;
  }
};

export const gradeTeacherSubmission = async (submissionId, gradeData) => {
  try {
    return await API.put(`/teacher/submissions/${submissionId}/grade`, gradeData);
  } catch (error) {
    console.error("gradeTeacherSubmission error:", error);
    throw error;
  }
};

// ==============================
// TEACHER ATTENDANCE API
// ==============================

export const fetchTeacherAttendance = async () => {
  try {
    const response = await API.get("/teacher/attendance");
    const data = extractData(response);
    return { data: { data: Array.isArray(data) ? data : [] } };
  } catch (error) {
    console.error("fetchTeacherAttendance error:", error);
    throw error;
  }
};

export const createTeacherClassSession = async (sessionData) => {
  try {
    return await API.post("/teacher/class-sessions", sessionData);
  } catch (error) {
    console.error("createTeacherClassSession error:", error);
    throw error;
  }
};

export const markTeacherAttendance = async (attendanceData) => {
  try {
    return await API.post("/teacher/attendance", attendanceData);
  } catch (error) {
    console.error("markTeacherAttendance error:", error);
    throw error;
  }
};

export const updateTeacherAttendance = async (attendanceId, status) => {
  try {
    return await API.put(`/teacher/attendance/${attendanceId}`, { status });
  } catch (error) {
    console.error("updateTeacherAttendance error:", error);
    throw error;
  }
};

// ==============================
// TEACHER SCHEDULES API
// ==============================

export const fetchTeacherSchedules = async () => {
  try {
    const response = await API.get("/teacher/schedules");
    const data = extractData(response);
    return { data: { data: Array.isArray(data) ? data : [] } };
  } catch (error) {
    console.error("fetchTeacherSchedules error:", error);
    throw error;
  }
};

// ==============================
// TEACHER STUDENTS API
// ==============================

export const fetchTeacherStudents = async () => {
  try {
    const response = await API.get("/teacher/students");
    const data = extractData(response);
    return { data: { data: Array.isArray(data) ? data : [] } };
  } catch (error) {
    console.error("fetchTeacherStudents error:", error);
    throw error;
  }
};

// ==============================
// TEACHER DASHBOARD STATS API
// ==============================

export const fetchTeacherDashboardStats = async () => {
  try {
    const response = await API.get("/teacher/dashboard/stats");
    const data = extractData(response);
    return { data: { data: data || {} } };
  } catch (error) {
    console.error("fetchTeacherDashboardStats error:", error);
    throw error;
  }
};

// ==============================
// TEACHER MESSAGES API
// ==============================

export const fetchTeacherConversations = async () => {
  try {
    const response = await API.get("/teacher/messages/conversations");
    const data = extractData(response);
    return { data: { data: Array.isArray(data) ? data : [] } };
  } catch (error) {
    console.error("fetchTeacherConversations error:", error);
    throw error;
  }
};

export const fetchTeacherMessages = async (conversationId) => {
  try {
    const response = await API.get(`/teacher/messages/conversations/${conversationId}`);
    const data = extractData(response);
    return { data: { data: Array.isArray(data) ? data : [] } };
  } catch (error) {
    console.error("fetchTeacherMessages error:", error);
    throw error;
  }
};

export const sendTeacherMessage = async (messageData) => {
  try {
    return await API.post("/teacher/messages", messageData);
  } catch (error) {
    console.error("sendTeacherMessage error:", error);
    throw error;
  }
};
