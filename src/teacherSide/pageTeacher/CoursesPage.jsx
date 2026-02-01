import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Calendar, Clock, Search, Filter, Eye } from 'lucide-react';

import { fetchTeacherCourses } from '../../api/teacher_api';

const CoursesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filterYear, setFilterYear] = useState('all');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await fetchTeacherCourses();
      setCourses(res.data?.data || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (courseId) => {
    // Navigate to course details or attendance page for this course
    navigate('/teacher/attendance', { state: { courseId } });
  };

  const filteredCourses = courses.filter(course =>
    (course.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="px-6 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <Filter className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all overflow-hidden group"
            >
              <div className={`h-2 bg-gradient-to-r ${course.color}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${course.color}`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    {course.academic_year || '2024'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1">{course.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{course.code} - {course.class_group}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{course.students} Students</span>
                  </div>
                  {course.schedules?.slice(0, 1).map((s, idx) => (
                    <React.Fragment key={idx}>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{s.day_of_week}: {s.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{s.room}</span>
                      </div>
                    </React.Fragment>
                  ))}
                  {!course.schedules?.length && (
                    <div className="text-sm text-gray-400 italic">No schedule set</div>
                  )}
                </div>

                <button
                  onClick={() => handleViewCourse(course.id)}
                  className={`w-full py-2 rounded-xl bg-gradient-to-r ${course.color} text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredCourses.length === 0 && (
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
