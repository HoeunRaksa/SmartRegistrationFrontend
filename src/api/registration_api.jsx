// ==============================
// registration_api.jsx (FULL, CLEAN, CONSISTENT) ✅ NO CUT
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
// PAY LATER
// backend route: POST /registrations/{id}/pay-later
// payload supports: { pay_plan, semester, amount }
// ==============================
export const payLater = (id, payload = {}) =>
  API.post(`/registrations/${id}/pay-later`, payload);

// ==============================
// ✅ GENERATE QR (ONE TRUE FUNCTION)
// backend route: POST /payment/generate-qr
// payload supports: { pay_plan, semester, amount }
// ==============================
export const generatePaymentQR = (registrationId, payload = {}) =>
  PaymentAPI.post("/payment/generate-qr", {
    registration_id: registrationId,
    ...payload,
  });

// ✅ Admin Generate QR (use same function)
export const adminGenerateQr = (id, payload = {}) => generatePaymentQR(id, payload);

// ==============================
// ✅ ADMIN CASH PAYMENT
// backend route example: POST /admin/registrations/{id}/mark-paid-cash
// payload supports: { pay_plan, semester, amount }
// ==============================
export const markPaidCash = (registrationId, payload = {}) => {
  return API.post(`/admin/registrations/${registrationId}/mark-paid-cash`, {
    ...payload,
    semester: Number(payload.semester || 1),
  });
};


// ==============================
// PAYMENT STATUS
// ==============================
export const checkPaymentStatus = (tranId) =>
  PaymentAPI.get(`/payment/check-status/${tranId}`);

export const getRegistrationPayment = (registrationId) =>
  PaymentAPI.get(`/payment/registration/${registrationId}`);

// ==============================
// REPORTS
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

export const checkMajorCapacity = (majorId, academicYear) =>
  API.get(`/majors/${majorId}/capacity`, {
    params: { academic_year: academicYear },
  });

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
