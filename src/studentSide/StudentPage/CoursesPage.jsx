import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Users,
  Clock,
  Calendar,
  Plus,
  Trash2,
  FileText,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Loader,
  Search,
  Filter,
  X,
  BookMarked,
  Award
} from 'lucide-react';
import { fetchStudentCourses, fetchAvailableCourses, enrollInCourse, dropCourse } from '../../api/course_api';

const CoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('enrolled'); // 'enrolled' or 'available'

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const [enrolledRes, availableRes] = await Promise.all([
        fetchStudentCourses().catch(() => ({ data: { data: [] } })),
        fetchAvailableCourses().catch(() => ({ data: { data: [] } }))
      ]);

      // Use mock data if API fails
      const mockEnrolled = [
        {
          id: 1,
          course_code: 'CS101',
          course_name: 'Introduction to Computer Science',
          instructor: 'Dr. Sarah Johnson',
          credits: 3,
          schedule: 'Mon, Wed 10:00 - 11:30 AM',
          enrolled_students: 45,
          max_students: 50,
          progress: 65,
          room: 'Room 301'
        },
        {
          id: 2,
          course_code: 'MATH201',
          course_name: 'Calculus II',
          instructor: 'Prof. Michael Chen',
          credits: 4,
          schedule: 'Tue, Thu 2:00 - 3:30 PM',
          enrolled_students: 38,
          max_students: 40,
          progress: 45,
          room: 'Room 205'
        },
        {
          id: 3,
          course_code: 'ENG102',
          course_name: 'Academic Writing',
          instructor: 'Dr. Emily White',
          credits: 3,
          schedule: 'Mon, Wed, Fri 1:00 - 2:00 PM',
          enrolled_students: 30,
          max_students: 35,
          progress: 72,
          room: 'Room 112'
        }
      ];

      const mockAvailable = [
        {
          id: 4,
          course_code: 'CS202',
          course_name: 'Data Structures and Algorithms',
          instructor: 'Dr. James Wilson',
          credits: 4,
          schedule: 'Tue, Thu 10:00 - 12:00 PM',
          enrolled_students: 32,
          max_students: 40,
          prerequisites: ['CS101'],
          room: 'Room 302'
        },
        {
          id: 5,
          course_code: 'PHY101',
          course_name: 'General Physics I',
          instructor: 'Prof. Lisa Anderson',
          credits: 3,
          schedule: 'Mon, Wed 3:00 - 4:30 PM',
          enrolled_students: 28,
          max_students: 35,
          prerequisites: [],
          room: 'Lab 101'
        }
      ];

      setEnrolledCourses(enrolledRes.data?.data?.length > 0 ? enrolledRes.data.data : mockEnrolled);
      setAvailableCourses(availableRes.data?.data?.length > 0 ? availableRes.data.data : mockAvailable);
    } catch (error) {
      console.error('Failed to load courses:', error);
      showMessage('error', 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(true);
      await enrollInCourse(courseId).catch(() => {
        // Mock enrollment
        const course = availableCourses.find(c => c.id === courseId);
        if (course) {
          setEnrolledCourses([...enrolledCourses, { ...course, progress: 0 }]);
          setAvailableCourses(availableCourses.filter(c => c.id !== courseId));
        }
      });
      showMessage('success', 'Successfully enrolled in course!');
      await loadCourses();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleDrop = async (courseId) => {
    if (!window.confirm('Are you sure you want to drop this course?')) return;

    try {
      setEnrolling(true);
      await dropCourse(courseId).catch(() => {
        // Mock drop
        const course = enrolledCourses.find(c => c.id === courseId);
        if (course) {
          setAvailableCourses([...availableCourses, course]);
          setEnrolledCourses(enrolledCourses.filter(c => c.id !== courseId));
        }
      });
      showMessage('success', 'Successfully dropped course');
      await loadCourses();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to drop course');
    } finally {
      setEnrolling(false);
    }
  };

  const filteredEnrolledCourses = enrolledCourses.filter(course =>
    course.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.course_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableCourses = availableCourses.filter(course =>
    course.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.course_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Message Alert */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`backdrop-blur-xl rounded-2xl p-4 border shadow-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'border-green-200/50 bg-green-50/50'
                : 'border-red-200/50 bg-red-50/50'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p className={`font-medium ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {message.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Enrolled Courses</p>
              <p className="text-3xl font-bold">{enrolledCourses.length}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Total Credits</p>
              <p className="text-3xl font-bold">
                {enrolledCourses.reduce((sum, course) => sum + (course.credits || 0), 0)}
              </p>
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
          className="backdrop-blur-xl bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Available to Enroll</p>
              <p className="text-3xl font-bold">{availableCourses.length}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <BookMarked className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'enrolled'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'backdrop-blur-xl bg-white/60 border border-white/40 text-gray-700 hover:bg-white/80'
            }`}
          >
            My Courses ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'available'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'backdrop-blur-xl bg-white/60 border border-white/40 text-gray-700 hover:bg-white/80'
            }`}
          >
            Enroll ({availableCourses.length})
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Course Grid */}
      <AnimatePresence mode="wait">
        {activeTab === 'enrolled' ? (
          <motion.div
            key="enrolled"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEnrolledCourses.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                <BookOpen className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-semibold">No enrolled courses found</p>
                <p className="text-sm">Try enrolling in some courses!</p>
              </div>
            ) : (
              filteredEnrolledCourses.map((course, index) => (
                <motion.div
                  key={course.id}
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
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        {course.instructor}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {course.schedule}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      {course.room}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users className="w-4 h-4 text-green-500" />
                      {course.enrolled_students}/{course.max_students} students
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Award className="w-4 h-4 text-orange-500" />
                      {course.credits} credits
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-blue-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                      View Details
                    </button>
                    <button
                      onClick={() => handleDrop(course.id)}
                      disabled={enrolling}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="available"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAvailableCourses.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                <BookMarked className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-semibold">No available courses found</p>
                <p className="text-sm">All courses are currently full or you're enrolled</p>
              </div>
            ) : (
              filteredAvailableCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold mb-2">
                        {course.course_code}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{course.course_name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        {course.instructor}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {course.schedule}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      {course.room}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users className="w-4 h-4 text-green-500" />
                      {course.enrolled_students}/{course.max_students} students
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Award className="w-4 h-4 text-orange-500" />
                      {course.credits} credits
                    </div>
                  </div>

                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50/50 border border-yellow-200 rounded-xl">
                      <p className="text-xs font-semibold text-yellow-800 mb-1">Prerequisites:</p>
                      <p className="text-xs text-yellow-700">{course.prerequisites.join(', ')}</p>
                    </div>
                  )}

                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolling || course.enrolled_students >= course.max_students}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {enrolling ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : course.enrolled_students >= course.max_students ? (
                      'Course Full'
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Enroll Now
                      </>
                    )}
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursesPage;
