import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, GraduationCap, DollarSign, TrendingUp, TrendingDown,
  Activity, Calendar, Award, AlertCircle, CheckCircle, Clock, Building
} from 'lucide-react';
import { TrendChart, ComparisonBarChart, DistributionPieChart, MultiLineChart } from '../../Components/ui/Charts';
import { fetchStudents } from '../../api/student_api';
import { fetchRegistrations } from '../../api/registration_api';
import { fetchDepartments } from '../../api/department_api';
import { fetchCourses } from '../../api/course_api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalDepartments: 0,
    pendingRegistrations: 0,
    totalRevenue: 0,
    activeEnrollments: 0,
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [studentsRes, regsRes, deptsRes, coursesRes] = await Promise.all([
        fetchStudents().catch(() => ({ data: { data: [] } })),
        fetchRegistrations().catch(() => ({ data: { data: [] } })),
        fetchDepartments().catch(() => ({ data: { data: [] } })),
        fetchCourses().catch(() => ({ data: { data: [] } })),
      ]);

      const students = studentsRes?.data?.data || [];
      const registrations = regsRes?.data?.data || [];
      const departments = deptsRes?.data?.data || [];
      const courses = coursesRes?.data?.data || [];

      setStats({
        totalStudents: students.length,
        totalCourses: courses.length,
        totalDepartments: departments.length,
        pendingRegistrations: registrations.filter(r => r.status === 'pending').length,
        totalRevenue: registrations.reduce((sum, r) => sum + (r.tuition_fee || 0), 0),
        activeEnrollments: students.filter(s => s.status === 'active').length,
      });

      // Generate recent activities
      const recentActivities = [
        { id: 1, type: 'registration', message: `${registrations.length} new registrations this month`, time: 'Today', icon: Users },
        { id: 2, type: 'enrollment', message: `${students.length} students enrolled`, time: '2 hours ago', icon: GraduationCap },
        { id: 3, type: 'course', message: `${courses.length} courses available`, time: 'Today', icon: BookOpen },
      ];
      setActivities(recentActivities);
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
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-8 border border-white/20 shadow-2xl relative overflow-hidden preserve-3d card-3d"
      >
        <motion.div
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ backgroundSize: '200% 100%' }}
        />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">University Overview Dashboard</h1>
          <p className="text-white/90 text-lg">Real-time insights into everything happening at NovaTech University</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
            className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-2xl transition-all preserve-3d"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : stat.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                ) : (
                  <Activity className="w-4 h-4 text-gray-600" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                  {stat.change}
                </span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {stat.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={enrollmentTrendData}
          dataKey="students"
          title="📈 Student Enrollment Trend"
          color="#3b82f6"
        />
        <DistributionPieChart
          data={departmentDistribution}
          title="🏛️ Students by Department"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        <MultiLineChart
          data={performanceData}
          dataKeys={['attendance', 'grades']}
          title="📊 Attendance & Performance Overview"
          colors={['#10b981', '#8b5cf6']}
        />
      </div>

      {/* Recent Activities & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg preserve-3d card-3d"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                whileHover={{ x: 4 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/50 border border-white/60 hover:bg-white/70 transition-all"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <activity.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg preserve-3d card-3d"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            System Status
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Database', status: 'Operational', color: 'green' },
              { label: 'API Services', status: 'Operational', color: 'green' },
              { label: 'Payment Gateway', status: 'Operational', color: 'green' },
              { label: 'Email Service', status: 'Operational', color: 'green' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-white/60"
              >
                <span className="font-medium text-gray-700">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${item.color}-500 animate-pulse`} />
                  <span className={`text-sm font-semibold text-${item.color}-600`}>{item.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Alerts Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-300/40 shadow-lg preserve-3d"
      >
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Important Notices</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                {stats.pendingRegistrations > 0
                  ? `${stats.pendingRegistrations} registration${stats.pendingRegistrations !== 1 ? 's' : ''} awaiting approval`
                  : 'All registrations processed! ✅'}
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                Next semester enrollment opens in 15 days
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
