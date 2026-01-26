import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  TrendingUp,
  BookOpen,
  Download,
  Loader,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar
} from 'lucide-react';
import { fetchStudentGrades, fetchGPA, downloadTranscript } from '../../api/grade_api';

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [gpaData, setGpaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('all');

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      setLoading(true);
      const [gradesRes, gpaRes] = await Promise.all([
        fetchStudentGrades().catch(() => ({ data: { data: [] } })),
        fetchGPA().catch(() => ({ data: null }))
      ]);

      setGrades(gradesRes.data?.data?.length > 0 ? gradesRes.data.data : []);
      setGpaData(gpaRes.data || null);
    } catch (error) {
      console.error('Failed to load grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTranscript = async () => {
    try {
      const response = await downloadTranscript();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transcript.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download transcript:', error);
    }
  };

  const getGradeColor = (grade) => {
    const gradeMap = {
      'A': 'from-green-500 to-emerald-500',
      'A-': 'from-green-400 to-emerald-400',
      'B+': 'from-blue-500 to-cyan-500',
      'B': 'from-blue-400 to-cyan-400',
      'B-': 'from-blue-300 to-cyan-300',
      'C+': 'from-yellow-500 to-orange-500',
      'C': 'from-yellow-400 to-orange-400',
      'C-': 'from-yellow-300 to-orange-300',
      'D': 'from-red-400 to-pink-400',
      'F': 'from-red-500 to-pink-500'
    };
    return gradeMap[grade] || 'from-gray-400 to-gray-500';
  };

  const filteredGrades = selectedSemester === 'all'
    ? grades
    : grades.filter(g => g.semester === selectedSemester);

  const semesters = ['all', ...new Set(grades.map(g => g.semester))];

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
      {/* GPA Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Current GPA</p>
              <p className="text-3xl font-bold">{gpaData?.current_gpa?.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Award className="w-8 h-8 text-white" />
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
              <p className="text-sm opacity-90 mb-1">Cumulative GPA</p>
              <p className="text-3xl font-bold">{gpaData?.cumulative_gpa?.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
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
              <p className="text-sm opacity-90 mb-1">Credits Earned</p>
              <p className="text-3xl font-bold">{gpaData?.credits_earned}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Total Credits</p>
              <p className="text-3xl font-bold">{gpaData?.total_credits}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-end gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-600" />
            Academic Record
          </h2>
          <p className="text-gray-600 mt-1 font-medium">View your grades and download transcripts</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-2.5 rounded-xl backdrop-blur-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-amber-500 outline-none font-medium text-gray-700 cursor-pointer hover:bg-white/80 transition-all shadow-sm"
          >
            {semesters.map(sem => (
              <option key={sem} value={sem}>
                {sem === 'all' ? 'All Semesters' : sem}
              </option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadTranscript}
            className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm flex items-center gap-2 group"
          >
            <Download className="w-5 h-5 group-hover:text-blue-500" />
            Transcript
          </motion.button>
        </div>
      </motion.div>

      {/* Grades Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/60 rounded-2xl border border-white/40 shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <th className="px-6 py-4 text-left font-semibold">Course Code</th>
                <th className="px-6 py-4 text-left font-semibold">Course Name</th>
                <th className="px-6 py-4 text-left font-semibold">Instructor</th>
                <th className="px-6 py-4 text-center font-semibold">Credits</th>
                <th className="px-6 py-4 text-center font-semibold">Grade</th>
                <th className="px-6 py-4 text-center font-semibold">Points</th>
                <th className="px-6 py-4 text-left font-semibold">Semester</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-semibold">No grades available</p>
                    <p className="text-sm">Grades will appear here once posted</p>
                  </td>
                </tr>
              ) : (
                filteredGrades.map((grade, index) => (
                  <motion.tr
                    key={grade.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/20 hover:bg-white/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-blue-600">{grade.course_code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{grade.course_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700">{grade.instructor}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-semibold text-gray-900">{grade.credits}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gradient-to-r ${getGradeColor(grade.grade)} text-white font-bold shadow-md`}>
                        {grade.grade}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-semibold text-gray-900">{grade.grade_point?.toFixed(1)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4" />
                        {grade.semester}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Summary */}
      {filteredGrades.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Grade Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['A', 'B+', 'B', 'C+', 'C'].map((gradeLevel) => {
              const count = filteredGrades.filter(g => g.grade?.startsWith(gradeLevel)).length;
              const percentage = (count / filteredGrades.length) * 100;
              return (
                <div key={gradeLevel} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${getGradeColor(gradeLevel)} text-white font-bold text-xl mb-2 shadow-lg`}>
                    {gradeLevel}
                  </div>
                  <div className="text-sm text-gray-600">
                    {count} course{count !== 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-gray-500">{percentage.toFixed(0)}%</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GradesPage;
