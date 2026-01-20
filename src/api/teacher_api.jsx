// src/api/teacher_api.jsx
import API from '../api/index';

export const fetchTeachers = async (params = {}) => {
  return await API.get('/teachers', { params });
};

export const fetchTeacherById = async (id) => {
  return await API.get(`/teachers/${id}`);
};

export const createTeacher = async (teacherData) => {
  const formData = new FormData();

  Object.keys(teacherData).forEach((key) => {
    if (teacherData[key] !== null && teacherData[key] !== undefined) {
      // image field from backend controller is "image"
      if (key === 'image' && teacherData[key] instanceof File) {
        formData.append(key, teacherData[key]);
      } else {
        formData.append(key, teacherData[key]);
      }
    }
  });

  return await API.post('/teachers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateTeacher = async (id, teacherData) => {
  const formData = new FormData();

  Object.keys(teacherData).forEach((key) => {
    if (teacherData[key] !== null && teacherData[key] !== undefined) {
      if (key === 'image' && teacherData[key] instanceof File) {
        formData.append(key, teacherData[key]);
      } else {
        formData.append(key, teacherData[key]);
      }
    }
  });

  // Use POST + _method for Laravel FormData
  formData.append('_method', 'PUT');

  return await API.post(`/teachers/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteTeacher = async (id) => {
  return await API.delete(`/teachers/${id}`);
};
