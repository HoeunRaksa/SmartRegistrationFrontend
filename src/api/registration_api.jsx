import API from '../api/index';
export const fetchRegistrations = async (params = {}) => {
  return await API.get('/registers', { params });
};
export const fetchRegistrationById = async (id) => {
  return await API.get(`/registrations/${id}`);
};

// Optional: Export search/filter helper
export const searchRegistrations = async (searchTerm, status = 'all') => {
  const params = {};
  
  if (searchTerm) {
    params.search = searchTerm;
  }
  
  if (status !== 'all') {
    params.payment_status = status;
  }
  
  return await API.get('/registrations', { params });
};
// Registration API with proper headers for file upload
export const submitRegistration = (formData) => {
  return API.post("/register/save", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};