import API from "./index";

// ==============================
// ASSIGNMENT API
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

// GET: Fetch all assignments for student
export const fetchStudentAssignments = async () => {
  try {
    const response = await API.get("/student/assignments");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchStudentAssignments error:", error);
    throw error;
  }
};

// GET: Fetch assignments for a specific course
export const fetchCourseAssignments = async (courseId) => {
  try {
    const response = await API.get(`/student/assignments/course/${courseId}`);
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error(`fetchCourseAssignments(${courseId}) error:`, error);
    throw error;
  }
};

// GET: Fetch single assignment details
export const fetchAssignmentDetails = async (assignmentId) => {
  try {
    const response = await API.get(`/student/assignments/${assignmentId}`);
    return response;
  } catch (error) {
    console.error(`fetchAssignmentDetails(${assignmentId}) error:`, error);
    throw error;
  }
};

// POST: Submit assignment
export const submitAssignment = async (assignmentId, formData) => {
  try {
    const response = await API.post(
      `/student/assignments/${assignmentId}/submit`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    console.error(`submitAssignment(${assignmentId}) error:`, error);
    throw error;
  }
};

// PUT: Update assignment submission
export const updateAssignmentSubmission = async (assignmentId, submissionId, formData) => {
  try {
    const response = await API.put(
      `/student/assignments/${assignmentId}/submissions/${submissionId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    console.error(`updateAssignmentSubmission(${assignmentId}, ${submissionId}) error:`, error);
    throw error;
  }
};

// DELETE: Delete assignment submission
export const deleteAssignmentSubmission = async (assignmentId, submissionId) => {
  try {
    const response = await API.delete(`/student/assignments/${assignmentId}/submissions/${submissionId}`);
    return response;
  } catch (error) {
    console.error(`deleteAssignmentSubmission(${assignmentId}, ${submissionId}) error:`, error);
    throw error;
  }
};

// GET: Fetch student's submissions
export const fetchStudentSubmissions = async () => {
  try {
    const response = await API.get("/student/submissions");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchStudentSubmissions error:", error);
    throw error;
  }
};

// GET: Download assignment file
export const downloadAssignmentFile = async (assignmentId, fileId) => {
  try {
    const response = await API.get(
      `/student/assignments/${assignmentId}/files/${fileId}/download`,
      { responseType: 'blob' }
    );
    return response;
  } catch (error) {
    console.error(`downloadAssignmentFile(${assignmentId}, ${fileId}) error:`, error);
    throw error;
  }
};
