import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, GraduationCap, DollarSign, TrendingUp, TrendingDown,
  Activity, Calendar, Award, AlertCircle, CheckCircle, Clock, Building,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Play, Pause,
  Orbit, Layers, Sparkles, Zap, Eye, Grid3x3, Box, Database
} from 'lucide-react';

import { TrendChart, ComparisonBarChart, DistributionPieChart, MultiLineChart } from '../../Components/ui/Charts';
import AdminDashboardAPI from '../../api/admin_dashboard_api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalDepartments: 0,
    totalMajors: 0,
    pendingRegistrations: 0,
  });
  const [charts, setCharts] = useState({
    enrollmentTrend: [],
    departmentDistribution: [],
    performanceData: [],
    revenueByDept: [],
    genderDistribution: [],
    popularMajors: [],
  });
  const [activities, setActivities] = useState([]);
  const [systemStatus, setSystemStatus] = useState([]);
  const [advancedStats, setAdvancedStats] = useState([]);
  const [extendedStats, setExtendedStats] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await AdminDashboardAPI.getStats();
      const data = AdminDashboardAPI.processStats(res);

      if (data) {
        setStats(data.stats);
        setCharts(data.charts);
        setActivities(data.activities);
        setSystemStatus(data.systemStatus);
        setAdvancedStats(res.data.data.advancedStats || []);
        setExtendedStats({
          academicStats: res.data.data.academicStats,
          attendanceStats: res.data.data.attendanceStats,
          campusStats: res.data.data.campusStats
        });
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      change: stats.studentGrowth || '0%',
      trend: stats.studentGrowth?.startsWith('-') ? 'down' : 'up',
      icon: Users,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      color: 'blue',
    },
    {
      title: 'Active Courses',
      value: stats.totalCourses,
      change: '+4%',
      trend: 'up',
      icon: BookOpen,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      color: 'purple',
    },
    {
      title: 'Departments',
      value: stats.totalDepartments,
      change: 'Active',
      trend: 'up',
      icon: Building,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      color: 'emerald',
    },
    {
      title: 'Pending Apps',
      value: stats.pendingRegistrations,
      change: stats.pendingRegistrations > 0 ? 'Urgent' : 'Clear',
      trend: stats.pendingRegistrations > 0 ? 'down' : 'up',
      icon: GraduationCap,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      color: 'orange',
    },
  ];

  return (
    <div className="min-h-screen w-full space-y-6">
      {/* Epic Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative glass p-8 overflow-hidden"
      >
        {/* Animated starfield background */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(30)].map((_, i) => {
            const size = Math.random() * 3 + 1;
            const colors = ['bg-blue-400', 'bg-purple-400', 'bg-white', 'bg-cyan-300'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            return (
              <motion.div
                key={i}
                className={`absolute rounded-full ${color} shadow-[0_0_8px_rgba(255,255,255,0.5)]`}
                style={{
                  width: size,
                  height: size,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.1, 0.8, 0.1],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            );
          })}
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row  items-start md:items-center justify-between gap-6 mb-6">
            <div>
              <motion.h1
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="text-5xl md:text-6xl font-black text-gray-900 mb-3 tracking-tight"
              >
                University Digital Twin
              </motion.h1>
              <motion.p
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-lg font-medium max-w-2xl"
              >
                Real-time Campus Command Center
              </motion.p>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/60 shadow-sm"
            >
              <div className="text-blue-600 text-xs font-bold uppercase mb-2 tracking-widest">
                System Health
              </div>
              <div className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
                99.9%
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 w-8 bg-blue-200/50 rounded-full overflow-hidden"
                  >
                    <motion.div
                      animate={{ x: [-32, 32] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'linear',
                      }}
                      className="h-full w-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Command Center Tabs */}
        <div className="flex flex-wrap gap-3">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-white" />
              <span className="text-white font-bold">Finance</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-white" />
              <span className="text-white font-bold">Academics</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-white" />
              <span className="text-white font-bold">Campus Ops</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {
          statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card p-5 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${stat.trend === 'up'
                      ? 'bg-green-100 text-green-600 border border-green-200'
                      : 'bg-red-100 text-red-600 border border-red-200'
                      }`}
                  >
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-black text-gray-900">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            );
          })
        }
      </div >

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Analytics */}
        <motion.div
          className="xl:col-span-2 glass-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              Financial Forensics
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-gray-200 to-gray-300 shadow-sm"
                  />
                ))}
              </div>
              <span className="px-3 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wide shadow-md">
                Live Feed
              </span>
            </div>
          </div>
          <div>
            <ComparisonBarChart
              data={charts.revenueByDept}
              xAxisKey="name"
              dataKeys={['total_revenue']}
              colors={['#10b981']}
            />
          </div>
        </motion.div>

        {/* Gender Demographics */}
        < motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Identity Matrix</h3>
          </div>

          <div className="relative mb-6">
            <DistributionPieChart data={charts.genderDistribution} height={280} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {charts.genderDistribution?.map((gender, idx) => (
              <motion.div
                key={`${gender.name}-${idx}`}
                whileHover={{ scale: 1.05 }}
                className="bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-purple-200/60 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-3 h-3 rounded-full ${gender.name === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                      }`}
                  />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {gender.name}
                  </span>
                </div>
                <div className="text-2xl font-black text-gray-900">{gender.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div >

      {/* Popular Majors & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Popular Majors */}
        < motion.div
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-sm hover:shadow-md transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Major Popularity Index
          </h3>
          <div className="space-y-3">
            {charts.popularMajors?.slice(0, 5).map((major, i) => (
              <motion.div
                key={major.id || major.name || `major-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 8, scale: 1.02 }}
                className="flex items-center gap-3 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-purple-200/60 cursor-default transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 shadow-sm text-sm">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-sm mb-1 truncate">{major.name || 'Unknown Major'}</div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(major.count / (charts.popularMajors[0]?.count || 1)) * 100}%`,
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-gray-900 leading-none">{major.count}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Students</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        < motion.div
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-sm hover:shadow-md transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <Activity className="w-5 h-5 text-white" />
            </div>
            System Activity Feed
          </h3>
          <div className="space-y-3 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar">
            {activities.length > 0 ? (
              activities.map((activity, i) => (
                <motion.div
                  key={activity.id || `activity-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.03, x: 5 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 backdrop-blur-sm border border-purple-200/60 shadow-sm transition-all"
                >
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex-shrink-0 shadow-md">
                    <Users size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm leading-snug">
                      {activity.message}
                    </p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5 uppercase tracking-wide">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 font-semibold uppercase tracking-wide text-sm animate-pulse">
                  Awaiting incoming data...
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div >

      {/* System Status */}
      < motion.div
        className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-sm hover:shadow-md transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.005 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {systemStatus.map((item, i) => (
            <div key={item.label || `status-${i}`} className="flex flex-col items-center text-center">
              <div
                className="w-4 h-4 rounded-full bg-green-500 mb-3 animate-pulse shadow-lg"
                style={{ boxShadow: `0 0 20px rgba(34, 197, 94, 0.6)` }}
              />
              <h4 className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">
                {item.label}
              </h4>
              <p className="text-2xl font-black text-gray-900">{item.status}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
