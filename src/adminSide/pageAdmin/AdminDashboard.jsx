import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Users,
  Building2,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  User,
  LogOut
} from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'departments', label: 'Departments', icon: Building2, gradient: 'from-purple-500 to-pink-500' },
    { id: 'majors', label: 'Majors', icon: GraduationCap, gradient: 'from-orange-500 to-red-500' },
    { id: 'subjects', label: 'Subjects', icon: BookOpen, gradient: 'from-green-500 to-emerald-500' },
    { id: 'students', label: 'Students', icon: Users, gradient: 'from-indigo-500 to-blue-500' },
    { id: 'registrations', label: 'Registrations', icon: FileText, gradient: 'from-pink-500 to-rose-500' },
    { id: 'settings', label: 'Settings', icon: Settings, gradient: 'from-gray-500 to-slate-500' },
  ];

  // Mock stats data
  const stats = [
    { label: 'Total Departments', value: '12', change: '+2', gradient: 'from-blue-500 to-cyan-500', icon: Building2 },
    { label: 'Active Majors', value: '45', change: '+5', gradient: 'from-purple-500 to-pink-500', icon: GraduationCap },
    { label: 'Total Students', value: '1,234', change: '+89', gradient: 'from-orange-500 to-red-500', icon: Users },
    { label: 'Subjects', value: '156', change: '+12', gradient: 'from-green-500 to-emerald-500', icon: BookOpen },
  ];

  const recentActivities = [
    { action: 'New student registered', time: '5 min ago', type: 'success' },
    { action: 'Department updated', time: '1 hour ago', type: 'info' },
    { action: 'Major added to system', time: '3 hours ago', type: 'success' },
    { action: 'Subject schedule changed', time: '5 hours ago', type: 'warning' },
  ];

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className="fixed left-0 top-0 h-screen backdrop-blur-2xl bg-white/40 border-r border-white/20 shadow-2xl z-40 hidden md:block"
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8 px-2">
            {!sidebarCollapsed && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                NovaTech
              </motion.h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 transition border border-white/20"
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    isActive
                      ? 'backdrop-blur-xl bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg'
                      : 'backdrop-blur-xl bg-white/30 text-gray-700 hover:bg-white/50'
                  } border border-white/20`}
                >
                  <Icon size={20} />
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className={`mt-auto pt-4 border-t border-white/20 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
            <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-3 border border-white/20">
              {sidebarCollapsed ? (
                <User size={24} className="text-gray-700" />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">Admin User</p>
                    <p className="text-xs text-gray-600">admin@novatech.edu</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 h-screen w-72 backdrop-blur-2xl bg-white/40 border-r border-white/20 shadow-2xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full p-4">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    NovaTech
                  </h1>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex-1 space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                          isActive
                            ? 'backdrop-blur-xl bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg'
                            : 'backdrop-blur-xl bg-white/30 text-gray-700 hover:bg-white/50'
                        } border border-white/20`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        {/* Top Bar */}
        <header className="sticky rounded-3xl top-5 z-30 backdrop-blur-2xl bg-white/40 border-b border-white/20 shadow-lg mx-5">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 transition border border-white/20"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden sm:flex items-center gap-2 backdrop-blur-xl bg-white/40 rounded-2xl px-4 py-2 border border-white/20">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm placeholder-gray-500 w-48"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 transition border border-white/20 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <button className="hidden sm:flex items-center gap-2 p-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 transition border border-white/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8 relative z-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600 font-light">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 backdrop-blur-xl bg-white/30 rounded-2xl border border-white/20">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/20 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Add Department', gradient: 'from-blue-500 to-cyan-500', icon: Building2 },
                  { label: 'Add Major', gradient: 'from-purple-500 to-pink-500', icon: GraduationCap },
                  { label: 'Add Subject', gradient: 'from-green-500 to-emerald-500', icon: BookOpen },
                  { label: 'View Reports', gradient: 'from-orange-500 to-red-500', icon: FileText },
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      className={`p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-white/20`}
                    >
                      <Icon size={24} className="mb-2" />
                      <p className="text-sm font-semibold">{action.label}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;