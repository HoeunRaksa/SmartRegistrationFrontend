import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, X, Check, Calendar, Download } from 'lucide-react';

const AttendancePage = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS301');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const courses = [
    { id: 'CS301', name: 'Web Development' },
    { id: 'CS402', name: 'Database Systems' },
    { id: 'CS501', name: 'Software Engineering' },
  ];

  const [attendance, setAttendance] = useState([
    { id: 1, student: 'John Doe', studentId: 'ST001', status: 'present' },
    { id: 2, student: 'Jane Smith', studentId: 'ST002', status: 'present' },
    { id: 3, student: 'Mike Johnson', studentId: 'ST003', status: 'absent' },
    { id: 4, student: 'Sarah Williams', studentId: 'ST004', status: 'present' },
  ]);

  const toggleAttendance = (id) => {
    setAttendance(prev => prev.map(student =>
      student.id === id
        ? { ...student, status: student.status === 'present' ? 'absent' : 'present' }
        : student
    ));
  };

  const presentCount = attendance.filter(s => s.status === 'present').length;
  const absentCount = attendance.filter(s => s.status === 'absent').length;
  const attendanceRate = ((presentCount / attendance.length) * 100).toFixed(1);

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Management</h1>
        <p className="text-gray-600">Track and manage student attendance</p>
      </motion.div>

      {/* Course and Date Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="flex-1 px-6 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name} ({course.id})</option>
          ))}
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-6 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Download className="w-5 h-5" />
          <span>Export</span>
        </button>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6"
      >
        {[
          { label: 'Total Students', value: attendance.length, color: 'from-blue-500 to-cyan-500' },
          { label: 'Present', value: presentCount, color: 'from-green-500 to-emerald-500' },
          { label: 'Absent', value: absentCount, color: 'from-red-500 to-pink-500' },
          { label: 'Attendance Rate', value: `${attendanceRate}%`, color: 'from-purple-500 to-indigo-500' },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="backdrop-blur-xl bg-white/60 rounded-2xl p-4 border border-white/40 shadow-lg"
          >
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Attendance List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Today's Attendance - {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h2>
          <div className="space-y-3">
            {attendance.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-white/60 hover:bg-white/70 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {student.student.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{student.student}</p>
                    <p className="text-sm text-gray-600">{student.studentId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    student.status === 'present'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {student.status === 'present' ? 'Present' : 'Absent'}
                  </span>
                  <button
                    onClick={() => toggleAttendance(student.id)}
                    className={`p-3 rounded-lg transition-all ${
                      student.status === 'present'
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {student.status === 'present' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button className="px-6 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 hover:bg-white/80 transition-all font-medium text-gray-700">
              Cancel
            </button>
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all">
              Save Attendance
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AttendancePage;
