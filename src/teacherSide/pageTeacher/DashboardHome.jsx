import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Award,
  Users,
  TrendingUp,
  ClipboardList,
  CheckSquare,
  ArrowRight,
  Loader
} from 'lucide-react';

import { fetchTeacherDashboardStats } from '../../api/teacher_api';

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await fetchTeacherDashboardStats();
      setData(res.data?.data || null);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Courses',
      value: data?.total_courses || '0',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
      change: 'Active courses'
    },
    {
      title: 'Total Students',
      value: data?.total_students || '0',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      change: 'Across all courses'
    },
    {
      title: 'Pending Grades',
      value: 'Check',
      icon: ClipboardList,
      gradient: 'from-orange-500 to-red-500',
      change: 'Review submissions'
    },
    {
      title: 'Experience',
      value: data?.years_teaching || '4',
      icon: Award,
      gradient: 'from-green-500 to-emerald-500',
      change: 'Years teaching'
    }
  ];

  const upcomingClasses = data?.upcoming_sessions || [];

  const recentActivities = [
    { id: 1, action: 'System Ready', course: 'Integration complete', time: 'Just now' },
  ];

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Teacher'}!
            </h1>
            <p className="text-gray-600">Here's what's happening with your classes today.</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Classes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Today's Classes
                </h2>
                <button
                  onClick={() => navigate('/teacher/schedule')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {upcomingClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800">{cls.course}</h3>
                      <p className="text-sm text-gray-600">{cls.room}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">{cls.time}</p>
                      <p className="text-sm text-gray-600">{cls.students} students</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Recent Activities
                </h2>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.course}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Take Attendance', icon: CheckSquare, color: 'from-green-500 to-emerald-500', path: '/teacher/attendance' },
                { label: 'Grade Assignments', icon: Award, color: 'from-purple-500 to-pink-500', path: '/teacher/grades' },
                { label: 'View Students', icon: Users, color: 'from-blue-500 to-cyan-500', path: '/teacher/students' },
                { label: 'My Courses', icon: BookOpen, color: 'from-orange-500 to-red-500', path: '/teacher/courses' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white hover:shadow-lg transition-all flex flex-col items-center gap-2`}
                >
                  <action.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
