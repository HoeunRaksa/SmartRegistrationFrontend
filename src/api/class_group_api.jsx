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
   CLASS GROUP CRUD (ADMIN)
   ===================================================== */

/* GET: all class groups (admin) */
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

/* GET: class groups by major (optional helper) */
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

/* POST: create class group */
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
     *   capacity: 40
     * }
     */
    const response = await API.post("/class-groups", payload);
    return response;
  } catch (error) {
    console.error("createClassGroup error:", error);
    throw error;
  }
};

/* PUT: update class group */
export const updateClassGroup = async (id, payload) => {
  try {
    const response = await API.put(`/class-groups/${id}`, payload);
    return response;
  } catch (error) {
    console.error("updateClassGroup error:", error);
    throw error;
  }
};

/* DELETE: delete class group */
export const deleteClassGroup = async (id) => {
  try {
    const response = await API.delete(`/class-groups/${id}`);
    return response;
  } catch (error) {
    console.error("deleteClassGroup error:", error);
    throw error;
  }
};

/* =====================================================
   ✅ NEW: CAPACITY / AVAILABLE CLASS GROUP
   (used by allocator UI or admin)
   ===================================================== */

/**
 * ✅ Get 1 available group (free seat) for major/year/semester/shift
 * backend (NEW, recommended):
 * GET /api/class-groups/available?major_id=1&academic_year=2026-2027&semester=1&shift=Morning
 *
 * Returns: { success, data: { class_group, used, capacity, remaining } }
 */
export const fetchAvailableClassGroup = async (params) => {
  try {
    const response = await API.get("/class-groups/available", { params });
    return response;
  } catch (error) {
    console.error("fetchAvailableClassGroup error:", error);
    throw error;
  }
};

/* =====================================================
   ✅ NEW: STUDENT ↔ CLASS GROUP (MANUAL ASSIGN / CHANGE)
   Works with pivot table: student_class_groups
   (Long-life, per year custom)
   ===================================================== */

/**
 * ✅ Assign or update student class group for a specific academic year + semester
 * backend (NEW):
 * POST /api/students/{studentId}/class-group
 *
 * payload:
 * {
 *   class_group_id: 12,
 *   academic_year: "2026-2027",
 *   semester: 1
 * }
 */
export const assignStudentClassGroup = async (studentId, payload) => {
  try {
    const response = await API.post(`/students/${studentId}/class-group`, payload);
    return response;
  } catch (error) {
    console.error("assignStudentClassGroup error:", error);
    throw error;
  }
};

/**
 * ✅ Move student to another class group (same year/semester)
 * This is same endpoint, just different class_group_id.
 * (keeping separate helper name for clarity)
 */
export const moveStudentClassGroup = async (
  studentId,
  { class_group_id, academic_year, semester }
) => {
  return assignStudentClassGroup(studentId, {
    class_group_id,
    academic_year,
    semester,
  });
};

/**
 * ✅ Get student class group for a specific academic year + semester
 * backend (NEW):
 * GET /api/students/{studentId}/class-group?academic_year=2026-2027&semester=1
 */
export const fetchStudentClassGroup = async (studentId, params) => {
  try {
    const response = await API.get(`/students/${studentId}/class-group`, { params });
    return response;
  } catch (error) {
    console.error("fetchStudentClassGroup error:", error);
    throw error;
  }
};

/**
 * ✅ Remove student class group assignment for a year/semester (optional)
 * backend (NEW):
 * DELETE /api/students/{studentId}/class-group?academic_year=2026-2027&semester=1
 */
export const removeStudentClassGroup = async (studentId, params) => {
  try {
    const response = await API.delete(`/students/${studentId}/class-group`, { params });
    return response;
  } catch (error) {
    console.error("removeStudentClassGroup error:", error);
    throw error;
  }
};
