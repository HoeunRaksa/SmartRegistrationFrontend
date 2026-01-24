import API from "../api/index";

export const fetchStaff = async (params = {}) => {
  return await API.get("/staff", { params });
};

export const fetchStaffById = async (id) => {
  return await API.get(`/staff/${id}`);
};

export const createStaff = async (staffData) => {
  const formData = new FormData();

  Object.entries(staffData || {}).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (key === "profile_image" && value instanceof File) {
      formData.append(key, value);
      return;
    }

    if (typeof value === "object" && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  return await API.post("/staff", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateStaff = async (id, staffData) => {
  const formData = new FormData();

  Object.entries(staffData || {}).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (key === "profile_image" && value instanceof File) {
      formData.append(key, value);
      return;
    }

    if (typeof value === "object" && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  // Laravel: POST with _method for multipart update
  formData.append("_method", "PUT");

  return await API.post(`/staff/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteStaff = async (id) => {
  return await API.delete(`/staff/${id}`);
};
