import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutApi } from '../../api/auth.jsx';
import SettingPage from '../../gobalConponent/Settingpage.jsx';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  User,
  Award,
  Clock,
  MessageSquare,
  Maximize2,
  Minimize2,
  Construction
} from 'lucide-react';

const profileFallback = "/assets/images/profile-fallback.png";

const StudentDashboard = () => {
  const { section } = useParams();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications] = useState(2);

  const activeSection = section || 'dashboard';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'courses', label: 'My Courses', icon: BookOpen, gradient: 'from-green-500 to-emerald-500' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, gradient: 'from-purple-500 to-pink-500' },
    { id: 'grades', label: 'Grades', icon: Award, gradient: 'from-orange-500 to-red-500' },
    { id: 'assignments', label: 'Assignments', icon: FileText, gradient: 'from-indigo-500 to-blue-500' },
    { id: 'attendance', label: 'Attendance', icon: Clock, gradient: 'from-teal-500 to-cyan-500' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, gradient: 'from-pink-500 to-rose-500' },
    { id: 'profile', label: 'Profile', icon: User, gradient: 'from-violet-500 to-purple-500' },
    { id: 'settings', label: 'Settings', icon: Settings, gradient: 'from-gray-500 to-slate-500' },
  ];

  const handleLogout = async () => {
    await logoutApi().catch(() => {});
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

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
      navigate('/student/dashboard', { replace: true });
    }
  }, [section, navigate]); // ✅ no logic change

  const handleSectionChange = (sectionId) => {
    navigate(`/student/${sectionId}`);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const ComingSoonSection = ({ title, icon: Icon, gradient }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[70vh]"
    >
      <div className="text-center max-w-md mx-auto px-4">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          className={`inline-flex p-8 rounded-3xl bg-gradient-to-br ${gradient} shadow-2xl mb-6`}
        >
          <Icon className="w-20 h-20 text-white" />
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h2>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Construction className="w-5 h-5 text-orange-500" />
          <p className="text-xl font-semibold text-gray-700">Coming Soon</p>
          <Construction className="w-5 h-5 text-orange-500" />
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          We're working hard to bring you this feature. Stay tuned for updates!
        </p>

        <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg">
          <p className="text-sm font-medium text-gray-700 mb-4">Expected Features:</p>
          <div className="grid grid-cols-1 gap-3">
            {['Real-time updates', 'Interactive interface', 'Mobile-friendly design', 'Easy to use dashboard']
              .map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  {feature}
                </motion.div>
              ))}
          </div>
        </div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8"
        >
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
      </div>
    </motion.div>
  );

  const renderAllSections = () => {
    return (
      <>
        {menuItems.map((item) => (
          <div key={item.id} style={{ display: activeSection === item.id ? 'block' : 'none' }}>
            {item.id === 'settings' ? (
              <SettingPage />
            ) : (
              <ComingSoonSection
                title={item.label}
                icon={item.icon}
                gradient={item.gradient}
              />
            )}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* ================= BACKGROUND SYSTEM ================= */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30" />

      {/* Static orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* ================= SIDEBAR - DESKTOP ================= */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.2 }}
        className="fixed left-0 top-0 h-screen backdrop-blur-2xl bg-white/30 border-r border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] z-40 hidden md:block"
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8 px-2">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  NovaTech
                </h1>
                <p className="text-xs text-gray-600 mt-0.5">Student Portal</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 transition-all border border-white/30 shadow-sm"
            >
              {sidebarCollapsed ? (
                <ChevronRight size={20} className="text-gray-700" />
              ) : (
                <ChevronLeft size={20} className="text-gray-700" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    isActive
                      ? 'backdrop-blur-xl bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg'
                      : 'backdrop-blur-xl bg-white/20 text-gray-700 hover:bg-white/40'
                  } border border-white/30`}
                >
                  <Icon size={20} className={isActive ? "drop-shadow-sm" : ""} />
                  {!sidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                  {isActive && !sidebarCollapsed && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-lg" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl transition-all backdrop-blur-xl bg-red-600 text-white hover:bg-red-700 border border-red-500/30 shadow-lg mt-5"
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
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
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 top-0 h-screen w-72 backdrop-blur-2xl bg-white/40 border-r border-white/20 shadow-2xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full p-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      NovaTech
                    </h1>
                    <p className="text-xs text-gray-600">Student Portal</p>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 transition-all border border-white/30"
                  >
                    <X size={20} className="text-gray-700" />
                  </button>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
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
                      </button>
                    );
                  })}
                </nav>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl transition-all backdrop-blur-xl bg-red-600 text-white hover:bg-red-700 border border-red-500/30 shadow-lg mt-5"
                >
                  <LogOut size={20} />
                  <span className="font-medium text-sm">Logout</span>
                </button>

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
                          {user?.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">
                          {user?.name || 'Student'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {user?.email || 'student@novatech.edu'}
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
      <div className={`transition-all duration-200 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        {/* ================= TOP BAR ================= */}
        <header className="sticky top-0 z-30 backdrop-blur-2xl bg-white/40 border-b border-white/20 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">

            {/* Left Section */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2.5 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md"
              >
                <Menu size={20} className="text-gray-700" />
              </button>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                  {React.createElement(
                    menuItems.find(item => item.id === activeSection)?.icon || LayoutDashboard,
                    { size: 20, className: "text-white" }
                  )}
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                  </h2>
                  <p className="hidden md:block text-xs text-gray-500">
                    Welcome back, {user?.name?.split(' ')[0] || 'Student'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">

              <div className="hidden lg:flex items-center gap-2 backdrop-blur-xl bg-white/50 rounded-xl px-4 py-2.5 border border-white/40 shadow-sm hover:shadow-md hover:bg-white/60 transition-all min-w-[280px]">
                <Search size={16} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search courses, assignments..."
                  className="bg-transparent outline-none text-sm placeholder-gray-400 w-full text-gray-700 font-medium"
                />
              </div>

              <button className="lg:hidden p-2.5 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md">
                <Search size={18} className="text-gray-700" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="hidden md:flex p-2.5 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md group"
              >
                {isFullscreen ? (
                  <Minimize2 size={18} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <Maximize2 size={18} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
                )}
              </button>

              <button className="relative p-2.5 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md group">
                <Bell size={18} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
                {notifications > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] font-bold text-white shadow-lg border-2 border-white">
                      {notifications}
                    </span>
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-400 animate-ping opacity-75"></span>
                  </>
                )}
              </button>

              <div className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md cursor-pointer group">
                {user?.profile_picture_url ? (
                  <img
                    src={user.profile_picture_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-white/60 group-hover:ring-blue-400 transition-all"
                    onError={(e) => {
                      e.target.src = profileFallback;
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white/60 group-hover:ring-blue-400 transition-all">
                    {user?.name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                )}
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {user?.name?.split(' ')[0] || 'Student'}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">Student</p>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors hidden lg:block" />
              </div>

            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-6 pb-3 text-xs text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="font-medium text-blue-600">
              {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="min-h-screen pt-6 relative z-10 w-full">
          {renderAllSections()}
        </main>
      </div>

      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </div>
  );
};

export default StudentDashboard;
