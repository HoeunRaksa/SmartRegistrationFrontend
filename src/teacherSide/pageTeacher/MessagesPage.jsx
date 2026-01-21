import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Send, Paperclip, MoreVertical } from 'lucide-react';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState('');

  const conversations = [
    { id: 1, name: 'John Doe', studentId: 'ST001', lastMessage: 'Thank you for the feedback!', time: '10:30 AM', unread: 2, avatar: 'J' },
    { id: 2, name: 'Jane Smith', studentId: 'ST002', lastMessage: 'When is the deadline?', time: 'Yesterday', unread: 0, avatar: 'J' },
    { id: 3, name: 'Mike Johnson', studentId: 'ST003', lastMessage: 'I have a question about...', time: '2 days ago', unread: 1, avatar: 'M' },
  ];

  const messages = [
    { id: 1, sender: 'student', text: 'Hello Professor, I have a question about Assignment 3.', time: '10:15 AM' },
    { id: 2, sender: 'teacher', text: 'Hi John! Sure, what would you like to know?', time: '10:20 AM' },
    { id: 3, sender: 'student', text: 'I\'m not sure how to implement the authentication feature.', time: '10:25 AM' },
    { id: 4, sender: 'teacher', text: 'Let me share some resources that might help. Check out the React documentation on context API.', time: '10:28 AM' },
    { id: 5, sender: 'student', text: 'Thank you for the feedback!', time: '10:30 AM' },
  ];

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
          className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-white/40">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-white/40 transition-all border-b border-white/20 ${
                  selectedConversation === conversation.id ? 'bg-white/50' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {conversation.avatar}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800">{conversation.name}</h3>
                    {conversation.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  <p className="text-xs text-gray-500 mt-1">{conversation.time}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg overflow-hidden flex flex-col"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-white/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                J
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">John Doe</h3>
                <p className="text-sm text-gray-600">ST001 - Web Development</p>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-white/40 transition-all">
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.sender === 'teacher'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/50 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-2 ${message.sender === 'teacher' ? 'text-white/70' : 'text-gray-500'}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-white/40">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-white/40 transition-all">
                <Paperclip className="w-5 h-5 text-gray-700" />
              </button>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
              <button className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MessagesPage;
