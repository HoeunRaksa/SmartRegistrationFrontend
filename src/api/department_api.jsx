import API from "../api";
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==============================
// PUBLIC
// ==============================
export const fetchDepartments = () => API.get("/departments");
export const fetchDepartmentById = (id) => API.get(`/departments/${id}`);

// ==============================
// STAFF / ADMIN
// ==============================
export const createDepartment = (formData) =>
  API.post("/departments", formData);

export const updateDepartment = (id, formData) => {
  const data = new FormData();

  for (const [key, value] of formData.entries()) {
    data.append(key, value);
  }

  data.append("_method", "PUT");

  return API.post(`/departments/${id}`, data);
};

export const deleteDepartment = (id) =>
  API.delete(`/departments/${id}`);

export default API;
