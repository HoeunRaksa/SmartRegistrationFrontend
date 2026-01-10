import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DepartmentsPage from '../pageAdmin/Departmentspage.jsx';
import MajorsPage from '../pageAdmin/Majospage.jsx';
import SubjectsPage from '../pageAdmin/Subjectpage.jsx';
import StudentPage from '../pageAdmin/Studentpage.jsx';
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
        return <DepartmentsPage />; 
      case 'majors':
        return <MajorsPage />;
      case 'subjects':
        return <SubjectsPage />;
      case 'students':
        return <StudentPage />;
      case 'registrations':
        return (
          <div className="min-h-screen p-6">
            <div className="bg-white/40 rounded-3xl p-8 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Registrations Management</h2>
              <p className="text-gray-600">Registrations component will be implemented here</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="min-h-screen p-6">
            <div className="bg-white/40 rounded-3xl p-8 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
              <p className="text-gray-600">Settings component will be implemented here</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ================= PREMIUM BACKGROUND SYSTEM ================= */}
      
      {/* Base gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30" />

      {/* Large animated orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -80, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -70, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Grid pattern */}
      <motion.div 
        animate={{
          opacity: [0.02, 0.04, 0.02],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed inset-0 pointer-events-none overflow-hidden "
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </motion.div>

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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive
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
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive
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
        <header className="sticky top-0 z-10 backdrop-blur-xl rounded-2xl bg-white/30 border-b border-white/20 shadow-md">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl bg-white/40 hover:bg-white/60 border border-white/30 transition-all"
              >
                <Menu size={20} />
              </button>

              {/* Page Title */}
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden sm:flex items-center gap-2 bg-white/40 rounded-xl px-3 py-2 border border-white/30">
                <Search size={16} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm placeholder-gray-400 w-32 lg:w-48"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl bg-white/40 hover:bg-white/60 border border-white/30 transition-all">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/40 hover:bg-white/60 border border-white/30 transition-all">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                  A
                </div>
                <span className="text-sm font-medium text-gray-700 hidden lg:block">Admin</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="min-h-screen relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderActiveSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;