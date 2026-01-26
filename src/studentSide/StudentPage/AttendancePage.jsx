import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  Loader,
  BarChart3,
  Award
} from 'lucide-react';
import { fetchStudentAttendance, fetchAttendanceStats } from '../../api/attendance_api';

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [viewMode, setViewMode] = useState('summary'); // summary, calendar, details

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const [attendanceRes, statsRes] = await Promise.all([
        fetchStudentAttendance().catch(() => ({ data: { data: [] } })),
        fetchAttendanceStats().catch(() => ({ data: null }))
      ]);

      setAttendance(attendanceRes.data?.data?.length > 0 ? attendanceRes.data.data : []);
      setStats(statsRes.data || null);
    } catch (error) {
      console.error('Failed to load attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      present: 'from-green-500 to-emerald-500',
      absent: 'from-red-500 to-pink-500',
      late: 'from-orange-500 to-yellow-500'
    };
    return colors[status] || 'from-gray-400 to-gray-500';
  };

  const getStatusIcon = (status) => {
    const icons = {
      present: CheckCircle,
      absent: XCircle,
      late: Clock
    };
    return icons[status] || AlertTriangle;
  };

  const filteredAttendance = selectedCourse === 'all'
    ? attendance
    : attendance.filter(a => a.course_code === selectedCourse);

  const courses = ['all', ...new Set(attendance.map(a => a.course_code))];

  const getCourseStats = (courseCode) => {
    return stats?.courses?.find(c => c.course_code === courseCode);
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
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Overall Attendance</p>
              <p className="text-3xl font-bold">{stats?.overall_percentage?.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Present</p>
              <p className="text-3xl font-bold">{stats?.present}</p>
              <p className="text-xs opacity-80">out of {stats?.total_sessions} sessions</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Absent</p>
              <p className="text-3xl font-bold">{stats?.absent}</p>
              <p className="text-xs opacity-80">sessions missed</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <XCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Late</p>
              <p className="text-3xl font-bold">{stats?.late}</p>
              <p className="text-xs opacity-80">late arrivals</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Attendance Warning */}
      {stats?.overall_percentage < 75 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-red-50/50 border-2 border-red-300 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-2">Attendance Warning</h3>
              <p className="text-red-800">
                Your attendance is below the required 75% threshold. Please ensure you attend classes regularly
                to avoid academic penalties. Current attendance: <strong>{stats?.overall_percentage?.toFixed(1)}%</strong>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* View Mode Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance Records</h2>
          <p className="text-gray-600">Track your class attendance</p>
        </div>
        <div className="flex gap-2">
          {['summary', 'details'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all capitalize ${viewMode === mode
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'backdrop-blur-xl bg-white/60 border border-white/40 text-gray-700 hover:bg-white/80'
                }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Summary View - Course-wise Breakdown */}
      {viewMode === 'summary' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats?.courses?.map((course, index) => (
            <motion.div
              key={course.course_code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold mb-2">
                    {course.course_code}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{course.course_name}</h3>
                </div>
              </div>

              {/* Attendance Percentage Circle */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - course.percentage / 100)}`}
                      className={course.percentage >= 75 ? 'text-green-500' : 'text-red-500'}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${course.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                        {course.percentage.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-50/50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{course.present}</div>
                  <div className="text-xs text-gray-600">Present</div>
                </div>
                <div className="text-center p-3 bg-red-50/50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600">{course.absent}</div>
                  <div className="text-xs text-gray-600">Absent</div>
                </div>
                <div className="text-center p-3 bg-orange-50/50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">{course.late}</div>
                  <div className="text-xs text-gray-600">Late</div>
                </div>
              </div>

              <div className="mt-4 text-center text-sm text-gray-600">
                Total: {course.total_sessions} sessions
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Details View - Session List */}
      {viewMode === 'details' && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-4 flex-wrap">
            {courses.map((course) => (
              <button
                key={course}
                onClick={() => setSelectedCourse(course)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${selectedCourse === course
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'backdrop-blur-xl bg-white/60 border border-white/40 text-gray-700 hover:bg-white/80'
                  }`}
              >
                {course === 'all' ? 'All Courses' : course}
              </button>
            ))}
          </div>

          <div className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Date</th>
                    <th className="px-6 py-4 text-left font-semibold">Course</th>
                    <th className="px-6 py-4 text-left font-semibold">Session Type</th>
                    <th className="px-6 py-4 text-left font-semibold">Instructor</th>
                    <th className="px-6 py-4 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-semibold">No attendance records found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((record, index) => {
                        const StatusIcon = getStatusIcon(record.status);
                        return (
                          <motion.tr
                            key={record.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="border-b border-white/20 hover:bg-white/40 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-600" />
                                <span className="font-medium text-gray-900">
                                  {new Date(record.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-blue-600">{record.course_code}</div>
                              <div className="text-sm text-gray-600">{record.course_name}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-700">{record.session_type}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-700">{record.instructor}</div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r ${getStatusColor(record.status)} text-white font-semibold shadow-md capitalize`}>
                                <StatusIcon className="w-4 h-4" />
                                {record.status}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
