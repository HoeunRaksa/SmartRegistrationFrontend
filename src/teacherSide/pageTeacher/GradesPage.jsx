import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Search, BookOpen, Download } from 'lucide-react';

const GradesPage = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS301');

  const courses = [
    { id: 'CS301', name: 'Web Development' },
    { id: 'CS402', name: 'Database Systems' },
    { id: 'CS501', name: 'Software Engineering' },
  ];

  const grades = [
    { id: 1, student: 'John Doe', midterm: 85, final: 88, assignments: 90, attendance: 95, total: 89.5, grade: 'A' },
    { id: 2, student: 'Jane Smith', midterm: 92, final: 95, assignments: 94, attendance: 100, total: 95.25, grade: 'A+' },
    { id: 3, student: 'Mike Johnson', midterm: 78, final: 82, assignments: 85, attendance: 90, total: 83.75, grade: 'B' },
    { id: 4, student: 'Sarah Williams', midterm: 95, final: 98, assignments: 97, attendance: 100, total: 97.5, grade: 'A+' },
  ];

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-600 bg-green-100';
    if (grade === 'B+' || grade === 'B') return 'text-blue-600 bg-blue-100';
    if (grade === 'C+' || grade === 'C') return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Grades Management</h1>
        <p className="text-gray-600">View and manage student grades across your courses</p>
      </motion.div>

      {/* Course Selection and Actions */}
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
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Download className="w-5 h-5" />
          <span>Export Grades</span>
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
          { label: 'Class Average', value: '88.5%', color: 'from-blue-500 to-cyan-500' },
          { label: 'Highest Score', value: '97.5%', color: 'from-green-500 to-emerald-500' },
          { label: 'Lowest Score', value: '83.75%', color: 'from-orange-500 to-red-500' },
          { label: 'Pass Rate', value: '100%', color: 'from-purple-500 to-pink-500' },
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

      {/* Grades Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/40 border-b border-white/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Midterm</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Final</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Assignments</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Attendance</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Total</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Grade</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {grades.map((student) => (
                <tr key={student.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {student.student.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-800">{student.student}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">{student.midterm}%</td>
                  <td className="px-6 py-4 text-center text-gray-700">{student.final}%</td>
                  <td className="px-6 py-4 text-center text-gray-700">{student.assignments}%</td>
                  <td className="px-6 py-4 text-center text-gray-700">{student.attendance}%</td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-blue-600">{student.total}%</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getGradeColor(student.grade)}`}>
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition-all">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default GradesPage;
