import PaymentAPI from './paymentClient';

export const generatePaymentQR = (registrationId) => {
  return PaymentAPI.post('/generate-qr', {
    registration_id: registrationId,
  });
};

export const checkPaymentStatus = (tranId) => {
  return PaymentAPI.get(`/payment/check-status/${tranId}`);
};

export const getRegistrationPayment = (registrationId) => {
  return PaymentAPI.get(`/payment/registration/${registrationId}`);
};
