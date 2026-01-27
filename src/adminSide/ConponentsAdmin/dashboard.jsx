import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, GraduationCap, DollarSign, TrendingUp, TrendingDown,
  Activity, Calendar, Award, AlertCircle, CheckCircle, Clock, Building
} from 'lucide-react';
import { TrendChart, ComparisonBarChart, DistributionPieChart, MultiLineChart } from '../../Components/ui/Charts';
import AdminDashboardAPI from '../../api/admin_dashboard_api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalDepartments: 0,
    pendingRegistrations: 0,
  });
  const [charts, setCharts] = useState({
    enrollmentTrend: [],
    departmentDistribution: [],
    performanceData: [],
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

  // Sample data for charts
  const enrollmentTrendData = [
    { name: 'Jan', students: 120 },
    { name: 'Feb', students: 150 },
    { name: 'Mar', students: 180 },
    { name: 'Apr', students: 210 },
    { name: 'May', students: 190 },
    { name: 'Jun', students: 240 },
  ];

  const departmentDistribution = [
    { name: 'Engineering', value: 450 },
    { name: 'Business', value: 380 },
    { name: 'Medicine', value: 320 },
    { name: 'Arts', value: 280 },
    { name: 'Science', value: 350 },
  ];

  const performanceData = [
    { name: 'Week 1', attendance: 85, grades: 78 },
    { name: 'Week 2', attendance: 88, grades: 82 },
    { name: 'Week 3', attendance: 92, grades: 85 },
    { name: 'Week 4', attendance: 87, grades: 88 },
  ];

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      change: stats.studentGrowth || '0%',
      trend: stats.studentGrowth?.startsWith('-') ? 'down' : 'up',
      icon: Users,
      gradient: 'from-blue-600 to-cyan-400',
    },
    {
      title: 'Active Courses',
      value: stats.totalCourses,
      change: '+4%',
      trend: 'up',
      icon: BookOpen,
      gradient: 'from-purple-600 to-pink-400',
    },
    {
      title: 'Departments',
      value: stats.totalDepartments,
      change: 'Active',
      trend: 'up',
      icon: Building,
      gradient: 'from-emerald-600 to-teal-400',
    },
    {
      title: 'Pending Apps',
      value: stats.pendingRegistrations,
      change: stats.pendingRegistrations > 0 ? 'Urgent' : 'Clear',
      trend: stats.pendingRegistrations > 0 ? 'down' : 'up',
      icon: GraduationCap,
      gradient: 'from-orange-600 to-amber-400',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 shadow-2xl"
        />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 preserve-3d">
      {/* 1. Dynamic Hero Header - Improved 3D with no rotation */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-[3rem] p-12 border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="depth-layer-1">
            <motion.h1
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-7xl font-black text-white mb-4 tracking-tighter leading-none"
            >
              Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Intelligence</span>
            </motion.h1>
            <p className="text-blue-100/70 text-xl font-medium max-w-xl leading-relaxed">
              Global system analytics and financial forensics for NovaTech Academic Hub.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05, rotateZ: 2 }}
            className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20 depth-layer-2 shadow-2xl animate-float-3d"
          >
            <div className="text-blue-400 text-xs font-black uppercase mb-2 tracking-[0.3em]">System Health</div>
            <div className="text-4xl font-black text-white tabular-nums drop-shadow-lg">99.9% Uptime</div>
            <div className="mt-4 flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-1 w-8 bg-blue-500/30 rounded-full overflow-hidden"><motion.div animate={{ x: [-32, 32] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} className="h-full w-4 bg-blue-400" /></div>)}
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
      </motion.div>

      {/* 2. Advanced Stat Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -12, rotateX: 5, rotateY: 5, scale: 1.02 }}
            className="glass-3d rounded-[2rem] p-8 card-3d group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            <div className="flex items-start justify-between mb-8">
              <div className={`p-5 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-2xl transform-gpu group-hover:scale-110 group-hover:rotate-12 transition-all depth-layer-2`}>
                <stat.icon className="w-10 h-10 text-white" />
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md depth-layer-2 ${stat.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                {stat.change}
              </div>
            </div>
            <div className="depth-layer-1">
              <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-3">{stat.title}</h3>
              <p className="text-5xl font-black text-slate-800 tracking-tighter group-hover:text-blue-600 transition-colors">
                {stat.value.toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Primary Intelligence Layer */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Analytics */}
        <motion.div
          className="xl:col-span-2 glass-3d rounded-[2.5rem] p-10 card-3d shadow-2xl"
          whileHover={{ rotateY: -2, rotateX: 1 }}
        >
          <div className="flex items-center justify-between mb-10 depth-layer-1 text-3d">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                <DollarSign className="w-8 h-8" />
              </div>
              Financial Forensics
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 shadow-sm" />)}
              </div>
              <span className="px-4 py-2 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Live Feed</span>
            </div>
          </div>
          <div className="depth-layer-2">
            <ComparisonBarChart
              data={charts.revenueByDept}
              xAxisKey="name"
              dataKeys={['total_revenue']}
              colors={['#10b981']}
            />
          </div>
        </motion.div>

        {/* Gender Demographics */}
        <motion.div
          className="glass-3d rounded-[2.5rem] p-10 card-3d shadow-2xl bg-white/40"
          whileHover={{ rotateY: 2, rotateX: 1 }}
        >
          <div className="flex items-center gap-4 mb-10 depth-layer-1">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">Identity Matrix</h3>
          </div>

          <div className="depth-layer-2 relative">
            <DistributionPieChart
              data={charts.genderDistribution}
              height={300}
            />
            {/* Overlay stats in center of pie if possible - or just below */}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 depth-layer-1">
            {charts.genderDistribution?.map((gender, idx) => (
              <motion.div
                key={`${gender.name}-${idx}`}
                whileHover={{ scale: 1.05 }}
                className="bg-white/60 p-4 rounded-2xl border border-white/80 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${gender.name === 'Male' ? 'bg-blue-500' : 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]'}`} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{gender.name}</span>
                </div>
                <div className="text-2xl font-black text-slate-800 tracking-tight">{gender.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 4. Secondary Logistics Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Majors Leaderboard */}
        <motion.div className="glass-3d rounded-[2rem] p-8 card-3d">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-3 depth-layer-1">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            Major Popularity Index
          </h3>
          <div className="space-y-4 depth-layer-1">
            {charts.popularMajors?.map((major, i) => (
              <div key={major.id || major.name || `major-${i}`} className="flex items-center gap-4 bg-white/40 p-5 rounded-2xl border border-white/60 hover:bg-white/60 transition-all hover:translate-x-3 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{major.name}</div>
                  <div className="w-full bg-slate-200 h-2 mt-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(major.count / (charts.popularMajors[0]?.count || 1)) * 100}%` }}
                      className="bg-orange-500 h-full rounded-full"
                    />
                  </div>
                </div>
                <div className="text-xl font-black text-slate-700">{major.count}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Real-time Event Feed */}
        <motion.div className="glass-3d rounded-[2rem] p-8 card-3d">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-3 depth-layer-1">
            <Activity className="w-8 h-8 text-blue-500" />
            Quantum System Feed
          </h3>
          <div className="space-y-4 depth-layer-1 overflow-y-auto max-h-[460px] pr-2 custom-scrollbar">
            {activities.length > 0 ? activities.map((activity, i) => (
              <motion.div
                key={activity.id || `activity-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/50 border border-white/60 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Users size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 leading-tight">{activity.message}</p>
                  <p className="text-xs font-black text-slate-400 mt-1 uppercase tracking-tighter">{activity.time}</p>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest italic animate-pulse">
                Awaiting incoming data...
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* 5. Infrastructure Integrity */}
      <motion.div
        className="glass-3d rounded-[2rem] p-10 card-3d"
        whileHover={{ scale: 1.005 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 depth-layer-1">
          {systemStatus.map((item, i) => (
            <div key={item.label || `status-${i}`} className="flex flex-col items-center text-center">
              <div className={`w-4 h-4 rounded-full bg-${item.color}-500 mb-4 shadow-[0_0_20px_#22c55e] animate-pulse`} />
              <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{item.label}</h4>
              <p className="text-2xl font-black text-slate-800">{item.status}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

  );
};

export default AdminDashboard;
