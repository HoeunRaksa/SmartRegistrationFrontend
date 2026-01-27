import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Plus, Calendar, Users, FileText, X, Save, Clock, Loader } from 'lucide-react';
import {
  fetchTeacherAssignments,
  fetchTeacherCourses,
  createTeacherAssignment
} from '../../api/teacher_api';

const AssignmentsPage = () => {
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesRes, assignmentsRes] = await Promise.all([
        fetchTeacherCourses(),
        fetchTeacherAssignments()
      ]);
      setCourses(coursesRes.data?.data || []);
      setAssignments(assignmentsRes.data?.data || []);
    } catch (error) {
      console.error('Failed to load assignments data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = selectedCourseId === 'all'
    ? assignments
    : assignments.filter(a => a.course_id == selectedCourseId);

  const getStatusColor = (status) => {
    if (status === 'active') return 'bg-blue-100 text-blue-700';
    if (status === 'grading') return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  };

  const getProgress = (submitted, total) => {
    if (!total || total === 0) return 0;
    return ((submitted / total) * 100).toFixed(0);
  };

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Assignments</h1>
          <p className="text-gray-600">Create and manage course assignments</p>
        </motion.div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Course Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="max-w-md w-full px-6 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-sm"
        >
          <option value="all">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name} ({course.class_group})</option>
          ))}
        </select>
      </motion.div>

      {/* Assignments Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${assignment.color}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">{assignment.course} ({assignment.courseCode})</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(assignment.status)}`}>
                    {assignment.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Due: {assignment.dueDate} {assignment.dueTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <ClipboardList className="w-4 h-4 text-gray-500" />
                    <span>Points: {assignment.points}</span>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Submissions</span>
                      <span className="font-semibold text-gray-800">{assignment.submitted} total</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                        style={{ width: `${assignment.submitted > 0 ? 50 : 0}%` }} // Simplified for grid view
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Graded</span>
                      <span className="font-semibold text-gray-800">{assignment.graded}/{assignment.submitted}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                        style={{ width: `${getProgress(assignment.graded, assignment.submitted)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 hover:bg-white/80 transition-all text-gray-700 font-medium">
                    Submissions
                  </button>
                  <button className={`flex-1 py-2 rounded-xl bg-gradient-to-r ${assignment.color} text-white font-medium hover:shadow-lg transition-all`}>
                    Grade Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAssignments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No assignments found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-blue-600 font-medium hover:underline"
          >
            Create your first assignment
          </button>
        </motion.div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateAssignmentModal
            courses={courses}
            onClose={() => setShowCreateModal(false)}
            onCreated={loadData}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const CreateAssignmentModal = ({ courses, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    points: 100,
    due_date: '',
    due_time: '23:59',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTeacherAssignment(formData);
      onCreated();
      onClose();
    } catch (error) {
      alert('Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">New Assignment</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Target Course</label>
            <select
              required
              value={formData.course_id}
              onChange={e => setFormData({ ...formData, course_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select a course...</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Assignment Title</label>
            <input
              required
              type="text"
              placeholder="e.g. Final Project Phase 1"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Points</label>
              <input
                required
                type="number"
                value={formData.points}
                onChange={e => setFormData({ ...formData, points: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
              <input
                required
                type="date"
                value={formData.due_date}
                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Instructions</label>
            <textarea
              required
              rows="3"
              placeholder="Describe assignment tasks..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Launch Assignment'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AssignmentsPage;
