import API from "./index"; // ✅ shared axios instance with token

// ==============================
// STUDENT API
// ==============================

// GET: Fetch all students (admin / staff)
export const fetchStudents = () => {
  return API.get("/students");
};

// GET: Fetch single student
export const fetchStudent = (id) => {
  return API.get(`/students/${id}`);
};

// POST: Create student
export const createStudent = (data) => {
  return API.post("/students", data);
};

// PUT: Update student
export const updateStudent = (id, data) => {
  return API.put(`/students/${id}`, data);
};

// DELETE: Delete student
export const deleteStudent = (id) => {
  return API.delete(`/students/${id}`);
};
