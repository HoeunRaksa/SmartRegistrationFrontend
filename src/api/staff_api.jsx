import API from '../api/index';

export const fetchStaff = async (params = {}) => {
  return await API.get('/staff', { params });
};

export const fetchStaffById = async (id) => {
  return await API.get(`/staff/${id}`);
};

export const createStaff = async (staffData) => {
  const formData = new FormData();
  
  // Add all fields to FormData
  Object.keys(staffData).forEach(key => {
    if (staffData[key] !== null && staffData[key] !== undefined) {
      if (key === 'profile_image' && staffData[key] instanceof File) {
        formData.append(key, staffData[key]);
      } else {
        formData.append(key, staffData[key]);
      }
    }
  });

  return await API.post('/staff', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

export const updateStaff = async (id, staffData) => {
  const formData = new FormData();
  
  Object.keys(staffData).forEach(key => {
    if (staffData[key] !== null && staffData[key] !== undefined) {
      if (key === 'profile_image' && staffData[key] instanceof File) {
        formData.append(key, staffData[key]);
      } else {
        formData.append(key, staffData[key]);
      }
    }
  });

  // Laravel doesn't handle PUT with FormData well, so we use POST with _method
  formData.append('_method', 'PUT');

  return await API.post(`/staff/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

export const deleteStaff = async (id) => {
  return await API.delete(`/staff/${id}`);
};