import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  FileText,
  Users,
  Bell,
  ArrowRight,
  Loader,
  Sparkles,
  Zap,
  CheckCircle,
  MoreHorizontal,
  UserCheck,
  Star,
  Activity,
  ArrowUpRight,
  CreditCard
} from "lucide-react";

// ✅ Import from separate API file
import StudentDashboardAPI, {
  getDaysUntilDue,
  getGreeting,
} from '../../api/student_dashboard_api';


const DashboardHome = ({ currentSession }) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const result = await StudentDashboardAPI.getDashboardData();

      if (result.success) {
        const processed = StudentDashboardAPI.processDashboardData(
          result.data,
          user
        );
        setDashboardData(processed);
      } else {
        console.error("Dashboard API failed:", result.error);
        setDashboardData(getFallbackDashboardData());
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
      setDashboardData(getFallbackDashboardData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackDashboardData = () => ({
    student: {
      name: user?.name || "Student",
      student_code: user?.student_code || "",
      major: user?.major || "",
      year: user?.year || "",
    },
    stats: {
      gpa: 0,
      enrolled_courses: 0,
      attendance: 0,
      pending_assignments: 0,
    },
    todayClasses: [],
    recentGrades: [],
    pendingAssignments: [],
    notifications: [],
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
        <p className="mt-4 text-slate-400 font-bold tracking-widest text-xs animate-pulse uppercase">Syncing academic stream...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-20"
    >
      {/* iOS Glass Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-[2.5rem] overflow-hidden md:p-12 border border-white/60 bg-white/50 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] group"
      >
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[100px] gpu-accelerate" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[100px] gpu-accelerate" />
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row gap-8 items-center justify-between">
          <div className="space-y-4 text-center xl:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-white/80 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Student Excellence Portal</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
              {getGreeting()}, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{dashboardData?.student?.name?.split(' ')[0]}! 👋</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-lg">
              {[
                dashboardData?.student?.student_code,
                dashboardData?.student?.major,
                dashboardData?.student?.year
              ].filter(Boolean).join(' • ')}
            </p>
          </div>

          {currentSession && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="backdrop-blur-2xl bg-white/60 rounded-[2rem] p-6 md:p-8 border border-white shadow-xl min-w-[280px] group/card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20 group-hover/card:rotate-12 transition-transform">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Academic Term</p>
                  <h3 className="font-black text-slate-800 text-lg">{currentSession.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>
                  {new Date(currentSession.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — {new Date(currentSession.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="mt-6 w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-white shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Modern iOS Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current GPA"
          value={Number(dashboardData?.stats?.gpa || 0).toFixed(2)}
          icon={Award}
          gradient="from-emerald-400 to-teal-500"
          label="Academic Rank"
          onClick={() => navigate("/student/grades")}
        />

        <StatCard
          title="Course Load"
          value={dashboardData?.stats?.enrolled_courses}
          icon={BookOpen}
          gradient="from-blue-400 to-indigo-500"
          label="Active Syllabus"
          onClick={() => navigate("/student/courses")}
        />

        <StatCard
          title="Attendance"
          value={`${Number(dashboardData?.stats?.attendance || 0).toFixed(1)}%`}
          icon={Activity}
          gradient="from-purple-400 to-pink-500"
          label="Punctuality Score"
          onClick={() => navigate("/student/attendance")}
        />

        <StatCard
          title="Pending Tasks"
          value={dashboardData?.stats?.pending_assignments}
          icon={Zap}
          gradient="from-orange-400 to-amber-500"
          label="Immediate Actions"
          onClick={() => navigate("/student/assignments")}
        />
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Schedule Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/60 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-blue-50/50 text-blue-600 border border-white shadow-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Today's Class</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Campus Itinerary</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/student/schedule")}
              className="p-3 rounded-2xl bg-white/50 text-slate-400 hover:text-blue-600 hover:bg-white transition-all shadow-sm border border-white"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {dashboardData?.todayClasses.length === 0 ? (
              <div className="text-center py-12 rounded-[2rem] bg-white/20 border border-dashed border-slate-200">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No Lectures Lined Up</p>
              </div>
            ) : (
              dashboardData?.todayClasses.map((classItem, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-white/40 border border-white hover:bg-white transition-all group duration-300 cursor-pointer"
                  onClick={() => navigate("/student/schedule")}
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] font-black uppercase">Room</span>
                    <span className="font-black text-sm">{classItem.room}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{classItem.course_code}</div>
                    <div className="font-black text-slate-800 truncate group-hover:text-blue-600 transition-colors">{classItem.course_name}</div>
                    <div className="flex items-center gap-3 mt-2 text-slate-400">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide">
                        <Clock className="w-3.5 h-3.5" />
                        {classItem.time}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide">
                        <UserCheck className="w-3.5 h-3.5" />
                        {classItem.instructor?.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Priority Assignments Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/60 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-orange-50/50 text-orange-600 border border-white shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Priority Tasks</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Academic Submissions</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/student/assignments")}
              className="p-3 rounded-2xl bg-white/50 text-slate-400 hover:text-orange-600 hover:bg-white transition-all shadow-sm border border-white"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {dashboardData?.pendingAssignments.length === 0 ? (
              <div className="text-center py-12 rounded-[2rem] bg-white/20 border border-dashed border-slate-200">
                <Star className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Pipeline Flawless</p>
              </div>
            ) : (
              dashboardData?.pendingAssignments.slice(0, 3).map((assignment, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 8 }}
                  className="flex flex-col gap-3 p-5 rounded-[1.5rem] bg-white/40 border border-white hover:bg-white transition-all group duration-300 cursor-pointer"
                  onClick={() => navigate("/student/assignments")}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">{assignment.course_code}</div>
                      <h4 className="font-black text-slate-800 group-hover:text-orange-600 transition-colors leading-tight">{assignment.title}</h4>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 text-white text-[10px] font-black shadow-lg">
                      {assignment.points} PTS
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getDaysUntilDue(assignment.due_date) <= 2 ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {getDaysUntilDue(assignment.due_date) <= 0 ? 'Due Today' : `${getDaysUntilDue(assignment.due_date)} Days Left`}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 italic">Deadline: {new Date(assignment.due_date).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Performance Index */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/60 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 text-emerald-600 border border-white shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Performance Index</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Latest Evaluation Outputs</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/student/grades")}
              className="p-3 rounded-2xl bg-white/50 text-slate-400 hover:text-emerald-600 hover:bg-white transition-all shadow-sm border border-white"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {dashboardData?.recentGrades.length === 0 ? (
              <div className="text-center py-12 rounded-[2rem] bg-white/20 border border-dashed border-slate-200">
                <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Evaluation Vector Neutral</p>
              </div>
            ) : (
              dashboardData?.recentGrades.map((grade, index) => (
                <div key={index} className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-white/40 border border-white shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                    <div className="text-center">
                      <div className="text-[10px] font-black uppercase leading-none">Score</div>
                      <div className="text-lg font-black leading-none mt-1">{grade.grade}</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{grade.assignment}</div>
                    <div className="font-black text-slate-800 truncate">{grade.course_code} - {grade.course_name}</div>
                    <div className="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[85%]" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Intelligence Stream (Notifications) */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/60 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3.5 rounded-2xl bg-purple-50/50 text-purple-600 border border-white shadow-sm">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Intelligence Stream</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Real-Time Core Updates</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
            {dashboardData?.notifications.length === 0 ? (
              <div className="text-center py-12 rounded-[2rem] bg-white/20 border border-dashed border-slate-200">
                <ZapOff className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No Signal Detected</p>
              </div>
            ) : (
              dashboardData?.notifications.map((notif, index) => (
                <div key={index} className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-white/40 border border-white transition-all hover:bg-white group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Bell className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-slate-700 leading-snug">{notif.message}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{notif.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Launch Icons */}
      <motion.div
        variants={itemVariants}
        className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/60 shadow-xl"
      >
        <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Global Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'My Courses', icon: BookOpen, color: 'blue', path: '/student/courses' },
            { label: 'Schedule', icon: Calendar, color: 'purple', path: '/student/schedule' },
            { label: 'Submissions', icon: FileText, color: 'orange', path: '/student/assignments' },
            { label: 'Connections', icon: Users, color: 'emerald', path: '/student/friends' },
            { label: 'Payments', icon: CreditCard, color: 'emerald', path: '/student/payments' },
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className="p-8 rounded-[2rem] bg-white/50 border border-white shadow-xl hover:bg-white hover:shadow-2xl transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${action.color}-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-${action.color}-500/20 group-hover:rotate-12 transition-transform`}>
                <action.icon size={24} />
              </div>
              <p className="font-black text-xs text-slate-800 uppercase tracking-widest text-center">{action.label}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon: Icon, gradient, label, onClick }) => (
  <motion.button
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="group relative bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] text-left w-full"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-8">
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg shadow-blue-500/10 group-hover:rotate-6 transition-transform`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
    </div>

    <div className="space-y-1">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h3>
      <p className="text-4xl font-black text-slate-800 tracking-tight">{value}</p>
      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        {label}
      </div>
    </div>
  </motion.button>
);

export default DashboardHome;