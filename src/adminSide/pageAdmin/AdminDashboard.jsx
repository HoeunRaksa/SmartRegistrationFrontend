import React, { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  Building,
  University,
  Shield
} from "lucide-react";

const profileFallback = "/assets/images/profile-fallback.png";

/* =========================
   LAZY LOADED COMPONENTS
   (Only load when needed)
========================= */
const Dashboard = lazy(() => import("../../adminSide/ConponentsAdmin/dashboard.jsx"));
const DepartmentsPage = lazy(() => import("../pageAdmin/Departmentspage.jsx"));
const MajorsPage = lazy(() => import("../pageAdmin/Majospage.jsx"));
const SubjectsPage = lazy(() => import("../pageAdmin/Subjectpage.jsx"));
const StudentPage = lazy(() => import("../pageAdmin/Studentpage.jsx"));
const RegistrationsPage = lazy(() => import("../pageAdmin/Registrationspage.jsx"));
const StaffPage = lazy(() => import("../pageAdmin/Staffpage.jsx"));
const SettingPage = lazy(() => import("../../gobalConponent/Settingpage.jsx"));
const EnrollmentsPage = lazy(() => import("../pageAdmin/EnrollmentsPage.jsx"));
const GradesPage = lazy(() => import("../pageAdmin/GradesPage.jsx"));
const AssignmentsPage = lazy(() => import("../pageAdmin/AssignmentsPage.jsx"));
const AttendancePage = lazy(() => import("../pageAdmin/AttendancePage.jsx"));
const SchedulesPage = lazy(() => import("../pageAdmin/SchedulesPage.jsx"));
const CoursesPage = lazy(() => import("../pageAdmin/CoursesPage.jsx"));
const MajorSubjectsPage = lazy(() => import("../pageAdmin/MajorSubjectsPage.jsx"));
const TeacherPage = lazy(() => import("../pageAdmin/TeacherPage.jsx"));
const ClassGroupsPage = lazy(() => import("../pageAdmin/ClassGroupsPage.jsx"));
const RoomsPage = lazy(() => import('../pageAdmin/RoomsPage.jsx'));
const BuildingsPage = lazy(() => import("./BuildingsPage.jsx"));
const MajorQuotasPage = lazy(() => import("./MajorQuotasPage.jsx"));
const AcademicSessionsPage = lazy(() => import("./AcademicSessionsPage.jsx"));
const AuditLogsPage = lazy(() => import("./AuditLogsPage.jsx"));

/* =========================
   LOADING COMPONENT
========================= */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600"
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="mt-4 text-center"
      >
        <p className="text-sm font-medium text-gray-600">Loading...</p>
      </motion.div>
    </div>
  </div>
);

/* =========================
   PERMANENT FAST CONSTANTS
========================= */
const MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "departments",
    label: "Departments",
    icon: Building,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "majors",
    label: "Majors",
    icon: GraduationCap,
    gradient: "from-orange-500 to-red-500",
  },

  {
    id: "buildings",
    label: "Buildings",
    icon: Building,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "rooms",
    label: "Rooms",
    icon: University,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "subjects",
    label: "Subjects",
    icon: BookOpen,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "major-subjects",
    label: "Major Subjects",
    icon: Link2,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: "class-groups",
    label: "Class Groups",
    icon: Building2,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "courses",
    label: "Courses",
    icon: BookOpen,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "schedules",
    label: "Schedules",
    icon: Calendar,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: "academic-sessions",
    label: "Academic Sessions",
    icon: Calendar,
    gradient: "from-blue-600 to-indigo-600",
  },


  {
    id: "students",
    label: "Students",
    icon: Users,
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    id: "majors-quotas",
    label: "Major Quotas",
    icon: FileText,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "registrations",
    label: "Registrations",
    icon: FileText,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "enrollments",
    label: "Enrollments",
    icon: BookOpen,
    gradient: "from-blue-500 to-purple-500",
  },
  {
    id: "teachers",
    label: "Teachers",
    icon: User2Icon,
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    id: "staff",
    label: "Staff",
    icon: User2Icon,
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    gradient: "from-gray-500 to-slate-500",
  },
  {
    id: "audit-logs",
    label: "Audit Logs",
    icon: Shield,
    gradient: "from-amber-500 to-orange-500",
  },
];

const VALID_SECTIONS = new Set(MENU_ITEMS.map((i) => i.id));
const MENU_BY_ID = new Map(MENU_ITEMS.map(item => [item.id, item]));

const SidebarItem = React.memo(function SidebarItem({
  item,
  isActive,
  sidebarCollapsed,
  onClick,
  index,
}) {
  const Icon = item.icon;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-300 ${isActive
        ? "bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] text-blue-600 border border-gray-100"
        : "text-gray-500 hover:bg-white/50 hover:text-slate-900"
        }`}
      type="button"
    >
      <div className={`p-2 rounded-xl transition-all duration-300 ${isActive
        ? "bg-gradient-to-br " + item.gradient + " text-white shadow-lg scale-110"
        : "bg-gray-100 group-hover:bg-white group-hover:shadow-md"
        }`}>
        <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      {!sidebarCollapsed && (
        <span className={`font-bold text-[13px] tracking-tight transition-colors ${isActive ? "text-slate-900" : "group-hover:text-slate-900"}`}>
          {item.label}
        </span>
      )}
      {isActive && !sidebarCollapsed && (
        <motion.div
          layoutId="admin-active-pill"
          className="ml-auto w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600 shadow-sm"
        />
      )}
    </motion.button>
  );
});

/* =========================
   ACTIVE PAGE COMPONENT
   (Only renders current page)
========================= */
const ActivePage = React.memo(({ section }) => {
  const renderPage = () => {
    switch (section) {
      case "dashboard":
        return <Dashboard />;
      case "departments":
        return <DepartmentsPage />;
      case "majors":
        return <MajorsPage />;
      case "buildings":
        return <BuildingsPage />;
      case "rooms":
      case "class":
        return <RoomsPage />;
      case "subjects":
        return <SubjectsPage />;
      case "major-subjects":
        return <MajorSubjectsPage />;
      case "students":
        return <StudentPage />;
      case "staff":
        return <StaffPage />;
      case "majors-quotas":
        return <MajorQuotasPage />;
      case "registrations":
        return <RegistrationsPage />;
      case "settings":
        return <SettingPage />;
      case "enrollments":
        return <EnrollmentsPage />;
      case "grades":
        return <GradesPage />;
      case "assignments":
        return <AssignmentsPage />;
      case "attendance":
        return <AttendancePage />;
      case "schedules":
        return <SchedulesPage />;
      case "courses":
        return <CoursesPage />;
      case "teachers":
        return <TeacherPage />;
      case "class-groups":
        return <ClassGroupsPage />;
      case "academic-sessions":
        return <AcademicSessionsPage />;
      case "audit-logs":
        return <AuditLogsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Suspense fallback={<PageLoader />}>
      {renderPage()}
    </Suspense>
  );
});

/* =========================
   MAIN COMPONENT
========================= */
const AdminDashboard = () => {
  const { section } = useParams();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications] = useState(3);

  const activeSection = section || "dashboard";

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }, []);

  const activeMenuItem = useMemo(() => {
    return MENU_BY_ID.get(activeSection) || MENU_ITEMS[0];
  }, [activeSection]);

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
    if (section && !VALID_SECTIONS.has(section)) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [section, navigate]);

  const handleSectionChange = useCallback(
    (sectionId) => {
      navigate(`/admin/${sectionId}`);
      setMobileMenuOpen(false);
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

  return (
    <div className="sidebar-layout-root min-h-screen w-full relative">
      {/* ================= BACKGROUND SYSTEM ================= */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"
        />
      </div>
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* ================= SIDEBAR - DESKTOP (fixed, non-scroll, 3D) ================= */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.2 }}
        className="sidebar-fixed glass-bar gen-z-glass border-r border-white/20 hidden md:block"
      >
        <div className="flex flex-col h-full p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-8 px-2 flex-shrink-0">
            {sidebarCollapsed ? (
              <div className="mx-auto">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">N</span>
                </div>
              </div>
            ) : (
              <div className="group cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform">
                    <span className="text-white font-black text-lg">N</span>
                  </div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                    NovaTech
                  </h1>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-10">Admin Authority</p>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="absolute -right-3 top-10 p-1.5 rounded-full bg-white shadow-xl border border-gray-100 text-gray-400 hover:text-blue-600 transition-all z-20"
              aria-label="Toggle sidebar"
              type="button"
            >
              <motion.div
                animate={{ rotate: sidebarCollapsed ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {sidebarCollapsed ? (
                  <ChevronRight size={14} strokeWidth={3} />
                ) : (
                  <ChevronLeft size={14} strokeWidth={3} />
                )}
              </motion.div>
            </motion.button>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide py-4 px-1">
            {MENU_ITEMS.map((item, index) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={activeSection === item.id}
                sidebarCollapsed={sidebarCollapsed}
                onClick={() => handleSectionChange(item.id)}
                index={index}
              />
            ))}
          </nav>

          <div className="pt-4 border-t border-gray-100/50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-900/20 group"
              type="button"
            >
              <div className="p-2 rounded-xl bg-white/10 group-hover:bg-red-500 transition-colors">
                <LogOut size={18} />
              </div>
              {!sidebarCollapsed && <span className="font-bold text-sm tracking-tight">Terminate Session</span>}
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay - darker and less blurry */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Sidebar - solid and fixed position */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-white border-r border-gray-100 shadow-2xl z-[100] md:hidden"
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

                <nav className="flex-1 space-y-1 overflow-y-auto">
                  {MENU_ITEMS.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSectionChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${isActive
                          ? "bg-gradient-to-r " +
                          item.gradient +
                          " text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          } border ${isActive ? "border-white/30" : "border-gray-200"}`}
                        type="button"
                      >
                        <motion.div
                          animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon size={18} />
                        </motion.div>
                        <span className="font-medium text-[13px]">
                          {item.label}
                        </span>
                      </motion.button>
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

                <div className="mt-auto pt-4 border-t border-gray-200">
                  <div className="bg-gray-100 rounded-2xl p-3 border border-gray-200 shadow-sm">
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

      {/* ================= MAIN CONTENT (scrolls; sidebar stays fixed) ================= */}
      <div
        className={`sidebar-main transition-all duration-200 ${sidebarCollapsed ? "md:ml-20" : "md:ml-72"
          }`}
      >
        <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2.5 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md"
                type="button"
                aria-label="Open menu"
              >
                <Menu size={20} className="text-gray-700" />
              </motion.button>

              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="hidden sm:flex p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md"
                >
                  {React.createElement(activeMenuItem.icon, {
                    size: 20,
                    className: "text-white",
                  })}
                </motion.div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {activeMenuItem.label}
                  </h2>
                  <p className="hidden md:block text-xs text-gray-500">
                    Welcome back, {user?.name?.split(" ")[0] || "Admin"}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
                className="hidden lg:flex items-center gap-2 backdrop-blur-xl bg-white/50 rounded-xl px-4 py-2.5 border border-white/40 shadow-sm hover:shadow-md hover:bg-white/60 transition-all min-w-[280px]"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Search size={16} className="text-gray-500" />
                </motion.div>
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="bg-transparent outline-none text-sm placeholder-gray-400 w-full text-gray-700 font-medium"
                />
                <kbd className="hidden xl:inline-flex px-2 py-1 text-xs font-semibold text-gray-600 bg-white/60 rounded border border-gray-300">
                  ⌘K
                </kbd>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden p-2.5 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md"
                type="button"
                aria-label="Search"
              >
                <Search size={18} className="text-gray-700" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFullscreen}
                className="hidden md:flex p-2.5 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md group"
                type="button"
                aria-label="Toggle fullscreen"
              >
                <motion.div
                  animate={{ rotate: isFullscreen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isFullscreen ? (
                    <Minimize2
                      size={18}
                      className="text-gray-700 group-hover:text-blue-600 transition-colors"
                    />
                  ) : (
                    <Maximize2
                      size={18}
                      className="text-gray-700 group-hover:text-blue-600 transition-colors"
                    />
                  )}
                </motion.div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md group"
                type="button"
                aria-label="Notifications"
              >
                <motion.div
                  animate={notifications > 0 ? {
                    rotate: [0, -10, 10, -10, 10, 0],
                  } : {}}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Bell
                    size={18}
                    className="text-gray-700 group-hover:text-blue-600 transition-colors"
                  />
                </motion.div>
                {notifications > 0 && (
                  <>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] font-bold text-white shadow-lg border-2 border-white"
                    >
                      {notifications}
                    </motion.span>
                    <motion.span
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.75, 0, 0.75]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-400"
                    />
                  </>
                )}
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl backdrop-blur-xl bg-white/60 hover:bg-white/80 border border-white/40 transition-all shadow-sm hover:shadow-md cursor-pointer group"
              >
                {user?.profile_picture_url ? (
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={user.profile_picture_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-white/60 group-hover:ring-blue-400 transition-all"
                    onError={(e) => {
                      e.currentTarget.src = profileFallback;
                    }}
                  />
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white/60 group-hover:ring-blue-400 transition-all"
                  >
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </motion.div>
                )}
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {user?.name?.split(" ")[0] || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    {user?.role || "Administrator"}
                  </p>
                </div>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight
                    size={16}
                    className="text-gray-400 group-hover:text-gray-600 transition-colors hidden lg:block"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-6 pb-3 text-xs text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Home
            </span>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="font-medium text-blue-600">{activeMenuItem.label}</span>
          </div>
        </header>

        <main className="min-h-screen pt-6 relative z-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ActivePage section={activeSection} />
            </motion.div>
          </AnimatePresence>
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

export default AdminDashboard;