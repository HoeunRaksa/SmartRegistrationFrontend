import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Search,
  Plus,
  X,
  Paperclip,
  User,
  MessageCircle,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { fetchConversations, fetchMessages, sendMessage } from '../../api/message_api';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await fetchConversations().catch(() => ({ data: { data: [] } }));

      // Mock data
      const mockConversations = [
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          role: 'Instructor',
          course: 'CS101',
          last_message: 'Thank you for submitting the assignment on time!',
          last_message_time: '2026-01-19 10:30',
          unread_count: 0,
          avatar: null
        },
        {
          id: 2,
          name: 'Prof. Michael Chen',
          role: 'Instructor',
          course: 'MATH201',
          last_message: 'Please see me during office hours to discuss your grade.',
          last_message_time: '2026-01-18 15:45',
          unread_count: 2,
          avatar: null
        },
        {
          id: 3,
          name: 'Academic Advisor',
          role: 'Staff',
          course: null,
          last_message: 'Your course registration for next semester is now open.',
          last_message_time: '2026-01-17 09:00',
          unread_count: 1,
          avatar: null
        }
      ];

      setConversations(response.data?.data?.length > 0 ? response.data.data : mockConversations);
      if (mockConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(mockConversations[0]);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await fetchMessages(conversationId).catch(() => ({ data: { data: [] } }));

      // Mock messages
      const mockMessages = [
        {
          id: 1,
          conversation_id: 1,
          sender_id: 1,
          sender_name: 'Dr. Sarah Johnson',
          message: 'Hello! I noticed you had a question about the assignment.',
          created_at: '2026-01-19 09:00',
          is_mine: false
        },
        {
          id: 2,
          conversation_id: 1,
          sender_id: currentUser.id,
          sender_name: currentUser.name,
          message: 'Yes, I was wondering about the deadline for submission.',
          created_at: '2026-01-19 09:15',
          is_mine: true
        },
        {
          id: 3,
          conversation_id: 1,
          sender_id: 1,
          sender_name: 'Dr. Sarah Johnson',
          message: 'The deadline is Friday at 11:59 PM. Make sure to submit your work before then.',
          created_at: '2026-01-19 09:20',
          is_mine: false
        },
        {
          id: 4,
          conversation_id: 1,
          sender_id: currentUser.id,
          sender_name: currentUser.name,
          message: 'Thank you for clarifying! I will submit it by then.',
          created_at: '2026-01-19 09:25',
          is_mine: true
        },
        {
          id: 5,
          conversation_id: 1,
          sender_id: 1,
          sender_name: 'Dr. Sarah Johnson',
          message: 'Thank you for submitting the assignment on time!',
          created_at: '2026-01-19 10:30',
          is_mine: false
        }
      ];

      const conversationMessages = mockMessages.filter(m => m.conversation_id === conversationId);
      setMessages(response.data?.data?.length > 0 ? response.data.data : conversationMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const messageData = {
        conversation_id: selectedConversation.id,
        message: newMessage
      };

      await sendMessage(messageData).catch(() => {
        // Mock send
        const newMsg = {
          id: messages.length + 1,
          conversation_id: selectedConversation.id,
          sender_id: currentUser.id,
          sender_name: currentUser.name,
          message: newMessage,
          created_at: new Date().toISOString(),
          is_mine: true
        };
        setMessages([...messages, newMsg]);

        // Update conversation last message
        setConversations(conversations.map(c =>
          c.id === selectedConversation.id
            ? { ...c, last_message: newMessage, last_message_time: new Date().toISOString() }
            : c
        ));
      });

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.course?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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
                    selectedConversation?.id === conversation.id ? 'bg-white/80' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {conversation.name?.[0] || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                        {conversation.unread_count > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-semibold">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {conversation.role} {conversation.course && `• ${conversation.course}`}
                      </p>
                      <p className="text-sm text-gray-700 truncate">{conversation.last_message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(conversation.last_message_time).toLocaleString()}
                      </p>
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
                    {selectedConversation.name?.[0] || 'U'}
                  </div>
                  <div className="text-white">
                    <h3 className="font-bold">{selectedConversation.name}</h3>
                    <p className="text-sm opacity-90">
                      {selectedConversation.role} {selectedConversation.course && `• ${selectedConversation.course}`}
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
                    className={`flex ${message.is_mine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.is_mine ? 'order-2' : 'order-1'}`}>
                      <div className={`rounded-2xl p-4 ${
                        message.is_mine
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-white/80 text-gray-900'
                      }`}>
                        {!message.is_mine && (
                          <p className="text-xs font-semibold mb-1 opacity-70">{message.sender_name}</p>
                        )}
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${message.is_mine ? 'text-right' : 'text-left'}`}>
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
                    {sending ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
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
