import API, { extractData } from "./index";

// GET: Fetch audit logs with filters
export const fetchAuditLogs = async (params = {}) => {
    try {
        const response = await API.get("/audit-logs", { params });
        // Expecting Laravel paginate response or standard data array
        return extractData(response);
    } catch (error) {
        console.error("fetchAuditLogs error:", error);
        throw error;
    }
};

// GET: Fetch specific log details
export const fetchAuditLogById = async (id) => {
    try {
        const response = await API.get(`/audit-logs/${id}`);
        return extractData(response);
    } catch (error) {
        console.error("fetchAuditLogById error:", error);
        throw error;
    }
};

// GET: Fetch audit stats (optional, for dashboard widgets)
export const fetchAuditStats = async () => {
    try {
        const response = await API.get("/audit-logs/stats");
        return extractData(response);
    } catch (error) {
        console.error("fetchAuditStats error:", error);
        return null;
    }
}
