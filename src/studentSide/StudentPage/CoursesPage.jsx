import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from "react-dom";
import {
  BookOpen,
  Search,
  Filter,
  Users,
  Clock,
  MapPin,
  Trash2,
  CheckCircle,
  Plus,
  Loader,
  ArrowRight,
  ChevronRight,
  Clock3,
  BookMarked,
  ShieldCheck,
  Star,
  Calendar,
  GraduationCap,
  AlertCircle,
  Award,
  X
} from "lucide-react";
import Alert from '../../gobalConponent/Alert.jsx';
import ConfirmDialog from '../../gobalConponent/ConfirmDialog.jsx';
import {
  fetchStudentCourses,
  fetchAvailableCourses,
  enrollInCourse,
  dropCourse
} from '../../api/course_api';

const CoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });
  const [confirm, setConfirm] = useState({ show: false, id: null });
  const [activeTab, setActiveTab] = useState('enrolled'); // 'enrolled' or 'available'

  useEffect(() => {
    loadCourses();
  }, []);

  const showMessage = (type, text) => {
    setAlert({ show: true, message: text, type });
  };

  const buildScheduleText = (courseOrEnrollment) => {
    // backend may send schedules on course: course.class_schedules or course.schedule (array)
    const course = courseOrEnrollment?.course || courseOrEnrollment;

    // Check all possible schedule keys
    const schedules = course?.class_schedules || course?.schedules || (Array.isArray(course?.schedule) ? course.schedule : []) || [];

    if (!Array.isArray(schedules) || schedules.length === 0) {
      // maybe enrollment sends schedule string already, or it's empty
      return typeof course?.schedule === 'string' ? course.schedule : '';
    }

    // Example output: "Mon 10:00-11:30, Wed 10:00-11:30"
    const dayShort = (d) => {
      const map = {
        Monday: 'Mon',
        Tuesday: 'Tue',
        Wednesday: 'Wed',
        Thursday: 'Thu',
        Friday: 'Fri',
        Saturday: 'Sat',
        Sunday: 'Sun',
      };
      return map[d] || d;
    };

    return schedules
      .map((s) => `${dayShort(s.day || s.day_of_week)} ${s.start_time?.slice(0, 5)}-${s.end_time?.slice(0, 5)}`)
      .join(', ');
  };

  const normalizeCourse = (item) => {
    // item may be:
    // 1) enrollment: { course: {...}, progress, status ... }
    // 2) course: {...} (available courses)
    const course = item?.course || item;

    return {
      id: course?.id || course?.course_id, // backend sometimes sends course_id in wrapper
      course_code: course?.course_code || course?.code || '',
      course_name: course?.course_name || course?.name || course?.title || '',
      // Backend returns instructor as object { id, name }
      instructor: course?.instructor?.name || course?.instructor_name || (typeof course?.instructor === 'string' ? course.instructor : ''),
      credits: Number(course?.credits || 0),
      schedule: buildScheduleText(item),
      enrolled_students: Number(course?.enrolled_students || course?.enrolled_count || 0),
      max_students: Number(course?.max_students || course?.capacity || 0),
      room:
        course?.room ||
        (Array.isArray(course?.class_schedules) && course.class_schedules[0]?.room) ||
        (Array.isArray(course?.schedule) && course.schedule[0]?.room) ||
        '',
      prerequisites: Array.isArray(course?.prerequisites) ? course.prerequisites : [],
      progress: Number(item?.progress ?? course?.progress ?? 0),
    };
  };

  const loadCourses = async () => {
    try {
      setLoading(true);

      const [enrolledRes, availableRes] = await Promise.all([
        fetchStudentCourses(),
        fetchAvailableCourses(),
      ]);

      const enrolled = Array.isArray(enrolledRes?.data?.data) ? enrolledRes.data.data : [];
      const available = Array.isArray(availableRes?.data?.data) ? availableRes.data.data : [];

      setEnrolledCourses(enrolled.map(normalizeCourse));
      setAvailableCourses(available.map(normalizeCourse));
    } catch (error) {
      console.error('Failed to load courses:', error);
      showMessage('error', error?.response?.data?.message || 'Failed to load courses');
      setEnrolledCourses([]);
      setAvailableCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(true);
      await enrollInCourse(courseId);
      showMessage('success', 'Successfully enrolled in course!');
      await loadCourses();
    } catch (error) {
      console.error('Enroll error:', error);
      showMessage('error', error?.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleDrop = (courseId) => {
    setConfirm({ show: true, id: courseId });
  };

  const executeDrop = async () => {
    if (!confirm.id) return;

    try {
      setEnrolling(true);
      await dropCourse(confirm.id);
      showMessage('success', 'Successfully dropped course');
      await loadCourses();
    } catch (error) {
      console.error('Drop error:', error);
      showMessage('error', error?.response?.data?.message || 'Failed to drop course');
    } finally {
      setEnrolling(false);
      setConfirm({ show: false, id: null });
    }
  };

  const filteredEnrolledCourses = enrolledCourses.filter((course) =>
    (course.course_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.course_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.instructor || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableCourses = availableCourses.filter((course) =>
    (course.course_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.course_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.instructor || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert
        isOpen={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <ConfirmDialog
        isOpen={confirm.show}
        title="Drop Course"
        message="Are you sure you want to drop this course? This action may affect your academic progress."
        onConfirm={executeDrop}
        onCancel={() => setConfirm({ show: false, id: null })}
        confirmText="Drop Course"
        type="danger"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-end gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            Course Management
          </h2>
          <p className="text-gray-600 mt-1 font-medium">Browse and manage your academic curriculum</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('enrolled')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'enrolled'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
              : 'backdrop-blur-xl bg-white/60 border border-white/40 text-gray-600 hover:bg-white/80'
              }`}
          >
            My Courses ({enrolledCourses.length})
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('available')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'available'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
              : 'backdrop-blur-xl bg-white/60 border border-white/40 text-gray-600 hover:bg-white/80'
              }`}
          >
            Enroll ({availableCourses.length})
          </motion.button>
        </div>
      </motion.div>

      {/* Header Stats */}

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative w-full sm:w-80"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
        </motion.div>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </motion.div>

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
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all cursor-pointer"
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
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className="font-semibold text-blue-600"
                      >
                        {course.progress}%
                      </motion.span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full relative"
                      >
                        <motion.div
                          animate={{
                            backgroundPosition: ["0% 50%", "100% 50%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          style={{ backgroundSize: "200% 100%" }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCourseDetails(course)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDrop(course.id)}
                      disabled={enrolling}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
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
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all cursor-pointer"
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

                  <motion.button
                    whileHover={!enrolling && !(course.max_students > 0 && course.enrolled_students >= course.max_students) ? { scale: 1.05, y: -2 } : {}}
                    whileTap={!enrolling && !(course.max_students > 0 && course.enrolled_students >= course.max_students) ? { scale: 0.95 } : {}}
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolling || (course.max_students > 0 && course.enrolled_students >= course.max_students)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {enrolling ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader className="w-5 h-5 shadow-sm" />
                      </motion.div>
                    ) : (course.max_students > 0 && course.enrolled_students >= course.max_students) ? (
                      'Course Full'
                    ) : (
                      <>
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Plus className="w-5 h-5" />
                        </motion.div>
                        Enroll Now
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {selectedCourseDetails && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedCourseDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

              <div className="flex justify-between items-start">
                <div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {selectedCourseDetails.course_code}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">{selectedCourseDetails.course_name}</h3>
                </div>
                <button
                  onClick={() => setSelectedCourseDetails(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 italic">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Instructor</p>
                  <p className="font-semibold text-gray-900">{selectedCourseDetails.instructor}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 italic">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Credits</p>
                  <p className="font-semibold text-gray-900">{selectedCourseDetails.credits} Units</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">{selectedCourseDetails.schedule}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-medium">Room: {selectedCourseDetails.room}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">{selectedCourseDetails.enrolled_students} Students Enrolled</span>
                </div>
              </div>

              {selectedCourseDetails.prerequisites?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Prerequisites</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourseDetails.prerequisites.map((prereq, pidx) => (
                      <span key={pidx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedCourseDetails(null)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-indigo-200 transition-all"
              >
                Close Details
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default CoursesPage;
