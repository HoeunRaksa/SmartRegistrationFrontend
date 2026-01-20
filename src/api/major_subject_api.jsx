import API from "./index";

const extract = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const fetchMajorSubjects = async () => {
  const res = await API.get("/major-subjects");
  const data = extract(res);
  return { data: Array.isArray(data) ? data : [] };
};

export const createMajorSubject = (payload) => {
  return API.post("/major-subjects", payload);
};

export const createMajorSubjectsBulk = (payload) => {
  return API.post("major-subjects/bulk", payload);
};

export const deleteMajorSubject = (id) => API.delete(`/major-subjects/${id}`);
