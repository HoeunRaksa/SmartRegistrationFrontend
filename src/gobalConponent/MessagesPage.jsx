import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
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
  Trash2,
  Mic,
  Image as ImageIcon,
  X,
  Users,
  UserPlus,
} from "lucide-react";
import { fetchConversations, fetchMessages, sendMessage, createGroup, deleteMessage, clearConversation, fetchClassmates, deleteConversation } from "../api/message_api";
import { getEcho } from "../echo";
import Alert from "./Alert";
import ConfirmDialog from "./ConfirmDialog";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState("chats"); // "chats" or "classmates"

  // Discovery state
  const [classmates, setClassmates] = useState([]);

  // Group creation state
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupTitle, setGroupTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef = useRef({});

  // Media state
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const recordingIntervalRef = useRef(null);

  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });
  const [confirm, setConfirm] = useState({ show: false, title: "", message: "", action: null });

  const mapServerMessageToUI = (m) => {
    const senderId = m.s_id ?? m.sender_id;
    const content = m.content ?? m.message;
    const avatar = m.sender?.profile_picture_url || null;

    return {
      id: m.id,
      sender_id: senderId,
      sender_name: m.sender?.name || (senderId === currentUser.id ? currentUser.name : "User"),
      sender_avatar: avatar,
      message: content,
      created_at: m.created_at,
      is_mine: senderId === currentUser.id,
      attachments: m.attachments || [],
      is_deleted: m.is_deleted,
      _status: m._status,
    };
  };

  useEffect(() => {
    loadConversations();
    if (currentUser.role === 'student') {
      loadClassmates();
    }
  }, []);

  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages(selectedConversation.id);
      setShowChat(true);
    }
  }, [selectedConversation?.id]);



  useEffect(() => {
    if (!currentUser?.id || !selectedConversation?.id) return;

    const channelName = `conversation.${selectedConversation.id}`;
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(channelName);

    // Listen for multiple event name variations to ensure we catch the event
    const handleMessageEvent = (event) => {
      console.log("📨 Incoming Message Event:", event);
      const incomingMessage = {
        id: event.id,
        sender_id: event.s_id,
        sender_name: event.sender_name || (event.s_id === currentUser.id ? currentUser.name : selectedConversation.name),
        sender_avatar: event.sender_avatar,
        message: event.content,
        created_at: event.created_at,
        is_mine: event.s_id === currentUser.id,
        attachments: event.attachments || [],
        _status: "sent",
      };

      setMessages((prev) => {
        if (prev.some(m => m.id === event.id)) return prev;
        return [...prev, incomingMessage];
      });

      // Stop typing indicator for this sender
      setTypingUsers(prev => prev.filter(u => String(u.id) !== String(event.s_id)));

      // Play sound
      if (event.s_id !== currentUser.id) {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
        audio.play().catch(e => console.log("Sound play error:", e));
      }
    };

    // Robust listening for broadcastAs alias and potential fallback names
    channel.listen(".message.sent", handleMessageEvent);
    channel.listen("message.sent", handleMessageEvent);
    channel.listen("MessageSent", handleMessageEvent);

    channel.listenForWhisper("typing", (e) => {
      setTypingUsers((prev) => {
        if (prev.some(u => String(u.id) === String(e.id))) return prev;
        return [...prev, e];
      });

      if (typingTimeoutRef.current[e.id]) {
        clearTimeout(typingTimeoutRef.current[e.id]);
      }

      typingTimeoutRef.current[e.id] = setTimeout(() => {
        setTypingUsers((prev) => prev.filter(u => String(u.id) !== String(e.id)));
      }, 3000);
    });

    // Debugging hooks
    channel.subscribed(() => {
      console.log(`✅ Successfully subscribed to ${channelName}`);
    }).error((err) => {
      console.error(`❌ Failed to subscribe to ${channelName}:`, err);
    });

    return () => {
      echo.leave(channelName);
    };
  }, [currentUser?.id, selectedConversation?.id]);

  const handleTyping = () => {
    if (!selectedConversation?.id) return;
    const channelName = `conversation.${selectedConversation.id}`;
    const echo = getEcho();
    if (echo) {
      echo.private(channelName).whisper("typing", {
        id: currentUser.id,
        name: currentUser.name
      });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages, showChat]);

  // Voice recording helpers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], `voice - ${Date.now()}.webm`, { type: 'audio/webm' });
        setAttachments(prev => [...prev, file]);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setAlert({ show: true, message: "Microphone access denied or not available.", type: "error" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
    setIsRecording(false);
    clearInterval(recordingIntervalRef.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')} `;
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await fetchConversations();
      const list = res?.data?.data || [];
      setConversations(list);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadClassmates = async () => {
    try {
      const res = await fetchClassmates();
      setClassmates(res?.data?.data || []);
    } catch (e) {
      console.error("Failed to load classmates:", e);
    }
  };

  const loadMessages = async (id) => {
    try {
      const res = await fetchMessages(id);
      const data = res?.data?.data || [];
      setMessages(Array.isArray(data) ? data.map(mapServerMessageToUI) : []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0) || !selectedConversation?.id || sending) return;

    const contentToSend = newMessage.trim();
    const tempId = `tmp - ${Date.now()} `;

    const optimistic = {
      id: tempId,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      sender_avatar: currentUser.profile_picture_url,
      message: contentToSend,
      created_at: new Date().toISOString(),
      is_mine: true,
      attachments: attachments.map(f => ({
        type: f.type.startsWith('image/') ? 'image' : (f.type.startsWith('audio/') ? 'audio' : 'file'),
        file_path: URL.createObjectURL(f),
        _local: true
      })),
      _status: "sending",
    };

    setMessages((prev) => [...prev, optimistic]);
    setNewMessage("");
    const filesToUpload = [...attachments];
    setAttachments([]);

    try {
      setSending(true);
      const res = await sendMessage(selectedConversation.id, contentToSend, filesToUpload);
      const serverMsg = res?.data;

      if (serverMsg?.id) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? mapServerMessageToUI({ ...serverMsg, _status: "sent" }) : m))
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, _status: "failed" } : m))
      );
    } finally {
      setSending(false);
    }
  };

  const handleDelete = (id) => {
    setConfirm({
      show: true,
      title: "Delete Message",
      message: "Are you sure you want to delete this message?",
      action: async () => {
        try {
          await deleteMessage(id);
          setMessages(prev => prev.map(m => m.id === id ? { ...m, is_deleted: true, message: "Message deleted" } : m));
        } catch (e) {
          setAlert({ show: true, message: "Failed to delete message", type: "error" });
        }
      }
    });
  };

  const handleClearChat = () => {
    if (!selectedConversation?.id) return;
    setConfirm({
      show: true,
      title: "Clear Chat",
      message: "Are you sure you want to clear all messages in this conversation? This cannot be undone.",
      action: async () => {
        try {
          await clearConversation(selectedConversation.id);
          setMessages([]);
          // Reload conversations to update last message preview
          loadConversations();
        } catch (e) {
          setAlert({ show: true, message: "Failed to clear chat", type: "error" });
        }
      }
    });
  };

  const handleDeleteGroup = () => {
    if (!selectedConversation?.id) return;
    setConfirm({
      show: true,
      title: "Delete Group",
      message: "Are you sure you want to delete this group? This will remove it for everyone.",
      action: async () => {
        try {
          await deleteConversation(selectedConversation.id);
          setSelectedConversation(null);
          loadConversations();
        } catch (e) {
          setAlert({ show: true, message: "Failed to delete group", type: "error" });
        }
      }
    });
  };

  const startPrivateChat = async (userId) => {
    const existing = conversations.find(c => c.type === 'private' && (c.other_user_id === userId || c.id === userId));
    if (existing) {
      setSelectedConversation(existing);
      setActiveTab("chats");
      return;
    }

    try {
      // Fetch messages for this user ID (backend will create/fetch private convo)
      const res = await fetchMessages(userId, false);
      const data = res?.data?.data || [];
      // We need to reload to get the new conversation in list
      await loadConversations();
      setActiveTab("chats");
    } catch (e) {
      console.error("Failed to start chat:", e);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupTitle.trim() || selectedUsers.length === 0) return;
    try {
      const newGroup = await createGroup(groupTitle, selectedUsers);
      setShowCreateGroup(false);
      setGroupTitle("");
      setSelectedUsers([]);
      loadConversations();
      setSelectedConversation(newGroup);
    } catch (e) {
      setAlert({ show: true, message: "Failed to create group", type: "error" });
    }
  };

  const filteredConversations = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return conversations.filter((conv) => (conv.name || "").toLowerCase().includes(q));
  }, [conversations, searchQuery]);

  const filteredClassmates = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return classmates.filter((u) => (u.name || "").toLowerCase().includes(q));
  }, [classmates, searchQuery]);

  const initials = (name) => {
    const n = (name || "").trim();
    if (!n) return "U";
    return n.split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join("") || "U";
  };

  return (
    <div className="h-[calc(100vh-120px)] md:p-6 relative">
      <Alert
        isOpen={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <ConfirmDialog
        isOpen={confirm.show}
        title={confirm.title}
        message={confirm.message}
        onConfirm={async () => {
          if (confirm.action) await confirm.action();
          setConfirm({ ...confirm, show: false });
        }}
        onCancel={() => setConfirm({ ...confirm, show: false })}
        confirmText="Confirm"
        type="danger"
      />

      <div className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex">
        {/* Sidebar */}
        <div className={`w-full md:w-[360px] border-r border-slate-200 flex flex-col ${showChat ? "hidden md:flex" : "flex"}`}>
          <div className="px-4 pt-4 pb-0 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Messages</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCreateGroup(true)}
                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
                title="New Group"
              >
                <Users className="w-5 h-5" />
              </motion.button>
            </div>

            {currentUser.role === 'student' && (
              <div className="flex gap-4 mb-3">
                <button
                  onClick={() => setActiveTab("chats")}
                  className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'chats' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                >
                  Chats
                </button>
                <button
                  onClick={() => setActiveTab("classmates")}
                  className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'classmates' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                >
                  Classmates
                </button>
              </div>
            )}

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={activeTab === 'chats' ? "Search chats..." : "Search classmates..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'chats' ? (
              filteredConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedConversation(c)}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 border-b border-slate-50 ${selectedConversation?.id === c.id ? "bg-blue-50" : ""}`}
                >
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-white overflow-hidden bg-gradient-to-br ${c.type === 'course_group' ? "from-emerald-500 to-teal-600" :
                    c.type === 'group' ? "from-indigo-600 to-purple-600" :
                      "from-blue-600 to-indigo-600"
                    } `}>
                    {c.avatar ? (
                      <img src={c.avatar} className="w-full h-full object-cover" alt="" />
                    ) : (
                      initials(c.name)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                        {c.type === 'course_group' && <span className="p-1 bg-emerald-100 text-emerald-600 rounded text-[8px] uppercase font-black">Class</span>}
                        {c.name}
                      </span>
                      <span className="text-[10px] text-slate-500">{c.last_message_time ? new Date(c.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{c.last_message || "No messages yet"}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-2 space-y-1">
                {filteredClassmates.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => startPrivateChat(u.id)}
                    className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center gap-3 transition-colors group"
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-white shadow-sm transition-transform group-hover:scale-105">
                      {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : initials(u.name)}
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-bold text-slate-900 leading-tight">{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{u.student_id ? `#${u.student_id} ` : "Classmate"}</div>
                    </div>
                    <MessageCircle className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${showChat ? "flex" : "hidden md:flex"}`}>
          {selectedConversation ? (
            <>
              <div className="h-16 border-b border-slate-200 px-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <button className="md:hidden p-2" onClick={() => setShowChat(false)}><ArrowLeft /></button>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm text-white overflow-hidden bg-gradient-to-br ${selectedConversation.type === 'course_group' ? "from-emerald-500 to-teal-600" :
                    selectedConversation.type === 'group' ? "from-indigo-600 to-purple-600" :
                      "from-blue-600 to-indigo-600"
                    } `}>
                    {selectedConversation.avatar ? (
                      <img src={selectedConversation.avatar} className="w-full h-full object-cover" alt="" />
                    ) : (
                      initials(selectedConversation.name)
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight flex items-center gap-2">
                      {selectedConversation.name}
                      {selectedConversation.type === 'course_group' && <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] uppercase font-black border border-emerald-100">Course Group</span>}
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{selectedConversation.type.replace('_', ' ')} • {selectedConversation.participants_count} members</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearChat}
                    className="p-2 hover:bg-amber-50 rounded-lg text-slate-400 hover:text-amber-600 transition-colors"
                    title="Clear Chat History"
                  >
                    <CheckCheck className="w-5 h-5" />
                  </button>

                  {(selectedConversation.creator_id === currentUser.id || currentUser.role === 'admin') && selectedConversation.type !== 'course_group' && (
                    <button
                      onClick={handleDeleteGroup}
                      className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Group"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}

                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><Phone className="w-5 h-5" /></button>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-end gap-2 ${msg.is_mine ? "justify-end" : "justify-start"}`}>
                    {!msg.is_mine && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 mb-1 overflow-hidden border border-white">
                        {msg.sender_avatar ? (
                          <img src={msg.sender_avatar} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px] font-bold">
                            {initials(msg.sender_name)}
                          </div>
                        )}
                      </div>
                    )}

                    <div className={`max-w-[70%] group relative`}>
                      {!msg.is_mine && (
                        <span className="text-[10px] text-slate-400 font-medium ml-1 mb-0.5 block">
                          {msg.sender_name}
                        </span>
                      )}

                      <div className={`px-4 py-2 rounded-2xl shadow-sm transition-all ${msg.is_mine
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none"
                        : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                        } ${msg.is_deleted ? "opacity-60 bg-slate-100" : ""}`}>

                        {msg.is_deleted ? (
                          <div className="flex items-center gap-2 py-1">
                            <span className="text-[11px] italic opacity-70">Message was deleted</span>
                          </div>
                        ) : (
                          <>
                            {msg.message && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>}

                            {msg.attachments?.map((att, i) => (
                              <div key={i} className="mt-2 rounded-xl overflow-hidden shadow-sm border border-black/5">
                                {att.type === 'image' && (
                                  <motion.img
                                    whileHover={{ scale: 1.02 }}
                                    src={att._local ? att.file_path : (att.file_path.startsWith('http') ? att.file_path : `https://study.learner-teach.online/storage/${att.file_path}`)}
                                    className="max-w-full h-auto cursor-zoom-in"
                                    alt="Chat attachment"
                                  />
                                )}
                                {
                                  att.type === 'audio' && (
                                    <div className={`p-2 rounded-lg flex items-center gap-2 ${msg.is_mine ? "bg-blue-700/30" : "bg-slate-100"}`}>
                                      <audio
                                        controls
                                        src={att._local ? att.file_path : (att.file_path.startsWith('http') ? att.file_path : `https://study.learner-teach.online/storage/${att.file_path}`)}
                                        className="h-8 max-w-[200px]"
                                      />
                                    </div>
                                  )
                                }
                              </div >
                            ))}
                          </>
                        )}

                        <div className={`text-[9px] mt-1.5 flex justify-end font-medium tracking-tight ${msg.is_mine ? "text-blue-100/70" : "text-slate-400"
                          }`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {msg.is_mine && (
                            <span className="ml-1">
                              {msg._status === 'sending' ? "..." : <CheckCheck className="w-2.5 h-2.5 inline" />}
                            </span>
                          )}
                        </div>
                      </div >

                      {(msg.is_mine || (currentUser.role === 'teacher' || currentUser.role === 'admin')) && !msg.is_deleted && (
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className={`absolute ${msg.is_mine ? "-left-10" : "-right-10"} top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 rounded-full`}
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div >
                  </div >
                ))}
                {
                  typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-xs text-blue-600 font-medium">
                        {typingUsers.length > 2
                          ? `${typingUsers.length} people are typing...`
                          : `${typingUsers.map(u => u.name.split(' ')[0]).join(', ')} ${typingUsers.length === 1 ? 'is' : 'are'} typing...`}
                      </span>
                    </div>
                  )
                }
                <div ref={messagesEndRef} />
              </div >

              {/* Message Input Container */}
              < div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.05)]" >
                {
                  attachments.length > 0 && (
                    <div className="flex gap-3 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                      {attachments.map((file, i) => (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          key={i}
                          className="relative h-20 w-20 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-slate-200 group"
                        >
                          {file.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(file)} className="h-full w-full object-cover rounded-xl" alt="" />
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <Mic className="w-6 h-6 text-blue-500" />
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Voice</span>
                            </div>
                          )}
                          <button
                            onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )
                }

                < form onSubmit={handleSendMessage} className="flex items-center gap-2" >
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => setAttachments(prev => [...prev, ...Array.from(e.target.files)])}
                  />

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-2.5 rounded-xl transition-all ${isRecording
                        ? "bg-red-100 text-red-600 animate-pulse"
                        : "hover:bg-slate-50 text-slate-400 hover:text-red-500"
                        }`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>

                  {
                    isRecording ? (
                      <div className="flex-1 px-4 py-2.5 bg-red-50 rounded-xl flex items-center justify-between border border-red-100">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                          <span className="text-sm font-bold text-red-600 uppercase tracking-widest">Recording...</span>
                        </div>
                        <span className="font-mono text-sm text-red-700 font-bold">{formatTime(recordingTime)}</span>
                        <button type="button" onClick={stopRecording} className="text-red-600 font-bold text-xs hover:underline">STOP</button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          handleTyping();
                        }}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                      />
                    )
                  }

                  <button
                    type="submit"
                    disabled={(!newMessage.trim() && attachments.length === 0) || isRecording || sending}
                    className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center min-w-[52px]"
                  >
                    {sending ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form >
              </div >
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 text-slate-400 p-8 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6"
              >
                <MessageCircle className="w-12 h-12 opacity-20 text-blue-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Select a Conversation</h3>
              <p className="max-w-[280px] text-sm font-medium leading-relaxed">
                Connect with your teachers and classmates by selecting a chat from the sidebar.
              </p>
            </div>
          )}
        </div >
      </div >

      {/* Create Group Modal */}
      {
        showCreateGroup && createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
              onClick={() => setShowCreateGroup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
              >
                <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-lg font-bold text-slate-900">Create Study Group</h3>
                  <button onClick={() => setShowCreateGroup(false)} className="p-2 hover:bg-white rounded-xl transition-colors"><X className="text-slate-400 w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Group Title</label>
                    <input
                      value={groupTitle}
                      onChange={e => setGroupTitle(e.target.value)}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                      placeholder="e.g. Finals Prep 2024"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Select Participants</label>
                    <div className="max-h-60 overflow-y-auto space-y-1 pr-2 scrollbar-hide">
                      {conversations.filter(c => c.type === 'private').map(u => (
                        <label key={u.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(u.other_user_id || u.id)}
                            onChange={(e) => {
                              const id = u.other_user_id || u.id;
                              setSelectedUsers(prev => e.target.checked ? [...prev, id] : prev.filter(i => i !== id));
                            }}
                            className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {initials(u.name)}
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{u.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleCreateGroup}
                    disabled={!groupTitle.trim() || selectedUsers.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-blue-500/20 disabled:opacity-50 transition-all"
                  >
                    Confirm Group
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )
      }
      <Alert
        isOpen={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <ConfirmDialog
        isOpen={confirm.show}
        title={confirm.title}
        message={confirm.message}
        onConfirm={confirm.action}
        onCancel={() => setConfirm({ ...confirm, show: false })}
      />
    </div >
  );
};

export default MessagesPage;
