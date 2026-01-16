import API from "../api/index";
export const loginApi = (data) => API.post('/login', data);
export const logoutApi = () => API.post('/logout');
export default API;
