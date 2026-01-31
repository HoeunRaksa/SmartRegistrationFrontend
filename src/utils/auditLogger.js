import API from "./index";

/**
 * Frontend Activity Logger
 * Use this utility to log sensitive actions directly from the frontend to the backend audit log.
 * This is useful when you need to capture user intent or frontend-specific context that the API might not catch automatically.
 * 
 * @param {string} action - The action name (e.g., 'EXPORT_DATA', 'VIEW_SENSITIVE_INFO')
 * @param {string} module - The part of the system (e.g., 'STUDENTS', 'GRADES')
 * @param {string|object} details - Description or data object of what happened
 * @param {string} status - 'success', 'failed', 'warning'
 */
export const logActivity = async (action, module, details = "", status = "success") => {
    try {
        // Prepare payload
        const payload = {
            action: action.toUpperCase(),
            module: module.toUpperCase(),
            details: typeof details === 'object' ? JSON.stringify(details) : details,
            status: status,
            timestamp: new Date().toISOString(),
            url: window.location.href, // Capture where it happened
            user_agent: navigator.userAgent
        };

        // Fire and forget - don't await this in the main UI thread unless critical
        // We use a specific endpoint for frontend-reported logs
        API.post("/audit-logs/report", payload).catch(err => {
            console.warn("Failed to send frontend audit log", err);
        });

        // Optional: In development, log to console
        if (import.meta.env.DEV) {
            console.groupCollapsed(`[Audit Log] ${action}`);
            console.log("Module:", module);
            console.log("Details:", details);
            console.table(payload);
            console.groupEnd();
        }

    } catch (error) {
        console.error("Audit Logging Error:", error);
    }
};

/**
 * Hook to automatically log page views or component mounts
 * @param {string} pageName 
 */
export const usePageAudit = (pageName) => {
    // This could be implemented as a React hook
    // useEffect(() => { logActivity('VIEW_PAGE', 'NAVIGATION', `Viewed ${pageName}`); }, []);
};
