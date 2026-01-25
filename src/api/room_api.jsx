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
// ROOMS
// ==============================

/**
 * GET: Fetch all rooms
 * @param {Object} params - Filter parameters
 * @param {number} params.building_id - Filter by building
 * @param {string} params.room_type - Filter by room type
 * @param {boolean} params.is_available - Filter by availability
 * @param {string} params.search - Search term
 */
export const fetchAllRooms = async (params = {}) => {
  try {
    const response = await API.get("/admin/rooms", { params });
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : [],
        total: response.data?.total || 0,
      },
    };
  } catch (error) {
    console.error("fetchAllRooms error:", error);
    throw error;
  }
};

/**
 * GET: Fetch single room by ID
 * @param {number} roomId - Room ID
 */
export const fetchRoom = async (roomId) => {
  try {
    return await API.get(`/admin/rooms/${roomId}`);
  } catch (error) {
    console.error("fetchRoom error:", error);
    throw error;
  }
};

/**
 * POST: Create a new room
 * @param {Object} roomData - Room data
 * @param {number} roomData.building_id - Building ID
 * @param {string} roomData.room_number - Room number
 * @param {string} roomData.room_name - Room name (optional)
 * @param {string} roomData.room_type - Room type
 * @param {number} roomData.capacity - Capacity (optional)
 * @param {number} roomData.floor - Floor number (optional)
 * @param {Array} roomData.facilities - Facilities array (optional)
 * @param {boolean} roomData.is_available - Available status (optional)
 */
export const createRoom = async (roomData) => {
  try {
    return await API.post("/admin/rooms", roomData);
  } catch (error) {
    console.error("createRoom error:", error);
    throw error;
  }
};

/**
 * PUT: Update an existing room
 * @param {number} roomId - Room ID
 * @param {Object} roomData - Updated room data
 */
export const updateRoom = async (roomId, roomData) => {
  try {
    return await API.put(`/admin/rooms/${roomId}`, roomData);
  } catch (error) {
    console.error("updateRoom error:", error);
    throw error;
  }
};

/**
 * DELETE: Delete a room
 * @param {number} roomId - Room ID
 */
export const deleteRoom = async (roomId) => {
  try {
    return await API.delete(`/admin/rooms/${roomId}`);
  } catch (error) {
    console.error("deleteRoom error:", error);
    throw error;
  }
};

/**
 * GET: Fetch room options for dropdown
 * @param {Object} params - Filter parameters
 * @param {number} params.building_id - Filter by building
 * @param {string} params.room_type - Filter by room type
 */
export const fetchRoomOptions = async (params = {}) => {
  try {
    const response = await API.get("/admin/rooms/options", { params });
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : [],
      },
    };
  } catch (error) {
    console.error("fetchRoomOptions error:", error);
    throw error;
  }
};

/**
 * GET: Fetch rooms by building
 * @param {number} buildingId - Building ID
 */
export const fetchRoomsByBuilding = async (buildingId) => {
  try {
    const response = await API.get(`/admin/rooms/by-building/${buildingId}`);
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : [],
        building: response.data?.building || {},
        total: response.data?.total || 0,
      },
    };
  } catch (error) {
    console.error("fetchRoomsByBuilding error:", error);
    throw error;
  }
};

/**
 * POST: Check room availability
 * @param {Object} params - Check parameters
 * @param {number} params.room_id - Room ID
 * @param {string} params.day_of_week - Day of week
 * @param {string} params.start_time - Start time (HH:mm)
 * @param {string} params.end_time - End time (HH:mm)
 * @param {number} params.exclude_schedule_id - Schedule ID to exclude (optional)
 */
export const checkRoomAvailability = async (params) => {
  try {
    return await API.post("/admin/rooms/check-availability", params);
  } catch (error) {
    console.error("checkRoomAvailability error:", error);
    throw error;
  }
};