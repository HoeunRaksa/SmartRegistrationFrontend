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
// ANTI-429 (dedupe + retry)
//  - prevents duplicated requests on refresh / React StrictMode
//  - retries 429 with backoff (+ respects Retry-After if sent)
// ==============================
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const inflight = new Map();

const buildKey = (method, url, payloadOrConfig) => {
  let extra = "";
  try {
    if (payloadOrConfig !== undefined) extra = JSON.stringify(payloadOrConfig);
  } catch {
    extra = String(payloadOrConfig);
  }
  return `${method}:${url}:${extra}`;
};

const requestOnce = async (method, url, payloadOrConfig) => {
  const key = buildKey(method, url, payloadOrConfig);

  if (inflight.has(key)) return inflight.get(key);

  const promise = (async () => {
    let attempt = 0;

    while (true) {
      try {
        if (method === "get" || method === "delete") {
          return await API[method](url, payloadOrConfig);
        }
        // post / put
        return await API[method](url, payloadOrConfig);
      } catch (err) {
        if (err?.response?.status === 429 && attempt < 3) {
          attempt += 1;

          const retryAfter = err?.response?.headers?.["retry-after"];
          const waitMs = retryAfter
            ? Math.min(Number(retryAfter) * 1000, 10_000)
            : 800 * attempt + Math.floor(Math.random() * 250);

          await sleep(waitMs);
          continue;
        }

        throw err;
      }
    }
  })();

  inflight.set(key, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(key);
  }
};

// ==============================
// COURSE ENROLLMENTS ADMIN API
// ==============================

// GET: Fetch all course enrollments
export const fetchAllEnrollments = async () => {
  const response = await requestOnce("get", "/admin/enrollments");
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

// POST: Manually enroll a student


// DELETE: Remove enrollment
export const deleteEnrollment = async (enrollmentId) => {
  return await requestOnce("delete", `/admin/enrollments/${enrollmentId}`);
};

// PUT: Update enrollment status
export const updateEnrollmentStatus = async (enrollmentId, payload) => {
  // payload expected: { status: "enrolled" | "dropped" | "completed" }
  return await requestOnce(
    "put",
    `/admin/enrollments/${enrollmentId}/status`,
    payload
  );
};

// ==============================
// GRADES ADMIN API
// ==============================

// GET: Fetch all grades
export const fetchAllGrades = async (courseId = "") => {
  const url = courseId ? `/admin/grades?course_id=${courseId}` : "/admin/grades";
  const response = await requestOnce("get", url);
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

// POST: Create grade entry
export const createGrade = async (gradeData) => {
  return await requestOnce("post", "/admin/grades", gradeData);
};

// PUT: Update grade
export const updateGrade = async (gradeId, gradeData) => {
  return await requestOnce("put", `/admin/grades/${gradeId}`, gradeData);
};

// DELETE: Delete grade
export const deleteGrade = async (gradeId) => {
  return await requestOnce("delete", `/admin/grades/${gradeId}`);
};

// ==============================
// ASSIGNMENTS ADMIN API
// ==============================

// GET: Fetch all assignments
export const fetchAllAssignments = async (courseId = "") => {
  const url = courseId ? `/admin/assignments?course_id=${courseId}` : "/admin/assignments";
  const response = await requestOnce("get", url);
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

// POST: Create assignment
export const createAssignment = async (assignmentData) => {
  return await requestOnce("post", "/admin/assignments", assignmentData);
};

// PUT: Update assignment
export const updateAssignment = async (assignmentId, assignmentData) => {
  return await requestOnce(
    "put",
    `/admin/assignments/${assignmentId}`,
    assignmentData
  );
};

// DELETE: Delete assignment
export const deleteAssignment = async (assignmentId) => {
  return await requestOnce("delete", `/admin/assignments/${assignmentId}`);
};

// GET: Fetch assignment submissions
export const fetchSubmissions = async (assignmentId) => {
  const response = await requestOnce(
    "get",
    `/admin/assignments/${assignmentId}/submissions`
  );
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

// PUT: Grade submission
export const gradeSubmission = async (submissionId, gradeData) => {
  return await requestOnce(
    "put",
    `/admin/submissions/${submissionId}/grade`,
    gradeData
  );
};

// ==============================
// ATTENDANCE ADMIN API
// ==============================

// GET: Fetch all attendance records
export const fetchAllAttendance = async (courseId = "") => {
  const url = courseId ? `/admin/attendance?course_id=${courseId}` : "/admin/attendance";
  const response = await requestOnce("get", url);
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

// POST: Create class session
export const createClassSession = async (sessionData) => {
  return await requestOnce("post", "/admin/class-sessions", sessionData);
};

// POST: Mark attendance
export const markAttendance = async (attendanceData) => {
  return await requestOnce("post", "/admin/attendance", attendanceData);
};

// PUT: Update attendance status
export const updateAttendance = async (attendanceId, payload) => {
  // payload expected: { status: "present" | "absent" | ... }
  return await requestOnce("put", `/admin/attendance/${attendanceId}`, payload);
};

// ==============================
// CLASS SCHEDULES ADMIN API
// ==============================

// GET: Fetch all class schedules
export const fetchAllSchedules = async () => {
  const response = await requestOnce("get", "/admin/schedules");
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

// POST: Create class schedule
export const createSchedule = async (scheduleData) => {
  return await requestOnce("post", "/admin/schedules", scheduleData);
};

// PUT: Update schedule
export const updateSchedule = async (scheduleId, scheduleData) => {
  return await requestOnce("put", `/admin/schedules/${scheduleId}`, scheduleData);
};

// DELETE: Delete schedule
export const deleteSchedule = async (scheduleId) => {
  return await requestOnce("delete", `/admin/schedules/${scheduleId}`);
};
// GET: Fetch all class sessions
export const fetchAllSessions = async () => {
  const response = await requestOnce("get", "/admin/class-sessions");
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

export const lookupClassGroups = (params) =>
  axios.get("/enrollment-lookup/class-groups", { params });

export const lookupCourses = (params) =>
  axios.get("/enrollment-lookup/courses", { params });

export const lookupStudents = (params) =>
  axios.get("/enrollment-lookup/students", { params });

export const enrollStudent = async (enrollmentData) => {
  return await requestOnce("post", "/admin/enrollments", enrollmentData);
};