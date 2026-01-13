import API from '../api/index';

// Registration API with proper headers for file upload
export const submitRegistration = (formData) => {
  return API.post("/register/save", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};