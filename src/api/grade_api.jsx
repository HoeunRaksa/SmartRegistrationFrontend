import API from "./index";

// ==============================
// GRADE API
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

// GET: Fetch student's grades
export const fetchStudentGrades = async () => {
  try {
    const response = await API.get("/student/grades");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchStudentGrades error:", error);
    throw error;
  }
};

// GET: Fetch grades for a specific course
export const fetchCourseGrades = async (courseId) => {
  try {
    const response = await API.get(`/student/grades/course/${courseId}`);
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error(`fetchCourseGrades(${courseId}) error:`, error);
    throw error;
  }
};

// GET: Fetch grade summary/transcript
export const fetchTranscript = async () => {
  try {
    const response = await API.get("/student/transcript");
    return response;
  } catch (error) {
    console.error("fetchTranscript error:", error);
    throw error;
  }
};

// GET: Fetch GPA information
export const fetchGPA = async () => {
  try {
    const response = await API.get("/student/gpa");
    return response;
  } catch (error) {
    console.error("fetchGPA error:", error);
    throw error;
  }
};

// GET: Download transcript as PDF
export const downloadTranscript = async () => {
  try {
    const response = await API.get("/student/transcript/download", {
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    console.error("downloadTranscript error:", error);
    throw error;
  }
};
