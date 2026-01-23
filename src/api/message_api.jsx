import API from "./index";

/**
 * Helper function to safely extract data from API response
 */
const extractData = (response) => {
  if (response?.data?.data !== undefined) return response.data.data;
  if (response?.data !== undefined) return response.data;
  return null;
};

// ==============================
// REAL CHAT API (matches your Laravel)
// Routes:
//   GET  /conversations
//   GET  /chat/{userId}
//   POST /chat/{userId}
//   POST /chat/{userId}/read   (optional if you add it)
// ==============================

// GET: Fetch all conversations (partners list)
export const fetchConversations = async () => {
  try {
    const response = await API.get("/conversations");
    const data = extractData(response);

    console.log(data);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchConversations error:", error);
    throw error;
  }
};

// GET: Fetch messages with a specific userId
// NOTE: your UI uses "conversationId", but in your backend it is actually "userId"
export const fetchMessages = async (userId) => {
  try {
    const response = await API.get(`/chat/${userId}`);
    const data = extractData(response);

    // Backend returns Message model fields: {id, s_id, r_id, content, created_at, attachments...}
    // Your UI expects: {id, sender_id, sender_name, message, created_at, is_mine}
    // If your backend already maps this shape, remove this mapping.
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const mapped = Array.isArray(data)
      ? data.map((m) => ({
          id: m.id,
          sender_id: m.s_id ?? m.sender_id,
          sender_name: m.sender_name, // may be undefined unless backend provides it
          message: m.content ?? m.message,
          created_at: m.created_at,
          is_mine: (m.s_id ?? m.sender_id) === currentUser.id,
          attachments: m.attachments || [],
        }))
      : [];

    return {
      data: {
        data: mapped
      }
    };
  } catch (error) {
    console.error(`fetchMessages(${userId}) error:`, error);
    throw error;
  }
};

// POST: Send a message to userId
// Backend expects: content + files[]  (your controller validates files.*)
export const sendMessage = async (userId, content, attachments = []) => {
  try {
    const formData = new FormData();
    if (content !== undefined && content !== null) formData.append("content", content);

    // IMPORTANT: must be files[] because backend validates `files.*`
    attachments.forEach((file) => {
      formData.append("files[]", file);
    });

    const response = await API.post(`/chat/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response;
  } catch (error) {
    console.error(`sendMessage(${userId}) error:`, error);
    throw error;
  }
};

// OPTIONAL: Mark messages as read (only if you add this route in Laravel)
// Route suggestion: POST /chat/{userId}/read
export const markAsRead = async (userId) => {
  try {
    const response = await API.post(`/chat/${userId}/read`);
    return response;
  } catch (error) {
    console.error(`markAsRead(${userId}) error:`, error);
    throw error;
  }
};

// --- These endpoints do NOT exist in your current Laravel code ---
// Keep them only if you have them on backend. Otherwise remove or leave as stubs.

export const createConversation = async () => {
  throw new Error("createConversation is not supported: you don't have conversations table/API. A 'conversation' is just a userId in your current design.");
};

export const deleteConversation = async () => {
  throw new Error("deleteConversation is not supported: you don't have conversations table/API.");
};

export const fetchUnreadCount = async () => {
  throw new Error("fetchUnreadCount is not supported unless you build an API for it.");
};

export const searchMessages = async () => {
  throw new Error("searchMessages is not supported unless you build an API for it.");
};

export const fetchAvailableRecipients = async () => {
  throw new Error("fetchAvailableRecipients is not supported unless you build an API for it.");
};
