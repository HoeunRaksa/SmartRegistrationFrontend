import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  Loader
} from 'lucide-react';

import API from '../../api'; // <-- change path if your axios instance is elsewhere

// ---------- helpers ----------
const extractData = (response) => {
  if (response?.data?.data !== undefined) return response.data.data;
  if (response?.data !== undefined) return response.data;
  return null;
};

const formatTimeAgo = (dateStr) => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}s ago`;
    const m = Math.floor(diff / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  } catch {
    return '';
  }
};

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // call only existing APIs
      const [
        enrolledCoursesRes,
        todayScheduleRes,
        gradesRes,
        gpaRes,
        assignmentsRes,
        attendanceStatsRes,
        conversationsRes,
      ] = await Promise.all([
        API.get('/student/courses/enrolled').catch(() => ({ data: { data: [] } })),
        API.get('/student/schedule/today').catch(() => ({ data: { data: [] } })),
        API.get('/student/grades').catch(() => ({ data: { data: [] } })),
        API.get('/student/grades/gpa').catch(() => ({ data: { data: { gpa: 0 } } })),
        API.get('/student/assignments').catch(() => ({ data: { data: [] } })),
        API.get('/student/attendance/stats').catch(() => ({ data: { data: { total: 0, present: 0 } } })),
        API.get('/student/messages/conversations').catch(() => ({ data: { data: [] } })),
      ]);

      const enrolledCourses = Array.isArray(extractData(enrolledCoursesRes)) ? extractData(enrolledCoursesRes) : [];
      const todaySchedule = Array.isArray(extractData(todayScheduleRes)) ? extractData(todayScheduleRes) : [];
      const grades = Array.isArray(extractData(gradesRes)) ? extractData(gradesRes) : [];
      const gpaData = extractData(gpaRes) || { gpa: 0 };
      const assignments = Array.isArray(extractData(assignmentsRes)) ? extractData(assignmentsRes) : [];
      const attendanceStats = extractData(attendanceStatsRes) || { total: 0, present: 0 };
      const conversations = Array.isArray(extractData(conversationsRes)) ? extractData(conversationsRes) : [];

      // -------- Student info (NO profile endpoint used) --------
      const student = {
        name: user?.name || 'Student',
        student_code: user?.student_code || '—',
        major: user?.major || '—',
        year: user?.year || '—',
      };

      // -------- Stats --------
      const gpa = Number(gpaData?.gpa || 0);

      const totalAttend = Number(attendanceStats?.total || 0);
      const presentAttend = Number(attendanceStats?.present || 0);
      const attendancePercent = totalAttend > 0 ? (presentAttend / totalAttend) * 100 : 0;

      // pending assignments = assignments without submissions
      const pendingAssignmentsRaw = assignments.filter((a) => {
        const subs = a?.submissions;
        if (!subs) return true;
        if (Array.isArray(subs) && subs.length === 0) return true;
        return false;
      });

      // map pending assignments to UI format
      const pendingAssignments = pendingAssignmentsRaw
        .slice()
        .sort((a, b) => new Date(a?.due_date || '2100-01-01') - new Date(b?.due_date || '2100-01-01'))
        .map((a) => ({
          id: a?.id,
          course_code: a?.course?.course_code || a?.course?.code || '—',
          title: a?.title || '—',
          due_date: a?.due_date,
          due_time: a?.due_time || '',
          points: Number(a?.points || 0),
        }));

      // today classes map
      const todayClasses = todaySchedule.map((s) => ({
        id: s?.id,
        course_code: s?.course?.course_code || s?.course?.code || '—',
        course_name: s?.course?.course_name || s?.course?.title || '—',
        time: `${s?.start_time || ''} - ${s?.end_time || ''}`,
        room: s?.room || '—',
        instructor: s?.course?.instructor_name || s?.course?.instructor || '—',
      }));

      // recent grades map (latest 5)
      const recentGrades = grades
        .slice(0, 5)
        .map((g) => ({
          id: g?.id,
          course_code: g?.course?.course_code || g?.course?.code || '—',
          course_name: g?.course?.course_name || g?.course?.title || '—',
          assignment: g?.assignment_name || '—',
          grade: Number(g?.score || 0),
          total: Number(g?.total_points || 0),
          date: g?.created_at || g?.updated_at || new Date().toISOString(),
        }));

      // notifications built from REAL data (grades + pending assignments + conversations)
      const notifications = [];

      recentGrades.slice(0, 3).forEach((gr) => {
        notifications.push({
          id: `g-${gr.id}`,
          message: `Grade posted: ${gr.course_code} - ${gr.assignment}`,
          time: formatTimeAgo(gr.date),
          type: 'grade',
        });
      });

      pendingAssignments.slice(0, 3).forEach((a) => {
        notifications.push({
          id: `a-${a.id}`,
          message: `Assignment pending: ${a.title}`,
          time: a?.due_date ? `Due ${new Date(a.due_date).toLocaleDateString()}` : '',
          type: 'assignment',
        });
      });

      if (conversations.length > 0) {
        notifications.push({
          id: `m-1`,
          message: `You have ${conversations.length} conversation(s)`,
          time: 'Now',
          type: 'message',
        });
      }

      setDashboardData({
        student,
        stats: {
          gpa,
          enrolled_courses: enrolledCourses.length,
          attendance: attendancePercent,
          pending_assignments: pendingAssignments.length,
        },
        todayClasses,
        recentGrades,
        pendingAssignments,
        notifications,
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setDashboardData({
        student: {
          name: user?.name || 'Student',
          student_code: user?.student_code || '—',
          major: user?.major || '—',
          year: user?.year || '—',
        },
        stats: { gpa: 0, enrolled_courses: 0, attendance: 0, pending_assignments: 0 },
        todayClasses: [],
        recentGrades: [],
        pendingAssignments: [],
        notifications: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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
          {dashboardData?.student?.student_code} • {dashboardData?.student?.major} • {dashboardData?.student?.year}
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate('/student/grades')}
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Current GPA</p>
              <p className="text-3xl font-bold">{Number(dashboardData?.stats?.gpa || 0).toFixed(2)}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate('/student/courses')}
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Enrolled Courses</p>
              <p className="text-3xl font-bold">{dashboardData?.stats?.enrolled_courses}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate('/student/attendance')}
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Attendance</p>
              <p className="text-3xl font-bold">{Number(dashboardData?.stats?.attendance || 0).toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate('/student/assignments')}
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Pending Tasks</p>
              <p className="text-3xl font-bold">{dashboardData?.stats?.pending_assignments}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
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
              onClick={() => navigate('/student/schedule')}
              className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData?.todayClasses?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-semibold">No classes today</p>
                <p className="text-sm">Enjoy your day off!</p>
              </div>
            ) : (
              dashboardData?.todayClasses?.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-blue-600">{classItem.course_code}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {classItem.time}
                    </div>
                  </div>
                  <div className="font-medium text-gray-900 mb-1">{classItem.course_name}</div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{classItem.room}</span>
                    <span>{classItem.instructor}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Pending Assignments */}
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
              onClick={() => navigate('/student/assignments')}
              className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData?.pendingAssignments?.slice(0, 3).map((assignment, index) => {
              const daysUntilDue = getDaysUntilDue(assignment.due_date);
              const isUrgent = daysUntilDue <= 2;

              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    isUrgent ? 'bg-red-50/50 border-red-200' : 'bg-orange-50/50 border-orange-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-gray-900">{assignment.title}</div>
                    <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg font-semibold">
                      {assignment.points} pts
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{assignment.course_code}</div>
                  <div className={`flex items-center gap-2 text-sm ${isUrgent ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                    <Clock className="w-4 h-4" />
                    Due: {new Date(assignment.due_date).toLocaleDateString()} at {assignment.due_time}
                    {daysUntilDue >= 0 && (
                      <span className="ml-2">
                        ({daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''} left)
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
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
              onClick={() => navigate('/student/grades')}
              className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData?.recentGrades?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-semibold">No grades yet</p>
                <p className="text-sm">Grades will appear here once posted.</p>
              </div>
            ) : (
              dashboardData?.recentGrades?.map((grade, index) => (
                <motion.div
                  key={grade.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-green-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">{grade.assignment}</div>
                      <div className="text-sm text-gray-600">{grade.course_code} - {grade.course_name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {grade.grade}/{grade.total}
                      </div>
                      <div className="text-sm text-gray-600">
                        {grade.total > 0 ? ((grade.grade / grade.total) * 100).toFixed(0) : 0}%
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

        {/* Notifications */}
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
            {dashboardData?.notifications?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-semibold">No notifications</p>
                <p className="text-sm">You’re all caught up.</p>
              </div>
            ) : (
              dashboardData?.notifications?.map((notification, index) => (
                <motion.div
                  key={notification.id}
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
                      <p className="font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/student/courses')}
            className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <BookOpen className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold text-sm">My Courses</p>
          </button>
          <button
            onClick={() => navigate('/student/schedule')}
            className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Calendar className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold text-sm">Schedule</p>
          </button>
          <button
            onClick={() => navigate('/student/assignments')}
            className="p-4 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <FileText className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold text-sm">Assignments</p>
          </button>
          <button
            onClick={() => navigate('/student/messages')}
            className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold text-sm">Messages</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
