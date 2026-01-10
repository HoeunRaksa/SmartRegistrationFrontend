import API from "../api/index"; // or "../api" depending on your folder structure

// ==============================
// PUBLIC (if needed later)
// ==============================

// export const fetchSubjectsPublic = () => API.get("/subjects");

// ==============================
// STAFF / ADMIN / TEACHER
// ==============================

// GET: fetch all subjects
export const fetchSubjects = () => {
  return API.get("/subjects");
};

// GET: fetch single subject by id
export const fetchSubjectById = (id) => {
  return API.get(`/subjects/${id}`);
};

// POST: create subject
export const createSubject = (data) => {
  return API.post("/subjects", data);
};

// PUT: update subject
export const updateSubject = (id, data) => {
  return API.put(`/subjects/${id}`, data);
};

// DELETE: delete subject
export const deleteSubject = (id) => {
  return API.delete(`/subjects/${id}`);
};
