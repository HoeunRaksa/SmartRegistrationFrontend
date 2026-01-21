import API from "./index";

/**
 * Helper: safely extract backend data
 */
const extractData = (response) => {
  if (response?.data?.data !== undefined) return response.data.data;
  if (response?.data !== undefined) return response.data;
  return null;
};

/* =====================================================
   GET: all class groups (admin)
   ===================================================== */
export const fetchAllClassGroups = async () => {
  try {
    const response = await API.get("/class-groups");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : [],
      },
    };
  } catch (error) {
    console.error("fetchAllClassGroups error:", error);
    throw error;
  }
};

/* =====================================================
   GET: class groups by major (optional helper)
   ===================================================== */
export const fetchClassGroupsByMajor = async (majorId) => {
  try {
    const response = await API.get(`/class-groups`, {
      params: { major_id: majorId },
    });
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : [],
      },
    };
  } catch (error) {
    console.error("fetchClassGroupsByMajor error:", error);
    throw error;
  }
};

/* =====================================================
   POST: create class group
   ===================================================== */
export const createClassGroup = async (payload) => {
  try {
    /**
     * payload example:
     * {
     *   class_name: "A1",
     *   major_id: 3,
     *   academic_year: "2025-2026",
     *   semester: 1,
     *   shift: "Morning",
     *   capacity: 30
     * }
     */
    const response = await API.post("/class-groups", payload);
    return response;
  } catch (error) {
    console.error("createClassGroup error:", error);
    throw error;
  }
};

/* =====================================================
   PUT: update class group
   ===================================================== */
export const updateClassGroup = async (id, payload) => {
  try {
    const response = await API.put(`/class-groups/${id}`, payload);
    return response;
  } catch (error) {
    console.error("updateClassGroup error:", error);
    throw error;
  }
};

/* =====================================================
   DELETE: delete class group
   ===================================================== */
export const deleteClassGroup = async (id) => {
  try {
    const response = await API.delete(`/class-groups/${id}`);
    return response;
  } catch (error) {
    console.error("deleteClassGroup error:", error);
    throw error;
  }
};
