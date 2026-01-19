import API from "./index";

// ==============================
// COURSE API
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

// GET: Fetch all courses (admin/staff)
export const fetchAllCourses = async () => {
  try {
    const response = await API.get("/courses");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchAllCourses error:", error);
    throw error;
  }
};

// GET: Fetch student's enrolled courses
export const fetchStudentCourses = async () => {
  try {
    const response = await API.get("/student/courses");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchStudentCourses error:", error);
    throw error;
  }
};

// GET: Fetch available courses for enrollment
export const fetchAvailableCourses = async () => {
  try {
    const response = await API.get("/student/courses/available");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchAvailableCourses error:", error);
    throw error;
  }
};

// GET: Fetch course details
export const fetchCourseDetails = async (courseId) => {
  try {
    const response = await API.get(`/student/courses/${courseId}`);
    return response;
  } catch (error) {
    console.error(`fetchCourseDetails(${courseId}) error:`, error);
    throw error;
  }
};

// POST: Enroll in a course
export const enrollInCourse = async (courseId) => {
  try {
    const response = await API.post(`/student/courses/${courseId}/enroll`);
    return response;
  } catch (error) {
    console.error(`enrollInCourse(${courseId}) error:`, error);
    throw error;
  }
};

// DELETE: Drop a course
export const dropCourse = async (courseId) => {
  try {
    const response = await API.delete(`/student/courses/${courseId}/drop`);
    return response;
  } catch (error) {
    console.error(`dropCourse(${courseId}) error:`, error);
    throw error;
  }
};

// GET: Fetch course materials
export const fetchCourseMaterials = async (courseId) => {
  try {
    const response = await API.get(`/student/courses/${courseId}/materials`);
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error(`fetchCourseMaterials(${courseId}) error:`, error);
    throw error;
  }
};
