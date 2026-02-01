import PaymentAPI from "./paymentClient";

// ==============================
// PAYMENT API
// ==============================

export const generatePaymentQR = (registrationId, semester, payPlan) =>
  PaymentAPI.post("/payment/generate-qr", {
    registration_id: registrationId,
    semester,
    pay_plan: payPlan
  });

export const checkPaymentStatus = (tranId) =>
  PaymentAPI.get(`/payment/check-status/${tranId}`);

export const getRegistrationPayment = (registrationId) =>
  PaymentAPI.get(`/payment/registration/${registrationId}`);

export const fetchStudentPayments = () =>
  PaymentAPI.get("/student/payments");
