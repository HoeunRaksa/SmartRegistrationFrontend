import API from "./index";
import { cachedGet } from "../utils/requestCache";

/**
 * Admin Dashboard API
 * Fetches university-wide statistics and chart data
 */
const AdminDashboardAPI = {
    /**
     * Get all dashboard stats (Header stats + Charts + Activities)
     * GET /api/admin/dashboard/stats
     */
    getStats: async () => {
        const url = "/admin/dashboard/stats";
        return cachedGet(() => API.get(url), `GET:${url}`, 10_000); // 10s short cache
    },

    /**
     * Helper to process the API response
     */
    processStats: (response) => {
        if (response?.data?.data) {
            return response.data.data;
        }
        return null;
    }
};

export default AdminDashboardAPI;
