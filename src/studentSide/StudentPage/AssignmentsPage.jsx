import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Paperclip,
  Download,
  Trash2,
  Loader,
  Filter,
  Search,
  BookOpen,
  Award
} from 'lucide-react';
import { fetchStudentAssignments, submitAssignment, } from '../../api/assignment_api';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, submitted, graded
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetchStudentAssignments().catch(() => ({ data: { data: [] } }));

      setAssignments(response.data?.data?.length > 0 ? response.data.data : []);
    } catch (error) {
      console.error('Failed to load assignments:', error);
      showMessage('error', 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showMessage('error', 'File size must be less than 10MB');
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (assignmentId) => {
    if (!uploadedFile) {
      showMessage('error', 'Please select a file to upload');
      return;
    }

    try {
      setSubmitting(true);
      await submitAssignment(assignmentId, uploadedFile);
      showMessage('success', 'Assignment submitted successfully!');
      setSelectedAssignment(null);
      setUploadedFile(null);
      await loadAssignments();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'from-orange-500 to-red-500',
      submitted: 'from-blue-500 to-cyan-500',
      graded: 'from-green-500 to-emerald-500'
    };
    return colors[status] || 'from-gray-400 to-gray-500';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      submitted: Upload,
      graded: CheckCircle
    };
    return icons[status] || AlertCircle;
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.course_code?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    pending: assignments.filter(a => a.status === 'pending').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    graded: assignments.filter(a => a.status === 'graded').length,
    avgGrade: assignments.filter(a => a.grade !== null).reduce((sum, a) => sum + (a.grade / a.points * 100), 0) / assignments.filter(a => a.grade !== null).length || 0
  };

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
            className={`backdrop-blur-xl rounded-2xl p-4 border shadow-lg flex items-center gap-3 ${message.type === 'success'
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Pending</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Submitted</p>
              <p className="text-3xl font-bold">{stats.submitted}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Upload className="w-8 h-8 text-white" />
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
              <p className="text-sm opacity-90 mb-1">Graded</p>
              <p className="text-3xl font-bold">{stats.graded}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Avg Grade</p>
              <p className="text-3xl font-bold">{stats.avgGrade.toFixed(0)}%</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent flex items-center gap-3">
            <FileText className="w-8 h-8 text-pink-600" />
            Coursework & Assignments
          </h2>
          <p className="text-gray-600 mt-1 font-medium">Track your pending tasks and submissions</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'submitted', 'graded'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all capitalize ${filterStatus === status
                    ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg'
                    : 'backdrop-blur-xl bg-white/60 border border-white/40 text-gray-600 hover:bg-white/80'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all shadow-sm focus:bg-white"
            />
          </div>
        </div>
      </motion.div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <FileText className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-semibold">No assignments found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          filteredAssignments.map((assignment, index) => {
            const StatusIcon = getStatusIcon(assignment.status);
            const daysUntilDue = getDaysUntilDue(assignment.due_date);
            const isOverdue = daysUntilDue < 0 && assignment.status === 'pending';

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r ${getStatusColor(assignment.status)} text-white text-sm font-semibold`}>
                        <StatusIcon className="w-4 h-4" />
                        {assignment.status}
                      </div>
                      <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                        {assignment.course_code}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{assignment.course_name}</p>
                    <p className="text-gray-700">{assignment.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className={`w-5 h-5 ${isOverdue ? 'text-red-500' : 'text-blue-500'}`} />
                    <div>
                      <div className="text-gray-600">Due Date</div>
                      <div className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                        {new Date(assignment.due_date).toLocaleDateString()} {assignment.due_time}
                      </div>
                      {assignment.status === 'pending' && (
                        <div className={`text-xs ${isOverdue ? 'text-red-600' : daysUntilDue <= 3 ? 'text-orange-600' : 'text-gray-600'}`}>
                          {isOverdue ? `Overdue by ${Math.abs(daysUntilDue)} days` : `${daysUntilDue} days left`}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-gray-600">Points</div>
                      <div className="font-semibold text-gray-900">
                        {assignment.grade !== null ? `${assignment.grade}/${assignment.points}` : assignment.points}
                      </div>
                      {assignment.grade !== null && (
                        <div className="text-xs text-gray-600">
                          {((assignment.grade / assignment.points) * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>

                  {assignment.submitted_at && (
                    <div className="flex items-center gap-2 text-sm">
                      <Upload className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="text-gray-600">Submitted</div>
                        <div className="font-semibold text-gray-900">
                          {new Date(assignment.submitted_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(assignment.submitted_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {assignment.feedback && (
                  <div className="mb-4 p-4 bg-blue-50/50 border border-blue-200 rounded-xl">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Instructor Feedback:</p>
                    <p className="text-sm text-blue-800">{assignment.feedback}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {assignment.status === 'pending' && (
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Submit Assignment
                    </button>
                  )}
                  {assignment.submission_file && (
                    <button className="px-6 py-2 backdrop-blur-xl bg-white/60 border border-white/40 text-gray-700 rounded-xl font-semibold hover:bg-white/80 transition-all flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      View Submission
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {selectedAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => !submitting && setSelectedAssignment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl backdrop-blur-3xl bg-white/95 rounded-3xl p-8 border border-white/40 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Submit Assignment</h3>
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">{selectedAssignment.title}</h4>
                <p className="text-sm text-gray-600">{selectedAssignment.course_name}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Your Work
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all"
                >
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <Paperclip className="w-8 h-8 text-blue-500" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, ZIP (Max 10MB)</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.zip,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedAssignment(null)}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit(selectedAssignment.id)}
                  disabled={submitting || !uploadedFile}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssignmentsPage;
