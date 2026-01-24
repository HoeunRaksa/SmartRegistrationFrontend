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
