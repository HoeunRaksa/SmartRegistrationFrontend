import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import DepartmentsPage from "../pageAdmin/Departmentspage.jsx";
import MajorsPage from "../pageAdmin/Majospage.jsx";
import SubjectsPage from "../pageAdmin/Subjectpage.jsx";
import StudentPage from "../pageAdmin/Studentpage.jsx";
import RegistrationsPage from "../pageAdmin/Registrationspage.jsx";
import StaffPage from "../pageAdmin/Staffpage.jsx";
import SettingPage from "../../gobalConponent/Settingpage.jsx";
import EnrollmentsPage from "../pageAdmin/EnrollmentsPage.jsx";
import GradesPage from "../pageAdmin/GradesPage.jsx";
import AssignmentsPage from "../pageAdmin/AssignmentsPage.jsx";
import AttendancePage from "../pageAdmin/AttendancePage.jsx";
import SchedulesPage from "../pageAdmin/SchedulesPage.jsx";
import CoursesPage from "../pageAdmin/CoursesPage.jsx";
import MajorSubjectsPage from "../pageAdmin/MajorSubjectsPage.jsx";
import TeacherPage from '../pageAdmin/TeacherPage.jsx';
import { logoutApi } from "../../api/auth.jsx";
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
  LogOut,
  User2Icon,
  Maximize2,
  Minimize2,
  Award,
  ClipboardList,
  CheckSquare,
  Calendar,
  Link2,
} from "lucide-react";

import Dashboard from "../../adminSide/ConponentsAdmin/dashboard.jsx";

const profileFallback = "/assets/images/profile-fallback.png";

const AdminDashboard = () => {
  const { section } = useParams();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications] = useState(3);

  const activeSection = section || "dashboard";

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  // ✅ No group / no logic change: just reorder items for easier finding
  const menuItems = [
    // Dashboard
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, gradient: "from-blue-500 to-cyan-500" },

    // Academic setup (order: Department → Major → Subject → MajorSubject)
    { id: "departments", label: "Departments", icon: Building2, gradient: "from-purple-500 to-pink-500" },
    { id: "majors", label: "Majors", icon: GraduationCap, gradient: "from-orange-500 to-red-500" },
    { id: "subjects", label: "Subjects", icon: BookOpen, gradient: "from-green-500 to-emerald-500" },
    { id: "major-subjects", label: "Major Subjects", icon: Link2, gradient: "from-cyan-500 to-blue-500" },

    // Course flow
    { id: "courses", label: "Courses", icon: BookOpen, gradient: "from-blue-500 to-cyan-500" },
    { id: "schedules", label: "Schedules", icon: Calendar, gradient: "from-cyan-500 to-blue-500" },
    { id: "assignments", label: "Assignments", icon: ClipboardList, gradient: "from-orange-500 to-amber-500" },
    { id: "attendance", label: "Attendance", icon: CheckSquare, gradient: "from-green-500 to-teal-500" },
    { id: "grades", label: "Grades", icon: Award, gradient: "from-purple-500 to-pink-500" },

    // Student management
    { id: "students", label: "Students", icon: Users, gradient: "from-indigo-500 to-blue-500" },
    { id: "registrations", label: "Registrations", icon: FileText, gradient: "from-pink-500 to-rose-500" },
    { id: "enrollments", label: "Enrollments", icon: BookOpen, gradient: "from-blue-500 to-purple-500" },

    // Staff
    { id: "teachers", label: "Teachers", icon: User2Icon, gradient: "from-indigo-500 to-blue-500" },
    { id: "staff", label: "Staff", icon: User2Icon, gradient: "from-indigo-500 to-blue-500" },

    // System
    { id: "settings", label: "Settings", icon: Settings, gradient: "from-gray-500 to-slate-500" },
  ];

  const activeMenuItem =
    menuItems.find((item) => item.id === activeSection) || menuItems[0];

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
      navigate("/admin/dashboard", { replace: true });
    }
  }, [section, navigate]); // ✅ keep dependencies stable (no menuItems)

  const handleSectionChange = useCallback(
    (sectionId) => {
      navigate(`/admin/${sectionId}`);
    },
    [navigate]
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const onFsChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Render all sections but hide inactive ones - NO REMOUNTING!
  const renderAllSections = () => {
    return (
      <>
        <div style={{ display: activeSection === "dashboard" ? "block" : "none" }}>
          <Dashboard />
        </div>
        <div style={{ display: activeSection === "departments" ? "block" : "none" }}>
          <DepartmentsPage />
        </div>
        <div style={{ display: activeSection === "majors" ? "block" : "none" }}>
          <MajorsPage />
        </div>
        <div style={{ display: activeSection === "subjects" ? "block" : "none" }}>
          <SubjectsPage />
        </div>
        <div style={{ display: activeSection === "major-subjects" ? "block" : "none" }}>
          <MajorSubjectsPage />
        </div>
        <div style={{ display: activeSection === "students" ? "block" : "none" }}>
          <StudentPage />
        </div>
        <div style={{ display: activeSection === "staff" ? "block" : "none" }}>
          <StaffPage />
        </div>
        <div style={{ display: activeSection === "registrations" ? "block" : "none" }}>
          <RegistrationsPage />
        </div>
        <div style={{ display: activeSection === "settings" ? "block" : "none" }}>
          <SettingPage />
        </div>
        <div style={{ display: activeSection === "enrollments" ? "block" : "none" }}>
          <EnrollmentsPage />
        </div>
        <div style={{ display: activeSection === "grades" ? "block" : "none" }}>
          <GradesPage />
        </div>
        <div style={{ display: activeSection === "assignments" ? "block" : "none" }}>
          <AssignmentsPage />
        </div>
        <div style={{ display: activeSection === "attendance" ? "block" : "none" }}>
          <AttendancePage />
        </div>
        <div style={{ display: activeSection === "schedules" ? "block" : "none" }}>
          <SchedulesPage />
        </div>
        <div style={{ display: activeSection === "courses" ? "block" : "none" }}>
          <CoursesPage />
        </div>
         <div style={{ display: activeSection === "teachers" ? "block" : "none" }}>
          <TeacherPage />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
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

      {/* ================= SIDEBAR - DESKTOP ================= */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.2 }}
        className="fixed left-0 top-0 h-screen backdrop-blur-2xl bg-white/30 border-r border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] z-40 hidden md:block"
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6 px-2">
            {!sidebarCollapsed && (
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                NovaTech
              </h1>
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

          {/* ✅ smaller menu to reduce height: smaller padding + smaller icon */}
          <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "backdrop-blur-xl bg-gradient-to-r " +
                        item.gradient +
                        " text-white shadow-lg"
                      : "backdrop-blur-xl bg-white/20 text-gray-700 hover:bg-white/40"
                  } border border-white/30`}
                  type="button"
                >
                  <Icon size={18} className={isActive ? "drop-shadow-sm" : ""} />
                  {!sidebarCollapsed && (
                    <span className="font-medium text-[13px]">{item.label}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-lg" />
                  )}
                </button>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all backdrop-blur-xl bg-red-600 text-white hover:bg-red-700 border border-red-500/30 shadow-lg mt-4"
            type="button"
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span className="font-medium text-[13px]">Logout</span>}
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
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    NovaTech
                  </h1>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl backdrop-blur-xl bg-white/40 hover:bg-white/60 transition-all border border-white/30"
                    aria-label="Close menu"
                    type="button"
                  >
                    <X size={20} className="text-gray-700" />
                  </button>
                </div>

                {/* ✅ smaller menu for mobile too */}
                <nav className="flex-1 space-y-1 overflow-y-auto">
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
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                          isActive
                            ? "backdrop-blur-xl bg-gradient-to-r " +
                              item.gradient +
                              " text-white shadow-lg"
                            : "backdrop-blur-xl bg-white/20 text-gray-700 hover:bg-white/40"
                        } border border-white/30`}
                        type="button"
                      >
                        <Icon size={18} />
                        <span className="font-medium text-[13px]">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all backdrop-blur-xl bg-red-600 text-white hover:bg-red-700 border border-red-500/30 shadow-lg mt-4"
                  type="button"
                >
                  <LogOut size={18} />
                  <span className="font-medium text-[13px]">Logout</span>
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
                          {user?.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">
                          {user?.name || "Admin User"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {user?.email || "admin@novatech.edu"}
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
      <div className={`transition-all duration-200 ${sidebarCollapsed ? "md:ml-20" : "md:ml-72"}`}>
        <header className="sticky top-0 z-30 backdrop-blur-2xl bg-white/40 border-b border-white/20 shadow-sm">
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
                  {React.createElement(activeMenuItem.icon, {
                    size: 20,
                    className: "text-white",
                  })}
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {activeMenuItem.label}
                  </h2>
                  <p className="hidden md:block text-xs text-gray-500">
                    Welcome back, {user?.name?.split(" ")[0] || "Admin"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2 backdrop-blur-xl bg-white/50 rounded-xl px-4 py-2.5 border border-white/40 shadow-sm hover:shadow-md hover:bg-white/60 transition-all min-w-[280px]">
                <Search size={16} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search anything..."
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
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {user?.name?.split(" ")[0] || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    {user?.role || "Administrator"}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-400 group-hover:text-gray-600 transition-colors hidden lg:block"
                />
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

export default AdminDashboard;
