import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, X, Check, Calendar, Download, Search, Users, Clock, UserCheck, AlertCircle, BookOpen } from 'lucide-react';
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
  const [studentSearch, setStudentSearch] = useState('');

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

  const updateStatus = (studentId, status) => {
    setAttendance(prev => prev.map(student =>
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const handleMarkAllPresent = () => {
    setAttendance(prev => prev.map(student => ({ ...student, status: 'present' })));
  };

  const filteredStudents = attendance.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.student_id.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const presentCount = attendance.filter(s => s.status === 'present').length;
  const lateCount = attendance.filter(s => s.status === 'late').length;
  const absentCount = attendance.filter(s => s.status === 'absent').length;
  const excusedCount = attendance.filter(s => s.status === 'excused').length;
  const totalStudents = attendance.length;

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance</h1>
          <p className="text-gray-600">Mark daily attendance for your classes</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            disabled={loading}
            onClick={loadData}
            className="p-3 rounded-xl bg-white/60 backdrop-blur-xl border border-white/40 hover:bg-white/80 transition-all shadow-sm"
          >
            <Calendar className="w-5 h-5 text-gray-600" />
          </button>
          <button
            disabled={loading || !selectedSessionId}
            onClick={handleSaveAttendance}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <CheckSquare className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="backdrop-blur-xl bg-white/60 rounded-2xl p-4 border border-white/40 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="backdrop-blur-xl bg-white/60 rounded-2xl p-4 border border-white/40 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Check className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Present</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{presentCount}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="backdrop-blur-xl bg-white/60 rounded-2xl p-4 border border-white/40 shadow-sm">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Late</span>
          </div>
          <p className="text-2xl font-bold text-amber-500">{lateCount}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="backdrop-blur-xl bg-white/60 rounded-2xl p-4 border border-white/40 shadow-sm">
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <X className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Absent</span>
          </div>
          <p className="text-2xl font-bold text-red-500">{absentCount}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="backdrop-blur-xl bg-white/60 rounded-2xl p-4 border border-white/40 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Excused</span>
          </div>
          <p className="text-2xl font-bold text-slate-600">{excusedCount}</p>
        </motion.div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="backdrop-blur-xl bg-white/60 p-6 rounded-2xl border border-white/40 shadow-sm">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Select Course
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium transition-all"
          >
            <option value="">Choose a course...</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
            ))}
          </select>
        </div>

        <div className="backdrop-blur-xl bg-white/60 p-6 rounded-2xl border border-white/40 shadow-sm">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            Select Session
          </label>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none text-gray-700 font-medium transition-all"
            disabled={!selectedCourseId}
          >
            <option value="">{selectedCourseId ? "Choose a session..." : "Select a course first"}</option>
            {sessions
              .filter(s => s.course_name === courses.find(c => c.id == selectedCourseId)?.name)
              .map(session => {
                const isToday = session.date === new Date().toISOString().split('T')[0];
                return (
                  <option key={session.id} value={session.id}>
                    {isToday ? "⭐️ TODAY - " : ""}{session.date} ({session.time})
                  </option>
                );
              })}
          </select>
        </div>
      </div>

      {/* Student List Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white/40 shadow-xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/40 bg-white/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllPresent}
              disabled={!selectedSessionId || attendance.length === 0}
              className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-sm font-bold hover:bg-emerald-100 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Mark All Present
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/40 text-left">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden border border-white/20">
                        {student.profile_picture_url ? (
                          <img
                            src={student.profile_picture_url}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = student.name.charAt(0); }}
                          />
                        ) : (
                          student.name.charAt(0)
                        )}
                      </div>
                      <span className="font-semibold text-gray-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{student.student_id}</td>
                  <td className="px-6 py-4">
                    <div className="flex">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${student.status === 'present' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        student.status === 'late' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          student.status === 'absent' ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-slate-50 text-slate-700 border-slate-100'
                        }`}>
                        {student.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        title="Present"
                        onClick={() => updateStatus(student.id, 'present')}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${student.status === 'present' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-400 hover:border-emerald-300 hover:text-emerald-500'
                          }`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        title="Late"
                        onClick={() => updateStatus(student.id, 'late')}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${student.status === 'late' ? 'bg-amber-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-500'
                          }`}
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                      <button
                        title="Absent"
                        onClick={() => updateStatus(student.id, 'absent')}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${student.status === 'absent' ? 'bg-red-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500'
                          }`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        title="Excused"
                        onClick={() => updateStatus(student.id, 'excused')}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${student.status === 'excused' ? 'bg-slate-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-400 hover:border-slate-300 hover:text-slate-500'
                          }`}
                      >
                        <AlertCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <div className="mb-2 flex justify-center"><Search className="w-8 h-8 opacity-20" /></div>
              <p className="font-medium">No students found.</p>
              <p className="text-sm">Try a different search term or select a course.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AttendancePage;
