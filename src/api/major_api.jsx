import API from './index';

export const fetchMajors = () => API.get("/majors");
export const fetchMajor = (id) => API.get(`/majors/${id}`);
export const createMajor = (data) => {
  const config = data instanceof FormData ? {
    headers: { 'Content-Type': 'multipart/form-data' }
  } : {};
  return API.post("/majors", data, config);
};

export const updateMajor = (id, data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // Only append if value is not null/undefined
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  formData.append("_method", "PUT");

  return API.post(`/majors/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const deleteMajor = (id) => API.delete(`/majors/${id}`);