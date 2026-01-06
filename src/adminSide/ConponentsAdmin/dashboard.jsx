import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';

const Dashboard = () => {
  // Mock stats data
  const stats = [
    { label: 'Total Departments', value: '12', change: '+2', gradient: 'from-blue-500 to-cyan-500', icon: Building2 },
    { label: 'Active Majors', value: '45', change: '+5', gradient: 'from-purple-500 to-pink-500', icon: GraduationCap },
    { label: 'Total Students', value: '1,234', change: '+89', gradient: 'from-orange-500 to-red-500', icon: Users },
    { label: 'Subjects', value: '156', change: '+12', gradient: 'from-green-500 to-emerald-500', icon: BookOpen },
  ];

  const recentActivities = [
    { action: 'New student registered', time: '5 min ago', type: 'success', user: 'John Doe' },
    { action: 'Department updated', time: '1 hour ago', type: 'info', user: 'Admin' },
    { action: 'Major added to system', time: '3 hours ago', type: 'success', user: 'Jane Smith' },
    { action: 'Subject schedule changed', time: '5 hours ago', type: 'warning', user: 'Prof. Wilson' },
    { action: 'New registration approved', time: '8 hours ago', type: 'success', user: 'Sarah Lee' },
  ];

  const upcomingEvents = [
    { title: 'Faculty Meeting', date: 'Jan 10, 2025', time: '10:00 AM', color: 'blue' },
    { title: 'Student Orientation', date: 'Jan 12, 2025', time: '2:00 PM', color: 'purple' },
    { title: 'Exam Schedule Release', date: 'Jan 15, 2025', time: '9:00 AM', color: 'green' },
    { title: 'Graduation Ceremony', date: 'Jan 20, 2025', time: '4:00 PM', color: 'orange' },
  ];

  const topPerformingMajors = [
    { name: 'Computer Science', students: 245, growth: '+12%', color: 'from-blue-500 to-cyan-500' },
    { name: 'Business Administration', students: 198, growth: '+8%', color: 'from-purple-500 to-pink-500' },
    { name: 'Engineering', students: 167, growth: '+15%', color: 'from-orange-500 to-red-500' },
    { name: 'Medicine', students: 134, growth: '+10%', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 font-light">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Second Row - Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 backdrop-blur-xl bg-white/30 rounded-2xl border border-white/20 hover:bg-white/40 transition">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">{activity.user}</p>
                    <span className="text-xs text-gray-400">•</span>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Department', gradient: 'from-blue-500 to-cyan-500', icon: Building2 },
              { label: 'Add Major', gradient: 'from-purple-500 to-pink-500', icon: GraduationCap },
              { label: 'Add Subject', gradient: 'from-green-500 to-emerald-500', icon: BookOpen },
              { label: 'View Reports', gradient: 'from-orange-500 to-red-500', icon: FileText },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className={`p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-white/20 group`}
                >
                  <Icon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold">{action.label}</p>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Third Row - Top Performing Majors & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Majors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={24} className="text-blue-600" />
              Top Performing Majors
            </h3>
          </div>
          <div className="space-y-3">
            {topPerformingMajors.map((major, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/30 rounded-2xl p-4 border border-white/20 hover:bg-white/40 transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${major.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{major.name}</p>
                      <p className="text-xs text-gray-600">{major.students} students</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    {major.growth}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${major.color}`}
                    style={{ width: `${(major.students / 250) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={24} className="text-purple-600" />
              Upcoming Events
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Calendar</button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/30 rounded-2xl p-4 border border-white/20 hover:bg-white/40 transition cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                    event.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                    event.color === 'purple' ? 'from-purple-500 to-pink-500' :
                    event.color === 'green' ? 'from-green-500 to-emerald-500' :
                    'from-orange-500 to-red-500'
                  } flex flex-col items-center justify-center text-white shadow-lg`}>
                    <span className="text-xs font-semibold">{event.date.split(' ')[1].replace(',', '')}</span>
                    <span className="text-[10px]">{event.date.split(' ')[0]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-600">{event.date}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-600">{event.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Academic Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Award size={24} className="text-orange-600" />
            Academic Performance Overview
          </h3>
          <select className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>
        <div className="h-64 backdrop-blur-xl bg-white/30 rounded-2xl border border-white/20 flex items-center justify-center">
          <p className="text-gray-500 font-light">Chart visualization will be implemented here</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;