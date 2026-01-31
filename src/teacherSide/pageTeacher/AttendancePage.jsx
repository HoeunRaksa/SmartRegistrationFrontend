import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, X, Check, Calendar, Download, Search, Users, Clock, UserCheck, AlertCircle, BookOpen } from 'lucide-react';
import {
  fetchTeacherCourses,
  fetchTeacherAttendanceSessions,
  createTeacherClassSession,
  markTeacherAttendanceBulk,
  fetchTeacherAttendanceStats,
  fetchCourseStudents,
  fetchTeacherSchedule
} from '../../api/teacher_api';

import {
  Plus,
  Sparkles,
  Save as SaveIcon
} from 'lucide-react';

import FormModal from '../../Components/FormModal';

const AttendancePage = () => {
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  const [attendance, setAttendance] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    session_date: new Date().toLocaleDateString('en-CA'),
    start_time: '07:45',
    end_time: '09:00',
  });
  const location = useLocation();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (location.state?.courseId) {
      setSelectedCourseId(location.state.courseId);
    }
  }, [location.state]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesRes, sessionsRes, statsRes, scheduleRes] = await Promise.all([
        fetchTeacherCourses(),
        fetchTeacherAttendanceSessions(),
        fetchTeacherAttendanceStats(),
        fetchTeacherSchedule()
      ]);

      const courseList = coursesRes?.data?.data ?? (Array.isArray(coursesRes?.data) ? coursesRes.data : []);
      const sessionList = sessionsRes?.data?.data ?? (Array.isArray(sessionsRes?.data) ? sessionsRes.data : []);
      const scheduleList = scheduleRes?.data?.data ?? [];

      setCourses(Array.isArray(courseList) ? courseList : []);
      setSessions(Array.isArray(sessionList) ? sessionList : []);
      setStats(statsRes.data?.data || null);

      if (courseList.length > 0 && !selectedCourseId) {
        // Initial default, will be overridden by auto-detect if match found
        setSelectedCourseId(courseList[0].id);
      }

      // 🔥 AUTO-DETECT AND AUTO-CREATE LOGIC
      handleAutoDetect(scheduleList, sessionList, courseList);

    } catch (error) {
      console.error('Failed to load attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetect = async (schedules, sessions, courses) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }); // e.g. "Monday"
    const currentTimeStr = now.toTimeString().slice(0, 5); // "HH:MM"

    // Helper to convert "HH:MM" to minutes from midnight
    const toMinutes = (str) => {
      if (!str) return 0;
      const [h, m] = str.split(':').map(Number);
      return h * 60 + m;
    };

    const currentMinutes = toMinutes(currentTimeStr);

    // Find if something is scheduled NOW (with 30 min early buffer)
    const activeSchedule = schedules.find(s => {
      if (s.day_of_week && s.day_of_week.toLowerCase() !== currentDay.toLowerCase()) return false;

      const startMin = toMinutes(s.start_time?.slice(0, 5));
      const endMin = toMinutes(s.end_time?.slice(0, 5));

      // Check window: 30 mins before start -> end time
      return currentMinutes >= (startMin - 30) && currentMinutes <= endMin;
    });

    if (activeSchedule) {
      const courseId = activeSchedule.course_id || activeSchedule.id; // Backend might send course_id or we use ID if flat
      // Check if we already have a session for this course TODAY
      const todayStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD

      const existingSession = sessions.find(sess => {
        const sessDate = sess.date ? new Date(sess.date).toLocaleDateString('en-CA') : '';
        const matchCourse = String(sess.course_id) === String(courseId);

        // Match if it's the same day and roughly same time (overlapping start times)
        // This is robust against small differences like 08:00 vs 08:00:00
        const sessStartMin = toMinutes(sess.time?.split(' - ')[0] || sess.start_time?.slice(0, 5));
        const schedStartMin = toMinutes(activeSchedule.start_time?.slice(0, 5));
        const matchTime = Math.abs(sessStartMin - schedStartMin) < 15; // Within 15 mins start time

        return matchCourse && sessDate === todayStr && matchTime;
      });

      if (existingSession) {

        setSelectedCourseId(courseId);
        setSelectedSessionId(existingSession.id);
        setIsAutoDetected(true);
      } else {

        try {
          const res = await createTeacherClassSession({
            course_id: courseId,
            session_date: todayStr,
            start_time: activeSchedule.start_time,
            end_time: activeSchedule.end_time,
            room: activeSchedule.room
          });

          if (res.data?.data) {
            const newSession = res.data.data;
            setSessions(prev => [newSession, ...prev]);
            setSelectedCourseId(courseId);
            setSelectedSessionId(newSession.id);
            setIsAutoDetected(true);
          }
        } catch (err) {
          console.error("Auto-session creation failed:", err);
        }
      }
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
      alert(error.response?.data?.message || 'Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return alert("Please select a course first");

    try {
      setLoading(true);
      const res = await createTeacherClassSession({
        course_id: selectedCourseId,
        ...sessionForm
      });

      alert('Session created successfully!');
      setIsCreateModalOpen(false);

      // Reload sessions and select the new one
      const sessionsRes = await fetchTeacherAttendanceSessions();
      const sessionList = sessionsRes?.data?.data ?? (Array.isArray(sessionsRes?.data) ? sessionsRes.data : []);
      setSessions(sessionList);

      if (res.data?.data?.id) {
        setSelectedSessionId(res.data.data.id);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create session');
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
    (s.name || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.student_id || '').toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchYear = !filterYear || String(c.academic_year) === String(filterYear);
      const matchSem = !filterSemester || String(c.semester) === String(filterSemester);
      return matchYear && matchSem;
    });
  }, [courses, filterYear, filterSemester]);

  // Update selection when filtered courses change
  useEffect(() => {
    if (filteredCourses.length > 0 && !filteredCourses.find(c => String(c.id) === String(selectedCourseId))) {
      setSelectedCourseId(filteredCourses[0].id);
    } else if (filteredCourses.length === 0) {
      setSelectedCourseId('');
    }
  }, [filteredCourses]);

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
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-white border border-blue-200 text-blue-600 font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Session
          </motion.button>
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Check className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Present</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{presentCount}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Late</span>
          </div>
          <p className="text-2xl font-bold text-amber-500">{lateCount}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <X className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Absent</span>
          </div>
          <p className="text-2xl font-bold text-red-500">{absentCount}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Excused</span>
          </div>
          <p className="text-2xl font-bold text-slate-600">{excusedCount}</p>
        </motion.div>
      </div>

      {/* Term Filters */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/40 shadow-sm flex flex-col md:flex-row items-end gap-4 mb-6">
        <div className="flex-1 w-full space-y-1.5">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Academic Year</label>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-full rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
          >
            <option value="">All Academic Years</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </div>
        <div className="flex-1 w-full space-y-1.5">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Semester</label>
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="w-full rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
          >
            <option value="">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setFilterYear(""); setFilterSemester(""); }}
          className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors"
        >
          Clear Filters
        </motion.button>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Select Subject / Course
              </label>
              <p className="text-[11px] text-gray-500 mt-0.5">Choose which class you are teaching now</p>
            </div>
            {isAutoDetected && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Session Detected</span>
              </div>
            )}
          </div>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-bold transition-all shadow-sm"
          >
            <option value="">Choose a course...</option>
            {filteredCourses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code}) - Sem {course.semester}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Select Class Session
              </label>
              <p className="text-[11px] text-gray-500 mt-0.5">Which scheduled time is this attendance for?</p>
            </div>
            {selectedCourseId && (
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[10px] font-bold text-purple-600 border border-purple-100 uppercase tracking-wider">Required</span>
            )}
          </div>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none font-bold transition-all shadow-sm ${selectedCourseId
              ? "bg-gray-50 border-gray-200 focus:ring-purple-500 text-gray-700"
              : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            disabled={!selectedCourseId}
          >
            <option value="">{selectedCourseId ? "Choose a session date & time..." : "Select a course first"}</option>
            {sessions
              .filter(s => {
                const sid = String(s.course_id || s.subject_id || '');
                return sid === String(selectedCourseId);
              })
              .map(session => {
                // Use toLocaleDateString to get the correct LOCAL date from whatever the server sent
                const d = session.date ? new Date(session.date) : null;
                const sessionDate = d ? d.toLocaleDateString('en-CA') : ''; // en-CA gives YYYY-MM-DD
                const now = new Date();
                const localToday = now.toLocaleDateString('en-CA');
                const isToday = sessionDate === localToday;

                return (
                  <option key={session.id} value={session.id}>
                    {isToday ? "⭐️ TODAY - " : ""}{sessionDate} ({session.time || session.start_time || '—'})
                  </option>
                );
              })}
          </select>
          {selectedCourseId && sessions.filter(s => String(s.course_id || s.subject_id || '') === String(selectedCourseId)).length === 0 && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase">No sessions found</p>
                <p className="text-[10px] text-amber-700">Click the <b>"New Session"</b> button at the top to create one yourself and start marking attendance!</p>
              </div>
            </div>
          )}
          {!selectedCourseId && (
            <p className="mt-2 text-[10px] text-amber-600 font-medium flex items-center gap-1 italic">
              <AlertCircle className="w-3 h-3" />
              Please pick a course above to see its sessions
            </p>
          )}
        </div>
      </div>

      {/* Student List Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden"
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
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = (student.name || '?').charAt(0); }}
                          />
                        ) : (
                          (student.name || '?').charAt(0)
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

      {/* CREATE SESSION MODAL */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="max-w-xl"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New Session</h2>
              <p className="text-xs text-gray-500 mt-0.5">Quickly set up a session to mark attendance</p>
            </div>
          </div>

          <form onSubmit={handleCreateSession} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                Course / Subject
              </label>
              <select
                required
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-bold"
              >
                <option value="">Select a course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                Session Date
              </label>
              <input
                type="date"
                required
                value={sessionForm.session_date}
                onChange={(e) => setSessionForm({ ...sessionForm, session_date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={sessionForm.start_time}
                  onChange={(e) => setSessionForm({ ...sessionForm, start_time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  End Time
                </label>
                <input
                  type="time"
                  required
                  value={sessionForm.end_time}
                  onChange={(e) => setSessionForm({ ...sessionForm, end_time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-bold"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? 'Creating...' : (
                <>
                  <SaveIcon className="w-5 h-5" />
                  Create & Start Marking
                </>
              )}
            </motion.button>
          </form>
        </div>
      </FormModal>
    </div>
  );
};

export default AttendancePage;
