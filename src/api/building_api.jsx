import API from "./index";

/**
 * Helper to safely extract backend data
 */
const extractData = (response) => {
  if (response?.data?.data !== undefined) return response.data.data;
  if (response?.data !== undefined) return response.data;
  return null;
};

// ==============================
// BUILDINGS
// ==============================

/**
 * GET: Fetch all buildings
 * @param {Object} params - Filter parameters
 * @param {boolean} params.is_active - Filter by active status
 * @param {string} params.search - Search term
 */
export const fetchAllBuildings = async (params = {}) => {
  try {
    const response = await API.get("/admin/buildings", { params });
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : [],
        total: response.data?.total || 0,
      },
    };
  } catch (error) {
    console.error("fetchAllBuildings error:", error);
    throw error;
  }
};

/**
 * GET: Fetch single building by ID
 * @param {number} buildingId - Building ID
 */
export const fetchBuilding = async (buildingId) => {
  try {
    return await API.get(`/admin/buildings/${buildingId}`);
  } catch (error) {
    console.error("fetchBuilding error:", error);
    throw error;
  }
};

/**
 * POST: Create a new building
 * @param {Object} buildingData - Building data
 * @param {string} buildingData.building_code - Building code (e.g., "A", "B")
 * @param {string} buildingData.building_name - Building name
 * @param {string} buildingData.description - Description (optional)
 * @param {string} buildingData.location - Location (optional)
 * @param {number} buildingData.total_floors - Total floors (optional)
 * @param {boolean} buildingData.is_active - Active status (optional)
 */
export const createBuilding = async (buildingData) => {
  try {
    return await API.post("/admin/buildings", buildingData);
  } catch (error) {
    console.error("createBuilding error:", error);
    throw error;
  }
};

/**
 * PUT: Update an existing building
 * @param {number} buildingId - Building ID
 * @param {Object} buildingData - Updated building data
 */
export const updateBuilding = async (buildingId, buildingData) => {
  try {
    return await API.put(`/admin/buildings/${buildingId}`, buildingData);
  } catch (error) {
    console.error("updateBuilding error:", error);
    throw error;
  }
};

/**
 * DELETE: Delete a building
 * @param {number} buildingId - Building ID
 */
export const deleteBuilding = async (buildingId) => {
  try {
    return await API.delete(`/admin/buildings/${buildingId}`);
  } catch (error) {
    console.error("deleteBuilding error:", error);
    throw error;
  }
};

/**
 * GET: Fetch building options for dropdown
 */
export const fetchBuildingOptions = async () => {
  try {
    const response = await API.get("/admin/buildings/options");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : [],
      },
    };
  } catch (error) {
    console.error("fetchBuildingOptions error:", error);
    throw error;
  }
};