import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Search,
  Plus,
  Paperclip,
  MessageCircle,
  Loader,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
} from "lucide-react";
import { fetchConversations, fetchMessages, sendMessage } from "../api/message_api";
import { makeEcho } from "../echo";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const mapServerMessageToUI = (m) => {
    const senderId = m.s_id ?? m.sender_id;
    const content = m.content ?? m.message;

    return {
      id: m.id,
      sender_id: senderId,
      sender_name:
        m.sender_name ||
        (senderId === currentUser.id
          ? currentUser.name
          : selectedConversation?.name || "User"),
      message: content,
      created_at: m.created_at,
      is_mine: senderId === currentUser.id,
      attachments: m.attachments || [],
      _status: m._status, // "sending" | "sent" | "failed"
    };
  };

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages(selectedConversation.id);
      setShowChat(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (!currentUser?.id || !selectedConversation?.id) return;

    console.log("🚀 Starting Echo with user context");

    const a = Math.min(currentUser.id, selectedConversation.id);
    const b = Math.max(currentUser.id, selectedConversation.id);
    const channelName = `chat.${a}.${b}`;

    const echo = makeEcho(currentUser.id, selectedConversation.id);
    const pusher = echo.connector.pusher;

    pusher.connection.bind("connected", () => {
      console.log("✅ WS CONNECTED");
    });

    pusher.connection.bind("error", (e) => {
      console.error("❌ WS ERROR", e);
    });

    console.log("📡 Subscribing to:", channelName);

    const channel = echo.private(channelName);

    channel.subscription.bind("pusher:subscription_succeeded", () => {
      console.log("🔓 PRIVATE CHANNEL AUTHORIZED:", channelName);
    });

    channel.subscription.bind("pusher:subscription_error", (status) => {
      console.error("🚫 SUBSCRIPTION FAILED", status);
    });

    channel.listen(".message.sent", (event) => {
      console.log("🔥 MESSAGE EVENT RECEIVED", event);

      // Map the event payload to our UI format
      const incomingMessage = {
        id: event.id,
        sender_id: event.s_id,
        sender_name: event.s_id === currentUser.id ? currentUser.name : selectedConversation.name,
        message: event.content,
        created_at: event.created_at,
        is_mine: event.s_id === currentUser.id,
        attachments: event.attachments || [],
        _status: "sent",
      };

      // Only add if not already in messages (prevent duplicates from optimistic update)
      setMessages((prev) => {
        const exists = prev.some(m => m.id === event.id);
        if (exists) {
          console.log("⚠️ Message already exists, skipping");
          return prev;
        }
        console.log("✅ Adding new message to list");
        return [...prev, incomingMessage];
      });
    });

    return () => {
      console.log("🔌 Leaving channel:", channelName);
      echo.leave(channelName);
    };
  }, [currentUser?.id, selectedConversation?.id, selectedConversation?.name]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await fetchConversations();
      const list = res?.data?.data || [];
      setConversations(list);
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

    const optimistic = {
      id: tempId,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      message: contentToSend,
      created_at: new Date().toISOString(),
      is_mine: true,
      attachments: [],
      _status: "sending",
    };

    setMessages((prev) => [...prev, optimistic]);

    setConversations((prev) => {
      const updated = prev.map((c) =>
        c.id === selectedConversation.id
          ? {
            ...c,
            last_message: contentToSend,
            last_message_time: new Date().toISOString(),
            unread_count: 0,
          }
          : c
      );
      const idx = updated.findIndex((c) => c.id === selectedConversation.id);
      if (idx > 0) {
        const [item] = updated.splice(idx, 1);
        updated.unshift(item);
      }
      return updated;
    });

    setNewMessage("");

    try {
      setSending(true);
      const res = await sendMessage(selectedConversation.id, contentToSend);
      const serverMsg = res?.data;

      if (serverMsg?.id) {
        const mapped = mapServerMessageToUI(serverMsg);
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...mapped, _status: "sent" } : m))
        );
      } else {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, _status: "sent" } : m))
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, _status: "failed" } : m))
      );
      setNewMessage(contentToSend);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return conversations.filter((conv) => {
      const name = (conv.name || "").toLowerCase();
      const course = (conv.course || "").toLowerCase();
      return name.includes(q) || course.includes(q);
    });
  }, [conversations, searchQuery]);

  const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatListTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    return sameDay ? formatTime(iso) : d.toLocaleDateString();
  };

  const initials = (name) => {
    const n = (name || "").trim();
    if (!n) return "U";
    const parts = n.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
  };

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
    <div className="h-[calc(100vh-120px)] md:p-6">
      <div className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex">
        {/* LEFT: sidebar */}
        <div
          className={`w-full md:w-[360px] border-r border-slate-200 flex flex-col ${showChat ? "hidden md:flex" : "flex"
            }`}
        >
          <div className="px-4 pt-4 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                {initials(currentUser?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 truncate">
                  {currentUser?.name || "Messages"}
                </div>
                <div className="text-xs text-slate-500 truncate">Online</div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
                title="New chat"
                onClick={() => document.getElementById("chat-search")?.focus()}
              >
                <Plus className="w-5 h-5 text-slate-700" />
              </motion.button>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="mt-3 relative"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10"
              >
                <Search className="w-4 h-4" />
              </motion.div>
              <input
                id="chat-search"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </motion.div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-slate-500">
                <MessageCircle className="w-12 h-12 mb-3 opacity-40" />
                <p className="font-semibold">No users</p>
                <p className="text-sm text-center">Your users list is empty.</p>
              </div>
            ) : (
              filteredConversations.map((c, index) => {
                const active = selectedConversation?.id === c.id;
                return (
                  <motion.button
                    key={c.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedConversation(c)}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition flex items-center gap-3 border-b border-slate-100 ${active ? "bg-blue-50" : ""
                      }`}
                  >
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {initials(c.name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-slate-900 truncate">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-500 flex-shrink-0">
                          {formatListTime(c.last_message_time)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <div className="text-sm text-slate-600 truncate">
                          {c.last_message || "Start a new message…"}
                        </div>
                        {c.unread_count > 0 && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white flex-shrink-0">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: chat */}
        <div className={`flex-1 flex flex-col ${showChat ? "flex" : "hidden md:flex"}`}>
          {selectedConversation ? (
            <>
              <div className="h-16 border-b border-slate-200 px-3 md:px-4 flex items-center gap-3">
                <button
                  className="md:hidden h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center"
                  onClick={() => setShowChat(false)}
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>

                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                  {initials(selectedConversation.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">
                    {selectedConversation.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {selectedConversation.role
                      ? `${selectedConversation.role}${selectedConversation.course
                        ? ` • ${selectedConversation.course}`
                        : ""
                      }`
                      : "Tap to view profile"}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button className="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center" title="Call">
                    <Phone className="w-5 h-5 text-slate-700" />
                  </button>
                  <button className="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center" title="Video">
                    <Video className="w-5 h-5 text-slate-700" />
                  </button>
                  <button className="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center" title="More">
                    <MoreVertical className="w-5 h-5 text-slate-700" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 bg-slate-50">
                <div className="space-y-2">
                  {messages.map((msg, idx) => {
                    const prev = messages[idx - 1];
                    const showName = !msg.is_mine && (!prev || prev.sender_id !== msg.sender_id);

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className={`flex ${msg.is_mine ? "justify-end" : "justify-start"}`}>
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                              delay: idx * 0.02,
                            }}
                            whileHover={{
                              scale: 1.02,
                              rotateY: msg.is_mine ? -2 : 2,
                              z: 50,
                              transition: { duration: 0.2 }
                            }}
                            style={{ transformStyle: "preserve-3d" }}
                            className={`max-w-[75%] md:max-w-[60%] px-4 py-2.5 rounded-2xl shadow-sm relative group ${msg.is_mine
                              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm"
                              : "bg-white text-slate-900 rounded-bl-sm border border-slate-200"
                              }`}
                          >
                            {msg.message && (
                              <p className="text-[15px] break-words whitespace-pre-wrap">
                                {msg.message}
                              </p>
                            )}

                            {/* Render image attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {msg.attachments.map((att, attIndex) => {
                                  if (att.type === 'image') {
                                    const imageUrl = att.file_path.startsWith('http')
                                      ? att.file_path
                                      : `${import.meta.env.VITE_API_URL || 'https://study.learner-teach.online'}/${att.file_path}`;

                                    return (
                                      <motion.div
                                        key={attIndex}
                                        whileHover={{ scale: 1.05, rotateZ: 1 }}
                                        className="rounded-xl overflow-hidden cursor-pointer"
                                      >
                                        <img
                                          src={imageUrl}
                                          alt={att.original_name || 'Image'}
                                          className="max-w-full h-auto max-h-64 object-cover rounded-lg"
                                          onClick={() => window.open(imageUrl, '_blank')}
                                          onError={(e) => {
                                            e.target.src = '/placeholder-image.png';
                                            e.target.onerror = null;
                                          }}
                                        />
                                      </motion.div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            )}

                            <div
                              className={`text-xs mt-1 flex items-center gap-1 ${msg.is_mine ? "text-blue-100" : "text-slate-400"
                                }`}
                            >
                              {formatTime(msg.created_at)}
                              {msg.is_mine && (
                                <span className="ml-1">
                                  {msg._status === "sending" ? (
                                    <Loader className="w-3 h-3 animate-spin" />
                                  ) : msg._status === "failed" ? (
                                    <span className="text-red-300">!</span>
                                  ) : (
                                    <CheckCheck className="w-3.5 h-3.5" />
                                  )}
                                </span>
                              )}
                            </div>

                            {/* 3D shadow effect */}
                            <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background: msg.is_mine
                                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3))'
                                  : 'rgba(0, 0, 0, 0.1)',
                                filter: 'blur(10px)',
                                transform: 'translateZ(-10px)'
                              }}
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="border-t border-slate-200 bg-white px-3 md:px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-700"
                    title="Attach"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Message"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="h-10 px-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    title="Send"
                  >
                    {sending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span className="hidden sm:inline font-semibold">Send</span>
                  </button>
                </div>

                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Delivered instantly after save
                  </span>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-500">
              <div className="text-center px-6">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-40" />
                <p className="text-lg font-semibold text-slate-700">Select a chat</p>
                <p className="text-sm">Choose a user on the left to start messaging.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
