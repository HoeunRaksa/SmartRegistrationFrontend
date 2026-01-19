import API from "./index";

// ==============================
// MESSAGE API
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

// GET: Fetch all conversations
export const fetchConversations = async () => {
  try {
    const response = await API.get("/student/messages/conversations");
    const data = extractData(response);
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

// GET: Fetch messages for a specific conversation
export const fetchMessages = async (conversationId) => {
  try {
    const response = await API.get(`/student/messages/conversations/${conversationId}`);
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error(`fetchMessages(${conversationId}) error:`, error);
    throw error;
  }
};

// POST: Send a message
export const sendMessage = async (conversationId, content, attachments = []) => {
  try {
    const formData = new FormData();
    formData.append('content', content);

    // Add attachments if any
    attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    const response = await API.post(
      `/student/messages/conversations/${conversationId}/messages`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    console.error(`sendMessage(${conversationId}) error:`, error);
    throw error;
  }
};

// POST: Create a new conversation
export const createConversation = async (recipientId, subject, content) => {
  try {
    const response = await API.post("/student/messages/conversations", {
      recipient_id: recipientId,
      subject,
      content
    });
    return response;
  } catch (error) {
    console.error("createConversation error:", error);
    throw error;
  }
};

// DELETE: Delete a conversation
export const deleteConversation = async (conversationId) => {
  try {
    const response = await API.delete(`/student/messages/conversations/${conversationId}`);
    return response;
  } catch (error) {
    console.error(`deleteConversation(${conversationId}) error:`, error);
    throw error;
  }
};

// PUT: Mark messages as read
export const markAsRead = async (conversationId) => {
  try {
    const response = await API.put(`/student/messages/conversations/${conversationId}/read`);
    return response;
  } catch (error) {
    console.error(`markAsRead(${conversationId}) error:`, error);
    throw error;
  }
};

// GET: Fetch unread message count
export const fetchUnreadCount = async () => {
  try {
    const response = await API.get("/student/messages/unread-count");
    return response;
  } catch (error) {
    console.error("fetchUnreadCount error:", error);
    throw error;
  }
};

// GET: Search messages
export const searchMessages = async (query) => {
  try {
    const response = await API.get("/student/messages/search", {
      params: { q: query }
    });
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("searchMessages error:", error);
    throw error;
  }
};

// GET: Fetch users for new conversation (instructors, staff, etc.)
export const fetchAvailableRecipients = async () => {
  try {
    const response = await API.get("/student/messages/recipients");
    const data = extractData(response);
    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error("fetchAvailableRecipients error:", error);
    throw error;
  }
};
