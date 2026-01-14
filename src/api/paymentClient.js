import axios from 'axios';

const PaymentAPI = axios.create({
  baseURL: 'https://study.learner-teach.online/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default PaymentAPI;
