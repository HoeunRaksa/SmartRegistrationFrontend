import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL + "/majors";

// GET: Fetch all majors
export const fetchMajors = () => {
  return axios.get(API_URL);
};

// GET: Fetch single major by ID
export const fetchMajor = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// POST: Create new major
export const createMajor = (data) => {
  return axios.post(API_URL, data);
};

// PUT: Update existing major
export const updateMajor = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

// DELETE: Delete major
export const deleteMajor = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};