import API from "./index";

// ==============================
// SCHEDULE API
// ==============================

/**
 * Helper function to safely extract data from API response
 */
const extractData = (response) => {
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }
  if (response?.data !== undefined) {
    return response.data;
  }
  return null;
};

// GET: Fetch student's schedule/timetable
export const fetchStudentSchedule = async () => {
  try {
    const response = await API.get("/student/schedule");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchStudentSchedule error:", error);
    throw error;
  }
};

// GET: Fetch schedule for a specific week
export const fetchWeekSchedule = async (weekStart) => {
  try {
    const response = await API.get("/student/schedule/week", {
      params: { start_date: weekStart }
    });
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchWeekSchedule error:", error);
    throw error;
  }
};

// GET: Fetch today's schedule
export const fetchTodaySchedule = async () => {
  try {
    const response = await API.get("/student/schedule/today");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchTodaySchedule error:", error);
    throw error;
  }
};

// GET: Fetch upcoming classes
export const fetchUpcomingClasses = async () => {
  try {
    const response = await API.get("/student/schedule/upcoming");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchUpcomingClasses error:", error);
    throw error;
  }
};

// GET: Download schedule as PDF
export const downloadSchedule = async () => {
  try {
    const response = await API.get("/student/schedule/download", {
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    console.error("downloadSchedule error:", error);
    throw error;
  }
};

// GET: Fetch academic calendar events
export const fetchAcademicCalendar = async () => {
  try {
    const response = await API.get("/student/calendar");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchAcademicCalendar error:", error);
    throw error;
  }
};
