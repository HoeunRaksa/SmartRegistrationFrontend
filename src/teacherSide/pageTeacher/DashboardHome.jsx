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
  Loader,
  Bell,
  Search,
  ChevronRight,
  Clock,
  MapPin,
  Flame,
  Star,
  Activity
} from 'lucide-react';

import { fetchTeacherDashboardStats, fetchTeacherAssignments } from '../../api/teacher_api';
import { premiumColors } from "../../theme/premiumColors";

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [statsRes, assignmentsRes] = await Promise.all([
        fetchTeacherDashboardStats(),
        fetchTeacherAssignments().catch(() => ({ data: { data: [] } }))
      ]);

      setData(statsRes.data?.data || null);
      setAssignmentCount(assignmentsRes.data?.data?.length || 0);
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
      colorKey: 'blue',
      change: '+2 this semester'
    },
    {
      title: 'Active Students',
      value: data?.total_students || '0',
      icon: Users,
      colorKey: 'indigo',
      change: 'Across all courses'
    },
    {
      title: 'Active Assignments',
      value: assignmentCount.toString(),
      icon: ClipboardList,
      colorKey: 'emerald',
      change: 'Submissions to grade'
    },
    {
      title: 'Experience',
      value: data?.years_teaching || '4',
      icon: Award,
      colorKey: 'blue',
      change: 'Years of impact'
    }
  ];

  const upcomingClasses = data?.upcoming_sessions || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-500 font-medium animate-pulse">Syncing dashboard...</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* iOS Soft Glass Welcome Header */}
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-14 border border-white bg-white/40 shadow-xl backdrop-blur-3xl">
            {/* Soft Decorative Accents */}
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-100/40 rounded-full blur-[120px] -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[80%] bg-indigo-50/50 rounded-full blur-[100px] -ml-10 -mb-10 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div className="space-y-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/40 text-[12px] font-black text-slate-700 uppercase tracking-widest">
                  <Flame className="w-3.5 h-3.5 text-blue-400" />
                  Educator Excellence
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-none">
                  Hello, <span className="text-blue-400 italic">{user?.name?.split(' ')[0] || 'Teacher'}</span>!
                </h1>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                  Inspiring minds today? You have <span className="text-slate-800 font-black">{upcomingClasses.length} sessions</span> lined up on your agenda.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => navigate('/teacher/schedule')}
                    className="px-8 py-3.5 rounded-2xl bg-blue-400 text-white font-black text-sm shadow-xl shadow-blue-400/10 hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Full Schedule
                  </button>
                  <button
                    onClick={() => navigate('/teacher/attendance')}
                    className="px-8 py-3.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white text-slate-600 font-black text-sm hover:bg-white transition-all flex items-center gap-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Attendance
                  </button>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="p-8 rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${premiumColors.blue.icon} flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/10`}>
                      {user?.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <div className="text-slate-800 font-black">Today's Goal</div>
                      <div className="text-blue-500 text-[11px] font-black uppercase tracking-widest">Today's Goal</div>
                    </div>
                  </div>
                  <div className="w-48 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-white">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-blue-400"
                    />
                  </div>
                  <div className="mt-3 flex justify-between text-[11px] font-black text-slate-700 uppercase tracking-widest">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const color = premiumColors[stat.colorKey] || premiumColors.blue;
              return (
                <motion.div
                  key={stat.title}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className={`group relative overflow-hidden ${color.bg} backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white shadow-sm hover:shadow-md transition-all`}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className={`p-4 rounded-2xl ${color.icon} text-white shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[12px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">{stat.title}</span>
                      <div className="flex items-center gap-1 text-emerald-500 font-black text-[11px] tracking-widest uppercase">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Live
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-2">{stat.value}</p>
                    <div className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${color.icon} animate-pulse`} />
                      {stat.change}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column - Today's Schedule */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-white/85 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/50 shadow-xl overflow-hidden relative">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${premiumColors.blue.icon} text-white shadow-lg shadow-blue-500/10`}>
                          <Clock className="w-6 h-6" />
                        </div>
                        Today's Sessions
                      </h2>
                      <p className="text-gray-500 text-sm font-medium mt-1 ml-12">Track your daily teaching pipeline</p>
                    </div>
                    <button
                      onClick={() => navigate('/teacher/schedule')}
                      className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-100"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                  {upcomingClasses.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Calendar className="w-10 h-10 text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-bold">No classes scheduled for today.</p>
                      <button className="mt-4 text-blue-600 font-bold hover:underline">Sync Calendar</button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingClasses.map((cls, idx) => (
                        <motion.div
                          key={cls.id}
                          whileHover={{ x: 10 }}
                          className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-3xl bg-white/50 border border-white hover:bg-white hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                              <span className="text-[12px] font-black uppercase leading-none mb-1 text-slate-700">Session</span>
                              <span className="text-lg font-black leading-none">{idx + 1}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{cls.course || "Class Session"}</h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {cls.time}
                                </span>
                                <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> Room {cls.room || 'TBA'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="hidden sm:flex -space-x-3">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                              ))}
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">
                                +{cls.students || 0}
                              </div>
                            </div>
                            <button
                              onClick={() => navigate('/teacher/attendance')}
                              className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-black hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/10 ml-auto sm:ml-0"
                            >
                              START
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Students Section */}
              <div className="bg-white/85 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/50 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${premiumColors.indigo.icon} text-white shadow-lg shadow-indigo-500/10`}>
                      <Users className="w-6 h-6" />
                    </div>
                    Recent Students
                  </h2>
                  <button
                    onClick={() => navigate('/teacher/students')}
                    className="text-sm font-bold text-blue-600 hover:scale-105 transition-transform"
                  >
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(data?.recent_students || []).map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black overflow-hidden shadow-lg shadow-indigo-500/20">
                        {student.profile_picture_url ? (
                          <img src={student.profile_picture_url} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          student.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{student.name}</p>
                        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest truncate">{student.student_code}</p>
                      </div>
                      <button className="p-2 rounded-xl bg-white text-slate-400 hover:text-indigo-600 hover:shadow-md transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!data?.recent_students || data.recent_students.length === 0) && (
                    <div className="col-span-full py-10 text-center">
                      <Users className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm font-bold">No students found yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Engagement Chart Section (Visual Only) */}
              <div className="bg-white/85 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/50 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${premiumColors.emerald.icon} text-white shadow-lg shadow-emerald-500/10`}>
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    Student Engagement
                  </h2>
                  <select className="bg-transparent border-none text-sm font-bold text-slate-500 focus:ring-0 outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>

                <div className="h-48 w-full flex items-end justify-between gap-2 md:gap-4 px-2">
                  {[30, 45, 60, 40, 85, 70, 95].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                      <div className="w-full relative">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className={`w-full rounded-2xl bg-gradient-to-t ${i === 6 ? 'from-blue-400 to-indigo-300' : 'from-slate-100 to-slate-50'} group-hover:from-blue-300 group-hover:to-indigo-200 transition-all duration-300 relative`}
                        >
                          {i === 6 && <div className="absolute -top-1 w-full h-1 bg-white/20 blur-[1px]" />}
                          {i === 6 && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-slate-900 text-[11px] text-white font-black opacity-0 group-hover:opacity-100 transition-opacity">
                              95%
                            </div>
                          )}
                        </motion.div>
                      </div>
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">Day {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sidebar Column - Actions & Alerts */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Quick Actions Grid */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-700 ml-2">Quick Commands</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Attendance', icon: CheckSquare, colorKey: 'emerald', path: '/teacher/attendance' },
                    { label: 'Grading', icon: Award, colorKey: 'indigo', path: '/teacher/grades' },
                    { label: 'Messages', icon: Bell, colorKey: 'blue', path: '/teacher/messages' },
                    { label: 'Courses', icon: BookOpen, colorKey: 'indigo', path: '/teacher/courses' },
                  ].map((btn) => {
                    const color = premiumColors[btn.colorKey] || premiumColors.blue;
                    return (
                      <button
                        key={btn.label}
                        onClick={() => navigate(btn.path)}
                        className="group flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white border border-slate-100 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                      >
                        <div className={`p-4 rounded-2xl ${color.icon} text-white mb-3 group-hover:scale-110 shadow-lg transition-transform`}>
                          <btn.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-slate-800 tracking-tight">{btn.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* iOS Soft Glass Intelligence Card */}
              <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full -mr-16 -mt-16 blur-xl" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${premiumColors.blue.icon} text-white shadow-lg shadow-blue-500/10`}>
                      <Activity className="w-5 h-5" />
                    </div>
                    Intelligence
                  </h3>
                  <div className="space-y-6">
                    <div className="flex gap-5 group/item cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-blue-50 flex items-center justify-center shrink-0 shadow-sm group-hover/item:scale-110 transition-transform">
                        <Bell className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">System Notification</p>
                        <p className="text-sm font-bold text-slate-600 leading-snug">Assignments for "Web Dev 101" are ready for grading.</p>
                      </div>
                    </div>
                    <div className="flex gap-5 group/item cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-indigo-50 flex items-center justify-center shrink-0 shadow-sm group-hover/item:scale-110 transition-transform">
                        <Users className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">Enrollment Update</p>
                        <p className="text-sm font-bold text-slate-600 leading-snug">+5 New students joined "Advanced React".</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-10 py-4 rounded-2xl bg-blue-400 hover:bg-blue-500 text-white text-[12px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-400/20">
                    TUNE UP SETTINGS
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardHome;
