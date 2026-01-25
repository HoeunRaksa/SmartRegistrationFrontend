import API from "./index";

/**
 * Helper to safely extract backend data
 */
const extractData = (response) => {
  if (response?.data?.data !== undefined) return response.data.data;
  if (response?.data !== undefined) return response.data;
  return null;
};

// ==============================
// STUDENT COURSES (NO ENDPOINT CHANGE)
// ==============================

// GET: enrolled courses
export const fetchStudentCourses = async () => {
  const response = await API.get("/student/courses/enrolled");
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

// GET: available courses
export const fetchAvailableCourses = async () => {
  const response = await API.get("/student/courses/available");
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

// POST: enroll
export const enrollInCourse = async (courseId) => {
  return API.post("/student/courses/enroll", {
    course_id: Number(courseId),
  });
};

// DELETE: drop course
export const dropCourse = async (courseId) => {
  return API.delete(`/student/courses/${courseId}/drop`);
};

// ==============================
// COURSES (ADMIN/STAFF) (NO ENDPOINT CHANGE)
// ==============================

// ✅ keep alias used in many pages (no recursion / no hoist confusion)
export const fetchAllCourses = async () => {
  try {
    const response = await API.get("/courses");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : [],
      },
    };
  } catch (error) {
    console.error("fetchAllCourses error:", error);
    throw error;
  }
};

// Alias used in many pages
export const fetchCourses = async () => {
  return fetchAllCourses();
};

// POST: Create course
export const createCourse = async (courseData) => {
  try {
    return await API.post("/courses", courseData);
  } catch (error) {
    console.error("createCourse error:", error);
    throw error;
  }
};

// PUT: Update course
export const updateCourse = async (courseId, courseData) => {
  try {
    return await API.put(`/courses/${courseId}`, courseData);
  } catch (error) {
    console.error("updateCourse error:", error);
    throw error;
  }
};

// DELETE: Delete course
export const deleteCourse = async (courseId) => {
  try {
    return await API.delete(`/courses/${courseId}`);
  } catch (error) {
    console.error("deleteCourse error:", error);
    throw error;
  }
};

// GET: Course options for dropdowns
export const fetchCourseOptions = () => {
  return API.get("/admin/courses/options");
};

// ==============================
// CLASS SESSIONS (NEW)
// ==============================

/**
 * GET: Fetch all class sessions with optional filters
 * @param {Object} params - Filter parameters
 * @param {string} params.start_date - Start date (YYYY-MM-DD)
 * @param {string} params.end_date - End date (YYYY-MM-DD)
 * @param {number} params.course_id - Filter by course
 * @param {string} params.date - Specific date (YYYY-MM-DD)
 * @param {string} params.day_of_week - Day of week (Monday, Tuesday, etc.)
 */
export const fetchAllSessions = async (params = {}) => {
  try {
    const response = await API.get("/admin/class-sessions", { params });
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : [],
        total: response.data?.total || 0,
      },
    };
  } catch (error) {
    console.error("fetchAllSessions error:", error);
    throw error;
  }
};

/**
 * GET: Fetch single class session by ID
 * @param {number} sessionId - Session ID
 */
export const fetchSession = async (sessionId) => {
  try {
    return await API.get(`/admin/class-sessions/${sessionId}`);
  } catch (error) {
    console.error("fetchSession error:", error);
    throw error;
  }
};

/**
 * POST: Create a new class session
 * @param {Object} sessionData - Session data
 * @param {number} sessionData.course_id - Course ID
 * @param {string} sessionData.session_date - Session date (YYYY-MM-DD)
 * @param {string} sessionData.start_time - Start time (HH:mm)
 * @param {string} sessionData.end_time - End time (HH:mm)
 * @param {string} sessionData.room - Room number (optional)
 * @param {string} sessionData.session_type - Session type (optional)
 */
export const createSession = async (sessionData) => {
  try {
    return await API.post("/admin/class-sessions", sessionData);
  } catch (error) {
    console.error("createSession error:", error);
    throw error;
  }
};

/**
 * PUT: Update an existing class session
 * @param {number} sessionId - Session ID
 * @param {Object} sessionData - Updated session data
 */
export const updateSession = async (sessionId, sessionData) => {
  try {
    return await API.put(`/admin/class-sessions/${sessionId}`, sessionData);
  } catch (error) {
    console.error("updateSession error:", error);
    throw error;
  }
};

/**
 * DELETE: Delete a class session
 * @param {number} sessionId - Session ID
 */
export const deleteSession = async (sessionId) => {
  try {
    return await API.delete(`/admin/class-sessions/${sessionId}`);
  } catch (error) {
    console.error("deleteSession error:", error);
    throw error;
  }
};

/**
 * POST: Generate class sessions from schedules
 * @param {Object} params - Generation parameters
 * @param {string} params.start_date - Start date (YYYY-MM-DD)
 * @param {string} params.end_date - End date (YYYY-MM-DD)
 * @param {number} params.course_id - Specific course ID (optional)
 * @param {boolean} params.overwrite - Overwrite existing sessions (optional)
 */
export const generateSessions = async (params) => {
  try {
    return await API.post("/admin/class-sessions/generate", params);
  } catch (error) {
    console.error("generateSessions error:", error);
    throw error;
  }
};

/**
 * POST: Bulk delete class sessions
 * @param {Array<number>} sessionIds - Array of session IDs to delete
 */
export const bulkDeleteSessions = async (sessionIds) => {
  try {
    return await API.post("/admin/class-sessions/bulk-delete", {
      session_ids: sessionIds,
    });
  } catch (error) {
    console.error("bulkDeleteSessions error:", error);
    throw error;
  }
};

/**
 * GET: Fetch upcoming class sessions
 * @param {number} days - Number of days to look ahead (default: 7)
 */
export const fetchUpcomingSessions = async (days = 7) => {
  try {
    const response = await API.get("/admin/class-sessions/upcoming", {
      params: { days },
    });
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : [],
        total: response.data?.total || 0,
        date_range: response.data?.date_range || {},
      },
    };
  } catch (error) {
    console.error("fetchUpcomingSessions error:", error);
    throw error;
  }
};

/**
 * GET: Fetch sessions for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 */
export const fetchSessionsByDate = async (date) => {
  try {
    const response = await API.get(`/admin/class-sessions/by-date/${date}`);
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : [],
        date: response.data?.date || date,
        day_of_week: response.data?.day_of_week || "",
        total: response.data?.total || 0,
      },
    };
  } catch (error) {
    console.error("fetchSessionsByDate error:", error);
    throw error;
  }
};

/**
 * GET: Fetch all sessions for a specific course
 * @param {number} courseId - Course ID
 */
export const fetchSessionsByCourse = async (courseId) => {
  try {
    const response = await API.get(`/admin/class-sessions/by-course/${courseId}`);
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : [],
        course_id: courseId,
        total: response.data?.total || 0,
      },
    };
  } catch (error) {
    console.error("fetchSessionsByCourse error:", error);
    throw error;
  }
};