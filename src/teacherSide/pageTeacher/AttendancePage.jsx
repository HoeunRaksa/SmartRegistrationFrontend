import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, X, Check, Calendar, Download } from 'lucide-react';
import {
  fetchTeacherCourses,
  fetchTeacherAttendanceSessions,
  markTeacherAttendanceBulk,
  fetchTeacherAttendanceStats,
  fetchCourseStudents
} from '../../api/teacher_api';

const AttendancePage = () => {
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesRes, sessionsRes, statsRes] = await Promise.all([
        fetchTeacherCourses(),
        fetchTeacherAttendanceSessions(),
        fetchTeacherAttendanceStats()
      ]);

      const courseList = coursesRes.data?.data || [];
      setCourses(courseList);
      setSessions(sessionsRes.data?.data || []);
      setStats(statsRes.data?.data || null);

      if (courseList.length > 0 && !selectedCourseId) {
        setSelectedCourseId(courseList[0].id);
      }
    } catch (error) {
      console.error('Failed to load attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourseId) {
      loadCourseStudents(selectedCourseId);
    }
  }, [selectedCourseId]);

  const loadCourseStudents = async (courseId) => {
    try {
      const res = await fetchCourseStudents(courseId);
      const studentList = (res.data?.data || []).map(s => ({
        ...s,
        status: 'present' // default
      }));
      setAttendance(studentList);
    } catch (error) {
      console.error('Failed to load course students:', error);
    }
  };

  const handleSaveAttendance = async () => {
    if (!selectedSessionId) {
      alert('Please select a class session');
      return;
    }

    try {
      setLoading(true);
      await markTeacherAttendanceBulk({
        class_session_id: selectedSessionId,
        attendance: attendance.map(s => ({
          student_id: s.id,
          status: s.status,
          remarks: ''
        }))
      });
      alert('Attendance saved successfully!');
      loadData(); // Refresh stats
    } catch (error) {
      alert('Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (studentId) => {
    setAttendance(prev => prev.map(student =>
      student.id === studentId
        ? { ...student, status: student.status === 'present' ? 'absent' : 'present' }
        : student
    ));
  };

  const presentCount = attendance.filter(s => s.status === 'present').length;
  const absentCount = attendance.filter(s => s.status === 'absent').length;
  const totalStudents = attendance.length;

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance</h1>
          <p className="text-gray-600">Mark daily attendance for your classes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={loading}
            onClick={loadData}
            className="p-3 rounded-xl bg-white/60 backdrop-blur-xl border border-white/40 hover:bg-white/80 transition-all shadow-sm"
          >
            <Calendar className="w-5 h-5 text-gray-600" />
          </button>
          <button
            disabled={loading}
            onClick={handleSaveAttendance}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <CheckSquare className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <p className="text-sm text-gray-600 mb-1">Overall Presence Rate</p>
          <p className="text-3xl font-bold text-emerald-600">{stats?.attendance_rate || '0'}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <p className="text-sm text-gray-600 mb-1">Current Class Present</p>
          <p className="text-3xl font-bold text-blue-600">{presentCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <p className="text-sm text-gray-600 mb-1">Current Class Absent</p>
          <p className="text-3xl font-bold text-red-600">{absentCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <p className="text-sm text-gray-600 mb-1">Total Students</p>
          <p className="text-3xl font-bold text-purple-600">{totalStudents}</p>
        </motion.div>
      </div>

      {/* Selectors */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Course</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-6 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="">Select a course...</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Session</label>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="w-full px-6 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="">Choose a session...</option>
            {sessions.filter(s => s.course_name === courses.find(c => c.id == selectedCourseId)?.name).map(session => (
              <option key={session.id} value={session.id}>{session.date} - {session.time}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/40 border-b border-white/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {attendance.map((student) => (
                <tr key={student.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{student.name}</td>
                  <td className="px-6 py-4 text-gray-600">{student.student_id}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {student.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => toggleAttendance(student.id)}
                        className={`p-2 rounded-xl transition-all ${student.status === 'present'
                          ? 'bg-green-500 text-white'
                          : 'bg-white/50 text-gray-400 border border-white/40 hover:bg-white/80'
                          }`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => toggleAttendance(student.id)}
                        className={`p-2 rounded-xl transition-all ${student.status === 'absent'
                          ? 'bg-red-500 text-white'
                          : 'bg-white/50 text-gray-400 border border-white/40 hover:bg-white/80'
                          }`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {attendance.length === 0 && (
            <div className="p-8 text-center text-gray-500 italic">No students found for this course.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AttendancePage;
