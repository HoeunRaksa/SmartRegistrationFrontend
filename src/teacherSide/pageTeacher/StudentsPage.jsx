import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Mail, Phone, BookOpen } from 'lucide-react';

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const students = [
    { id: 1, name: 'John Doe', studentId: 'ST001', email: 'john@novatech.edu', phone: '123-456-7890', course: 'Web Development', gpa: 3.8 },
    { id: 2, name: 'Jane Smith', studentId: 'ST002', email: 'jane@novatech.edu', phone: '123-456-7891', course: 'Database Systems', gpa: 3.9 },
    { id: 3, name: 'Mike Johnson', studentId: 'ST003', email: 'mike@novatech.edu', phone: '123-456-7892', course: 'Web Development', gpa: 3.5 },
    { id: 4, name: 'Sarah Williams', studentId: 'ST004', email: 'sarah@novatech.edu', phone: '123-456-7893', course: 'Software Engineering', gpa: 4.0 },
  ];

  const courses = ['All Courses', 'Web Development', 'Database Systems', 'Software Engineering'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Students</h1>
        <p className="text-gray-600">View and manage students across your courses</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-6 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          <option value="all">All Courses</option>
          {courses.slice(1).map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
      </motion.div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/40 border-b border-white/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Course</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">GPA</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{student.studentId}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {student.course}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${student.gpa >= 3.5 ? 'text-green-600' : 'text-orange-600'}`}>
                      {student.gpa.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition-all">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {filteredStudents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No students found</p>
        </motion.div>
      )}
    </div>
  );
};

export default StudentsPage;
