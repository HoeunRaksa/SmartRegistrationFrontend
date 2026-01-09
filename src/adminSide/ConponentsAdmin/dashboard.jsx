import React, { useEffect, useState } from "react";
import DepartmentsForm from '../ConponentsAdmin/DepartmentsForm.jsx';
import "../../App.css";
import { motion, AnimatePresence } from "framer-motion";
import Clock from "../ConponentsAdmin/Clock";
import {
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Calendar,
  Award,
  ArrowUp,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import profileFallback from "../../../public/assets/images/profile.png";
import { i } from "framer-motion/client";

const Dashboard = () => {
  const [activeView, setActiveView] = useState('admin/dashboard');
  const [user, setUser] = useState(null);


  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);



  /* ================= DATA ================= */

  const stats = [
    { label: "Total Departments", value: "12", change: "+2", gradient: "from-blue-500 to-cyan-500", icon: Building2 },
    { label: "Active Majors", value: "45", change: "+5", gradient: "from-purple-500 to-pink-500", icon: GraduationCap },
    { label: "Total Students", value: "1,234", change: "+89", gradient: "from-orange-500 to-red-500", icon: Users },
    { label: "Subjects", value: "156", change: "+12", gradient: "from-green-500 to-emerald-500", icon: BookOpen },
  ];

  const recentActivities = [
    { action: "Logged into dashboard", time: "Just now" },
    { action: "System data synced", time: "1 hour ago" },
    { action: "Permissions verified", time: "Today" },
  ];

  const topPerformingMajors = [
    { name: "Computer Science", students: 245, growth: "+12%", color: "from-blue-500 to-cyan-500" },
    { name: "Business Administration", students: 198, growth: "+8%", color: "from-purple-500 to-pink-500" },
    { name: "Engineering", students: 167, growth: "+15%", color: "from-orange-500 to-red-500" },
    { name: "Medicine", students: 134, growth: "+10%", color: "from-green-500 to-emerald-500" },
  ];

  const upcomingEvents = [
    { title: "Faculty Meeting", date: "Jan 10, 2025", time: "10:00 AM" },
    { title: "Student Orientation", date: "Jan 12, 2025", time: "2:00 PM" },
    { title: "Exam Schedule Release", date: "Jan 15, 2025", time: "9:00 AM" },
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
const BASE_IMAGE_URL =import.meta.env.VITE_IMG_BASE_URL;
  return (
    <div className="min-h-screen p-6 space-y-6 pb-8">

      {/* ================= USER HEADER WITH TIME ================= */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/50 to-white/30 rounded-3xl p-8 border border-white/30 shadow-2xl"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-md opacity-50 animate-pulse" />
                <img
                  src={
                    user.profile_picture_url
                      ? `${user.profile_picture_url}`
                      : profileFallback
                  }
                  alt="Profile"
                  className="relative w-20 h-20 rounded-full object-cover border-4 border-white/60 shadow-xl"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg" />
              </motion.div>
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-2"
                >
                  Welcome back, {user.name}
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600 capitalize mt-1 flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  {user.role} dashboard
                </motion.p>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-right"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <Clock />
              </div>
              <div className="text-xs text-gray-600 mt-1 flex items-center justify-end gap-1">
                <Calendar className="w-3 h-3" />
                <Clock />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ================= STATS WITH ENHANCED ANIMATIONS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: i * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.03,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              className="group relative overflow-hidden backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl cursor-pointer"
            >
              {/* Hover gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                  >
                    <Icon size={24} className="text-white" />
                  </motion.div>
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.3, type: "spring" }}
                    className="flex items-center gap-1 text-xs bg-green-100 text-green-600 px-2.5 py-1.5 rounded-full font-semibold shadow-sm"
                  >
                    <ArrowUp className="w-3 h-3" />
                    {stat.change}
                  </motion.span>
                </div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="text-4xl font-bold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1"
                >
                  {stat.value}
                </motion.h3>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
            </motion.div>
          );
        })}
      </div>

      {/* ================= ACTIVITY + QUICK ACTIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Activity */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Recent Activity
            </h3>
            <span className="text-xs text-gray-500 bg-white/50 px-3 py-1 rounded-full">Live</span>
          </div>
          <div className="space-y-3">
            {recentActivities.map((a, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ x: 4, scale: 1.02 }}
                className="group bg-white/40 p-4 rounded-2xl border border-white/30 hover:border-blue-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{a.action}</p>
                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {user?.name} • {a.time}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl"
        >
          <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Add Department",
                icon: Building2,
                gradient: "from-blue-500 to-cyan-500",
                view: "departments",
              },
              {
                label: "Add Major",
                icon: GraduationCap,
                gradient: "from-purple-500 to-pink-500",
                view: "majors",
              },
              {
                label: "Add Subject",
                icon: BookOpen,
                gradient: "from-green-500 to-emerald-500",
                view: "subjects",
              },
              {
                label: "View Reports",
                icon: FileText,
                gradient: "from-orange-500 to-red-500",
                view: "reports",
              },
            ].map((action, i) => {
              const Icon = action.icon;
              const isActive = activeView === action.view;

              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                  whileHover={{ 
                    scale: 1.08,
                    y: -4,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveView(action.view)}
                  className={`
                    relative overflow-hidden  p-5 rounded-2xl text-white shadow-xl transition-all duration-300
                    bg-gradient-to-br ${action.gradient}
                    ${isActive ? "ring-4 ring-white/60 shadow-2xl" : "hover:shadow-2xl"}
                  `}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-white/20 "
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10">
                    <Icon size={28} className="mb-3 mx-auto" />
                    <p className="text-sm font-semibold">{action.label}</p>
                  </div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ================= CONTENT SWITCH ================= */}
        <AnimatePresence>
          {activeView === "departments" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
              onClick={() => setActiveView("admin/dashboard")}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 backdrop-blur-3xl bg-white/95 border border-blue-200 shadow-2xl"
              >
                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveView("admin/dashboard")}
                  className="sticky top-0 right-0 ml-auto mb-4 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-colors duration-200 flex items-center justify-center font-bold z-10"
                >
                  ✕
                </motion.button>
                <DepartmentsForm />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ================= MAJORS + EVENTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Majors */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl"
        >
          <h3 className="text-xl font-bold flex items-center gap-2 mb-5">
            <TrendingUp className="text-green-500" />
            Top Performing Majors
          </h3>
          <div className="space-y-4">
            {topPerformingMajors.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="bg-white/50 p-5 rounded-2xl border border-white/30 hover:border-white/50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold text-gray-800">{m.name}</p>
                  <span className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">
                    <ArrowUp className="w-3 h-3" />
                    {m.growth}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(m.students / 250) * 100}%` }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${m.color} shadow-sm`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 min-w-[60px] text-right">
                    {m.students} students
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Events */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl"
        >
          <h3 className="text-xl font-bold flex items-center gap-2 mb-5">
            <Calendar className="text-blue-500" />
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {upcomingEvents.map((e, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ scale: 1.02, x: -4 }}
                className="group bg-white/50 p-5 rounded-2xl border border-white/30 hover:border-blue-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-2">{e.title}</p>
                    <p className="text-xs text-gray-600 flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      {e.date}
                      <span className="text-gray-400">•</span>
                      <Clock className="w-3 h-3 text-purple-500" />
                      {e.time}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ================= CHART ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl"
      >
        <h3 className="text-xl font-bold flex items-center gap-2 mb-5">
          <Award className="text-yellow-500" />
          Academic Performance Overview
        </h3>
        <div className="relative h-64 bg-gradient-to-br from-white/40 to-white/20 rounded-2xl border border-white/30 flex items-center justify-center overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="relative text-gray-500 font-medium flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Chart coming soon
          </motion.p>
        </div>
      </motion.div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>

    </div>
  );
};

export default Dashboard;