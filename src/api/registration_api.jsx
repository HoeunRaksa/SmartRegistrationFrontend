// ==============================
// ✅ registration_api.js (NO ENDPOINT CHANGES)
// src/api/registration_api.js
// ==============================
import API from "./index";
import PaymentAPI from "./paymentClient";
import { cachedGet, invalidateCache } from "../utils/requestCache";

// ==============================
// REGISTRATION CRUD (STAFF/ADMIN)
// backend routes: /registers
// ==============================
export const fetchRegistrations = (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params || {})
      .filter(([, v]) => v !== null && v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  const key = `GET:/registers${qs ? `?${qs}` : ""}`;
  return cachedGet(() => API.get("/registers", { params }), key, 15_000);
};

export const fetchRegistrationById = (id) => {
  const url = `/registers/${id}`;
  return cachedGet(() => API.get(url), `GET:${url}`, 30_000);
};

export const searchRegistrations = (searchTerm, status = "all") => {
  const params = {};
  if (searchTerm) params.search = searchTerm;
  if (status !== "all") params.payment_status = status;

  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();

  const key = `GET:/registers${qs ? `?${qs}` : ""}`;
  return cachedGet(() => API.get("/registers", { params }), key, 10_000);
};

// Public route for student self register
export const submitRegistration = async (formData) => {
  const res = await API.post("/register/save", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  invalidateCache("GET:/registers");
  return res;
};

export const updateRegistration = async (id, formData) => {
  const res = await API.put(`/registers/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  invalidateCache("GET:/registers");
  invalidateCache(`GET:/registers/${id}`);
  return res;
};

export const deleteRegistration = async (id) => {
  const res = await API.delete(`/registers/${id}`);
  invalidateCache("GET:/registers");
  invalidateCache(`GET:/registers/${id}`);
  return res;
};

// ==============================
// PAY LATER
// backend route: POST /registrations/{id}/pay-later
// ==============================
export const payLater = (id, payload = {}) => {
  // no caching for POST
  return API.post(`/registrations/${id}/pay-later`, payload);
};

// ==============================
// ✅ GENERATE QR
// backend route: POST /payment/generate-qr
// ==============================
export const generatePaymentQR = (registrationId, payload = {}) =>
  PaymentAPI.post("/payment/generate-qr", {
    registration_id: registrationId,
    ...payload,
    ...(payload?.semester !== undefined ? { semester: Number(payload.semester) } : {}),
  });

export const adminGenerateQr = (id, payload = {}) => generatePaymentQR(id, payload);

// ==============================
// ✅ ADMIN CASH PAYMENT
// backend route: POST /admin/registrations/{id}/mark-paid-cash
// ==============================
export const markPaidCash = (registrationId, payload = {}) => {
  const finalPayload = typeof payload === "number" ? { semester: payload } : { ...payload };

  return API.post(`/admin/registrations/${registrationId}/mark-paid-cash`, {
    ...finalPayload,
    semester: Number(finalPayload.semester || 1),
  });
};

// ==============================
// PAYMENT STATUS (do not cache)
// ==============================
export const checkPaymentStatus = (tranId) => PaymentAPI.get(`/payment/check-status/${tranId}`);
export const getRegistrationPayment = (registrationId) => PaymentAPI.get(`/payment/registration/${registrationId}`);

// ==============================
// REPORTS (optional cache short, but safe to not cache)
// ==============================
export const generateRegistrationReport = (filters = {}) => {
  const params = {};
  Object.entries(filters || {}).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") params[k] = v;
  });

  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();

  const key = `GET:/reports/registrations${qs ? `?${qs}` : ""}`;
  return cachedGet(() => API.get("/reports/registrations", { params }), key, 15_000);
};

export const downloadRegistrationReportPDF = (filters = {}) => {
  const params = {};
  Object.entries(filters || {}).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") params[k] = v;
  });

  // no cache (blob download)
  return API.get("/reports/registrations/pdf", { params, responseType: "blob" });
};

export const getRegistrationSummary = (filters = {}) => {
  const params = {};
  Object.entries(filters || {}).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") params[k] = v;
  });

  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();

  const key = `GET:/reports/registrations/summary${qs ? `?${qs}` : ""}`;
  return cachedGet(() => API.get("/reports/registrations/summary", { params }), key, 15_000);
};

export const checkMajorCapacity = (majorId, academicYear) =>
  API.get(`/majors/${majorId}/capacity`, { params: { academic_year: academicYear } });

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

export const canRegister = (majorId, academicYear) =>
  API.get("/registrations/can-register", {
    params: { major_id: majorId, academic_year: academicYear },
  });
