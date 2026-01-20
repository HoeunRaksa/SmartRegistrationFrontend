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
// COURSE ENROLLMENTS ADMIN API
// ==============================

// GET: Fetch all course enrollments
export const fetchAllEnrollments = async () => {
  try {
    const response = await API.get("/admin/enrollments");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchAllEnrollments error:", error);
    throw error;
  }
};

// POST: Manually enroll a student
export const enrollStudent = async (enrollmentData) => {
  try {
    const response = await API.post("/admin/enrollments", enrollmentData);
    return response;
  } catch (error) {
    console.error("enrollStudent error:", error);
    throw error;
  }
};

// DELETE: Remove enrollment
export const deleteEnrollment = async (enrollmentId) => {
  try {
    const response = await API.delete(`/admin/enrollments/${enrollmentId}`);
    return response;
  } catch (error) {
    console.error("deleteEnrollment error:", error);
    throw error;
  }
};

// PUT: Update enrollment status
export const updateEnrollmentStatus = async (enrollmentId, status) => {
  try {
    const response = await API.put(`/admin/enrollments/${enrollmentId}/status`, { status });
    return response;
  } catch (error) {
    console.error("updateEnrollmentStatus error:", error);
    throw error;
  }
};

// ==============================
// GRADES ADMIN API
// ==============================

// GET: Fetch all grades
export const fetchAllGrades = async () => {
  try {
    const response = await API.get("/admin/grades");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchAllGrades error:", error);
    throw error;
  }
};

// POST: Create grade entry
export const createGrade = async (gradeData) => {
  try {
    const response = await API.post("/admin/grades", gradeData);
    return response;
  } catch (error) {
    console.error("createGrade error:", error);
    throw error;
  }
};

// PUT: Update grade
export const updateGrade = async (gradeId, gradeData) => {
  try {
    const response = await API.put(`/admin/grades/${gradeId}`, gradeData);
    return response;
  } catch (error) {
    console.error("updateGrade error:", error);
    throw error;
  }
};

// DELETE: Delete grade
export const deleteGrade = async (gradeId) => {
  try {
    const response = await API.delete(`/admin/grades/${gradeId}`);
    return response;
  } catch (error) {
    console.error("deleteGrade error:", error);
    throw error;
  }
};

// ==============================
// ASSIGNMENTS ADMIN API
// ==============================

// GET: Fetch all assignments
export const fetchAllAssignments = async () => {
  try {
    const response = await API.get("/admin/assignments");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchAllAssignments error:", error);
    throw error;
  }
};

// POST: Create assignment
export const createAssignment = async (assignmentData) => {
  try {
    const response = await API.post("/admin/assignments", assignmentData);
    return response;
  } catch (error) {
    console.error("createAssignment error:", error);
    throw error;
  }
};

// PUT: Update assignment
export const updateAssignment = async (assignmentId, assignmentData) => {
  try {
    const response = await API.put(`/admin/assignments/${assignmentId}`, assignmentData);
    return response;
  } catch (error) {
    console.error("updateAssignment error:", error);
    throw error;
  }
};

// DELETE: Delete assignment
export const deleteAssignment = async (assignmentId) => {
  try {
    const response = await API.delete(`/admin/assignments/${assignmentId}`);
    return response;
  } catch (error) {
    console.error("deleteAssignment error:", error);
    throw error;
  }
};

// GET: Fetch assignment submissions
export const fetchSubmissions = async (assignmentId) => {
  try {
    const response = await API.get(`/admin/assignments/${assignmentId}/submissions`);
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchSubmissions error:", error);
    throw error;
  }
};

// PUT: Grade submission
export const gradeSubmission = async (submissionId, gradeData) => {
  try {
    const response = await API.put(`/admin/submissions/${submissionId}/grade`, gradeData);
    return response;
  } catch (error) {
    console.error("gradeSubmission error:", error);
    throw error;
  }
};

// ==============================
// ATTENDANCE ADMIN API
// ==============================

// GET: Fetch all attendance records
export const fetchAllAttendance = async () => {
  try {
    const response = await API.get("/admin/attendance");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchAllAttendance error:", error);
    throw error;
  }
};

// POST: Create class session
export const createClassSession = async (sessionData) => {
  try {
    const response = await API.post("/admin/class-sessions", sessionData);
    return response;
  } catch (error) {
    console.error("createClassSession error:", error);
    throw error;
  }
};

// POST: Mark attendance
export const markAttendance = async (attendanceData) => {
  try {
    const response = await API.post("/admin/attendance", attendanceData);
    return response;
  } catch (error) {
    console.error("markAttendance error:", error);
    throw error;
  }
};

// PUT: Update attendance status
export const updateAttendance = async (attendanceId, status) => {
  try {
    const response = await API.put(`/admin/attendance/${attendanceId}`, { status });
    return response;
  } catch (error) {
    console.error("updateAttendance error:", error);
    throw error;
  }
};

// ==============================
// CLASS SCHEDULES ADMIN API
// ==============================

// GET: Fetch all class schedules
export const fetchAllSchedules = async () => {
  try {
    const response = await API.get("/admin/schedules");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchAllSchedules error:", error);
    throw error;
  }
};

// POST: Create class schedule
export const createSchedule = async (scheduleData) => {
  try {
    const response = await API.post("/admin/schedules", scheduleData);
    return response;
  } catch (error) {
    console.error("createSchedule error:", error);
    throw error;
  }
};

// PUT: Update schedule
export const updateSchedule = async (scheduleId, scheduleData) => {
  try {
    const response = await API.put(`/admin/schedules/${scheduleId}`, scheduleData);
    return response;
  } catch (error) {
    console.error("updateSchedule error:", error);
    throw error;
  }
};

// DELETE: Delete schedule
export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await API.delete(`/admin/schedules/${scheduleId}`);
    return response;
  } catch (error) {
    console.error("deleteSchedule error:", error);
    throw error;
  }
};
