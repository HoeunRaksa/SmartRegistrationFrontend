import API from '../api/index';

// PUBLIC - Fetch departments with optional filters
export const fetchDepartments = (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.faculty) params.append('faculty', filters.faculty);
  if (filters.sort_by) params.append('sort_by', filters.sort_by);
  if (filters.sort_order) params.append('sort_order', filters.sort_order);
  if (filters.with_stats) params.append('with_stats', 'true');
  
  const queryString = params.toString();
  return API.get(`/departments${queryString ? `?${queryString}` : ''}`);
};

export const fetchDepartmentById = (id) =>
  API.get(`/departments/${id}`);

export const fetchMajorsByDepartment = (id) =>
  API.get(`/departments/${id}/majors`);

// Get unique faculties for filter dropdown
export const fetchFaculties = () =>
  API.get("/departments/faculties");

// Get department statistics
export const fetchDepartmentStatistics = () =>
  API.get("/departments/statistics");

// STAFF / ADMIN - Create department
export const createDepartment = (formData) =>
  API.post("/departments", formData);

// STAFF / ADMIN - Update department
export const updateDepartment = (id, formData) => {
  formData.append("_method", "PUT");
  return API.post(`/departments/${id}`, formData);
};

// STAFF / ADMIN - Delete department
export const deleteDepartment = (id) =>
  API.delete(`/departments/${id}`);

// Example usage in your component:
/*
// Fetch all departments
const allDepts = await fetchDepartments();

// Fetch with search
const searchResults = await fetchDepartments({ search: 'Computer' });

// Fetch by faculty
const engineeringDepts = await fetchDepartments({ faculty: 'Engineering' });

// Fetch with sorting
const sortedDepts = await fetchDepartments({ 
  sort_by: 'name', 
  sort_order: 'desc' 
});

// Fetch with student counts
const deptsWithStats = await fetchDepartments({ with_stats: true });

// Combined filters
const filtered = await fetchDepartments({
  search: 'Science',
  faculty: 'Engineering',
  sort_by: 'created_at',
  sort_order: 'desc',
  with_stats: true
});
*/