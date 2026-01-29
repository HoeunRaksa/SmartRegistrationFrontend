import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardHome from './DashboardHome.jsx';
import CoursesPage from './CoursesPage.jsx';
import StudentsPage from './StudentsPage.jsx';
import GradesPage from './GradesPage.jsx';
import AttendancePage from './AttendancePage.jsx';
import AssignmentsPage from './AssignmentsPage.jsx';
import SchedulePage from './SchedulePage.jsx';
import MessagesPage from '../../gobalConponent/MessagesPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import ProjectGroupsPage from './ProjectGroupsPage.jsx';
import SettingPage from '../../gobalConponent/Settingpage.jsx';
import { logoutApi } from '../../api/auth.jsx';
import { fetchCurrentSession } from '../../api/admin_session_api.jsx';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Award,
  CheckSquare,
  ClipboardList,
  Calendar,
  MessageSquare,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  Maximize2,
  Minimize2,
} from 'lucide-react';

const profileFallback = "/assets/images/profile-fallback.png";

const TeacherDashboard = () => {
  const { section } = useParams();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications] = useState(2); // example count

  const activeSection = section || "dashboard";

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'courses', label: 'My Courses', icon: BookOpen, gradient: 'from-green-500 to-emerald-500' },
    { id: 'students', label: 'Students', icon: Users, gradient: 'from-indigo-500 to-blue-500' },
    { id: 'grades', label: 'Grades', icon: Award, gradient: 'from-purple-500 to-pink-500' },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare, gradient: 'from-green-500 to-teal-500' },
    { id: 'project-groups', label: 'Project Groups', icon: Users, gradient: 'from-blue-600 to-indigo-600' },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList, gradient: 'from-orange-500 to-amber-500' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, gradient: 'from-cyan-500 to-blue-500' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, gradient: 'from-pink-500 to-rose-500' },
    { id: 'profile', label: 'Profile', icon: User, gradient: 'from-violet-500 to-purple-500' },
    { id: 'settings', label: 'Settings', icon: Settings, gradient: 'from-gray-500 to-slate-500' },
  ];

  const activeMenuItem = menuItems.find((item) => item.id === activeSection) || menuItems[0];

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

  useEffect(() => {
    const validSections = menuItems.map((item) => item.id);
    if (section && !validSections.includes(section)) {
      navigate("/teacher/dashboard", { replace: true });
    }
  }, [section, navigate]);

  const [currentSession, setCurrentSession] = useState(null);
  useEffect(() => {
    fetchCurrentSession().then(setCurrentSession).catch(console.error);
  }, []);

  const handleSectionChange = useCallback(
    (sectionId) => {
      navigate(`/teacher/${sectionId}`);
    },
    [navigate]
  );

  const handleLogout = async () => {
    await logoutApi().catch(() => { });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Render all sections but hide inactive ones - NO REMOUNTING!
  const renderAllSections = () => {
    return (
      <>
        <div style={{ display: activeSection === 'dashboard' ? 'block' : 'none' }}>
          <DashboardHome />
        </div>
        <div style={{ display: activeSection === 'courses' ? 'block' : 'none' }}>
          <CoursesPage />
        </div>
        <div style={{ display: activeSection === 'students' ? 'block' : 'none' }}>
          <StudentsPage />
        </div>
        <div style={{ display: activeSection === 'grades' ? 'block' : 'none' }}>
          <GradesPage />
        </div>
        <div style={{ display: activeSection === 'attendance' ? 'block' : 'none' }}>
          <AttendancePage />
        </div>
        <div style={{ display: activeSection === 'project-groups' ? 'block' : 'none' }}>
          <ProjectGroupsPage />
        </div>
        <div style={{ display: activeSection === 'assignments' ? 'block' : 'none' }}>
          <AssignmentsPage />
        </div>
        <div style={{ display: activeSection === 'schedule' ? 'block' : 'none' }}>
          <SchedulePage />
        </div>
        <div style={{ display: activeSection === 'messages' ? 'block' : 'none' }}>
          <MessagesPage />
        </div>
        <div style={{ display: activeSection === 'profile' ? 'block' : 'none' }}>
          <ProfilePage />
        </div>
        <div style={{ display: activeSection === 'settings' ? 'block' : 'none' }}>
          <SettingPage />
        </div>
      </>
    );
  };

  return (
    <div className="sidebar-layout-root min-h-screen w-full relative">
      {/* ================= BACKGROUND SYSTEM ================= */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl" />
      </div>
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* ================= SIDEBAR - DESKTOP (fixed, non-scroll, 3D) ================= */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.2 }}
        className="sidebar-fixed backdrop-blur-2xl bg-white/30 gen-z-glass border-r border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] hidden md:block"
      >
        <div className="flex flex-col h-full p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-8 px-2 flex-shrink-0">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  NovaTech
                </h1>
                <p className="text-xs text-gray-600 mt-0.5">Teacher Portal</p>
                {currentSession && (
                  <div className="mt-2 px-3 py-2 bg-blue-50/50 rounded-lg border border-blue-100">
                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-0.5">Current Session</div>
                    <div className="text-xs font-bold text-slate-700">{currentSession.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{new Date(currentSession.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(currentSession.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="p-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 transition-all border border-white/30 shadow-sm"
              aria-label="Toggle sidebar"
              type="button"
            >
              {sidebarCollapsed ? (
                <ChevronRight size={20} className="text-gray-700" />
              ) : (
                <ChevronLeft size={20} className="text-gray-700" />
              )}
            </button>
          </div>

          <nav className="sidebar-fixed-nav space-y-2 scrollbar-hide">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive
                    ? "backdrop-blur-xl bg-gradient-to-r " + item.gradient + " text-white shadow-lg"
                    : "backdrop-blur-xl bg-white/20 text-gray-700 hover:bg-white/40"
                    } border border-white/30`}
                  type="button"
                >
                  <Icon size={20} className={isActive ? "drop-shadow-sm" : ""} />
                  {!sidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                  {isActive && !sidebarCollapsed && <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-lg" />}
                </button>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl transition-all backdrop-blur-xl bg-red-600 text-white hover:bg-red-700 border border-red-500/30 shadow-lg mt-5 flex-shrink-0"
            type="button"
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* ================= MOBILE SIDEBAR (fixed, 3D) ================= */}
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
              className="sidebar-fixed w-72 backdrop-blur-2xl bg-white/40 gen-z-glass border-r border-white/20 shadow-2xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full p-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      NovaTech
                    </h1>
                    <p className="text-xs text-gray-600">Teacher Portal</p>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 transition-all border border-white/30"
                    aria-label="Close menu"
                    type="button"
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
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive
                          ? "backdrop-blur-xl bg-gradient-to-r " + item.gradient + " text-white shadow-lg"
                          : "backdrop-blur-xl bg-white/20 text-gray-700 hover:bg-white/40"
                          } border border-white/30`}
                        type="button"
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
                  type="button"
                >
                  <LogOut size={20} />
                  <span className="font-medium text-sm">Logout</span>
                </button>

                <div className="mt-auto pt-4 border-t border-white/20">
                  <div className="backdrop-blur-xl bg-white/40 rounded-2xl p-3 border border-white/30">
                    <div className="flex items-center gap-3">
                      {user?.profile_picture_url ? (
                        <img
                          src={user.profile_picture_url}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border-2 border-white/40 shadow-md"
                          onError={(e) => {
                            e.currentTarget.src = profileFallback;
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                          {user?.name?.charAt(0).toUpperCase() || "T"}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{user?.name || "Teacher"}</p>
                        <p className="text-xs text-gray-600">{user?.email || "teacher@novatech.edu"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ================= MAIN CONTENT (scrolls; sidebar stays fixed) ================= */}
      <div className={`sidebar-main transition-all duration-200 ${sidebarCollapsed ? "md:ml-20" : "md:ml-72"}`}>
        <header className="sticky top-0 z-30 backdrop-blur-2xl bg-white/40 gen-z-glass border-b border-white/20 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2.5 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md"
                type="button"
                aria-label="Open menu"
              >
                <Menu size={20} className="text-gray-700" />
              </button>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                  {React.createElement(activeMenuItem.icon, { size: 20, className: "text-white" })}
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {activeMenuItem.label}
                  </h2>
                  <p className="hidden md:block text-xs text-gray-500">
                    Welcome back, {user?.name?.split(" ")[0] || "Teacher"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2 backdrop-blur-xl bg-white/50 rounded-xl px-4 py-2.5 border border-white/40 shadow-sm hover:shadow-md hover:bg-white/60 transition-all min-w-[280px]">
                <Search size={16} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search students, courses..."
                  className="bg-transparent outline-none text-sm placeholder-gray-400 w-full text-gray-700 font-medium"
                />
                <kbd className="hidden xl:inline-flex px-2 py-1 text-xs font-semibold text-gray-600 bg-white/60 rounded border border-gray-300">
                  ⌘K
                </kbd>
              </div>

              <button
                className="lg:hidden p-2.5 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md"
                type="button"
                aria-label="Search"
              >
                <Search size={18} className="text-gray-700" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="hidden md:flex p-2.5 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md group"
                type="button"
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 size={18} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <Maximize2 size={18} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
                )}
              </button>

              <button
                className="relative p-2.5 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md group"
                type="button"
                aria-label="Notifications"
              >
                <Bell size={18} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
                {notifications > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] font-bold text-white shadow-lg border-2 border-white">
                      {notifications}
                    </span>
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-400 animate-ping opacity-75" />
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
                      e.currentTarget.src = profileFallback;
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white/60 group-hover:ring-blue-400 transition-all">
                    {user?.name?.charAt(0).toUpperCase() || "T"}
                  </div>
                )}
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {user?.name?.split(" ")[0] || "Teacher"}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">{user?.role || "Teacher"}</p>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors hidden lg:block" />
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-6 pb-3 text-xs text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="font-medium text-blue-600">{activeMenuItem.label}</span>
          </div>
        </header>

        <main className="min-h-screen pt-6 relative z-10 w-full">{renderAllSections()}</main>
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

export default TeacherDashboard;
