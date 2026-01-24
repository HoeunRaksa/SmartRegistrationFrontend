import API from "./index";

// ==============================
// SCHEDULE API
// ==============================

/**
 * Helper function to safely extract data from API response
 */
const extractData = (response) => {
  if (response?.data?.data !== undefined) return response.data.data;
  if (response?.data !== undefined) return response.data;
  return null;
};

// GET: Fetch student's schedule/timetable
export const fetchStudentSchedule = async () => {
  const response = await API.get("/student/schedule");
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

// GET: Fetch schedule for a specific week
export const fetchWeekSchedule = async (weekStart) => {
  const response = await API.get("/student/schedule/week", {
    params: { start_date: weekStart },
  });
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

// GET: Fetch today's schedule
export const fetchTodaySchedule = async () => {
  const response = await API.get("/student/schedule/today");
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

// GET: Fetch upcoming classes
export const fetchUpcomingClasses = async () => {
  const response = await API.get("/student/schedule/upcoming");
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};

// GET: Download schedule as PDF
export const downloadSchedule = async () => {
  return await API.get("/student/schedule/download", { responseType: "blob" });
};

// GET: Fetch academic calendar events
export const fetchAcademicCalendar = async () => {
  const response = await API.get("/student/calendar");
  const data = extractData(response);
  return { data: { data: Array.isArray(data) ? data : [] } };
};
