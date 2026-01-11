import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import profileFallback from '../../../public/assets/images/profile.png';

const AdminDashboard = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const activeSection = section || 'dashboard';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'departments', label: 'Departments', icon: Building2, gradient: 'from-purple-500 to-pink-500' },
    { id: 'majors', label: 'Majors', icon: GraduationCap, gradient: 'from-orange-500 to-red-500' },
    { id: 'subjects', label: 'Subjects', icon: BookOpen, gradient: 'from-green-500 to-emerald-500' },
    { id: 'students', label: 'Students', icon: Users, gradient: 'from-indigo-500 to-blue-500' },
    { id: 'registrations', label: 'Registrations', icon: FileText, gradient: 'from-pink-500 to-rose-500' },
    { id: 'settings', label: 'Settings', icon: Settings, gradient: 'from-gray-500 to-slate-500' },
  ];

  // Load user data
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Validate section
  useEffect(() => {
    const validSections = menuItems.map(item => item.id);
    if (section && !validSections.includes(section)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [section, navigate]);

  const handleSectionChange = (sectionId) => {
    navigate(`/admin/${sectionId}`);
  };

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
            <div className="backdrop-blur-2xl bg-white/30 rounded-3xl p-8 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Registrations Management</h2>
              <p className="text-gray-600">Registrations component will be implemented here</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="min-h-screen p-6">
            <div className="backdrop-blur-2xl bg-white/30 rounded-3xl p-8 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
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
        className="fixed inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </motion.div>

      {/* ================= SIDEBAR - DESKTOP ================= */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className="fixed left-0 top-0 h-screen backdrop-blur-2xl bg-white/30 border-r border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] z-40 hidden md:block"
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 transition-all border border-white/30 shadow-sm"
            >
              {sidebarCollapsed ? <ChevronRight size={20} className="text-gray-700" /> : <ChevronLeft size={20} className="text-gray-700" />}
            </motion.button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    isActive
                      ? 'backdrop-blur-xl bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg shadow-' + item.gradient.split(' ')[1] + '/20'
                      : 'backdrop-blur-xl bg-white/20 text-gray-700 hover:bg-white/40'
                  } border border-white/30`}
                >
                  <Icon size={20} className={isActive ? "drop-shadow-sm" : ""} />
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 rounded-full bg-white shadow-lg"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className={`mt-auto pt-4 border-t border-white/20 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="backdrop-blur-xl bg-white/40 rounded-2xl p-3 border border-white/30 shadow-sm cursor-pointer hover:bg-white/50 transition-all"
            >
              {sidebarCollapsed ? (
                user?.profile_picture_url ? (
                  <img
                    src={user.profile_picture_url}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = profileFallback;
                    }}
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                )
              ) : (
                <div className="flex items-center gap-3">
                  {user?.profile_picture_url ? (
                    <img
                      src={user.profile_picture_url}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/40 shadow-md"
                      onError={(e) => {
                        e.target.src = profileFallback;
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">
                      {user?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {user?.email || 'admin@novatech.edu'}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {/* ================= MOBILE SIDEBAR ================= */}
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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-72 backdrop-blur-2xl bg-white/40 border-r border-white/20 shadow-2xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full p-4">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    NovaTech
                  </h1>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 transition-all border border-white/30"
                  >
                    <X size={20} className="text-gray-700" />
                  </motion.button>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSectionChange(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                          isActive
                            ? 'backdrop-blur-xl bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg'
                            : 'backdrop-blur-xl bg-white/20 text-gray-700 hover:bg-white/40'
                        } border border-white/30`}
                      >
                        <Icon size={20} />
                        <span className="font-medium text-sm">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </nav>

                {/* Mobile User Profile */}
                <div className="mt-auto pt-4 border-t border-white/20">
                  <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-3 border border-white/30">
                    <div className="flex items-center gap-3">
                      {user?.profile_picture_url ? (
                        <img
                          src={user.profile_picture_url}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border-2 border-white/40 shadow-md"
                          onError={(e) => {
                            e.target.src = profileFallback;
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                          {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">
                          {user?.name || 'Admin User'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {user?.email || 'admin@novatech.edu'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ================= MAIN CONTENT ================= */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 backdrop-blur-2xl bg-white/30 border-b border-white/20 shadow-[0_4px_24px_0_rgba(31,38,135,0.1)]">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl bg-white/40 hover:bg-white/60 border border-white/30 transition-all shadow-sm"
              >
                <Menu size={20} className="text-gray-700" />
              </motion.button>

              {/* Page Title */}
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden sm:flex items-center gap-2 backdrop-blur-xl bg-white/40 rounded-xl px-3 py-2 border border-white/30 shadow-sm hover:bg-white/50 transition-all">
                <Search size={16} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm placeholder-gray-400 w-32 lg:w-48 text-gray-700"
                />
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 border border-white/30 transition-all shadow-sm"
              >
                <Bell size={18} className="text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </motion.button>

              {/* Profile */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 border border-white/30 transition-all shadow-sm"
              >
                {user?.profile_picture_url ? (
                  <img
                    src={user.profile_picture_url}
                    alt="Profile"
                    className="w-7 h-7 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = profileFallback;
                    }}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden lg:block">
                  {user?.name?.split(' ')[0] || 'Admin'}
                </span>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area - SMOOTH NO FLICKER */}
        <main className="min-h-screen relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.15,
                ease: "easeOut"
              }}
            >
              {renderActiveSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    // ✅ USE THIS:
<style>
  {`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}
</style>
    </div>
  );
};

export default AdminDashboard;