import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, Send, Paperclip, MoreVertical, Loader2 } from 'lucide-react';
import { fetchTeacherConversations, fetchTeacherMessages, sendTeacherMessage } from '../../api/teacher_api';
import { getEcho } from '../../echo'; // ✅ add echo

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef(null);
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

  // ✅ keep echo + active channel in refs (so no re-render issues)
  const echoRef = useRef(null);
  const activeConversationIdRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);

      // ✅ subscribe realtime when select conversation
      subscribeToConversation(selectedConversation.id);
    } else {
      // ✅ cleanup when unselect
      unsubscribeFromConversation();
      setMessages([]);
    }

    // ✅ cleanup when switching conversation or leaving page
    return () => {
      unsubscribeFromConversation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoadingConv(true);
      const res = await fetchTeacherConversations();
      setConversations(res.data?.data || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoadingConv(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setLoadingMsgs(true);
      const res = await fetchTeacherMessages(conversationId);
      setMessages(res.data?.data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoadingMsgs(false);
    }
  };

  // ✅ REALTIME: subscribe
  const subscribeToConversation = (conversationId) => {
    try {
      const echo = getEcho();
      if (!echo) return;

      echoRef.current = echo;

      // leave previous if switching
      if (activeConversationIdRef.current && activeConversationIdRef.current !== conversationId) {
        unsubscribeFromConversation();
      }

      activeConversationIdRef.current = conversationId;

      // ⚠️ channel name + event name MUST match backend
      // common: PrivateChannel("conversation.{id}") + broadcastAs("message.sent") or "MessageSent"
      echo.private(`conversation.${conversationId}`)
        .listen('MessageSent', (e) => {
          const newMsg = e?.message || e?.data?.message || e;

          if (!newMsg) return;

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev; // avoid duplicates
            return [...prev, newMsg];
          });

          // update last message in conversation list
          setConversations((prev) =>
            prev.map((c) =>
              c.id === conversationId
                ? {
                  ...c,
                  last_message: newMsg.content ?? c.last_message,
                  last_message_time: newMsg.created_at ?? new Date().toISOString(),
                  unread_count: c.unread_count, // keep existing (or backend should refresh)
                }
                : c
            )
          );
        });

    } catch (err) {
      console.error('Realtime subscribe error:', err);
    }
  };

  // ✅ REALTIME: unsubscribe
  const unsubscribeFromConversation = () => {
    try {
      const echo = echoRef.current || getEcho();
      const id = activeConversationIdRef.current;

      if (!echo || !id) return;

      // stop listening & leave private channel
      echo.private(`conversation.${id}`).stopListening('MessageSent');
      echo.leave(`private-conversation.${id}`);

      activeConversationIdRef.current = null;
    } catch (err) {
      console.error('Realtime unsubscribe error:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation || sending) return;

    try {
      setSending(true);
      const res = await sendTeacherMessage({
        conversation_id: selectedConversation.id,
        content: messageText
      });

      // Optimitic update or just push the new message
      setMessages(prev => [...prev, res.data]);
      setMessageText('');

      // Update last message in conversation list
      setConversations(prev => prev.map(c =>
        c.id === selectedConversation.id
          ? { ...c, last_message: messageText, last_message_time: new Date().toISOString() }
          : c
      ));

    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
        <p className="text-gray-600">Communicate with your students</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConv ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-all border-b border-gray-50 ${selectedConversation?.id === conversation.id ? 'bg-blue-50/50' : ''
                    }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden border border-white/40">
                    {conversation.avatar ? (
                      <img src={conversation.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      conversation.name?.charAt(0) || '?'
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">{conversation.name}</h3>
                      {conversation.unread_count > 0 && (
                        <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.last_message || 'No messages yet'}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {conversation.last_message_time ? new Date(conversation.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-10 h-10 opacity-20 mx-auto mb-2" />
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col"
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                    {selectedConversation.avatar ? (
                      <img src={selectedConversation.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      selectedConversation.name?.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedConversation.name}</h3>
                    <p className="text-xs text-blue-600 font-medium capitalize">{selectedConversation.type}</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-all">
                  <MoreVertical className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 opacity-50" />
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((message) => {
                    const isMe = message.s_id === currentUserId;
                    return (
                      <div
                        key={message.id}
                        className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 mb-1 overflow-hidden border border-gray-200 shadow-sm">
                            {message.sender?.profile_picture_url ? (
                              <img src={message.sender?.profile_picture_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-blue-600 text-[10px] font-bold">
                                {message.sender?.name?.charAt(0)}
                              </div>
                            )}
                          </div>
                        )}
                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                          {!isMe && (
                            <span className="text-[10px] ml-1 mb-1 text-gray-400 font-medium">
                              {message.sender?.name}
                            </span>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2 shadow-sm ${isMe
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                              }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                    <MessageSquare className="w-12 h-12 mb-2" />
                    <p>Start a conversation</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-2">
                  <button type="button" className="p-2 rounded-lg hover:bg-gray-100 transition-all">
                    <Paperclip className="w-5 h-5 text-gray-700" />
                  </button>
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim() || sending}
                    className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-3xl bg-blue-100 flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Select a conversation</h3>
              <p className="text-gray-600 max-w-xs">
                Choose a student or group from the list to start messaging
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MessagesPage;
