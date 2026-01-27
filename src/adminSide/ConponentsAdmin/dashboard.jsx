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
      {/* 1. Dynamic Hero Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-[2.5rem] p-12 border border-white/10 shadow-3xl card-3d overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="depth-layer-1">
            <h1 className="text-6xl font-black text-white mb-4 tracking-tighter leading-none">
              Nexus <span className="text-blue-400">Intelligence</span>
            </h1>
            <p className="text-blue-100/70 text-xl font-medium max-w-xl leading-relaxed">
              Global system analytics and financial forensics for NovaTech Academic Hub.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 depth-layer-2 animate-float-3d">
            <div className="text-blue-400 text-xs font-black uppercase mb-1 tracking-widest">System Pulse</div>
            <div className="text-3xl font-black text-white tabular-nums">99.9% Uptime</div>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
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
            whileHover={{ y: -8, rotateX: 2, rotateY: 2 }}
            className="glass-3d rounded-3xl p-8 card-3d group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-8">
              <div className={`p-5 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-2xl transform-gpu group-hover:scale-110 group-hover:rotate-6 transition-all depth-layer-1`}>
                <stat.icon className="w-10 h-10 text-white" />
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md depth-layer-1 ${stat.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                {stat.change}
              </div>
            </div>
            <div className="depth-layer-2">
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em] mb-2">{stat.title}</h3>
              <p className="text-5xl font-black text-slate-800 tracking-tighter">
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
          className="xl:col-span-2 glass-3d rounded-[2rem] p-8 card-3d"
          whileHover={{ rotateY: -1 }}
        >
          <div className="flex items-center justify-between mb-8 depth-layer-1">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-emerald-500" />
              Financial Liquidity
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 uppercase">Monthly</span>
            </div>
          </div>
          <ComparisonBarChart
            data={charts.revenueByDept}
            xAxisKey="name"
            dataKeys={['total_revenue']}
            colors={['#10b981']}
          />
        </motion.div>

        {/* Gender Demographics */}
        <motion.div
          className="glass-3d rounded-[2rem] p-8 card-3d"
          whileHover={{ rotateY: 1 }}
        >
          <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-3 depth-layer-1">
            <Users className="w-8 h-8 text-indigo-500" />
            Gender Matrix
          </h3>
          <DistributionPieChart
            data={charts.genderDistribution}
            height={300}
          />
          <div className="mt-6 flex justify-center gap-6 depth-layer-1">
            {charts.genderDistribution?.map(gender => (
              <div key={gender.name} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${gender.name === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`} />
                <span className="text-sm font-bold text-slate-600">{gender.name}: {gender.value}</span>
              </div>
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
              <div key={major.name} className="flex items-center gap-4 bg-white/40 p-5 rounded-2xl border border-white/60 hover:bg-white/60 transition-all hover:translate-x-3 cursor-default">
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
                key={activity.id}
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
          {systemStatus.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center">
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
