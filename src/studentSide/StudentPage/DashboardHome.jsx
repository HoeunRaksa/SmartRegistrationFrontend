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
import { premiumColors } from "../../theme/premiumColors";


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
      {/* iOS Soft Glass Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-[3rem] overflow-hidden p-10 md:p-14 border border-white bg-white/40 shadow-xl backdrop-blur-3xl"
      >
        {/* Soft Decorative Accents */}
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-100/30 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[80%] bg-indigo-50/40 rounded-full blur-[100px] -ml-10 -mb-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row gap-10 items-center justify-between">
          <div className="space-y-6 text-center xl:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/40 text-[12px] font-black text-slate-700 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Student Excellence Portal
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-none">
              {getGreeting()}, <br />
              <span className="text-blue-400 italic">{dashboardData?.student?.name?.split(' ')[0]}! 👋</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
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
              className="backdrop-blur-xl bg-white/80 rounded-[2.5rem] p-8 md:p-10 border border-white shadow-sm min-w-[320px] group/card"
            >
              <div className="flex items-center gap-5 mb-8">
                <div className={`w-14 h-14 rounded-2xl ${premiumColors.blue.icon} text-white shadow-lg flex items-center justify-center group-hover/card:rotate-12 transition-transform`}>
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-[12px] font-black text-slate-700 uppercase tracking-widest mb-1">Active Academic Term</p>
                  <h3 className="font-black text-slate-800 text-xl">{currentSession.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500 mb-8">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>
                  {new Date(currentSession.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — {new Date(currentSession.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-white">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-blue-400"
                />
              </div>
              <div className="mt-4 flex justify-between text-[11px] font-black text-slate-700 uppercase tracking-widest">
                <span>Trimester Progress</span>
                <span>75%</span>
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
          colorKey="emerald"
          label="Academic Rank"
          onClick={() => navigate("/student/grades")}
        />

        <StatCard
          title="Course Load"
          value={dashboardData?.stats?.enrolled_courses}
          icon={BookOpen}
          colorKey="blue"
          label="Active Syllabus"
          onClick={() => navigate("/student/courses")}
        />

        <StatCard
          title="Attendance"
          value={`${Number(dashboardData?.stats?.attendance || 0).toFixed(1)}%`}
          icon={Activity}
          colorKey="indigo"
          label="Punctuality Score"
          onClick={() => navigate("/student/attendance")}
        />

        <StatCard
          title="Pending Tasks"
          value={dashboardData?.stats?.pending_assignments}
          icon={Zap}
          colorKey="emerald"
          label="Immediate Actions"
          onClick={() => navigate("/student/assignments")}
        />
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Schedule Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className={`p-3.5 rounded-2xl ${premiumColors.blue.icon} text-white shadow-lg`}>
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Today's Class</h2>
                <p className="text-slate-700 text-[11px] font-black uppercase tracking-widest leading-none mt-1">Campus Itinerary</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/student/schedule")}
              className="p-3 rounded-2xl bg-white text-slate-400 hover:text-blue-400 transition-all border border-slate-100 shadow-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            {dashboardData?.todayClasses.length === 0 ? (
              <div className="text-center py-16 rounded-[2.5rem] bg-slate-50/50 border border-dashed border-slate-200">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                <p className="font-black text-slate-700 uppercase tracking-widest text-[11px]">No Lectures Lined Up</p>
              </div>
            ) : (
              dashboardData?.todayClasses.map((classItem, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/60 border border-white hover:bg-white hover:shadow-lg transition-all group duration-300 cursor-pointer shadow-sm"
                  onClick={() => navigate("/student/schedule")}
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-400 flex flex-col items-center justify-center border border-white shadow-inner">
                    <span className="text-[11px] font-black uppercase leading-none mb-1">Room</span>
                    <span className="font-black text-lg">{classItem.room}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1.5 leading-none">{classItem.course_code}</div>
                    <div className="font-black text-slate-800 truncate group-hover:text-blue-400 transition-colors uppercase text-[15px]">{classItem.course_name}</div>
                    <div className="flex items-center gap-4 mt-3 text-slate-400">
                      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        {classItem.time}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-700">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
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
          className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className={`p-3.5 rounded-2xl ${premiumColors.indigo.icon} text-white shadow-lg`}>
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Priority Tasks</h2>
                <p className="text-slate-700 text-[11px] font-black uppercase tracking-widest leading-none mt-1">Academic Submissions</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/student/assignments")}
              className="p-3 rounded-2xl bg-white text-slate-400 hover:text-indigo-400 transition-all border border-slate-100 shadow-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            {dashboardData?.pendingAssignments.length === 0 ? (
              <div className="text-center py-16 rounded-[2.5rem] bg-slate-50/50 border border-dashed border-slate-200">
                <Star className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Pipeline Flawless</p>
              </div>
            ) : (
              dashboardData?.pendingAssignments.slice(0, 3).map((assignment, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 8 }}
                  className="flex flex-col gap-4 p-6 rounded-[2rem] bg-white/60 border border-white hover:bg-white transition-all group duration-300 cursor-pointer shadow-sm"
                  onClick={() => navigate("/student/assignments")}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 leading-none">{assignment.course_code}</div>
                      <h4 className="font-black text-slate-800 group-hover:text-indigo-400 transition-colors leading-tight uppercase text-sm">{assignment.title}</h4>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black shadow-sm">
                      {assignment.points} PTS
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-4 border-t border-slate-100/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${getDaysUntilDue(assignment.due_date) <= 2 ? 'bg-red-400 animate-pulse' : 'bg-emerald-300'}`} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {getDaysUntilDue(assignment.due_date) <= 0 ? 'Due Today' : `${getDaysUntilDue(assignment.due_date)} Days Left`}
                      </span>
                    </div>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest italic">{new Date(assignment.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
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
          className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className={`p-3.5 rounded-2xl ${premiumColors.emerald.icon} text-white shadow-lg`}>
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Performance Index</h2>
                <p className="text-slate-700 text-[11px] font-black uppercase tracking-widest leading-none mt-1">Evaluation Outputs</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/student/grades")}
              className="p-3 rounded-2xl bg-white text-slate-400 hover:text-emerald-400 transition-all border border-slate-100 shadow-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            {dashboardData?.recentGrades.length === 0 ? (
              <div className="text-center py-16 rounded-[2.5rem] bg-slate-50/50 border border-dashed border-slate-200">
                <Activity className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                <p className="font-black text-slate-700 uppercase tracking-widest text-[11px]">Evaluation Vector Neutral</p>
              </div>
            ) : (
              dashboardData?.recentGrades.map((grade, index) => (
                <div key={index} className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/60 border border-white shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-400 flex items-center justify-center border border-white shadow-inner shrink-0">
                    <div className="text-center">
                      <div className="text-[11px] font-black uppercase leading-none mb-1">Score</div>
                      <div className="text-xl font-black leading-none">{grade.grade}</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1.5 leading-none">{grade.assignment}</div>
                    <div className="font-black text-slate-800 truncate uppercase text-sm tracking-tight">{grade.course_code} - {grade.course_name}</div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden border border-white shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        className="h-full bg-emerald-300" />
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
          className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white shadow-xl"
        >
          <div className="flex items-center gap-5 mb-10">
            <div className={`p-3.5 rounded-2xl ${premiumColors.emerald.icon} text-white shadow-lg`}>
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Intelligence Stream</h2>
              <p className="text-slate-700 text-[11px] font-black uppercase tracking-widest leading-none mt-1">Real-Time Core Updates</p>
            </div>
          </div>

          <div className="space-y-5 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
            {dashboardData?.notifications.length === 0 ? (
              <div className="text-center py-16 rounded-[2.5rem] bg-slate-50/50 border border-dashed border-slate-200">
                <Activity className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">No Signal Detected</p>
              </div>
            ) : (
              dashboardData?.notifications.map((notif, index) => (
                <div key={index} className="flex items-start gap-5 p-6 rounded-[2rem] bg-white/60 border border-white transition-all hover:bg-white group cursor-default shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                    <Bell className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-slate-600 leading-snug">{notif.message}</p>
                    <p className="text-[12px] font-black text-slate-700 uppercase tracking-widest leading-none text-center">{notif.time}</p>
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
        className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-12 border border-white shadow-xl"
      >
        <h2 className="text-3xl font-black text-slate-800 mb-10 tracking-tight uppercase tracking-tighter">Global Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {[
            { label: 'My Courses', icon: BookOpen, colorKey: 'blue', path: '/student/courses' },
            { label: 'Schedule', icon: Calendar, colorKey: 'indigo', path: '/student/schedule' },
            { label: 'Submissions', icon: FileText, colorKey: 'emerald', path: '/student/assignments' },
            { label: 'Connections', icon: Users, colorKey: 'blue', path: '/student/friends' },
            { label: 'Payments', icon: CreditCard, colorKey: 'indigo', path: '/student/payments' },
          ].map((action, i) => {
            const color = premiumColors[action.colorKey] || premiumColors.blue;
            return (
              <motion.button
                key={i}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                className="p-10 rounded-[2.5rem] bg-white/60 border border-white hover:bg-white transition-all group shadow-sm"
              >
                <div className={`w-16 h-16 rounded-2xl ${color.icon} text-white flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform shadow-lg`}>
                  <action.icon size={28} />
                </div>
                <p className="font-black text-[12px] text-slate-700 uppercase tracking-[0.2em] text-center leading-none">{action.label}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon: Icon, colorKey = "blue", label, onClick }) => {
  const color = premiumColors[colorKey] || premiumColors.blue;
  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-200 text-left w-full overflow-hidden"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-8">
        <div className={`p-4 rounded-2xl ${color.icon} text-white shadow-lg group-hover:rotate-6 transition-transform`}>
          <Icon className="w-7 h-7" />
        </div>
        <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
      </div>

      <div className="space-y-1 relative z-10">
        <h3 className="text-[12px] font-black text-slate-700 uppercase tracking-widest leading-none mb-2">{title}</h3>
        <p className="text-4xl font-black text-slate-800 tracking-tight leading-none">{value}</p>
        <div className="text-[12px] font-black text-slate-700 uppercase tracking-widest mt-4 flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${color.icon} animate-pulse`} />
          {label}
        </div>
      </div>
    </motion.button>
  );
};

export default DashboardHome;