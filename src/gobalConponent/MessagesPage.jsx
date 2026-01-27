import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { fetchConversations, fetchMessages, sendMessage, createGroup, deleteMessage } from "../api/message_api";
import { getEcho } from "../echo";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Group creation state
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupTitle, setGroupTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  // Media state
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const mapServerMessageToUI = (m) => {
    const senderId = m.s_id ?? m.sender_id;
    const content = m.content ?? m.message;

    return {
      id: m.id,
      sender_id: senderId,
      sender_name: m.sender?.name || (senderId === currentUser.id ? currentUser.name : "User"),
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
    const channel = echo.private(channelName);

    channel.listen(".message.sent", (event) => {
      const incomingMessage = {
        id: event.id,
        sender_id: event.s_id,
        sender_name: event.sender_name || (event.s_id === currentUser.id ? currentUser.name : selectedConversation.name),
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
    });

    return () => {
      echo.leave(channelName);
    };
  }, [currentUser?.id, selectedConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await fetchConversations();
      const list = res?.data?.data || [];
      setConversations(list);

      // Extract unique users from private conversations for group creation
      const users = list
        .filter(c => c.type === 'private')
        .map(c => ({ id: c.id, name: c.name })); // c.id here is the user ID in legacy code, but in new it's conversation ID...
      // Wait, in my new conversations() it returns conversation_id, and for private it finds the other user.
      // I'll update the backend conversations() to include other user's actual ID.
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
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
    e.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0) || !selectedConversation?.id) return;

    const contentToSend = newMessage.trim();
    const tempId = `tmp-${Date.now()}`;

    const optimistic = {
      id: tempId,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      message: contentToSend,
      created_at: new Date().toISOString(),
      is_mine: true,
      attachments: attachments.map(f => ({ type: f.type.split('/')[0], file_path: URL.createObjectURL(f) })),
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteMessage(id);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_deleted: true, message: "Message deleted" } : m));
    } catch (e) {
      alert("Failed to delete message");
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
      alert("Failed to create group");
    }
  };

  const filteredConversations = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return conversations.filter((conv) => (conv.name || "").toLowerCase().includes(q));
  }, [conversations, searchQuery]);

  const initials = (name) => {
    const n = (name || "").trim();
    if (!n) return "U";
    return n.split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join("") || "U";
  };

  return (
    <div className="h-[calc(100vh-120px)] md:p-6">
      <div className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex">
        {/* Sidebar */}
        <div className={`w-full md:w-[360px] border-r border-slate-200 flex flex-col ${showChat ? "hidden md:flex" : "flex"}`}>
          <div className="px-4 pt-4 pb-3 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Chats</h2>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedConversation(c)}
                className={`w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 border-b border-slate-50 ${selectedConversation?.id === c.id ? "bg-blue-50" : ""}`}
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br ${c.type === 'group' ? "from-indigo-600 to-purple-600" : "from-blue-600 to-indigo-600"}`}>
                  {initials(c.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-slate-900 truncate">{c.name}</span>
                    <span className="text-[10px] text-slate-500">{c.last_message_time ? new Date(c.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                  </div>
                  <p className="text-sm text-slate-500 truncate">{c.last_message || "No messages yet"}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${showChat ? "flex" : "hidden md:flex"}`}>
          {selectedConversation ? (
            <>
              <div className="h-16 border-b border-slate-200 px-4 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <button className="md:hidden p-2" onClick={() => setShowChat(false)}><ArrowLeft /></button>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm text-white bg-gradient-to-br ${selectedConversation.type === 'group' ? "from-indigo-600 to-purple-600" : "from-blue-600 to-indigo-600"}`}>
                    {initials(selectedConversation.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{selectedConversation.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{selectedConversation.type}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-50 rounded-lg"><Phone className="w-5 h-5 text-slate-600" /></button>
                  <button className="p-2 hover:bg-slate-50 rounded-lg"><MoreVertical className="w-5 h-5 text-slate-600" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8faff]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] group relative`}>
                      {!msg.is_mine && <span className="text-[10px] text-slate-500 ml-2 mb-1 block">{msg.sender_name}</span>}
                      <div className={`px-4 py-2 rounded-2xl shadow-sm ${msg.is_mine ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"}`}>
                        {msg.is_deleted ? (
                          <span className="text-xs italic opacity-70">Message deleted</span>
                        ) : (
                          <>
                            <p className="text-sm leading-relaxed">{msg.message}</p>
                            {msg.attachments?.map((att, i) => (
                              <div key={i} className="mt-2 rounded-lg overflow-hidden">
                                {att.type === 'image' && <img src={att.file_path.startsWith('http') ? att.file_path : `https://study.learner-teach.online/${att.file_path}`} className="max-w-full h-auto rounded-lg" alt="" />}
                                {att.type === 'audio' && <audio controls src={att.file_path} className="w-full h-8" />}
                              </div>
                            ))}
                          </>
                        )}
                        <div className={`text-[9px] mt-1 flex justify-end opacity-70 ${msg.is_mine ? "text-white" : "text-slate-500"}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {msg.is_mine && !msg.is_deleted && (
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                {attachments.length > 0 && (
                  <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                    {attachments.map((file, i) => (
                      <div key={i} className="relative h-16 w-16 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                        {file.type.startsWith('image/') ? <ImageIcon className="text-slate-400" /> : <Mic className="text-slate-400" />}
                        <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input type="file" multiple ref={fileInputRef} className="hidden" onChange={(e) => setAttachments(prev => [...prev, ...Array.from(e.target.files)])} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><Paperclip className="w-5 h-5" /></button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                  <button type="submit" disabled={!newMessage.trim() && attachments.length === 0} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"><Send className="w-5 h-5" /></button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-500">
              <MessageCircle className="w-16 h-16 opacity-10 mb-4" />
              <p className="text-lg font-medium">Select a conversation to start</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Create New Group</h3>
                <button onClick={() => setShowCreateGroup(false)}><X className="text-slate-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Group Title</label>
                  <input value={groupTitle} onChange={e => setGroupTitle(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Study Group" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Add Participants</label>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {conversations.filter(c => c.type === 'private').map(u => (
                      <label key={u.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                        <input type="checkbox" checked={selectedUsers.includes(u.other_user_id || u.id)} onChange={(e) => {
                          const id = u.other_user_id || u.id;
                          setSelectedUsers(prev => e.target.checked ? [...prev, id] : prev.filter(i => i !== id));
                        }} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm font-medium">{u.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button onClick={handleCreateGroup} disabled={!groupTitle.trim() || selectedUsers.length === 0} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50">Create Group</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagesPage;
