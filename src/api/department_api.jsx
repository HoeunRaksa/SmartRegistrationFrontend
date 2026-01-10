import API from '../api/index';

// PUBLIC
export const fetchDepartments = () => API.get("/departments");
export const fetchDepartmentById = (id) =>
  API.get(`/departments/${id}`);
export const fetchMajorsByDepartment = (id) =>
  API.get(`/departments/${id}/majors`);

// STAFF / ADMIN
export const createDepartment = (formData) =>
  API.post("/departments", formData);

export const updateDepartment = (id, formData) => {
  formData.append("_method", "PUT");
  return API.post(`/departments/${id}`, formData);
};

export const deleteDepartment = (id) =>
  API.delete(`/departments/${id}`);
