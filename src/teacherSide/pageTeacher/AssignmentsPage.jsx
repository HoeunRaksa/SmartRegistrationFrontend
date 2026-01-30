import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, Calendar, Users, FileText, X, Save, Clock, Loader, Eye, Award, CheckSquare } from 'lucide-react';
import {
  fetchTeacherAssignments,
  fetchTeacherCourses,
  createTeacherAssignment,
  fetchTeacherSubmissions,
  deleteTeacherAssignment
} from '../../api/teacher_api';
import FormModal from '../../Components/FormModal';

const AssignmentsPage = () => {
  const navigate = useNavigate();
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [submissions, setSubmissions] = useState([]);

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

  const handleViewSubmissions = async (assignment) => {
    try {
      setLoading(true);
      setSelectedAssignment(assignment);
      const res = await fetchTeacherSubmissions(assignment.id);
      setSubmissions(res.data?.data || []);
      setShowSubmissionsModal(true);
    } catch (error) {
      console.error('Failed to load submissions:', error);
      alert('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeAssignment = (assignment) => {
    // Navigate to a grading page or open grading modal
    setSelectedAssignment(assignment);
    handleViewSubmissions(assignment);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await deleteTeacherAssignment(assignmentId);
      alert('Assignment deleted successfully');
      loadData();
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      alert('Failed to delete assignment');
    }
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
                  <button
                    onClick={() => handleViewSubmissions(assignment)}
                    className="flex-1 py-2 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 hover:bg-white/80 transition-all text-gray-700 font-medium flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Submissions
                  </button>
                  <button
                    onClick={() => handleGradeAssignment(assignment)}
                    className={`flex-1 py-2 rounded-xl bg-gradient-to-r ${assignment.color} text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                  >
                    <CheckSquare className="w-4 h-4" />
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
      <FormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New Assignment"
      >
        <CreateAssignmentForm
          courses={courses}
          onCreated={loadData}
          onClose={() => setShowCreateModal(false)}
        />
      </FormModal>

      {/* Submissions Modal */}
      <FormModal
        isOpen={showSubmissionsModal}
        onClose={() => setShowSubmissionsModal(false)}
        title={`Submissions: ${selectedAssignment?.title || ''}`}
      >
        <div className="bg-white p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                Student Submissions ({submissions.length})
              </h3>
              <div className="text-sm text-gray-600">
                {submissions.filter(s => s.graded).length} graded
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {submissions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No submissions yet</p>
              </div>
            ) : (
              submissions.map((submission, idx) => (
                <div key={submission.id || idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {(submission.student_name || 'S').charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{submission.student_name || 'Student'}</div>
                        <div className="text-xs text-gray-500">
                          Submitted: {submission.submitted_at || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div>
                      {submission.graded ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          Graded: {submission.score}/{submission.total_points}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                  {submission.file_url && (
                    <div className="mt-2">
                      <a
                        href={submission.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <FileText className="w-4 h-4" />
                        View Submission
                      </a>
                    </div>
                  )}
                  {submission.content && (
                    <div className="mt-2 text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
                      {submission.content}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </FormModal>
    </div>
  );
};

const CreateAssignmentForm = ({ courses, onCreated, onClose }) => {
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
    <div className="bg-white p-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">New Assignment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            Target Course
          </label>
          <select
            required
            value={formData.course_id}
            onChange={e => setFormData({ ...formData, course_id: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="">Select a course...</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            Assignment Title
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Final Project Phase 1"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <Save className="w-4 h-4 text-emerald-500" />
              Points
            </label>
            <input
              required
              type="number"
              value={formData.points}
              onChange={e => setFormData({ ...formData, points: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Due Date
            </label>
            <input
              required
              type="date"
              value={formData.due_date}
              onChange={e => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-purple-500" />
            Instructions
          </label>
          <textarea
            required
            rows="3"
            placeholder="Describe assignment tasks..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
          ></textarea>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all font-sans"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            type="submit"
            className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? 'Creating...' : 'Launch Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentsPage;
