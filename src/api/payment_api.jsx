import PaymentAPI from "./paymentClient";

// ==============================
// PAYMENT API
// ==============================

export const generatePaymentQR = (registrationId) =>
  PaymentAPI.post("/payment/generate-qr", { registration_id: registrationId });

export const checkPaymentStatus = (tranId) =>
  PaymentAPI.get(`/payment/check-status/${tranId}`);

export const getRegistrationPayment = (registrationId) =>
  PaymentAPI.get(`/payment/registration/${registrationId}`);

export const fetchStudentPayments = () =>
  PaymentAPI.get("/student/payments");
