import API from '../api/index';

export const fetchMajors = () => API.get("/majors");
export const fetchMajor = (id) => API.get(`/majors/${id}`);

// STAFF / ADMIN
export const createMajor = (data) => API.post("/majors", data);

export const updateMajor = (id, data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  formData.append("_method", "PUT");

  return API.post(`/majors/${id}`, formData);
};

export const deleteMajor = (id) => API.delete(`/majors/${id}`);
