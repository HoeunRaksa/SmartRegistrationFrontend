import PaymentAPI from "./paymentClient";

// ==============================
// ANTI-429 (dedupe + retry)
// ==============================
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const inflight = new Map();

const postOnce = async (url, body = {}) => {
  const key = `${url}:${JSON.stringify(body)}`;

  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const promise = (async () => {
    let attempt = 0;
    while (true) {
      try {
        return await PaymentAPI.post(url, body);
      } catch (err) {
        if (err?.response?.status === 429 && attempt < 3) {
          attempt += 1;
          const retryAfter = err?.response?.headers?.["retry-after"];
          const waitMs = retryAfter
            ? Math.min(Number(retryAfter) * 1000, 10_000)
            : 800 * attempt;
          await sleep(waitMs);
          continue;
        }
        throw err;
      }
    }
  })();

  inflight.set(key, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(key);
  }
};

const getOnce = async (url) => {
  if (inflight.has(url)) {
    return inflight.get(url);
  }

  const promise = (async () => {
    let attempt = 0;
    while (true) {
      try {
        return await PaymentAPI.get(url);
      } catch (err) {
        if (err?.response?.status === 429 && attempt < 3) {
          attempt += 1;
          const retryAfter = err?.response?.headers?.["retry-after"];
          const waitMs = retryAfter
            ? Math.min(Number(retryAfter) * 1000, 10_000)
            : 800 * attempt;
          await sleep(waitMs);
          continue;
        }
        throw err;
      }
    }
  })();

  inflight.set(url, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(url);
  }
};

// ==============================
// PAYMENT API
// ==============================
export const generatePaymentQR = (registrationId) =>
  postOnce("/payment/generate-qr", { registration_id: registrationId });

export const checkPaymentStatus = (tranId) =>
  getOnce(`/payment/check-status/${tranId}`);

export const getRegistrationPayment = (registrationId) =>
  getOnce(`/payment/registration/${registrationId}`);

export const fetchStudentPayments = () =>
  getOnce("/student/payments");
