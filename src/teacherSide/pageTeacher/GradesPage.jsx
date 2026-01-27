import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Search, BookOpen, Download, Plus, X, Save, Loader } from 'lucide-react';
import { fetchTeacherGrades, fetchTeacherCourses, createTeacherGrade, fetchCourseStudents } from '../../api/teacher_api';

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gradesRes, coursesRes] = await Promise.all([
        fetchTeacherGrades(),
        fetchTeacherCourses()
      ]);
      setGrades(gradesRes.data?.data || []);
      setCourses(coursesRes.data?.data || []);
    } catch (error) {
      console.error('Failed to load grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrades = selectedCourseId === 'all'
    ? grades
    : grades.filter(g => g.course_id == selectedCourseId);

  const getGradeColor = (grade) => {
    if (grade === 'A' || grade === 'B') return 'text-green-600 bg-green-100';
    if (grade === 'C' || grade === 'D') return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Grades</h1>
          <p className="text-gray-600">Track student academic performance</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Post Grade</span>
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="max-w-xs w-full px-6 py-3 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          <option value="all">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg overflow-hidden"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/40 border-b border-white/40">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assignment</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Score</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {filteredGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{g.student_name}</td>
                    <td className="px-6 py-4 text-gray-600">{g.course_name}</td>
                    <td className="px-6 py-4 text-gray-600">{g.assignment}</td>
                    <td className="px-6 py-4 text-center text-gray-800">{g.score}/{g.total_points}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getGradeColor(g.grade)}`}>
                        {g.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredGrades.length === 0 && (
              <div className="p-8 text-center text-gray-500 italic">No grades found.</div>
            )}
          </div>
        )}
      </motion.div>

      {/* Add Grade Modal */}
      <AnimatePresence>
        {showAddModal && (
          <PostGradeModal
            courses={courses}
            onClose={() => setShowAddModal(false)}
            onCreated={loadData}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const PostGradeModal = ({ courses, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    course_id: '',
    student_id: '',
    assignment_name: '',
    score: '',
    total_points: 100,
    feedback: ''
  });

  useEffect(() => {
    if (formData.course_id) {
      fetchCourseStudents(formData.course_id).then(res => setStudents(res.data?.data || []));
    }
  }, [formData.course_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTeacherGrade(formData);
      onCreated();
      onClose();
    } catch (error) {
      alert('Failed to save grade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Post Student Grade</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <select required value={formData.course_id} onChange={e => setFormData({ ...formData, course_id: e.target.value })}
            className="w-full p-3 rounded-xl bg-gray-50 border">
            <option value="">Select Course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select required value={formData.student_id} onChange={e => setFormData({ ...formData, student_id: e.target.value })}
            className="w-full p-3 rounded-xl bg-gray-50 border" disabled={!formData.course_id}>
            <option value="">Select Student</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.student_id})</option>)}
          </select>
          <input required placeholder="Assignment Name" value={formData.assignment_name} onChange={e => setFormData({ ...formData, assignment_name: e.target.value })}
            className="w-full p-3 rounded-xl bg-gray-50 border" />
          <div className="flex gap-4">
            <input required type="number" placeholder="Score" value={formData.score} onChange={e => setFormData({ ...formData, score: e.target.value })}
              className="flex-1 p-3 rounded-xl bg-gray-50 border" />
            <input required type="number" placeholder="Total" value={formData.total_points} onChange={e => setFormData({ ...formData, total_points: e.target.value })}
              className="flex-1 p-3 rounded-xl bg-gray-50 border" />
          </div>
          <button disabled={loading} type="submit" className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold">
            {loading ? 'Saving...' : 'Submit Grade'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GradesPage;
