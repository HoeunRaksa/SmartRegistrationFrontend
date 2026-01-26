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
} from "lucide-react";

// ✅ Import from separate API file
import StudentDashboardAPI, {
  getDaysUntilDue,
  getGreeting,
} from '../../api/student_dashboard_api';

const DashboardHome = () => {
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

      // ✅ ONE API call - gets all dashboard data
      const result = await StudentDashboardAPI.getDashboardData();

      if (result.success) {
        // ✅ Process data using helper function
        const processed = StudentDashboardAPI.processDashboardData(
          result.data,
          user
        );
        setDashboardData(processed);
      } else {
        // API failed - show fallback
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
      student_code: user?.student_code || "—",
      major: user?.major || "—",
      year: user?.year || "—",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-8 border border-white/20 shadow-lg"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          {getGreeting()}, {dashboardData?.student?.name}! 👋
        </h1>
        <p className="text-white/90">
          {dashboardData?.student?.student_code} •{" "}
          {dashboardData?.student?.major} • {dashboardData?.student?.year}
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current GPA"
          value={Number(dashboardData?.stats?.gpa || 0).toFixed(2)}
          icon={Award}
          gradient="from-green-500 to-emerald-500"
          onClick={() => navigate("/student/grades")}
          delay={0.1}
        />

        <StatCard
          title="Enrolled Courses"
          value={dashboardData?.stats?.enrolled_courses}
          icon={BookOpen}
          gradient="from-blue-500 to-cyan-500"
          onClick={() => navigate("/student/courses")}
          delay={0.2}
        />

        <StatCard
          title="Attendance"
          value={`${Number(dashboardData?.stats?.attendance || 0).toFixed(1)}%`}
          icon={TrendingUp}
          gradient="from-purple-500 to-pink-500"
          onClick={() => navigate("/student/attendance")}
          delay={0.3}
        />

        <StatCard
          title="Pending Tasks"
          value={dashboardData?.stats?.pending_assignments}
          icon={FileText}
          gradient="from-orange-500 to-red-500"
          onClick={() => navigate("/student/assignments")}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <TodayClassesCard
          classes={dashboardData?.todayClasses || []}
          onViewAll={() => navigate("/student/schedule")}
        />

        {/* Pending Assignments */}
        <PendingAssignmentsCard
          assignments={dashboardData?.pendingAssignments || []}
          onViewAll={() => navigate("/student/assignments")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <RecentGradesCard
          grades={dashboardData?.recentGrades || []}
          onViewAll={() => navigate("/student/grades")}
        />

        {/* Notifications */}
        <NotificationsCard notifications={dashboardData?.notifications || []} />
      </div>

      {/* Quick Actions */}
      <QuickActionsCard navigate={navigate} />
    </div>
  );
};

// ==================== COMPONENT CARDS ====================

const StatCard = ({ title, value, icon: Icon, gradient, onClick, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`backdrop-blur-xl bg-gradient-to-br ${gradient} rounded-2xl p-6 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="text-white">
        <p className="text-sm opacity-90 mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="p-3 bg-white/20 rounded-xl">
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  </motion.div>
);

const TodayClassesCard = ({ classes, onViewAll }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 }}
    className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
  >
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <div className="p-2 rounded-xl bg-blue-500/10">
          <Calendar className="w-6 h-6 text-blue-500" />
        </div>
        Today's Classes
      </h2>
      <button
        onClick={onViewAll}
        className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
      >
        View All <ArrowRight className="w-4 h-4" />
      </button>
    </div>

    <div className="space-y-3">
      {classes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">No classes today</p>
          <p className="text-sm">Enjoy your day off!</p>
        </div>
      ) : (
        classes.map((classItem, index) => (
          <motion.div
            key={classItem.id ?? index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="font-semibold text-blue-600">
                {classItem.course_code}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {classItem.time}
              </div>
            </div>
            <div className="font-medium text-gray-900 mb-1">
              {classItem.course_name}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{classItem.room}</span>
              <span>{classItem.instructor}</span>
            </div>
          </motion.div>
        ))
      )}
    </div>
  </motion.div>
);

const PendingAssignmentsCard = ({ assignments, onViewAll }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 }}
    className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
  >
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <div className="p-2 rounded-xl bg-orange-500/10">
          <FileText className="w-6 h-6 text-orange-500" />
        </div>
        Pending Assignments
      </h2>
      <button
        onClick={onViewAll}
        className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
      >
        View All <ArrowRight className="w-4 h-4" />
      </button>
    </div>

    <div className="space-y-3">
      {assignments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">No pending assignments</p>
          <p className="text-sm">Nice! You're on track.</p>
        </div>
      ) : (
        assignments.slice(0, 3).map((assignment, index) => {
          const daysUntilDue = getDaysUntilDue(assignment.due_date);
          const isUrgent = typeof daysUntilDue === "number" && daysUntilDue <= 2;

          return (
            <motion.div
              key={assignment.id ?? index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`p-4 rounded-xl border ${
                isUrgent
                  ? "bg-red-50/50 border-red-200"
                  : "bg-orange-50/50 border-orange-200"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-gray-900">
                  {assignment.title}
                </div>
                <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg font-semibold">
                  {assignment.points} pts
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                {assignment.course_code}
              </div>

              <div
                className={`flex items-center gap-2 text-sm ${
                  isUrgent ? "text-red-600 font-semibold" : "text-gray-600"
                }`}
              >
                <Clock className="w-4 h-4" />
                {assignment.due_date ? (
                  <>
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                    {assignment.due_time ? ` at ${assignment.due_time}` : ""}
                    {typeof daysUntilDue === "number" && daysUntilDue >= 0 && (
                      <span className="ml-2">
                        ({daysUntilDue} day{daysUntilDue !== 1 ? "s" : ""}{" "}
                        left)
                      </span>
                    )}
                  </>
                ) : (
                  <span>No due date</span>
                )}
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  </motion.div>
);

const RecentGradesCard = ({ grades, onViewAll }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7 }}
    className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
  >
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <div className="p-2 rounded-xl bg-green-500/10">
          <Award className="w-6 h-6 text-green-500" />
        </div>
        Recent Grades
      </h2>
      <button
        onClick={onViewAll}
        className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
      >
        View All <ArrowRight className="w-4 h-4" />
      </button>
    </div>

    <div className="space-y-3">
      {grades.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">No grades yet</p>
          <p className="text-sm">Grades will appear here once posted.</p>
        </div>
      ) : (
        grades.map((grade, index) => (
          <motion.div
            key={grade.id ?? index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-green-100"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-gray-900">
                  {grade.assignment}
                </div>
                <div className="text-sm text-gray-600">
                  {grade.course_code} - {grade.course_name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {grade.grade}/{grade.total}
                </div>
                <div className="text-sm text-gray-600">
                  {grade.total > 0
                    ? ((grade.grade / grade.total) * 100).toFixed(0)
                    : 0}
                  %
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Posted: {new Date(grade.date).toLocaleDateString()}
            </div>
          </motion.div>
        ))
      )}
    </div>
  </motion.div>
);

const NotificationsCard = ({ notifications }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7 }}
    className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
  >
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <div className="p-2 rounded-xl bg-purple-500/10">
          <Bell className="w-6 h-6 text-purple-500" />
        </div>
        Notifications
      </h2>
    </div>

    <div className="space-y-3">
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">No notifications</p>
          <p className="text-sm">You're all caught up.</p>
        </div>
      ) : (
        notifications.map((notification, index) => (
          <motion.div
            key={notification.id ?? index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="p-4 bg-purple-50/50 rounded-xl border border-purple-100"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bell className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  </motion.div>
);

const QuickActionsCard = ({ navigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.9 }}
    className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
  >
    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button
        onClick={() => navigate("/student/courses")}
        className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
      >
        <BookOpen className="w-8 h-8 mx-auto mb-2" />
        <p className="font-semibold text-sm">My Courses</p>
      </button>

      <button
        onClick={() => navigate("/student/schedule")}
        className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
      >
        <Calendar className="w-8 h-8 mx-auto mb-2" />
        <p className="font-semibold text-sm">Schedule</p>
      </button>

      <button
        onClick={() => navigate("/student/assignments")}
        className="p-4 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all"
      >
        <FileText className="w-8 h-8 mx-auto mb-2" />
        <p className="font-semibold text-sm">Assignments</p>
      </button>

      <button
        onClick={() => navigate("/student/messages")}
        className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
      >
        <Users className="w-8 h-8 mx-auto mb-2" />
        <p className="font-semibold text-sm">Messages</p>
      </button>
    </div>
  </motion.div>
);

export default DashboardHome;