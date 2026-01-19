import axios from 'axios';

const PaymentAPI = axios.create({
  baseURL: 'https://study.learner-teach.online/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
PaymentAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default PaymentAPI;
