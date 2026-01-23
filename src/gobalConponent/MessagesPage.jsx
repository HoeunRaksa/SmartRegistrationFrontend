import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Search,
  Plus,
  Paperclip,
  MessageCircle,
  Loader,
} from "lucide-react";
import { fetchConversations, fetchMessages, sendMessage } from "../api/message_api";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);

  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages(selectedConversation.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const mapServerMessageToUI = (m) => {
    const senderId = m.s_id ?? m.sender_id;
    const content = m.content ?? m.message;

    return {
      id: m.id,
      sender_id: senderId,
      sender_name:
        m.sender_name ||
        (senderId === currentUser.id ? currentUser.name : selectedConversation?.name || "User"),
      message: content,
      created_at: m.created_at,
      is_mine: senderId === currentUser.id,
      attachments: m.attachments || [],
    };
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await fetchConversations();
      const list = res?.data?.data || [];
      setConversations(list);

      if (list.length > 0 && !selectedConversation) {
        setSelectedConversation(list[0]);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const res = await fetchMessages(userId);
      const data = res?.data?.data || [];
      setMessages(Array.isArray(data) ? data.map(mapServerMessageToUI) : []);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setMessages([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation?.id) return;

    const contentToSend = newMessage.trim();
    const tempId = `tmp-${Date.now()}`;

    // optimistic UI (show message immediately)
    const optimistic = {
      id: tempId,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      message: contentToSend,
      created_at: new Date().toISOString(),
      is_mine: true,
      attachments: [],
    };

    setMessages((prev) => [...prev, optimistic]);

    // update sidebar last message immediately
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id
          ? { ...c, last_message: contentToSend, last_message_time: new Date().toISOString() }
          : c
      )
    );

    setNewMessage("");

    try {
      setSending(true);

      // ✅ Your backend expects POST /chat/{userId} with content
      const res = await sendMessage(selectedConversation.id, contentToSend);

      // If backend returns created message, replace optimistic
      const serverMsg = res?.data;
      if (serverMsg?.id) {
        const mapped = mapServerMessageToUI(serverMsg);
        setMessages((prev) => prev.map((m) => (m.id === tempId ? mapped : m)));
      }
    } catch (error) {
      console.error("Failed to send message:", error);

      // rollback optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setNewMessage(contentToSend);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const name = (conv.name || "").toLowerCase();
    const course = (conv.course || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || course.includes(q);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 h-[calc(100vh-120px)]">
      <div className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg h-full overflow-hidden flex flex-col md:flex-row">
        {/* Conversations List */}
        <div className="w-full md:w-1/3 border-r border-white/40 flex flex-col">
          {/* Search Header */}
          <div className="p-4 border-b border-white/40">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex-1">Messages</h2>
              <button
                onClick={() => setShowNewConversation(true)}
                className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-gray-500">
                <MessageCircle className="w-12 h-12 mb-3 opacity-50" />
                <p className="font-semibold">No conversations</p>
                <p className="text-sm text-center">Start a new conversation</p>
              </div>
            ) : (
              filteredConversations.map((conversation, index) => (
                <motion.button
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-4 border-b border-white/20 hover:bg-white/60 transition-all text-left ${
                    selectedConversation?.id === conversation.id ? "bg-white/80" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {conversation.name?.[0] || "U"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        {conversation.unread_count > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-semibold">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 mb-1">
                        {conversation.role} {conversation.course && `• ${conversation.course}`}
                      </p>

                      <p className="text-sm text-gray-700 truncate">
                        {conversation.last_message}
                      </p>

                      {conversation.last_message_time && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(conversation.last_message_time).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="w-full md:w-2/3 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/40 bg-gradient-to-r from-blue-500 to-purple-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white font-bold">
                    {selectedConversation.name?.[0] || "U"}
                  </div>
                  <div className="text-white">
                    <h3 className="font-bold">{selectedConversation.name}</h3>
                    <p className="text-sm opacity-90">
                      {selectedConversation.role}{" "}
                      {selectedConversation.course && `• ${selectedConversation.course}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex ${message.is_mine ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${message.is_mine ? "order-2" : "order-1"}`}>
                      <div
                        className={`rounded-2xl p-4 ${
                          message.is_mine
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-white/80 text-gray-900"
                        }`}
                      >
                        {!message.is_mine && (
                          <p className="text-xs font-semibold mb-1 opacity-70">
                            {message.sender_name}
                          </p>
                        )}
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${message.is_mine ? "text-right" : "text-left"}`}>
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/40">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 rounded-xl hover:bg-white/60 transition-all text-gray-600"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />

                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold">Select a conversation</p>
                <p className="text-sm">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
