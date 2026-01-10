import API from "./index"; // ✅ shared axios instance with token

// ==============================
// STUDENT API - FIXED VERSION
// ==============================

/**
 * Helper function to safely extract data from API response
 * Handles both { data: [...] } and { success: true, data: [...] } formats
 */
const extractData = (response) => {
  // Check if response has nested data.data structure
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }
  
  // Check if response has data directly
  if (response?.data !== undefined) {
    return response.data;
  }
  
  // Fallback to empty array/object
  return null;
};

// GET: Fetch all students (admin / staff)
export const fetchStudents = async () => {
  try {
    const response = await API.get("/students");
    const data = extractData(response);
    
    // Ensure we always return an array
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchStudents error:", error);
    throw error;
  }
};

// GET: Fetch single student
export const fetchStudent = async (id) => {
  try {
    const response = await API.get(`/students/${id}`);
    return response;
  } catch (error) {
    console.error(`fetchStudent(${id}) error:`, error);
    throw error;
  }
};

// POST: Create student
export const createStudent = async (data) => {
  try {
    const response = await API.post("/students", data);
    return response;
  } catch (error) {
    console.error("createStudent error:", error);
    throw error;
  }
};

// PUT: Update student
export const updateStudent = async (id, data) => {
  try {
    const response = await API.put(`/students/${id}`, data);
    return response;
  } catch (error) {
    console.error(`updateStudent(${id}) error:`, error);
    throw error;
  }
};

// DELETE: Delete student
export const deleteStudent = async (id) => {
  try {
    const response = await API.delete(`/students/${id}`);
    return response;
  } catch (error) {
    console.error(`deleteStudent(${id}) error:`, error);
    throw error;
  }
};