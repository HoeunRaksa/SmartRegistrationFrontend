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
      title: 'Total Students',
      value: stats.totalStudents,
      change: stats.studentGrowth || '0%',
      trend: stats.studentGrowth?.startsWith('-') ? 'down' : 'up',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      color: 'blue',
    },
    {
      title: 'Active Courses',
      value: stats.totalCourses,
      change: '+4%',
      trend: 'up',
      icon: BookOpen,
      gradient: 'from-purple-500 to-pink-500',
      color: 'purple',
    },
    {
      title: 'Departments',
      value: stats.totalDepartments,
      change: 'Active',
      trend: 'up',
      icon: Building,
      gradient: 'from-green-500 to-emerald-500',
      color: 'emerald',
    },
    {
      title: 'Pending Apps',
      value: stats.pendingRegistrations,
      change: stats.pendingRegistrations > 0 ? 'Urgent' : 'Clear',
      trend: stats.pendingRegistrations > 0 ? 'down' : 'up',
      icon: GraduationCap,
      gradient: 'from-orange-500 to-amber-500',
      color: 'orange',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 p-6">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(148, 163, 184, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-black text-gray-900 mb-3 tracking-tight"
            >
              Nexus{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Intelligence
              </span>
            </motion.h1>
            <p className="text-gray-600 text-lg font-medium max-w-2xl">
              Global system analytics and financial forensics for NovaTech Academic Hub.
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/60 shadow-sm"
          >
            <div className="text-blue-600 text-xs font-bold uppercase mb-2 tracking-widest">
              System Health
            </div>
            <div className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              99.9% Uptime
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
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                    stat.trend === 'up'
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
        })}
      </div>

      {/* Primary Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Analytics */}
        <motion.div
          className="xl:col-span-2 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-sm hover:shadow-md transition-all"
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
        <motion.div
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-sm hover:shadow-md transition-all"
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
                    className={`w-3 h-3 rounded-full ${
                      gender.name === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
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
      </div>

      {/* Secondary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Popular Majors */}
        <motion.div
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
            {charts.popularMajors?.map((major, i) => (
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
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm mb-1.5">{major.name}</div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(major.count / (charts.popularMajors[0]?.count || 1)) * 100}%`,
                      }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                    />
                  </div>
                </div>
                <div className="text-xl font-black text-gray-900">{major.count}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
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
      </div>

      {/* System Status */}
      <motion.div
        className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-sm hover:shadow-md transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.005 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {systemStatus.map((item, i) => (
            <div key={item.label || `status-${i}`} className="flex flex-col items-center text-center">
              <div
                className={`w-4 h-4 rounded-full bg-green-500 mb-3 animate-pulse shadow-lg`}
                style={{
                  boxShadow: `0 0 20px rgba(34, 197, 94, 0.6)`,
                }}
              />
              <h4 className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">
                {item.label}
              </h4>
              <p className="text-2xl font-black text-gray-900">{item.status}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;