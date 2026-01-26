import API from "../api/index";

/**
 * Student Dashboard API
 * All dashboard-related API calls in one place
 */

/**
 * Get complete dashboard data (all data in one request)
 * @returns {Promise} Dashboard data with student, stats, schedule, grades, etc.
 */
export const getDashboardData = async () => {
  try {
    const response = await API.get("/student/dashboard");
    return {
      success: true,
      data: extractData(response),
    };
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Failed to load dashboard",
      data: null,
    };
  }
};

/**
 * Get enrolled courses only
 * @returns {Promise} List of enrolled courses
 */
export const getEnrolledCourses = async () => {
  try {
    const response = await API.get("/student/courses/enrolled");
    return {
      success: true,
      data: extractData(response),
    };
  } catch (error) {
    console.error("Enrolled Courses API Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to load courses",
      data: [],
    };
  }
};

/**
 * Get today's schedule
 * @returns {Promise} Today's classes
 */
export const getTodaySchedule = async () => {
  try {
    const response = await API.get("/student/schedule/today");
    return {
      success: true,
      data: extractData(response),
    };
  } catch (error) {
    console.error("Today Schedule API Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to load schedule",
      data: [],
    };
  }
};

/**
 * Get all grades
 * @returns {Promise} List of grades
 */
export const getGrades = async () => {
  try {
    const response = await API.get("/student/grades");
    return {
      success: true,
      data: extractData(response),
    };
  } catch (error) {
    console.error("Grades API Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to load grades",
      data: [],
    };
  }
};

/**
 * Get GPA
 * @returns {Promise} GPA data
 */
export const getGPA = async () => {
  try {
    const response = await API.get("/student/grades/gpa");
    return {
      success: true,
      data: extractData(response),
    };
  } catch (error) {
    console.error("GPA API Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to load GPA",
      data: { gpa: 0, total_grades: 0 },
    };
  }
};

/**
 * Get all assignments
 * @returns {Promise} List of assignments with submission status
 */
export const getAssignments = async () => {
  try {
    const response = await API.get("/student/assignments");
    return {
      success: true,
      data: extractData(response),
    };
  } catch (error) {
    console.error("Assignments API Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to load assignments",
      data: [],
    };
  }
};

/**
 * Get attendance statistics
 * @returns {Promise} Attendance stats
 */
export const getAttendanceStats = async () => {
  try {
    const response = await API.get("/student/attendance/stats");
    return {
      success: true,
      data: extractData(response),
    };
  } catch (error) {
    console.error("Attendance Stats API Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to load attendance",
      data: { total: 0, present: 0, absent: 0, percentage: 0 },
    };
  }
};

/**
 * Get message conversations
 * @returns {Promise} List of conversations
 */
export const getConversations = async () => {
  try {
    const response = await API.get("/student/messages/conversations");
    return {
      success: true,
      data: extractData(response),
    };
  } catch (error) {
    console.error("Conversations API Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to load conversations",
      data: [],
    };
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Extract data from various response formats
 * Supports: {success, data:{...}} OR {data:{...}} OR raw data
 */
function extractData(response) {
  if (!response) return null;
  
  // Backend returns: {success: true, data: {...}}
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }
  
  // Backend returns: {data: {...}}
  if (response?.data !== undefined) {
    return response.data;
  }
  
  // Raw data
  return response;
}

/**
 * Ensure value is an array
 */
export function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * Format date to "time ago" string
 */
export function formatTimeAgo(dateStr) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return "";
  }
}

/**
 * Get days until due date
 */
export function getDaysUntilDue(dueDate) {
  if (!dueDate) return null;
  
  try {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

/**
 * Get greeting based on time of day
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

/**
 * Process dashboard data from backend into UI format
 */
export function processDashboardData(rawData, fallbackUser = {}) {
  const data = rawData || {};
  
  // Student info
  const student = data.student || {
    name: fallbackUser?.name || "Student",
    student_code: fallbackUser?.student_code || "—",
    major: fallbackUser?.major || "—",
    year: fallbackUser?.year || "—",
  };
  
  // Stats
  const stats = data.stats || {
    gpa: 0,
    enrolled_courses: 0,
    attendance: 0,
    pending_assignments: 0,
  };
  
  // Today's schedule
  const todayScheduleRaw = safeArray(data.today_schedule);
  const todayClasses = todayScheduleRaw.map((s) => ({
    id: s?.id,
    course_code: s?.course_code || "—",
    course_name: s?.course_name || "—",
    time: `${s?.start_time || ""} - ${s?.end_time || ""}`,
    room: s?.room || "—",
    instructor: s?.instructor_name || "—",
  }));
  
  // Grades
  const gradesRaw = safeArray(data.grades);
  const recentGrades = gradesRaw.slice(0, 5).map((g) => ({
    id: g?.id,
    course_code: g?.course_code || "—",
    course_name: g?.course_name || "—",
    assignment: g?.assignment_name || "—",
    grade: Number(g?.score || 0),
    total: Number(g?.total_points || 0),
    date: g?.created_at || new Date().toISOString(),
  }));
  
  // Assignments
  const assignmentsRaw = safeArray(data.assignments);
  const pendingAssignmentsRaw = assignmentsRaw.filter((a) => {
    const subs = a?.submissions;
    if (!subs) return true;
    if (Array.isArray(subs) && subs.length === 0) return true;
    return false;
  });
  
  const pendingAssignments = pendingAssignmentsRaw
    .slice()
    .sort((a, b) => 
      new Date(a?.due_date || "2100-01-01") - 
      new Date(b?.due_date || "2100-01-01")
    )
    .map((a) => ({
      id: a?.id,
      course_code: a?.course_code || "—",
      title: a?.title || "—",
      due_date: a?.due_date || null,
      due_time: a?.due_time || "",
      points: Number(a?.points || 0),
    }));
  
  // Conversations
  const conversationsRaw = safeArray(data.conversations);
  
  // Build notifications from real data
  const notifications = [];
  
  recentGrades.slice(0, 3).forEach((gr) => {
    notifications.push({
      id: `g-${gr.id}`,
      message: `Grade posted: ${gr.course_code} - ${gr.assignment}`,
      time: formatTimeAgo(gr.date),
      type: "grade",
    });
  });
  
  pendingAssignments.slice(0, 3).forEach((a) => {
    notifications.push({
      id: `a-${a.id}`,
      message: `Assignment pending: ${a.title}`,
      time: a?.due_date 
        ? `Due ${new Date(a.due_date).toLocaleDateString()}` 
        : "",
      type: "assignment",
    });
  });
  
  if (conversationsRaw.length > 0) {
    notifications.push({
      id: "m-1",
      message: `You have ${conversationsRaw.length} conversation(s)`,
      time: "Now",
      type: "message",
    });
  }
  
  return {
    student,
    stats: {
      gpa: Number(stats?.gpa || 0),
      enrolled_courses: Number(stats?.enrolled_courses || 0),
      attendance: Number(stats?.attendance || 0),
      pending_assignments: Number(stats?.pending_assignments || pendingAssignments.length),
    },
    todayClasses,
    recentGrades,
    pendingAssignments,
    notifications,
  };
}

export default {
  getDashboardData,
  getEnrolledCourses,
  getTodaySchedule,
  getGrades,
  getGPA,
  getAssignments,
  getAttendanceStats,
  getConversations,
  // Helpers
  processDashboardData,
  safeArray,
  formatTimeAgo,
  getDaysUntilDue,
  getGreeting,
};