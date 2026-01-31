import { motion } from "framer-motion";
import { deleteGrade } from "../../api/admin_course_api.jsx";
import {
  Award,
  Trash2,
  Edit,
  User,
  Hash,
  BookOpen,
  FileText,
} from "lucide-react";
import { useState } from "react";
import Alert from "../../gobalConponent/Alert.jsx";
import ConfirmDialog from "../../gobalConponent/ConfirmDialog.jsx";
import { AnimatePresence } from "framer-motion";

/* ================== ANIMATION VARIANTS ================== */

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  row: {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  },
};

/* ================== COMPONENT ================== */

const GradesList = ({ grades, onEdit, onRefresh }) => {
  const [confirm, setConfirm] = useState({ show: false, id: null });
  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });

  const handleDelete = (id) => {
    setConfirm({ show: true, id });
  };

  const executeDelete = async () => {
    if (!confirm.id) return;

    try {
      await deleteGrade(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to delete grade:", err);
      setAlert({ show: true, message: err.response?.data?.message || "Failed to delete grade", type: "error" });
    } finally {
      setConfirm({ show: false, id: null });
    }
  };

  return (
    <motion.div
      variants={animations.fadeUp}
      initial="hidden"
      animate="show"
      className="rounded-2xl bg-white/40 border border-white/40 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Grades</h3>
        </div>
        <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1.5 rounded-full font-semibold">
          {grades.length} Total
        </span>
      </div>

      {grades.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {grades.map((grade, index) => (
                <GradeRow
                  key={grade.id}
                  grade={grade}
                  index={index}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {alert.show && (
          <div className="fixed top-20 right-5 z-[9999] w-80">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ ...alert, show: false })}
            />
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={confirm.show}
        title="Confirm Delete"
        message="Are you sure you want to delete this grade? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setConfirm({ show: false, id: null })}
        confirmText="Delete"
        type="danger"
      />
    </motion.div>
  );
};

/* ================== SUB-COMPONENTS ================== */

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
      <Award className="w-12 h-12 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No grades yet</p>
    <p className="text-sm text-gray-400 mt-1">Create grades to track student performance</p>
  </motion.div>
);

const GradeRow = ({ grade, index, onEdit, onDelete }) => {
  const getGradeColor = (letterGrade) => {
    const grade = letterGrade?.toUpperCase();
    if (grade === 'A' || grade === 'A+') return 'green';
    if (grade === 'B' || grade === 'B+') return 'blue';
    if (grade === 'C' || grade === 'C+') return 'yellow';
    if (grade === 'D') return 'orange';
    return 'red';
  };

  const gradeColor = getGradeColor(grade.letter_grade);

  return (
    <motion.tr
      variants={animations.row}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.05 }}
      className="hover:bg-blue-50/30 transition-colors duration-200"
    >
      {/* Index */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Hash className="w-4 h-4 text-gray-400 mr-1" />
          <span className="text-sm font-medium text-gray-900">{index + 1}</span>
        </div>
      </td>

      {/* Student */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden flex items-center justify-center border border-white/40">
            {grade.student_avatar ? (
              <img src={grade.student_avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {grade.student?.name || grade.student_name || `Student #${grade.student_id}`}
            </div>
          </div>
        </div>
      </td>

      {/* Course */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-gray-400" />
          <span className="text-sm text-gray-900">
            {grade.course?.title || grade.course_name || `Course #${grade.course_id}`}
          </span>
        </div>
      </td>

      {/* Assignment */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600">
          {grade.assignment_name || "-"}
        </div>
      </td>

      {/* Score */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {grade.score}/{grade.total_points}
        </div>
      </td>

      {/* Grade */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-xs bg-${gradeColor}-100 text-${gradeColor}-600 px-2.5 py-1 rounded-full font-medium`}>
            <Award className="w-3 h-3" />
            {grade.letter_grade} ({grade.grade_point})
          </span>
        </div>
      </td>

      {/* Semester */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600">
          {grade.semester} {grade.academic_year}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(grade)}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Edit Grade"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(grade.id)}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
            title="Delete Grade"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default GradesList;
