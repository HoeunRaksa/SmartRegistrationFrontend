import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
  FileText,
  Users,
  Bell,
  ArrowRight,
  Loader
} from 'lucide-react';

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Mock dashboard data
      const mockData = {
        student: {
          name: user.name || 'Student',
          student_code: 'STU2024001',
          major: 'Software Engineering',
          year: '2nd Year'
        },
        stats: {
          gpa: 3.75,
          enrolled_courses: 5,
          attendance: 85.7,
          pending_assignments: 3
        },
        todayClasses: [
          {
            id: 1,
            course_code: 'CS101',
            course_name: 'Introduction to Computer Science',
            time: '10:00 AM - 11:30 AM',
            room: 'Room 301',
            instructor: 'Dr. Sarah Johnson'
          },
          {
            id: 2,
            course_code: 'ENG102',
            course_name: 'Academic Writing',
            time: '1:00 PM - 2:00 PM',
            room: 'Room 112',
            instructor: 'Dr. Emily White'
          }
        ],
        recentGrades: [
          {
            id: 1,
            course_code: 'MATH201',
            course_name: 'Calculus II',
            assignment: 'Problem Set 3',
            grade: 68,
            total: 75,
            date: '2026-01-18'
          },
          {
            id: 2,
            course_code: 'PHY101',
            course_name: 'General Physics I',
            assignment: 'Lab Report: Basic Circuits',
            grade: 38,
            total: 40,
            date: '2026-01-17'
          }
        ],
        pendingAssignments: [
          {
            id: 1,
            course_code: 'CS101',
            title: 'Programming Assignment 1',
            due_date: '2026-01-25',
            due_time: '23:59',
            points: 100
          },
          {
            id: 2,
            course_code: 'ENG102',
            title: 'Essay: Impact of Technology',
            due_date: '2026-01-22',
            due_time: '17:00',
            points: 50
          },
          {
            id: 3,
            course_code: 'CS202',
            title: 'Project Proposal',
            due_date: '2026-01-28',
            due_time: '23:59',
            points: 60
          }
        ],
        notifications: [
          {
            id: 1,
            message: 'New assignment posted in CS101',
            time: '2 hours ago',
            type: 'assignment'
          },
          {
            id: 2,
            message: 'Grade posted for MATH201 Problem Set 3',
            time: '5 hours ago',
            type: 'grade'
          },
          {
            id: 3,
            message: 'Reminder: ENG102 essay due tomorrow',
            time: '1 day ago',
            type: 'reminder'
          }
        ]
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

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
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-8 border border-white/20 shadow-lg"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          {getGreeting()}, {dashboardData?.student?.name}! 👋
        </h1>
        <p className="text-white/90">
          {dashboardData?.student?.student_code} • {dashboardData?.student?.major} • {dashboardData?.student?.year}
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate('/student/grades')}
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Current GPA</p>
              <p className="text-3xl font-bold">{dashboardData?.stats?.gpa?.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate('/student/courses')}
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Enrolled Courses</p>
              <p className="text-3xl font-bold">{dashboardData?.stats?.enrolled_courses}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate('/student/attendance')}
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Attendance</p>
              <p className="text-3xl font-bold">{dashboardData?.stats?.attendance?.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate('/student/assignments')}
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Pending Tasks</p>
              <p className="text-3xl font-bold">{dashboardData?.stats?.pending_assignments}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              Today's Classes
            </h2>
            <button
              onClick={() => navigate('/student/schedule')}
              className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData?.todayClasses?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-semibold">No classes today</p>
                <p className="text-sm">Enjoy your day off!</p>
              </div>
            ) : (
              dashboardData?.todayClasses?.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-blue-600">{classItem.course_code}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {classItem.time}
                    </div>
                  </div>
                  <div className="font-medium text-gray-900 mb-1">{classItem.course_name}</div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{classItem.room}</span>
                    <span>{classItem.instructor}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Pending Assignments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-500/10">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
              Pending Assignments
            </h2>
            <button
              onClick={() => navigate('/student/assignments')}
              className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData?.pendingAssignments?.slice(0, 3).map((assignment, index) => {
              const daysUntilDue = getDaysUntilDue(assignment.due_date);
              const isUrgent = daysUntilDue <= 2;

              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    isUrgent
                      ? 'bg-red-50/50 border-red-200'
                      : 'bg-orange-50/50 border-orange-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-gray-900">{assignment.title}</div>
                    <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg font-semibold">
                      {assignment.points} pts
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{assignment.course_code}</div>
                  <div className={`flex items-center gap-2 text-sm ${isUrgent ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                    <Clock className="w-4 h-4" />
                    Due: {new Date(assignment.due_date).toLocaleDateString()} at {assignment.due_time}
                    {daysUntilDue >= 0 && (
                      <span className="ml-2">
                        ({daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''} left)
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-green-500/10">
                <Award className="w-6 h-6 text-green-500" />
              </div>
              Recent Grades
            </h2>
            <button
              onClick={() => navigate('/student/grades')}
              className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData?.recentGrades?.map((grade, index) => (
              <motion.div
                key={grade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-green-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">{grade.assignment}</div>
                    <div className="text-sm text-gray-600">{grade.course_code} - {grade.course_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {grade.grade}/{grade.total}
                    </div>
                    <div className="text-sm text-gray-600">
                      {((grade.grade / grade.total) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Posted: {new Date(grade.date).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10">
                <Bell className="w-6 h-6 text-purple-500" />
              </div>
              Notifications
            </h2>
          </div>
          <div className="space-y-3">
            {dashboardData?.notifications?.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="p-4 bg-purple-50/50 rounded-xl border border-purple-100"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bell className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/student/courses')}
            className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <BookOpen className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold text-sm">My Courses</p>
          </button>
          <button
            onClick={() => navigate('/student/schedule')}
            className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Calendar className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold text-sm">Schedule</p>
          </button>
          <button
            onClick={() => navigate('/student/assignments')}
            className="p-4 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <FileText className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold text-sm">Assignments</p>
          </button>
          <button
            onClick={() => navigate('/student/messages')}
            className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold text-sm">Messages</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
