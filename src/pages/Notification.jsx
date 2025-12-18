import React, { useState } from 'react'
import { 
  Briefcase, 
  Bell, 
  AtSign, 
  Users, 
  GitPullRequest, 
  Search,
  Inbox
} from 'lucide-react'
import { Card} from "../Components/ui/Card"

const NotificationInbox = () => {
  // Track which filter is active
  const [activeFilter, setActiveFilter] = useState("All")

  // Filters list
  const filters = [
    { name: 'Assigned', icon: <Briefcase size={16} className="text-pink-400" /> },
    { name: 'Participating', icon: <Bell size={16} className="text-indigo-400" /> },
    { name: 'Mentioned', icon: <AtSign size={16} className="text-yellow-400" /> },
    { name: 'Team mentioned', icon: <Users size={16} className="text-teal-400" /> },
    { name: 'Review requested', icon: <GitPullRequest size={16} className="text-green-400" /> },
  ]

  return (
    <div>
      <Card className="mt-20 min-h-screen text-gray-700 flex flex-col glass">
        <div className="flex-grow flex border-gray-700">

          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 border-r border-gray-700 p-4 space-y-6 hidden md:block">
            <div className="space-y-1 text-sm font-semibold">
              <h3 className="text-lg mb-4 font-bold">Inbox</h3>
              {['All', 'Unread', 'Saved', 'Done'].map((item) => (
                <div
                  key={item}
                  className={`py-1 px-3 rounded-lg cursor-pointer transition-colors ${
                    activeFilter === item 
                      ? 'glass text-gray-700' 
                      : 'glass-hover'
                  }`}
                  onClick={() => setActiveFilter(item)}
                >
                  {item}
                </div>
              ))}
            </div>

            <hr className="border-gray-700" />

            {/* Filters Section */}
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-gray-400 mb-2">Filters</p>
              {filters.map((filter) => (
                <div
                  key={filter.name}
                  onClick={() => setActiveFilter(filter.name)}
                  className={`flex items-center space-x-2 py-1 px-2 rounded-lg cursor-pointer transition-colors ${
                    activeFilter === filter.name
                      ? 'glass text-gray-700'
                      : 'glass-hover'
                  }`}
                >
                  {filter.icon}
                  <span>{filter.name}</span>
                </div>
              ))}
              <button className="text-indigo-400 hover:text-indigo-300 transition-colors mt-2 text-sm">
                + Add new filter
              </button>
            </div>

            <div className="mt-8 text-xs text-gray-500 cursor-pointer hover:text-gray-400">
              Manage notifications ▼
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow flex flex-col p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-700 pb-4 mb-6 gap-4">
              <div className="flex space-x-4 items-center w-full sm:w-auto">
                <div className="md:hidden flex space-x-4 items-center text-sm font-semibold">
                  <span className="text-white bg-indigo-600 rounded-full px-3 py-1 cursor-pointer">All</span>
                  <span className="text-gray-400 cursor-pointer hover:text-white">Unread</span>
                </div>
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search notifications"
                    className="bg-indigo-600 w-full text-white border border-gray-100 rounded-lg py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                Group by: <span className="font-semibold text-gray-700 ml-1 cursor-pointer hover:text-indigo-400">Date ▼</span>
              </div>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center flex-grow p-4 sm:p-10 text-center">
              <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-700">
                {activeFilter} Notifications
              </h1>
              <p className="text-gray-400 max-w-sm text-sm sm:text-base">
                {activeFilter === "All"
                  ? "You’re all caught up on everything!"
                  : `No new ${activeFilter.toLowerCase()} notifications.`}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default NotificationInbox;
