import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, GraduationCap, DollarSign, TrendingUp, TrendingDown,
  Activity, Calendar, Award, AlertCircle, CheckCircle, Clock, Building,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Play, Pause,
  Orbit, Layers, Sparkles, Zap, Eye, Grid3x3, Box, Database,
  ShieldCheck, Globe, Cpu, ArrowUpRight, ArrowDownRight, Search,
  Settings, Bell, MoreHorizontal, UserCheck, Flame, Star, ZapOff
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
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Active Students',
      value: stats.totalStudents,
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      gradient: 'from-blue-400 to-indigo-500',
      label: 'Enrolled Today'
    },
    {
      title: 'Global Courses',
      value: stats.totalCourses,
      change: '+4%',
      trend: 'up',
      icon: BookOpen,
      gradient: 'from-violet-400 to-purple-500',
      label: 'Standard Syllabus'
    },
    {
      title: 'Active Depts',
      value: stats.totalDepartments,
      change: 'Operational',
      trend: 'up',
      icon: Building,
      gradient: 'from-emerald-400 to-teal-500',
      label: 'High Efficiency'
    },
    {
      title: 'Admissions',
      value: stats.pendingRegistrations,
      change: stats.pendingRegistrations > 0 ? 'Waitlist' : 'Clear',
      trend: stats.pendingRegistrations > 0 ? 'down' : 'up',
      icon: GraduationCap,
      gradient: 'from-orange-400 to-amber-500',
      label: 'Pending Review'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
        <p className="mt-4 text-slate-400 font-bold tracking-widest text-xs animate-pulse">SYNCING GLASS INTERFACE...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen w-full space-y-8 pb-20 px-4 md:px-0"
    >
      {/* iOS Glass Hero Header */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-[3rem] overflow-hidden p-10 md:p-14 border border-white/10 bg-slate-900 shadow-2xl"
      >
        {/* Dark Mode Decorative Accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full blur-[140px] gpu-accelerate" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[140px] gpu-accelerate" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center justify-between">
          <div className="space-y-6 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Admin Command Suite</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.9]">
              Nova<span className="text-blue-400">Tech</span> <br />
              <span className="text-white/60">Institutional Hub</span>
            </h1>
            <p className="text-white/80 text-lg font-medium leading-relaxed">
              Seamless management experience powered by glass-morphic architecture. Control every aspect of your academic ecosystem with precision.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <button className="px-8 py-3.5 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-2xl shadow-blue-600/20 hover:scale-105 transition-transform">
                Primary Actions
              </button>
              <button className="px-8 py-3.5 rounded-2xl bg-white/10 text-white font-black text-sm border border-white/20 hover:bg-white/20 transition-all shadow-xl">
                Network Status
              </button>
            </div>
          </div>

          <div className="hidden xl:flex flex-col gap-6">
            <div className="p-8 rounded-[2.5rem] bg-white/70 border border-white shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-800">System Vitality</div>
                  <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Running Optimal</div>
                </div>
              </div>
              <div className="w-48 h-3 bg-white/50 rounded-full overflow-hidden border border-white">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                />
              </div>
              <div className="mt-4 flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Performance</span>
                <span>92%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section with iOS Glass feel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.01 }}
            className="group relative bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/60 "
          >
            <div className="flex items-center justify-between mb-8">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg shadow-blue-500/10 group-hover:rotate-6 transition-transform`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className={`flex items-center gap-1 font-black text-xs ${stat.trend === 'up' ? 'text-emerald-500' : 'text-slate-400'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</h3>
              <p className="text-4xl font-black text-slate-800 tracking-tight">{stat.value.toLocaleString()}</p>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-10">
        {/* Comparison Chart Container */}
        <motion.div
          variants={itemVariants}
          className="xl:col-span-2 bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/60 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-50/50 text-blue-500 border border-white shadow-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Financial Stream</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Revenue Distribution by Dept</p>
              </div>
            </div>
            <div className="flex bg-white/40 p-1 rounded-xl border border-white/60">
              <button className="px-4 py-2 rounded-lg text-xs font-black text-blue-600 bg-white shadow-sm">BAR VIEW</button>
              <button className="px-4 py-2 rounded-lg text-xs font-black text-slate-400">TREND</button>
            </div>
          </div>

          <div className="h-[400px]">
            <ComparisonBarChart
              data={charts.revenueByDept}
              xAxisKey="name"
              dataKeys={['total_revenue']}
              colors={['#3b82f6']}
            />
          </div>
        </motion.div>

        {/* Identity & Demographics */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/60 shadow-xl flex flex-col"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-50/50 text-purple-500 border border-white shadow-sm">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Identity Matrix</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Student Demographics</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <DistributionPieChart data={charts.genderDistribution} height={300} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {charts.genderDistribution?.map((gender) => (
              <div key={gender.name} className="p-5 rounded-3xl bg-white/40 border border-white shadow-sm group hover:scale-[1.02] transition-transform">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{gender.name}</div>
                <div className="text-2xl font-black text-slate-800">{gender.value}</div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(gender.value / (stats.totalStudents || 1)) * 100}%` }}
                    className={`h-full ${gender.name === 'Male' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        {/* Live Activity Stream */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/60 shadow-xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-indigo-50/50 text-indigo-500 border border-white shadow-sm">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Live Activity</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">Streaming</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
            {activities.map((act, i) => (
              <motion.div
                key={act.id || i}
                whileHover={{ x: 5 }}
                className="p-5 rounded-3xl bg-white/40 border border-white/60 flex gap-5 items-start transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 shrink-0 shadow-sm border border-slate-100">
                  <UserCheck className="w-6 h-6 text-blue-500/50" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-slate-700 leading-snug">{act.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{act.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Ranking / Popularity */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/60 shadow-xl"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-orange-50/50 text-orange-500 border border-white shadow-sm">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">Popularity index</h3>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {charts.popularMajors?.slice(0, 5).map((major, i) => (
              <div
                key={major.name || i}
                className="flex items-center gap-6 p-5 rounded-3xl bg-white/40 border border-white/60 hover:bg-white/100 transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${i === 0 ? 'bg-amber-100 text-amber-600' :
                  i === 1 ? 'bg-slate-100 text-slate-600' :
                    'bg-slate-50 text-slate-400'
                  }`}>
                  {i + 1}
                </div>

                <div className="flex-1">
                  <div className="font-black text-slate-800">{major.name}</div>
                  <div className="w-full bg-slate-100 h-1 rounded-full mt-2">
                    <div className="h-full bg-slate-300 w-[70%] rounded-full" />
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-slate-900 leading-none">{major.count}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Units</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modern Status Footer */}
      <motion.div
        variants={itemVariants}
        className="bg-white/10 rounded-[3rem] p-12 border border-white shadow-2xl flex flex-wrap justify-between items-center gap-12"
      >
        {systemStatus.map((status) => (
          <div key={status.label} className="flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/50 border border-white flex items-center justify-center shadow-lg">
              <Cpu className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{status.label}</h4>
              <p className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">{status.status}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
};

export default AdminDashboard;
