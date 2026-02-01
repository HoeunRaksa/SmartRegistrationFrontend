import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutApi } from '../../api/auth.jsx';
import SettingPage from '../../gobalConponent/Settingpage.jsx';
import DashboardHome from './DashboardHome.jsx';
import CoursesPage from './CoursesPage.jsx';
import SchedulePage from './SchedulePage.jsx';
import CalendarPage from './CalendarPage.jsx';
import GradesPage from './GradesPage.jsx';
import AssignmentsPage from './AssignmentsPage.jsx';
import AttendancePage from './AttendancePage.jsx';
import MessagesPage from '../../gobalConponent/MessagesPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import FriendsPage from './FriendsPage.jsx';
import ProjectGroupsPage from './ProjectGroupsPage.jsx';
import CertificatePage from './CertificatePage.jsx';
import { fetchCurrentSession } from '../../api/admin_session_api.jsx';
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
    Construction,
    Users,
    Users2,
    Sparkles
} from 'lucide-react';

const profileFallback = "/assets/images/profile-fallback.png";

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
                : "bg-gray-100/50 group-hover:bg-white group-hover:shadow-md"
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
                    layoutId="student-active-pill"
                    className="ml-auto w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600 shadow-sm"
                />
            )}
        </motion.button>
    );
});

const StudentDashboard = () => {
    const { section } = useParams();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [notifications, setNotifications] = useState(2);

    const activeSection = section || 'dashboard';

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-cyan-500' },
        { id: 'courses', label: 'My Courses', icon: BookOpen, gradient: 'from-green-500 to-emerald-500' },
        { id: 'schedule', label: 'Schedule', icon: Clock, gradient: 'from-purple-500 to-pink-500' },
        { id: 'calendar', label: 'Calendar', icon: Calendar, gradient: 'from-orange-400 to-amber-500' },
        { id: 'grades', label: 'Grades', icon: Award, gradient: 'from-orange-500 to-red-500' },
        { id: 'assignments', label: 'Assignments', icon: FileText, gradient: 'from-indigo-500 to-blue-500' },
        { id: 'attendance', label: 'Attendance', icon: Clock, gradient: 'from-teal-500 to-cyan-500' },
        { id: 'friends', label: 'Social', icon: Users, gradient: 'from-indigo-600 to-purple-600' },
        { id: 'project-groups', label: 'Teams', icon: Users2, gradient: 'from-blue-600 to-indigo-600' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, gradient: 'from-pink-500 to-rose-500' },
        { id: 'profile', label: 'Profile', icon: User, gradient: 'from-violet-500 to-purple-500' },
        { id: 'certificates', label: 'Certificates', icon: FileText, gradient: 'from-blue-600 to-indigo-600' },
        { id: 'settings', label: 'Settings', icon: Settings, gradient: 'from-gray-500 to-slate-500' },
    ];

    const activeMenuItem = menuItems.find(i => i.id === activeSection) || menuItems[0];

    const handleLogout = async () => {
        await logoutApi().catch(() => { });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

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

    const [currentSession, setCurrentSession] = useState(null);
    useEffect(() => {
        fetchCurrentSession().then(setCurrentSession).catch(console.error);
    }, []);

    useEffect(() => {
        const validSections = menuItems.map(item => item.id);
        if (section && !validSections.includes(section)) {
            navigate('/student/dashboard', { replace: true });
        }
    }, [section, navigate, menuItems]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

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

    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard': return <DashboardHome currentSession={currentSession} />;
            case 'courses': return <CoursesPage />;
            case 'schedule': return <SchedulePage />;
            case 'calendar': return <CalendarPage />;
            case 'grades': return <GradesPage />;
            case 'assignments': return <AssignmentsPage />;
            case 'attendance': return <AttendancePage />;
            case 'friends': return <FriendsPage />;
            case 'project-groups': return <ProjectGroupsPage />;
            case 'messages': return <MessagesPage />;
            case 'profile': return <ProfilePage />;
            case 'certificates': return <CertificatePage />;
            case 'settings': return <SettingPage />;
            default: return <DashboardHome currentSession={currentSession} />;
        }
    };

    return (
        <div className="sidebar-layout-root min-h-screen w-full relative">
            {/* ================= BACKGROUND SYSTEM ================= */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30" />

            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] gpu-accelerate"
                />
                <motion.div
                    animate={{ x: [0, -100, 0], y: [0, 80, 0], scale: [1, 1.3, 1] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-purple-400/20 rounded-full blur-[120px] gpu-accelerate"
                />
                <motion.div
                    animate={{ x: [0, 60, 0], y: [0, -100, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-pink-400/20 rounded-full blur-[110px] gpu-accelerate"
                />
            </div>

            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            {/* ================= SIDEBAR - DESKTOP ================= */}
            <motion.aside
                animate={{ width: sidebarCollapsed ? 80 : 280 }}
                transition={{ duration: 0.2 }}
                className="sidebar-fixed backdrop-blur-3xl bg-white/30 border-r border-white/20 hidden md:block"
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
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                                        NovaTech
                                    </h1>
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-10">Student Life</p>
                            </div>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="absolute -right-3 top-10 p-1.5 rounded-full bg-white shadow-xl border border-gray-100 text-gray-400 hover:text-blue-600 transition-all z-20"
                        >
                            <motion.div animate={{ rotate: sidebarCollapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
                                {sidebarCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
                            </motion.div>
                        </motion.button>
                    </div>

                    <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide py-4 px-1">
                        {menuItems.map((item, index) => (
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
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all bg-red-500/10 text-red-600 border border-red-100 hover:bg-red-500 hover:text-white group"
                        >
                            <div className="p-2 rounded-xl bg-white/50 group-hover:bg-red-400 transition-colors shadow-sm">
                                <LogOut size={16} />
                            </div>
                            {!sidebarCollapsed && <span className="font-bold text-[13px] tracking-tight">Lock Station</span>}
                        </motion.button>
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
                            className="fixed inset-0 bg-black/50 z-50 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 bottom-0 w-[280px] bg-white border-r border-gray-100 shadow-2xl z-[100] md:hidden"
                        >
                            <div className="flex flex-col h-full p-4">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                            <span className="text-white font-black text-lg">N</span>
                                        </div>
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">NovaTech</h1>
                                    </div>
                                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl bg-gray-100"><X size={20} /></button>
                                </div>

                                <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                                    {menuItems.map((item, index) => (
                                        <SidebarItem
                                            key={item.id}
                                            item={item}
                                            isActive={activeSection === item.id}
                                            sidebarCollapsed={false}
                                            onClick={() => { handleSectionChange(item.id); setMobileMenuOpen(false); }}
                                            index={index}
                                        />
                                    ))}
                                </nav>

                                <button onClick={handleLogout} className="mt-5 w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-red-500 text-white shadow-lg">
                                    <LogOut size={20} />
                                    <span className="font-bold text-sm">Lock Station</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ================= MAIN CONTENT ================= */}
            <div className={`sidebar-main transition-all duration-200 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}`}>
                <header className="sticky top-0 z-30 backdrop-blur-3xl bg-white/60 border-b border-white/20 shadow-sm">
                    <div className="flex items-center justify-between px-4 md:px-8 py-4">
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden p-2.5 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 shadow-sm"
                            >
                                <Menu size={20} />
                            </motion.button>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className={`p-2 rounded-xl bg-gradient-to-br ${activeMenuItem.gradient} shadow-lg text-white`}>
                                        {React.createElement(activeMenuItem.icon, { size: 20 })}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">
                                            {activeMenuItem.label}
                                        </h2>
                                        <p className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {user?.name || 'Student'} • Academic Flow
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden lg:flex items-center gap-2 backdrop-blur-xl bg-white/50 rounded-2xl px-4 py-2.5 border border-white/40 shadow-sm w-80">
                                <Search size={16} className="text-slate-400" />
                                <input type="text" placeholder="Quantum search..." className="bg-transparent outline-none text-xs font-bold text-slate-700 w-full placeholder-slate-300" />
                                <Sparkles size={14} className="text-amber-400" />
                            </div>

                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleFullscreen}
                                    className="hidden md:flex p-2.5 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 shadow-sm group"
                                >
                                    {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative p-2.5 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 shadow-sm group"
                                >
                                    <Bell size={18} className="group-hover:text-blue-600 transition-colors" />
                                    {notifications > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg border-2 border-white">{notifications}</span>
                                    )}
                                </motion.button>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 shadow-sm cursor-pointer group"
                                >
                                    {user?.profile_picture_url ? (
                                        <img src={user.profile_picture_url} className="w-8 h-8 rounded-lg object-cover ring-2 ring-white/60" alt="P" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">{user?.name?.charAt(0) || 'S'}</div>
                                    )}
                                    <div className="hidden xl:block">
                                        <p className="text-sm font-black text-slate-800 leading-tight truncate max-w-[100px]">{user?.name?.split(' ')[0]}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Active</p>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600" />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 px-8 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Portal</span>
                        <ChevronRight size={10} />
                        <span className="text-blue-600 font-black">{activeMenuItem.label}</span>
                    </div>
                </header>

                <main className="min-h-screen pt-4 relative z-10 w-full overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.02, y: -10 }}
                            transition={{ duration: 0.4, type: 'spring', damping: 20 }}
                        >
                            {renderSection()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 0; }
          .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .sidebar-fixed { position: fixed; left: 0; top: 0; bottom: 0; z-index: 40; transition: width 0.2s ease; overflow: visible; }
          .sidebar-main { min-height: 100vh; position: relative; z-index: 10; }
        `}</style>
        </div>
    );
};

export default StudentDashboard;