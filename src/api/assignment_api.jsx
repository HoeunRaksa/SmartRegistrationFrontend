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
export const submitAssignment = async (assignmentId, file) => {
  try {
    const formData = new FormData();
    formData.append("assignment_id", assignmentId);
    formData.append("file", file);

    const response = await API.post("/student/assignments/submit", formData);
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
// NOTE: Backend doesn't have a direct /submissions endpoint, 
// usually submissions are bundled with assignments. 
// If specific submission list is needed, we could fetch all assignments and filter.
export const fetchStudentSubmissions = async () => {
  try {
    const response = await API.get("/student/assignments");
    const data = extractData(response);
    const submissions = Array.isArray(data)
      ? data.filter(a => a.is_submitted).map(a => a.submission)
      : [];
    return {
      data: {
        data: submissions
      }
    };
  } catch (error) {
    console.error("fetchStudentSubmissions error:", error);
    throw error;
  }
};

// GET: Fetch pending assignments
export const fetchPendingAssignments = async () => {
  try {
    const response = await API.get("/student/assignments/pending");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchPendingAssignments error:", error);
    throw error;
  }
};

// GET: Fetch assignment summary/stats
export const fetchAssignmentSummary = async () => {
  try {
    const response = await API.get("/student/assignments/summary");
    return response;
  } catch (error) {
    console.error("fetchAssignmentSummary error:", error);
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
