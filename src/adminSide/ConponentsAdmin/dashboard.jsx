import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, GraduationCap, DollarSign, TrendingUp, TrendingDown,
  Activity, Calendar, Award, AlertCircle, CheckCircle, Clock, Building,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Play, Pause,
  Orbit, Layers, Sparkles, Zap, Eye, Grid3x3, Box, Database,
  ShieldCheck, Globe, Cpu, ArrowUpRight, ArrowDownRight, Search,
  Settings, Bell, MoreHorizontal, UserCheck
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
      gradient: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-500/20',
      label: 'Enrolled Today'
    },
    {
      title: 'Global Courses',
      value: stats.totalCourses,
      change: '+4%',
      trend: 'up',
      icon: BookOpen,
      gradient: 'from-violet-600 to-purple-600',
      shadow: 'shadow-purple-500/20',
      label: 'Standard Syllabus'
    },
    {
      title: 'Active Depts',
      value: stats.totalDepartments,
      change: 'Operational',
      trend: 'up',
      icon: Building,
      gradient: 'from-emerald-600 to-teal-600',
      shadow: 'shadow-emerald-500/20',
      label: 'High Efficiency'
    },
    {
      title: 'Admissions',
      value: stats.pendingRegistrations,
      change: stats.pendingRegistrations > 0 ? 'Review Needed' : 'Fully Clear',
      trend: stats.pendingRegistrations > 0 ? 'down' : 'up',
      icon: GraduationCap,
      gradient: 'from-orange-600 to-amber-600',
      shadow: 'shadow-orange-500/20',
      label: 'Pipeline Queue'
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
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 rounded-full border-b-4 border-blue-600"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-slate-500 font-black tracking-widest uppercase text-sm animate-pulse">Initializing Data Stream...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen w-full space-y-8 pb-12"
    >
      {/* Dynamic Command Center Header */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-[2.5rem] overflow-hidden p-8 md:p-12 shadow-2xl group"
      >
        {/* Background Layer */}
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        {/* Dynamic Blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 flex flex-col xl:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Enterprise Dashboard v2.4</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
              Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 italic">Central</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
              Experience real-time telemetry from across the entire university infrastructure. Monitor, analyze, and optimize institutional performance seamlessly.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-3 rounded-2xl bg-white text-slate-900 font-black text-sm shadow-xl shadow-blue-500/10 hover:scale-105 transition-transform flex items-center gap-2">
                <Database className="w-4 h-4" />
                Export Global Data
              </button>
              <button className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-xl">
                <Globe className="w-4 h-4 text-cyan-400" />
                Network View
              </button>
            </div>
          </div>

          <div className="w-full xl:w-auto grid grid-cols-2 gap-4">
            {[
              { label: 'Uptime', value: '99.98%', icon: Activity, color: 'text-emerald-400' },
              { label: 'Latency', value: '24ms', icon: Zap, color: 'text-amber-400' },
              { label: 'Users', value: '1.2k', icon: Users, color: 'text-blue-400' },
              { label: 'System', value: 'OPTIMAL', icon: CheckCircle, color: 'text-cyan-400' },
            ].map((m) => (
              <div key={m.label} className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <m.icon className={`w-4 h-4 ${m.color}`} />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</span>
                </div>
                <div className="text-2xl font-black text-white">{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* High-Performance Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative overflow-hidden bg-white/40 backdrop-blur-2xl rounded-[2rem] p-8 border border-white shadow-xl shadow-slate-200/50"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110`} />

            <div className="flex items-center justify-between mb-8">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} ${stat.shadow} group-hover:rotate-6 transition-transform shadow-lg`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col items-end">
                <div className={`flex items-center gap-1 font-black text-xs ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</h3>
              <p className="text-4xl font-black text-slate-800 tracking-tighter">{stat.value.toLocaleString()}</p>
              <div className="flex items-center gap-2 pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full border border-white bg-slate-200" />)}
                </div>
                <span className="text-[9px] font-bold text-slate-400 italic">Across {stat.label}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Intelligence Engine: Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Analytics Hub */}
        <motion.div
          variants={itemVariants}
          className="xl:col-span-2 bg-white/60 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  Financial Forensics
                </h2>
                <p className="text-slate-500 font-medium text-sm mt-1 ml-14 uppercase tracking-tighter">Budgetary Stream & Revenue Allocations</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-black hover:bg-slate-200 transition-all">WEEKLY</button>
                <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black shadow-lg">MONTHLY</button>
              </div>
            </div>

            <div className="h-[400px]">
              <ComparisonBarChart
                data={charts.revenueByDept}
                xAxisKey="name"
                dataKeys={['total_revenue']}
                colors={['#2563eb']}
              />
            </div>
          </div>
        </motion.div>

        {/* Identity Matrix (Gender Dist) */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl border border-slate-800 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-8">
              <h3 className="text-xl font-black flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-indigo-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                Identity Matrix
              </h3>
              <p className="text-slate-500 text-xs font-bold mt-2 ml-10">Demographic Distribution</p>
            </div>

            <div className="flex-1 flex flex-col justify-center py-6">
              <DistributionPieChart data={charts.genderDistribution} height={300} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              {charts.genderDistribution?.map((gender) => (
                <div key={gender.name} className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{gender.name} Stream</div>
                  <div className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">{gender.value}</div>
                  <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(gender.value / (stats.totalStudents || 1)) * 100}%` }}
                      className={`h-full ${gender.name === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid: Activity & Popularity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Performance Meter */}
        <motion.div
          variants={itemVariants}
          className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-orange-100 text-orange-600 text-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                Popularity Index
              </h3>
            </div>
            <button className="p-3 rounded-2xl bg-white shadow-md text-slate-400 hover:text-orange-600 transition-all">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            {charts.popularMajors?.slice(0, 5).map((major, i) => (
              <motion.div
                key={major.name || i}
                whileHover={{ x: 10 }}
                className="flex items-center gap-6 p-4 rounded-3xl bg-white/50 border border-white/50 hover:bg-white hover:shadow-2xl transition-all group duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                    i === 1 ? 'bg-slate-100 text-slate-500' :
                      'bg-slate-50 text-slate-300'
                  }`}>
                  {i + 1}
                </div>

                <div className="flex-1">
                  <div className="font-black text-slate-800 group-hover:text-orange-600 transition-colors">{major.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Growth: +14% this month</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900 leading-none">{major.count}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Students</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Neural Activity Feed */}
        <motion.div
          variants={itemVariants}
          className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white shadow-xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
                <Activity className="w-6 h-6" />
              </div>
              Neural Stream
            </h3>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase">Live Activity</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
            {activities.map((act, i) => (
              <motion.div
                key={act.id || i}
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-3xl bg-white/50 border border-white/50 flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 leading-snug">{act.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">{act.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {activities.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 grayscale opacity-40">
                <Database size={64} className="mb-4 text-slate-300" />
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No Stream Packets Detected</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* System Core Diagnostics */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-3xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          {systemStatus.map((status) => (
            <div key={status.label} className="flex flex-col items-center gap-4 text-center group">
              <div className="relative">
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Cpu className="w-8 h-8 text-blue-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-900 animate-pulse" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">{status.label}</h4>
                <p className="text-3xl font-black group-hover:text-blue-400 transition-colors uppercase italic tracking-tighter">{status.status}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
};

export default AdminDashboard;
