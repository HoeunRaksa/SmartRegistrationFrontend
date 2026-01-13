import API from './index';

/**
 * Generate QR code for registration payment
 * @param {number} registrationId - The registration ID
 * @returns {Promise} API response with QR code
 */
export const generatePaymentQR = async (registrationId) => {
  return await API.post('/payment/generate-qr', {
    registration_id: registrationId
  });
};

/**
 * Check payment status by transaction ID
 * @param {string} tranId - Transaction ID
 * @returns {Promise} API response with payment status
 */
export const checkPaymentStatus = async (tranId) => {
  return await API.get(`/payment/check-status/${tranId}`);
};

/**
 * Get payment details for a registration
 * @param {number} registrationId - The registration ID
 * @returns {Promise} API response with payment info
 */
export const getRegistrationPayment = async (registrationId) => {
  return await API.get(`/payment/registration/${registrationId}`);
};