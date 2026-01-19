// ==============================
// registration_api.jsx (FULL, CLEAN, NO REDUNDANCY)
// ==============================
import API from "./index";
import PaymentAPI from "./paymentClient";

// ==============================
// REGISTRATION CRUD (STAFF/ADMIN)
// backend routes: /registers
// ==============================
export const fetchRegistrations = (params = {}) => API.get("/registers", { params });
export const fetchRegistrationById = (id) => API.get(`/registers/${id}`);

export const searchRegistrations = (searchTerm, status = "all") => {
  const params = {};
  if (searchTerm) params.search = searchTerm;
  if (status !== "all") params.payment_status = status;
  return API.get("/registers", { params });
};

// Public route for student self register
export const submitRegistration = (formData) =>
  API.post("/register/save", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateRegistration = (id, formData) =>
  API.put(`/registers/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteRegistration = (id) => API.delete(`/registers/${id}`);

// ==============================
// PAY LATER (NEW OPTION)
// backend route: POST /registrations/{id}/pay-later
// ==============================
export const payLater = (id) => API.post(`/registrations/${id}/pay-later`);
export const adminGenerateQr = (registrationId) => {
  return PaymentAPI.post("/payment/generate-qr", { registration_id: registrationId });
};


// ==============================
// ADMIN CASH PAYMENT (OPTIONAL)
// backend route: POST /admin/registrations/{id}/mark-paid
// ==============================
export const markPaidCash = (id) => API.post(`/admin/registrations/${id}/mark-paid`);

// ==============================
// REGISTRATION REPORTS
// ==============================
export const generateRegistrationReport = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") params.append(k, v);
  });
  return API.get(`/reports/registrations?${params.toString()}`);
};

export const downloadRegistrationReportPDF = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") params.append(k, v);
  });
  return API.get(`/reports/registrations/pdf?${params.toString()}`, {
    responseType: "blob",
  });
};

export const getRegistrationSummary = (academicYear = null) => {
  const params = academicYear ? { academic_year: academicYear } : {};
  return API.get("/reports/registrations/summary", { params });
};

// ==============================
// HELPERS
// ==============================
export const downloadPDFBlob = (blob, filename = null) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename || `registration_report_${Date.now()}.pdf`);
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

// ==============================
// PAYMENT (QR)
// ==============================
export const generatePaymentQR = (registrationId) =>
  PaymentAPI.post("/payment/generate-qr", { registration_id: registrationId });

export const checkPaymentStatus = (tranId) =>
  PaymentAPI.get(`/payment/check-status/${tranId}`);

export const getRegistrationPayment = (registrationId) =>
  PaymentAPI.get(`/payment/registration/${registrationId}`);
