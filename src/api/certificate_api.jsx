import API from "./index";

/**
 * Certificate Requests API
 */

const extractData = (response) => {
    if (response?.data?.data !== undefined) return response.data.data;
    if (response?.data !== undefined) return response.data;
    return null;
};

// GET: Fetch all certificate requests for student
export const fetchCertificateRequests = async () => {
    try {
        const response = await API.get("/student/certificate-requests");
        const data = extractData(response);
        return {
            data: {
                data: Array.isArray(data) ? data : []
            }
        };
    } catch (error) {
        console.error("fetchCertificateRequests error:", error);
        throw error;
    }
};

// POST: Submit a new certificate request
export const submitCertificateRequest = async (data) => {
    try {
        const response = await API.post("/student/certificate-requests", data);
        return response;
    } catch (error) {
        console.error("submitCertificateRequest error:", error);
        throw error;
    }
};

// GET: Fetch a single certificate request
export const fetchCertificateRequest = async (id) => {
    try {
        const response = await API.get(`/student/certificate-requests/${id}`);
        return response;
    } catch (error) {
        console.error(`fetchCertificateRequest(${id}) error:`, error);
        throw error;
    }
};
