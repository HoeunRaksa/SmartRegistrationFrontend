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
import Dashboard from '../../adminSide/ConponentsAdmin/dashboard.jsx';

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

  // Function to render the active section component
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'departments':
        return (
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Departments Management</h2>
            <p className="text-gray-600">Departments component will be implemented here</p>
          </div>
        );
      case 'majors':
        return (
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Majors Management</h2>
            <p className="text-gray-600">Majors component will be implemented here</p>
          </div>
        );
      case 'subjects':
        return (
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Subjects Management</h2>
            <p className="text-gray-600">Subjects component will be implemented here</p>
          </div>
        );
      case 'students':
        return (
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Students Management</h2>
            <p className="text-gray-600">Students component will be implemented here</p>
          </div>
        );
      case 'registrations':
        return (
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Registrations Management</h2>
            <p className="text-gray-600">Registrations component will be implemented here</p>
          </div>
        );
      case 'settings':
        return (
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
            <p className="text-gray-600">Settings component will be implemented here</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
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

        {/* Dynamic Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 relative z-10">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;