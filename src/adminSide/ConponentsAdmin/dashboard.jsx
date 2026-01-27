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
      change: '+12%',
      trend: 'up',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Active Courses',
      value: stats.totalCourses,
      change: '+8%',
      trend: 'up',
      icon: BookOpen,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Departments',
      value: stats.totalDepartments,
      change: 'Stable',
      trend: 'neutral',
      icon: Building,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Pending Registrations',
      value: stats.pendingRegistrations,
      change: stats.pendingRegistrations > 0 ? 'Needs Review' : 'All Clear',
      trend: stats.pendingRegistrations > 0 ? 'down' : 'up',
      icon: GraduationCap,
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 preserve-3d">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, z: -100 }}
        animate={{ opacity: 1, z: 0 }}
        className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-10 border border-white/20 shadow-2xl relative overflow-hidden card-3d"
      >
        <div className="relative z-10 depth-layer-1">
          <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">University Overview</h1>
          <p className="text-white/80 text-xl font-medium max-w-2xl">
            Real-time system intelligence and academic performance metrics for NovaTech University.
          </p>
        </div>
        {/* Decorative 3D elements */}
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-5%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{
              scale: 1.05,
              rotateY: 5,
              translateZ: 20
            }}
            className="bg-white/70 backdrop-blur-md rounded-3xl p-7 border border-white/40 shadow-xl hover:shadow-2xl transition-all card-3d group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg transform-gpu group-hover:scale-110 group-hover:rotate-6 transition-transform depth-layer-1`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col items-end depth-layer-1">
                <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend === 'up' ? 'text-emerald-500' : stat.trend === 'down' ? 'text-rose-500' : 'text-slate-500'}`}>
                  {stat.trend === 'up' ? <TrendingUp size={16} /> : stat.trend === 'down' ? <TrendingDown size={16} /> : <Activity size={16} />}
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>

            <div className="depth-layer-2">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{stat.title}</h3>
              <p className="text-4xl font-black bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">
                {stat.value.toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section with 3D Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 preserve-3d">
        <motion.div
          whileHover={{ rotateY: -2 }}
          className="card-3d"
        >
          <TrendChart
            data={charts.enrollmentTrend}
            dataKey="students"
            title="📈 Enrollment Velocity"
            color="#3b82f6"
          />
        </motion.div>
        <motion.div
          whileHover={{ rotateY: 2 }}
          className="card-3d"
        >
          <DistributionPieChart
            data={charts.departmentDistribution}
            title="🏛️ Academic Distribution"
          />
        </motion.div>
      </div>

      {/* Activities & Status with Depth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-3d rounded-3xl p-8 border border-white/40 shadow-2xl card-3d"
        >
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 depth-layer-1">
            <Activity className="w-6 h-6 text-indigo-600" />
            Live System Feed
          </h3>
          <div className="space-y-4 depth-layer-1">
            {activities.length > 0 ? activities.map((activity, i) => {
              const Icon = activity.icon === 'Users' ? Users : GraduationCap;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/40 border border-white/60 hover:bg-white/60 transition-all shadow-sm"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{activity.message}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-tighter opacity-70">{activity.time}</p>
                  </div>
                </motion.div>
              );
            }) : (
              <p className="text-slate-500 text-center py-10 font-medium">No recent activity detected.</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-3d rounded-3xl p-8 border border-white/40 shadow-2xl card-3d"
        >
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 depth-layer-1">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            Infrastructure Pulse
          </h3>
          <div className="space-y-4 depth-layer-1">
            {systemStatus.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="flex items-center justify-between p-5 rounded-2xl bg-white/40 border border-white/60 shadow-sm"
              >
                <span className="font-bold text-slate-700">{item.label}</span>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-${item.color}-100 text-${item.color}-600 border border-${item.color}-200`}>
                    {item.status}
                  </span>
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Interactive 3D Notices */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01, rotateX: 2 }}
        className="glass-3d bg-gradient-to-r from-orange-500/10 to-rose-500/10 rounded-3xl p-8 border border-orange-200/40 shadow-2xl card-3d"
      >
        <div className="flex items-start gap-6 depth-layer-1">
          <div className="p-4 rounded-2xl bg-orange-500 shadow-lg animate-float-3d">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Intelligence Briefing</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-center gap-3 bg-white/30 p-3 rounded-xl border border-white/40">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-slate-700">
                  {stats.pendingRegistrations > 0
                    ? `${stats.pendingRegistrations} Registrations Action Required`
                    : 'System Fully Synchronized ✅'}
                </span>
              </li>
              <li className="flex items-center gap-3 bg-white/30 p-3 rounded-xl border border-white/40">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-slate-700">Enrollment window opens in 15 days</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>

  );
};

export default AdminDashboard;
