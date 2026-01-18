import API from './index';

// ==============================
// REGISTRATION CRUD
// ==============================

export const fetchRegistrations = async (params = {}) => {
  return await API.get('/registers', { params });
};

export const fetchRegistrationById = async (id) => {
  return await API.get(`/registrations/${id}`);
};

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

export const submitRegistration = (formData) => {
  return API.post("/register/save", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateRegistration = (id, formData) => {
  return API.post(`/registrations/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteRegistration = (id) => {
  return API.delete(`/registrations/${id}`);
};

// ==============================
// REGISTRATION REPORTS
// ==============================

/**
 * Generate registration report with filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise} Report data with statistics
 */
export const generateRegistrationReport = async (filters = {}) => {
  const params = new URLSearchParams();
  
  // Add all filters to params
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });
  
  return await API.get(`/reports/registrations?${params.toString()}`);
};

/**
 * Download registration report as PDF
 * @param {Object} filters - Filter parameters
 * @returns {Promise} Blob data for PDF download
 */
export const downloadRegistrationReportPDF = async (filters = {}) => {
  const params = new URLSearchParams();
  
  // Add all filters to params
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });
  
  return await API.get(`/reports/registrations/pdf?${params.toString()}`, {
    responseType: 'blob',
  });
};

/**
 * Get registration summary statistics
 * @param {string} academicYear - Optional academic year filter
 * @returns {Promise} Summary statistics
 */
export const getRegistrationSummary = async (academicYear = null) => {
  const params = academicYear ? { academic_year: academicYear } : {};
  return await API.get('/reports/registrations/summary', { params });
};

// ==============================
// HELPER FUNCTIONS
// ==============================

/**
 * Helper function to download PDF blob
 * @param {Blob} blob - PDF blob data
 * @param {string} filename - Optional custom filename
 */
export const downloadPDFBlob = (blob, filename = null) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename || `registration_report_${Date.now()}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Generate and download registration report in one call
 * @param {Object} filters - Filter parameters
 * @param {string} filename - Optional custom filename
 */
export const generateAndDownloadReport = async (filters = {}, filename = null) => {
  try {
    const response = await downloadRegistrationReportPDF(filters);
    downloadPDFBlob(response.data, filename);
    return { success: true };
  } catch (error) {
    console.error('Failed to download report:', error);
    throw error;
  }
};