import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Calendar, Clock, Search, Filter } from 'lucide-react';

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const courses = [
    {
      id: 1,
      name: 'Web Development',
      code: 'CS301',
      students: 28,
      schedule: 'Mon, Wed, Fri - 09:00 AM',
      room: 'Room 301',
      semester: 'Spring 2024',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      name: 'Database Systems',
      code: 'CS402',
      students: 32,
      schedule: 'Tue, Thu - 11:00 AM',
      room: 'Room 205',
      semester: 'Spring 2024',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      name: 'Software Engineering',
      code: 'CS501',
      students: 24,
      schedule: 'Mon, Wed - 02:00 PM',
      room: 'Room 401',
      semester: 'Spring 2024',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      name: 'Computer Networks',
      code: 'CS403',
      students: 30,
      schedule: 'Tue, Thu - 03:00 PM',
      room: 'Room 302',
      semester: 'Spring 2024',
      color: 'from-orange-500 to-red-500'
    },
  ];

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Courses</h1>
        <p className="text-gray-600">Manage and view all your teaching courses</p>
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
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>
        <button className="px-6 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 hover:bg-white/80 transition-all flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </motion.div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all overflow-hidden group"
          >
            <div className={`h-2 bg-gradient-to-r ${course.color}`} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${course.color}`}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  {course.semester}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-1">{course.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{course.code}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{course.students} Students</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{course.room}</span>
                </div>
              </div>

              <button className={`w-full py-2 rounded-xl bg-gradient-to-r ${course.color} text-white font-medium hover:shadow-lg transition-all`}>
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No courses found</p>
        </motion.div>
      )}
    </div>
  );
};

export default CoursesPage;
