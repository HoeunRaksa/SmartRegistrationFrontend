import API, { extractData } from "./index";

export const fetchTeacherProfile = async () => {
    try {
        const response = await API.get("/teacher/profile");
        return extractData(response);
    } catch (error) {
        throw error;
    }
};

export const updateTeacherProfile = async (formData) => {
    try {
        const response = await API.post("/teacher/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return extractData(response);
    } catch (error) {
        throw error;
    }
};
