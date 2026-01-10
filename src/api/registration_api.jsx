import API from "../api/index";

export const submitRegistration = (formData) =>
  API.post("/register/save", formData);
