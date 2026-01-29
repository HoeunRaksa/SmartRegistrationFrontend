import API from "./index";

const extractData = (response) => {
  if (response?.data?.data !== undefined) return response.data.data;
  if (response?.data !== undefined) return response.data;
  return null;
};

// GET: Fetch all conversations (partners + groups)
export const fetchConversations = async () => {
  try {
    const response = await API.get("/conversations");
    const data = extractData(response);
    return { data: { data: Array.isArray(data) ? data : [] } };
  } catch (error) {
    console.error("fetchConversations error:", error);
    throw error;
  }
};

// GET: Fetch messages for a conversation OR user (backward compat)
export const fetchMessages = async (id, isConversation = true) => {
  try {
    const url = isConversation ? `/conversations/${id}/messages` : `/chat/${id}`;
    const response = await API.get(url);
    const data = extractData(response);

    return {
      data: {
        data: Array.isArray(data) ? data : []
      }
    };
  } catch (error) {
    console.error(`fetchMessages(${id}) error:`, error);
    throw error;
  }
};

// POST: Send a message (handles files)
export const sendMessage = async (id, content, attachments = [], isConversation = true) => {
  try {
    const url = isConversation ? `/conversations/${id}/messages` : `/chat/${id}`;
    const formData = new FormData();
    // Always append content, even if empty, to ensure backend doesn't crash on missing field
    formData.append("content", content || "");

    attachments.forEach((file) => {
      formData.append("files[]", file);
    });

    return await API.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error(`sendMessage(${id}) error:`, error);
    throw error;
  }
};

// POST: Create a group conversation
export const createGroup = async (title, userIds) => {
  try {
    const response = await API.post("/conversations/groups", { title, user_ids: userIds });
    return extractData(response);
  } catch (error) {
    console.error("createGroup error:", error);
    throw error;
  }
};

// DELETE: Deletes a message (soft delete)
export const deleteMessage = async (messageId) => {
  try {
    const response = await API.delete(`/messages/${messageId}`);
    return extractData(response);
  } catch (error) {
    console.error(`deleteMessage(${messageId}) error:`, error);
    throw error;
  }
};

// DELETE: Clear all messages in a conversation
export const clearConversation = async (conversationId) => {
  try {
    const response = await API.delete(`/conversations/${conversationId}/messages`);
    return extractData(response);
  } catch (error) {
    console.error(`clearConversation(${conversationId}) error:`, error);
    throw error;
  }
};

// PUT/POST: Add participants to group
export const addParticipants = async (conversationId, userIds) => {
  try {
    return await API.post(`/conversations/${conversationId}/participants`, { user_ids: userIds });
  } catch (error) {
    console.error("addParticipants error:", error);
    throw error;
  }
};

// DELETE: Remove participant
export const removeParticipant = async (conversationId, userId) => {
  try {
    return await API.delete(`/conversations/${conversationId}/participants/${userId}`);
  } catch (error) {
    console.error("removeParticipant error:", error);
    throw error;
  }
};

// GET: Fetch unread count
export const fetchUnreadCount = async () => {
  try {
    const response = await API.get("/student/messages/unread-count");
    return extractData(response);
  } catch (error) {
    console.error("fetchUnreadCount error:", error);
    return { unread_count: 0 };
  }
};

// GET: Fetch classmates/peers (student discovery)
export const fetchClassmates = async () => {
  try {
    const response = await API.get("/chat/classmates");
    return extractData(response);
  } catch (error) {
    console.error("fetchClassmates error:", error);
    throw error;
  }
};

// DELETE: Delete a conversation
export const deleteConversation = async (id) => {
  try {
    const response = await API.delete(`/conversations/${id}`);
    return extractData(response);
  } catch (error) {
    console.error(`deleteConversation(${id}) error:`, error);
    throw error;
  }
};
