import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Plus, Loader } from 'lucide-react';
import { fetchTeacherGrades, fetchTeacherCourses, fetchCourseStudents } from '../../api/teacher_api';
import FormModal from '../../Components/FormModal';
import GradeForm from '../ConponentsTeacher/GradeForm';

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

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

      // Load students for the first course initially if needed,
      // but GradeForm handles student fetching internally if we pass the course_id.
      // However, GradeForm in ConponentsTeacher seems to expect students as props.
      if (coursesRes.data?.data?.length > 0) {
        const studentRes = await fetchCourseStudents(coursesRes.data.data[0].id);
        setStudents(studentRes.data?.data || []);
      }
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

  const handleOpenAddModal = () => {
    setEditingGrade(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (grade) => {
    setEditingGrade(grade);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen px-4 md:px-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Grades</h1>
          <p className="text-gray-600">Track student academic performance</p>
        </div>
        <button
          onClick={handleOpenAddModal}
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
          className="max-w-xs w-full px-6 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-sm"
        >
          <option value="all">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name || c.course_name}</option>)}
        </select>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assignment</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Score</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Grade</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{g.student_name}</td>
                    <td className="px-6 py-4 text-gray-600">{g.course_name}</td>
                    <td className="px-6 py-4 text-gray-600">{g.assignment || g.assignment_name}</td>
                    <td className="px-6 py-4 text-center text-gray-800">{g.score}/{g.total_points}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getGradeColor(g.grade || g.letter_grade)}`}>
                        {g.grade || g.letter_grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(g)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredGrades.length === 0 && (
              <div className="p-12 text-center text-gray-400 italic font-sans">No grades found.</div>
            )}
          </div>
        )}
      </motion.div>

      {/* Form Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingGrade ? "Edit Student Grade" : "Post Student Grade"}
      >
        <GradeForm
          students={students}
          courses={courses}
          editingGrade={editingGrade}
          onUpdate={() => {
            loadData();
            setShowAddModal(false);
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </FormModal>
    </div>
  );
};

export default GradesPage;
