import API from "./index";

// ==============================
// REGISTRATION CRUD (STAFF/ADMIN)
// backend routes: /registers
// ==============================

export const fetchRegistrations = async (params = {}) => {
  return await API.get("/registers", { params });
};

export const fetchRegistrationById = async (id) => {
  return await API.get(`/registers/${id}`);
};

export const searchRegistrations = async (searchTerm, status = "all") => {
  const params = {};

  if (searchTerm) params.search = searchTerm;
  if (status !== "all") params.payment_status = status;

  return await API.get("/registers", { params });
};

export const submitRegistration = (formData) => {
  // public route for student self register
  return API.post("/register/save", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateRegistration = (id, formData) => {
  // staff/admin route: PUT /registers/{id}
  return API.put(`/registers/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteRegistration = (id) => {
  return API.delete(`/registers/${id}`);
};

// ==============================
// REGISTRATION REPORTS
// (you call GET with query params)
// ==============================

export const generateRegistrationReport = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.append(key, value);
    }
  });

  return await API.get(`/reports/registrations?${params.toString()}`);
};

export const downloadRegistrationReportPDF = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.append(key, value);
    }
  });

  return await API.get(`/reports/registrations/pdf?${params.toString()}`, {
    responseType: "blob",
  });
};

export const getRegistrationSummary = async (academicYear = null) => {
  const params = academicYear ? { academic_year: academicYear } : {};
  return await API.get("/reports/registrations/summary", { params });
};

// ==============================
// HELPERS
// ==============================

export const downloadPDFBlob = (blob, filename = null) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    filename || `registration_report_${Date.now()}.pdf`
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const generateAndDownloadReport = async (filters = {}, filename = null) => {
  const response = await downloadRegistrationReportPDF(filters);
  downloadPDFBlob(response.data, filename);
  return { success: true };
};
