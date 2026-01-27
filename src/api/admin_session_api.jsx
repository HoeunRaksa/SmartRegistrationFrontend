import API, { extractData } from "./index";

// GET: List all sessions
export const fetchAcademicSessions = async () => {
    try {
        const response = await API.get("/academic-sessions");
        return extractData(response);
    } catch (error) {
        console.error("Error fetching academic sessions:", error);
        throw error;
    }
};

// GET: Current Session
export const fetchCurrentSession = async () => {
    try {
        const response = await API.get("/academic-sessions/current");
        return extractData(response);
    } catch (error) {
        console.error("Error fetching current session:", error);
        return null; // Return null safely
    }
};

// POST: Create
export const createAcademicSession = async (data) => {
    try {
        const response = await API.post("/academic-sessions", data);
        return extractData(response);
    } catch (error) {
        console.error("Error creating academic session:", error);
        throw error;
    }
};

// PUT: Update
export const updateAcademicSession = async (id, data) => {
    try {
        const response = await API.put(`/academic-sessions/${id}`, data);
        return extractData(response);
    } catch (error) {
        console.error("Error updating academic session:", error);
        throw error;
    }
};

// DELETE: Delete
export const deleteAcademicSession = async (id) => {
    try {
        const response = await API.delete(`/academic-sessions/${id}`);
        return extractData(response);
    } catch (error) {
        console.error("Error deleting academic session:", error);
        throw error;
    }
};

// POST: Generate schedules
export const generateSessionSchedules = async (id) => {
    try {
        const response = await API.post(`/academic-sessions/${id}/generate`);
        return extractData(response);
    } catch (error) {
        console.error("Error generating schedules:", error);
        throw error;
    }
};
